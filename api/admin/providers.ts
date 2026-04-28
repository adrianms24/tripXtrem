import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { requireAdmin, methodNotAllowed } from '../_admin-auth';

const DATABASE_URL = process.env.DATABASE_URL;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (methodNotAllowed(req, res, ['GET', 'PATCH'])) return;
  if (!requireAdmin(req, res)) return;
  if (!DATABASE_URL) return res.status(503).json({ error: 'DB not configured' });

  const sql = neon(DATABASE_URL);

  if (req.method === 'GET') {
    const status = typeof req.query.status === 'string' ? req.query.status : null;
    try {
      const rows = status
        ? await sql`SELECT id, slug, name, email, country, city, status, verified,
                    formatted_address, lat, lng, google_rating, created_at
                    FROM providers WHERE status = ${status}
                    ORDER BY created_at DESC LIMIT 500`
        : await sql`SELECT id, slug, name, email, country, city, status, verified,
                    formatted_address, lat, lng, google_rating, created_at
                    FROM providers
                    ORDER BY created_at DESC LIMIT 500`;
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ ok: true, items: rows });
    } catch (err: any) {
      console.error('[admin/providers GET]', err?.message?.slice(0,200));
      return res.status(500).json({ error: 'Error fetching providers' });
    }
  }

  // PATCH → cambiar status
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const id = parseInt(String(body.id || 0), 10);
    const status = String(body.status || '');
    const valid = ['pending','approved','rejected','suspended'];
    if (!id || !valid.includes(status)) return res.status(400).json({ error: 'Datos inválidos' });
    await sql`UPDATE providers SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;
    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('[admin/providers PATCH]', err?.message?.slice(0,200));
    return res.status(500).json({ error: 'Error updating provider' });
  }
}
