import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SITE, SITE_URL } from "@/lib/seo/site";

// Applies the saved theme before hydration so there's no flash on load.
// Unset visitors default to light — not the OS color scheme.
const THEME_INIT_SCRIPT = `
  (function () {
    try {
      if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
      }
    } catch (e) {}
  })();
`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.defaultTitle,
    template: `%s | ${SITE.personName}`,
  },
  description: SITE.defaultDescription,
  applicationName: SITE.personName,
  authors: [{ name: SITE.personName, url: SITE.url }],
  creator: SITE.personName,
  publisher: SITE.personName,
  keywords: [
    SITE.personName,
    SITE.brandName,
    ...SITE.alternateNames,
    "Madaly Gregory portfolio",
    "Madaly Gregory official website",
    "software engineer",
    "computational physicist",
    "computational astrophysics",
    ...SITE.knowsAbout,
  ],
  alternates: { canonical: SITE.url },
  openGraph: {
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
    url: SITE.url,
    siteName: SITE.personName,
    locale: SITE.locale,
    type: "website",
    images: [{ url: "/profile.jpg", alt: `Portrait of ${SITE.personName}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
    images: ["/profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-white font-sans dark:bg-zinc-950">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
