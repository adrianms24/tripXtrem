# TripXtrem · Product Specification v1.0

> **Misión:** ser el marketplace nº1 de aventura y deportes extremos donde un europeo reserva el journey completo (actividad + dormir + transporte + cena) en una sola transacción.
>
> **Slogan:** Reserva la adrenalina. Vívela después.
>
> **Target:** adultos 22-45 años con poder adquisitivo medio-alto, residentes en Europa, buscando experiencias auténticas con seguridad garantizada.
>
> **Competidores monoproducto:** Civitatis, GetYourGuide, Manawa, Viator. Diferenciador: bundle multi-vertical en un solo checkout.

---

## 📐 Leyenda de prioridad

- **🔴 MVP** — Imprescindible para lanzar (mes 1-3)
- **🟡 V1** — Antes del primer fundraising serio (mes 4-6)
- **🟢 V2** — Después de PMF inicial (mes 7-12)
- **⚪ V3+** — Cuando haya tracción consolidada

---

## 👤 1 · Cliente final

### 1.1 Descubrimiento

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 1.1.1 | **Mapa interactivo** con pins | 🔴 | Pin = icono del deporte + color por dificultad. Click → tarjeta flotante. Bounds auto-ajustables. |
| 1.1.2 | **Lista de cards** en sidebar | 🔴 | Grid responsive, hover sincroniza con mapa, click abre ficha. |
| 1.1.3 | **Toggle mapa/lista** desktop | 🔴 | Botón ocultar mapa → cards a 7 columnas. Persiste en localStorage. |
| 1.1.4 | **Toggle Lista/Mapa** mobile | 🔴 | Tab bar inferior. |
| 1.1.5 | **Filtros**: categoría (Agua/Aire/Nieve/Tierra) | 🔴 | Tabs sticky bajo nav. |
| 1.1.6 | **Filtros**: deporte (40+) | 🔴 | Sport bar scrollable con icono + nombre + adrenalina ●●●●●. |
| 1.1.7 | **Filtros**: dificultad (Baja/Media/Alta) | 🔴 | Multi-select chips. |
| 1.1.8 | **Filtros**: precio (rango) | 🔴 | Slider 0-400+ €. |
| 1.1.9 | **Filtros**: fecha disponible | 🟡 | Date picker → solo muestra productos con slots. |
| 1.1.10 | **Filtros**: hub geográfico | 🟡 | Cantabria, Pirineo, Canarias, Galicia, etc. |
| 1.1.11 | **Filtros**: duración | 🟡 | <2h, 2-4h, jornada, multi-día. |
| 1.1.12 | **Búsqueda por texto libre** | 🟡 | Algolia/Typesense cuando catálogo > 500. |
| 1.1.13 | **Ordenación**: valorados / precio asc / precio desc / cercanía | 🔴 | Dropdown en sidebar. |
| 1.1.14 | **Geolocalización opt-in** | 🟡 | "Ver cerca de mí" — usa Geolocation API. |
| 1.1.15 | **Clustering de pins** | 🟡 | Cuando hay >50 pins juntos. |

### 1.2 Ficha de producto (detail page)

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 1.2.1 | **Hero gallery** | 🔴 | 4-tile mosaic con foto principal + 3 laterales. Lightbox al click. |
| 1.2.2 | **Título + ubicación + rating + reseñas** | 🔴 | Header estilo Airbnb. |
| 1.2.3 | **Card del partner** | 🔴 | Avatar, nombre, sello "Verified", años de experiencia. |
| 1.2.4 | **Highlights** (3-4 puntos clave) | 🔴 | Cancelación flexible, material incluido, partner verified, etc. |
| 1.2.5 | **Descripción** larga | 🔴 | Markdown con secciones (qué harás, qué incluye, qué traer). |
| 1.2.6 | **Lista de inclusiones** | 🔴 | Checks visuales: instructor, equipo, seguro, fotos, etc. |
| 1.2.7 | **Mapa mini con pin** | 🔴 | Ubicación exacta solo tras reserva confirmada. |
| 1.2.8 | **Reseñas verificadas** | 🔴 | Solo de clientes que completaron la actividad. Avatar + nombre + estrellas + texto + foto. |
| 1.2.9 | **Filtrar reseñas**: 5★/4★/3★/2★/1★ + con fotos | 🟡 | |
| 1.2.10 | **FAQ** | 🟡 | Preguntas frecuentes específicas del deporte. |
| 1.2.11 | **"Otras experiencias del partner"** | 🟡 | Cross-sell de productos del mismo proveedor. |
| 1.2.12 | **"Similares cerca"** | 🟡 | Recomendaciones algorítmicas. |
| 1.2.13 | **Share** (link, WhatsApp, Instagram) | 🟡 | navigator.share API. |
| 1.2.14 | **Save** (wishlist) | 🔴 | Corazón, requiere login para persistir. |

