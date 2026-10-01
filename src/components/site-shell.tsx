"use client";

import Image from "next/image";
import { AnimatePresence, motion, MotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
  Phone,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6";

import { siteConfig } from "@/config/site";
import {
  certifications,
  educationCourses,
  experience,
  navItems,
  profile,
  suggestedPrompts,
  projects,
  skillGroups,
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
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base text-slate-300 sm:text-lg">{description}</p>
    </div>
  );
}

function ShowcaseCard({
  horizontalOffset,
  alignment,
  width,
  reduceMotion,
  children,
}: {
  horizontalOffset: MotionValue<number>;
  alignment: number;
  width: number;
  reduceMotion: boolean;
  children: (imageBrightness: MotionValue<string>) => ReactNode;
}) {
  const range = width * 1.4;
  const input = [alignment - range, alignment, alignment + range];
  const scale = useTransform(horizontalOffset, input, [0.98, 1.015, 0.98]);
  const opacity = useTransform(horizontalOffset, input, [0.45, 1, 0.45]);
  const imageBrightness = useTransform(horizontalOffset, input, ["brightness(0.8)", "brightness(1.04)", "brightness(0.8)"]);

  return (
    <motion.div
      className="portfolio-showcase-card"
      style={reduceMotion ? undefined : { scale, opacity }}
      data-reduced-motion={reduceMotion}
    >
      {children(imageBrightness)}
    </motion.div>
  );
}

