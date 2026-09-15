import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProfilePhoto } from "@/components/home/profile-photo";
import { AuroraCanvas } from "@/components/home/aurora-canvas";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <AuroraCanvas />
      {/* Grid backdrop only shows in light mode — dark mode gets the
          aurora scene above instead. */}
      <div className="bg-grid-fade absolute inset-0 dark:hidden" />

      <div className="container-page relative py-16 sm:py-24 md:py-32">
        <div className="relative">
          {/* Frosted glass card, dark mode only — a separate, absolutely
              positioned backdrop rather than padding on `.hero-grid`
              itself, so it doesn't eat into the grid's own width (which
              would squeeze the heading into the photo on narrow mobile
              screens). It just floats a few pixels outside the content. */}
          <div className="pointer-events-none absolute -inset-4 hidden rounded-2xl bg-zinc-950/35 shadow-2xl shadow-black/40 backdrop-blur-xl dark:block sm:-inset-6 sm:rounded-3xl md:-inset-8" />

          <div className="hero-grid relative">
            <h1
              style={{ gridArea: "heading" }}
              className="animate-fade-up min-w-0 max-w-4xl text-balance text-center text-5xl font-medium leading-[1.1] tracking-tight text-zinc-950 opacity-0 sm:text-left sm:text-6xl md:text-7xl dark:text-zinc-50"
            >
              <span className="sr-only">Madaly Gregory — </span>
              <span className="text-zinc-950 dark:text-zinc-50">MADALY</span>
            </h1>

            <div
              style={{ gridArea: "photo" }}
              className="animate-fade-up shrink-0 justify-self-center opacity-0 [animation-delay:120ms] sm:justify-self-auto"
            >
              <ProfilePhoto />
            </div>

            <p
              style={{ gridArea: "bio" }}
              className="animate-fade-up mx-auto max-w-2xl text-balance text-center text-lg leading-relaxed text-zinc-700 opacity-0 [animation-delay:80ms] sm:mx-0 sm:text-left sm:text-xl dark:text-zinc-300"
            >
              Software engineer and computational physicist building systems
              combining code, the physics of our universe, and hardware. With
              7+ years of programming experience, 2+ years in Fortune 500
              software + embedded systems engineering, and a B.S. in Physics as
              a first-generation graduate, I&apos;ve presented computational
              astrophysics research internationally and am preparing for
              graduate studies in Electrical Engineering focused on autonomous
              spacecraft systems.
            </p>

            <div
              style={{ gridArea: "cta" }}
              className="animate-fade-up flex flex-wrap items-center justify-center gap-4 pt-2 opacity-0 [animation-delay:160ms] sm:justify-start"
            >
              <Link href="/projects" className="group btn-primary">
                View Projects
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 ease-precise group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </Link>
              <Link href="/research" className="group btn-secondary">
                Read Research
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 ease-precise group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </Link>
            </div>

            <dl
              style={{ gridArea: "stats" }}
              className="animate-fade-up mt-4 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-4 border-t border-zinc-200 pt-8 font-mono text-sm opacity-0 [animation-delay:240ms] sm:grid-cols-3 dark:border-zinc-800"
            >
              {[
                { label: "Degree", value: "B.S. Physics" },
                { label: "Upcoming", value: "M.S. EE" },
                { label: "Based In", value: "Seattle" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <dt className="uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                    {item.label}
                  </dt>
                  <dd className="text-zinc-900 dark:text-zinc-100">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
