import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
const VALID_CATS = new Set(['Agua', 'Aire', 'Nieve', 'Tierra']);
const SAFE_ID_RE = /^[A-Z0-9 _-]{1,64}$/i;
const ISO2_RE = /^[A-Z]{2}$/i;

function pickString(v: unknown, maxLen: number, re?: RegExp): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  if (!t || t.length > maxLen) return null;
  if (re && !re.test(t)) return null;
  return t;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!DATABASE_URL) {
    return res.status(503).json({ error: 'Service unavailable' });
  }

  // Stricter query validation
  const rawCat = pickString(req.query.category, 16);
  const category = rawCat && VALID_CATS.has(rawCat) ? rawCat : null;
  const sport = pickString(req.query.sport, 64, SAFE_ID_RE);
  const rawCountry = pickString(req.query.country, 2);
  const country = rawCountry && ISO2_RE.test(rawCountry) ? rawCountry.toUpperCase() : null;

  try {
    const sql = neon(DATABASE_URL);
    const rows = await sql`
      SELECT
        e.id, e.sport, e.category, e.icon, e.title, e.description,
        e.location, e.country, e.lat, e.lng,
        e.difficulty AS diff, e.duration AS dur,
        e.price_eur AS price, e.old_price_eur AS old_price,
        e.spots, e.rating, e.reviews_count AS reviews,
        e.image_url AS img, e.extras, e.badge,
        p.name AS provider_name, p.slug AS provider_slug
      FROM experiences e
      LEFT JOIN providers p ON e.provider_id = p.id
      WHERE e.active = true
        AND (p.status IS NULL OR p.status = 'approved')
        AND (${category === null}::boolean OR e.category = ${category})
        AND (${sport === null}::boolean OR UPPER(e.sport) = UPPER(${sport}))
        AND (${country === null}::boolean OR e.country = ${country})
      ORDER BY e.rating DESC NULLS LAST, e.created_at DESC
      LIMIT 500
    `;

    // Cache 60s edge + stale-while-revalidate
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.setHeader('Vary', 'Accept-Encoding');
    return res.status(200).json({ ok: true, count: rows.length, experiences: rows });
  } catch (err: any) {
    // Minimal error logging — no stack traces in prod
    const msg = err?.message || 'unknown';
    console.error('[experiences]', msg.slice(0, 200));
    return res.status(500).json({ error: 'Error fetching experiences' });
  }
}
