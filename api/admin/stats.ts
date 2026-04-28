import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { requireAdmin, methodNotAllowed } from '../_admin-auth';

const DATABASE_URL = process.env.DATABASE_URL;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (methodNotAllowed(req, res, ['GET'])) return;
  if (!requireAdmin(req, res)) return;
  if (!DATABASE_URL) return res.status(503).json({ error: 'DB not configured' });

  try {
    const sql = neon(DATABASE_URL);
    const [waitlistTotal, waitlistToday, applicationsPending, providersApproved, experiencesActive] = await Promise.all([
      sql`SELECT COUNT(*)::int AS n FROM waitlist`,
      sql`SELECT COUNT(*)::int AS n FROM waitlist WHERE created_at > NOW() - INTERVAL '24 hours'`,
      sql`SELECT COUNT(*)::int AS n FROM partner_applications WHERE status = 'new'`,
      sql`SELECT COUNT(*)::int AS n FROM providers WHERE status = 'approved'`,
      sql`SELECT COUNT(*)::int AS n FROM experiences WHERE active = true`,
    ]) as { n: number }[][];

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      ok: true,
      stats: {
        waitlistTotal: waitlistTotal[0]?.n ?? 0,
        waitlistToday: waitlistToday[0]?.n ?? 0,
        applicationsPending: applicationsPending[0]?.n ?? 0,
        providersApproved: providersApproved[0]?.n ?? 0,
        experiencesActive: experiencesActive[0]?.n ?? 0,
      }
    });
  } catch (err: any) {
    console.error('[admin/stats]', err?.message?.slice(0,200));
    res.status(500).json({ error: 'Error fetching stats' });
  }
}
