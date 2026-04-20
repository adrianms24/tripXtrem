import type { VercelRequest, VercelResponse } from '@vercel/node';

// Proxy para Google Places Details (Places API New).
// Devuelve datos completos de un place_id: dirección formateada, coords,
// componentes de dirección (ciudad, país), rating, número de reviews, teléfono,
// website, horario y hasta 3 URLs de foto.
//
// GET /api/places-details?placeId=ChIJ...&session=<uuid>&lang=es

const KEY = process.env.GOOGLE_MAPS_API_KEY_BACKEND || process.env.GOOGLE_MAPS_API_KEY;

const FIELD_MASK = [
  'id',
  'displayName',
  'formattedAddress',
  'addressComponents',
  'location',
  'rating',
  'userRatingCount',
  'internationalPhoneNumber',
  'nationalPhoneNumber',
  'websiteUri',
  'businessStatus',
  'regularOpeningHours',
  'primaryType',
  'primaryTypeDisplayName',
  'types',
  'photos',
  'googleMapsUri',
].join(',');

function extractComponent(components: any[], type: string): string | null {
  const c = components?.find((cc) => cc.types?.includes(type));
  return c?.longText || c?.shortText || null;
}

function extractComponentShort(components: any[], type: string): string | null {
  const c = components?.find((cc) => cc.types?.includes(type));
  return c?.shortText || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!KEY) return res.status(500).json({ error: 'Google Maps not configured' });

  const placeId = typeof req.query.placeId === 'string' ? req.query.placeId.trim() : '';
  const sessionToken = typeof req.query.session === 'string' ? req.query.session : undefined;
  const lang = (typeof req.query.lang === 'string' ? req.query.lang : 'es').slice(0, 5);

  if (!placeId || placeId.length > 256) return res.status(400).json({ error: 'placeId inválido' });

  try {
    const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`);
    url.searchParams.set('languageCode', lang);
    if (sessionToken) url.searchParams.set('sessionToken', sessionToken);

    const r = await fetch(url.toString(), {
      headers: {
        'X-Goog-Api-Key': KEY,
        'X-Goog-FieldMask': FIELD_MASK,
      },
    });
    const data: any = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error('[places-details] google error:', data);
      return res.status(502).json({ error: 'Places API error' });
    }

    const components = data.addressComponents || [];
    const photos = Array.isArray(data.photos) ? data.photos.slice(0, 3) : [];
    // Generar URLs de foto (valid 1 día) — se firman via Google Places Photo API
    const photoUrls = photos.map((p: any) =>
      `https://places.googleapis.com/v1/${p.name}/media?maxWidthPx=1200&key=${KEY}`
    );

    const normalized = {
      placeId: data.id,
      name: data.displayName?.text,
      formattedAddress: data.formattedAddress,
      lat: data.location?.latitude,
      lng: data.location?.longitude,
      country: extractComponentShort(components, 'country'),
      countryName: extractComponent(components, 'country'),
      city:
        extractComponent(components, 'locality') ||
        extractComponent(components, 'postal_town') ||
        extractComponent(components, 'administrative_area_level_2'),
      region: extractComponent(components, 'administrative_area_level_1'),
      postalCode: extractComponent(components, 'postal_code'),
      rating: data.rating,
      reviewsCount: data.userRatingCount,
      phone: data.internationalPhoneNumber || data.nationalPhoneNumber,
      website: data.websiteUri,
      businessStatus: data.businessStatus,
      primaryType: data.primaryTypeDisplayName?.text || data.primaryType,
      types: data.types || [],
      openingHours: data.regularOpeningHours?.weekdayDescriptions || null,
      photoUrls,
      googleMapsUrl: data.googleMapsUri,
    };

    // Cache fuerte: Place Details cambia poco
    res.setHeader('Cache-Control', 'private, max-age=86400');
    return res.status(200).json({ ok: true, place: normalized });
  } catch (err: any) {
    console.error('[places-details] error:', err?.message || err);
    return res.status(500).json({ error: 'Details failed' });
  }
}
