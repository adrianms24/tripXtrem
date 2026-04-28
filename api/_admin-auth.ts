import type { VercelRequest, VercelResponse } from '@vercel/node';
import { timingSafeEqual } from 'crypto';

// Constant-time token comparison to prevent timing attacks
export function tokenMatches(provided: string | undefined, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// Verify admin token from Authorization: Bearer header
// Returns true if authenticated, otherwise sends 401 and returns false
export function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || expected.length < 16) {
    res.status(500).json({ error: 'Admin token not configured' });
    return false;
  }
  const auth = (req.headers.authorization || '').toString();
  const m = /^Bearer\s+(.+)$/i.exec(auth);
  const token = m ? m[1].trim() : '';
  if (!tokenMatches(token, expected)) {
    res.setHeader('WWW-Authenticate', 'Bearer realm="admin"');
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

export function methodNotAllowed(req: VercelRequest, res: VercelResponse, allowed: string[]): boolean {
  if (!allowed.includes(req.method || '')) {
    res.setHeader('Allow', allowed.join(', '));
    res.status(405).json({ error: 'Method not allowed' });
    return true;
  }
  return false;
}

export function escSlug(s: string, max = 80): string {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max);
}
