const ISS_TLE_URL =
  "https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE";

export async function fetchIssTle() {
  const res = await fetch(ISS_TLE_URL, {
    headers: { "User-Agent": "madaly-g-portfolio/1.0" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("TLE fetch failed");
  }

  const text = (await res.text()).trim();
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 3) {
    throw new Error("Unexpected TLE format");
  }

  return {
    name: lines[0].trim(),
    line1: lines[1].trim(),
    line2: lines[2].trim(),
  };
}
