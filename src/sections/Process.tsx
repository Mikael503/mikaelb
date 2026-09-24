"use client";

import {
  Search,
  Map,
  Palette,
  Code2,
  Bug,
  Rocket,
} from "lucide-react";
import type { PublicProcessStep } from "@/lib/public-data";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent";
import { TrueFocus } from "@/components/react-bits/TrueFocus";
import { TiltedCard } from "@/components/react-bits/TiltedCard";

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="h-6 w-6" />,
  Map: <Map className="h-6 w-6" />,
  Palette: <Palette className="h-6 w-6" />,
  Code2: <Code2 className="h-6 w-6" />,
  Bug: <Bug className="h-6 w-6" />,
  Rocket: <Rocket className="h-6 w-6" />,
};

export function Process({ steps: processSteps }: { steps: PublicProcessStep[] }) {
  return (
    <section id="process" className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <AnimatedContent distance={50} direction="bottom" duration={0.8}>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              <TrueFocus text="Mon" className="text-foreground" />{" "}
              <span className="text-accent">
                <TrueFocus text="Processus" />
              </span>
            </h2>
            <p className="mt-3 text-text-secondary">
              Comment je donne vie à vos idées
            </p>
          </div>

          {/* Desktop: Horizontal timeline */}
          <div className="relative hidden lg:block">
            {/* Connecting line behind cards (visible in the gaps) */}
            <div className="absolute inset-x-0 top-10 h-px bg-gradient-to-r from-transparent via-border-glow to-transparent" />

            <div className="grid grid-cols-6 gap-4">
              {processSteps.map((step, i) => (
                <AnimatedContent
                  key={step.number}
                  distance={20}
                  direction="bottom"
                  duration={0.5}
                  delay={i * 0.1}
                  className="h-full"
                >
                  <TiltedCard className="h-full" maxTilt={16} scale={1.07}>
                    <div className="glass flex h-full flex-col items-center rounded-2xl p-4 text-center transition-all duration-300 hover:border-accent/60 hover:shadow-[0_0_35px_rgba(124,182,138,0.2)]">
                      {/* Icon circle */}
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border-glow bg-surface text-accent">
                        {iconMap[step.icon]}
                      </div>

                      {/* Number */}
                      <div className="mb-1 font-mono text-sm text-accent">
                        {step.number}
                      </div>

                      {/* Title */}
                      <h3 className="mb-2 text-sm font-bold text-foreground">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs leading-relaxed text-text-secondary">
                        {step.description}
                      </p>
                    </div>
                  </TiltedCard>
                </AnimatedContent>
              ))}
            </div>
          </div>

          {/* Mobile: Vertical timeline */}
          <div className="relative lg:hidden">
            <div className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-border-glow via-border-glow to-transparent" />

            <div className="space-y-8">
              {processSteps.map((step, i) => (
                <AnimatedContent
                  key={step.number}
                  distance={20}
                  direction="left"
                  duration={0.5}
                  delay={i * 0.1}
                  className="relative flex gap-4"
                >
                  {/* Icon circle */}
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-glow bg-surface text-accent">
                    {iconMap[step.icon]}
                  </div>

                  <div className="pt-1">
                    <div className="mb-1 font-mono text-xs text-accent">
                      {step.number}
                    </div>
                    <h3 className="mb-1 text-sm font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}