import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      // Compress PNG/JPEG/SVG in /public during `vite build`. The one-time
      // resize script (scripts/optimize-images.ts) handles the heavy lifting
      // (downscaling 3-15 MB Figma exports); this plugin handles the long
      // tail of new assets so they stay reasonable without manual passes.
      png: { quality: 80 },
      jpeg: { quality: 82, mozjpeg: true },
      jpg: { quality: 82, mozjpeg: true },
      webp: { lossless: false, quality: 80 },
      svg: {
        multipass: true,
        plugins: [
          { name: "preset-default", params: { overrides: { removeViewBox: false } } },
        ],
      },
      cache: true,
      cacheLocation: "node_modules/.cache/vite-plugin-image-optimizer",
    }),
  ],
});
