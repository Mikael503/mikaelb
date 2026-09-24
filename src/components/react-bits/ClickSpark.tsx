"use client";

import { useRef, useEffect, useCallback, type ReactNode, type CSSProperties } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface ClickSparkProps {
  children: ReactNode;
  /** Couleurs des étincelles */
  sparkColor?: string[];
  /** Nombre d'étincelles par clic */
  sparkCount?: number;
  /** Taille max des particules */
  sparkSize?: number;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

const DEFAULT_COLORS = ["#7cb68a", "#9dd4a8", "#f0f0f0"];

/**
 * ClickSpark — explosion d'étincelles au clic, rendue sur canvas.
 * Léger, sans dépendance. Respecte prefers-reduced-motion.
 */
export function ClickSpark({
  children,
  sparkColor = DEFAULT_COLORS,
  sparkCount = 10,
  sparkSize = 9,
  className,
  style,
  disabled = false,
}: ClickSparkProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparks = useRef<Spark[]>([]);
  const raf = useRef(0);

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparks.current = sparks.current.filter((s) => s.life > 0);

    for (const s of sparks.current) {
      s.life -= 1;
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.12; // gravité légère
      s.vx *= 0.98;
      const alpha = Math.max(s.life / s.maxLife, 0);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, (s.size * alpha) | 0 || 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (sparks.current.length > 0) {
      raf.current = requestAnimationFrame(loop);
    }
  }, []);

  const burst = useCallback(
    (x: number, y: number) => {
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + Math.random() * 0.5;
        const speed = 2 + Math.random() * 3.5;
        const maxLife = 28 + Math.random() * 22;
        sparks.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          life: maxLife,
          maxLife,
          size: 3 + Math.random() * sparkSize,
          color: sparkColor[(Math.random() * sparkColor.length) | 0],
        });
      }
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(loop);
    },
    [sparkCount, sparkSize, sparkColor, loop]
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(r.width * dpr, 1);
      canvas.height = Math.max(r.height * dpr, 1);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const r = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    burst((e.clientX - r.left) * dpr, (e.clientY - r.top) * dpr);
  };

  return (
    <div
      ref={wrapRef}
      onClick={handleClick}
      className={className}
      style={{ position: "relative", display: "inline-block", ...style }}
    >
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
