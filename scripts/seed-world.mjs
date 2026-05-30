#!/usr/bin/env node
/**
 * Seed: experiencias en destinos internacionales icónicos.
 * Una por deporte (spot mítico mundial), prefijo [TEST W] para limpieza.
 *
 * Uso:
 *   $env:ADMIN_TOKEN="…"
 *   $env:BASE_URL="https://tripxtrem.com"   # opcional
 *   $env:PROVIDER_ID="1"                    # opcional
 *   node scripts/seed-world.mjs
 *
 * Flags:
 *   --dry-run
 *   --only=SURF,KITESURF
 */

const BASE_URL = process.env.BASE_URL || 'https://tripxtrem.com';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const PROVIDER_ID_ENV = process.env.PROVIDER_ID ? parseInt(process.env.PROVIDER_ID, 10) : null;
const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const onlyArg = args.find(a => a.startsWith('--only='));
const ONLY = onlyArg ? new Set(onlyArg.slice(7).split(',').map(s => s.trim().toUpperCase())) : null;

if (!ADMIN_TOKEN && !DRY) {
  console.error('❌ Falta ADMIN_TOKEN');
  process.exit(1);
}

// ─── Destinos internacionales icónicos por deporte ───
// Cada entrada es un spot mundialmente famoso del deporte.
const WORLD_MAP = {
  // ─── AGUA ───
  'SURF':         { icon:'🏄', cat:'Agua',  diff:'Alta',  dur:'2-3h',     extras:'Tabla, Instructor local, Seguro',     img:'photo-1502680390548-bdbac40a5e46', loc:'Nazaré, Portugal',                  lat:39.601,  lng:-9.072,  c:'PT', price:120, title:'Sesión de surf en Nazaré' },
  'KITESURF':     { icon:'🪁', cat:'Agua',  diff:'Alta',  dur:'4h',       extras:'Kite, Arnés, Instructor IKO',         img:'photo-1559339352-11d035aa65de', loc:'Cabarete, República Dominicana',    lat:19.755,  lng:-70.418, c:'DO', price:180, title:'Kitesurf en el spot caribeño nº1' },
  'RAFTING':      { icon:'🚣', cat:'Agua',  diff:'Alta',  dur:'Jornada',  extras:'Casco, Neopreno, Guía senior, Comida', img:'photo-1530866495561-507c83781b20', loc:'Río Zambezi, Zimbabue',             lat:-17.928, lng:25.852,  c:'ZW', price:220, title:'Rafting clase V en el Zambezi' },
  'BUCEO':        { icon:'🤿', cat:'Agua',  diff:'Media', dur:'3h',       extras:'Equipo PADI, Guía',                   img:'photo-1544551763-46a013bb70d5', loc:'Great Barrier Reef, Australia',     lat:-16.286, lng:145.785, c:'AU', price:195, title:'Inmersión en la Gran Barrera de Coral' },
  'BUCEO CUEVAS': { icon:'🦈', cat:'Agua',  diff:'Alta',  dur:'Jornada',  extras:'Equipo técnico, Guía cavediver',      img:'photo-1544551763-46a013bb70d5', loc:'Cenotes Yucatán, México',           lat:20.683,  lng:-87.083, c:'MX', price:240, title:'Buceo en cenotes mayas' },
  'JET SKI':      { icon:'🛥️', cat:'Agua',  diff:'Media', dur:'1.5h',     extras:'Jet ski, Chaleco, Tour',              img:'photo-1626618012641-bfbca5a31239', loc:'Dubai Marina, EAU',                 lat:25.078,  lng:55.139,  c:'AE', price:160, title:'Ruta en jet ski por skyline de Dubái' },
  'WAKEBOARD':    { icon:'🏂', cat:'Agua',  diff:'Media', dur:'2h',       extras:'Tabla, Lancha, Coach',                img:'photo-1530866495561-507c83781b20', loc:'Phuket, Tailandia',                 lat:7.880,   lng:98.396,  c:'TH', price:90,  title:'Wakeboard en aguas tropicales' },
  'BODYBOARD':    { icon:'🌊', cat:'Agua',  diff:'Alta',  dur:'2h',       extras:'Tabla, Aletas, Neopreno',             img:'photo-1502680390548-bdbac40a5e46', loc:'Puerto Escondido, México',          lat:15.873,  lng:-97.076, c:'MX', price:75,  title:'Bodyboard en Zicatela' },
  'WINDSURF':     { icon:'🏄‍♂️',cat:'Agua',  diff:'Alta',  dur:'3h',       extras:'Tabla, Vela, Instructor',             img:'photo-1502680390548-bdbac40a5e46', loc:'Hookipa, Maui · Hawái',             lat:20.933,  lng:-156.357,c:'US', price:140, title:'Windsurf en Hookipa Beach' },
  'KAYAK EXTREMO':{ icon:'🛶', cat:'Agua',  diff:'Alta',  dur:'Jornada',  extras:'Kayak, Pala, Guía',                   img:'photo-1530866495561-507c83781b20', loc:'Futaleufú, Chile',                  lat:-43.182, lng:-71.871, c:'CL', price:210, title:'Descenso del Futaleufú' },
  'HYDROSPEED':   { icon:'💧', cat:'Agua',  diff:'Alta',  dur:'3h',       extras:'Tabla, Casco, Neopreno, Guía',        img:'photo-1530866495561-507c83781b20', loc:'Verdon, Francia',                   lat:43.748,  lng:6.346,   c:'FR', price:110, title:'Hidrospeed en cañón del Verdon' },
  'COASTEERING':  { icon:'🏊', cat:'Agua',  diff:'Alta',  dur:'4h',       extras:'Neopreno, Casco, Guía local',         img:'photo-1530866495561-507c83781b20', loc:'Pembrokeshire, Gales',              lat:51.832,  lng:-5.155,  c:'GB', price:95,  title:'Coasteering en costa galesa' },
  'CLIFF DIVING': { icon:'🤸', cat:'Agua',  diff:'Alta',  dur:'4h',       extras:'Guía elite, Seguro premium',          img:'photo-1530866495561-507c83781b20', loc:'La Quebrada, Acapulco',             lat:16.851,  lng:-99.926, c:'MX', price:160, title:'Cliff diving en La Quebrada' },
  'SNORKEL':      { icon:'🐠', cat:'Agua',  diff:'Baja',  dur:'3h',       extras:'Tubo, Aletas, Gafas, Barco',          img:'photo-1544551763-46a013bb70d5', loc:'Atolones de Maldivas',              lat:3.202,   lng:73.220,  c:'MV', price:130, title:'Snorkel entre mantas y tortugas' },

  // ─── AIRE ───
  'PARAPENTE':    { icon:'🪂', cat:'Aire',  diff:'Media', dur:'1h',       extras:'Vuelo biplaza, Vídeo 4K, Fotos',      img:'photo-1503507745735-71d07ce73e47', loc:'Interlaken, Suiza',                 lat:46.685,  lng:7.864,   c:'CH', price:230, title:'Parapente sobre los Alpes suizos' },
  'PARACAIDISMO': { icon:'🛩️', cat:'Aire',  diff:'Alta',  dur:'1h',       extras:'Salto tándem, Vídeo, Instructor elite', img:'photo-1474623809196-26c1d33457cc', loc:'The Palm, Dubái',                 lat:25.112,  lng:55.139,  c:'AE', price:580, title:'Salto sobre Palm Jumeirah' },
  'WINGSUIT':     { icon:'🦸', cat:'Aire',  diff:'Alta',  dur:'30min',    extras:'Traje wingsuit, Instructor pro, GoPro', img:'photo-1474623809196-26c1d33457cc', loc:'Tianmen, China',                  lat:29.048,  lng:110.474, c:'CN', price:850, title:'Vuelo en wingsuit en Tianmen' },
  'BUNGEE':       { icon:'🪢', cat:'Aire',  diff:'Alta',  dur:'30min',    extras:'Salto, Vídeo, Certificado',           img:'photo-1503507745735-71d07ce73e47', loc:'Nevis Highwire, Nueva Zelanda',     lat:-45.131, lng:168.726, c:'NZ', price:265, title:'Bungee de 134 m en Nevis' },
  'BASE JUMP':    { icon:'🏗️', cat:'Aire',  diff:'Alta',  dur:'Jornada',  extras:'Instructor elite, Equipo pro, Seguro premium', img:'photo-1474623809196-26c1d33457cc', loc:'Lauterbrunnen, Suiza',      lat:46.594,  lng:7.908,   c:'CH', price:780, title:'BASE jump en el Valle de las 72 cascadas' },
  'ALA DELTA':    { icon:'🪽', cat:'Aire',  diff:'Alta',  dur:'1h',       extras:'Vuelo biplaza, Fotos, Seguro',        img:'photo-1503507745735-71d07ce73e47', loc:'Pedra Bonita, Río de Janeiro',      lat:-22.998, lng:-43.281, c:'BR', price:175, title:'Ala delta sobre Río de Janeiro' },
  'ACROBACIA AEREA':{icon:'✈️', cat:'Aire',  diff:'Alta', dur:'40min',    extras:'Avión acrobático, Piloto experto',    img:'photo-1474623809196-26c1d33457cc', loc:'Las Vegas, EE.UU.',                 lat:36.080,  lng:-115.152,c:'US', price:425, title:'Vuelo acrobático sobre el Gran Cañón' },
  'TIROLINA':     { icon:'🏗️', cat:'Aire',  diff:'Media', dur:'45min',    extras:'Arnés, Casco, Foto',                  img:'photo-1503507745735-71d07ce73e47', loc:'Toro Verde, Puerto Rico',           lat:18.314,  lng:-66.176, c:'PR', price:95,  title:'Tirolina “El Monstruo” — la 2ª más larga del mundo' },
  'SPEED RIDING': { icon:'⚡', cat:'Aire',  diff:'Alta',  dur:'3h',       extras:'Vela speed, Esquís, Instructor elite',img:'photo-1503507745735-71d07ce73e47', loc:'Chamonix, Francia',                 lat:45.923,  lng:6.870,   c:'FR', price:340, title:'Speed riding desde Aiguille du Midi' },

  // ─── NIEVE ───
  'FREERIDE':     { icon:'⛷️', cat:'Nieve', diff:'Alta',  dur:'Jornada',  extras:'Guía UIAGM, ARVA, Pala, Sonda',       img:'photo-1551524559-8af4e6624178', loc:'Hokkaidō (Niseko), Japón',          lat:42.806,  lng:140.687, c:'JP', price:280, title:'Freeride en polvo japonés' },
  'HELIESQUI':    { icon:'🚁', cat:'Nieve', diff:'Alta',  dur:'Jornada',  extras:'Helicóptero, Guía elite, ARVA',       img:'photo-1551524559-8af4e6624178', loc:'Bella Coola, Canadá',               lat:52.378,  lng:-126.745,c:'CA', price:1100,title:'Heliesquí en la Columbia Británica' },
  'ICE CLIMBING': { icon:'🧊', cat:'Nieve', diff:'Alta',  dur:'Jornada',  extras:'Piolets, Crampones, Guía UIAGM',      img:'photo-1551524559-8af4e6624178', loc:'Lofoten, Noruega',                  lat:68.155,  lng:13.611,  c:'NO', price:240, title:'Escalada en cascadas heladas de Lofoten' },
  'SNOWBOARD':    { icon:'🏂', cat:'Nieve', diff:'Media', dur:'Jornada',  extras:'Tabla, Botas, Monitor, Forfait',      img:'photo-1551524559-8af4e6624178', loc:'Whistler Blackcomb, Canadá',        lat:50.115,  lng:-122.954,c:'CA', price:195, title:'Snowboard en Whistler' },
  'AVALANCHA SKIING':{icon:'🏔️',cat:'Nieve', diff:'Alta', dur:'Jornada',  extras:'Guía elite, ARVA, Equipo seguridad',  img:'photo-1551524559-8af4e6624178', loc:'Revelstoke, Canadá',                lat:50.998,  lng:-118.196,c:'CA', price:520, title:'Steep skiing en Revelstoke' },
  'SNOWKITE':     { icon:'🪁', cat:'Nieve', diff:'Alta',  dur:'4h',       extras:'Kite, Tabla, Instructor',             img:'photo-1551524559-8af4e6624178', loc:'Hardangervidda, Noruega',           lat:60.297,  lng:7.487,   c:'NO', price:230, title:'Snowkite en la meseta noruega' },
  'SPEED SKIING': { icon:'💨', cat:'Nieve', diff:'Alta',  dur:'4h',       extras:'Casco aero, Traje speed, Coach',      img:'photo-1551524559-8af4e6624178', loc:'Vars, Francia',                     lat:44.554,  lng:6.689,   c:'FR', price:380, title:'Speed skiing en pista Chabrières (>200 km/h)' },
  'SKICROSS':     { icon:'🎿', cat:'Nieve', diff:'Alta',  dur:'Jornada',  extras:'Forfait, Monitor, Seguro',            img:'photo-1551524559-8af4e6624178', loc:'Val Thorens, Francia',              lat:45.297,  lng:6.580,   c:'FR', price:175, title:'Skicross en Val Thorens' },

  // ─── TIERRA ───
  'ESCALADA':     { icon:'🧗', cat:'Tierra',diff:'Alta',  dur:'Jornada',  extras:'Arnés, Casco, Cuerda, Guía',          img:'photo-1522163182402-834f871fd851', loc:'Yosemite, EE.UU.',                  lat:37.733,  lng:-119.602,c:'US', price:240, title:'Big wall en El Capitan' },
  'VIA FERRATA':  { icon:'⛰️', cat:'Tierra',diff:'Media', dur:'5h',       extras:'Arnés, Casco, Guía',                  img:'photo-1522163182402-834f871fd851', loc:'Dolomitas, Italia',                 lat:46.412,  lng:11.844,  c:'IT', price:130, title:'Vía ferrata en las Dolomitas' },
  'ENDURO MTB':   { icon:'🚵', cat:'Tierra',diff:'Alta',  dur:'Jornada',  extras:'Bici enduro, Casco, Protecciones',    img:'photo-1544191696-15693072e831', loc:'Finale Ligure, Italia',             lat:44.171,  lng:8.343,   c:'IT', price:165, title:'Enduro MTB en la Riviera italiana' },
  'BARRANQUISMO': { icon:'🏞️', cat:'Tierra',diff:'Alta',  dur:'Jornada',  extras:'Neopreno, Casco, Arnés, Guía',        img:'photo-1522163182402-834f871fd851', loc:'Saxetenbach, Suiza',                lat:46.673,  lng:7.910,   c:'CH', price:185, title:'Barranquismo en Saxeten' },
  'DOWNHILL':     { icon:'🚴', cat:'Tierra',diff:'Alta',  dur:'Jornada',  extras:'Bici DH, Casco integral, Protecciones',img:'photo-1544191696-15693072e831', loc:'Whistler Bike Park, Canadá',        lat:50.107,  lng:-122.951,c:'CA', price:220, title:'Downhill en A-Line' },
  'MOTOCROSS':    { icon:'🏍️', cat:'Tierra',diff:'Alta',  dur:'3h',       extras:'Moto, Casco, Protecciones, Instructor',img:'photo-1544191696-15693072e831', loc:'Glen Helen, California',            lat:34.188,  lng:-117.434,c:'US', price:260, title:'Circuito Glen Helen Raceway' },
  'QUAD':         { icon:'🛞', cat:'Tierra',diff:'Media', dur:'3h',       extras:'Quad, Casco, Guía',                   img:'photo-1544191696-15693072e831', loc:'Desierto del Sáhara, Marruecos',    lat:31.150,  lng:-4.014,  c:'MA', price:120, title:'Ruta en quad por las dunas del Sáhara' },
  'PARKOUR':      { icon:'🤸‍♂️',cat:'Tierra',diff:'Alta',  dur:'2h',       extras:'Coach certificado, Calentamiento',    img:'photo-1522163182402-834f871fd851', loc:'París (Lisses), Francia',           lat:48.624,  lng:2.420,   c:'FR', price:75,  title:'Parkour en la cuna del movimiento' },
  'RALLY RAID':   { icon:'🏎️', cat:'Tierra',diff:'Alta',  dur:'Jornada',  extras:'4x4 rally, Copiloto, Equipo',         img:'photo-1544191696-15693072e831', loc:'Wadi Rum, Jordania',                lat:29.581,  lng:35.420,  c:'JO', price:380, title:'Rally raid en el desierto rojo' },
  'ALPINISMO':    { icon:'🗻', cat:'Tierra',diff:'Alta',  dur:'2 días',   extras:'Guía UIAGM, Equipo alta montaña',     img:'photo-1522163182402-834f871fd851', loc:'Mont Blanc, Francia',               lat:45.832,  lng:6.865,   c:'FR', price:780, title:'Ascensión al Mont Blanc' },
  'SANDBOARD':    { icon:'🏜️', cat:'Tierra',diff:'Media', dur:'3h',       extras:'Tabla sand, Protección, Instructor',  img:'photo-1544191696-15693072e831', loc:'Huacachina, Perú',                  lat:-14.087, lng:-75.762, c:'PE', price:65,  title:'Sandboard en el oasis de Huacachina' },
  'SLACKLINE ALTURA':{icon:'🌉',cat:'Tierra',diff:'Alta', dur:'Jornada',  extras:'Línea pro, Arnés, Instructor elite',  img:'photo-1522163182402-834f871fd851', loc:'Moab, Utah · EE.UU.',               lat:38.573,  lng:-109.550,c:'US', price:260, title:'Highline sobre cañones de Moab' }
};

