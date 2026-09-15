"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedContentProps {
  children: React.ReactNode;
  distance?: number;
  direction?: "top" | "bottom" | "left" | "right";
  duration?: number;
  delay?: number;
  className?: string;
}

export function AnimatedContent({
  children,
  distance = 50,
  direction = "bottom",
  duration = 0.8,
  delay = 0,
  className,
}: AnimatedContentProps) {
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
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return "translate(0)";

    switch (direction) {
      case "top":
        return `translateY(-${distance}px)`;
      case "bottom":
        return `translateY(${distance}px)`;
      case "left":
        return `translateX(-${distance}px)`;
      case "right":
        return `translateX(${distance}px)`;
    }
  };

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
