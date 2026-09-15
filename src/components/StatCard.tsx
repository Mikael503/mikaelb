"use client";

import { useCountUp } from "@/hooks/useCountUp";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, suffix = "", icon }: StatCardProps) {
  const { count, ref } = useCountUp(value);

  return (
    <div
      ref={ref}
      className="glass rounded-2xl p-6 text-center transition-all duration-300 hover:border-white/12"
    >
      {icon && (
        <div className="mb-3 flex justify-center text-accent">{icon}</div>
      )}
      <div className="text-3xl font-bold text-foreground md:text-4xl">
        {count}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-text-secondary">{label}</div>
    </div>
  );
}