### 1.3 Booking / Reserva

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 1.3.1 | **Calendario disponibilidad** | 🔴 | 30-60 días vista. Días con slots verdes, llenos rojos. |
| 1.3.2 | **Time slots** del día seleccionado | 🔴 | Pills horarias con plazas restantes. |
| 1.3.3 | **People stepper** | 🔴 | -/+ con max según slot. |
| 1.3.4 | **Precio total dinámico** | 🔴 | Recalcula al cambiar personas/extras. |
| 1.3.5 | **Add-ons opcionales** | 🟡 | Seguro premium, equipo upgrade, fotos pro, transporte hotel↔punto. |
| 1.3.6 | **Datos de cada participante** | 🔴 | Nombre, edad, certificaciones (si requiere). Email contacto principal. |
| 1.3.7 | **Login o checkout invitado** | 🔴 | Permite invitado con email obligatorio + opción "Crear cuenta para puntos TX". |
| 1.3.8 | **T&C + política cancelación específica** | 🔴 | Lectura obligatoria + checkbox. |
| 1.3.9 | **Waiver digital** firmable | 🟡 | Solo para hard adventure (paracaidismo, BASE, etc.). Firma con dedo/mouse. |
| 1.3.10 | **Pago Stripe** | 🟡 | Card, Apple Pay, Google Pay, SEPA, Bizum. Bloqueado hasta SL + seguro + cuenta aprobada. |
| 1.3.11 | **Voucher PDF + QR** | 🟡 | Auto-generado, descargable, enviado por email. |
| 1.3.12 | **Confirmación email** | 🔴 | Resend con plantilla branded. |
| 1.3.13 | **Confirmación WhatsApp** opt-in | 🟢 | Wati/Respond.io API. |
| 1.3.14 | **Calendar invite** (.ics) | 🟡 | Adjunto al email. |
| 1.3.15 | **Recordatorio 24h antes** | 🟡 | Email + WhatsApp opt-in. |
| 1.3.16 | **Post-experiencia: pedir review** | 🟡 | Email 24h después con +50 TX si responde. |
| 1.3.17 | **Pre-reserva (sin cobro)** | 🔴 | Mientras Stripe esté bloqueado, sistema de pre-booking en lista prioritaria. |

### 1.4 Mi cuenta

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 1.4.1 | **Perfil**: nombre, foto, teléfono, idioma | 🔴 | |
| 1.4.2 | **Próximos viajes** | 🔴 | Countdown + recordatorios + descarga voucher. |
| 1.4.3 | **Historial** | 🔴 | Lista de reservas pasadas + facturas PDF. |
| 1.4.4 | **Favoritos** (wishlist) | 🔴 | Grid de cards guardadas. |
| 1.4.5 | **Recompensas TX** | 🟡 | Saldo, historial, canjear → ver §1.5. |
| 1.4.6 | **Referidos** | 🟢 | Link único + tracking. +300 TX por amigo que reserve. |
| 1.4.7 | **Notificaciones** prefs | 🟡 | Email / WhatsApp / push. Toggle por tipo. |
| 1.4.8 | **Cerrar cuenta** | 🔴 | GDPR right-to-be-forgotten. Borrado real en 30 días. |
| 1.4.9 | **Descargar mis datos** | 🟡 | GDPR portability. JSON con todo. |

