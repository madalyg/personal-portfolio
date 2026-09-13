import { getActiveTravelGallerySlugs } from "@/lib/travel-gallery-slugs";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ slugs: getActiveTravelGallerySlugs() });
}
