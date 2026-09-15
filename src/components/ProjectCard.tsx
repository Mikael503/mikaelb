"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";
import { MaskedTransitions } from "@/components/react-bits/MaskedTransitions";
import type { PublicProject } from "@/lib/public-data";

interface ProjectCardProps {
  project: PublicProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      className="group glass overflow-hidden rounded-2xl transition-all duration-300 hover:border-white/12"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image with MaskedTransitions */}
      <MaskedTransitions
        maskColor="#111111"
        direction="left"
        duration={0.8}
        className="aspect-video"
      >
        <div className="relative aspect-video overflow-hidden bg-navy-light">
          <div className="flex h-full w-full items-center justify-center text-text-dim">
            <div className="text-center">
              <div className="mb-2 text-4xl">🚀</div>
              <span className="text-xs">{project.title}</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-background transition-transform hover:scale-110"
                aria-label={`Voir la démo en ligne de ${project.title}`}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-light text-foreground transition-transform hover:scale-110"
                aria-label={`Voir le code source de ${project.title}`}
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </MaskedTransitions>

      {/* Content */}
      <div className="p-5">
        <span className="mb-2 inline-block rounded-full bg-accent-muted px-3 py-1 text-xs font-medium text-accent">
          {project.category}
        </span>
        <h3 className="mt-2 text-lg font-bold text-foreground">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-navy-light px-2 py-1 text-xs text-text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}