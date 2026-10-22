import Link from "next/link";
import Image from "next/image";

export default function Footer({ settings }) {
  return (
    <footer className="footer">
      <div className="padding-global">
        <div className="container-large">
          <div className="footer_content">
            <Link href="/" className="footer_logo" aria-label="Ascension — Accueil">
              <Image src="/images/brand/logo-white.png" alt="Ascension" width={500} height={167} />
            </Link>
            <div className="footer_contact">
              <p className="t-normal" style={{ lineHeight: 1.2 }}>{(settings.address || "Montpellier").split(",")[0]}</p>
              <div className="footer_contact is-social">
                <a href={`mailto:${settings.contactEmail}`} className="footer_link">{settings.contactEmail}</a>
                {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="footer_link">Instagram</a>}
                {settings.linkedin && <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="footer_link">LinkedIn</a>}
                {settings.youtube && <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="footer_link">YouTube</a>}
              </div>
              <span className="footer_link is-small">SIREN {settings.siren} · © {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
