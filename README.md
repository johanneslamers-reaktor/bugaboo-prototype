# Bugaboo + Joolz Mobile Prototype

Mobile-first React prototype for user testing Bugaboo and Joolz homepage and flexible PDP concepts. The two brands share structure and content models, while CSS Modules and brand data keep their visual languages separate.

## Stack

- React 19
- TypeScript
- Vite
- CSS Modules
- Motion for scroll-driven interactions, carousels, and UI transitions
- Bun for local install/build commands

## Local Development

```bash
bun install
bun --bun run dev
```

Open the local app at:

```text
http://127.0.0.1:5173/
```

Build for production:

```bash
bun --bun run build
```

## Routes

Homepage prototype:

```text
/
```

Product pages:

```text
/bugaboo/products/dragonfly-2-in-1-stroller
/bugaboo/products/fox-5-renew
/joolz/products/joolz-aer-2
```

The root homepage includes a hidden brand switcher: double-click the logo to toggle between Bugaboo and Joolz.

## Project Shape

```text
src/
  brands/          Brand IDs and shared brand helpers
  components/      Reusable homepage and PDP sections
  data/            Data-driven content for homepage and products
  pages/           Page-level composition
  styles/          Reset, typography, and theme tokens
public/assets/     Images, videos, icons, and web fonts
```

## Deployment

The project is configured for Vercel as a static Vite app. `vercel.json` includes SPA fallback rewrites so product routes load correctly when visited directly.

Production prototype:

[bugaboo-joolz-prototype.vercel.app](https://bugaboo-joolz-prototype.vercel.app)
