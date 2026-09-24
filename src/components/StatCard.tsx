"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, suffix = "", icon }: StatCardProps) {
  const { count, ref } = useCountUp(value);

  return (
    <SpotlightCard
      ref={ref}
      className="glass rounded-2xl p-4 text-center transition-all duration-300 hover:border-white/12 sm:p-6"
    >
      {icon && (
        <div className="mb-3 flex justify-center text-accent">{icon}</div>
      )}
      <div className="text-3xl font-bold text-foreground md:text-4xl">
        {count}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-text-secondary">{label}</div>
    </SpotlightCard>
  );
}
