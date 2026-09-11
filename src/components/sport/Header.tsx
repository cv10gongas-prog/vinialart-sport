import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart/store";
import { VINILART_MAIN_URL } from "@/lib/config";

const nav = [
  { label: "Início", to: "/" },
  { label: "Loja", to: "/loja" },
  { label: "Portfólio", to: "/portfolio" },
  { label: "Contactos", to: "/contactos" },
];

function Wordmark() {
  const [logoLoaded, setLogoLoaded] = useState(true);

  return (
    <Link to="/" className="group flex min-w-0 items-center gap-3" aria-label="VinilArt Sport — Início">
      {logoLoaded ? (
        <img
          src="/brand/vinilart-sport-logo-horizontal.png"
          alt="VinilArt Sport"
          className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          onError={() => setLogoLoaded(false)}
        />
      ) : (
        <>
          <div className="relative">
            <span
              className="grid h-10 w-10 shrink-0 place-items-center bg-sport-gradient slant-pill shadow-glow-magenta transition-transform duration-200 group-hover:scale-105"
              aria-hidden="true"
            >
              <span className="font-display text-lg font-black text-black">V</span>
            </span>
            <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-cyan animate-pulse" />
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="font-display text-sm tracking-tighter text-foreground sm:text-base group-hover:text-cyan transition-colors">
              VINILART
            </span>
            <div className="flex items-center gap-1.5">
              <span className="skew-tag bg-magenta px-1.5 py-0.2 text-[0.6rem] font-black text-white tracking-widest">
                SPORT
              </span>
            </div>
          </div>
        </>
      )}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="brush-rule" aria-hidden="true" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Wordmark />

        {/* Desktop Nav: INÍCIO | LOJA | PORTFÓLIO | CONTACTOS */}
        <nav aria-label="Navegação principal" className="hidden items-center justify-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{
                className: "text-foreground font-semibold border-b-2 border-magenta pb-1",
              }}
              inactiveProps={{
                className: "text-muted-foreground hover:text-cyan pb-1 border-b-2 border-transparent",
              }}
              className="font-display text-[0.75rem] uppercase tracking-[0.16em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions: Voltar à VinilArt + Carrinho + Menu Mobile */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {/* Voltar à VinilArt - External Link */}
          <a
            href={VINILART_MAIN_URL !== "#" ? VINILART_MAIN_URL : "http://localhost:3000"}
            className="hidden items-center gap-1.5 border border-border/80 bg-surface/70 px-3 py-1.5 font-display text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground transition-all hover:border-cyan hover:text-foreground sm:inline-flex"
            rel="noopener noreferrer"
          >
            <span>Voltar à VinilArt</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-cyan" aria-hidden="true" />
          </a>

          {/* Carrinho */}
          <Link
            to="/carrinho"
            aria-label={totalItems > 0 ? `Carrinho — ${totalItems} ${totalItems === 1 ? "artigo" : "artigos"}` : "Carrinho — vazio"}
            className="relative grid h-10 w-10 place-items-center border border-border bg-surface text-foreground transition-all hover:border-cyan hover:text-cyan hover:shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            {totalItems > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-magenta text-[0.6rem] font-bold text-white shadow-glow-magenta"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* Botão Menu Mobile */}
          <button
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center border border-border bg-surface md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {open && (
        <div id="mobile-nav" className="border-t border-border bg-surface md:hidden">
          <nav aria-label="Menu móvel" className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3.5 font-display text-xs uppercase tracking-[0.16em] text-muted-foreground last:border-0 hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={VINILART_MAIN_URL !== "#" ? VINILART_MAIN_URL : "http://localhost:3000"}
              className="flex items-center justify-between py-3.5 font-display text-xs uppercase tracking-[0.14em] text-cyan hover:text-white"
              rel="noopener noreferrer"
            >
              <span>Voltar à VinilArt</span>
              <ArrowUpRight className="h-4 w-4 text-cyan" aria-hidden="true" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}