### 1.5 Gamificación TX

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 1.5.1 | **Saldo TX** (1 TX = 0,01 €) | 🟡 | Visible en perfil + dropdown. |
| 1.5.2 | **Ganar**: completar reserva (+200 TX) | 🟡 | |
| 1.5.3 | **Ganar**: reseña >100 chars + foto (+50 TX) | 🟡 | |
| 1.5.4 | **Ganar**: referido que reserva (+300 TX) | 🟢 | |
| 1.5.5 | **Ganar**: bundle (+500 TX) | 🟢 | |
| 1.5.6 | **Ganar**: cumpleaños (+100 TX) | 🟢 | |
| 1.5.7 | **Canjear**: 1.000 TX = 10€ descuento | 🟡 | Mínimo canje 500 TX. |
| 1.5.8 | **Caducidad**: 18 meses sin actividad | 🟢 | |
| 1.5.9 | **Tiers**: Aventurero / Extremo / Leyenda | 🟢 | Visual, sin permisos diferenciados en V1. |
| 1.5.10 | **Histórico TX** | 🟡 | Tabla con +/- y motivo. |

### 1.6 Auth

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 1.6.1 | **Email magic link** (passwordless) | 🟡 | Resend. |
| 1.6.2 | **Google OAuth** | 🟡 | |
| 1.6.3 | **Apple OAuth** | 🟢 | |
| 1.6.4 | **Verificación email** obligatoria antes de reservar | 🔴 | |
| 1.6.5 | **MFA** (SMS o app) | ⚪ | Para partners + admin. |
| 1.6.6 | **Reset password** | 🟡 | Si hay clásico email+password. |

### 1.7 Otros

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 1.7.1 | **Multi-idioma**: ES (default), EN, FR, DE | 🟡 | next-intl o equivalente. Rutas `/es`, `/en`. |
| 1.7.2 | **Multi-divisa**: EUR (default), GBP, USD | 🟢 | Conversión en tiempo real. |
| 1.7.3 | **Cookie banner GDPR** | 🔴 | Si se añaden trackers no esenciales. Hoy con Plausible no hace falta. |
| 1.7.4 | **Cambio de tema oscuro** | ⚪ | Solo si encaja con brand. |

---

## 🏢 2 · Partner

### 2.1 Onboarding

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 2.1.1 | **Formulario 6 pasos** | 🔴 | Tipo servicio → empresa → actividad → ubicación (Google Places) → fotos → revisión. |
| 2.1.2 | **Upload de docs**: seguro RC, CIF, certificaciones (PADI, federación, etc.) | 🔴 | Cloudinary/Supabase Storage. |
| 2.1.3 | **Stripe Connect Express KYC** | 🟡 | Flujo embebido. |
| 2.1.4 | **Aprobación manual admin** | 🔴 | Estado: pending → approved/rejected. Email automático. |
| 2.1.5 | **Email "Solicitud recibida"** | 🔴 | Resend con copy "te contactamos en 24-48h". |
| 2.1.6 | **Email "Aprobado"** + onboarding video | 🟡 | |
| 2.1.7 | **Contrato v0 PDF** | 🟡 | jsPDF: cláusulas básicas, 0% comisión 90 días, política cancelación. Firma electrónica. |

### 2.2 Dashboard

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 2.2.1 | **Próximas reservas 24h** | 🔴 | Lista con nombre, hora, personas. |
| 2.2.2 | **Ingresos del mes** | 🟡 | Total bruto + comisión TripXtrem + payout neto. |
| 2.2.3 | **NPS / valoración media** | 🟡 | Última semana / mes / año. |
| 2.2.4 | **Comisión actual** | 🟡 | "0% durante 67 días más" o "15% por reserva". |
| 2.2.5 | **Notificaciones**: nueva reserva, cancelación, review | 🔴 | Bell con badge. |

### 2.3 Gestión de productos

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 2.3.1 | **CRUD experiencias** | 🔴 | Crear/editar/duplicar/archivar. |
| 2.3.2 | **Editor con preview live** | 🟡 | Split-pane: form izq, preview de la ficha real der. |
| 2.3.3 | **Upload de fotos** drag&drop | 🔴 | Múltiples, reordenables, crop automático 16:9. |
| 2.3.4 | **Pricing rules** | 🟡 | Precio base + premium temporada + descuento grupos. |
| 2.3.5 | **Capacity** | 🔴 | Máximo por slot. |
| 2.3.6 | **Slots de disponibilidad** | 🔴 | Por día + hora + capacidad. Bulk create (lunes-viernes, todos los meses). |
| 2.3.7 | **Bloqueo masivo** | 🟡 | Vacaciones, mantenimiento, etc. |
| 2.3.8 | **Política cancelación** por producto | 🟡 | Hard/Soft/Flexible. |
| 2.3.9 | **Requisitos** | 🟡 | Edad mínima, certificación previa, peso máximo, etc. |
| 2.3.10 | **Estado**: borrador / publicado / pausado / archivado | 🔴 | |

