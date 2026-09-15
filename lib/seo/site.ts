import { SOCIAL_LINKS } from "@/lib/data/social";

/** Canonical production origin — keep in sync with your hosting custom domain. */
export const SITE_URL = "https://madaly.space";

export const SITE = {
  url: SITE_URL,
  /** Legal / indexing name — use in schema.org and meta author fields. */
  personName: "Madaly Gregory",
  /** Short brand used in UI */
  brandName: "Madaly G",
  defaultTitle:
    "Madaly Gregory — Software Engineer & Computational Physicist",
  defaultDescription:
    "Official portfolio of Madaly Gregory (Madaly G): software engineer and computational physicist building at the intersection of code, physics, and hardware. Research in computational astrophysics, Fortune 500 software experience, B.S. Physics, M.S. Electrical Engineering (in progress).",
  locale: "en_US",
  /** Public profiles that reinforce name ↔ site association for search & AI. */
  sameAs: SOCIAL_LINKS.filter((l) => l.icon !== "mail").map((l) => l.href),
  knowsAbout: [
    "Software engineering",
    "Computational physics",
    "Computational astrophysics",
    "Electrical engineering",
    "Embedded systems",
    "Spacecraft systems",
  ],
} as const;
