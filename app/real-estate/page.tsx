import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui/page-intro";
import { ComingSoon } from "@/components/ui/coming-soon";
import { REAL_ESTATE_PAGE_ENABLED } from "@/lib/data/site";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Real Estate",
  description: "Real estate — Madaly Gregory. Section in progress.",
  path: "/real-estate",
});

export default function RealEstatePage() {
  if (!REAL_ESTATE_PAGE_ENABLED) {
    notFound();
  }

  return (
    <div className="container-page py-16 sm:py-20">
      <PageIntro eyebrow="Coming Soon" title="Real Estate" />
      <ComingSoon />
    </div>
  );
}
