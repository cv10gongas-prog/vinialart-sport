import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";
import { SportLink } from "./SportButton";
import { useCart } from "@/lib/cart/store";
import { VINILART_MAIN_URL } from "@/lib/config";

const nav = [
  { label: "Início", to: "/" },
  { label: "Loja", to: "/loja" },
  { label: "Personalizar", to: "/personalizar" },
  { label: "Equipamentos", to: "/equipamentos" },
  { label: "Adeptos", to: "/adeptos" },
  { label: "Contactos", to: "/contactos" },
];

function Wordmark() {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="VinilArt Sport — Início">
      <span
        className="grid h-10 w-10 shrink-0 place-items-center bg-sport-gradient [clip-path:polygon(14%_0,100%_0,86%_100%,0_100%)]"
        aria-hidden="true"
      >
        <span className="font-display text-base text-background">V</span>
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className="font-display text-sm tracking-tight text-foreground sm:text-base">
          VinilArt
        </span>
        <span className="skew-tag font-display text-[0.6rem] text-magenta sm:text-[0.7rem]">
          Sport
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="h-[3px] w-full bg-sport-gradient" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:grid-cols-[auto_1fr_auto]">
        <Wordmark />

        <nav aria-label="Navegação principal" className="hidden items-center justify-center gap-6 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-foreground" }}
              className="font-display text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {VINILART_MAIN_URL !== "#" && (
            <a
              href={VINILART_MAIN_URL || undefined}
              className="hidden items-center gap-1 text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground xl:flex"
              rel="noopener noreferrer"
            >
              Voltar à VinilArt <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
          <Link
            to="/carrinho"
            aria-label={totalItems > 0 ? `Carrinho — ${totalItems} ${totalItems === 1 ? "artigo" : "artigos"}` : "Carrinho — vazio"}
            className="relative grid h-10 w-10 place-items-center border border-border text-foreground transition-colors hover:border-cyan hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            {totalItems > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center bg-magenta text-[0.6rem] font-bold text-primary-foreground"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
          <SportLink to="/personalizar" size="sm" className="hidden sm:inline-flex">
            Personalizar
          </SportLink>
          <button
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center border border-border lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-border bg-surface lg:hidden">
          <nav aria-label="Menu móvel" className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 font-display text-xs uppercase tracking-[0.16em] text-muted-foreground last:border-0 hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                {item.label}
              </Link>
            ))}
            {VINILART_MAIN_URL !== "#" && (
              <a
                href={VINILART_MAIN_URL || undefined}
                className="py-3 text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
                rel="noopener noreferrer"
              >
                Voltar à VinilArt
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

