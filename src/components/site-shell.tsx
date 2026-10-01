"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  Cpu,
  ExternalLink,
  Globe,
  GraduationCap,
  Layers3,
  Mail,
  MessageCircle,
  Moon,
  Phone,
  Sparkles,
  SunMedium,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { siteConfig } from "@/config/site";
import {
  achievements,
  certifications,
  educationCourses,
  experience,
  navItems,
  profile,
  projects,
  skillGroups,
  suggestedPrompts,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base text-slate-300 sm:text-lg">{description}</p>
    </div>
  );
}

export function PortfolioHome() {
  const prefersReducedMotion = useReducedMotion();
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const saved = window.localStorage.getItem("portfolio-theme");
    return saved === "light" || saved === "dark" ? saved : "light";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I’m Nikhil AI. Ask me about Nikhil’s education, skills, projects, or contact details.",
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const featuredProjects = useMemo(() => projects.filter((project) => project.featured), []);

  const sendPrompt = async (promptText?: string) => {
    const text = (promptText ?? chatInput).trim();
    if (!text) return;

    setChatMessages((current) => [...current, { role: "user", text }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      const answer = data.answer ?? "I don't have that information yet. You can contact Nikhil directly.";
      setChatMessages((current) => [...current, { role: "assistant", text: answer }]);
    } catch {
      setChatMessages((current) => [
        ...current,
        { role: "assistant", text: "The assistant is temporarily unavailable. Please try again in a moment." },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="#home" className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-slate-100 uppercase">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-400/40 bg-sky-500/10 text-base text-sky-300">
              NR
            </span>
            Nikhil Raj
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="text-sm text-slate-300 transition hover:text-sky-300">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Toggle light and dark mode"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 transition hover:border-sky-400/40 hover:text-sky-300"
            >
              {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 md:hidden"
            >
              <span className="flex flex-col gap-1.5">
                <span className="h-0.5 w-4 rounded-full bg-current" />
                <span className="h-0.5 w-4 rounded-full bg-current" />
                <span className="h-0.5 w-4 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10 bg-slate-950 md:hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-white/10 px-4 py-3 text-sm text-slate-200 last:border-b-0"
                >
                  {item.label}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="home" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden pb-20 pt-16 sm:pt-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.20),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),transparent_30%)]" />
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
                <Sparkles className="h-3.5 w-3.5" />
                AI / Systems / Product
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Hi, I&apos;m <span className="text-sky-300">Nikhil Raj.</span>
              </h1>
              <p className="mt-5 text-xl font-medium text-slate-200 sm:text-2xl">
                {profile.role}
              </p>
              <p className="mt-6 max-w-xl text-lg text-slate-300">{profile.intro}</p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-sky-400"
                >
                  View My Work
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 font-medium text-slate-100 transition hover:border-sky-400/40 hover:text-sky-300"
                >
                  Contact Me
                </a>
                <a
                  href="/resume/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-transparent px-5 py-3 font-medium text-slate-100 transition hover:border-sky-400/40 hover:text-sky-300"
                >
                  Download Resume
                </a>
              </div>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</div>
                  <div className="mt-2 text-lg font-semibold text-sky-300">{profile.currentStatus}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Institute</div>
                  <div className="mt-2 text-lg font-semibold text-sky-300">IIIT</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Focus</div>
                  <div className="mt-2 text-lg font-semibold text-sky-300">AI</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="overflow-hidden bg-transparent">
                <Image
                  src="/images/profile-photo.jpg"
                  alt="Nikhil Raj profile portrait"
                  width={720}
                  height={900}
                  className="h-[500px] w-full object-cover object-center"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="scroll-mt-24 py-16">
          <SectionHeading
            eyebrow="About"
            title="Engineer with a systems-first mindset"
            description="I am building a strong technical base in AI, data science, and software engineering while staying grounded in real-world product design and implementation."
          />

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
            >
              <p className="text-lg leading-8 text-slate-200">{profile.about}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <GraduationCap className="mb-3 h-5 w-5 text-sky-300" />
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Current</div>
                  <div className="mt-2 font-medium text-white">{profile.degree}</div>
                  <div className="text-sm text-slate-300">{profile.institute}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <BriefcaseBusiness className="mb-3 h-5 w-5 text-sky-300" />
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Focus</div>
                  <div className="mt-2 font-medium text-white">{profile.specialization}</div>
                  <div className="text-sm text-slate-300">AI, ML, Data Science</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-sky-500/15 p-2 text-sky-300">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-white">What I&apos;m building</h3>
              </div>
              <p className="mt-4 text-slate-300">{profile.currentFocus}</p>
              <div className="mt-6 space-y-4 text-sm text-slate-200">
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-sky-300" />
                  <span>AI-driven product ideas and applied machine learning work.</span>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <Code2 className="mt-0.5 h-4 w-4 text-sky-300" />
                  <span>Full-stack engineering and strong interaction design fundamentals.</span>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <Zap className="mt-0.5 h-4 w-4 text-sky-300" />
                  <span>Performance-oriented systems thinking with a practical builder mindset.</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="skills" className="scroll-mt-24 py-16">
          <SectionHeading
            eyebrow="Skills"
            title="Technical depth across software, AI, and data"
            description="I focus on practical engineering fundamentals while continuing to build breadth across AI, applied data science, and modern web product development."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {skillGroups.map((group, index) => (
              <motion.div
                key={group.title}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
              >
                <h3 className="mb-4 text-lg font-semibold text-white">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1.5 text-sm text-sky-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="projects" className="scroll-mt-24 py-16">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Projects"
              title="Real systems, research-driven work, and product thinking"
              description="I build projects that sit at the intersection of software engineering, AI, and real-world utility."
            />
            <Link href="/projects" className="hidden items-center gap-2 text-sm font-medium text-sky-300 md:inline-flex">
              Explore all projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <motion.article
                key={project.slug}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5"
              >
                <div className={cn("h-40 border-b border-white/10 bg-gradient-to-br", project.accent)} />
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/10 bg-slate-950/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                      {project.category}
                    </span>
                    <span className="text-xs text-slate-400">{project.status}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{project.shortDescription}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="rounded-full border border-white/10 bg-slate-900/60 px-2 py-1 text-[11px] text-slate-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between text-sm">
                    <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 font-medium text-sky-300">
                      View details <ArrowRight className="h-4 w-4" />
                    </Link>
                    {project.githubUrl !== "[ADD GITHUB URL]" ? (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-slate-300">
                        <Globe className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="experience" className="scroll-mt-24 py-16">
          <SectionHeading
            eyebrow="Journey"
            title="Building momentum from foundation to applied technical work"
            description="My engineering journey has been shaped by fundamentals, practical application, and a continuing focus on AI, systems, and product thinking."
          />

          <div className="relative mt-8 space-y-5 before:absolute before:left-3 before:top-0 before:h-full before:w-px before:bg-white/10">
            {experience.map((item, index) => (
              <motion.div
                key={item.period}
                initial={prefersReducedMotion ? false : { opacity: 0, x: -14 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="relative pl-10"
              >
                <span className="absolute left-0 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-sky-400/40 bg-sky-500/10 text-sky-300">
                  <span className="h-2 w-2 rounded-full bg-sky-300" />
                </span>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-sky-300">{item.period}</div>
                  <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-slate-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="achievements" className="scroll-mt-24 py-16">
          <SectionHeading
            eyebrow="Achievements"
            title="Progress, recognition, and milestones"
            description="The profile is intentionally structured so achievement entries can be updated as they are earned."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {achievements.map((achievement) => (
              <div key={achievement.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div className="mb-4 flex items-center gap-3 text-sky-300">
                  <Trophy className="h-5 w-5" />
                  <span className="text-xs uppercase tracking-[0.2em]">Achievement</span>
                </div>
                <h3 className="text-xl font-semibold text-white">{achievement.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{achievement.organization}</p>
                <p className="mt-1 text-sm text-slate-400">{achievement.date}</p>
                <p className="mt-4 text-sm leading-6 text-slate-300">{achievement.description}</p>
                {achievement.link !== "[ADD LINK]" ? (
                  <a href={achievement.link} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sky-300">
                    View link <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section id="certifications" className="scroll-mt-24 py-16">
          <SectionHeading
            eyebrow="Certifications"
            title="A clean, updatable record of learning"
            description="Certification entries are intentionally structured so they can be replaced with real credentials when they become available."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {certifications.map((item) => (
              <div key={item.title} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
                <div className="flex h-40 items-center justify-center border-b border-white/10 bg-gradient-to-br from-sky-500/10 via-slate-900 to-slate-950">
                  <div className="rounded-2xl border border-dashed border-sky-400/30 bg-slate-950/60 px-4 py-3 text-xs uppercase tracking-[0.2em] text-sky-300">
                    Certificate
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{item.issuer}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.date}</p>
                  {item.credentialId !== "[ADD CREDENTIAL ID]" ? (
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">ID: {item.credentialId}</p>
                  ) : null}
                  {item.credentialUrl !== "[ADD URL]" ? (
                    <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sky-300">
                      View credential <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 py-16">
          <SectionHeading
            eyebrow="Contact"
            title="Let’s talk about systems, AI, and thoughtful engineering"
            description="I am open to technical conversations, collaborative projects, and meaningful opportunities to build and learn."
          />

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-sky-300" />
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</div>
                  <a href={`mailto:${siteConfig.email}`} className="mt-1 text-slate-200 hover:text-sky-300">
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-sky-300" />
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Phone</div>
                  <a href={`tel:${siteConfig.phone}`} className="mt-1 text-slate-200 hover:text-sky-300">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Connect</div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={siteConfig.social.github} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-slate-900 p-3 text-slate-100 transition hover:border-sky-400/40 hover:text-sky-300">
                    <Globe className="h-4 w-4" />
                  </a>
                  <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-slate-900 p-3 text-slate-100 transition hover:border-sky-400/40 hover:text-sky-300">
                    <BriefcaseBusiness className="h-4 w-4" />
                  </a>
                  <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-slate-900 p-3 text-slate-100 transition hover:border-sky-400/40 hover:text-sky-300">
                    <Sparkles className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </section>

        <section className="py-8">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-sky-300">Education</div>
                <h3 className="mt-2 text-2xl font-semibold text-white">{profile.institute}</h3>
                <p className="mt-1 text-slate-300">{profile.degree}</p>
                <p className="mt-1 text-slate-400">Specialization: {profile.specialization}</p>
              </div>
              <div className="grid max-w-lg grid-cols-2 gap-2 sm:grid-cols-3">
                {educationCourses.map((course) => (
                  <span key={course} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-center text-[11px] text-slate-200">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 {siteConfig.name}. Built with Next.js and a product-focused engineering mindset.</p>
          <div className="flex items-center gap-4">
            <a href={siteConfig.social.github} target="_blank" rel="noreferrer" className="hover:text-sky-300">
              GitHub
            </a>
            <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-sky-300">
              LinkedIn
            </a>
            <a href="#home" className="hover:text-sky-300">
              Back to top
            </a>
          </div>
        </div>
      </footer>

      <button
        type="button"
        onClick={() => setChatOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-slate-950 shadow-xl shadow-sky-950/30 transition hover:bg-sky-400"
        aria-label="Open chatbot"
      >
        <MessageCircle className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {chatOpen && (
          <motion.aside
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 18, scale: 0.96 }}
            className="fixed bottom-24 right-6 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/40 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-white">Nikhil AI</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Portfolio assistant</div>
              </div>
              <button type="button" onClick={() => setChatOpen(false)} className="text-slate-300 hover:text-white">
                ✕
              </button>
            </div>

            <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-4">
              {chatMessages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={cn("max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6", message.role === "assistant" ? "bg-slate-800 text-slate-100" : "ml-auto bg-sky-500 text-slate-950")}>
                  {message.text}
                </div>
              ))}
              {isChatLoading && <div className="max-w-[85%] rounded-2xl bg-slate-800 px-3 py-2 text-sm text-slate-100">Typing...</div>}
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendPrompt(prompt)}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] text-slate-200 transition hover:border-sky-400/40 hover:text-sky-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void sendPrompt();
                    }
                  }}
                  placeholder="Ask about Nikhil..."
                  className="flex-1 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400 focus:border-sky-400/50"
                />
                <button
                  type="button"
                  onClick={() => void sendPrompt()}
                  className="rounded-full bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-slate-100 shadow-lg shadow-black/30 hover:text-sky-300"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to send your message right now.");
      }

      setStatus({ type: "success", message: "Your message has been sent successfully." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Name</span>
          <input
            required
            value={form.name}
            onChange={handleChange("name")}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-400/50"
            placeholder="Your name"
          />
        </label>
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-400/50"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="mt-4 block text-sm text-slate-200">
        <span className="mb-2 block">Subject</span>
        <input
          required
          value={form.subject}
          onChange={handleChange("subject")}
          className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-400/50"
          placeholder="Project inquiry"
        />
      </label>

      <label className="mt-4 block text-sm text-slate-200">
        <span className="mb-2 block">Message</span>
        <textarea
          required
          value={form.message}
          onChange={handleChange("message")}
          rows={5}
          className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-400/50"
          placeholder="Tell me about your idea, question, or project."
        />
      </label>

      {status.message ? (
        <div
          className={cn(
            "mt-4 rounded-2xl border px-3 py-2 text-sm",
            status.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border-red-500/30 bg-red-500/10 text-red-200",
          )}
        >
          {status.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

export function AboutPageSection() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="About"
        title="A builder grounded in AI, data, and systems"
        description="I am a serious engineering-minded student building real software and intelligent systems rather than just polishing a generic profile."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-sky-300">Current status</div>
          <h3 className="mt-3 text-2xl font-semibold text-white">{profile.currentStatus}</h3>
          <p className="mt-2 text-slate-300">{profile.degree}</p>
          <p className="mt-1 text-slate-400">{profile.institute}</p>
          <p className="mt-4 text-slate-200">Specialization: {profile.specialization}</p>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-sky-300">Current focus</div>
          <p className="mt-4 text-slate-200">{profile.currentFocus}</p>
        </div>
      </div>
    </main>
  );
}

export function ContactPageSection() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Contact"
        title="Connect and collaborate"
        description="I enjoy discussing technical ideas, product work, and opportunities rooted in software, AI, and systems." 
      />
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-5 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-sky-300" />
            <a href={`mailto:${siteConfig.email}`} className="text-slate-200 hover:text-sky-300">{siteConfig.email}</a>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-sky-300" />
            <a href={`tel:${siteConfig.phone}`} className="text-slate-200 hover:text-sky-300">{siteConfig.phone}</a>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-sky-300" />
            <a href={siteConfig.social.github} target="_blank" rel="noreferrer" className="text-slate-200 hover:text-sky-300">GitHub</a>
          </div>
          <div className="flex items-center gap-3">
            <BriefcaseBusiness className="h-5 w-5 text-sky-300" />
            <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" className="text-slate-200 hover:text-sky-300">LinkedIn</a>
          </div>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
