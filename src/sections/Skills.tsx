"use client";

import type { PublicSkill } from "@/lib/public-data";
import { GlassCard } from "@/components/GlassCard";
import { SkillBar } from "@/components/SkillBar";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent";
import { FoldText } from "@/components/react-bits/FoldText";

export function Skills({ skills }: { skills: PublicSkill[] }) {
  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <AnimatedContent distance={50} direction="bottom" duration={0.8}>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              <FoldText text="Mon " className="text-foreground" />
              <span className="text-accent">
                <FoldText text="Expertise" delay={0.1} />
              </span>
            </h2>
            <p className="mt-3 text-text-secondary">
              Les technologies que j&apos;utilise
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-1 lg:max-w-3xl lg:mx-auto">
            <GlassCard glow>
              <div className="space-y-5">
                {skills.map((skill) => (
                  <SkillBar key={skill.name} skill={skill} />
                ))}
              </div>
            </GlassCard>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}