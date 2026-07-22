import type { Metadata } from "next";
import "@/styles/index.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eliabesantos.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Eliabe dos Santos | Desenvolvedor Front-end & UI/UX Designer",
    template: "%s | Eliabe dos Santos",
  },
  description:
    "Portfólio oficial de Eliabe dos Santos. Desenvolvedor Front-end especialista em React, Next.js, TypeScript e UI/UX Design. Criação de interfaces modernas, sistemas interativos e aplicações web completas.",
  keywords: [
    "Eliabe dos Santos",
    "Desenvolvedor Front-end",
    "UI/UX Designer",
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Desenvolvimento Web",
    "Portfólio Front-end",
    "Design de Interfaces",
  ],
  authors: [{ name: "Eliabe dos Santos", url: siteUrl }],
  creator: "Eliabe dos Santos",
  publisher: "Eliabe dos Santos",
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
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    title: "Eliabe dos Santos | Desenvolvedor Front-end & UI/UX Designer",
    description:
      "Desenvolvedor Front-end e Designer de Interfaces. Confira meus projetos, aplicativos e trajetória profissional.",
    siteName: "Eliabe dos Santos Portfólio",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558655146-d09347e92766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Eliabe dos Santos Portfólio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eliabe dos Santos | Desenvolvedor Front-end & UI/UX Designer",
    description:
      "Desenvolvedor Front-end e Designer de Interfaces. Confira meus projetos e aplicações web.",
    images: ["https://images.unsplash.com/photo-1558655146-d09347e92766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"],
    creator: "@eliabesantos",
  },
  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data Schema.org
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Eliabe dos Santos",
    url: siteUrl,
    jobTitle: "Desenvolvedor Front-end & UI/UX Designer",
    email: "eliabe.developer@gmail.com",
    knowsAbout: [
      "Front-end Development",
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "UI/UX Design",
      "Web Design",
    ],
    sameAs: [
      "https://github.com",
      "https://linkedin.com",
      "https://twitter.com",
      "https://instagram.com",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Eliabe dos Santos Portfólio",
    url: siteUrl,
    description: "Portfólio de projetos e trabalhos de Eliabe dos Santos",
    author: {
      "@type": "Person",
      name: "Eliabe dos Santos",
    },
  };

  return (
    <html lang="pt-BR">
      <head>
        {/* Injeção de Dados Estruturados Schema.org para SEO e Motores de IA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
