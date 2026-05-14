# Bugaboo + Joolz Mobile Prototype

Mobile-first React prototype for user testing Bugaboo and Joolz homepage + PDP concepts. Two brands share structure and content models; CSS Modules and brand data keep their visual languages separate.

> Shared structure, shared content model, brand-specific visual grammar.

- **Bugaboo** — premium, technical, editorial, B/W, Aeonik Pro
- **Joolz** — warmer, playful, serif-accented, Value Sans Pro + Value Sans Joolz

Production: [bugaboo-joolz-prototype.vercel.app](https://bugaboo-joolz-prototype.vercel.app)

## Stack

- React 19 + TypeScript
- Vite (Bun runtime)
- CSS Modules + CSS custom properties for theme tokens
- [motion.dev](https://motion.dev) (`motion` / `motion-react`) for drag, gesture, scroll, layout, enter/exit
- Static Vercel deploy. No Tailwind. No global utility classes.

## Local development

```bash
bun install
bun --bun run dev        # http://127.0.0.1:5173/
bun --bun run build      # production build into dist/
bunx tsc --noEmit        # type check
bun run optimize:images  # one-time pass to resize/recompress public assets
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Bugaboo home (double-click logo to flip to Joolz) |
| `/bugaboo` | Branded Bugaboo home |
| `/joolz` | Branded Joolz home |
| `/bugaboo/products/fox-5-renew` | Fox 5 Renew PDP |
| `/bugaboo/products/donkey-6-double-stroller` | Donkey 6 PDP |
| `/joolz/products/joolz-aer-2` | Joolz Aer 2 PDP |
| `/joolz/products/joolz-geo-5` | Joolz Geo 5 PDP |

The hamburger menu in `MobileNavigation` opens a debug list of every working route. SPA routing is parsed in `App.tsx`; `vercel.json` rewrites all paths to `/index.html` so deep-link loads work.

**Easter egg**: double-clicking the floating CTA on any PDP jumps to the index-equivalent product on the other brand and preserves scroll position via `sessionStorage` — useful for cross-brand comparison.

## Source layout

```
src/
  App.tsx                       // router + brand toggle
  brands/                       // BrandId types and brand config
  components/                   // homepage + PDP sections
  data/
    homepage.ts                 // home content for both brands
    products.ts                 // PDP catalogs + content shapes
  hooks/
    useCarouselTrack.ts         // low-level snap-carousel hook
    useScrollDrag.ts            // mouse-drag-to-scroll for native scrollers
  lib/
    motion-presets.ts           // ENTRANCE_ZOOM and shared motion presets
  pages/
    ProductMasterPage/          // PDP composition root
  styles/                       // reset, typography, themes
public/assets/                  // images, videos, icons, fonts (per brand)
scripts/
  optimize-images.ts            // sharp-based one-off image pass
```

## Components

### Homepage
`MobileNavigation` (with debug menu) · `Hero` · `CategoryCarousel` · `BrandUsp` · `ProductCarousel` · `EditorialRail`

### PDP (`ProductMasterPage`)
`ProductGallery` · `ProductSummary` · `ProductReasons` · `ProductAccordion` · `ProductImpact` · `ProductFeatureBenefits` · `ProductBundle` (variant tabs) · `ProductCrossSell` · `ProductUsp` · `ProductVideoStory` · `ProductStoryShop` · `ProductSustainability` (interactive hotspot gallery) · `ProductShopTheLook` (hero + hotspot-linked product row) · `ProductFloatingCta`

### Shared building blocks
- `Carousel` — motion.dev-style `<Carousel items={...} loop>` with bounded + infinite modes, plus `useCarousel()` context hook for child controls
- `Hotspot` — universal image hotspot (x/y in %) with inlined SVG icon
- `useCarouselTrack` — low-level hook the Carousel + custom carousels both build on
- `useScrollDrag` — mouse-drag-to-scroll for native scrollers (touch left to native)

## Carousel physics

All carousel components share physics so swipes feel identical:

```ts
SNAP_SPRING            { type: "spring", stiffness: 380, damping: 38, mass: 0.6 }
VELOCITY_PROJECTION_S  0.3   // seconds of inertia projection on release
DRAG_ELASTIC_BOUNDED   0.18  // rubber-band at boundaries
```

On release: `target = nearest snap point to current + velocity * 0.3s`. Gesture velocity feeds back into the spring so flicks continue their momentum.

## Motion presets

`src/lib/motion-presets.ts` exports `ENTRANCE_ZOOM` — scale `1.08 → 1` over 1.8s when an element enters viewport (`once: true, amount: 0.25`). Used on every big image/video on home + PDP.

```tsx
import { motion } from "motion/react";
import { ENTRANCE_ZOOM } from "./lib/motion-presets";

<motion.img {...ENTRANCE_ZOOM} src={...} alt={...} />
```

Parent must have `overflow: hidden` so the 8% overflow clips cleanly.

## Image pipeline

Two-pass setup keeps assets small:

1. **Source pass** — `bun run optimize:images` resizes oversize PNGs to max 1200px wide and converts opaque PNGs to JPEG (q82) in place. Re-runnable; only writes when smaller. References in source are rewritten when `.png` becomes `.jpg`.
2. **Build pass** — `vite-plugin-image-optimizer` compresses any remaining PNG/JPEG/SVG on `vite build` (cached in `node_modules/.cache/`).

Public assets went from 209 MB → 89 MB with this pipeline.

## Theming

Brand tokens live in `src/styles/themes.css` + `src/styles/typography.css`. Components read variables like `var(--joolz-deep-blue)` and `var(--font-aeonik)`. For larger differences, brand-specific CSS via `.section[data-brand="joolz"] ...` selectors instead of forcing every variant into a shared abstraction.

## Figma MCP

Use the Figma MCP tools for design context + asset export:

- `mcp__plugin_figma_figma__get_design_context` — node code + asset URLs
- `mcp__plugin_figma_figma__get_screenshot` — direct screenshot (use when an asset URL returns blank — known issue with some node types)

**Known Figma file**: `DzMhDV1h5wIr1oDiv23rGp`

**Workflow when implementing from Figma:**
1. Fetch design context for the relevant node id.
2. Identify shared vs brand-specific bits.
3. Download asset URLs to `public/assets/<section>/<brand>/`.
4. SVG icons often have `preserveAspectRatio="none"` and `<foreignObject>` for backdrop blur — strip both or inline (`<img src=...>` doesn't render foreignObject).
5. Translate to data-driven React + CSS Modules. Use existing shared blocks (`Carousel`, `Hotspot`) before introducing new ones.

## Deployment

Vercel-hosted, deploys on push to `main`. `vercel.json` adds the SPA fallback so direct deep-link visits work.

Repo: https://github.com/johanneslamers-reaktor/bugaboo-prototype

## Non-goals

- No marketing landing page
- No Tailwind
- Don't collapse Bugaboo + Joolz into one generic system
- Don't blindly paste Figma-generated code as final
