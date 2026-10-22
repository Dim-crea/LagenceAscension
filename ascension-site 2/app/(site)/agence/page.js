import "../../club.css";
import "../../agence.css";
import Link from "next/link";
import Slate from "@/components/moxie/agency/Slate";
import Expertise from "@/components/moxie/agency/Expertise";
import Counters from "@/components/moxie/agency/Counters";
import Method from "@/components/moxie/agency/Method";
import Manifesto from "@/components/moxie/club/Manifesto";
import { getProjects, getSettings, bySortOrder } from "@/lib/content";
import { renderEm } from "@/lib/rich";

export const dynamic = "force-dynamic";
// Page masquée : absente du menu et non référencée. Retirer `robots` et réactiver le lien dans Nav.jsx pour la publier.
export const metadata = {
  robots: { index: false, follow: false },
  title: "L'Agence",
  description:
    "Ascension, agence de production audiovisuelle à Montpellier : contenu publicitaire, réseaux sociaux, branding personnel et créations signature.",
};

export default async function AgencePage() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);
  const { agency, stats } = settings;
  const images = bySortOrder(projects.filter((p) => p.published !== false && p.coverImage)).map((p) => p.coverImage).slice(0, 6);

  return (
    <div className="agency">
      <Slate title={agency.title} subtitle={agency.subtitle} director="Dimitry Hauterville" place={(settings.address || "Montpellier").split(",")[0]} />
      <Manifesto label="Notre regard" text={agency.manifesto} />
      <Expertise items={agency.expertise} images={images.length ? images : ["/images/portfolio/hero-bg.jpg"]} />
      <Counters stats={stats} />
      <Method steps={agency.steps} />

      <section className="ag_founder">
        <div className="padding-global padding-section-large">
          <div className="container-medium">
            <p className="club_eyebrow">Derrière l'agence</p>
            <p className="ag_founder-text">{agency.founder}</p>
          </div>
        </div>
      </section>

      <section className="ag_cta">
        <div className="ag_cta-marquee" aria-hidden="true">
          <div className="ag_cta-line">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i}>Parlons-en <i>✦</i> </span>
            ))}
          </div>
        </div>
        <div className="padding-global padding-section-large">
          <div className="container-large ag_cta-inner">
            <h2 className="hd-60">{renderEm(agency.ctaTitle)}</h2>
            <Link href="/j-ai-un-projet" className="button is-primary">
              J'ai un projet
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
