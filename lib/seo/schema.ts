import { SITE } from "@/lib/seo/site";

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE.url}/#person`,
    name: SITE.personName,
    alternateName: [SITE.brandName, SITE.personName],
    url: SITE.url,
    image: `${SITE.url}/profile.jpg`,
    jobTitle: ["Software Engineer", "Computational Physicist"],
    description: SITE.defaultDescription,
    knowsAbout: SITE.knowsAbout,
    sameAs: SITE.sameAs,
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.personName,
    alternateName: SITE.brandName,
    url: SITE.url,
    description: SITE.defaultDescription,
    publisher: { "@id": `${SITE.url}/#person` },
    inLanguage: "en-US",
  };
}

export function buildProfilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE.url}/#profilepage`,
    url: SITE.url,
    name: `${SITE.personName} — Portfolio`,
    mainEntity: { "@id": `${SITE.url}/#person` },
    isPartOf: { "@id": `${SITE.url}/#website` },
  };
}
