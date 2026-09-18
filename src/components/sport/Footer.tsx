import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useNavLinks, useSiteSettings } from "@/lib/content/store";
function InkSignature() {
  return (
    <span className="home-ink-signature" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

export function Footer() {
  const settings = useSiteSettings();
  const links = useNavLinks("footer");

  return (
    <footer className="home-footer">
      <div className="home-container home-footer-top">
        <div>
          <Link to="/" aria-label="VinilArt Sport — Início">
            <img
              src={settings.logo}
              alt={settings.brandName}
              width="1019"
              height="263"
            />
          </Link>
          <p>{settings.footerText}</p>
        </div>
        <nav aria-label="Navegação do rodapé">
          {links.map((link) => (
            <Link key={link.id} to={link.to}>
              {link.label}
            </Link>
          ))}
          <a href={settings.mainSiteUrl !== "#" ? settings.mainSiteUrl : "/"}>
            {settings.mainSiteLabel} <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </nav>
      </div>
      <div className="home-container home-footer-bottom">
        <span>© {new Date().getFullYear()} {settings.brandName}</span>
        <InkSignature />
        <span>Da tua ideia ao desporto.</span>
      </div>
    </footer>
  );
}
