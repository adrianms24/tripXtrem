# TripXtrem — Brand Guidelines

> Sistema de marca completo. Actualizado: 2026-04-20.

---

## 1. Esencia de marca

| Atributo | Valor |
|---|---|
| **Tagline** | Deja de soñarlo. Resérvalo hoy. |
| **Promesa** | El marketplace Nº1 de turismo de aventura en España. |
| **One-liner** | Reserva deportes extremos con seguro y garantía total. |
| **Misión** | Hacer la aventura accesible, segura y reservable en un clic. |
| **Público** | 25-45 años · urbanitas con ganas de adrenalina · empresas de experiencias. |
| **Personalidad** | Audaz · profesional · cercano · moderno · honesto. |
| **Voz** | Directa, sin paja. Usa `tú`. Frases cortas. Datos concretos ("1.800 grupos este mes"). |

**Palabras que usamos**: aventura, plazas, reserva, garantía, marketplace, experiencia, partners.
**Palabras que evitamos**: soluciones, sinergias, disruptivo, próximamente (sin fecha).

---

## 2. Paleta de colores

### Primarios

| Token | HEX | Uso |
|---|---|---|
| **Green 500** | `#22c55e` | Color de marca. CTAs principales, acentos, iconos de "acción". |
| **Green 600** | `#16a34a` | Hover de CTAs verdes. |
| **Green 100** | `#dcfce7` | Fondos suaves (badges, pills). |
| **Dark 900** | `#111827` | Color de soporte principal. Texto, logo sobre claro, headers. |
| **White** | `#ffffff` | Lienzo, fondos. |

### Secundarios / acento

| Token | HEX | Uso |
|---|---|---|
| **Orange 500** | `#f59e0b` | Alertas suaves, badges "popular", urgencia media. |
| **Red 500** | `#ef4444` | Últimas plazas, urgencia alta, errores. |
| **Blue 500** | `#3b82f6` | Info, enlaces secundarios. |

### Categorías (coherente en tabs, cards, pines)

| Categoría | Primario | Fondo claro | Oscuro |
|---|---|---|---|
| 💧 Agua | `#0ea5e9` | `#e0f2fe` | `#0369a1` |
| 🌬️ Aire | `#f59e0b` | `#fef3c7` | `#b45309` |
| ❄️ Nieve | `#8b5cf6` | `#ede9fe` | `#6d28d9` |
| 🌍 Tierra | `#22c55e` | `#dcfce7` | `#16a34a` |

### Grises (UI)

`#6b7280` texto secundario · `#9ca3af` texto placeholder · `#e5e7eb` bordes · `#f9fafb` fondo app · `#f8fafc` fondo sección.

### Gradientes oficiales

```
--grad-brand:    linear-gradient(135deg, #22c55e, #16a34a);
--grad-adrenal:  linear-gradient(135deg, #f59e0b, #ef4444);
--grad-dark:     linear-gradient(135deg, #111827, #374151);
--grad-hero:     linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%);
```

---

## 3. Tipografía

| Uso | Familia | Pesos |
|---|---|---|
| Display / títulos | **Syne** | 700, 800, 900 |
| Cuerpo / UI | **Outfit** | 400, 500, 600, 700, 800 |
| Mono (código, cifras) | `ui-monospace, SFMono-Regular, Menlo` | — |

**Escala tipográfica** (ya en CSS como CSS vars `--fs-*`):
```
--fs-xs: 10px    etiquetas, legales
--fs-sm: 12px    metadata, captions
--fs-base: 13px  UI por defecto
--fs-md: 15px    subtítulos
--fs-lg: 18px    títulos de card
--fs-xl: 22px    hero secundario
--fs-2xl: 28px   sección
--fs-3xl: 36px   hero display
```

**Regla de oro**: nunca mezcles más de 3 tamaños en una misma sección.

---

## 4. Logo

### Concepto

El logo de TripXtrem es una **X dinámica** formada por dos trazos cruzados:

