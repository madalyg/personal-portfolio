import type { MetadataRoute } from "next";
import { categories } from "@/lib/data/categories";
import { projects } from "@/lib/data/projects";
import { travelGalleries } from "@/lib/data/travel-galleries";
import { BIO_PAGE_ENABLED } from "@/lib/data/site";
import { SITE_URL } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "",
    "/projects",
    "/research",
    "/world",
    "/flight-log",
    "/real-estate",
    ...(BIO_PAGE_ENABLED ? ["/recognition"] : []),
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/projects/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.flatMap((p) =>
    p.categories.map((category) => ({
      url: `${SITE_URL}/projects/${category}/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }))
  );

  const travelEntries: MetadataRoute.Sitemap = travelGalleries.map((g) => ({
    url: `${SITE_URL}/world/${g.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...categoryEntries,
    ...projectEntries,
    ...travelEntries,
  ];
}
