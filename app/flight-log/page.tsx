import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/page-intro";
import { ComingSoon } from "@/components/ui/coming-soon";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Flight Log",
  description: "Flight log by Madaly Gregory — section in progress.",
  path: "/flight-log",
});

export default function FlightLogPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <PageIntro eyebrow="Coming Soon" title="Flight Log" />
      <ComingSoon />
    </div>
  );
}
