import type { VercelRequest, VercelResponse } from '@vercel/node';

// Config público seguro para el cliente.
// Solo expone claves restringidas por referrer HTTP (seguras en frontend).
// La key de backend NUNCA se devuelve aquí.

const FRONTEND_KEY =
  process.env.GOOGLE_MAPS_API_KEY_FRONTEND ||
  process.env.GOOGLE_MAPS_API_KEY ||
  '';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600');
  return res.status(200).json({
    ok: true,
    googleMapsKey: FRONTEND_KEY,
  });
}
