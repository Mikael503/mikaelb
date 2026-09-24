"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, MapPin, CheckCircle } from "lucide-react";
import type { PublicProfile } from "@/lib/public-data";
import { BlurText } from "@/components/react-bits/BlurText";
import { Beams } from "@/components/react-bits/Beams";
import { Magnet } from "@/components/react-bits/Magnet";
import { DecryptedText } from "@/components/react-bits/DecryptedText";
import Orb from "@/components/react-bits/Orb";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function Hero({ profile }: { profile: PublicProfile }) {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Beams behind photo area */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2">
        <Beams
          beamCount={4}
          beamColor="#7cb68a"
          speed={0.15}
          opacity={0.08}
        />
      </div>

      {/* Subtle green glow behind photo area */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[15%] top-[20%] h-[600px] w-[600px] rounded-full bg-accent/5 blur-[150px]" />
        <div className="absolute right-[25%] top-[30%] h-[300px] w-[300px] rounded-full bg-accent/3 blur-[100px]" />
      </div>

      {/* Main content */}
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid min-h-screen items-center gap-8 lg:grid-cols-2 lg:gap-0">
          {/* Left: Content */}
          <div className="flex flex-col space-y-6 pt-28 pb-12 text-center lg:text-left lg:py-32">
            {/* Role with decrypt effect */}
            <div className="font-mono text-sm tracking-[0.2em] text-accent uppercase">
              <DecryptedText text={profile.role} speed={40} />
            </div>
            {/* Title with BlurText */}
            <div className="font-editorial text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              <BlurText
                text="Je transforme vos"
                animateBy="words"
                direction="top"
                delay={0.2}
                duration={0.8}
                blurColor="#f0f0f0"
              />
              <br />
              <BlurText
                text="idées en expériences"
                animateBy="words"
                direction="top"
                delay={0.4}
                duration={0.8}
                blurColor="#f0f0f0"
              />
              <br />
              <BlurText
                text="web exceptionnelles."                
                animateBy="words"
                direction="top"
                delay={0.6}
                duration={0.8}
                blurColor="#7cb68a"
              />
            </div>

            <motion.p
              className="mx-auto max-w-md text-sm leading-relaxed text-text-secondary md:text-base lg:mx-0 lg:max-w-lg"
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              {profile.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 lg:justify-start"
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              <Magnet strength={0.3} radius={140}>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/30 px-6 py-3 text-sm font-medium text-accent transition-all duration-300 hover:bg-accent/20 hover:border-accent/50"
                >
                  Me contacter
                  <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </a>
              </Magnet>
              <Magnet strength={0.3} radius={140}>
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group inline-flex items-center gap-2 rounded-full border border-border-subtle px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-white/20"
                >
                  Voir mes projets
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
              </Magnet>
            </motion.div>

            {/* Availability bar */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-secondary lg:justify-start"
              {...fadeUp}
              transition={{ duration: 0.7, delay: 1 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span>{profile.availability}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-text-dim" />
                <span>{profile.location}</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Orb — desktop only, calé en haut sous le header */}
          <motion.div
            className="relative hidden justify-center lg:flex lg:items-start lg:self-start lg:pt-[180px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="relative h-[480px] w-[480px] max-w-full">
              <Orb
                hue={125}
                hoverIntensity={1.60}
                rotateOnHover
                forceHoverState={false}
                backgroundColor="#0a0a0a"
                opacity={0.78}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}