# TripXtrem · Product Specification v2.0
## Stack óptimo 2026 — implementación técnica

> **Misión:** ser el marketplace nº1 de aventura y deportes extremos donde un europeo reserva el journey completo (actividad + dormir + transporte + cena) en una sola transacción.
>
> **Slogan:** Reserva la adrenalina. Vívela después.
>
> **Cambio respecto a v1:** v1 era spec funcional con stack actual (HTML estático + Vercel Functions + Neon). v2 asume **stack target 2026** desde el día 1: Next.js 15 + Clerk + Drizzle + Stripe Connect + Cloudinary.

---

## 📐 0 · Arquitectura técnica · 6 capas

```
┌─────────────────────────────────────────────────────────────────┐
│  Capa 1 — FRONTEND                                              │
│  Next.js 15 App Router · TypeScript · Tailwind CSS v4           │
│  RSC streaming · Server Components (SEO) · Client (interacción) │
├─────────────────────────────────────────────────────────────────┤
│  Capa 2 — AUTH                                                  │
│  Clerk · Organizations (partners) · Magic link + Google OAuth   │
│  Webhooks → Neon (sync users)                                   │
├─────────────────────────────────────────────────────────────────┤
│  Capa 3 — DATOS                                                 │
│  Neon (Postgres serverless) · Drizzle ORM · Upstash Redis cache │
│  Branch por PR · Scale-to-zero · 10× más rápido que Prisma      │
├─────────────────────────────────────────────────────────────────┤
│  Capa 4 — PAGOS                                                 │
│  Stripe Connect Express · Onboarding KYC en 10 min              │
│  Split automático · Payouts semanales a partner                 │
├─────────────────────────────────────────────────────────────────┤
│  Capa 5 — STORAGE + MAPAS + EMAIL                               │
│  Cloudinary (fotos) · Leaflet (mapas) · Resend (emails)         │
│  Uploadthing (subidas partner) · Cloudflare CDN (assets)        │
├─────────────────────────────────────────────────────────────────┤
│  Capa 6 — DEPLOY + CI/CD                                        │
│  Vercel · Preview por PR · Edge 30+ regiones                    │
│  GitHub push → deploy 45s · Integración nativa Neon + Clerk     │
└─────────────────────────────────────────────────────────────────┘
```

### Coste mensual fijo

| Proveedor | Coste |
|---|---|
| Next.js + Vercel Pro | €20/mes |
| Clerk (hasta 10K MAU) | €0 → €25/mes |
| Neon + Upstash Redis | €19/mes |
| Cloudinary + Resend | €25/mes |
| Stripe Connect | 2,9 % + 0,30 €/tx (variable) |
| Mapbox (opcional) | €0 hasta 50K loads |
| Dominio + extras | ~€15/mes |
| **TOTAL FIJO** | **€79-100/mes** sin volumen |

**Escalabilidad proyectada:** soporta hasta €11-14M revenue/año 5 con la misma arquitectura. Sin re-platform.

### Justificación stack (resumen)

| Tech | Por qué éste y no otro |
|---|---|
| **Next.js 15** | Único framework que combina SSR (crítico para SEO de marketplace) con velocidad de React en cliente. App Router + RSC reducen bundle 40-60%. |
| **Clerk** | Maneja partners como `Organizations` out-of-the-box. Sin construirlo tú = ahorras 2-3 meses de auth multi-tenant. Magic links UX premium. |
| **Neon** | PostgreSQL serverless con **branch por PR** — cada PR tiene una copia de la DB de producción para testear. Supabase no tiene esto. Scale-to-zero ahorra coste en pre-launch. |
| **Drizzle** | 10× más rápido que Prisma en cold-start (crítico para serverless). TypeScript-first. SQL-like syntax = portable. |
| **Stripe Connect Express** | Estándar oro para marketplaces. Partners hacen KYC en 10 min sin salir de tu app. Split automático: comisión TripXtrem se retiene, resto va al partner. |
| **Vercel** | Deploy 45s, integración nativa con Neon + Clerk, preview por PR sin config. Edge Network 30+ regiones reduce TTFB en EU. |

---

## 🗂️ 1 · Estructura del proyecto

