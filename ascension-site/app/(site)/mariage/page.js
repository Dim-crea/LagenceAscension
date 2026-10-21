import CasesGrid from "@/components/moxie/CasesGrid";
import ServicesSticky from "@/components/moxie/ServicesSticky";
import Testimonials from "@/components/moxie/Testimonials";
import Accordion from "@/components/moxie/Accordion";
import Link from "next/link";
import { getProjects, getServices, getTestimonials, getFaq, getSettings, bySortOrder } from "@/lib/content";
import { renderEm } from "@/lib/rich";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mariage",
  description:
    "Ascension capte votre mariage avec une image cinématographique. Film de mariage, reportage photo et teaser jour J à Montpellier et partout en France.",
};

const APPROACH = [
  { title: "Premier échange", text: "On apprend à se connaître, on parle de votre histoire, de votre journée, de ce qui compte pour vous." },
  { title: "Repérage & préparation", text: "On étudie le déroulé, les lieux, la lumière. Le jour J, on sait exactement où être et quand." },
  { title: "Le jour J, en discrétion", text: "Présents sans jamais s'imposer. On capture les vrais moments, pas des poses artificielles." },
  { title: "Montage & livraison", text: "Teaser rapide, puis film complet et galerie soignés — pour revivre ce jour, encore et encore." },
];

export default async function MariagePage() {
  const [projects, services, testimonials, faq, settings] = await Promise.all([
    getProjects(),
    getServices(),
    getTestimonials(),
    getFaq(),
    getSettings(),
  ]);
  const { wedding } = settings;
  const films = bySortOrder(projects.filter((p) => p.wedding && p.published !== false));
  const offers = bySortOrder(services.filter((s) => s.pageWedding && s.published !== false));
  const quotes = bySortOrder(testimonials.filter((t) => t.wedding));
  const questions = bySortOrder(faq.filter((f) => f.wedding && f.published !== false));

  return (
    <div className="wedding-theme">
      <section className="section_hero">
        <div className="padding-global">
          <div className="container-large">
            <div className="hero_header" style={{ maxWidth: "42rem" }}>
              <h1 className="hd-50">{renderEm(wedding.title)}</h1>
              <p className="t-20">{wedding.text}</p>
              <Link href="/j-ai-un-projet?type=Mariage" className="button is-primary">
                J'ai un projet de mariage
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CasesGrid
        projects={films}
        emptyMessage="Nos premiers films de mariage arrivent très bientôt ici. Parlez-nous de votre date : on vous présente notre approche en attendant."
      />

      <ServicesSticky title="Prestations" services={offers} id="prestations" />

      <section className="section_careers">
        <div className="padding-global padding-section-large">
          <div className="container-large">
            <h2 className="hd-32" style={{ marginBottom: "2.5rem" }}>Notre approche</h2>
            <div className="about_grid">
              {APPROACH.map((a) => (
                <div className="careers_txt" key={a.title}>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Testimonials title="Ce que disent nos mariés" items={quotes} />

      {questions.length > 0 && (
        <section>
          <div className="padding-global padding-section-medium">
            <div className="container-medium">
              <h2 className="hd-32" style={{ marginBottom: "2rem" }}>Questions fréquentes</h2>
              <Accordion items={questions} />
            </div>
          </div>
        </section>
      )}

      <section className="section_txt">
        <div className="padding-global padding-section-large">
          <div className="container-large">
            <div className="text-content_box" style={{ gap: "2.5rem" }}>
              <h2 className="hd-50" style={{ maxWidth: "50rem" }}>{wedding.statement}</h2>
              <Link href="/j-ai-un-projet?type=Mariage" className="button is-primary">
                J'ai un projet de mariage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