### 2.4 Calendario

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 2.4.1 | **Vista mensual** | 🟡 | Color-coded: verde=disponible, amarillo=parcial, rojo=lleno, gris=bloqueado. |
| 2.4.2 | **Click día → detalle** | 🟡 | Bookings + slots libres + capacidad. |
| 2.4.3 | **Sync iCal saliente** | 🟢 | URL `/api/ical/<partner-id>` para importar en Google Cal / Outlook. |
| 2.4.4 | **Sync iCal entrante** | 🟢 | Lee calendario externo del partner, bloquea slots ocupados. |

### 2.5 Reservas

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 2.5.1 | **Lista filtrable** | 🔴 | Por status, fecha, producto. |
| 2.5.2 | **Detail de reserva** | 🔴 | Datos cliente + participantes + waiver + voucher + total. |
| 2.5.3 | **Check-in manual** | 🟡 | Botón "Marcar como presentado". |
| 2.5.4 | **Cancelación masiva por meteo** | 🟢 | "Cancelar todas las reservas de mañana de [producto X]" → refund auto + email cliente + 100 TX. |
| 2.5.5 | **Export CSV** | 🟡 | Para contabilidad. |
| 2.5.6 | **Mensajería con cliente** | 🟢 | Vía WhatsApp Business. |

### 2.6 Pagos

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 2.6.1 | **Payouts Stripe Connect** | 🟡 | Lista, próximo payout (7 días post-checkin), histórico. |
| 2.6.2 | **Facturas TripXtrem→Partner** | 🟡 | PDF con comisión cobrada. |
| 2.6.3 | **Datos fiscales** | 🟡 | NIF/CIF/VAT, IBAN, dirección fiscal. |

### 2.7 Ajustes

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 2.7.1 | **Perfil público** | 🔴 | Logo, bio, fotos del equipo. |
| 2.7.2 | **Datos de contacto** | 🔴 | Email, teléfono, web. |
| 2.7.3 | **Política cancelación propia** | 🟡 | Por defecto se aplica a todos los productos. |
| 2.7.4 | **Notificaciones** | 🟡 | Email / SMS / WhatsApp / push. |
| 2.7.5 | **API keys** (integraciones) | 🟢 | Bókun, TuriTop, FareHarbor, Regiondo. |

### 2.8 PWA check-in

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 2.8.1 | **App instalable** (Add to Home Screen) | 🟡 | Service worker + manifest. |
| 2.8.2 | **Login con cuenta partner** | 🟡 | Misma auth. |
| 2.8.3 | **Reservas del día offline** | 🟡 | IndexedDB cache. |
| 2.8.4 | **Scanner QR** | 🟡 | Camera API → marca `checked_in_at`. |
| 2.8.5 | **Plan B PDF** | 🟡 | Lista del día exportable sin conexión. |
| 2.8.6 | **Sync al recuperar red** | 🟡 | |

### 2.9 Sello "TripXtrem Verified"

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 2.9.1 | **Badge visual** en ficha + perfil partner | 🔴 | Asset SVG escudo. |
| 2.9.2 | **Auditoría manual primer año** | 🔴 | Seguro RC, certificaciones, videollamada con dueño. |
| 2.9.3 | **Re-verificación anual** | 🟢 | Cron + email recordatorio + bloqueo si no se renueva. |

---

## 🛡️ 3 · Admin (TripXtrem)

### 3.1 Dashboard

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 3.1.1 | **GMV** total / mes | 🔴 | Volumen transaccionado. |
| 3.1.2 | **Comisión** total / mes | 🔴 | Ingresos brutos TripXtrem. |
| 3.1.3 | **Partners** totales / activos / pending | 🔴 | |
| 3.1.4 | **Reservas** 24h / 7d / 30d | 🔴 | |
| 3.1.5 | **NPS** clientes + partners | 🟡 | |
| 3.1.6 | **Top 10 productos** del mes | 🟡 | |
| 3.1.7 | **CAC + ROAS** por canal | 🟢 | UTM tracking + spend. |
| 3.1.8 | **Funnel de conversión** | 🟡 | Pin click → ficha → reserva → pago. |

