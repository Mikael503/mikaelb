"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";
import { ChromaGrid } from "@/components/react-bits/ChromaGrid";
import type { PublicProject } from "@/lib/public-data";

interface ProjectCardProps {
  project: PublicProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  // L'img n'est montée QUE si le fichier existe vraiment
  // (sonde native `new Image()`, le seul mécanisme fiable ici)
  const [imgOk, setImgOk] = useState(false);

  useEffect(() => {
    setImgOk(false);
    if (!project.image) return;
    let alive = true;
    const probe = new Image();
    probe.onload = () => {
      if (alive) setImgOk(true);
    };
    probe.src = project.image;
    return () => {
      alive = false;
    };
  }, [project.image]);

  return (
    <motion.div
      className="group glass overflow-hidden rounded-2xl transition-all duration-300 hover:border-white/12"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image du projet — le fallback reste toujours en dessous,
          l'img la recouvre si le fichier existe, bordure chromatique au survol */}
      <ChromaGrid>
        <div className="relative aspect-video overflow-hidden bg-navy-light">
        <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-light via-surface to-navy-light">
          <span className="px-4 text-center text-sm font-medium text-text-dim">
            {project.title}
          </span>
        </div>
        {imgOk && (
          <img
            src={project.image}
            alt={`Aperçu du projet ${project.title}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-100 transition-all duration-300 lg:opacity-0 lg:group-hover:opacity-100">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-background transition-transform hover:scale-110 lg:h-9 lg:w-9"
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
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-light text-foreground transition-transform hover:scale-110 lg:h-9 lg:w-9"
              aria-label={`Voir le code source de ${project.title}`}
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
      </ChromaGrid>

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
