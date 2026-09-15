export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "FinTrack Dashboard",
    slug: "fintrack-dashboard",
    category: "Application Web",
    description:
      "Un tableau de bord complet de suivi financier avec analyses en temps réel, gestion de portefeuille et rapports personnalisables pour les startups fintech.",
    image: "/images/projects/fintrack.jpg",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Chart.js"],
    liveUrl: "https://fintrack-demo.vercel.app",
    githubUrl: "https://github.com/mikaelbohime/fintrack-dashboard",
    featured: true,
    order: 1,
  },
  {
    id: "2",
    title: "ShopVista E-commerce",
    slug: "shopvista-ecommerce",
    category: "E-commerce",
    description:
      "Une plateforme e-commerce moderne avec gestion de produits, paiements sécurisés, suivi de commandes et un panneau d'administration intuitif.",
    image: "/images/projects/shopvista.jpg",
    technologies: ["Next.js", "Stripe", "MongoDB", "Tailwind CSS", "Vercel"],
    liveUrl: "https://shopvista-demo.vercel.app",
    githubUrl: "https://github.com/mikaelbohime/shopvista",
    featured: true,
    order: 2,
  },
  {
    id: "3",
    title: "Taskify AI",
    slug: "taskify-ai",
    category: "Application SaaS",
    description:
      "Un outil de gestion de projet propulsé par l'IA avec priorisation intelligente des tâches, collaboration d'équipe et optimisation automatisée des flux de travail.",
    image: "/images/projects/taskify.jpg",
    technologies: ["Python", "Django", "React", "OpenAI API", "Redis"],
    liveUrl: "https://taskify-demo.vercel.app",
    githubUrl: "https://github.com/mikaelbohime/taskify-ai",
    featured: true,
    order: 3,
  },
];