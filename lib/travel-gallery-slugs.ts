import fs from "node:fs";
import path from "node:path";
import { listTravelMedia } from "@/lib/media-version";

const MANIFEST = path.join(process.cwd(), "public/travel/active-galleries.json");
const SLUG_RE = /^[a-z0-9-]+$/;

/** Gallery slugs that currently have at least one photo/video on disk. */
export function getActiveTravelGallerySlugs(): string[] {
  const travelDir = path.join(process.cwd(), "public/travel");
  if (!fs.existsSync(travelDir)) return [];

  return fs
    .readdirSync(travelDir)
    .filter((slug) => {
      if (!SLUG_RE.test(slug) || slug.startsWith("_")) return false;
      const dir = path.join(travelDir, slug);
      return fs.statSync(dir).isDirectory() && listTravelMedia(slug).length > 0;
    })
    .sort();
}

export function writeActiveGalleriesManifest() {
  const slugs = getActiveTravelGallerySlugs();
  fs.writeFileSync(MANIFEST, `${JSON.stringify(slugs, null, 2)}\n`);
  return slugs;
}

export function gallerySlugFromUrl(galleryUrl: string | null | undefined) {
  if (!galleryUrl) return null;
  const match = galleryUrl.match(/\/world\/([a-z0-9-]+)$/);
  return match?.[1] ?? null;
}

export function resolveGalleryUrl(
  galleryUrl: string | null | undefined,
  activeSlugs: Set<string>
) {
  const slug = gallerySlugFromUrl(galleryUrl);
  if (!slug || !activeSlugs.has(slug)) return null;
  return galleryUrl ?? null;
}
