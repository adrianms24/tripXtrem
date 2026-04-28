import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin, methodNotAllowed } from '../_admin-auth';

// Comprueba si el token es válido. Usado al inicio del admin para validar
// el token guardado en localStorage.
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (methodNotAllowed(req, res, ['GET'])) return;
  if (!requireAdmin(req, res)) return;
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ ok: true });
}
