import "../../club.css";
import ClubHero from "@/components/moxie/club/ClubHero";
import Manifesto from "@/components/moxie/club/Manifesto";
import Climb from "@/components/moxie/club/Climb";
import Audience from "@/components/moxie/club/Audience";
import Engagement from "@/components/moxie/club/Engagement";
import ClubForm from "@/components/moxie/club/ClubForm";
import AltitudeGauge from "@/components/moxie/club/AltitudeGauge";
import ClubCursor from "@/components/moxie/club/ClubCursor";
import { getSettings } from "@/lib/content";
import { splitList } from "@/lib/rich";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Club Ascension",
  description: "Le Club Ascension réunit celles et ceux qui veulent monter en puissance par l'image : rencontres, ateliers, tournages et vitrine.",
};

export default async function ClubPage() {
  const { club } = await getSettings();
  return (
    <div className="club">
      <AltitudeGauge />
      <ClubCursor />
      <ClubHero title={club.title} subtitle={club.subtitle} />
      <Manifesto label="Pourquoi le club existe" text={`${club.why} ${club.mission}`} />
      <Climb pillars={club.pillars} />
      <Audience words={splitList(club.audience)} />
      <Engagement text={club.engagement} />
      <section className="club_join" id="rejoindre">
        <div className="padding-global padding-section-large">
          <div className="container-medium club_join-grid">
            <div>
              <p className="club_eyebrow">Rejoindre le club</p>
              <h2 className="hd-50">Prêt à <em>monter</em> ?</h2>
              <p className="t-20" style={{ marginTop: "1.25rem", maxWidth: "24rem" }}>
                Dites-nous qui vous êtes et ce que vous construisez. On vous répond personnellement.
              </p>
            </div>
            <ClubForm />
          </div>
        </div>
      </section>
    </div>
  );
}
