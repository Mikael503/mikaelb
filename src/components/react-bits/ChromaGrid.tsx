"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface ChromaGridProps {
  children: ReactNode;
  /** couleurs du dégradé chromatique */
  chromaColors?: [string, string];
  className?: string;
  style?: CSSProperties;
}

/**
 * ChromaGrid — une bordure en dégradé chromatique suit la souris
 * via des variables CSS (--chroma-x / --chroma-y).
 */
export function ChromaGrid({
  children,
  chromaColors = ["#7cb68a", "#9dd4a8"],
  className,
  style,
}: ChromaGridProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--chroma-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--chroma-y", `${e.clientY - rect.top}px`);
  };

  const borderStyle = {
    background: `conic-gradient(from 180deg at var(--chroma-x, 50%) var(--chroma-y, 50%), transparent 0%, ${chromaColors[0]} 12%, ${chromaColors[1]} 20%, transparent 32%)`,
    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    maskComposite: "exclude",
    padding: "1.5px",
  } as CSSProperties;

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn("chroma-grid group/chroma relative", className)}
      style={
        {
          "--chroma-x": "50%",
          "--chroma-y": "50%",
          ...style,
        } as CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/chroma:opacity-100"
        style={borderStyle}
      />
      {children}
    </div>
  );
}
