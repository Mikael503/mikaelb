"use client";

import { useState, useEffect } from "react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { Logo } from "./Logo";
import { StaggeredMenu } from "./react-bits/StaggeredMenu";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicProfile } from "@/lib/public-data";

interface HeaderProps {
  profile: PublicProfile;
}

const navLinks = [
  { label: "Accueil", href: "#home" },
  { label: "À propos", href: "#about" },
  { label: "Compétences", href: "#skills" },
  { label: "Projets", href: "#projects" },
  { label: "Processus", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const sectionIds = navLinks.map((l) => l.href.replace("#", ""));

export function Header({ profile }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const activeId = useScrollSpy(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Desktop header — visible on lg+ */}
      <header
        className={cn(
          "fixed top-0 left-0 z-50 hidden w-full transition-all duration-500 lg:block",
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border-subtle"
            : "bg-transparent"
        )}
      >
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Logo — monogramme MB éditorial */}
          <Logo
            size="md"
            onHomeClick={(e) => {
              e.preventDefault();
              handleNavClick("#home");
            }}
          />

          {/* Desktop navigation — centered, visible on lg+ */}
          <nav
            aria-label="Navigation principale"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
          >
            {navLinks.map((link) => {
              const isActive = activeId === link.href.replace("#", "");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-sm transition-colors duration-300",
                    isActive
                      ? "text-accent"
                      : "text-text-secondary hover:text-foreground"
                  )}
                >
                  {link.label}
                  {/* Small active glow indicator */}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-px h-px rounded-full bg-accent transition-opacity duration-300",
                      isActive ? "opacity-100 shadow-[0_0_6px_rgba(124,182,138,0.8)]" : "opacity-0"
                    )}
                  />
                </a>
              );
            })}
          </nav>

          {/* Download CV — right side, desktop only */}
          <a
            href={profile.cvUrl}
            download
            aria-label="Télécharger le CV"
            title="Télécharger le CV"
            className="hidden items-center gap-2 rounded-full border border-border-subtle px-4 py-2 text-sm font-medium text-text-secondary transition-all duration-300 hover:border-accent/40 hover:text-accent lg:inline-flex"
          >
            <Download className="h-4 w-4" />
            CV
          </a>
        </div>
      </header>

      {/* Mobile menu — StaggeredMenu, visible below lg */}
      <div className="lg:hidden">
        <StaggeredMenu
          position="right"
          items={navLinks.map((l) => ({
            label: l.label,
            ariaLabel: `Aller à la section ${l.label}`,
            link: l.href,
          }))}
          displaySocials={false}
          displayItemNumbering
          menuButtonColor="#f0f0f0"
          openMenuButtonColor="#7cb68a"
          changeMenuColorOnOpen
          colors={["#1a1a1a", "#7cb68a"]}
          accentColor="#7cb68a"
          isFixed
          cvUrl={profile.cvUrl}
          onItemClick={handleNavClick}
        />
      </div>
    </>
  );
}
