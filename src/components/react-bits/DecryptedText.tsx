"use client";

import { useState, useEffect } from "react";

interface DecryptedTextProps {
  text: string;
  /** ms entre chaque caractère révélé */
  speed?: number;
  className?: string;
}

const GLYPHS = "!<>-_\\/[]{}—=+*^?#";

/**
 * DecryptedText — le texte apparaît caractère par caractère,
 * les caractères non révélés affichent des glyphes brouillés.
 */
export function DecryptedText({ text, speed = 30, className }: DecryptedTextProps) {
  const [revealed, setRevealed] = useState(0);
  // Avant le mount (dont SSR) : rendu déterministe, sinon hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRevealed(0);
    if (text.length === 0) return;
    const id = window.setInterval(() => {
      setRevealed((r) => {
        if (r >= text.length) {
          window.clearInterval(id);
          return r;
        }
        return r + 1;
      });
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);

  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span key={i} aria-hidden>
          {i < revealed || char === " "
            ? char
            : mounted
              ? GLYPHS[(Math.random() * GLYPHS.length) | 0]
              : " "}
        </span>
      ))}
    </span>
  );
}
