# CLAUDE.md

Mobile-first user-testing prototype for **Bugaboo** + **Joolz**. Two brands share templates and content shape; visual grammar is brand-specific. The same component renders for both brands and forks via `data-brand` selectors in CSS Modules.

> Shared structure, shared content model, brand-specific visual grammar.

- Bugaboo: premium, technical, editorial, B/W, Aeonik Pro
- Joolz: warmer, playful, serif-accented, Value Sans Pro + Value Sans Joolz

## How to run

```bash
bun install                # one-off
bun --bun run dev          # local at http://127.0.0.1:5173/
bun --bun run build        # production build
bunx tsc --noEmit          # type check
```

## Pages / routes

| Route | What it is |
| --- | --- |
| `/` | Bugaboo home (double-click logo to flip to Joolz) |
| `/bugaboo` | Branded Bugaboo home |
| `/joolz` | Branded Joolz home |
| `/bugaboo/products/fox-5-renew` | Fox 5 Renew PDP |
| `/bugaboo/products/donkey-6-double-stroller` | Donkey 6 PDP |
| `/joolz/products/joolz-aer-2` | Joolz Aer 2 PDP |
| `/joolz/products/joolz-geo-5` | Joolz Geo 5 PDP |

The hamburger menu in `MobileNavigation` opens a debug list of every working route. SPA routing is parsed from `window.location.pathname` in `App.tsx`; `vercel.json` rewrites all paths to `/index.html` so direct deep-link loads work.

**Easter egg**: double-clicking the floating CTA on any PDP jumps to the index-equivalent product on the other brand, preserving scroll position via `sessionStorage`.

## Tech

- React 19 + TypeScript
- Vite (Bun runtime)
- CSS Modules + CSS custom properties for theme tokens
- `motion` (motion.dev / motion-react) for drag, gesture, scroll, layout, enter/exit
- Static Vercel deploy
- No Tailwind. No global utility classes.

Production: https://bugaboo-joolz-prototype.vercel.app
Repo: https://github.com/johanneslamers-reaktor/bugaboo-prototype

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
    useCarouselTrack.ts         // low-level snap-carousel hook (motion.dev physics)
    useScrollDrag.ts            // mouse-drag-to-scroll for native scrollers
  lib/
    motion-presets.ts           // ENTRANCE_ZOOM and shared motion presets
  pages/
    ProductMasterPage/          // PDP composition root
  styles/                       // reset, typography, themes
public/assets/                  // images, videos, icons, fonts (per brand subfolders)
```

## Components

### Homepage
`MobileNavigation` (with debug menu) · `Hero` · `CategoryCarousel` · `BrandUsp` · `ProductCarousel` · `EditorialRail`

### PDP (ProductMasterPage)
`ProductGallery` · `ProductSummary` · `ProductReasons` · `ProductAccordion` · `ProductImpact` · `ProductFeatureBenefits` · `ProductBundle` (variant tabs) · `ProductCrossSell` · `ProductUsp` · `ProductVideoStory` · `ProductStoryShop` · `ProductSustainability` (interactive hotspot gallery) · `ProductShopTheLook` (hero + hotspot-linked product row) · `ProductFloatingCta`

### Shared building blocks
- `Carousel` — motion.dev-style `<Carousel items={...} loop>` with bounded + infinite modes, plus `useCarousel()` context hook for child controls
- `Hotspot` — universal image hotspot dot (x/y in %) with inlined SVG icon
- `useCarouselTrack` — low-level hook the Carousel + custom carousels both build on
- `useScrollDrag` — mouse-drag-to-scroll for native scrollers (touch left to native momentum)

## Carousel physics

All carousel-style components use the same physics so swipes feel identical:

```ts
SNAP_SPRING            { type: "spring", stiffness: 380, damping: 38, mass: 0.6 }
VELOCITY_PROJECTION_S  0.3   // seconds of inertia projection on release
DRAG_ELASTIC_BOUNDED   0.18  // rubber-band at boundaries
```

On release, target = nearest snap point to `current + velocity * 0.3s`. The gesture's velocity is fed back into the spring so flicks continue their momentum.

## Motion presets

`src/lib/motion-presets.ts` exports `ENTRANCE_ZOOM` — scale `1.08 → 1` over 1.8s when an element enters viewport (`once: true, amount: 0.25`). Used on every big image/video on home + PDP. Parent must have `overflow: hidden` so the 8% overflow clips cleanly.

```tsx
import { motion } from "motion/react";
import { ENTRANCE_ZOOM } from "../../lib/motion-presets";

<motion.img {...ENTRANCE_ZOOM} src={...} alt={...} />
```

## Theming

Brand tokens in `src/styles/themes.css` and `src/styles/typography.css`. Components read variables like `var(--joolz-deep-blue)`, `var(--font-aeonik)`, `var(--font-value-sans-joolz)`. For larger differences, use brand-specific CSS via `.section[data-brand="joolz"] ...` selectors rather than over-abstracted token variants.

## Figma MCP

Use the Figma MCP tools for design context and asset export:

- `mcp__plugin_figma_figma__get_design_context` — node code + assets
- `mcp__plugin_figma_figma__get_screenshot` — direct screenshot (use when asset URLs return blank — known issue with some node types)

**Known Figma file**: `DzMhDV1h5wIr1oDiv23rGp`

**Workflow when implementing from Figma:**
1. Fetch design context for the relevant node id.
2. Identify shared vs brand-specific bits.
3. Download asset URLs to `public/assets/<section>/<brand>/`.
4. SVG icons from Figma often have `preserveAspectRatio="none"` and `<foreignObject>` for backdrop blur — strip both and inline if needed (`<img src=...>` doesn't render foreignObject).
5. Translate to data-driven React + CSS Modules. Use existing shared building blocks (`Carousel`, `Hotspot`) before introducing new ones.

## Code style

- TypeScript types for all brand config and content models
- CSS Modules for component-local styling
- Semantic class names (not Figma layer names)
- Data-driven content via `src/data/*`
- Real assets from Figma exports — don't approximate icons
- Animate `transform` and `opacity` before layout properties
- Respect `prefers-reduced-motion` via `useReducedMotion()` from motion.dev
- Carousel images: `loading="eager"` so peeking cards aren't blank when scrolled into view

## Non-goals

- No marketing landing page
- No Tailwind
- Don't collapse Bugaboo + Joolz into one generic system
- Don't blindly paste Figma-generated code as final
