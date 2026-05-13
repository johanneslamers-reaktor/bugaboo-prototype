# AGENTS.md

## Project

This is a mobile-first user-testing prototype for Bugaboo and Joolz.

The goal is to turn selected Figma mobile designs into a public, testable web prototype. The prototype should support two brands with comparable structure but distinct visual expression.

Primary flows:

- Mobile homepage
- Product master page / flexible PDP, with shop intent and explore intent variants

## Product Direction

Bugaboo and Joolz should share templates, data shapes, and page anatomy where possible. They should not feel like simple recolors of each other.

Use this principle:

> Shared structure, shared content model, brand-specific visual grammar.

Bugaboo currently reads as more premium, technical, editorial, black-and-white, and utility-led.

Joolz currently reads as warmer, softer, playful, expressive, serif-accented, and intimate.

## Tech Stack

Use:

- Vite
- React
- TypeScript
- CSS Modules
- CSS custom properties for theme tokens
- Motion for React from motion.dev
- Static Vercel deployment

Do not use Tailwind for this project. The two brands have distinct design languages and section-level visual differences that are better handled with CSS Modules, semantic CSS variables, and explicit component variants.

Prefer a lightweight static app unless a later requirement clearly needs server-side behavior.

## Architecture

Expected source shape:

```txt
src/
  brands/
    bugaboo.ts
    joolz.ts
  data/
    homepage.ts
    products.ts
  components/
    Header/
    Hero/
    CategoryCarousel/
    USPSection/
    ProductRail/
    ProductCard/
    EditorialRail/
    ProductMaster/
  styles/
    reset.css
    themes.css
```

Suggested routes:

```txt
/bugaboo
/joolz
/bugaboo/products/:productSlug?intent=shop
/bugaboo/products/:productSlug?intent=explore
/joolz/products/:productSlug?intent=shop
/joolz/products/:productSlug?intent=explore
```

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

Example:

```css
[data-brand="bugaboo"] {
  --color-text: #0f0f02;
  --color-bg: #ffffff;
  --font-body: "Aeonik Pro", sans-serif;
  --font-display: "Aeonik Pro", sans-serif;
}

[data-brand="joolz"] {
  --color-text: #130f31;
  --color-bg: #ffffff;
  --color-cream: #f8eccf;
  --font-body: "Value Sans Pro", sans-serif;
  --font-display: "Value Sans Pro", sans-serif;
  --font-serif: "Goudy Old Style", serif;
}
```

Use tokens for small differences. Use brand-specific component variants for larger design differences.

Good examples of variant-worthy differences:

- Bugaboo USP section: tan editorial block, oversized thin type, rectangular lifestyle image.
- Joolz USP section: cream block, serif/lilac highlight, softer organic image treatment.
- Bugaboo editorial rail: dark, magazine-like, serious.
- Joolz editorial rail: lighter, warmer, playful card treatment.

Avoid forcing these into one over-abstracted component.

## Motion

Use Motion for React (`motion` package, imported from `motion/react`) for:

- Carousels
- Drag/gesture interactions
- Layout transitions
- Enter/exit animations
- Scroll-triggered or scroll-linked motion
- Brand/theme transitions where motion is part of the user experience

Prefer CSS transitions only for tiny local effects such as a simple color or opacity hover state.

Keep motion purposeful and mobile-friendly:

- Animate transform and opacity before layout properties.
- Respect `prefers-reduced-motion` for non-essential motion.
- Keep carousels touch-first and resilient without JavaScript-only affordances.

## Data Model

Keep brand content data-driven. Prefer shared shapes with brand-specific values.

Homepage sections should roughly map to:

- Hero
- Category carousel
- Brand USP / statement block
- Product rail
- Editorial rail

Product master / flexible PDP should support:

- Product media
- Product title and positioning
- Price and commerce actions
- Color/variant selection
- Feature storytelling
- Specs or comparison blocks
- Related products or bundles

Intent modes:

- `shop`: prioritize price, variants, add-to-cart, delivery, and decision support.
- `explore`: prioritize storytelling, product benefits, feature education, and softer CTAs.

## Figma

Use Figma MCP for design inspection and asset extraction.

Known Figma file:

```txt
DzMhDV1h5wIr1oDiv23rGp
```

Known homepage nodes:

- Bugaboo homepage mobile: `8612:3104`
- Joolz homepage mobile: `8612:3609`
- Homepage mobile canvas containing both: `8612:3102`

When implementing from Figma:

1. Inspect metadata and screenshots for the relevant node.
2. Read applied variable definitions for brand tokens.
3. Extract assets needed for the component being built.
4. Translate the design into maintainable React/CSS, not raw generated Figma code.
5. Keep implementation componentized and reusable.

## Implementation Workflow

Work component by component.

Do not build the whole site in one pass unless explicitly asked.

Recommended order:

1. Project shell, routing, theme loading, mobile viewport behavior.
2. Header and hero.
3. Category carousel.
4. USP / brand statement block.
5. Product rail and product cards.
6. Editorial rail.
7. Product master / flexible PDP shell.
8. Shop intent variant for the product master page.
9. Explore intent variant for the product master page.
10. Deploy to Vercel and verify public URL.

Before adding a component:

- Pull the relevant Figma context.
- Identify what is shared versus brand-specific.
- Define or update the data shape.
- Implement the smallest useful slice.
- Verify visually in a mobile viewport.

## Visual QA

This prototype is for mobile user testing, so mobile fidelity matters more than desktop breadth.

On desktop, it is acceptable to center the experience in a phone-width frame for stakeholder review.

Always check:

- 390px and 402px wide mobile viewports
- No text clipping
- No incoherent overlap
- Horizontal rails scroll naturally
- Buttons are tappable
- Brand differences are visible beyond color changes

## Deployment

The prototype should be deployable to Vercel and produce a public URL for user testing.

Do not add deployment-specific complexity until the app structure is in place.

## Code Style

- Use TypeScript types for brand config and content models.
- Use CSS Modules for component-local styling.
- Use semantic class names instead of Figma layer names.
- Keep components small enough to reason about, but do not over-abstract brand-specific artistry.
- Prefer accessible HTML controls for interactive elements.
- Avoid adding dependencies unless they solve a clear need.

## Non-Goals

- Do not create a marketing landing page around the prototype.
- Do not use Tailwind.
- Do not make a desktop-first version before the mobile experience is working.
- Do not blindly paste generated Figma code as the final implementation.
- Do not collapse Bugaboo and Joolz into one generic visual system.
