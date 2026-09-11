import { Link } from "@tanstack/react-router";
import { VINILART_MAIN_URL } from "@/lib/config";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-16">
          <div className="max-w-sm">
            <p className="font-display text-2xl leading-none">
              VINILART <span className="text-magenta">SPORT</span>
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Personalização desportiva para atletas, clubes e adeptos. Divisão
              desportiva da VinilArt.
            </p>
            <a
              href={VINILART_MAIN_URL !== "#" ? VINILART_MAIN_URL : "http://localhost:3000"}
              className="mt-6 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
              rel="noopener noreferrer"
            >
              <span>Voltar à VinilArt</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div>
            <p className="label-eyebrow">Loja</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/loja" className="text-muted-foreground transition-colors hover:text-foreground">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-muted-foreground transition-colors hover:text-foreground">
                  Portfólio
                </Link>
              </li>
              <li>
                <Link to="/carrinho" className="text-muted-foreground transition-colors hover:text-foreground">
                  Resumo do pedido
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="label-eyebrow">Contacto</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/contactos" className="text-muted-foreground transition-colors hover:text-foreground">
                  Contactos & apoio
                </Link>
              </li>
              <li className="text-muted-foreground">
                Atletas, claques e clubes desportivos.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-8 text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
          <span>© {new Date().getFullYear()} VinilArt Sport</span>
          <span className="text-muted-foreground/60">Personaliza o teu jogo</span>
        </div>
      </div>
    </footer>
  );
}
