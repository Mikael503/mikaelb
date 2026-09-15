"use client";

import { cn } from "@/lib/utils";

interface BorderGlowProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  duration?: number;
}

export function BorderGlow({
  children,
  className,
  glowColor = "#7cb68a",
  duration = 6,
}: BorderGlowProps) {
  return (
    <div
      className={cn("border-glow", className)}
      style={
        {
          "--border-glow-color": glowColor,
          "--border-glow-duration": `${duration}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}