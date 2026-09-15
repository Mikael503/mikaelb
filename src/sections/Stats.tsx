"use client";

import { Users, FolderCheck, Calendar, Heart } from "lucide-react";
import type { PublicStat } from "@/lib/public-data";
import { StatCard } from "@/components/StatCard";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent";
import { FoldText } from "@/components/react-bits/FoldText";

const statIcons = [
  <Users className="h-6 w-6" key="users" />,
  <FolderCheck className="h-6 w-6" key="folder" />,
  <Calendar className="h-6 w-6" key="calendar" />,
  <Heart className="h-6 w-6" key="heart" />,
];

interface StatsProps {
  stats: PublicStat[];
}

export function Stats({ stats }: StatsProps) {
  return (
    <section id="stats" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <AnimatedContent distance={50} direction="bottom" duration={0.8}>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              <FoldText text="En " className="text-foreground" />
              <span className="text-accent">
                <FoldText text="Chiffres" delay={0.1} />
              </span>
            </h2>
            <p className="mt-3 text-text-secondary">
              Des résultats qui parlent d&apos;eux-mêmes
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((stat, i) => (
              <AnimatedContent
                key={`${stat.label}-${i}`}
                distance={20}
                direction="bottom"
                duration={0.5}
                delay={i * 0.1}
              >
                <StatCard
                  label={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  icon={statIcons[i]}
                />
              </AnimatedContent>
            ))}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
