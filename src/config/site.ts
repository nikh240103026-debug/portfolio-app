export const siteConfig = {
  name: "Nikhil Raj",
  title: "Nikhil Raj — Computer Science Engineer | AI & Data Science",
  description:
    "Computer Science Engineer specializing in AI and Data Science, building intelligent systems, data-driven products, and high-performance software.",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "[ADD YOUR EMAIL]",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "[ADD YOUR PHONE]",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  social: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/nikh240103026-debug",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "[ADD YOUR LINKEDIN]",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "[ADD YOUR INSTAGRAM]",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "[ADD YOUR YOUTUBE]",
  },
};
