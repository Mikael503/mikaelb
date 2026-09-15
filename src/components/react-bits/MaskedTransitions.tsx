"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MaskedTransitionsProps {
  children: React.ReactNode;
  maskColor?: string;
  direction?: "left" | "right" | "top" | "bottom";
  duration?: number;
  className?: string;
}

export function MaskedTransitions({
  children,
  maskColor = "#0a0a0a",
  direction = "left",
  duration = 0.8,
  className,
}: MaskedTransitionsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getClipPath = () => {
    if (isVisible) return "inset(0 0 0 0)";

    switch (direction) {
      case "left":
        return "inset(0 100% 0 0)";
      case "right":
        return "inset(0 0 0 100%)";
      case "top":
        return "inset(0 0 100% 0)";
      case "bottom":
        return "inset(100% 0 0 0)";
    }
  };

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <div
        style={{
          clipPath: getClipPath(),
          transition: `clip-path ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        {children}
      </div>
      {/* Mask overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: maskColor,
          clipPath: getClipPath(),
          transition: `clip-path ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
          transitionDelay: "0.1s",
        }}
      />
    </div>
  );
}
