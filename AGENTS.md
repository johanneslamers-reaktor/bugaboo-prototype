# AGENTS.md

## Project Context

This is a mobile-first user-testing prototype for Bugaboo and Joolz.

The goal is to turn selected Figma mobile designs into a public, testable web prototype for:

- A mobile homepage
- A product master page / flexible PDP

The two brands share templates, data shapes, and page anatomy where possible, but should not feel like recolors of each other.

Use this principle:

> Shared structure, shared content model, brand-specific visual grammar.

Bugaboo should feel more premium, technical, editorial, black-and-white, and utility-led.

Joolz should feel warmer, softer, playful, expressive, serif-accented, and intimate.

Repository:

```txt
https://github.com/johanneslamers-reaktor/bugaboo-prototype
```

Production prototype:

```txt
https://bugaboo-joolz-prototype.vercel.app
```

## Tech Stack

Use:

- React 19
- TypeScript
- Vite
- CSS Modules
- CSS custom properties for theme tokens
- Motion for React from `motion.dev`, imported from `motion/react`
- Bun for install/build/dev commands
- Static Vercel deployment

Do not use Tailwind. The brands have distinct design languages and section-level art direction that are better handled with CSS Modules, semantic CSS variables, and explicit component variants.

Avoid adding dependencies unless they solve a real implementation problem.

## Local Commands

Install:

```bash
bun install
```

Run local dev server:

```bash
bun --bun run dev
```

Build:

```bash
bun --bun run build
```

The local app usually runs at:

```txt
http://127.0.0.1:5173/
```

## Current Routes

Homepage prototype:

```txt
/
```

Product pages:

```txt
/bugaboo/products/dragonfly-2-in-1-stroller
/bugaboo/products/fox-5-renew
/joolz/products/joolz-aer-2
```

The root homepage has a hidden brand switcher: double-click the logo to toggle between Bugaboo and Joolz.

`vercel.json` includes a single-page-app fallback so deep product routes work when opened directly.

Future intent variants can use query params or route data, but the current implementation does not yet fork PDP behavior by `shop` versus `explore`.

## Actual Source Shape

```txt
src/
  brands/          Brand IDs and shared brand helpers
  components/      Reusable homepage and PDP sections
  data/            Homepage and product content models
  pages/           Page-level composition
  styles/          Reset, typography, and theme tokens
public/assets/     Images, videos, icons, and web fonts
```

Important data files:

- `src/data/homepage.ts`
- `src/data/products.ts`

Important page composition:

- `src/App.tsx`
- `src/pages/ProductMasterPage/ProductMasterPage.tsx`

## Implemented Components

Homepage:

- `MobileNavigation`
- `Hero`
- `CategoryCarousel`
- `BrandUsp`
- `ProductCarousel`
- `EditorialRail`

PDP:

- `ProductGallery`
- `ProductSummary`
- `ProductReasons`
- `ProductAccordion`
- `ProductImpact`
- `ProductFeatureBenefits`
- `ProductBundle`
- `ProductCrossSell`
- `ProductUsp`
- `ProductVideoStory`
- `ProductStoryShop`
- `ProductFloatingCta`

## Theming

Use CSS custom properties for reusable tokens:

- Colors
- Font families
- Font weights
- Spacing primitives
- Radius
- Button primitives
- Product-card primitives
- Section backgrounds

Brand tokens live in:

```txt
src/styles/themes.css
src/styles/typography.css
```

Use tokens for small differences. Use brand-specific component variants for larger differences.

Good examples of variant-worthy differences:

- Bugaboo USP sections: editorial color fields, oversized thin Aeonik type, rectangular lifestyle images.
- Joolz USP sections: softer ivory or purple fields, Goudy serif highlights, organic/cutout image treatment.
- Bugaboo editorial/story sections: darker, magazine-like, serious.
- Joolz editorial/story sections: warmer, playful card treatment.

Avoid forcing these into one over-abstracted visual system.

## Motion

Use Motion for React for:

- Carousels
- Drag/gesture interactions
- Layout transitions
- Enter/exit animations
- Scroll-triggered or scroll-linked motion
- Sticky scroll storytelling
- Brand/theme transitions where motion is part of the experience

Prefer CSS transitions only for tiny local effects like color or opacity.

Keep motion mobile-friendly:

- Animate transform and opacity before layout properties.
- Respect `prefers-reduced-motion`.
- Keep carousels touch-first.
- Avoid scroll interactions that fight normal page momentum.

Known scroll-driven sections:

- Homepage `BrandUsp`
- PDP `ProductUsp`
- PDP gallery parallax behavior

