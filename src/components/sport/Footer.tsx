import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { VINILART_MAIN_URL } from "@/lib/config";
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
  return (
    <footer className="home-footer">
      <div className="home-container home-footer-top">
        <div>
          <Link to="/" aria-label="VinilArt Sport — Início">
            <img
              src="/brand/vinilart-sport-logo-horizontal.png"
              alt="VinilArt Sport"
              width="1019"
              height="263"
            />
          </Link>
          <p>
            Design, personalização e impressão.
            <br />A identidade do teu desporto.
          </p>
        </div>
        <nav aria-label="Navegação do rodapé">
          <Link to="/loja">Loja</Link>
          <Link to="/portfolio">Portfólio</Link>
          <Link to="/contactos">Contactos</Link>
          <a href={VINILART_MAIN_URL !== "#" ? VINILART_MAIN_URL : "http://localhost:3000"}>
            Voltar à VinilArt <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </nav>
      </div>
      <div className="home-container home-footer-bottom">
        <span>© {new Date().getFullYear()} VinilArt Sport</span>
        <InkSignature />
        <span>Da tua ideia ao desporto.</span>
      </div>
    </footer>
  );
}
