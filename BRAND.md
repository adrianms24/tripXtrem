# TripXtrem — Brand Guidelines

> Sistema de marca oficial. Paleta A (vintage adventure) · Logo S1.

---

## 1. Esencia

| Atributo | Valor |
|---|---|
| **Tagline** | Deja de soñarlo. Resérvalo hoy. |
| **Promesa** | El marketplace Nº1 de turismo de aventura en España. |
| **One-liner** | Reserva deportes extremos con seguro y garantía total. |
| **Público** | 25–45 años, urbanitas con ganas de adrenalina · empresas de experiencias. |
| **Personalidad** | Audaz · auténtico · premium · cercano · vintage adventure. |
| **Voz** | Directa. Tú. Frases cortas. Datos concretos. |

Usa: aventura, plazas, reserva, garantía, experiencia.
Evita: soluciones, sinergias, disruptivo, próximamente sin fecha.

---

## 2. Paleta (oficial)

### Primarios

| Token CSS | HEX | Uso |
|---|---|---|
| `--brand` | **#8B1F2B** | Color de marca. Urgencia, acentos fuertes, últimas plazas. |
| `--brand-dk` | #6D1722 | Hover, sombras del brand. |
| `--brand-lt` | #A83240 | Acento claro opcional. |
| `--gold` | **#C9A24A** | CTA principal. Elementos clave (pins, botones). |
| `--gold-dk` | #A8843A | Hover de CTA. |
| `--gold-lt` | #E6C674 | Iluminado, highlights. |
| `--gold-tint` | #FDF4E6 | Fondos pill/badge dorado. |
| `--navy` | **#1A2B4A** | Texto principal, logo oscuro, headers. |
| `--navy-dk` | #0F1B33 | Variante fuerte. |
| `--cream` | **#FAF4E8** | Fondo base de app. Cálido, no blanco puro. |

### Categorías (pins de mapa + badges)

| Categoría | Primario | Fondo claro |
|---|---|---|
| 💧 Agua | `#1E6EA5` | `#DBEAFE` |
| 🌬️ Aire | `#C9A24A` (dorado) | `#FDF4E6` |
| ❄️ Nieve | `#64748B` (plata fría) | `#F1F5F9` |
| 🌍 Tierra | `#8B1F2B` (vinoso) | `#FDE8EA` |

### Neutros cálidos

`#6E5B3A` texto secundario · `#9A8A6B` texto terciario · `#E8DFCD` bordes · `#FAF4E8` bg app.

### Gradientes

```
--grad-brand:  linear-gradient(135deg, #8B1F2B, #6D1722);
--grad-gold:   linear-gradient(135deg, #E6C674, #C9A24A, #8A6E2A);
--grad-navy:   linear-gradient(135deg, #1A2B4A, #0F1B33);
--grad-hero:   linear-gradient(135deg, #6D1722 0%, #8B1F2B 50%, #1A2B4A 100%);
```

---

## 3. Tipografía

| Uso | Fuente | Pesos |
|---|---|---|
| **Wordmark / headlines impactantes** | **Bangers** | 400 (único) |
| **Títulos generales** | **Syne** | 700, 800, 900 |
| **Cuerpo / UI** | **Outfit** | 400, 500, 600, 700, 800 |

**Escala** (vars CSS `--fs-*`):
```
xs 10 · sm 12 · base 13 · md 15 · lg 18 · xl 22 · 2xl 28 · 3xl 36
```

**Regla de oro**: máximo 3 tamaños por sección.

---

## 4. Logo · S1

### Concepto

**X dorada sobre fondo vinoso cuadrado redondeado.** Dos diagonales gruesas rectas (`stroke-width:18` sobre viewBox 120). La X representa el cruce de caminos del aventurero + la letra central de "TripXtrem".

### Construcción

```svg
<svg viewBox="0 0 120 120">
  <rect width="120" height="120" rx="24" fill="#8B1F2B"/>
  <path d="M30 30 L90 90" stroke="#C9A24A" stroke-width="18"/>
  <path d="M90 30 L30 90" stroke="#C9A24A" stroke-width="18"/>
</svg>
```

### Variantes (`/assets/`)

| Archivo | Uso |
|---|---|
| `logo-icon.svg` | Isotipo. Favicon, avatar, app icon. |
| `logo.svg` | Lockup horizontal (isotipo + wordmark Bangers). Headers, emails. |
| `logo-vertical.svg` | Apilado con tagline. Redes sociales, merch. |
| `logo-white.svg` | Inversa: dorado de fondo + vinoso X. Sobre fotos oscuras. |
| `favicon.svg` | Favicon 120x120 optimizado. |
| `og-image.svg` | Template social 1200x630 con headline "Deja de soñarlo". |

### Wordmark

Fuente: **Bangers** 400.
Composición: `TRIP<span style="color:#8B1F2B">X</span>TREM`
- "TRIP" y "TREM" en navy (`#1A2B4A`).
- "X" central en vinoso (`#8B1F2B`).

### Reglas de uso

**Zona de respeto**: ancho de la X alrededor.
**Tamaño mínimo**: 24px isotipo digital · 80px lockup horizontal · 10mm impreso.

**NO**:
- ❌ Cambiar colores fuera de las variantes.
- ❌ Sombras, bordes, efectos 3D.
- ❌ Rotar o deformar.
- ❌ Logo dorado sobre fondo dorado.

**SÍ**:
- ✅ Versión inversa sobre fotos oscuras.
- ✅ Combinar con la tagline en Outfit 600.
- ✅ Aumentar el tamaño del isotipo hasta 200% sobre el wordmark en usos especiales.

---

## 5. Iconografía