### 3.2 Gestión partners

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 3.2.1 | **Lista filtrable** | 🔴 | Status, vertical, hub, fecha alta. |
| 3.2.2 | **Detail partner** | 🔴 | Docs subidos, productos, reservas, payouts, notas internas. |
| 3.2.3 | **Acciones**: aprobar / rechazar / suspender / verificar | 🔴 | |
| 3.2.4 | **Email outreach template** | 🟡 | Personalizable por sport+ciudad. CSV import de leads. |

### 3.3 Gestión productos

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 3.3.1 | **Moderación pre-publish** | 🔴 | Cola de productos enviados, aprobar 1-click. |
| 3.3.2 | **Editor inline** | 🟡 | Corregir copy, fotos, taxonomía. |
| 3.3.3 | **Lista filtrable** | 🔴 | |

### 3.4 Usuarios

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 3.4.1 | **Buscar por email/nombre** | 🔴 | |
| 3.4.2 | **Historial reservas + TX + reviews** | 🔴 | |
| 3.4.3 | **Bloquear/desbloquear** | 🔴 | |
| 3.4.4 | **TX manuales** (compensaciones) | 🟡 | |

### 3.5 Reviews moderation

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 3.5.1 | **Cola pendientes** | 🟡 | |
| 3.5.2 | **Aprobar/rechazar/editar** | 🟡 | |
| 3.5.3 | **Auto-aprobar 4-5★** tras 24h sin reportes | 🟢 | |

### 3.6 Otros

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 3.6.1 | **Reembolsos + disputas** | 🟡 | Vía Stripe Refund API. |
| 3.6.2 | **Bulk operations** | 🟢 | Bulk approve, bulk email, etc. |
| 3.6.3 | **Audit log** | 🟡 | Quién hizo qué, cuándo. Para compliance. |

---

## 🌐 4 · Cross-cutting

### 4.1 Operativa

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 4.1.1 | **3 niveles de cancelación** | 🔴 | Hard adventure 48h / Soft 24h / Flexible. ENUM en código. |
| 4.1.2 | **Cancelación auto por meteo** | 🟢 | Cron diario lee OpenWeatherMap + Stormglass 24h antes. |
| 4.1.3 | **Sistema de waivers digitales** | 🟡 | Para hard adventure. Firma + timestamp + IP hash. |
| 4.1.4 | **Voucher con QR único** | 🟡 | Por booking. Página `/voucher/[code]` accesible. |
| 4.1.5 | **Allotment dedicado** | 🔴 | Partner reserva X plazas/slot en exclusiva. Liberación auto 24h antes si no se vende. |

### 4.2 Comunicación

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 4.2.1 | **Email transaccional** (Resend) | 🔴 | Welcome, confirmación, recordatorio, post-experiencia, partner notifs. |
| 4.2.2 | **WhatsApp Business** | 🟢 | Wati/Respond.io. Templates aprobados. SLA <2h en horario 8-22h. |
| 4.2.3 | **Push notifications** (PWA) | 🟢 | Recordatorios, ofertas, reviews. |
| 4.2.4 | **SMS fallback** | ⚪ | Si email + WhatsApp fallan. |

### 4.3 Integraciones externas

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 4.3.1 | **Bókun** | ⚪ | Pull availability + push bookings. Aplicación pendiente a partnerships@bokun.io. |
| 4.3.2 | **TuriTop** | ⚪ | Mismo patrón. |
| 4.3.3 | **iCal bidireccional** | 🟢 | Genérico para cualquier partner. |
| 4.3.4 | **Google Maps Places** | 🔴 | Ya implementado para onboarding partner. |
| 4.3.5 | **OpenWeatherMap + Stormglass** | 🟢 | Para cancelación meteo. |

### 4.4 SEO + tráfico

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 4.4.1 | **Sitemap.xml dinámico** | 🔴 | Generado on-demand desde productos publicados. |
| 4.4.2 | **Robots.txt** | 🔴 | Disallow de rutas privadas. |
| 4.4.3 | **Structured data JSON-LD** | 🔴 | Schema.org TouristTrip o Event por producto. |
| 4.4.4 | **OG + Twitter Card** | 🔴 | Meta tags por página. |
| 4.4.5 | **Canonical URLs** | 🔴 | |
| 4.4.6 | **Hreflang** | 🟡 | Cuando hay multi-idioma. |
| 4.4.7 | **Páginas pilar** `/actividades/[sport]/[location]` | 🟡 | 80-120 artículos primer año. Tabla contenidos, datos prácticos, productos embebidos. |
| 4.4.8 | **Blog editorial** `/blog/[slug]` | 🟢 | Contenido evergreen. |
| 4.4.9 | **Performance Lighthouse >90 mobile, >95 desktop** | 🔴 | WebP/AVIF, lazy loading, ISR, edge cache. |

