import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { researchPapers } from "@/lib/data/research";
import { ResearchCard } from "@/components/research/research-card";
import { ResearchHashScroll } from "@/components/research/research-hash-scroll";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata: Metadata = pageMetadata({
  title: "Research",
  description:
    "Research by Madaly Gregory — papers and technical writeups in computational astrophysics, orbital modeling, quantum computing, and machine learning.",
  path: "/research",
});

export default function ResearchPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <ResearchHashScroll />
      <PageIntro
        eyebrow="Published & Ongoing"
        title="Research"
        description= "Selected writeups from coursework, independent study, and collaboration in astrophysics."
      />

      <div className="mt-12 flex flex-col gap-4">
        {researchPapers.map((paper) => (
          <ResearchCard key={paper.slug} paper={paper} />
        ))}
      </div>
    </div>
  );
}
