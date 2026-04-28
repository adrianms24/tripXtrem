import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';
import { createHash } from 'crypto';

const DATABASE_URL = process.env.DATABASE_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hola@tripxtrem.com';
const PARTNERS_NOTIFY = process.env.PARTNERS_NOTIFY_EMAIL || 'partners@tripxtrem.com';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_CATS = new Set(['Agua', 'Aire', 'Nieve', 'Tierra']);

type Body = {
  company_name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  country?: string;
  city?: string;
  categories?: string[];
  sports?: string;
  description?: string;
  has_insurance?: boolean;
  years_operating?: number;
  gdpr?: boolean;
  company?: string; // honeypot
  // Google Places autofill
  google_place_id?: string;
  google_data?: unknown;
  formatted_address?: string;
  lat?: number;
  lng?: number;
  // Fotos (sólo contador, las fotos en sí se solicitan offline)
  photos_count?: number;
};

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + (process.env.IP_SALT || 'tx-salt')).digest('hex').slice(0, 32);
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

function thanksEmail(contactName: string, companyName: string): string {
  return `<!DOCTYPE html><html lang="es"><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table role="presentation" style="width:100%;max-width:560px;margin:0 auto;padding:32px 20px;" cellpadding="0" cellspacing="0">
  <tr><td style="background:#fff;border-radius:18px;padding:36px 32px;box-shadow:0 2px 12px rgba(0,0,0,.04);">
    <div style="display:inline-block;background:#dcfce7;color:#16a34a;font-size:11px;font-weight:800;padding:5px 14px;border-radius:100px;letter-spacing:.5px;text-transform:uppercase;margin-bottom:18px;">Solicitud recibida</div>
    <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:900;color:#111827;margin:0 0 14px;line-height:1.2;">Hola ${escape(contactName)}, gracias por apuntar a <b>${escape(companyName)}</b></h1>
    <p style="font-size:15px;color:#6b7280;line-height:1.6;margin:0 0 16px;">Hemos recibido la solicitud para que <b style="color:#111827;">${escape(companyName)}</b> forme parte de TripXtrem.</p>
    <div style="background:#f9fafb;border-radius:12px;padding:18px;margin:18px 0;">
      <div style="font-size:12px;font-weight:700;color:#111827;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">Próximos pasos</div>
      <ol style="margin:0;padding-left:20px;font-size:14px;color:#6b7280;line-height:1.7;">
        <li>Revisamos la información (24-48h).</li>
        <li>Te contactamos por email para verificar datos y seguro RC.</li>
        <li>Al aprobar, publicamos tus actividades sin coste de alta.</li>
      </ol>
    </div>
    <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:0;">¿Dudas? Responde a este email.</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
    <p style="font-size:12px;color:#9ca3af;margin:0;text-align:center;">TripXtrem · Marketplace de turismo de aventura<br><a href="https://tripxtrem.com" style="color:#22c55e;text-decoration:none;">tripxtrem.com</a></p>
  </td></tr>
</table></body></html>`;
}

