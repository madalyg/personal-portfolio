import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/page-intro";
import { ComingSoon } from "@/components/ui/coming-soon";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Real Estate",
  description: "Real estate — Madaly Gregory. Section in progress.",
  path: "/real-estate",
});

export default function RealEstatePage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <PageIntro eyebrow="Coming Soon" title="Real Estate" />
      <ComingSoon />
    </div>
  );
}
