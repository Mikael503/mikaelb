"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TrueFocusProps {
  text: string;
  className?: string;
}

/**
 * TrueFocus — entrée en cascade au scroll (mots masqués puis révélés),
 * puis focus au survol : le mot survolé reste net, les autres s'estompent.
 */
export function TrueFocus({ text, className }: TrueFocusProps) {
  const [focused, setFocused] = useState<number | null>(null);
  // false au premier rendu côté serveur comme côté client (pas de mismatch)
  const [entered, setEntered] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);
  const words = text.split(" ").filter(Boolean);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setEntered(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className={cn("inline-flex flex-wrap gap-x-[0.25em]", className)}>
      {words.map((word, i) => (
        <span
          key={i}
          data-testid="true-focus-word"
          onMouseEnter={() => setFocused(i)}
          onMouseLeave={() => setFocused(null)}
          className={cn(
            "inline-block transition-all duration-300",
            focused === null || focused === i
              ? "scale-100"
              : "blur-[3px] opacity-60"
          )}
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(14px)",
            transitionDelay: entered ? `${i * 0.06}s` : "0s",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
