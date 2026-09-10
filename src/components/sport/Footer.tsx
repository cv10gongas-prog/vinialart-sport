import { Link } from "@tanstack/react-router";
import { VINILART_MAIN_URL } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface bg-tech-grid">
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
            Divisão desportiva da VinilArt. Personalização técnica de caneleiras, equipamentos de jogo, bandeiras e merchandising desportivo.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="skew-tag border border-border bg-background px-2 py-0.5 font-mono text-[0.6rem] text-cyan">
              PERSONALIZAÇÃO À TUA MEDIDA
            </span>
            <span className="skew-tag border border-border bg-background px-2 py-0.5 font-mono text-[0.6rem] text-muted-foreground">
              ENCOMENDAS SOB CONSULTA
            </span>
          </div>
          {VINILART_MAIN_URL !== "#" && (
            <a
              href={VINILART_MAIN_URL || undefined}
              className="mt-4 inline-block font-display text-[0.65rem] uppercase tracking-[0.14em] text-cyan hover:underline"
              rel="noopener noreferrer"
            >
              ← Voltar ao portal principal VinilArt
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 text-xs sm:grid-cols-3">
          <div>
            <p className="font-display text-[0.7rem] uppercase tracking-[0.16em] text-foreground">
              Navegar
            </p>
            <ul className="mt-3 space-y-2.5">
              <li>
                <Link to="/loja" className="text-muted-foreground hover:text-cyan transition-colors">
                  Loja de Artigos
                </Link>
              </li>
              <li>
                <Link to="/personalizar" className="text-magenta font-semibold hover:text-cyan transition-colors">
                  ⚡ Estúdio 2D Caneleiras
                </Link>
              </li>
              <li>
                <Link to="/equipamentos" className="text-muted-foreground hover:text-cyan transition-colors">
                  Equipamentos de Jogo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-display text-[0.7rem] uppercase tracking-[0.16em] text-foreground">
              Modalidades
            </p>
            <ul className="mt-3 space-y-2.5">
              <li>
                <Link to="/adeptos" className="text-muted-foreground hover:text-cyan transition-colors">
                  Artigos para Adeptos
                </Link>
              </li>
              <li>
                <Link to="/carrinho" className="text-muted-foreground hover:text-cyan transition-colors">
                  Carrinho de Compras
                </Link>
              </li>
              <li>
                <Link to="/contactos" className="text-muted-foreground hover:text-cyan transition-colors">
                  Contactos & Suporte
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-display text-[0.7rem] uppercase tracking-[0.16em] text-foreground">
              Produção & Apoio
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Atendimento especializado para pedidos individuais e clubes desportivos.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 text-[0.65rem] font-mono text-muted-foreground sm:px-6">
          <span>© {new Date().getFullYear()} VinilArt Sport. Todos os direitos reservados.</span>
          <span className="text-muted-foreground/60">PERSONALIZAÇÃO GRÁFICA DESPORTIVA</span>
        </div>
      </div>
    </footer>
  );
}

