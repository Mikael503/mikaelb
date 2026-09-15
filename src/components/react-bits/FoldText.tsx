"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FoldTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FoldText({
  text,
  className,
  delay = 0,
  duration = 0.8,
}: FoldTextProps) {
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

  return (
    <div ref={ref} className={cn("inline-block overflow-hidden", className)}>
      <div
        style={{
          transformOrigin: "bottom",
          transform: isVisible ? "rotateX(0deg)" : "rotateX(-90deg)",
          opacity: isVisible ? 1 : 0,
          transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
          perspective: "1000px",
        }}
      >
        {text}
      </div>
    </div>
  );
}
