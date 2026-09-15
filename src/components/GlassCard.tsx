"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  as?: "div" | "section" | "article";
}

// Pre-created at module scope — creating components during render is
// invalid and would reset their state on every render.
const motionTags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
} as const;

export function GlassCard({
  children,
  className,
  glow = false,
  hover = true,
  as: Tag = "div",
}: GlassCardProps) {
  const MotionTag = motionTags[Tag];

  return (
    <MotionTag
      className={cn(
        "glass rounded-2xl p-6 md:p-8 transition-all duration-300",
        glow && "glow-accent",
        hover && "hover:bg-card-hover hover:border-white/12",
        className
      )}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </MotionTag>
  );
}