- **Trazo verde** (#22c55e): dirección ascendente → crecimiento, acción, aventura.
- **Trazo blanco/oscuro**: dirección descendente → caída libre, adrenalina, descenso.

Sobre fondo cuadrado redondeado oscuro (`#111827`, radio 14px) que aporta seriedad y hace de "insignia" reconocible en cualquier contexto.

La X retoma la letra central de "TripXtrem" y simboliza el cruce de caminos: cada aventurero eligiendo su propio camino.

### Variantes disponibles (`/assets/`)

| Archivo | Uso |
|---|---|
| `logo-icon.svg` | Isotipo. Favicons, avatares, app icons, sellos. |
| `logo.svg` | Lockup horizontal (isotipo + wordmark). Headers, footers, emails. |
| `logo-vertical.svg` | Lockup vertical apilado. Redes sociales (perfil), tarjeta. |
| `logo-white.svg` | Versión inversa. Sobre fotos / fondos oscuros. |
| `favicon.svg` | Favicon navegador. Misma icona optimizada 64x64. |

### Reglas de uso

**Zona de respeto**: alrededor del logo mantener al menos el ancho de la "X" en todos los lados.

**Tamaño mínimo**:
- Digital: 24px de alto (isotipo) · 80px (lockup horizontal).
- Impreso: 10mm (isotipo) · 30mm (lockup).

**NO se permite**:
- ❌ Modificar colores del logo fuera de las variantes oficiales.
- ❌ Aplicar sombras, bordes, outlines o efectos.
- ❌ Rotar el logo o deformarlo.
- ❌ Poner el logo verde sobre fondo verde.
- ❌ Usar el logo como patrón de fondo.

**SÍ se permite**:
- ✅ Usar el isotipo solo como mark.
- ✅ Combinar con la tagline debajo (Syne 700, #6b7280).
- ✅ Versión inversa sobre fotos con overlay oscuro (mínimo 40% negro).

---

## 5. Iconografía

**Librería**: emojis nativos del sistema operativo (ya en uso). Ventaja: consistencia cross-platform, sin dependencias, soporte inmediato.

**Mapeo oficial** (categorías y deportes):
```
💧 Agua    🌬️ Aire    ❄️ Nieve    🌍 Tierra
🏄 Surf    🪁 Kitesurf    🚣 Rafting   🤿 Buceo
🪂 Parapente    🛩️ Paracaidismo    🦸 Wingsuit    🪢 Bungee
⛷️ Freeride    🚁 Heliesquí    🧊 Ice Climbing
🧗 Escalada    ⛰️ Vía Ferrata    🚵 MTB Enduro    🕳️ Espeleología
```

**Iconos UI**: lucide-icons (recomendación futura) o los que ya usamos vía emoji inline.

---

## 6. Fotografía y visuales

### Estilo

- **Género**: aventura real, no posado. People in action.
- **Luz**: natural, golden hour preferido.
- **Color**: saturación media-alta. Evitar HDR agresivo.
- **Composición**: personas pequeñas sobre naturaleza grande (sensación de escala).
- **Diversidad**: múltiples edades, géneros, orígenes.

### Prompts sugeridos (Midjourney / DALL-E / Gemini)

**Hero principal**:
```
Aerial drone photo of a surfer carving down a massive teal wave at golden hour, Zarautz Basque coast, cinematic, 35mm, editorial National Geographic style --ar 16:9 --v 6
```

**Pack completo**:
```
Split composition: surfer, mountain cabin, vintage campervan, open fire BBQ. Sunset tones, warm grading, editorial travel magazine style --ar 3:2 --v 6
```

**Partner landing (hero)**:
```
Adventure sports instructor smiling at camera, wearing neoprene, morning sun flare, shallow depth of field, authentic not posed, editorial --ar 16:9 --v 6
```

**Open Graph (redes)**:
```
TripXtrem app mockup on iPhone, map with green pins over Spain, floating cards with surfer/paraglider photos, white background, minimal Apple-style product shot --ar 1200:630
```

### Qué evitar

- Stock genérico de gente sonriendo al portátil.
- Filtros vintage/sepia exagerados.
- Collages con múltiples bordes blancos.
- Elementos de marca (marcas rivales, logos ajenos visibles).

---

## 7. UI / componentes

Los componentes del producto ya siguen el sistema. Referencia rápida:

| Componente | Regla |
|---|---|
| **Botón primario** | Verde #22c55e, texto blanco, radio 10px, padding 8-12px vertical. |
| **Botón urgente** | Rojo #ef4444, anima `urgpulse` si última plaza. |
| **Card** | Radio 18px, borde 1.5px #e5e7eb, hover levanta 2px + borde verde. |
| **Badge** | Radio 6-8px, peso 700, 10px fontsize. |
| **Modal** | Radio 22px escritorio · bottom sheet 20px 20px 0 0 mobile. |

---

## 8. Aplicaciones

### Digital

- [x] Web (landing, nav, footer) → isotipo + wordmark horizontal.
- [x] Favicon (SVG + PNG 32, 180).
- [ ] Open Graph image (`/assets/og-image.png`, 1200x630). Ver plantilla `og-image.svg`.
- [ ] PWA icons (192x192, 512x512).
- [ ] Apple Touch Icon (180x180).

### Email

- Header: lockup horizontal con fondo #f9fafb.
- Footer: isotipo pequeño + links legales.
- Firma: "[Nombre] — TripXtrem · hola@tripxtrem.com · tripxtrem.com".

### Redes sociales

| Plataforma | Avatar | Banner |
|---|---|---|
| Instagram | Isotipo fondo verde | Lockup vertical sobre foto hero |
| TikTok | Isotipo fondo dark | — |
| Twitter/X | Isotipo fondo verde | Banner 1500x500 con tagline |
| LinkedIn | Lockup horizontal | Banner 1584x396 con stats |

### Merchandising (futuro)

Camisetas partners, pegatinas, gorras, wrapping de furgonetas → usar lockup horizontal blanco sobre dark, o isotipo verde sobre blanco.

---

## 9. Voice & tone

### Headlines

✅ "Deja de soñarlo. Resérvalo hoy."
✅ "Plazas limitadas. Reserva antes que otro."
✅ "De 0 a adrenalina en 4 pasos."

❌ "Solución integral de experiencias outdoor".
❌ "Descubra el potencial de su próxima aventura".

### Microcopy

| Contexto | Usar | No usar |
|---|---|---|
| CTA reserva | "Apúntate", "Reservar ahora" | "Enviar formulario" |
| Confirmación | "¡Ya estás dentro!" | "Operación completada" |
| Error | "No se pudo procesar. Prueba de nuevo." | "Ha ocurrido un error inesperado" |
| Urgencia | "Solo 2 plazas" | "Stock limitado" |

### Emails

- Saludo: "Hola [nombre]" (no "Estimado/a").
- Despedida: "Un abrazo, el equipo de TripXtrem" (no "Atentamente").
- Firmar con persona real cuando sea B2B.

---

## 10. Legal de marca

- **Nombre**: TripXtrem (registro marca en España: en trámite).
- **Dominio principal**: tripxtrem.com.
- **Handle redes**: @tripxtrem (verificar disponibilidad en todas).
- **Emails corporativos**: hola@ · partners@ · prensa@ · privacidad@ · soporte@.
- **© Copyright**: "© [año] TripXtrem · Hecho en España 🇪🇸".

---

## 11. Checklist de pre-lanzamiento

- [x] Logo principal + variantes SVG.
- [x] Favicon SVG y PNG.
- [x] Paleta de colores en CSS vars.
- [x] Tipografía cargada (Syne + Outfit).
- [ ] Open Graph image PNG 1200x630.
- [ ] Apple Touch Icon 180x180.
- [ ] PWA icons 192/512.
- [ ] Registro de marca (opcional fase 1).
- [ ] Handles redes sociales reservados.
- [ ] Firmas email unificadas.
- [ ] Kit de prensa (1 pager + logos zip descargable).

---

## 12. Recursos

Todos los assets en `/assets/` del repo.

Para usar el branding en herramientas externas:
- Figma: copiar paleta como estilos (10 colores base).
- Canva: importar fuentes Syne + Outfit.
- Midjourney: usar los prompts del punto 6.
- ChatGPT / Claude: referenciar este documento.
