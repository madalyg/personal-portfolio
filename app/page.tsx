import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Pillars } from "@/components/home/pillars";
import { ContactSection } from "@/components/home/contact-section";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo/page-metadata";
import {
  buildPersonJsonLd,
  buildProfilePageJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/schema";
import { SITE } from "@/lib/seo/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
    path: "",
  }),
  title: { absolute: SITE.defaultTitle },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          buildPersonJsonLd(),
          buildWebSiteJsonLd(),
          buildProfilePageJsonLd(),
        ]}
      />
      <Hero />
      <Pillars />
      <ContactSection />
    </>
  );
}
