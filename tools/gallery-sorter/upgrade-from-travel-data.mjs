#!/usr/bin/env node
/**
 * Replace low-res gallery JPEGs with full-quality exports from
 * `Travel Globe Data/{location}/` (matched by EXIF creation time).
 *
 * Usage: node tools/gallery-sorter/upgrade-from-travel-data.mjs paris-france
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const TRAVEL = path.join(ROOT, "public/travel");
const TRAVEL_GLOBE = path.join(ROOT, "Travel Globe Data");
const GALLERIES_TS = path.join(ROOT, "lib/data/travel-galleries.ts");
const MEDIA_RE = /^\d{2}\.(jpe?g|png|webp|mp4|mov|webm|m4v)$/i;
const MIN_LONG_EDGE = 640;
const SOURCE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".heic",
  ".heif",
  ".webp",
]);

function locationForSlug(slug) {
  const ts = fs.readFileSync(GALLERIES_TS, "utf8");
  const m = ts.match(
    new RegExp(`slug:\\s*"${slug}",\\s*location:\\s*"([^"]+)"`)
  );
  return m?.[1] ?? slug.replace(/-/g, " ");
}

function listMedia(slug) {
  const dir = path.join(TRAVEL, slug);
  return fs
    .readdirSync(dir)
    .filter((name) => MEDIA_RE.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function imageMeta(filePath) {
  const result = spawnSync(
    "sips",
    ["-g", "creation", "-g", "pixelWidth", "-g", "pixelHeight", filePath],
    { encoding: "utf8" }
  );
  const creation = (result.stdout.match(/creation: (.+)/) || [])[1]?.trim();
  const width = Number((result.stdout.match(/pixelWidth:\s+(\d+)/) || [])[1]);
  const height = Number((result.stdout.match(/pixelHeight:\s+(\d+)/) || [])[1]);
  return { creation, width, height };
}

function convertToJpeg(src, dest) {
  const result = spawnSync(
    "sips",
    ["-s", "format", "jpeg", "-s", "formatOptions", "95", src, "--out", dest],
    { encoding: "utf8" }
  );
  if (result.status !== 0) {
    throw new Error(result.stderr || `Could not convert ${path.basename(src)}`);
  }
}

function listSources(locationDir) {
  if (!fs.existsSync(locationDir)) return [];
  const out = [];
  for (const name of fs.readdirSync(locationDir)) {
    const ext = path.extname(name).toLowerCase();
    if (!SOURCE_EXT.has(ext)) continue;
    out.push(path.join(locationDir, name));
  }
  return out;
}

function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: node tools/gallery-sorter/upgrade-from-travel-data.mjs <slug>");
    process.exit(1);
  }
  const galleryDir = path.join(TRAVEL, slug);
  if (!fs.existsSync(galleryDir)) {
    console.error(`Unknown gallery: ${slug}`);
    process.exit(1);
  }

  const location = locationForSlug(slug);
  const sourceDir = path.join(TRAVEL_GLOBE, location);
  const sources = listSources(sourceDir);
  if (!sources.length) {
    console.error(`No source images in: ${sourceDir}`);
    process.exit(1);
  }

  const sourceMeta = sources.map((p) => ({ path: p, ...imageMeta(p) }));
  let upgraded = 0;

  for (const name of listMedia(slug)) {
    if (!/\.jpe?g$/i.test(name)) continue;
    const dest = path.join(galleryDir, name);
    const current = imageMeta(dest);
    const long = Math.max(current.width, current.height);
    if (long >= MIN_LONG_EDGE) continue;
    if (!current.creation) {
      console.warn(`Skip ${name}: no creation date`);
      continue;
    }

    const match = sourceMeta.find(
      (s) =>
        s.creation === current.creation &&
        Math.max(s.width, s.height) >= MIN_LONG_EDGE
    );
    if (!match) {
      console.warn(
        `No full-res source for ${name} (${current.width}x${current.height}, ${current.creation})`
      );
      continue;
    }

    const tmp = path.join(
      os.tmpdir(),
      `gallery-upgrade-${Date.now()}-${name}`
    );
    convertToJpeg(match.path, tmp);
    fs.copyFileSync(tmp, dest);
    fs.unlinkSync(tmp);
    const next = imageMeta(dest);
    console.log(
      `Upgraded ${name}: ${current.width}x${current.height} -> ${next.width}x${next.height} (${path.basename(match.path)})`
    );
    upgraded += 1;
  }

  if (!upgraded) {
    console.log("Nothing upgraded. Export originals to:", sourceDir);
    process.exit(2);
  }
}

main();
