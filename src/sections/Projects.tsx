"use client";

import type { PublicProject } from "@/lib/public-data";
import { ProjectCard } from "@/components/ProjectCard";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent";
import { TrueFocus } from "@/components/react-bits/TrueFocus";

export function Projects({ projects }: { projects: PublicProject[] }) {
  return (
    <section id="projects" className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <AnimatedContent distance={50} direction="bottom" duration={0.8}>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              <TrueFocus text="Projets" className="text-foreground" />{" "}
              <span className="text-accent">
                <TrueFocus text="Sélectionnés" />
              </span>
            </h2>
            <p className="mt-3 text-text-secondary">
              Quelques-uns de mes projets récents
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...projects]
              .sort((a, b) => a.order - b.order)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}