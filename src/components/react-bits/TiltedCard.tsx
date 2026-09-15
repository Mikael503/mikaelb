"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
}

export function TiltedCard({
  children,
  className,
  maxTilt = 8,
  scale = 1.02,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - py) * maxTilt * 2;
    const rotateY = (px - 0.5) * maxTilt * 2;

    setStyle({
      transform: `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${scale})`,
      transition: "transform 0.08s ease-out",
    });
  };

  const handlePointerLeave = () => {
    setStyle({
      transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    });
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ transformStyle: "preserve-3d", willChange: "transform", ...style }}
      className={cn(className)}
    >
      {children}
    </div>
  );
}