const allKeys = Object.keys(WORLD_MAP);
const targets = allKeys.filter(s => !ONLY || ONLY.has(s));

console.log(`🌍 WORLD_MAP cargado: ${allKeys.length} destinos (procesando ${targets.length})`);

// ─── HTTP ───
async function api(path, method='GET', body=null){
  const res = await fetch(BASE_URL+path, {
    method,
    headers:{
      'Authorization':'Bearer '+ADMIN_TOKEN,
      'Content-Type':'application/json',
      'Accept':'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json; try{ json=JSON.parse(text); }catch{ json={raw:text}; }
  if(!res.ok) throw new Error(`${method} ${path} → ${res.status} ${JSON.stringify(json).slice(0,200)}`);
  return json;
}

async function resolveProviderId(){
  if(PROVIDER_ID_ENV){ console.log(`🔗 PROVIDER_ID=${PROVIDER_ID_ENV} (env)`); return PROVIDER_ID_ENV; }
  if(DRY) return 0;
  const r = await api('/api/admin/providers?status=approved');
  const items = r.items || [];
  if(!items.length) throw new Error('No hay providers approved. Pasa PROVIDER_ID=<id> o aprueba uno.');
  console.log(`🔗 Provider auto: #${items[0].id} ${items[0].name}`);
  return items[0].id;
}

function buildExperience(sport, m){
  const imgUrl = 'https://images.unsplash.com/'+m.img+'?w=1200&auto=format&fit=crop&q=80';
  const extras = (m.extras||'').split(',').map(s=>s.trim()).filter(Boolean);
  return {
    sport,
    category: m.cat,
    icon: m.icon,
    title: '[TEST W] '+m.title,
    description: 'Spot internacional de referencia. Experiencia generada para QA del marketplace global.',
    location: m.loc,
    country: m.c,
    lat: m.lat,
    lng: m.lng,
    difficulty: m.diff,
    duration: m.dur,
    price_eur: m.price,
    old_price_eur: null,
    spots: 6,
    image_url: imgUrl,
    extras,
    badge: 'popular',
    active: true,
  };
}

// ─── Run ───
(async () => {
  console.log(`🌐 BASE_URL: ${BASE_URL}`);
  if(DRY) console.log('🧪 DRY-RUN — no se hará POST');

  const provider_id = await resolveProviderId();
  let ok=0, fail=0;
  const errors=[];

  for(const sport of targets){
    const v = buildExperience(sport, WORLD_MAP[sport]);
    const payload = { provider_id, ...v };
    if(DRY){
      console.log(`  [dry] ${sport.padEnd(20)} · ${v.location} · ${v.price_eur}€`);
      ok++; continue;
    }
    try{
      const r = await api('/api/admin/experiences', 'POST', payload);
      console.log(`  ✅ ${sport.padEnd(20)} #${r.experience?.id}  ${v.location}`);
      ok++;
    }catch(err){
      console.error(`  ❌ ${sport} → ${err.message}`);
      errors.push({sport, error: err.message});
      fail++;
    }
    await new Promise(r => setTimeout(r, 80));
  }

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ OK: ${ok}    ❌ Fail: ${fail}    Total: ${targets.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if(errors.length){
    console.log('Errores:');
    errors.slice(0,10).forEach(e => console.log(`  · ${e.sport} :: ${e.error}`));
  }
  process.exit(fail ? 1 : 0);
})().catch(err => {
  console.error('💥 Fatal:', err.message);
  process.exit(2);
});
