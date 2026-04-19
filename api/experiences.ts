import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'Service unavailable' });
  }

  const category = typeof req.query.category === 'string' ? req.query.category : null;
  const sport = typeof req.query.sport === 'string' ? req.query.sport : null;
  const country = typeof req.query.country === 'string' ? req.query.country : null;
  const VALID_CATS = new Set(['Agua', 'Aire', 'Nieve', 'Tierra']);

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
        AND (${category === null || !VALID_CATS.has(category)}::boolean OR e.category = ${category})
        AND (${sport === null}::boolean OR e.sport = ${sport})
        AND (${country === null}::boolean OR e.country = ${country})
      ORDER BY e.rating DESC NULLS LAST, e.created_at DESC
      LIMIT 500
    `;

    // Cache 60s edge
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ ok: true, count: rows.length, experiences: rows });
  } catch (err: any) {
    console.error('[experiences] error:', err?.message || err);
    return res.status(500).json({ error: 'Error fetching experiences' });
  }
}
