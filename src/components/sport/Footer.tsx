import { Link } from "@tanstack/react-router";
import { VINILART_MAIN_URL } from "@/lib/config";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="brush-rule" />
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center bg-sport-gradient slant-pill">
              <span className="font-display text-sm font-black text-black">V</span>
            </span>
            <span className="font-display text-base tracking-tight text-foreground">
              VINILART <span className="text-magenta font-black">SPORT</span>
            </span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Divisão desportiva da VinilArt. Equipamentos e caneleiras à tua medida, artigos para adeptos, estampagem e impressão gráfica.
          </p>
          <div className="mt-4">
            <a
              href={VINILART_MAIN_URL !== "#" ? VINILART_MAIN_URL : "http://localhost:3000"}
              className="inline-flex items-center gap-1.5 font-display text-[0.68rem] uppercase tracking-[0.14em] text-cyan hover:underline"
              rel="noopener noreferrer"
            >
              <span>Voltar ao portal principal VinilArt</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-xs sm:grid-cols-3">
          <div>
            <p className="font-display text-[0.7rem] uppercase tracking-[0.16em] text-foreground">
              Loja
            </p>
            <ul className="mt-3 space-y-2.5">
              <li>
                <Link to="/loja" className="text-muted-foreground hover:text-cyan transition-colors">
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link to="/personalizar" search={{ produto: "caneleiras-personalizadas" }} className="text-muted-foreground hover:text-cyan transition-colors">
                  Caneleiras Personalizadas
                </Link>
              </li>
              <li>
                <Link to="/personalizar" search={{ produto: "equipamento-personalizado" }} className="text-muted-foreground hover:text-cyan transition-colors">
                  Equipamento Personalizado
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-display text-[0.7rem] uppercase tracking-[0.16em] text-foreground">
              VinilArt Sport
            </p>
            <ul className="mt-3 space-y-2.5">
              <li>
                <Link to="/portfolio" className="text-muted-foreground hover:text-cyan transition-colors">
                  Portfólio de Trabalhos
                </Link>
              </li>
              <li>
                <Link to="/carrinho" className="text-muted-foreground hover:text-cyan transition-colors">
                  Carrinho de Pedidos
                </Link>
              </li>
              <li>
                <Link to="/contactos" className="text-muted-foreground hover:text-cyan transition-colors">
                  Contactos & Apoio
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-display text-[0.7rem] uppercase tracking-[0.16em] text-foreground">
              Atendimento
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Atendimento personalizado para atletas individuais, claques e clubes desportivos.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 text-[0.65rem] font-mono text-muted-foreground sm:px-6">
          <span>© {new Date().getFullYear()} VinilArt Sport. Todos os direitos reservados.</span>
          <span className="text-muted-foreground/60">EQUIPAMENTOS & CANELEIRAS À TUA MEDIDA</span>
        </div>
      </div>
    </footer>
  );
}