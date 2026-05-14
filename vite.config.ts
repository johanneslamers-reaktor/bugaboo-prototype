import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

const shouldOptimizeImages = process.env.OPTIMIZE_IMAGES === "true";

export default defineConfig({
  plugins: [
    react(),
    ...(shouldOptimizeImages
      ? [
          ViteImageOptimizer({
            // Run this explicitly with OPTIMIZE_IMAGES=true when auditing new
            // assets. Checked-in images are already optimized, so Vercel should
            // not reprocess the full asset tree on every production deploy.
            png: { quality: 80 },
            jpeg: { quality: 82, mozjpeg: true },
            jpg: { quality: 82, mozjpeg: true },
            webp: { lossless: false, quality: 80 },
            svg: {
              multipass: true,
              plugins: [
                {
                  name: "preset-default",
                  params: { overrides: { removeViewBox: false } },
                },
              ],
            },
            cache: true,
            cacheLocation: "node_modules/.cache/vite-plugin-image-optimizer",
          }),
        ]
      : []),
  ],
});
