import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mikael Bohime | Portfolio Développeur Logiciel",
    template: "%s | Mikael Bohime",
  },
  description:
    "Développeur full-stack spécialisé dans les expériences digitales modernes, responsives et centrées sur l'utilisateur. Découvrez mes projets, mes compétences et contactez-moi.",
  keywords: [
    "développeur",
    "full-stack",
    "React",
    "Next.js",
    "TypeScript",
    "portfolio",
    "freelance",
    "Cotonou",
    "Bénin",
  ],
  authors: [{ name: "Mikael Bohime" }],
  creator: "Mikael Bohime",
  metadataBase: new URL("https://mikaelbohime.dev"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://mikaelbohime.dev",
    title: "Mikael Bohime | Portfolio Développeur Logiciel",
    description:
      "Développeur full-stack spécialisé dans les expériences digitales modernes, responsives et centrées sur l'utilisateur.",
    siteName: "Portfolio Mikael Bohime",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mikael Bohime | Portfolio Développeur Logiciel",
    description:
      "Développeur full-stack spécialisé dans les expériences digitales modernes, responsives et centrées sur l'utilisateur.",
    creator: "@mikaelbohime",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Mikael Bohime",
              jobTitle: "Développeur Logiciel",
              url: "https://mikaelbohime.dev",
              email: "mikaelbohime8@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Cotonou",
                addressCountry: "Bénin",
              },
              sameAs: [
                "https://github.com/mikaelbohime",
                "https://linkedin.com/in/mikaelbohime",
                "https://twitter.com/mikaelbohime",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}