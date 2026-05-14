#!/usr/bin/env bun
/**
 * One-time pass that resizes oversize raster sources in public/assets and
 * converts PNG photos (no alpha) to JPEG. PNG is lossless and brutal on
 * texture-heavy photos (multi-MB even after resize); JPEG at q82 compresses
 * the same content to a fraction of the size with no visible quality hit
 * on a 402px-wide phone canvas.
 *
 * Run with: `bun run optimize:images`. Safe to re-run — only rewrites
 * files when the new encoding is smaller than the existing one.
 *
 * Files renamed from .png to .jpg get their old path mapped through src/
 * automatically below so the data files don't break.
 */
import { readdir, rename, stat, unlink, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const ROOT = "public/assets";
const SRC = "src";
const MAX_WIDTH = 1200;
const SIZE_FLOOR_BYTES = 150 * 1024;
const JPEG_QUALITY = 82;

type Rename = { from: string; to: string };
type Result = { path: string; from: number; to: number; rename?: Rename };

async function walk(dir: string, files: string[] = []): Promise<string[]> {
  for (const entry of await readdir(dir)) {
    const full = join(dir, entry);
    const s = await stat(full);
    if (s.isDirectory()) await walk(full, files);
    else files.push(full);
  }
  return files;
}

async function optimize(path: string): Promise<Result | null> {
  const original = await stat(path);
  if (original.size < SIZE_FLOOR_BYTES) return null;

  const ext = extname(path).toLowerCase();
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") return null;

  const image = sharp(path);
  const metadata = await image.metadata();
  if (!metadata.width) return null;

  // Determine if PNG has any actual transparency — flat photos get JPEG.
  let convertToJpeg = false;
  if (ext === ".png" && metadata.hasAlpha) {
    const stats = await sharp(path).stats();
    const alphaChannel = stats.channels[stats.channels.length - 1];
    const isOpaque = alphaChannel?.min === 255 && alphaChannel?.max === 255;
    convertToJpeg = isOpaque;
  } else if (ext === ".png") {
    convertToJpeg = true;
  }

  let pipeline = image;
  if (metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  if (convertToJpeg) pipeline = pipeline.flatten({ background: "#ffffff" });

  const buffer = convertToJpeg
    ? await pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true }).toBuffer()
    : ext === ".png"
      ? await pipeline.png({ compressionLevel: 9, palette: false }).toBuffer()
      : await pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true }).toBuffer();

  if (buffer.length >= original.size) return null;

  if (convertToJpeg && ext === ".png") {
    // Write new .jpg and remove the old .png. Caller updates references.
    const newPath = path.replace(/\.png$/i, ".jpg");
    await Bun.write(newPath, buffer);
    await unlink(path);
    return { path, from: original.size, to: buffer.length, rename: { from: path, to: newPath } };
  }

  await Bun.write(path, buffer);
  return { path, from: original.size, to: buffer.length };
}

/**
 * Update string literals in src/ files when we rename PNG→JPG. Strips the
 * leading `public` prefix so `/assets/foo.png` references resolve.
 */
async function rewriteReferences(renames: Rename[]) {
  if (renames.length === 0) return;
  const map = new Map<string, string>();
  for (const { from, to } of renames) {
    map.set(from.replace(/^public/, ""), to.replace(/^public/, ""));
  }
  const srcFiles = await walk(SRC);
  const candidates = srcFiles.filter((p) =>
    /\.(tsx?|jsx?|css|md|json)$/.test(p),
  );
  let updated = 0;
  for (const file of candidates) {
    const text = await readFile(file, "utf8");
    let next = text;
    for (const [oldPath, newPath] of map) {
      if (next.includes(oldPath)) {
        next = next.split(oldPath).join(newPath);
      }
    }
    if (next !== text) {
      await writeFile(file, next);
      updated += 1;
    }
  }
  console.log(`\nUpdated ${updated} source files with new asset paths`);
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
for (const r of results.slice(0, 25)) {
  const saved = r.from - r.to;
  const pct = ((saved / r.from) * 100).toFixed(1);
  const mb = (saved / (1024 * 1024)).toFixed(2);
  const tag = r.rename ? "→jpg" : "    ";
  console.log(`${pct.padStart(5)}%  -${mb} MB  ${tag}  ${r.path}`);
}

console.log(`\nProcessed ${results.length} files`);
console.log(`Total saved: ${(totalSaved / (1024 * 1024)).toFixed(1)} MB`);

await rewriteReferences(results.filter((r): r is Result & { rename: Rename } => Boolean(r.rename)).map((r) => r.rename));
