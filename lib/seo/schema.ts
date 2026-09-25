import { SITE } from "@/lib/seo/site";

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE.url}/#person`,
    name: SITE.personName,
    givenName: "Madaly",
    familyName: "Gregory",
    alternateName: SITE.alternateNames,
    url: SITE.url,
    image: {
      "@type": "ImageObject",
      url: `${SITE.url}/profile.jpg`,
      caption: `Portrait of ${SITE.personName}`,
    },
    jobTitle: ["Software Engineer", "Computational Physicist"],
    description: SITE.defaultDescription,
    knowsAbout: SITE.knowsAbout,
    sameAs: SITE.sameAs,
    mainEntityOfPage: { "@id": `${SITE.url}/#profilepage` },
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.personName,
    alternateName: SITE.alternateNames,
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