## Product/Page Data

Keep content data-driven. Prefer shared shapes with brand-specific values.

Homepage sections map to:

- Hero
- Category carousel
- Brand USP / statement block
- Product rail
- Editorial rail

PDP sections currently include:

- Gallery with image/video support, zoom, double-click zoom, and panning
- Product summary with colorways
- Reasons to buy
- Accordion details
- Sustainability/impact block
- Features and benefits carousel with media/hotspots
- Bundle block
- Cross-sell carousel
- Product USP sticky scroll block
- Video story block
- Parent storytelling with shoppable setup block
- Floating CTA with iOS safe-area-aware spacing

## Figma

Use Figma MCP for design inspection and asset extraction.

Known Figma file:

```txt
DzMhDV1h5wIr1oDiv23rGp
```

Useful known nodes:

- Homepage mobile canvas containing both brands: `8612:3102`
- Bugaboo navigation: `8612:3137`
- Joolz navigation: `8612:3644`
- Bugaboo homepage hero: `8612:3105`
- Category carousel: Bugaboo `8612:3139`, Joolz `8612:3645`
- Homepage USP: Bugaboo `8612:3175`, Joolz `8612:3680`
- Product cards: Bugaboo `8612:3201`, Joolz `8612:3714`
- Story rail: Bugaboo `8656:4286`, Joolz `8612:3830`
- PDP gallery: Bugaboo `8663:3641`
- PDP summary: Bugaboo `8680:4813`, Joolz `8680:4814`
- PDP accordion: `8618:3520`
- PDP reasons/impact blocks: Bugaboo `8618:3573` and `8618:3552`, Joolz `8677:5138` and `8677:5113`
- PDP features/benefits: Bugaboo `8618:3801`, items `8663:3727`, Joolz `8612:5030`
- PDP bundle: `8677:5872`
- PDP cross-sell: Bugaboo `8618:4200`, Joolz `8612:5032`
- PDP product USP: Bugaboo `8618:2335`, Joolz `8612:4989`
- PDP video story: Bugaboo `8618:2358`, Joolz `8612:5017`
- PDP storytelling/shoppable setup: Bugaboo `8618:4399`, Joolz `8612:5055`
- Floating CTA: Bugaboo `8681:5162`, Joolz `8677:5183`

When implementing from Figma:

1. Inspect design context and screenshot for the relevant node.
2. Read variables when token details matter.
3. Extract assets needed for the component.
4. Translate the design into maintainable React and CSS Modules.
5. Keep implementation reusable and data-driven.

Known caveat: the Bugaboo PDP video story node exposed a poster via Figma MCP, but not the raw MP4. The current implementation uses the exact poster asset and is ready for a `videoSrc` when the real file is available.

## Implementation Workflow

Work component by component.

Before adding a component:

- Pull the relevant Figma context.
- Identify what is shared versus brand-specific.
- Define or update the data shape.
- Implement the smallest useful slice.
- Verify visually in a mobile viewport.

After frontend changes:

- Run `bun --bun run build`.
- Check the relevant local route in the in-app browser.
- Push to GitHub when the change is meant to persist.

## Visual QA

This prototype is for mobile user testing, so mobile fidelity matters more than desktop breadth.

On desktop, the experience is intentionally centered in a phone-width frame for stakeholder review.

Always check:

- 390px and 402px wide mobile viewports
- No text clipping
- No incoherent overlap
- Horizontal rails scroll naturally
- Buttons are tappable
- Floating CTA does not cover critical content
- Brand differences are visible beyond color changes

## Deployment

The prototype deploys to Vercel as a static Vite app.

Production URL:

```txt
https://bugaboo-joolz-prototype.vercel.app
```

GitHub repo:

```txt
https://github.com/johanneslamers-reaktor/bugaboo-prototype
```

Ignored local/generated folders:

- `node_modules/`
- `dist/`
- `.vercel/`

## Code Style

- Use TypeScript types for brand config and content models.
- Use CSS Modules for component-local styling.
- Use semantic class names instead of Figma layer names.
- Keep brand content data-driven.
- Keep components small enough to reason about, but do not over-abstract brand-specific artistry.
- Prefer accessible HTML controls for interactive elements.
- Use real assets exported from Figma or provided files. Do not approximate icons when exact SVGs are available.

## Non-Goals

- Do not create a marketing landing page around the prototype.
- Do not use Tailwind.
- Do not make a desktop-first version before the mobile experience is working.
- Do not blindly paste generated Figma code as the final implementation.
- Do not collapse Bugaboo and Joolz into one generic visual system.
