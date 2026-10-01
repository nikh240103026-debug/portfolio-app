import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Globe } from "lucide-react";

import { projects } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 inline-flex items-center rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
          Portfolio
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Projects</h1>
        <p className="mt-4 text-lg text-slate-300">
          A focused selection of work spanning AI, data science, software systems, and product-oriented engineering.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project.slug} className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
            <div className={cn("relative h-40 border-b border-white/10 bg-gradient-to-br", project.accent)}>
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt={`${project.title} dashboard`}
                  fill
                  quality={100}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className={project.slug === "titanic-survival-predictor" ? "bg-[#101820] object-contain object-center" : project.slug === "quant-x" ? "object-cover object-center" : "object-cover object-top"}
                />
              ) : null}
            </div>
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-300">
                <span>{project.category}</span>
                <span>{project.status}</span>
              </div>
              <h2 className="text-2xl font-semibold text-white">{project.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{project.shortDescription}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="rounded-full border border-white/10 bg-slate-950/60 px-2 py-1 text-[11px] text-slate-200">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 font-medium text-sky-300">
                  Read case study <ArrowRight className="h-4 w-4" />
                </Link>
                {project.githubUrl !== "[ADD GITHUB URL]" ? (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-sky-300">
                    <Globe className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="text-slate-500"><ExternalLink className="h-4 w-4" /></span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
