"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  animateBy?: "words" | "characters";
  direction?: "top" | "bottom" | "left" | "right";
  className?: string;
  blurColor?: string;
  delay?: number;
  duration?: number;
  onComplete?: () => void;
}

export function BlurText({
  text,
  animateBy = "words",
  direction = "top",
  className,
  blurColor = "#7cb68a",
  delay = 0,
  duration = 0.8,
  onComplete,
}: BlurTextProps) {
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

  useEffect(() => {
    if (isVisible && onComplete) {
      const timer = setTimeout(onComplete, (delay + duration) * 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay, duration, onComplete]);

  const items = animateBy === "characters" ? text.split("") : text.split(" ");

  const getInitialTransform = () => {
    switch (direction) {
      case "top":
        return "translateY(-20px)";
      case "bottom":
        return "translateY(20px)";
      case "left":
        return "translateX(-20px)";
      case "right":
        return "translateX(20px)";
    }
  };

  return (
    <div ref={ref} className={cn("inline-flex flex-wrap", className)}>
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            filter: isVisible ? "blur(0)" : "blur(10px)",
            transform: isVisible ? "translate(0)" : getInitialTransform(),
            opacity: isVisible ? 1 : 0,
            transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * 0.05}s`,
            color: blurColor,
          }}
        >
          {item}
          {animateBy === "words" && i < items.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </div>
  );
}
