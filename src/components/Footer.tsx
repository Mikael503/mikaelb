"use client";

import { Mail, Heart } from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/components/SocialIcons";
import type { PublicProfile } from "@/lib/public-data";

interface FooterProps {
  profile: PublicProfile;
}

const navLinks = [
  { label: "Accueil", href: "#home" },
  { label: "À propos", href: "#about" },
  { label: "Projets", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Footer({ profile }: FooterProps) {
  const socialLinks = [
    {
      icon: <GithubIcon className="h-4 w-4" />,
      href: profile.socialLinks.github,
      label: "GitHub",
    },
    {
      icon: <LinkedinIcon className="h-4 w-4" />,
      href: profile.socialLinks.linkedin,
      label: "LinkedIn",
    },
    {
      icon: <TwitterIcon className="h-4 w-4" />,
      href: profile.socialLinks.twitter,
      label: "Twitter",
    },
    {
      icon: <Mail className="h-4 w-4" />,
      href: profile.socialLinks.email,
      label: "Email",
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo — text style like reference */}
          <a href="#home" className="text-lg font-bold tracking-tight text-foreground">
            Mikael<span className="font-normal text-text-secondary">Bohime</span>
          </a>

          {/* Nav */}
          <nav className="flex gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector(link.href)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm text-text-secondary transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle text-text-secondary transition-all duration-300 hover:border-accent/40 hover:text-accent"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border-subtle pt-6 text-center text-xs text-text-dim">
          <p>
            &copy; {currentYear} {profile.name}. Tous droits réservés. Conçu
            avec{" "}
            <Heart className="mx-0.5 inline h-3 w-3 text-accent" fill="currentColor" />{" "}
            par {profile.firstName}.
          </p>
        </div>
      </div>
    </footer>
  );
}