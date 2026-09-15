import type { Metadata } from "next";
import { GlobeExperience } from "@/components/world/globe-experience";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "World",
  description:
    "Madaly Gregory — interactive travel globe with photo galleries from places around the world.",
  path: "/world",
});

export default function WorldPage() {
  return (
    <div className="w-full bg-[#04070a]">
      <GlobeExperience />
    </div>
  );
}
