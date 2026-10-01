import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Globe, Layers3 } from "lucide-react";
import { notFound } from "next/navigation";

import { projects } from "@/data/portfolio";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/projects" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-sky-300">
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
        <div className="relative h-56 border-b border-white/10 bg-gradient-to-br from-sky-500/20 via-slate-900 to-slate-950">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={`${project.title} dashboard`}
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
              className={project.slug === "quant-x" ? "object-cover object-center" : "object-cover object-top"}
            />
          ) : null}
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-sky-300">{project.category}</div>
              <h1 className="mt-3 text-4xl font-semibold text-white">{project.title}</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              {project.githubUrl !== "[ADD GITHUB URL]" ? (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 hover:text-sky-300">
                  <Globe className="h-4 w-4" /> GitHub
                </a>
              ) : null}
              {project.liveUrl !== "#" ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-200 hover:text-sky-100">
                  <ExternalLink className="h-4 w-4" /> Live Demo
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">Overview</h2>
            <p className="mt-4 text-slate-300">{project.description}</p>
          </section>

          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">Problem</h2>
            <p className="mt-4 text-slate-300">{project.problem}</p>
          </section>

          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">Solution</h2>
            <p className="mt-4 text-slate-300">{project.solution}</p>
          </section>

          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">Architecture</h2>
            <p className="mt-4 text-slate-300">{project.architecture}</p>
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-sky-400/30 bg-slate-950/60 p-5">
              <div className="flex items-center gap-3 text-sky-300">
                <Layers3 className="h-5 w-5" />
                <span className="text-xs uppercase tracking-[0.2em]">Architecture diagram</span>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-slate-200">
                <div className="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2">Input / Data Layer</div>
                <div className="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2">Processing / Model / Logic</div>
                <div className="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2">Decision / Output / Dashboard</div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
            <h3 className="text-xl font-semibold text-white">Technologies</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2.5 py-1 text-[11px] text-sky-200">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
            <h3 className="text-xl font-semibold text-white">Key features</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-300" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
            <h3 className="text-xl font-semibold text-white">Challenges</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {project.challenges.map((challenge) => (
                <li key={challenge} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-300" />
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
            <h3 className="text-xl font-semibold text-white">What I learned</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {project.whatILearned.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
