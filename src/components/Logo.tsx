"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "md" | "sm";
  onHomeClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

export function Logo({ size = "md", onHomeClick, className }: LogoProps) {
  const isMd = size === "md";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onHomeClick) {
      onHomeClick(e);
      return;
    }
    e.preventDefault();
    document.querySelector("#home")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <a
      href="#home"
      onClick={handleClick}
      aria-label="Mikael Bohime — Accueil"
      className={cn("group flex items-center", isMd ? "gap-2.5" : "gap-2", className)}
    >
      {/* Monogramme MB fusionné — style éditorial */}
      <span
        aria-hidden
        className="font-editorial font-bold leading-none text-accent"
        style={{ fontSize: isMd ? 32 : 26, letterSpacing: "-0.02em" }}
      >
        M<span style={{ marginLeft: "-0.32em" }}>B</span>
      </span>
      {/* Nom empilé en 2 lignes */}
      <span
        className="flex flex-col font-editorial"
        style={{ lineHeight: 1.05, fontSize: isMd ? 15 : 13 }}
      >
        <span className="font-semibold tracking-tight text-foreground">Bohime</span>
        <span className="font-light tracking-tight text-text-secondary">Mikael</span>
      </span>
    </a>
  );
}
