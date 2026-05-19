#!/usr/bin/env node
/**
 * Reemplaza URLs de imágenes Unsplash 404 en experiencias existentes.
 *
 * Uso:
 *   $env:ADMIN_TOKEN="…"
 *   $env:BASE_URL="https://tripxtrem.com"
 *   node scripts/fix-broken-images.mjs
 *
 * Flags:
 *   --dry-run   solo lista cambios
 */

const BASE_URL = process.env.BASE_URL || 'https://tripxtrem.com';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const DRY = process.argv.includes('--dry-run');

if (!ADMIN_TOKEN) { console.error('❌ Falta ADMIN_TOKEN'); process.exit(1); }

// IDs Unsplash 404 → reemplazos verificados (curl 200)
const REPLACEMENTS = {
  'photo-1502680390548-bdbac40a5e46': 'photo-1455729552865-3658a5d39692',  // surf
  'photo-1530866495561-507c83781b20': 'photo-1454496522488-7a8e488e8606',  // aguas bravas
  'photo-1503507745735-71d07ce73e47': 'photo-1545558014-8692077e9b5c',     // paragliding
  'photo-1544191696-15693072e831':    'photo-1606902965551-dce093cda6e7',  // mtb/dirt
};

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
  let json; try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${JSON.stringify(json).slice(0,200)}`);
  return json;
}

function fixUrl(url) {
  if (!url) return null;
  for (const [bad, good] of Object.entries(REPLACEMENTS)) {
    if (url.includes(bad)) return url.replace(bad, good);
  }
  return null;
}

(async () => {
  console.log(`🌐 ${BASE_URL}  ${DRY?'(dry-run)':''}`);
  const r = await api('/api/admin/experiences');
  const all = r.items || [];
  console.log(`📦 ${all.length} experiencias totales`);

  const targets = all
    .map(e => ({ id: e.id, sport: e.sport, oldUrl: e.image_url, newUrl: fixUrl(e.image_url) }))
    .filter(x => x.newUrl && x.newUrl !== x.oldUrl);

  console.log(`🎯 ${targets.length} con imagen rota`);
  if (!targets.length) return;

  let ok = 0, fail = 0;
  for (const t of targets) {
    if (DRY) {
      console.log(`  [dry] #${t.id} ${t.sport}`);
      ok++; continue;
    }
    try {
      await api('/api/admin/experiences', 'PATCH', { id: t.id, image_url: t.newUrl });
      console.log(`  ✅ #${String(t.id).padEnd(4)} ${t.sport}`);
      ok++;
    } catch (err) {
      console.error(`  ❌ #${t.id} → ${err.message}`);
      fail++;
    }
    await new Promise(r => setTimeout(r, 60));
  }
  console.log('');
  console.log(`✅ Patched: ${ok}    ❌ Fail: ${fail}`);
  process.exit(fail ? 1 : 0);
})().catch(err => { console.error('💥', err.message); process.exit(2); });
