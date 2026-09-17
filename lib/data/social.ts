export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "mail";
  handle: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/madalyg",
    icon: "github",
    handle: "@madalyg",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/madalyg",
    icon: "linkedin",
    handle: "/in/madalyg",
  },
  {
    label: "Email",
    href: "mailto:madalygregory@gmail.com",
    icon: "mail",
    handle: "madalygregory@gmail.com",
  },
];
