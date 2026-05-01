#!/usr/bin/env node
/**
 * Cleanup: borra (soft-delete) todas las experiencias creadas por seed-tests.mjs.
 *
 * Detecta por prefijo en el título: "[TEST A]" o "[TEST B]".
 *
 * Uso (PowerShell):
 *   $env:ADMIN_TOKEN="…tu token…"
 *   $env:BASE_URL="https://tripxtrem.com"   # opcional
 *   node scripts/cleanup-tests.mjs
 *
 * Flags:
 *   --dry-run   solo lista lo que borraría
 *   --hard      pasa active=false (soft delete) — el endpoint admin solo soporta soft
 */

const BASE_URL = process.env.BASE_URL || 'https://tripxtrem.com';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const DRY = process.argv.includes('--dry-run');

if (!ADMIN_TOKEN) {
  console.error('❌ Falta ADMIN_TOKEN');
  process.exit(1);
}

async function api(path, method = 'GET') {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: {
      'Authorization': 'Bearer ' + ADMIN_TOKEN,
      'Accept': 'application/json',
    },
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${JSON.stringify(json).slice(0, 200)}`);
  return json;
}

(async () => {
  console.log(`🌐 BASE_URL: ${BASE_URL}`);
  console.log(`🔐 Auth: Bearer ${ADMIN_TOKEN.slice(0, 6)}…`);
  if (DRY) console.log('🧪 DRY-RUN — no se borrará nada');

  const r = await api('/api/admin/experiences');
  const all = r.items || [];
  const targets = all.filter(e =>
    typeof e.title === 'string' && /^\[TEST [AB]\]/.test(e.title) && e.active
  );

  console.log(`📦 Experiencias activas totales: ${all.length}`);
  console.log(`🎯 Coinciden con [TEST A]/[TEST B]: ${targets.length}`);

  if (!targets.length) {
    console.log('Nada que borrar.');
    return;
  }

  let ok = 0, fail = 0;
  for (const e of targets) {
    if (DRY) {
      console.log(`  [dry] #${e.id} ${e.sport} · ${e.title}`);
      ok++;
      continue;
    }
    try {
      await api(`/api/admin/experiences?id=${e.id}`, 'DELETE');
      console.log(`  🗑️  #${e.id} ${e.sport.padEnd(20)} ${e.title.slice(0, 50)}`);
      ok++;
    } catch (err) {
      console.error(`  ❌ #${e.id} → ${err.message}`);
      fail++;
    }
    await new Promise(r => setTimeout(r, 60));
  }

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Borrados: ${ok}    ❌ Fail: ${fail}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(fail ? 1 : 0);
})().catch(err => {
  console.error('💥 Fatal:', err.message);
  process.exit(2);
});