### 4.5 Analytics

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 4.5.1 | **Plausible** (sin cookies) | 🔴 | Ya integrado. |
| 4.5.2 | **GA4** | 🟡 | Para reporting estándar inversor. |
| 4.5.3 | **Meta Pixel + Conversion API** | 🟢 | Para retargeting Instagram. |
| 4.5.4 | **TikTok Pixel** | 🟢 | |
| 4.5.5 | **Eventos custom**: view_product, start_checkout, complete_booking, bundle_view, redeem_tx, pin_click, ficha_open | 🔴 | |

### 4.6 Monitoring + Errores

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 4.6.1 | **Sentry** | 🔴 | Errors frontend + backend. |
| 4.6.2 | **Vercel Analytics** | 🔴 | Core Web Vitals reales. |
| 4.6.3 | **Logs estructurados** | 🟡 | JSON + correlación request-id. |
| 4.6.4 | **Healthcheck endpoint** | 🔴 | `/api/health` con DB + Stripe + Resend. |
| 4.6.5 | **Alertas** Slack/email | 🟡 | Si DB down, payment fail rate >2%, etc. |

### 4.7 Seguridad + compliance

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 4.7.1 | **Auth seguro** | 🔴 | HttpOnly cookies, CSRF, rate limit. |
| 4.7.2 | **Row Level Security** (Postgres) | 🔴 | Users solo ven sus reservas, partners solo sus productos. |
| 4.7.3 | **GDPR**: privacy policy, T&C, cookies | 🔴 | Páginas legales (ya existen). |
| 4.7.4 | **Right to be forgotten** | 🔴 | Borrado real en 30 días tras request. |
| 4.7.5 | **Data portability** | 🟡 | JSON export. |
| 4.7.6 | **Encriptación at-rest** | 🔴 | DB + storage. |
| 4.7.7 | **TLS 1.3** | 🔴 | Vercel default. |
| 4.7.8 | **Rate limiting** | 🔴 | Por IP en endpoints sensibles. |
| 4.7.9 | **Honeypot** + bot detection | 🔴 | En formularios públicos. Ya implementado. |
| 4.7.10 | **CAPTCHA invisible** | 🟡 | Cloudflare Turnstile en login + signup. |

### 4.8 Accessibility + UX

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 4.8.1 | **WCAG AA** | 🔴 | Audit con axe DevTools. |
| 4.8.2 | **Keyboard navigation** | 🔴 | Tab/Enter/Space en todo. |
| 4.8.3 | **Screen reader** | 🔴 | aria-labels correctos. |
| 4.8.4 | **Focus visible** | 🔴 | Outline dorado. Ya implementado. |
| 4.8.5 | **Responsive 360-2560px** | 🔴 | Sin scroll horizontal. |
| 4.8.6 | **Reduced motion** | 🔴 | `prefers-reduced-motion` respetado. Ya implementado. |
| 4.8.7 | **Tap targets >40px** | 🔴 | Mobile. |

---

## 🎨 5 · Brand + diseño

| # | Feature | Prio | Detalle |
|---|---|---|---|
| 5.1 | **Slogan**: "Reserva la adrenalina. Vívela después." | 🔴 | En hero, footer, meta, partner landing. |
| 5.2 | **Paleta**: navy #1A2B4A · dorado #C9A24A · vinoso #8B1F2B · crema #FAF4E8 | 🔴 | + acentos coral/mint/amber funcionales. |
| 5.3 | **Tipografías**: Syne (display) + Outfit (body) + JetBrains Mono (tech) | 🟡 | A validar visualmente. |
| 5.4 | **Iconografía**: SVG inline (Lucide) | 🟡 | Eliminar emojis de chrome (UI), mantener en categorías/contenido. |
| 5.5 | **Logo SVG** vectorial | 🔴 | Pin de mapa con figura cayendo. |
| 5.6 | **OG image** 1200×630 | 🔴 | Por share en redes. |
| 5.7 | **Favicon set completo** | 🔴 | 16px, 32px, 180px Apple. |
| 5.8 | **Sistema de espaciado 8px** | 🟡 | --s-1 a --s-16. |

