"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TrueFocusProps {
  text: string;
  className?: string;
}

/**
 * TrueFocus — chaque mot reste flouté jusqu'à son survol,
 * le mot survolé devient net et les autres s'estompent.
 */
export function TrueFocus({ text, className }: TrueFocusProps) {
  const [focused, setFocused] = useState<number | null>(null);
  const words = text.split(" ").filter(Boolean);

  return (
    <span className={cn("inline-flex flex-wrap gap-x-[0.25em]", className)}>
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
        >
          {word}
        </span>
      ))}
    </span>
  );
}
