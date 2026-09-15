"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300",
        variant === "primary" &&
          "bg-accent/15 border border-accent/30 text-accent hover:bg-accent/25 hover:border-accent/50",
        variant === "secondary" &&
          "border border-border-subtle bg-transparent text-foreground hover:border-white/20",
        variant === "ghost" &&
          "bg-transparent text-text-secondary hover:text-foreground hover:bg-white/5",
        className
      )}
      {...props}
    >
      {children}
      {icon && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </button>
  );
}
