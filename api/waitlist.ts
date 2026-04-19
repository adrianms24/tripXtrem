import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';
import { createHash } from 'crypto';

const DATABASE_URL = process.env.DATABASE_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hola@tripxtrem.com';
const RATE_LIMIT_PER_HOUR = parseInt(process.env.WAITLIST_RATE_LIMIT_PER_HOUR || '5', 10);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  name?: string;
  email?: string;
  activity?: string | null;
  postal_code?: string | null;
  gdpr?: boolean;
  company?: string; // honeypot
  source?: string;
  ref_loc?: string | null;
};

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + (process.env.IP_SALT || 'tx-salt')).digest('hex').slice(0, 32);
}

function getClientIp(req: VercelRequest): string {
  const xff = (req.headers['x-forwarded-for'] as string) || '';
  return xff.split(',')[0].trim() || (req.socket?.remoteAddress ?? 'unknown');
}

function welcomeEmail(name: string, activity: string | null): string {
  const act = activity ? `<b>${escape(activity)}</b>` : 'deportes extremos';
  return `<!DOCTYPE html><html lang="es"><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table role="presentation" style="width:100%;max-width:560px;margin:0 auto;padding:32px 20px;" cellpadding="0" cellspacing="0">
  <tr><td style="background:#fff;border-radius:18px;padding:36px 32px;box-shadow:0 2px 12px rgba(0,0,0,.04);">
    <div style="display:inline-block;background:#dcfce7;color:#16a34a;font-size:11px;font-weight:800;padding:5px 14px;border-radius:100px;letter-spacing:.5px;text-transform:uppercase;margin-bottom:18px;">🚀 Ya estás dentro</div>
    <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:900;color:#111827;margin:0 0 14px;line-height:1.2;">Hola ${escape(name)}, gracias por apuntarte 🙌</h1>
    <p style="font-size:15px;color:#6b7280;line-height:1.6;margin:0 0 18px;">Eres de los primeros en nuestra lista de <b style="color:#111827;">TripXtrem</b>, el marketplace Nº1 de turismo de aventura en España.</p>
    <p style="font-size:15px;color:#6b7280;line-height:1.6;margin:0 0 22px;">En cuanto abramos reservas para ${act}, te avisaremos. Sin spam, sin coste. Cancelación en 1 clic cuando quieras.</p>
    <div style="background:#f9fafb;border-radius:12px;padding:18px;margin-bottom:22px;">
      <div style="font-size:12px;font-weight:700;color:#111827;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;">¿Qué sigue?</div>
      <ul style="margin:0;padding-left:20px;font-size:14px;color:#6b7280;line-height:1.7;">
        <li>Te enviaremos <b style="color:#111827;">acceso anticipado</b> con precios de lanzamiento.</li>
        <li>Descuento exclusivo <b style="color:#111827;">-15%</b> para los primeros 100 reservas.</li>
        <li>Sin reenvíos molestos, solo lo importante.</li>
      </ul>
    </div>
    <p style="font-size:13px;color:#9ca3af;line-height:1.6;margin:0;">Si no te apuntaste tú, ignora este email y tu dirección se borrará automáticamente.</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
    <p style="font-size:12px;color:#9ca3af;margin:0;text-align:center;">TripXtrem · Marketplace de turismo de aventura<br><a href="https://tripxtrem.com" style="color:#22c55e;text-decoration:none;">tripxtrem.com</a></p>
  </td></tr>
</table></body></html>`;
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'Servicio no disponible' });
  }

  const body: Body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  // Honeypot — bots rellenan "company", humanos no
  if (body.company && body.company.trim() !== '') {
    // Silently accept (return success) to not tip off bot
    return res.status(200).json({ ok: true });
  }

  // Validación
  const name = (body.name || '').trim();
  const email = (body.email || '').trim().toLowerCase();
  if (name.length < 2 || name.length > 80) return res.status(400).json({ error: 'Nombre inválido' });
  if (!EMAIL_RE.test(email) || email.length > 255) return res.status(400).json({ error: 'Email inválido' });
  if (!body.gdpr) return res.status(400).json({ error: 'Debes aceptar la política de privacidad' });

  const activity = body.activity ? String(body.activity).slice(0, 64) : null;
  const postal = body.postal_code ? String(body.postal_code).replace(/[^0-9A-Za-z\- ]/g, '').slice(0, 10) : null;
  const source = body.source ? String(body.source).slice(0, 64) : 'landing';
  const ua = (req.headers['user-agent'] || '').toString().slice(0, 255);
  const ip = getClientIp(req);
  const ipHash = hashIp(ip);

  try {
    const sql = neon(DATABASE_URL);

    // Rate limit: máximo N intentos por IP por hora
    const recent = await sql`
      SELECT COUNT(*)::int AS n FROM waitlist_attempts
      WHERE ip_hash = ${ipHash} AND attempted_at > NOW() - INTERVAL '1 hour'
    ` as { n: number }[];
    if ((recent[0]?.n ?? 0) >= RATE_LIMIT_PER_HOUR) {
      return res.status(429).json({ error: 'Demasiados intentos. Prueba en una hora.' });
    }
    await sql`INSERT INTO waitlist_attempts (ip_hash) VALUES (${ipHash})`;

    // Insert (UPSERT para duplicados graceful)
    const rows = await sql`
      INSERT INTO waitlist (email, name, activity, postal_code, source, ip_hash, user_agent, gdpr_consent)
      VALUES (${email}, ${name}, ${activity}, ${postal}, ${source}, ${ipHash}, ${ua}, true)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, created_at
    ` as { id: number; created_at: Date }[];

    const isNew = rows.length > 0;

    // Email confirmación (solo si es nuevo y hay Resend configurado)
    if (isNew && RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        await resend.emails.send({
          from: `TripXtrem <${FROM_EMAIL}>`,
          to: email,
          subject: '🚀 Estás dentro de TripXtrem — Bienvenido',
          html: welcomeEmail(name, activity),
        });
      } catch (emailErr) {
        console.error('[waitlist] resend failed:', emailErr);
        // No fallar la request si el email no sale
      }
    }

    return res.status(200).json({ ok: true, duplicate: !isNew });
  } catch (err: any) {
    console.error('[waitlist] error:', err?.message || err);
    return res.status(500).json({ error: 'Error al procesar. Intenta de nuevo.' });
  }
}
