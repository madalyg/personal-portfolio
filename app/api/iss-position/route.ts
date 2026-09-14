import { fetchIssTle } from "@/lib/world/fetch-iss-tle";
import type { GeoPoint } from "@/lib/world/iss-types";
import { geoPointFromSatrec, satrecFromTle } from "@/lib/world/satellite-orbit";

export async function GET() {
  try {
    const tle = await fetchIssTle();
    const satrec = satrecFromTle(tle.line1, tle.line2);
    const position = geoPointFromSatrec(satrec, new Date());
    if (!position) {
      return Response.json({ error: "Propagation failed" }, { status: 502 });
    }

    return Response.json(position satisfies GeoPoint);
  } catch {
    return Response.json({ error: "ISS position failed" }, { status: 502 });
  }
}