Emojis nativos en todo el producto (consistencia cross-platform).

**Categorías**:
```
💧 Agua    🌬️ Aire    ❄️ Nieve    🌍 Tierra
```

**Deportes** (+40): 🏄 Surf · 🪁 Kitesurf · 🚣 Rafting · 🤿 Buceo · 🪂 Parapente · 🛩️ Paracaidismo · 🦸 Wingsuit · 🪢 Bungee · ⛷️ Freeride · 🚁 Heliesquí · 🧊 Ice Climbing · 🧗 Escalada · ⛰️ Vía Ferrata · 🚵 MTB Enduro · 🕳️ Espeleología · etc.

---

## 6. Fotografía

### Estilo

- Aventura real, no posada.
- Luz natural, golden hour.
- Saturación media-alta. Evitar HDR agresivo.
- Personas pequeñas sobre naturaleza grande.
- Diversidad (edad, género, origen).

### Prompts Midjourney / DALL-E / Gemini

**Hero principal:**
```
Aerial drone photo of a surfer carving down a massive teal wave at golden hour, Zarautz Basque coast, cinematic, editorial National Geographic style, warm burgundy and gold color grading --ar 16:9 --v 6
```

**Pack completo:**
```
Split composition vintage adventure: surfer, mountain cabin with fireplace, VW campervan, open flame BBQ. Sunset tones, warm burgundy and gold grading, editorial travel magazine --ar 3:2 --v 6
```

**Partner (landing):**
```
Adventure sports instructor, natural portrait, neoprene, morning sun flare, authentic not posed, warm cream and burgundy background tone --ar 16:9 --v 6
```

**OG social:**
```
Minimalist product shot: iPhone with TripXtrem map on burgundy background, gold accents, floating cards with adventure sports photos, premium editorial --ar 1200:630
```

### Evitar

- Stock genérico de oficina.
- Filtros sepia/vintage extremos.
- Collages con bordes blancos.
- Marcas rivales visibles.

---

## 7. UI / componentes

| Componente | Color principal | Notas |
|---|---|---|
| **CTA primario** | `--gold` dorado | Hover → `--gold-dk`. Sombra dorada. |
| **CTA urgente** | `--brand` vinoso | Última plaza: pulso `urgpulse`. |
| **CTA secundario** | Outline `--navy` | Borde 1.5px, texto navy. |
| **Card** | Fondo blanco/crema | Borde `--border` 1.5px. Hover: elevación + tint dorado. |
| **Badge** | `--gold-tint` | Texto `--gold-dk`, radio 6px. |
| **Pin mapa** | `--gold` (default) · `--brand` urgencia · `--navy` baja dif. | Price pill con tail. |
| **Modal** | Desktop: radio 22px. Mobile: bottom sheet 20/20/0/0. |

---

## 8. Aplicaciones

### Digital

- [x] Web (nav + footer) con isotipo SVG + wordmark Bangers.
- [x] Favicon SVG (S1).
- [x] OG image SVG 1200x630 (convertir a PNG con cloudconvert.com).
- [ ] Apple Touch Icon 180x180 PNG.
- [ ] PWA icons 192/512.

### Email

- Header: lockup horizontal sobre `--cream`.
- Firma: "[Nombre] — TripXtrem · hola@tripxtrem.com".

### Redes sociales

| Plataforma | Avatar | Banner |
|---|---|---|
| Instagram | `logo-icon` exportado 1000×1000 | `logo-vertical` sobre foto hero |
| TikTok | `logo-icon` | — |
| Twitter/X | `logo-icon` | 1500×500 con tagline Bangers |
| LinkedIn | `logo` horizontal | 1584×396 con stats |

### Merch (futuro)

Camisetas partners, pegatinas, gorras, wrap furgonetas → isotipo dorado sobre dark / vinoso sobre crema.

---

## 9. Voice & tone

### Headlines

✅ "Deja de soñarlo. Resérvalo hoy."
✅ "Plazas limitadas. Reserva antes que otro."
✅ "De 0 a adrenalina en 4 pasos."

❌ "Solución integral de experiencias outdoor."
❌ "Descubra el potencial de su próxima aventura."

### Microcopy

| Contexto | Usa | Evita |
|---|---|---|
| CTA reserva | "Apúntate" · "Reservar ahora" | "Enviar formulario" |
| Confirmación | "¡Ya estás dentro!" | "Operación completada" |
| Error | "No se pudo procesar. Prueba de nuevo." | "Ha ocurrido un error" |
| Urgencia | "Solo 2 plazas" | "Stock limitado" |

---

## 10. Legal

- **Nombre**: TripXtrem (registro marca: en trámite).
- **Dominio**: tripxtrem.com.
- **Emails**: hola@ · partners@ · prensa@ · privacidad@ · soporte@.
- **© Copyright**: `© [año] TripXtrem · Hecho en España 🇪🇸`.

---

## 11. Checklist

- [x] Logo S1 + 4 variantes SVG.
- [x] Favicon SVG.
- [x] OG SVG (convertir a PNG cuando vayas a lanzar).
- [x] Paleta A aplicada en `:root` CSS.
- [x] Fuente Bangers cargada y usada.
- [x] BRAND.md (este documento).
- [ ] OG image PNG 1200×630.
- [ ] Apple Touch Icon 180×180.
- [ ] PWA icons 192/512.
- [ ] Handles redes sociales reservados.

---

## 12. Recursos

- Assets: `/assets/*.svg`
- Convertir SVG → PNG: https://cloudconvert.com/svg-to-png
- Midjourney: prompts en sección 6.
- Figma: importar fuentes Bangers + Outfit + Syne, copiar paleta.
