"use client";

import { useState, useEffect } from "react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { MobileMenu } from "./MobileMenu";
import { Menu, X, Download } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useScrollSpy(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 z-50 w-full transition-all duration-500",
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border-subtle"
            : "bg-transparent"
        )}
      >
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Logo — simple text like reference */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#home");
            }}
            className="text-lg font-bold tracking-tight text-foreground"
          >
            Mikael<span className="font-normal text-text-secondary">Bohime</span>
          </a>

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

          {/* Download CV — right side, desktop only (mobile has it in the menu) */}
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

          {/* Hamburger — right side, mobile only */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-white/5 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navLinks}
        activeId={activeId}
        onNavClick={handleNavClick}
        profile={profile}
      />
    </>
  );
}