---

## 📦 6 · Phase 2+ (cuando exista PMF)

### Bundles multi-vertical (la diferenciación clave)

| # | Feature | Detalle |
|---|---|---|
| 6.1 | **Bundle = actividad + alojamiento + transporte + restaurante** | Producto compuesto con descuento del 15% sobre suma de partes. |
| 6.2 | **Checkout único** | Un solo pago, payout distribuido a 4 partners diferentes. |
| 6.3 | **Calendar coordination** | Disponibilidad de los 4 sincronizada. |

### Verticals 2, 3, 4

- **Alojamiento**: surf houses, refugios, glamping aventura.
- **Transporte**: shuttles aeropuerto↔hub, alquiler de vans, transfers entre actividades.
- **Gastronomía**: restaurantes con experiencia local cerca de los hubs.

### Otras features V3+

- **Gift cards** redimibles
- **Group booking** (despedidas, corporate)
- **Affiliate program** (influencers cobran 5% de su tráfico convertido)
- **API pública** para tour operators externos
- **Mobile native apps** iOS/Android
- **VR previews** de actividades
- **Live tracking** GPS durante actividad (safety)
- **Marketplace de equipo** usado/alquiler

---

## ⛔ 7 · Out of scope (explícito)

Cosas que NO se construyen en V1, V2 ni V3 — son anti-features:

- **Reseñas/counters fabricados** (no urgency fake, no "X personas reservaron hoy" inventado)
- **Stripe antes de tener SL + seguro RC + cuenta aprobada**
- **Dark patterns** (urgencia falsa, ofertas que no acaban)
- **Marketing spam a waitlist** (frecuencia <1 email/2 semanas)
- **Comisión >20%** (rompe value prop al partner)
- **Aceptar partners sin seguro RC vigente**
- **Reservas sin política de cancelación clara**
- **Modo oscuro forzado** en componentes que no encajan
- **AI chatbots genéricos** (mejor 0 que uno malo)
- **Apps multi-país agresivamente al lanzar** (focus España primero, EU después)

---

## 🛠️ 8 · Tech stack (resumen)

> Decisión 28-may-2026: arrancar con stack actual, evaluar migración en mes 6-8.

| Capa | Hoy | Target migración |
|---|---|---|
| **Frontend** | HTML estático + Vercel Functions | Next.js 15 App Router |
| **DB** | Neon Postgres | Neon Postgres (sigue) |
| **ORM** | SQL directo | Drizzle |
| **Auth** | n/a (waitlist solo) | Clerk |
| **Storage** | n/a | Cloudinary |
| **Pagos** | Bloqueado | Stripe Connect Express |
| **Email** | Resend | Resend |
| **Hosting** | Vercel | Vercel |
| **Analytics** | Plausible | + GA4 cuando aplique |
| **Monitoring** | Vercel | + Sentry |
| **Mapas** | Google Maps | Mantener |

---

## ✅ 9 · Criterios de aceptación (por módulo)

Cada feature se considera completa cuando:

- [ ] Compila sin errores TypeScript estrictos
- [ ] Tests unitarios cubren lógica de negocio (Vitest)
- [ ] Lighthouse mobile >85, desktop >90
- [ ] WCAG AA verificado (axe DevTools)
- [ ] Responsive 360-2560px sin scroll horizontal
- [ ] RLS de DB configurado y testeado
- [ ] Documentado en `/docs/[modulo].md`
- [ ] Deployable en Vercel sin vars faltantes
- [ ] Si toca dinero: dual control + audit log
- [ ] Si toca datos personales: GDPR-compliant

---

## 🗓️ 10 · Sprint plan sugerido (3 meses MVP)

**Mes 1 · Foundation**
- Modelo polimórfico productos
- Pre-reservas
- Auth Clerk
- Analytics funnel
- SEO técnico básico

**Mes 2 · Operativa**
- Partner onboarding pulido + contratos
- Panel partner CRUD productos
- Calendario + availability
- Email transaccional completo
- Voucher PDF + QR

**Mes 3 · Launch prep**
- Stripe Connect (asumiendo SL+seguro listos)
- Captación 10 partners reales firmados
- 30 páginas pilar SEO
- PWA check-in
- WhatsApp Business
- Soft launch a waitlist
