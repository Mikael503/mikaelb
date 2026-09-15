"use client";

import type { PublicProject } from "@/lib/public-data";
import { ProjectCard } from "@/components/ProjectCard";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent";
import { SplitText } from "@/components/react-bits/SplitText";

export function Projects({ projects }: { projects: PublicProject[] }) {
  return (
    <section id="projects" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <AnimatedContent distance={50} direction="bottom" duration={0.8}>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              <SplitText text="Projets " className="text-foreground" />
              <span className="text-accent">
                {/* delay = longueur du texte précédent (8 chars) × 0.03s pour enchaîner en continu */}
                <SplitText text="Sélectionnés" delay={0.24} />
              </span>
            </h2>
            <p className="mt-3 text-text-secondary">
              Quelques-uns de mes projets récents
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects
              .sort((a, b) => a.order - b.order)
              .map((project, i) => (
                <AnimatedContent
                  key={project.id}
                  distance={30}
                  direction="bottom"
                  duration={0.6}
                  delay={i * 0.1}
                >
                  <ProjectCard project={project} />
                </AnimatedContent>
              ))}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}