```
tripxtrem/
├── app/                          # Next.js 15 App Router
│   ├── (public)/                 # Rutas públicas (SEO-first, RSC)
│   │   ├── page.tsx              # Home: mapa + cards
│   │   ├── actividades/
│   │   │   ├── page.tsx          # Listado/buscador
│   │   │   └── [vertical]/
│   │   │       ├── [categoria]/
│   │   │       │   ├── page.tsx  # ej: /actividades/agua/surf
│   │   │       │   └── [slug]/
│   │   │       │       └── page.tsx  # Ficha producto (SSR)
│   │   ├── packs/                # Bundles (V2+)
│   │   ├── partner/
│   │   │   ├── page.tsx          # Landing partner (CRO-optimizada)
│   │   │   └── alta/page.tsx     # Onboarding 6 pasos
│   │   ├── guias/[slug]/page.tsx # Páginas pilar SEO
│   │   └── legal/[slug]/page.tsx # Aviso, privacidad, cookies, T&C
│   │
│   ├── (auth)/                   # Clerk maneja login/signup
│   │   ├── login/[[...sign-in]]/page.tsx
│   │   ├── signup/[[...sign-up]]/page.tsx
│   │   └── verificar/page.tsx
│   │
│   ├── (user)/                   # Cliente final logueado
│   │   ├── perfil/page.tsx
│   │   ├── reservas/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── favoritos/page.tsx
│   │   └── recompensas/page.tsx  # TX gamification
│   │
│   ├── (partner)/                # Partner (Clerk Organization)
│   │   ├── dashboard/page.tsx
│   │   ├── productos/
│   │   │   ├── page.tsx
│   │   │   ├── nuevo/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── calendario/page.tsx
│   │   ├── reservas/page.tsx
│   │   ├── pagos/page.tsx
│   │   ├── mensajes/page.tsx
│   │   └── ajustes/page.tsx
│   │
│   ├── (admin)/                  # Admin TripXtrem (Clerk role check)
│   │   ├── dashboard/page.tsx
│   │   ├── partners/page.tsx
│   │   ├── productos/page.tsx
│   │   ├── reservas/page.tsx
│   │   ├── usuarios/page.tsx
│   │   └── reviews/page.tsx
│   │
│   ├── api/                      # Route Handlers (RSC + Route)
│   │   ├── webhooks/
│   │   │   ├── clerk/route.ts    # User sync → Neon
│   │   │   ├── stripe/route.ts   # Payment events
│   │   │   └── bokun/route.ts    # External booking sync (V2+)
│   │   ├── bookings/route.ts
│   │   ├── pre-bookings/route.ts
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts
│   │   │   ├── connect/route.ts  # Partner onboarding
│   │   │   └── refund/route.ts
│   │   ├── uploadthing/route.ts  # Partner photo upload
│   │   ├── ical/[id]/route.ts    # iCal sync saliente
│   │   ├── og/[type]/route.ts    # Dynamic OG images
│   │   ├── sitemap.xml/route.ts  # Dynamic sitemap
│   │   └── health/route.ts
│   │
│   ├── layout.tsx                # Root layout (Clerk + Cloudinary)
│   ├── error.tsx
│   ├── not-found.tsx
│   └── globals.css               # Tailwind v4 base
│
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── map/                      # Map components (client-only)
│   ├── booking/                  # Booking flow components
│   ├── product/                  # Product card, ficha sections
│   ├── partner/                  # Partner-specific UI
│   └── admin/                    # Admin-specific UI
│
├── lib/
│   ├── db/
│   │   ├── schema.ts             # Drizzle schema (single source of truth)
│   │   ├── client.ts             # Neon + Drizzle client
│   │   ├── migrations/           # Auto-generated by drizzle-kit
│   │   └── queries/              # Typed query helpers
│   ├── auth.ts                   # Clerk helpers (role checks)
│   ├── stripe.ts                 # Stripe Connect helpers
│   ├── cache.ts                  # Upstash Redis wrapper
│   ├── cloudinary.ts             # Image transforms
│   ├── resend.ts                 # Email templates
│   ├── analytics.ts              # Plausible + GA4 events
│   ├── utils.ts
│   └── constants.ts              # SPORT_MAP, etc.
│
├── emails/                       # React Email templates
│   ├── welcome.tsx
│   ├── booking-confirmation.tsx
│   ├── reminder-24h.tsx
│   ├── partner-approved.tsx
│   └── ...
│
├── public/
│   ├── icons/                    # Lucide SVG icons
│   └── og-default.png
│
├── drizzle.config.ts
├── next.config.ts                # Next 15 config (PPR, dynamicIO)
├── middleware.ts                 # Clerk auth gates
├── tailwind.config.ts            # Tailwind v4
├── tsconfig.json                 # Strict mode
└── package.json
```

