import { fetchIssTle } from "@/lib/world/fetch-iss-tle";

export async function GET() {
  try {
    return Response.json(await fetchIssTle());
  } catch {
    return Response.json({ error: "TLE fetch failed" }, { status: 502 });
  }
}
