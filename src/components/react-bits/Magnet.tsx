"use client";

import { useRef, useEffect, useCallback, type ReactNode, type CSSProperties } from "react";

interface MagnetProps {
  children: ReactNode;
  /** Force d'attraction vers la souris (0 = désactivé, 1 = suit entièrement) */
  strength?: number;
  /** Rayon d'activation autour du centre (px) */
  radius?: number;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

/**
 * Magnet — l'élément est attiré vers la souris puis revient
 * avec un ressort fluide (lerp via rAF). Léger, sans dépendance.
 */
export function Magnet({
  children,
  strength = 0.35,
  radius = 120,
  className,
  style,
  disabled = false,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const hovering = useRef(false);

  const tick = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // Retour élastique vers la cible
    current.current.x += (target.current.x - current.current.x) * 0.18;
    current.current.y += (target.current.y - current.current.y) * 0.18;
    // Stop quand revenu au repos
    if (
      !hovering.current &&
      Math.abs(current.current.x) < 0.1 &&
      Math.abs(current.current.y) < 0.1
    ) {
      el.style.transform = "";
      return;
    }
    el.style.transform = `translate3d(${current.current.x.toFixed(2)}px, ${current.current.y.toFixed(2)}px, 0)`;
    raf.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        const pull = 1 - dist / radius;
        hovering.current = true;
        target.current = { x: dx * strength * pull, y: dy * strength * pull };
        start();
      } else if (hovering.current) {
        hovering.current = false;
        target.current = { x: 0, y: 0 };
        start();
      }
    };

    const onLeave = () => {
      hovering.current = false;
      target.current = { x: 0, y: 0 };
      start();
    };

    // Écoute globale pour une attraction douce avant même le survol
    window.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [disabled, radius, strength, start]);

  return (
    <div ref={ref} className={className} style={{ display: "inline-block", ...style }}>
      {children}
    </div>
  );
}