---

## 🗄️ 2 · Schema Drizzle (single source of truth)

```ts
// lib/db/schema.ts
import { pgTable, uuid, text, integer, numeric, boolean, jsonb, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';

// ─── Enums ─────────────────────────────────────────────
export const verticalEnum = pgEnum('vertical', ['activity', 'accommodation', 'transfer', 'food']);
export const elementEnum  = pgEnum('element', ['water', 'air', 'snow', 'land']);
export const statusEnum   = pgEnum('booking_status', ['pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'refunded']);
export const supplierStatusEnum = pgEnum('supplier_status', ['pending', 'approved', 'active', 'suspended']);
export const userRoleEnum = pgEnum('user_role', ['customer', 'partner_admin', 'partner_staff', 'tx_admin']);

// ─── PROFILES (sync from Clerk via webhook) ────────────
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),              // Clerk user id (user_xxx)
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 120 }),
  avatarUrl: text('avatar_url'),
  phone: varchar('phone', { length: 20 }),
  locale: varchar('locale', { length: 5 }).default('es'),
  marketingConsent: boolean('marketing_consent').default(false),
  txBalance: integer('tx_balance').default(0),
  txLifetime: integer('tx_lifetime').default(0),
  level: varchar('level', { length: 20 }).default('aventurero'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── SUPPLIERS (Clerk Organizations) ────────────────────
export const suppliers = pgTable('suppliers', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkOrgId: text('clerk_org_id').notNull().unique(), // org_xxx
  legalName: varchar('legal_name', { length: 200 }).notNull(),
  brandName: varchar('brand_name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  vertical: verticalEnum('vertical').notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  website: text('website'),
  description: text('description'),
  country: varchar('country', { length: 2 }).default('ES'),
  city: varchar('city', { length: 120 }),
  address: text('address'),
  lat: numeric('lat', { precision: 10, scale: 7 }),
  lng: numeric('lng', { precision: 10, scale: 7 }),
  stripeConnectAccountId: text('stripe_connect_account_id'),
  bookingSystem: varchar('booking_system', { length: 30 }), // bokun|turitop|ical|none
  externalId: text('external_id'),
  commissionRate: numeric('commission_rate', { precision: 4, scale: 3 }).default('0.150'),
  commissionFreeUntil: timestamp('commission_free_until'),
  verified: boolean('verified').default(false),
  insuranceValidUntil: timestamp('insurance_valid_until'),
  status: supplierStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── PRODUCTS (polimórfico: 4 verticales) ───────────────
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  supplierId: uuid('supplier_id').references(() => suppliers.id, { onDelete: 'cascade' }).notNull(),
  vertical: verticalEnum('vertical').notNull(),
  category: varchar('category', { length: 64 }),     // 'surf' | 'kitesurf' | ...
  element: elementEnum('element'),                    // solo activity
  sport: varchar('sport', { length: 64 }),            // legacy compat
  icon: varchar('icon', { length: 16 }),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 160 }).notNull().unique(),
  description: text('description'),
  includedItems: jsonb('included_items').default([]),
  durationMinutes: integer('duration_minutes'),
  difficulty: integer('difficulty'),                  // 1-5
  minParticipants: integer('min_participants').default(1),
  maxParticipants: integer('max_participants').default(8),
  minAge: integer('min_age').default(0),
  basePriceCents: integer('base_price_cents').notNull(),
  currency: varchar('currency', { length: 3 }).default('EUR'),
  requiresCertification: varchar('requires_certification', { length: 30 }),
  requiresWaiver: boolean('requires_waiver').default(false),
  cancellationPolicy: varchar('cancellation_policy', { length: 16 }), // hard|soft|flexible
  lat: numeric('lat', { precision: 10, scale: 7 }),
  lng: numeric('lng', { precision: 10, scale: 7 }),
  locationCity: varchar('location_city', { length: 120 }),
  locationRegion: varchar('location_region', { length: 120 }),
  hub: varchar('hub', { length: 60 }),                // 'cantabria'|'pirineo'|'canarias'|...
  images: jsonb('images').default([]),                // Cloudinary public_ids
  status: varchar('status', { length: 16 }).default('draft'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── AVAILABILITY (allotment dedicado) ──────────────────
export const availability = pgTable('availability', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  startAt: timestamp('start_at', { withTimezone: true }).notNull(),
  endAt: timestamp('end_at', { withTimezone: true }).notNull(),
  capacity: integer('capacity').notNull(),
  booked: integer('booked').default(0),
  priceCents: integer('price_cents'),                 // override del base
  priceModifierReason: varchar('price_modifier_reason', { length: 40 }),
  status: varchar('status', { length: 16 }).default('available'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── BOOKINGS ───────────────────────────────────────────
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 16 }).notNull().unique(),  // TX-XXXXXX
  userId: text('user_id').references(() => profiles.id),
  productId: uuid('product_id').references(() => products.id).notNull(),
  availabilityId: uuid('availability_id').references(() => availability.id).notNull(),
  supplierId: uuid('supplier_id').references(() => suppliers.id).notNull(),
  participants: integer('participants').notNull(),
  participantData: jsonb('participant_data'),
  totalCents: integer('total_cents').notNull(),
  commissionCents: integer('commission_cents').notNull(),
  supplierPayoutCents: integer('supplier_payout_cents').notNull(),
  status: statusEnum('status').default('pending'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  stripeTransferId: text('stripe_transfer_id'),
  waiverSignedAt: timestamp('waiver_signed_at'),
  voucherQr: text('voucher_qr'),
  checkedInAt: timestamp('checked_in_at'),
  cancelledAt: timestamp('cancelled_at'),
  cancellationReason: text('cancellation_reason'),
  weatherCancelled: boolean('weather_cancelled').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── PRE-BOOKINGS (mientras Stripe esté bloqueado) ──────
export const preBookings = pgTable('pre_bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id),
  userEmail: varchar('user_email', { length: 255 }).notNull(),
  userName: varchar('user_name', { length: 120 }),
  dateIso: varchar('date_iso', { length: 10 }),
  timeSlot: varchar('time_slot', { length: 5 }),
  people: integer('people').notNull().default(1),
  totalEur: integer('total_eur').notNull(),
  status: varchar('status', { length: 16 }).default('pending'),
  convertedBookingId: uuid('converted_booking_id').references(() => bookings.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── BUNDLES (V2+, multi-vertical) ──────────────────────
export const bundles = pgTable('bundles', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 160 }).notNull().unique(),
  description: text('description'),
  hub: varchar('hub', { length: 60 }),
  totalPriceCents: integer('total_price_cents').notNull(),
  discountPct: numeric('discount_pct', { precision: 4, scale: 2 }).default('0.15'),
  productIds: jsonb('product_ids').notNull(),         // UUID[]
  status: varchar('status', { length: 16 }).default('draft'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── TX TRANSACTIONS ────────────────────────────────────
export const txTransactions = pgTable('tx_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => profiles.id).notNull(),
  delta: integer('delta').notNull(),
  reason: varchar('reason', { length: 40 }).notNull(),
  relatedBookingId: uuid('related_booking_id').references(() => bookings.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── REVIEWS ────────────────────────────────────────────
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').references(() => bookings.id).notNull().unique(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  userId: text('user_id').references(() => profiles.id).notNull(),
  rating: integer('rating').notNull(),                 // 1-5
  text: text('text'),
  photos: jsonb('photos').default([]),                 // Cloudinary public_ids
  status: varchar('status', { length: 16 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── WAITLIST ───────────────────────────────────────────
export const waitlist = pgTable('waitlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 120 }),
  favoriteActivity: varchar('favorite_activity', { length: 64 }),
  postalCode: varchar('postal_code', { length: 10 }),
  source: varchar('source', { length: 30 }).default('web'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── ATTEMPTS (rate limiting) ───────────────────────────
export const attempts = pgTable('attempts', {
  ipHash: varchar('ip_hash', { length: 64 }).notNull(),
  endpoint: varchar('endpoint', { length: 60 }).notNull(),
  attemptedAt: timestamp('attempted_at').defaultNow().notNull(),
});
```

