import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { requireAdmin, methodNotAllowed, escSlug } from '../_admin-auth';

const DATABASE_URL = process.env.DATABASE_URL;

// GET /api/admin/applications              → lista (filtro ?status=new)
// POST /api/admin/applications {action, id} → action: 'approve' | 'reject'
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (methodNotAllowed(req, res, ['GET', 'POST'])) return;
  if (!requireAdmin(req, res)) return;
  if (!DATABASE_URL) return res.status(503).json({ error: 'DB not configured' });

  const sql = neon(DATABASE_URL);

  if (req.method === 'GET') {
    const status = typeof req.query.status === 'string' ? req.query.status : 'new';
    const valid = ['new','contacted','converted','rejected','all'];
    const filter = valid.includes(status) ? status : 'new';
    try {
      const rows = filter === 'all'
        ? await sql`SELECT id, company_name, contact_name, email, phone, website, country, city,
                    sports, description, has_insurance, status, google_place_id, formatted_address,
                    lat, lng, created_at
                    FROM partner_applications ORDER BY created_at DESC LIMIT 200`
        : await sql`SELECT id, company_name, contact_name, email, phone, website, country, city,
                    sports, description, has_insurance, status, google_place_id, formatted_address,
                    lat, lng, created_at
                    FROM partner_applications WHERE status = ${filter}
                    ORDER BY created_at DESC LIMIT 200`;
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ ok: true, items: rows, count: rows.length });
    } catch (err: any) {
      console.error('[admin/applications GET]', err?.message?.slice(0,200));
      return res.status(500).json({ error: 'Error fetching applications' });
    }
  }

  // POST → approve/reject
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const id = parseInt(String(body.id || 0), 10);
    const action = String(body.action || '');
    if (!id || !['approve','reject','contact'].includes(action)) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    if (action === 'reject') {
      await sql`UPDATE partner_applications SET status = 'rejected' WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }
    if (action === 'contact') {
      await sql`UPDATE partner_applications SET status = 'contacted' WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    // approve → crea provider con datos heredados de la application
    const apps = await sql`SELECT * FROM partner_applications WHERE id = ${id}` as any[];
    const app = apps[0];
    if (!app) return res.status(404).json({ error: 'Application not found' });

    // slug único basado en company_name
    let baseSlug = escSlug(app.company_name || ('partner-'+id));
    let slug = baseSlug;
    let n = 1;
    while (true) {
      const existing = await sql`SELECT id FROM providers WHERE slug = ${slug}` as any[];
      if (!existing.length) break;
      slug = baseSlug + '-' + (++n);
    }

    const result = await sql`
      INSERT INTO providers (
        slug, name, email, phone, website, country, city, description,
        google_place_id, google_data, formatted_address, lat, lng,
        verified, status, approved_at, approved_by
      ) VALUES (
        ${slug}, ${app.company_name}, ${app.email}, ${app.phone}, ${app.website},
        ${app.country}, ${app.city}, ${app.description},
        ${app.google_place_id}, ${app.google_data ? JSON.stringify(app.google_data) : null},
        ${app.formatted_address}, ${app.lat}, ${app.lng},
        ${!!app.has_insurance}, 'approved', NOW(), 'admin'
      )
      RETURNING id, slug
    ` as { id: number; slug: string }[];

    await sql`UPDATE partner_applications SET status = 'converted' WHERE id = ${id}`;

    return res.status(200).json({ ok: true, provider: result[0] });
  } catch (err: any) {
    console.error('[admin/applications POST]', err?.message?.slice(0,200));
    return res.status(500).json({ error: 'Error processing action' });
  }
}
