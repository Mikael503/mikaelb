"use client";

import { MapPin, Mail, Clock, User } from "lucide-react";
import type { PublicProfile } from "@/lib/public-data";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent";
import { SplitText } from "@/components/react-bits/SplitText";

export function About({ profile }: { profile: PublicProfile }) {
  const infoItems = [
    { icon: <User className="h-4 w-4" />, label: "Nom", value: profile.name },
    {
      icon: <MapPin className="h-4 w-4" />,
      label: "Localisation",
      value: profile.location,
    },
    {
      icon: <Mail className="h-4 w-4" />,
      label: "Email",
      value: profile.email,
    },
    {
      icon: <Clock className="h-4 w-4" />,
      label: "Disponibilité",
      value: profile.availability,
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <AnimatedContent distance={50} direction="bottom" duration={0.8}>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              <SplitText text="À propos de " className="text-foreground" />
              <span className="text-accent">
                {/* delay = longueur du texte précédent (12 chars) × 0.03s pour enchaîner en continu */}
                <SplitText text="moi" delay={0.36} />
              </span>
            </h2>
            <p className="mt-3 text-text-secondary">
              Apprenez à mieux me connaître
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-1 lg:max-w-3xl lg:mx-auto">
            <GlassCard glow>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-text-secondary md:text-lg">
                  {profile.longBio}
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {infoItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-xl bg-surface/50 p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs text-text-dim">
                          {item.label}
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  icon={<User className="h-4 w-4" />}
                  className="w-full sm:w-auto"
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  En savoir plus sur moi
                </Button>
              </div>
            </GlassCard>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}