**Comandos Drizzle clave:**
```bash
pnpm drizzle-kit generate     # genera migración
pnpm drizzle-kit migrate      # aplica a Neon
pnpm drizzle-kit studio       # GUI tipo pgAdmin local
```

**Row Level Security:** Drizzle no la gestiona — escribir SQL manual en migración inicial (`ALTER TABLE products ENABLE ROW LEVEL SECURITY` + policies por rol Clerk).

---

## 🔐 3 · Auth (Clerk) — patrón de uso

### Setup base

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublic = createRouteMatcher([
  '/', '/actividades(.*)', '/packs(.*)', '/partner', '/guias(.*)',
  '/legal/(.*)', '/api/webhooks/(.*)', '/api/sitemap.xml',
]);
const isPartner = createRouteMatcher(['/(partner)/(.*)']);
const isAdmin   = createRouteMatcher(['/(admin)/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublic(req)) return;

  if (isAdmin(req)) {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'tx_admin') {
      return Response.redirect(new URL('/', req.url));
    }
  }

  if (isPartner(req)) {
    const { orgId } = await auth();
    if (!orgId) return Response.redirect(new URL('/partner/alta', req.url));
  }

  await auth.protect();
});
```

### Webhook sync Clerk → Neon

```ts
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { db, profiles, suppliers } from '@/lib/db';

