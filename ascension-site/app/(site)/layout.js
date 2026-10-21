import "../moxie.css";
import { Archivo, Inter } from "next/font/google";
import Nav from "@/components/moxie/Nav";
import Footer from "@/components/moxie/Footer";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

const serif = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export default async function SiteLayout({ children }) {
  const settings = await getSettings();
  return (
    <div className={`moxie ${serif.variable} ${sans.variable}`}>
      <Nav />
      <main className="main-wrapper">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
