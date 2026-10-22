import RotatingWord from "@/components/moxie/RotatingWord";
import LogoMarquee from "@/components/moxie/LogoMarquee";
import CasesGrid from "@/components/moxie/CasesGrid";
import ServicesSticky from "@/components/moxie/ServicesSticky";
import Testimonials from "@/components/moxie/Testimonials";
import QuickForm from "@/components/moxie/QuickForm";
import { getProjects, getServices, getTestimonials, getSettings, bySortOrder } from "@/lib/content";
import { splitList, renderEm } from "@/lib/rich";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, services, testimonials, settings] = await Promise.all([
    getProjects(),
    getServices(),
    getTestimonials(),
    getSettings(),
  ]);
  const { home } = settings;
  const cases = bySortOrder(projects.filter((p) => p.published !== false && !p.wedding && p.coverImage));
  const clients = [...new Set(cases.map((p) => p.client).filter(Boolean))];
  const offers = bySortOrder(services.filter((s) => s.pageMain && s.published !== false));
  const quotes = bySortOrder(testimonials.filter((t) => !t.wedding));

  return (
    <>
      <section className="section_home-hero">
        <div className="home-hero_content">
          <div className="home-hero_header">
            <div className="padding-global">
              <div className="container-large">
                <div className="home-hero_h1">
                  <h1 className="hd-60">
                    {home.lead}
                    <br /> <RotatingWord words={splitList(home.phrases)} className="is-home-hero" />
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <LogoMarquee names={clients} />
        </div>
      </section>

      <section className="section_txt">
        <div className="padding-global padding-section-large">
          <div className="container-large">
            <div className="text-content_box">
              <h2 className="hd-60">
                {home.languageLead}
                <br />
                <RotatingWord words={splitList(home.languageWords)} />
              </h2>
            </div>
          </div>
        </div>
      </section>

      <CasesGrid projects={cases} />

      <section className="section_txt">
        <div className="padding-global padding-section-large">
          <div className="container-large">
            <div className="text-content_box">
              <div className="text-content_txt">
                <h2 className="hd-50">{home.statement}</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesSticky title={home.servicesTitle} services={offers} />
      <Testimonials title={home.testimonialsTitle} items={quotes} />

      <section className="section_quick" id="contact">
        <div className="padding-global padding-section-large">
          <div className="container-large">
            <div className="quick_content">
              <div className="quick_header">
                <h2 className="hd-50">{renderEm(home.contactTitle)}</h2>
                <p className="t-18">{home.contactText}</p>
              </div>
              <QuickForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
