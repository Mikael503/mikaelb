import {
  getStoreFresh,
  storeFileExists,
  type Profile,
  type Project,
  type ProcessStep,
  type Settings,
  type Stat,
} from "./data-store";
import { profile as staticProfile } from "@/data/profile";
import { projects as staticProjects } from "@/data/projects";
import { skills as staticSkills } from "@/data/skills";
import { processSteps as staticProcessSteps } from "@/data/process";

// ---------------------------------------------------------------------------
// Types consommés par les sections publiques
// ---------------------------------------------------------------------------

export interface PublicProfile {
  name: string;
  firstName: string;
  initials: string;
  role: string;
  tagline: string;
  bio: string;
  longBio: string;
  photo: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  spotsLeft: string;
  cvUrl: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export type PublicProject = Project;
export type PublicSkill = { name: string; percentage: number };
export type PublicProcessStep = Omit<ProcessStep, "id">;
export type PublicStat = Omit<Stat, "id">;

export interface PublicData {
  profile: PublicProfile;
  projects: PublicProject[];
  skills: PublicSkill[];
  processSteps: PublicProcessStep[];
  stats: PublicStat[];
  settings: Settings;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const t = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

function mapProfile(p: Profile): PublicProfile {
  const spotsNum = Number(p.spotsLeft);
  const spotsLeft =
    Number.isFinite(spotsNum) && spotsNum > 0
      ? `Plus que ${spotsNum} place${spotsNum > 1 ? "s" : ""}`
      : staticProfile.spotsLeft;

  return {
    name: t(p.name) || staticProfile.name,
    firstName: t(p.firstName) || staticProfile.firstName,
    initials: t(p.initials) || staticProfile.initials,
    role: t(p.role) || staticProfile.role,
    tagline: t(p.tagline) || staticProfile.tagline,
    bio: t(p.bio) || staticProfile.bio,
    longBio: t(p.longBio) || staticProfile.longBio,
    photo: t(p.photo) || staticProfile.photo,
    location: t(p.location) || staticProfile.location,
    email: t(p.email) || staticProfile.email,
    phone: t(p.phone) || staticProfile.phone,
    availability: t(p.availability) || staticProfile.availability,
    spotsLeft,
    cvUrl: t(p.cvUrl) || staticProfile.cvUrl,
    socialLinks: {
      github: t(p.socialLinks?.github) || staticProfile.socialLinks.github,
      linkedin: t(p.socialLinks?.linkedin) || staticProfile.socialLinks.linkedin,
      twitter: t(p.socialLinks?.twitter) || staticProfile.socialLinks.twitter,
      email: t(p.socialLinks?.email) || staticProfile.socialLinks.email,
    },
  };
}

function profileFromStatic(): PublicProfile {
  return {
    name: staticProfile.name,
    firstName: staticProfile.firstName,
    initials: staticProfile.initials,
    role: staticProfile.role,
    tagline: staticProfile.tagline,
    bio: staticProfile.bio,
    longBio: staticProfile.longBio,
    photo: staticProfile.photo,
    location: staticProfile.location,
    email: staticProfile.email,
    phone: staticProfile.phone,
    availability: staticProfile.availability,
    spotsLeft: staticProfile.spotsLeft,
    cvUrl: staticProfile.cvUrl,
    socialLinks: { ...staticProfile.socialLinks },
  };
}

// ---------------------------------------------------------------------------
// Chargement des données publiques
// ---------------------------------------------------------------------------
//
// - Si data/portfolio.json n'existe pas (fresh clone) : on sert les données
//   statiques de src/data pour que le site reste complet.
// - Si le fichier existe : c'est la source de vérité — tout ce que l'admin
//   enregistre apparaît sur le site public.

export function getPublicData(): PublicData {
  if (!storeFileExists()) {
    return {
      profile: profileFromStatic(),
      projects: [...staticProjects].sort((a, b) => a.order - b.order),
      skills: staticSkills.map((s) => ({ name: s.name, percentage: s.percentage })),
      processSteps: staticProcessSteps.map(({ number, title, description, icon }) => ({
        number,
        title,
        description,
        icon,
      })),
      stats: staticProfile.stats.map(({ label, value, suffix }) => ({ label, value, suffix })),
      settings: {},
    };
  }

  const store = getStoreFresh();

  return {
    profile: mapProfile(store.profile),
    projects: [...store.projects].sort((a, b) => a.order - b.order),
    skills: store.skills.map((s) => ({ name: t(s.name), percentage: s.percentage })),
    processSteps: store.processSteps.map((s) => ({
      number: t(s.number),
      title: t(s.title),
      description: t(s.description),
      icon: t(s.icon),
    })),
    stats: store.stats.map((s) => ({
      label: t(s.label),
      value: s.value,
      suffix: t(s.suffix),
    })),
    settings: store.settings ?? {},
  };
}
