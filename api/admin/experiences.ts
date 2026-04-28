import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { requireAdmin, methodNotAllowed, escSlug } from '../_admin-auth';

const DATABASE_URL = process.env.DATABASE_URL;
const VALID_CATS = new Set(['Agua', 'Aire', 'Nieve', 'Tierra']);
const VALID_DIFF = new Set(['Baja', 'Media', 'Alta']);
const VALID_BADGE = new Set(['hot', 'new', 'popular']);

// GET    /api/admin/experiences           → list (con providers)
// POST   /api/admin/experiences           → crear
// PATCH  /api/admin/experiences           → actualizar (body.id)
// DELETE /api/admin/experiences?id=N      → soft delete (active=false)

function pickStr(v: unknown, max: number, fallback: string | null = null): string | null {
  if (typeof v !== 'string') return fallback;
  const t = v.trim();
  return t ? t.slice(0, max) : fallback;
}
function pickNum(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (methodNotAllowed(req, res, ['GET', 'POST', 'PATCH', 'DELETE'])) return;
  if (!requireAdmin(req, res)) return;
  if (!DATABASE_URL) return res.status(503).json({ error: 'DB not configured' });

  const sql = neon(DATABASE_URL);

  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT e.id, e.slug, e.sport, e.category, e.icon, e.title, e.description,
               e.location, e.country, e.lat, e.lng, e.difficulty, e.duration,
               e.price_eur, e.old_price_eur, e.spots, e.rating, e.reviews_count,
               e.image_url, e.extras, e.badge, e.active, e.created_at, e.updated_at,
               e.provider_id, p.name AS provider_name, p.slug AS provider_slug, p.status AS provider_status
        FROM experiences e
        LEFT JOIN providers p ON e.provider_id = p.id
        ORDER BY e.created_at DESC
        LIMIT 500
      `;
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ ok: true, items: rows });
    } catch (err: any) {
      console.error('[admin/experiences GET]', err?.message?.slice(0,200));
      return res.status(500).json({ error: 'Error fetching experiences' });
    }
  }

  if (req.method === 'DELETE') {
    const id = parseInt(String(req.query.id || 0), 10);
    if (!id) return res.status(400).json({ error: 'id requerido' });
    try {
      await sql`UPDATE experiences SET active = false, updated_at = NOW() WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    } catch (err: any) {
      console.error('[admin/experiences DELETE]', err?.message?.slice(0,200));
      return res.status(500).json({ error: 'Error deleting' });
    }
  }

  // POST or PATCH — body parse
  let body: any;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {}); }
  catch { return res.status(400).json({ error: 'Body inválido' }); }

  // Sanitize fields
  const provider_id = parseInt(String(body.provider_id || 0), 10) || null;
  const sport = pickStr(body.sport, 64);
  const category = pickStr(body.category, 16);
  const icon = pickStr(body.icon, 16, '🌍');
  const title = pickStr(body.title, 200);
  const description = pickStr(body.description, 2000);
  const location = pickStr(body.location, 200);
  const country = pickStr(body.country, 2);
  const lat = pickNum(body.lat);
  const lng = pickNum(body.lng);
  const difficulty = pickStr(body.difficulty, 16);
  const duration = pickStr(body.duration, 64);
  const price_eur = pickNum(body.price_eur);
  const old_price_eur = pickNum(body.old_price_eur);
  const spots = pickNum(body.spots) ?? 0;
  const image_url = pickStr(body.image_url, 500);
  const badge = pickStr(body.badge, 16);
  const extras = Array.isArray(body.extras) ? body.extras.slice(0,10).map(String) : null;
  const active = body.active === undefined ? true : !!body.active;

  // Validate enums
  if (category && !VALID_CATS.has(category)) return res.status(400).json({ error: 'Categoría inválida' });
  if (difficulty && !VALID_DIFF.has(difficulty)) return res.status(400).json({ error: 'Dificultad inválida' });
  if (badge && !VALID_BADGE.has(badge)) return res.status(400).json({ error: 'Badge inválido' });

  if (req.method === 'POST') {
    if (!sport || !category || !provider_id) {
      return res.status(400).json({ error: 'sport, category y provider_id son requeridos' });
    }
    // Slug único
    let baseSlug = escSlug((sport + '-' + (location || '') + '-' + Date.now()).toString(), 100);
    let slug = baseSlug;
    try {
      const result = await sql`
        INSERT INTO experiences (
          provider_id, slug, sport, category, icon, title, description,
          location, country, lat, lng, difficulty, duration,
          price_eur, old_price_eur, spots, image_url, extras, badge, active
        ) VALUES (
          ${provider_id}, ${slug}, ${sport}, ${category}, ${icon}, ${title}, ${description},
          ${location}, ${country}, ${lat}, ${lng}, ${difficulty}, ${duration},
          ${price_eur}, ${old_price_eur}, ${spots}, ${image_url},
          ${extras ? JSON.stringify(extras) : null}, ${badge}, ${active}
        )
        RETURNING id, slug
      ` as { id: number; slug: string }[];
      return res.status(201).json({ ok: true, experience: result[0] });
    } catch (err: any) {
      console.error('[admin/experiences POST]', err?.message?.slice(0,200));
      return res.status(500).json({ error: 'Error creating experience' });
    }
  }

  // PATCH
  const id = parseInt(String(body.id || 0), 10);
  if (!id) return res.status(400).json({ error: 'id requerido' });
  try {
    await sql`
      UPDATE experiences SET
        provider_id = COALESCE(${provider_id}, provider_id),
        sport       = COALESCE(${sport}, sport),
        category    = COALESCE(${category}, category),
        icon        = COALESCE(${icon}, icon),
        title       = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        location    = COALESCE(${location}, location),
        country     = COALESCE(${country}, country),
        lat         = COALESCE(${lat}, lat),
        lng         = COALESCE(${lng}, lng),
        difficulty  = COALESCE(${difficulty}, difficulty),
        duration    = COALESCE(${duration}, duration),
        price_eur   = COALESCE(${price_eur}, price_eur),
        old_price_eur = COALESCE(${old_price_eur}, old_price_eur),
        spots       = COALESCE(${spots}, spots),
        image_url   = COALESCE(${image_url}, image_url),
        extras      = COALESCE(${extras ? JSON.stringify(extras) : null}, extras),
        badge       = COALESCE(${badge}, badge),
        active      = COALESCE(${body.active === undefined ? null : !!body.active}, active),
        updated_at  = NOW()
      WHERE id = ${id}
    `;
    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('[admin/experiences PATCH]', err?.message?.slice(0,200));
    return res.status(500).json({ error: 'Error updating' });
  }
}
