import { type Project } from "@/lib/data-store";

export const projects: Project[] = [
  {
    id: "1",
    title: "Nova Studio",
    slug: "nova-studio",
    category: "Site Vitrine",
    description:
      "Site one-page immersif pour un studio de design fictif : hero WebGL, marquee défilant, cartes 3D interactives, formulaire de contact incurvé et curseur animé global. Thème sombre violet/cyan, navigation sticky à effet Dock.",
    image: "/images/projects/nova-studio.jpg",
    technologies: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Motion", "OGL", "GSAP"],
    liveUrl: "",
    githubUrl: "https://github.com/mikaelbohime/nova-studio",
    featured: true,
    order: 1,
  },
  {
    id: "2",
    title: "BizFlow",
    slug: "bizflow",
    category: "Application SaaS",
    description:
      "Plateforme « dark-first » de gestion commerciale pour petites entreprises : dashboard KPI temps réel, CRUD clients/produits/ventes, mode encaissement type POS et boutique publique (/store/[slug]) où les clients commandent sans compte — chaque commande se convertit en vente d'un clic.",
    image: "/images/projects/bizflow.jpg",
    technologies: ["Next.js 13", "TypeScript", "Tailwind CSS", "shadcn/ui", "Recharts", "Supabase"],
    liveUrl: "",
    githubUrl: "https://github.com/mikaelbohime/bizflow",
    featured: true,
    order: 2,
  },
  {
    id: "3",
    title: "BLOOP",
    slug: "bloop",
    category: "Jeu Mobile 2D",
    description:
      "Jeu mobile 2D type Suika Game sous Unity 6 (URP 2D) : le joueur fait tomber des boules dans un bac et fusionne celles de même niveau (L1 → L8) jusqu'à déborder. Portrait strict 1080×1922, système jelly visuel (squash & stretch, wobble, pop de fusion) isolé de la physique, validé par 20 tests automatisés.",
    image: "/images/projects/bloop.jpg",
    technologies: ["Unity 6", "URP 2D", "C#", "Test Framework"],
    liveUrl: "",
    githubUrl: "https://github.com/mikaelbohime/bloop",
    featured: true,
    order: 3,
  },
];