function adminNotify(app: Body, id: number): string {
  const cats = Array.isArray(app.categories) ? app.categories.join(', ') : (app.categories || '');
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:24px;">
<h2>Nueva solicitud de partner #${id}</h2>
<table cellpadding="6" style="border-collapse:collapse;font-size:14px;">
<tr><td><b>Empresa:</b></td><td>${escape(app.company_name || '')}</td></tr>
<tr><td><b>Contacto:</b></td><td>${escape(app.contact_name || '')}</td></tr>
<tr><td><b>Email:</b></td><td>${escape(app.email || '')}</td></tr>
<tr><td><b>Teléfono:</b></td><td>${escape(app.phone || '')}</td></tr>
<tr><td><b>Web:</b></td><td>${escape(app.website || '')}</td></tr>
<tr><td><b>País:</b></td><td>${escape(app.country || '')}</td></tr>
<tr><td><b>Ciudad:</b></td><td>${escape(app.city || '')}</td></tr>
<tr><td><b>Categorías:</b></td><td>${escape(cats)}</td></tr>
<tr><td><b>Deportes:</b></td><td>${escape(app.sports || '')}</td></tr>
<tr><td><b>Seguro RC:</b></td><td>${app.has_insurance ? '✅ Sí' : '❌ No'}</td></tr>
<tr><td><b>Años operando:</b></td><td>${app.years_operating || '-'}</td></tr>
<tr><td><b>Fotos:</b></td><td>${(app as any).photos_count ? `📸 ${(app as any).photos_count} fotos (pídelas por email)` : '— Sin fotos'}</td></tr>
<tr><td valign="top"><b>Descripción:</b></td><td>${escape(app.description || '')}</td></tr>
</table>
${(app as any).photos_count ? '<p style="background:#fef9c3;border:1px solid #fcd34d;padding:10px;border-radius:8px;font-size:13px;color:#78350f;">⚠️ El partner dice tener ' + (app as any).photos_count + ' fotos. <b>Pídeselas por email</b> — el upload de fotos pendiente de integrar storage.</p>' : ''}
</body></html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!DATABASE_URL) return res.status(500).json({ error: 'Service unavailable' });

  const body: Body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  // Honeypot
  if (body.company && body.company.trim() !== '') {
    return res.status(200).json({ ok: true });
  }

  const companyName = (body.company_name || '').trim();
  const contactName = (body.contact_name || '').trim();
  const email = (body.email || '').trim().toLowerCase();
  const country = (body.country || '').trim().toUpperCase().slice(0, 2);
  if (companyName.length < 2) return res.status(400).json({ error: 'Nombre de empresa inválido' });
  if (contactName.length < 2) return res.status(400).json({ error: 'Nombre de contacto inválido' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Email inválido' });
  if (country.length !== 2) return res.status(400).json({ error: 'País inválido (código ISO 2)' });
  if (!body.gdpr) return res.status(400).json({ error: 'Debes aceptar la política de privacidad' });

  const categories = Array.isArray(body.categories)
    ? body.categories.filter((c) => VALID_CATS.has(c)).join(',').slice(0, 60)
    : null;
  const sports = (body.sports || '').toString().slice(0, 300) || null;
  const phone = (body.phone || '').toString().slice(0, 50) || null;
  const website = (body.website || '').toString().slice(0, 255) || null;
  const city = (body.city || '').toString().slice(0, 120) || null;
  const description = (body.description || '').toString().slice(0, 2000) || null;
  const hasInsurance = !!body.has_insurance;
  const years = body.years_operating ? parseInt(String(body.years_operating), 10) : null;

  const xff = (req.headers['x-forwarded-for'] as string) || '';
  const ip = xff.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  const ipHash = hashIp(ip);

  // Google Places autofill (opcional)
  const gPlaceId = typeof body.google_place_id === 'string' ? body.google_place_id.slice(0, 128) : null;
  const gData = body.google_data && typeof body.google_data === 'object' ? body.google_data : null;
  const gAddr = typeof body.formatted_address === 'string' ? body.formatted_address.slice(0, 500) : null;
  const gLat = typeof body.lat === 'number' && Number.isFinite(body.lat) ? body.lat : null;
  const gLng = typeof body.lng === 'number' && Number.isFinite(body.lng) ? body.lng : null;

  // Photos count (las fotos se gestionan offline por ahora)
  const photosCount = typeof (body as any).photos_count === 'number' ? Math.max(0, Math.min(99, (body as any).photos_count)) : 0;

  try {
    const sql = neon(DATABASE_URL);
    const rows = await sql`
      INSERT INTO partner_applications (
        company_name, contact_name, email, phone, website, country, city,
        categories, sports, description, has_insurance, years_operating,
        ip_hash, gdpr_consent,
        google_place_id, google_data, formatted_address, lat, lng
      ) VALUES (
        ${companyName}, ${contactName}, ${email}, ${phone}, ${website}, ${country}, ${city},
        ${categories}, ${sports}, ${description}, ${hasInsurance}, ${years},
        ${ipHash}, true,
        ${gPlaceId}, ${gData ? JSON.stringify(gData) : null}, ${gAddr}, ${gLat}, ${gLng}
      )
      RETURNING id
    ` as { id: number }[];

    const id = rows[0]?.id;

    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      // Confirmación al partner
      resend.emails.send({
        from: `TripXtrem <${FROM_EMAIL}>`,
        to: email,
        subject: '✅ Hemos recibido tu solicitud — TripXtrem Partners',
        html: thanksEmail(contactName, companyName),
      }).catch((e) => console.error('[partner-apply] resend partner:', e));

      // Notificación al admin
      resend.emails.send({
        from: `TripXtrem <${FROM_EMAIL}>`,
        to: PARTNERS_NOTIFY,
        subject: `🔔 Nueva solicitud partner: ${companyName}`,
        html: adminNotify(body, id || 0),
      }).catch((e) => console.error('[partner-apply] resend admin:', e));
    }

    return res.status(200).json({ ok: true, id });
  } catch (err: any) {
    console.error('[partner-apply] error:', err?.message || err);
    return res.status(500).json({ error: 'Error al procesar. Intenta de nuevo.' });
  }
}
