# TripXtrem — Landing + Waitlist

Marketplace Nº1 de turismo de aventura en España. Fase actual: **landing con waitlist** mientras se gestiona legal + partners.

## Stack

- **Frontend:** HTML + CSS + Vanilla JS (single file `tripxtrem_23.html`).
- **Mapas:** Leaflet + CartoDB tiles (gratis).
- **Hosting:** Vercel (static + serverless functions).
- **DB:** Neon Postgres (EU Frankfurt).
- **Email:** Resend (transaccional).
- **Analytics:** Plausible (sin cookies, GDPR-friendly).

## Estructura

```
.
├── tripxtrem_23.html        # Landing principal (single file)
├── api/
│   └── waitlist.ts          # POST /api/waitlist → Neon + Resend
├── legal/
│   ├── aviso-legal.html
│   ├── privacidad.html
│   ├── cookies.html
│   └── terminos.html
├── public/
│   ├── favicon.svg
│   ├── manifest.webmanifest
│   ├── robots.txt
│   ├── sitemap.xml
│   └── og-image.jpg         # 1200x630, pendiente de crear
├── db/
│   └── schema.sql           # Ejecutar en Neon console
├── package.json
├── vercel.json
├── tsconfig.json
└── .env.example
```

## Setup (primera vez)

1. **Neon DB:**
   - Crear proyecto en https://console.neon.tech (región `eu-central-1 (Frankfurt)`).
   - Ejecutar `db/schema.sql` en el SQL Editor.
   - Copiar `DATABASE_URL`.

2. **Resend:**
   - Crear cuenta en https://resend.com.
   - Añadir dominio `tripxtrem.com` y verificar DNS (SPF + DKIM + Return-Path).
   - Crear API key → copiar `RESEND_API_KEY`.

3. **Vercel:**
   - Importar repo desde GitHub.
   - Variables de entorno en Settings → Environment Variables:
     - `DATABASE_URL`
     - `RESEND_API_KEY`
     - `RESEND_FROM_EMAIL=hola@tripxtrem.com`
     - `IP_SALT=` (generar random 32 chars)
     - `WAITLIST_RATE_LIMIT_PER_HOUR=5`
   - Deploy.

4. **Dominio (Dynadot → Vercel):**
   - Vercel Project → Settings → Domains → Add `tripxtrem.com` y `www.tripxtrem.com`.
   - En Dynadot, poner los DNS records que Vercel indica (A record o NS).
   - Esperar propagación (~10 min – 24h).

5. **Plausible:**
   - Crear sitio `tripxtrem.com` en https://plausible.io.
   - El script ya está en el HTML.

## Desarrollo local

```bash
npm install
npm run dev      # Vercel dev server con /api
```

Requiere `.env.local` con las variables del punto 3.

## Deploy producción

Automático al hacer push a `main` (si está conectado con GitHub).

Manual:
```bash
vercel --prod
```

## Verificación post-deploy

1. `curl -I https://tripxtrem.com` → 200 + HTTPS.
2. Abrir landing → filtros + mapa funcionan.
3. Click "Apúntate" en cualquier card → modal abre.
4. Rellenar form → success toast.
5. `SELECT * FROM waitlist ORDER BY created_at DESC LIMIT 5;` en Neon → fila nueva.
6. Email de bienvenida recibido desde `hola@tripxtrem.com`.
7. Enviar mismo email dos veces → segunda vez devuelve `duplicate:true` sin email duplicado.
8. [Open Graph debugger](https://www.opengraph.xyz/) con `tripxtrem.com` → preview OK.
9. Lighthouse mobile ≥ 90.

## Regla de oro

**NO integrar Stripe, NO aceptar pagos, NO prometer disponibilidad hasta:**
1. SL registrada.
2. Seguro RC firmado.
3. Cuenta Stripe aprobada.
4. Primer partner con contrato.

Mientras tanto: **landing + waitlist + construir demanda**.
