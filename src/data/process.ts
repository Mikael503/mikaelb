export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Découvrir",
    description:
      "Comprendre les objectifs, les exigences et le périmètre du projet grâce à une recherche approfondie et à la consultation.",
    icon: "Search",
  },
  {
    number: "02",
    title: "Planifier",
    description:
      "Planifier l'architecture, la pile technologique et la feuille de route pour un développement efficace et structuré.",
    icon: "Map",
  },
  {
    number: "03",
    title: "Concevoir",
    description:
      "Créer des wireframes et des designs UI/UX élégants qui correspondent à la vision du projet.",
    icon: "Palette",
  },
  {
    number: "04",
    title: "Développer",
    description:
      "Écrire un code propre, évolutif et efficace en suivant les bonnes pratiques modernes.",
    icon: "Code2",
  },
  {
    number: "05",
    title: "Tester",
    description:
      "Tester les bugs, optimiser les performances et garantir la compatibilité entre navigateurs.",
    icon: "Bug",
  },
  {
    number: "06",
    title: "Déployer",
    description:
      "Déployer en production et assurer un lancement fluide avec un suivi continu.",
    icon: "Rocket",
  },
];