function HorizontalShowcase<T>({
  items,
  getKey,
  renderItem,
  label,
  variant,
}: {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T, imageBrightness: MotionValue<string>) => ReactNode;
  label: string;
  variant: "projects" | "certificates";
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [cardLayouts, setCardLayouts] = useState<{ alignment: number; width: number }[]>([]);
  const reduceMotion = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });
  const horizontalOffset = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  useEffect(() => {
    const scrollSection = scrollRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!scrollSection || !viewport || !track || reduceMotion) return;

    const measure = () => {
      const maxTravel = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const layouts = Array.from(track.children).map((child) => {
        const card = child as HTMLElement;
        const width = card.offsetWidth;
        return {
          alignment: viewport.clientWidth / 2 - (card.offsetLeft + width / 2),
          width,
        };
      });

      setTravel(maxTravel);
      setScrollHeight(window.innerHeight + maxTravel);
      setCardLayouts(layouts);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items.length, reduceMotion]);

  return (
    <div
      ref={scrollRef}
      className={`portfolio-showcase-scroll portfolio-showcase-${variant}`}
      style={{ height: reduceMotion ? "auto" : scrollHeight ? `${scrollHeight}px` : "100vh" }}
    >
      <div
        ref={viewportRef}
        className="portfolio-showcase-viewport"
        data-reduced-motion={reduceMotion}
        role="region"
        aria-label={label}
      >
        <motion.div
          ref={trackRef}
          className="portfolio-showcase-track"
          style={reduceMotion ? undefined : { x: horizontalOffset }}
          data-reduced-motion={reduceMotion}
        >
          {items.map((item, index) => {
            const layout = cardLayouts[index] ?? { alignment: 0, width: 400 };
            return (
              <ShowcaseCard
                key={getKey(item)}
                horizontalOffset={horizontalOffset}
                alignment={layout.alignment}
                width={layout.width}
                reduceMotion={reduceMotion}
              >
                {(imageBrightness) => renderItem(item, imageBrightness)}
              </ShowcaseCard>
            );
          })}
        </motion.div>
      </div>
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

  const sendPrompt = async (promptText?: string) => {
    const text = (promptText ?? chatInput).trim();
    if (!text || isChatLoading) return;

    setChatMessages((current) => [...current, { role: "user", text }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = (await response.json()) as { answer?: string; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "The assistant is temporarily unavailable.");
      }

      const answer = typeof data.answer === "string"
        ? data.answer
        : "I don't have that information yet. You can contact Nikhil directly.";
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
    <div className="ibm-landing min-h-screen">
      <header className="ibm-header sticky top-0 z-50">
        <div className="ibm-header-inner">
          <Link href="#home" className="ibm-brand" aria-label="Nikhil Raj home">
            <span className="ibm-brand-mark">N</span>
            <span className="ibm-brand-name">Nikhil Raj</span>
          </Link>

          <nav className="ibm-nav hidden items-center gap-8 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="ibm-nav-item">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="ibm-actions">
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((value) => !value)}
              className="ibm-icon-button md:hidden"
            >
              <span className="flex flex-col gap-1.5">
                <span className="h-0.5 w-4 rounded-none bg-current" />
                <span className="h-0.5 w-4 rounded-none bg-current" />
                <span className="h-0.5 w-4 rounded-none bg-current" />
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
              className="ibm-mobile-nav md:hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="ibm-mobile-item"
                >
                  {item.label}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="home" className="ibm-main">
        <section className="ibm-hero">
          <div className="ibm-hero-body">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="ibm-hero-copy"
            >
              <p className="ibm-eyebrow">AI / Systems / Product</p>
              <h1>
                Nikhil Raj
                <span>{profile.role}</span>
              </h1>
              <p className="ibm-subcopy">{profile.intro}</p>

              <div className="ibm-cta-group">
                <a href="#projects" className="ibm-primary-cta">
                  View my work
                </a>
                <a href="#contact" className="ibm-secondary-cta">
                  Contact me
                </a>
              </div>

              <div className="ibm-mini-stats">
                <div>
                  <span>Current</span>
                  <strong>{profile.currentStatus}</strong>
                </div>
                <div>
                  <span>Institute</span>
                  <strong>{profile.institute}</strong>
                </div>
                <div>
                  <span>Focus</span>
                  <strong>AI + Data</strong>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="ibm-visual"
            >
              <div className="ibm-visual-panel">
                <Image
                  src="/images/profile-photo.jpg"
                  alt="Nikhil Raj portrait"
                  fill
                  priority
                  className="object-cover object-center"
                />
              </div>
            </motion.div>

            <aside className="ibm-side-card">
              <div className="ibm-side-card-label">Currently building</div>
              <p>{profile.currentFocus}</p>
              <ul>
                <li>AI product ideas</li>
                <li>Applied machine learning</li>
                <li>Full-stack systems</li>
              </ul>
            </aside>
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
              className="rounded-none border border-white/10 bg-white/5 p-6"
            >
              <p className="text-lg leading-8 text-slate-200">{profile.about}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-none border border-white/10 bg-slate-900/70 p-4">
                  <GraduationCap className="mb-3 h-5 w-5 text-sky-300" />
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Current</div>
                  <div className="mt-2 font-medium text-white">{profile.degree}</div>
                  <div className="text-sm text-slate-300">{profile.institute}</div>
                </div>
                <div className="rounded-none border border-white/10 bg-slate-900/70 p-4">
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
              className="rounded-none border border-white/10 bg-slate-900/80 p-6"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-none bg-sky-500/15 p-2 text-sky-300">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-white">What I&apos;m building</h3>
              </div>
              <p className="mt-4 text-slate-300">{profile.currentFocus}</p>
              <div className="mt-6 space-y-4 text-sm text-slate-200">
                <div className="flex items-start gap-3 rounded-none border border-white/10 bg-white/5 p-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-sky-300" />
                  <span>AI-driven product ideas and applied machine learning work.</span>
                </div>
                <div className="flex items-start gap-3 rounded-none border border-white/10 bg-white/5 p-3">
                  <Code2 className="mt-0.5 h-4 w-4 text-sky-300" />
                  <span>Full-stack engineering and strong interaction design fundamentals.</span>
                </div>
                <div className="flex items-start gap-3 rounded-none border border-white/10 bg-white/5 p-3">
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
                className="rounded-none border border-white/10 bg-white/5 p-5"
              >
                <h3 className="mb-4 text-lg font-semibold text-white">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-sm text-slate-300"
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
          <SectionHeading
            eyebrow="Projects"
            title="Real systems, research-driven work, and product thinking"
            description="I build projects that sit at the intersection of software engineering, AI, and real-world product development."
          />
          <HorizontalShowcase
            items={projects}
            getKey={(project) => project.slug}
            label="Portfolio projects"
            variant="projects"
            renderItem={(project, imageBrightness) => (
              <article className="group relative h-full overflow-hidden rounded-none border border-white/10 bg-white/5">
                <Link
                  href={`/projects/${project.slug}`}
                  aria-label={`View ${project.title} project details`}
                  className="absolute inset-0 z-10"
                />
                <div className="pointer-events-none relative z-20">
                  <div className={cn("relative h-44 border-b border-white/10 bg-gradient-to-br", project.accent)}>
                    {project.imageUrl ? (
                      <motion.div className="absolute inset-0" style={{ filter: imageBrightness }}>
                        <Image
                          src={project.imageUrl}
                          alt={`${project.title} dashboard`}
                          fill
                          quality={100}
                          sizes="(max-width: 1024px) 70vw, 608px"
                          className={project.slug === "titanic-survival-predictor" ? "bg-[#101820] object-contain object-center" : project.slug === "quant-x" ? "object-cover object-center" : "object-cover object-top"}
                        />
                      </motion.div>
                    ) : null}
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-slate-300">{project.category}</span>
                      <span className="text-xs text-slate-400">{project.status}</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{project.shortDescription}</p>
                    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="text-xs text-slate-200">{tech}</span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-2 font-medium text-sky-300">
                        View project <ArrowRight className="h-4 w-4" />
                      </span>
                      {project.githubUrl !== "[ADD GITHUB URL]" ? (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} on GitHub`} className="pointer-events-auto">
                          <Globe className="h-4 w-4 text-slate-300" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            )}
          />
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
                <span className="absolute left-0 top-2 flex h-6 w-6 items-center justify-center rounded-none border border-sky-400/40 bg-sky-500/10 text-sky-300">
                  <span className="h-2 w-2 rounded-none bg-sky-300" />
                </span>
                <div className="rounded-none border border-white/10 bg-white/5 p-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-sky-300">{item.period}</div>
                  <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-slate-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="certifications" className="scroll-mt-24 py-16">
          <SectionHeading
            eyebrow="Certifications"
            title="Certificates and programs"
            description="A record of learning, participation, and applied project experience."
          />

          <HorizontalShowcase
            items={certifications}
            getKey={(item) => item.title}
            label="Certificates"
            variant="certificates"
            renderItem={(item) => (
              <article className="h-full overflow-hidden rounded-none border border-white/10 bg-white/5">
                <div className="relative aspect-[16/9] bg-white">
                  {item.certificateImage ? (
                    <Image
                      src={item.certificateImage}
                      alt={`${item.title} certificate`}
                      fill
                      sizes="(max-width: 1024px) 80vw, 736px"
                      className="object-contain"
                    />
                  ) : null}
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{item.issuer}</p>
                  {item.date ? <p className="mt-1 text-sm text-slate-400">{item.date}</p> : null}
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
                  {item.credentialId && item.credentialId !== "[ADD CREDENTIAL ID]" ? (
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">ID: {item.credentialId}</p>
                  ) : null}
                  {item.credentialUrl && item.credentialUrl !== "[ADD URL]" ? (
                    <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sky-300">
                      View credential <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </article>
            )}
          />
        </section>

        <section id="contact" className="scroll-mt-24 py-16">
          <SectionHeading
            eyebrow="Contact"
            title="Let’s talk about systems, AI, and thoughtful engineering"
            description="I am open to technical conversations, collaborative projects, and meaningful opportunities to build and learn."
          />

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4 rounded-none border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-sky-300" />
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</div>
                  <a href={`mailto:${siteConfig.email}`} className="mt-1 text-slate-200 hover:text-sky-300">
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              {siteConfig.phone ? (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-sky-300" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Phone</div>
                    <a href={`tel:${siteConfig.phone}`} className="mt-1 text-slate-200 hover:text-sky-300">
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>
              ) : null}

              <div className="pt-2">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Connect</div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={siteConfig.social.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub" className="rounded-none border border-white/10 bg-slate-900 p-3 text-slate-100 transition hover:border-sky-400/40 hover:text-sky-300">
                    <FaGithub className="h-4 w-4" />
                  </a>
                  <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn" className="rounded-none border border-white/10 bg-slate-900 p-3 text-slate-100 transition hover:border-sky-400/40 hover:text-sky-300">
                    <FaLinkedin className="h-4 w-4" />
                  </a>
                  <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram" className="rounded-none border border-white/10 bg-slate-900 p-3 text-slate-100 transition hover:border-sky-400/40 hover:text-sky-300">
                    <FaInstagram className="h-4 w-4" />
                  </a>
                  <a href={siteConfig.social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube" className="rounded-none border border-white/10 bg-slate-900 p-3 text-slate-100 transition hover:border-sky-400/40 hover:text-sky-300">
                    <FaYoutube className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </section>

        <section className="py-8">
          <div className="rounded-none border border-white/10 bg-slate-900/80 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-sky-300">Education</div>
                <h3 className="mt-2 text-2xl font-semibold text-white">{profile.institute}</h3>
                <p className="mt-1 text-slate-300">{profile.degree}</p>
                <p className="mt-1 text-slate-400">Specialization: {profile.specialization}</p>
              </div>
              <div className="grid max-w-lg grid-cols-2 gap-2 sm:grid-cols-3">
                {educationCourses.map((course) => (
                  <span key={course} className="rounded-none border border-white/10 bg-white/5 px-2.5 py-1.5 text-center text-[11px] text-slate-200">
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
            <a href={siteConfig.social.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-sky-300">
              <FaGithub className="h-4 w-4" />
              GitHub
            </a>
            <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-sky-300">
              <FaLinkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-sky-300">
              <FaInstagram className="h-4 w-4" />
              Instagram
            </a>
            <a href={siteConfig.social.youtube} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-sky-300">
              <FaYoutube className="h-4 w-4" />
              YouTube
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
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-none bg-sky-500 text-slate-950 shadow-xl shadow-sky-950/30 transition hover:bg-sky-400"
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
            className="fixed bottom-24 right-6 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-none border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/40 backdrop-blur-xl"
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
                <div key={`${message.role}-${index}`} className={cn("max-w-[85%] rounded-none px-3 py-2 text-sm leading-6", message.role === "assistant" ? "bg-slate-800 text-slate-100" : "ml-auto bg-sky-500 text-slate-950")}>
                  {message.text}
                </div>
              ))}
              {isChatLoading && <div className="max-w-[85%] rounded-none bg-slate-800 px-3 py-2 text-sm text-slate-100">Typing...</div>}
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendPrompt(prompt)}
                    className="rounded-none border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] text-slate-200 transition hover:border-sky-400/40 hover:text-sky-300"
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
                  className="flex-1 rounded-none border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400 focus:border-sky-400/50"
                />
                <button
                  type="button"
                  onClick={() => void sendPrompt()}
                  disabled={isChatLoading}
                  className="rounded-none bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isChatLoading ? "Sending..." : "Send"}
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
          className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-none border border-white/10 bg-slate-900 text-slate-100 shadow-lg shadow-black/30 hover:text-sky-300"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function ContactForm() {
  const emptyForm = {
    name: "",
    email: "",
    inquiryType: "",
    subject: "",
    message: "",
    organization: "",
    budgetRange: "",
    timeline: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof emptyForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

      setStatus({ type: "success", message: "Thanks. Your message is saved and I’ll get back to you." });
      setForm(emptyForm);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-none border border-white/10 bg-slate-900/80 p-6">
      <p className="mb-5 text-xs text-slate-400"><span className="text-sky-300">*</span> Required</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Name <span className="text-sky-300">*</span></span>
          <input
            required
            minLength={2}
            maxLength={100}
            value={form.name}
            onChange={handleChange("name")}
            className="w-full rounded-none border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-400/50"
            placeholder="Your name"
          />
        </label>
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Email <span className="text-sky-300">*</span></span>
          <input
            required
            type="email"
            maxLength={254}
            value={form.email}
            onChange={handleChange("email")}
            className="w-full rounded-none border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-400/50"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">What can I help with? <span className="text-sky-300">*</span></span>
          <select
            required
            value={form.inquiryType}
            onChange={handleChange("inquiryType")}
            className="w-full rounded-none border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none focus:border-sky-400/50"
          >
            <option value="" disabled>Select a reason</option>
            <option>Project collaboration</option>
            <option>Freelance or contract</option>
            <option>Job opportunity</option>
            <option>Technical question</option>
            <option>Other</option>
          </select>
        </label>
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Organization <span className="text-slate-500">Optional</span></span>
          <input
            maxLength={120}
            value={form.organization}
            onChange={handleChange("organization")}
            className="w-full rounded-none border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-400/50"
            placeholder="Company, team, or school"
          />
        </label>
      </div>

      <label className="mt-4 block text-sm text-slate-200">
        <span className="mb-2 block">Subject <span className="text-sky-300">*</span></span>
        <input
          required
          minLength={3}
          maxLength={160}
          value={form.subject}
          onChange={handleChange("subject")}
          className="w-full rounded-none border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-400/50"
          placeholder="Project inquiry"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Budget range <span className="text-slate-500">Optional</span></span>
          <select
            value={form.budgetRange}
            onChange={handleChange("budgetRange")}
            className="w-full rounded-none border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none focus:border-sky-400/50"
          >
            <option value="">Prefer not to say</option>
            <option>Under INR 50,000</option>
            <option>INR 50,000-250,000</option>
            <option>INR 250,000+</option>
            <option>Not sure</option>
          </select>
        </label>
        <label className="block text-sm text-slate-200">
          <span className="mb-2 block">Timeline <span className="text-slate-500">Optional</span></span>
          <select
            value={form.timeline}
            onChange={handleChange("timeline")}
            className="w-full rounded-none border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none focus:border-sky-400/50"
          >
            <option value="">No fixed timeline</option>
            <option>As soon as possible</option>
            <option>Within 1 month</option>
            <option>Within 3 months</option>
            <option>Flexible</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block text-sm text-slate-200">
        <span className="mb-2 block">Message <span className="text-sky-300">*</span></span>
        <textarea
          required
          minLength={20}
          maxLength={5000}
          value={form.message}
          onChange={handleChange("message")}
          rows={5}
          className="w-full rounded-none border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-400/50"
          placeholder="Share the context, goal, and any important details."
        />
      </label>

      {status.message ? (
        <div
          className={cn(
            "mt-4 rounded-none border px-3 py-2 text-sm",
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
        className="mt-5 inline-flex w-full items-center justify-center rounded-none bg-sky-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
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
        <div className="rounded-none border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-sky-300">Current status</div>
          <h3 className="mt-3 text-2xl font-semibold text-white">{profile.currentStatus}</h3>
          <p className="mt-2 text-slate-300">{profile.degree}</p>
          <p className="mt-1 text-slate-400">{profile.institute}</p>
          <p className="mt-4 text-slate-200">Specialization: {profile.specialization}</p>
        </div>
        <div className="rounded-none border border-white/10 bg-white/5 p-6">
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
        <div className="space-y-5 rounded-none border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-sky-300" />
            <a href={`mailto:${siteConfig.email}`} className="text-slate-200 hover:text-sky-300">{siteConfig.email}</a>
          </div>
          <div className="flex items-center gap-3">
            <FaGithub className="h-5 w-5 text-sky-300" />
            <a href={siteConfig.social.github} target="_blank" rel="noreferrer" className="text-slate-200 hover:text-sky-300">GitHub</a>
          </div>
          <div className="flex items-center gap-3">
            <FaLinkedin className="h-5 w-5 text-sky-300" />
            <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" className="text-slate-200 hover:text-sky-300">LinkedIn</a>
          </div>
          <div className="flex items-center gap-3">
            <FaInstagram className="h-5 w-5 text-sky-300" />
            <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="text-slate-200 hover:text-sky-300">Instagram</a>
          </div>
          <div className="flex items-center gap-3">
            <FaYoutube className="h-5 w-5 text-sky-300" />
            <a href={siteConfig.social.youtube} target="_blank" rel="noreferrer" className="text-slate-200 hover:text-sky-300">YouTube</a>
          </div>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
