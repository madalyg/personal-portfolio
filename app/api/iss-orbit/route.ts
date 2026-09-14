import { fetchIssTle } from "@/lib/world/fetch-iss-tle";
import type { IssOrbitPayload } from "@/lib/world/iss-types";
import {
  buildIssPaths,
  geoPointFromSatrec,
  sampleIssOrbit,
  satrecFromTle,
} from "@/lib/world/satellite-orbit";

export async function GET() {
  try {
    const tle = await fetchIssTle();
    const satrec = satrecFromTle(tle.line1, tle.line2);
    const now = new Date();
    const { orbit } = sampleIssOrbit(satrec, now);
    const position = geoPointFromSatrec(satrec, now);
    if (!position) {
      return Response.json({ error: "Propagation failed" }, { status: 502 });
    }

    const body: IssOrbitPayload = {
      name: tle.name.replace(/^0\s+/, "") || "ISS",
      paths: buildIssPaths(orbit),
      position,
    };

    return Response.json(body);
  } catch {
    return Response.json({ error: "ISS orbit failed" }, { status: 502 });
  }
}
