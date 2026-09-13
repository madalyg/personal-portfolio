/** Fixed center reticle — circular sniper-style scope with crosshairs. */
export function GlobeViewfinder() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      aria-hidden
    >
      <svg
        width="38"
        height="38"
        viewBox="0 0 40 40"
        className="text-zinc-400/55"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
      >
        {/* Scope ring */}
        <circle cx="20" cy="20" r="16.5" strokeWidth="1.1" />

        {/* Crosshairs — gap at center */}
        <path d="M20 3.5 V15.5" strokeWidth="1" />
        <path d="M20 24.5 V36.5" strokeWidth="1" />
        <path d="M3.5 20 H15.5" strokeWidth="1" />
        <path d="M24.5 20 H36.5" strokeWidth="1" />

        {/* Center aim point */}
        <circle cx="20" cy="20" r="0.85" fill="currentColor" stroke="none" />

        {/* Mil-style ticks on axes */}
        <circle cx="20" cy="10.5" r="0.55" fill="currentColor" stroke="none" opacity="0.65" />
        <circle cx="20" cy="29.5" r="0.55" fill="currentColor" stroke="none" opacity="0.65" />
        <circle cx="10.5" cy="20" r="0.55" fill="currentColor" stroke="none" opacity="0.65" />
        <circle cx="29.5" cy="20" r="0.55" fill="currentColor" stroke="none" opacity="0.65" />
      </svg>
    </div>
  );
}
