"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicSkill } from "@/lib/public-data";

interface SkillBarProps {
  skill: PublicSkill;
}

export function SkillBar({ skill }: SkillBarProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {skill.name}
        </span>
        <span className="text-sm font-mono text-accent">
          {skill.percentage}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy-light">
        <div
          className="skill-bar-fill h-full rounded-full bg-gradient-to-r from-accent to-accent-bright"
          style={{ width: visible ? `${skill.percentage}%` : "0%" }}
        />
      </div>
    </div>
  );
}
