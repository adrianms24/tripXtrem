#!/usr/bin/env node
/**
 * Seed: 2 experiencias de prueba por cada deporte de SPORT_MAP.
 *
 * Genera para cada sport:
 *   • Variante A "Standard" → datos base de SPORT_MAP
 *   • Variante B "Premium"  → mismo deporte, ubicación cercana (offset),
 *                             precio +40 %, título distinto, badge "popular"
 *
 * Uso (PowerShell):
 *   $env:ADMIN_TOKEN="…tu token…"
 *   $env:BASE_URL="https://tripxtrem.com"   # opcional, default tripxtrem.com
 *   $env:PROVIDER_ID="1"                    # opcional; si falta, usa el primero approved
 *   node scripts/seed-tests.mjs
 *
 * Uso (bash):
 *   ADMIN_TOKEN=… BASE_URL=https://tripxtrem.com node scripts/seed-tests.mjs
 *
 * Flags:
 *   --dry-run   no hace POSTs, solo imprime lo que enviaría
 *   --only=SURF,KITESURF   limita a esos deportes
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const BASE_URL = process.env.BASE_URL || 'https://tripxtrem.com';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const PROVIDER_ID_ENV = process.env.PROVIDER_ID ? parseInt(process.env.PROVIDER_ID, 10) : null;

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const onlyArg = args.find(a => a.startsWith('--only='));
const ONLY = onlyArg ? new Set(onlyArg.slice(7).split(',').map(s => s.trim().toUpperCase())) : null;

if (!ADMIN_TOKEN && !DRY) {
  console.error('❌ Falta ADMIN_TOKEN. Exporta la variable y reintenta.');
  process.exit(1);
}

// ─── Extraer SPORT_MAP desde admin.html (single source of truth) ───
function extractSportMap() {
  const html = readFileSync(join(ROOT, 'admin.html'), 'utf8');
  const start = html.indexOf('const SPORT_MAP = {');
  if (start < 0) throw new Error('SPORT_MAP no encontrado en admin.html');
  // localizar el cierre `};` del objeto (primero después del start)
  const objStart = html.indexOf('{', start);
  let depth = 0, end = -1;
  for (let i = objStart; i < html.length; i++) {
    const c = html[i];
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  if (end < 0) throw new Error('No se pudo cerrar SPORT_MAP');
  const objLiteral = html.slice(objStart, end);
  // Strip line comments (// ...) que romperían eval
  const cleaned = objLiteral.replace(/\/\/[^\n]*/g, '');
  // eslint-disable-next-line no-new-func
  const fn = new Function('return ' + cleaned);
  return fn();
}

const SPORT_MAP = extractSportMap();
const sportNames = Object.keys(SPORT_MAP).filter(s => !ONLY || ONLY.has(s));
console.log(`📦 SPORT_MAP cargado: ${Object.keys(SPORT_MAP).length} deportes (procesando ${sportNames.length})`);

// ─── HTTP helpers ───
async function api(path, method = 'GET', body = null) {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: {
      'Authorization': 'Bearer ' + ADMIN_TOKEN,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status} ${JSON.stringify(json).slice(0, 200)}`);
  }
  return json;
}

// ─── Resolver provider_id ───
async function resolveProviderId() {
  if (PROVIDER_ID_ENV) {
    console.log(`🔗 Usando PROVIDER_ID=${PROVIDER_ID_ENV} (env)`);
    return PROVIDER_ID_ENV;
  }
  if (DRY) return 0;
  const r = await api('/api/admin/providers?status=approved');
  const items = r.items || [];
  if (!items.length) {
    throw new Error(
      'No hay providers con status="approved". Crea o aprueba uno desde /admin antes de seedear, ' +
      'o pasa PROVIDER_ID=<id> manualmente.'
    );
  }
  console.log(`🔗 Provider auto-seleccionado: #${items[0].id} ${items[0].name}`);
  return items[0].id;
}

// ─── Variantes ───
function buildVariants(sport, m) {
  const imgUrl = 'https://images.unsplash.com/' + m.img + '?w=1200&auto=format&fit=crop&q=80';
  const extras = (m.extras || '').split(',').map(s => s.trim()).filter(Boolean);

  // Variante A — Standard (datos base de SPORT_MAP)
  const A = {
    sport,
    category: m.cat,
    icon: m.icon,
    title: '[TEST A] ' + m.title,
    description: 'Experiencia de prueba estándar generada automáticamente para QA del marketplace.',
    location: m.loc,
    country: m.c,
    lat: m.lat,
    lng: m.lng,
    difficulty: m.diff,
    duration: m.dur,
    price_eur: m.price,
    old_price_eur: null,
    spots: 8,
    image_url: imgUrl,
    extras,
    badge: 'new',
    active: true,
  };

  // Variante B — Premium (offset coords + precio +40 %)
  const B = {
    sport,
    category: m.cat,
    icon: m.icon,
    title: '[TEST B] ' + m.title + ' Premium',
    description: 'Variante premium de prueba con grupo reducido y equipamiento extra.',
    location: m.loc + ' (Premium)',
    country: m.c,
    lat: +(m.lat + 0.04).toFixed(6),
    lng: +(m.lng + 0.04).toFixed(6),
    difficulty: m.diff,
    duration: m.dur,
    price_eur: Math.round(m.price * 1.4),
    old_price_eur: Math.round(m.price * 1.6),
    spots: 4,
    image_url: imgUrl,
    extras: [...extras, 'Grupo reducido'],
    badge: 'popular',
    active: true,
  };

  return [A, B];
}

// ─── Run ───
(async () => {
  console.log(`🌐 BASE_URL: ${BASE_URL}`);
  console.log(`🔐 Auth: ${ADMIN_TOKEN ? 'Bearer ' + ADMIN_TOKEN.slice(0, 6) + '…' : '(dry-run sin auth)'}`);
  if (DRY) console.log('🧪 DRY-RUN — no se hará ningún POST');

  const provider_id = await resolveProviderId();
  let ok = 0, fail = 0;
  const errors = [];

  for (const sport of sportNames) {
    const variants = buildVariants(sport, SPORT_MAP[sport]);
    for (const v of variants) {
      const payload = { provider_id, ...v };
      if (DRY) {
        console.log(`  [dry] ${sport} · ${v.title} · ${v.price_eur}€ · (${v.lat}, ${v.lng})`);
        ok++;
        continue;
      }
      try {
        const r = await api('/api/admin/experiences', 'POST', payload);
        console.log(`  ✅ ${sport.padEnd(20)} #${r.experience?.id} ${v.title.slice(0, 50)}`);
        ok++;
      } catch (err) {
        console.error(`  ❌ ${sport} · ${v.title} → ${err.message}`);
        errors.push({ sport, title: v.title, error: err.message });
        fail++;
      }
      // pequeño pacing para no saturar la API
      await new Promise(r => setTimeout(r, 80));
    }
  }

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ OK: ${ok}    ❌ Fail: ${fail}    Total deportes: ${sportNames.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (errors.length) {
    console.log('Errores:');
    errors.slice(0, 10).forEach(e => console.log(`  · ${e.sport} :: ${e.error}`));
  }
  process.exit(fail ? 1 : 0);
})().catch(err => {
  console.error('💥 Fatal:', err.message);
  process.exit(2);
});
