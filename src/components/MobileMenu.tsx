"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicProfile } from "@/lib/public-data";

interface NavLink {
  label: string;
  href: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  activeId: string;
  onNavClick: (href: string) => void;
  profile: PublicProfile;
}

export function MobileMenu({
  open,
  onClose,
  links,
  activeId,
  onNavClick,
  profile,
}: MobileMenuProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-white/5"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            <X className="h-6 w-6" />
          </button>

          <nav className="flex flex-col items-center gap-8">
            {links.map((link, i) => {
              const isActive = activeId === link.href.replace("#", "");
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavClick(link.href);
                  }}
                  className={cn(
                    "text-3xl font-editorial font-bold transition-colors",
                    isActive ? "text-accent" : "text-text-secondary"
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  {link.label}
                </motion.a>
              );
            })}
          </nav>

          <motion.a
            href={profile.cvUrl}
            download
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-transparent px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Download className="h-4 w-4" />
            Télécharger le CV
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
