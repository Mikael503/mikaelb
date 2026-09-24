"use client";

import { useRef, type ReactNode, type CSSProperties, type Ref } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  /** couleur du halo (ex: "rgba(124,182,138,0.15)") */
  spotlightColor?: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

/**
 * SpotlightCard — un halo lumineux suit la souris sur la carte
 * via des variables CSS (--spot-x / --spot-y).
 */
export function SpotlightCard({
  children,
  spotlightColor = "rgba(124,182,138,0.15)",
  className,
  style,
  ref,
}: SpotlightCardProps) {
  const innerRef = useRef<HTMLDivElement | null>(null);

  const setRefs = (el: HTMLDivElement | null) => {
    innerRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const el = innerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={setRefs}
      onMouseMove={onMouseMove}
      className={cn("spotlight-card group/spot relative", className)}
      style={
        {
          "--spot-x": "50%",
          "--spot-y": "50%",
          ...style,
        } as CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(320px circle at var(--spot-x) var(--spot-y), ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
