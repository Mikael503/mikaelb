"use client";

import { useState, type FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { PublicProfile } from "@/lib/public-data";
import { GlassCard } from "@/components/GlassCard";
import { BorderGlow } from "@/components/BorderGlow";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent";
import { SplitText } from "@/components/react-bits/SplitText";

type FormState = "idle" | "loading" | "success" | "error";

export function Contact({ profile }: { profile: PublicProfile }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Téléphone",
      value: profile.phone,
      href: `tel:${profile.phone}`,
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Localisation",
      value: profile.location,
      href: undefined,
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Disponibilité",
      value: profile.availability,
      href: undefined,
    },
  ];

  const validate = (): boolean => {
    if (!name.trim()) {
      setErrorMsg("Veuillez saisir votre nom.");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Veuillez saisir une adresse email valide.");
      return false;
    }
    if (!subject.trim()) {
      setErrorMsg("Veuillez saisir un sujet.");
      return false;
    }
    if (!message.trim()) {
      setErrorMsg("Veuillez saisir votre message.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Honeypot check
    if (honeypot) return;

    if (!validate()) return;

    setFormState("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Échec de l'envoi du message.");
      }

      setFormState("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setFormState("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Une erreur inattendue s'est produite."
      );
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <AnimatedContent distance={50} direction="bottom" duration={0.8}>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              <SplitText text="Construisons quelque chose de " className="text-foreground" />
              <span className="text-accent">
                {/* delay = longueur du texte précédent (30 chars) × 0.03s pour enchaîner en continu */}
                <SplitText text="grand" delay={0.9} />
              </span>
            </h2>
            <p className="mt-3 text-text-secondary">
              Vous avez un projet en tête ou souhaitez collaborer ? Je serais ravi
              d&apos;échanger avec vous.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Contact Info */}
            <div className="space-y-6 lg:col-span-2">
              <GlassCard>
                <div className="space-y-5">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs text-text-dim">
                          {item.label}
                        </div>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm font-medium text-foreground transition-colors hover:text-accent"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <div className="text-sm font-medium text-foreground">
                            {item.value}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <BorderGlow className="h-full rounded-2xl">
              <GlassCard className="h-full">
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                      >
                        Nom
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-border-glow bg-surface/50 px-4 py-3 text-sm text-foreground placeholder:text-text-dim transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-border-glow bg-surface/50 px-4 py-3 text-sm text-foreground placeholder:text-text-dim transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Sujet
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-border-glow bg-surface/50 px-4 py-3 text-sm text-foreground placeholder:text-text-dim transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                      placeholder="Objet de votre demande"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="w-full resize-none rounded-xl border border-border-glow bg-surface/50 px-4 py-3 text-sm text-foreground placeholder:text-text-dim transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                      placeholder="Parlez-moi de votre projet..."
                      required
                    />
                  </div>

                  {/* Status messages */}
                  {formState === "success" && (
                    <div className="flex items-center gap-2 rounded-xl bg-accent/10 p-4 text-sm text-accent">
                      <CheckCircle className="h-4 w-4" />
                      Message envoyé avec succès ! Je reviendrai vers vous
                      rapidement.
                    </div>
                  )}

                  {(formState === "error" || errorMsg) && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {errorMsg || "Une erreur est survenue. Veuillez réessayer."}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formState === "loading"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-bright px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {formState === "loading" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </GlassCard>
              </BorderGlow>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}