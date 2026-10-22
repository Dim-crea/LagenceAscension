import ProjectForm from "@/components/moxie/ProjectForm";
import { getSettings } from "@/lib/content";
import { renderEm } from "@/lib/rich";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "J'ai un projet",
  description: "Parlez-nous de votre projet vidéo, photo ou événementiel : devis gratuit sous 24h.",
};

export default async function ProjectPage({ searchParams }) {
  const [settings, sp] = await Promise.all([getSettings(), searchParams]);
  const { project } = settings;

  return (
    <section className="section_client">
      <div className="padding-global">
        <div className="container-large">
          <div className="project_form">
            <h1 className="hd-50">{renderEm(project.title)}</h1>
            <ProjectForm defaultType={sp?.type || ""} />
          </div>
        </div>
      </div>
    </section>
  );
}
