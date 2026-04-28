import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { requireAdmin, methodNotAllowed } from '../_admin-auth';

const DATABASE_URL = process.env.DATABASE_URL;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (methodNotAllowed(req, res, ['GET'])) return;
  if (!requireAdmin(req, res)) return;
  if (!DATABASE_URL) return res.status(503).json({ error: 'DB not configured' });

  const limit = Math.min(500, Math.max(10, parseInt(String(req.query.limit || '100'), 10) || 100));
  const offset = Math.max(0, parseInt(String(req.query.offset || '0'), 10) || 0);
  const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : '';

  try {
    const sql = neon(DATABASE_URL);
    const rows = q
      ? await sql`SELECT id, email, name, activity, postal_code, source, created_at FROM waitlist
                  WHERE email ILIKE ${'%'+q+'%'} OR name ILIKE ${'%'+q+'%'} OR activity ILIKE ${'%'+q+'%'}
                  ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
      : await sql`SELECT id, email, name, activity, postal_code, source, created_at FROM waitlist
                  ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: true, items: rows, count: rows.length });
  } catch (err: any) {
    console.error('[admin/waitlist]', err?.message?.slice(0,200));
    res.status(500).json({ error: 'Error fetching waitlist' });
  }
}
