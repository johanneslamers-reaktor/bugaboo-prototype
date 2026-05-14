#!/usr/bin/env bun
/**
 * One-time pass that resizes oversize PNG/JPEG source assets in public/assets
 * to a sane upper bound. Anything wider than MAX_WIDTH is downscaled
 * (preserving aspect ratio) and re-encoded with stronger compression.
 *
 * The display surface is 402px wide (phone canvas) so 1600px wide is enough
 * to cover 3x DPI without obvious blur, while dropping multi-MB PNGs down to
 * the hundreds of KB.
 *
 * Run with: `bun run scripts/optimize-images.ts`
 *
 * Build-time WebP/AVIF emission still happens via vite-plugin-image-optimizer.
 * This script just fixes the bloated source files so the build step has
 * less work and the git history stops growing every time we add a hero.
 */
import { readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const ROOT = "public/assets";
const MAX_WIDTH = 1600;
const SIZE_FLOOR_BYTES = 200 * 1024; // skip anything already <200 KB

type Result = { path: string; from: number; to: number };

async function walk(dir: string, files: string[] = []): Promise<string[]> {
  const entries = await readdir(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    const s = await stat(full);
    if (s.isDirectory()) {
      await walk(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

async function optimize(path: string): Promise<Result | null> {
  const original = await stat(path);
  if (original.size < SIZE_FLOOR_BYTES) return null;

  const ext = extname(path).toLowerCase();
  const isPng = ext === ".png";
  const isJpg = ext === ".jpg" || ext === ".jpeg";
  if (!isPng && !isJpg) return null;

  const image = sharp(path);
  const metadata = await image.metadata();
  if (!metadata.width) return null;

  // Read into buffer first so we can write back to the same path.
  let pipeline = image;
  if (metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  const buffer = isPng
    ? await pipeline.png({ compressionLevel: 9, palette: false }).toBuffer()
    : await pipeline.jpeg({ quality: 82, progressive: true, mozjpeg: true }).toBuffer();

  // Only write if we actually saved bytes — avoids re-encoding gains being
  // wiped out by a slight increase from sharp's encoder.
  if (buffer.length >= original.size) return null;

  await Bun.write(path, buffer);
  return { path, from: original.size, to: buffer.length };
}

const all = await walk(ROOT);
const results: Result[] = [];
let totalSaved = 0;

for (const file of all) {
  try {
    const result = await optimize(file);
    if (result) {
      results.push(result);
      totalSaved += result.from - result.to;
    }
  } catch (error) {
    console.warn(`! ${file}: ${error instanceof Error ? error.message : error}`);
  }
}

results.sort((a, b) => (b.from - b.to) - (a.from - a.to));
for (const r of results.slice(0, 20)) {
  const saved = r.from - r.to;
  const pct = ((saved / r.from) * 100).toFixed(1);
  const mb = (saved / (1024 * 1024)).toFixed(2);
  console.log(`${pct.padStart(5)}%  -${mb} MB  ${r.path}`);
}

console.log(`\nProcessed ${results.length} files`);
console.log(`Total saved: ${(totalSaved / (1024 * 1024)).toFixed(1)} MB`);
