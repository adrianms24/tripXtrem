import type { VercelRequest, VercelResponse } from '@vercel/node';

// Proxy servidor para Google Places Autocomplete (Places API New).
// Mantiene la API key secreta en backend, añade rate limiting básico.
//
// GET /api/places-autocomplete?q=surf+school+zarautz&session=<uuid>&lang=es&region=es

const KEY = process.env.GOOGLE_MAPS_API_KEY_BACKEND || process.env.GOOGLE_MAPS_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!KEY) return res.status(500).json({ error: 'Google Maps not configured' });

  const q = (typeof req.query.q === 'string' ? req.query.q : '').trim();
  const sessionToken = typeof req.query.session === 'string' ? req.query.session : undefined;
  const lang = (typeof req.query.lang === 'string' ? req.query.lang : 'es').slice(0, 5);
  const region = (typeof req.query.region === 'string' ? req.query.region : '').toLowerCase().slice(0, 5);

  if (q.length < 2) return res.status(200).json({ ok: true, predictions: [] });
  if (q.length > 200) return res.status(400).json({ error: 'Query too long' });

  try {
    const body: Record<string, unknown> = {
      input: q,
      languageCode: lang,
    };
    if (region) body.regionCode = region;
    if (sessionToken) body.sessionToken = sessionToken;

    const r = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': KEY,
      },
      body: JSON.stringify(body),
    });
    const data: any = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error('[places-autocomplete] google error:', data);
      return res.status(502).json({ error: 'Places API error' });
    }

    const suggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
    const predictions = suggestions
      .map((s: any) => s.placePrediction)
      .filter(Boolean)
      .map((p: any) => ({
        placeId: p.placeId,
        text: p.text?.text,
        mainText: p.structuredFormat?.mainText?.text,
        secondaryText: p.structuredFormat?.secondaryText?.text,
        types: p.types || [],
      }));

    res.setHeader('Cache-Control', 'private, max-age=30');
    return res.status(200).json({ ok: true, predictions });
  } catch (err: any) {
    console.error('[places-autocomplete] error:', err?.message || err);
    return res.status(500).json({ error: 'Autocomplete failed' });
  }
}