export async function POST(req: Request) {
  const evt = await verifyWebhook(req);

  switch (evt.type) {
    case 'user.created':
    case 'user.updated':
      await db.insert(profiles).values({
        id: evt.data.id,
        email: evt.data.email_addresses[0].email_address,
        fullName: `${evt.data.first_name} ${evt.data.last_name}`,
      }).onConflictDoUpdate({ target: profiles.id, set: { /* … */ } });
      break;
    case 'organization.created':
      // Crear supplier en Neon vinculado al clerk_org_id
      break;
  }
  return new Response('OK');
}
```

### Helpers

```ts
// lib/auth.ts
import { auth, currentUser } from '@clerk/nextjs/server';

export async function getCurrentProfile() {
  const { userId } = await auth();
  if (!userId) return null;
  return db.query.profiles.findFirst({ where: eq(profiles.id, userId) });
}

export async function requireRole(role: 'customer' | 'partner_admin' | 'tx_admin') {
  const { sessionClaims } = await auth();
  if (sessionClaims?.metadata?.role !== role) throw new Error('Unauthorized');
}
```

---

## 💳 4 · Stripe Connect Express — patrón de uso

### Onboarding partner (10 min)

```ts
// app/api/stripe/connect/onboard/route.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { supplierId, email } = await req.json();

  // 1. Crear cuenta Connect Express
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'ES',
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: 'company',
    metadata: { supplier_id: supplierId },
  });

  // 2. Generar link onboarding (KYC en 10 min)
  const link = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/partner/onboarding/refresh`,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/partner/onboarding/complete`,
    type: 'account_onboarding',
  });

  // 3. Guardar account.id en suppliers
  await db.update(suppliers).set({ stripeConnectAccountId: account.id })
    .where(eq(suppliers.id, supplierId));

  return Response.json({ url: link.url });
}
```

### Checkout con split automático

```ts
// app/api/stripe/checkout/route.ts
export async function POST(req: Request) {
  const { productId, availabilityId, participants, customerEmail } = await req.json();

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: { supplier: true },
  });

  const totalCents = product.basePriceCents * participants;
  const commissionRate = product.supplier.commissionFreeUntil > new Date()
    ? 0 : Number(product.supplier.commissionRate);
  const commissionCents = Math.round(totalCents * commissionRate);
  const supplierCents = totalCents - commissionCents;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: customerEmail,
    line_items: [{
      price_data: {
        currency: 'eur',
        unit_amount: totalCents,
        product_data: { name: product.title, images: product.images },
      },
      quantity: 1,
    }],
    payment_intent_data: {
      application_fee_amount: commissionCents,          // ← TripXtrem retiene
      transfer_data: { destination: product.supplier.stripeConnectAccountId },
    },
    success_url: `${SITE}/reservas/{CHECKOUT_SESSION_ID}/success`,
    cancel_url: `${SITE}/actividades/${product.slug}`,
    metadata: { productId, availabilityId, participants },
  });

  return Response.json({ url: session.url });
}
```

### Webhook confirma reserva

```ts
// app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const event = stripe.webhooks.constructEvent(/* … */);

  switch (event.type) {
    case 'payment_intent.succeeded':
      // 1. Crear booking
      // 2. Incrementar availability.booked
      // 3. Generar voucher QR (qrcode lib)
      // 4. Enviar email confirmación (Resend)
      // 5. Sumar +200 TX al user
      break;
    case 'charge.refunded':
      // Marcar booking como refunded, devolver TX, etc.
      break;
  }
  return new Response('OK');
}
```

---

## 📸 5 · Storage (Cloudinary + Uploadthing)

### Cloudinary para fotos finales (con CDN + transforms)

```ts
// lib/cloudinary.ts
export const cld = {
  url: (publicId: string, opts: { w?: number; h?: number; q?: number } = {}) => {
    const { w = 1200, h, q = 80 } = opts;
    const transform = [`w_${w}`, h ? `h_${h}` : '', `q_${q}`, 'f_auto', 'c_fill'].filter(Boolean).join(',');
    return `https://res.cloudinary.com/tripxtrem/image/upload/${transform}/${publicId}`;
  },
};
```

### Uploadthing para subida del partner (UX premium)

```tsx
// components/partner/photo-uploader.tsx
'use client';
import { UploadButton } from '@uploadthing/react';

