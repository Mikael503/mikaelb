"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  /** délai avant révélation (s) */
  delay?: number;
  /** distance de montée (px) */
  distance?: number;
  className?: string;
}

/**
 * ScrollReveal — le contenu reste masqué puis se révèle
 * (fondu + montée) à l'entrée dans le viewport.
 */
export function ScrollReveal({ children, delay = 0, distance = 30, className }: ScrollRevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "opacity-0",
        className
      )}
      style={visible ? { transitionDelay: `${delay}s` } : { transform: `translateY(${distance}px)` }}
    >
      {children}
    </div>
  );
}
