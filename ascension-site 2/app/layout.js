import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "500"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.agence-ascension.fr"),
  title: {
    default: "Ascension — Agence de Production Audiovisuelle à Montpellier",
    template: "%s — Ascension",
  },
  description:
    "Ascension transforme votre image en vidéos de marque, photographies et contenus premium. Devis gratuit sous 24h.",
  keywords: [
    "agence audiovisuelle Montpellier",
    "vidéo de marque",
    "film institutionnel",
    "photographie entreprise",
    "vidéaste mariage Montpellier",
    "production vidéo Occitanie",
  ],
  authors: [{ name: "Dimitry Hauterville — Ascension" }],
  icons: {
    icon: "/images/brand/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.agence-ascension.fr",
    title: "Ascension — Production Audiovisuelle Premium à Montpellier",
    description:
      "Vidéo de marque, photographie et accompagnement image pour les entreprises ambitieuses. Devis gratuit sous 24h.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ascension — Production Audiovisuelle Premium à Montpellier",
    description: "Vidéo de marque, photographie et accompagnement image. Devis gratuit sous 24h.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-display font-light antialiased">{children}</body>
    </html>
  );
}
