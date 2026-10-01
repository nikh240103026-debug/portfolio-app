import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Code2, ExternalLink } from "lucide-react";
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
    <main className="ibm-landing min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative h-[clamp(18rem,42vw,34rem)] overflow-hidden bg-[#101820]">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={`${project.title} platform screenshot`}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className={project.slug === "titanic-survival-predictor" ? "bg-[#101820] object-contain object-center" : project.slug === "quant-x" ? "object-cover object-center" : "object-cover object-top"}
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${project.accent}`} />
          )}
        </div>

        <header className="flex flex-col gap-6 py-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-800">{project.category}</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">{project.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">{project.shortDescription}</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {project.githubUrl !== "[ADD GITHUB URL]" ? (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border-b border-transparent py-2 text-sm font-medium text-neutral-900 transition-colors hover:border-cyan-800 hover:text-cyan-800">
                <Code2 className="h-4 w-4" /> GitHub repository
              </a>
            ) : null}
            {project.liveUrl !== "#" ? (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border-b border-transparent py-2 text-sm font-medium text-neutral-900 transition-colors hover:border-cyan-800 hover:text-cyan-800">
                <ExternalLink className="h-4 w-4" /> Live website
              </a>
            ) : null}
          </div>
        </header>

        <div className="grid gap-14 py-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
          <div className="space-y-12">
            <section>
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-800">Overview</h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-700">{project.description}</p>
            </section>

            <section>
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-800">The challenge</h2>
              <p className="mt-4 max-w-3xl leading-7 text-neutral-700">{project.problem}</p>
            </section>

            <section>
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-800">The approach</h2>
              <p className="mt-4 max-w-3xl leading-7 text-neutral-700">{project.solution}</p>
            </section>

            <section>
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-800">Product architecture</h2>
              <p className="mt-4 max-w-3xl leading-7 text-neutral-700">{project.architecture}</p>
            </section>

            <section>
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-800">Engineering considerations</h2>
              <ul className="mt-4 space-y-3 leading-7 text-neutral-700">
                {project.challenges.map((challenge) => <li key={challenge}>{challenge}</li>)}
              </ul>
            </section>
          </div>

          <aside className="space-y-12">
            <section>
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-800">Core capabilities</h2>
              <ul className="mt-4 space-y-3 leading-6 text-neutral-700">
                {project.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </section>

            <section>
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-800">Technology</h2>
              <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-sm leading-6 text-neutral-700">
                {project.technologies.map((tech) => <li key={tech}>{tech}</li>)}
              </ul>
            </section>

            <section>
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-800">What this project demonstrates</h2>
              <ul className="mt-4 space-y-3 leading-6 text-neutral-700">
                {project.whatILearned.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </section>
          </aside>
        </div>

        <Link href="/projects" className="inline-flex items-center gap-2 py-3 text-sm font-medium text-neutral-900 transition-colors hover:text-cyan-800">
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
      </div>
    </main>
  );
}
