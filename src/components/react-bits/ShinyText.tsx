"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ShinyTextProps {
  text: string;
  speed?: number;
  color?: string;
  shineColor?: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function ShinyText({
  text,
  speed = 3,
  color = "#7cb68a",
  shineColor = "#9dd4a8",
  className,
  delay = 0,
  duration = 0.8,
}: ShinyTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

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

  return (      <span
        ref={ref}
        className={cn("shiny-text inline-block relative", className)}
        style={{
          color,
          backgroundImage: `linear-gradient(
          120deg,
          ${color} 0%,
          ${color} 40%,
          ${shineColor} 50%,
          ${color} 60%,
          ${color} 100%
        )`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        // Padding + negative margin: évite que le débordement italique du
        // premier glyphe (S) soit rogné par le background-clip:text.
        padding: "0 0.12em",
        margin: "0 -0.12em",
        animation: `shiny ${speed}s ease-in-out infinite`,
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? "blur(0)" : "blur(10px)",
        transform: isVisible ? "translateY(0)" : "translateY(-20px)",
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, filter ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {text}
    </span>
  );
}