export function PhotoUploader({ onUpload }: { onUpload: (urls: string[]) => void }) {
  return (
    <UploadButton
      endpoint="productPhotos"
      onClientUploadComplete={(res) => onUpload(res.map(r => r.url))}
      onUploadError={(err) => toast.error(err.message)}
    />
  );
}
```

```ts
// app/api/uploadthing/core.ts
export const ourFileRouter = {
  productPhotos: f({ image: { maxFileSize: '8MB', maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      const { userId, orgId } = await auth();
      if (!userId || !orgId) throw new UploadThingError('Unauthorized');
      return { userId, orgId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Mover de uploadthing → cloudinary (con transforms)
      await uploadToCloudinary(file.url, { folder: `products/${metadata.orgId}` });
    }),
};
```

---

## 📧 6 · Emails (Resend + React Email)

```tsx
// emails/booking-confirmation.tsx
import { Html, Head, Body, Container, Section, Text, Button, Img } from '@react-email/components';

export default function BookingConfirmation({ booking, product }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#FAF4E8' }}>
        <Container>
          <Section>
            <Img src={`${SITE}/og-default.png`} width="600" />
            <Text style={{ fontSize: 22, fontWeight: 800, color: '#1A2B4A' }}>
              ¡Reserva confirmada, {booking.userName}!
            </Text>
            <Text>Tu aventura de {product.sport} en {product.locationCity} te espera.</Text>
            <Button href={`${SITE}/reservas/${booking.code}`}
                    style={{ backgroundColor: '#8B1F2B', color: '#fff', padding: '12px 24px', borderRadius: 12 }}>
              Ver mi voucher
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

```ts
// lib/resend.ts
import { Resend } from 'resend';
import BookingConfirmation from '@/emails/booking-confirmation';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendBookingConfirmation(booking, product) {
  await resend.emails.send({
    from: 'TripXtrem <hola@tripxtrem.com>',
    to: booking.userEmail,
    subject: `Reserva ${booking.code} confirmada`,
    react: BookingConfirmation({ booking, product }),
  });
}
```

---

## 🚀 7 · Caching (Upstash Redis)

```ts
// lib/cache.ts
import { Redis } from '@upstash/redis';
const redis = Redis.fromEnv();

export async function cached<T>(key: string, ttlSec: number, fn: () => Promise<T>): Promise<T> {
  const hit = await redis.get<T>(key);
  if (hit !== null) return hit;
  const fresh = await fn();
  await redis.setex(key, ttlSec, fresh);
  return fresh;
}

// Uso típico
export const getProductBySlug = (slug: string) =>
  cached(`product:${slug}`, 300, () =>
    db.query.products.findFirst({ where: eq(products.slug, slug), with: { supplier: true } })
  );
```

Casos donde se usa:
- Lista de productos públicos (TTL 300s)
- Producto individual (TTL 300s, invalida al editar)
- Sitemap generado (TTL 3600s)
- Rate limiting por IP (sin TTL, contador por ventana deslizante)

---

## 🗺️ 8 · Mapa (Leaflet — gratis vs Mapbox premium)

**Leaflet** (recomendado V1): gratis, sin API key, tiles CartoDB.

```tsx
// components/map/map.tsx
'use client';
import dynamic from 'next/dynamic';

// Leaflet no funciona en SSR, dynamic import obligatorio
const LeafletMap = dynamic(() => import('./leaflet-map'), { ssr: false });

export function ProductMap({ products }) {
  return <LeafletMap products={products} />;
}
```

**Mapbox** (V2+ si necesitas custom styles): $0 hasta 50K loads/mes.

---

## 📊 9 · Sprint plan ajustado al stack

### Mes 1 · Bootstrap stack
- [ ] Crear repo Next.js 15 + TypeScript + Tailwind v4 limpio
- [ ] Setup Clerk con Organizations habilitado
- [ ] Conectar Neon, generar schema Drizzle desde productos actuales
- [ ] Migrar 130 seeds (script de migración HTML→Drizzle)
- [ ] Deploy Vercel con previews por PR
- [ ] Conectar Upstash Redis para cache
- [ ] Webhook Clerk → Neon (user sync)

### Mes 2 · Frontend MVP
- [ ] Home `/` con mapa + cards (Server Components + Client Map)
- [ ] Listado `/actividades` con filtros (RSC streaming)
- [ ] Ficha `/actividades/[vertical]/[cat]/[slug]` (SSR + ISR)
- [ ] Booking modal client-side
- [ ] Sistema TX inicial (read-only)
- [ ] Páginas legales migradas

### Mes 3 · Backend + pagos
- [ ] Stripe Connect Express onboarding
- [ ] Checkout flow completo + webhook
- [ ] Voucher PDF + QR (qrcode lib + react-pdf)
- [ ] Email transaccional (Resend + React Email): welcome, booking, reminder
- [ ] Reviews moderation
- [ ] Admin dashboard básico

### Mes 4 · Partner experience
- [ ] Panel partner: dashboard + productos CRUD + calendario + reservas + pagos
- [ ] Uploadthing para fotos
- [ ] PWA check-in con QR scanner
- [ ] Sello Verified + auditoría manual flow

### Mes 5 · SEO + marketing
- [ ] Sitemap.xml dinámico
- [ ] JSON-LD structured data por producto
- [ ] 30 páginas pilar `/guias/[sport]-[location]`
- [ ] OG dinámicas `/api/og/[type]`
- [ ] Analytics: Plausible + GA4 + Meta Pixel events

### Mes 6 · Polish + launch
- [ ] Lighthouse audit (target >90 mobile)
- [ ] A11y audit WCAG AA
- [ ] Internationalization: ES + EN
- [ ] Cron meteo + cancelación auto
- [ ] WhatsApp Business (Wati)
- [ ] Soft launch a 100 usuarios de waitlist

---

## ⛔ 10 · Anti-decisiones técnicas

Cosas que **explícitamente NO se usan** y por qué:

| Tech | Por qué NO |
|---|---|
| **Pages Router** | App Router es estable desde 2024, RSC requeridos para SEO |
| **Supabase Auth** | Clerk es mejor en multi-tenant (Organizations), más caro pero ahorra meses |
| **Prisma** | 10× más lento que Drizzle en cold-start serverless |
| **Auth.js / NextAuth** | DIY trade-off no compensa frente a Clerk para marketplace multi-tenant |
| **Firebase / Firestore** | No-SQL no encaja con marketplace transaccional |
| **MongoDB** | Mismo motivo |
| **PlanetScale** | Cerró rama gratuita 2024 + sin row-level security |
| **Render / Railway** | Vercel tiene mejor integración nativa Neon + Clerk |
| **AWS S3 directo** | Cloudinary aporta transforms on-the-fly por menos overhead |
| **SendGrid / Mailgun** | Resend tiene mejor DX + React Email integration |
| **Postmark** | Bueno pero más caro y sin React Email |
| **Twilio SMS** | WhatsApp es preferido por target latino europeo, SMS solo fallback |
| **OneSignal** | Push notifications nativas de PWA son suficientes |
| **Algolia (al inicio)** | Carísimo. Búsqueda full-text de Postgres + Drizzle vale hasta ~500 productos |
| **Sanity / Contentful** | No tenemos contenido editorial complejo, Markdown en repo basta para guías |
| **Strapi / Directus** | El admin lo construyes tú con shadcn — más control, menos sorpresas |
| **GraphQL** | RSC + Server Actions reemplazan el caso de uso. REST + Drizzle es más simple |
| **tRPC** | Server Actions de Next 15 cubren el 80% del caso. tRPC para APIs públicas si llegan |
| **Redux / Zustand global** | RSC + Server Actions + URL state (`useSearchParams`) eliminan el 90% del state |
| **Storybook** | Overhead alto, mejor isolation tests con Playwright |

---

## 🔐 11 · Variables de entorno

```env
# Next.js + Vercel
NEXT_PUBLIC_SITE_URL=https://tripxtrem.com

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_…
CLERK_SECRET_KEY=sk_…
CLERK_WEBHOOK_SECRET=whsec_…
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# Neon
DATABASE_URL=postgresql://…@…neon.tech/tripxtrem?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://…@…neon.tech/tripxtrem?sslmode=require

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://…
UPSTASH_REDIS_REST_TOKEN=…

# Stripe (bloqueado hasta SL+seguro)
STRIPE_SECRET_KEY=sk_…
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_…
STRIPE_WEBHOOK_SECRET=whsec_…
STRIPE_CONNECT_CLIENT_ID=ca_…

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tripxtrem
CLOUDINARY_API_KEY=…
CLOUDINARY_API_SECRET=…

# Uploadthing
UPLOADTHING_TOKEN=…

# Resend
RESEND_API_KEY=re_…
RESEND_FROM_EMAIL=hola@tripxtrem.com

# Maps (Mapbox opcional)
NEXT_PUBLIC_MAPBOX_TOKEN=…

# WhatsApp (Wati)
WATI_API_KEY=…
WATI_TENANT_ID=…

# Meteo
OPENWEATHER_API_KEY=…
STORMGLASS_API_KEY=…

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=tripxtrem.com
NEXT_PUBLIC_GA_ID=G-…
NEXT_PUBLIC_META_PIXEL_ID=…

# Sentry
NEXT_PUBLIC_SENTRY_DSN=…
SENTRY_AUTH_TOKEN=…

# Internal
INTERNAL_CRON_SECRET=…
ADMIN_NOTIFICATION_EMAIL=admin@tripxtrem.com
```

---

## ✅ 12 · Definition of Done (por feature)

- [ ] TypeScript strict — sin `any`
- [ ] Drizzle queries tipadas
- [ ] Tests unitarios (Vitest) cubren lógica de negocio
- [ ] Tests integración (Vitest + Neon branch) en CI
- [ ] Lighthouse mobile >90, desktop >95
- [ ] WCAG AA (axe DevTools clean)
- [ ] Responsive 360-2560px
- [ ] Clerk role check si aplica
- [ ] RLS policy si toca datos sensibles
- [ ] Webhook idempotente si toca dinero
- [ ] Sentry error boundary
- [ ] Documentado en `docs/[feature].md`
- [ ] PR preview en Vercel funcional con Neon branch
- [ ] Email transaccional probado en `/api/test-emails`
- [ ] Eventos analytics emitidos

---

## 🔗 13 · Referencias rápidas

| Recurso | Link |
|---|---|
| Next.js 15 docs | https://nextjs.org/docs |
| Clerk docs (Organizations) | https://clerk.com/docs/organizations/overview |
| Drizzle ORM | https://orm.drizzle.team |
| Neon | https://neon.tech/docs |
| Upstash Redis | https://upstash.com/docs/redis |
| Stripe Connect Express | https://stripe.com/docs/connect/express-accounts |
| Cloudinary | https://cloudinary.com/documentation/transformation_reference |
| Uploadthing | https://docs.uploadthing.com |
| Resend + React Email | https://resend.com/docs/send-with-react |
| shadcn/ui | https://ui.shadcn.com |
| Tailwind v4 | https://tailwindcss.com/docs |

---

## 📋 14 · Migración desde stack actual

**Estado hoy:** HTML estático (`index.html` ~3500 líneas) + Vercel Functions TypeScript + Neon (schema básico) + 130 seeds.

**Pasos de migración:**

1. **Crear repo paralelo `tripxtrem-v2/`** con `create-next-app@latest`. No tocar `tripxtrem/` actual.
2. **Generar schema Drizzle** desde la DB Neon actual (`drizzle-kit pull`) → archivo `schema.ts`.
3. **Refactorizar schema**: rename `experiences` → `products` con `vertical='activity'`. Añadir tablas que faltan (bundles, txTransactions, etc.).
4. **Script de migración seeds**: lee de tabla `experiences` actual, mapea a `products` nuevo, inserta.
5. **Reimplementar features uno a uno** siguiendo el sprint plan §9. No big-bang.
6. **Cuando v2 cubra el 100% de v1**, apuntar dominio `tripxtrem.com` al deploy de v2. Mantener v1 como backup 30 días.
7. **Borrar v1** tras período de validación.

**Tiempo estimado:** 4-6 meses desarrollo solo + 1 mes hardening = ~6 meses con un dev a tiempo completo.

---

> **Documento mantenido por:** Adrián M.
> **Última revisión:** mayo 2026
> **Versión:** v2.0 — stack óptimo TripXtrem 2026
