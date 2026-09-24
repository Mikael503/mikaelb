"use client";

import type { PublicSkill } from "@/lib/public-data";
import { GlassCard } from "@/components/GlassCard";
import { SkillBar } from "@/components/SkillBar";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent";
import { TrueFocus } from "@/components/react-bits/TrueFocus";

export function Skills({ skills }: { skills: PublicSkill[] }) {
  return (
    <section id="skills" className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <AnimatedContent distance={50} direction="bottom" duration={0.8}>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              <TrueFocus text="Mon" className="text-foreground" />{" "}
              <span className="text-accent">
                <TrueFocus text="Expertise" />
              </span>
            </h2>
            <p className="mt-3 text-text-secondary">
              Les technologies que j&apos;utilise
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-1 lg:max-w-3xl lg:mx-auto">
            <SpotlightCard className="rounded-2xl">
              <GlassCard glow>
                <div className="space-y-5">
                  {skills.map((skill) => (
                    <SkillBar key={skill.name} skill={skill} />
                  ))}
                </div>
              </GlassCard>
            </SpotlightCard>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}