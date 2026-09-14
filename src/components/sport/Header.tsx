import { useEffect, useState } from "react";
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

function Wordmark({ onClick }: { onClick?: () => void }) {
  const [logoOk, setLogoOk] = useState(true);

  return (
    <Link
      to="/"
      onClick={onClick}
      className="group flex min-w-0 items-center gap-3"
      aria-label="VinilArt Sport — Início"
    >
      {logoOk ? (
        <img
          src="/brand/vinilart-sport-logo-horizontal.png"
          alt="VinilArt Sport"
          className="h-8 w-auto object-contain sm:h-9"
          onError={() => setLogoOk(false)}
        />
      ) : (
        <span className="font-display text-base tracking-tight sm:text-lg">
          VINILART <span className="text-magenta">SPORT</span>
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={
        "sticky top-0 z-50 transition-colors duration-500 " +
        (scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent")
      }
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-5 py-5 sm:px-8">
        <Wordmark />

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-10 md:flex"
        >
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{
                className: "text-muted-foreground hover:text-foreground",
              }}
              className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <a
            href={VINILART_MAIN_URL !== "#" ? VINILART_MAIN_URL : "http://localhost:3000"}
            className="hidden items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
            rel="noopener noreferrer"
          >
            <span>Voltar à VinilArt</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>

          <Link
            to="/carrinho"
            aria-label={
              totalItems > 0
                ? `Carrinho — ${totalItems} ${totalItems === 1 ? "artigo" : "artigos"}`
                : "Carrinho — vazio"
            }
            className="relative grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-foreground/40 hover:bg-foreground/5"
          >
            <ShoppingBag className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
            {totalItems > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-magenta text-[0.6rem] font-bold text-white"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          <button
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-border transition-colors hover:border-foreground/40 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Fullscreen mobile menu */}
      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-0 z-50 flex flex-col bg-[#0b0d12] md:hidden overflow-y-auto"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <Wordmark onClick={() => setOpen(false)} />
            <button
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
              className="grid h-12 w-12 min-h-[48px] min-w-[48px] place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-cyan-400 hover:text-cyan-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav
            aria-label="Menu móvel"
            className="flex flex-1 flex-col justify-center gap-4 px-6 py-10"
          >
            {nav.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${index * 60}ms` }}
                className="rise-in flex min-h-[48px] items-center font-display text-3xl sm:text-4xl leading-tight text-white/90 uppercase tracking-wide transition-colors hover:text-cyan-400 active:text-cyan-300"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
              <Link
                to="/carrinho"
                onClick={() => setOpen(false)}
                className="flex min-h-[48px] items-center justify-between rounded-xl bg-white/[0.05] px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-cyan-400" />
                  Carrinho
                </span>
                <span className="rounded-full bg-magenta px-2.5 py-0.5 text-xs font-bold text-white">
                  {totalItems}
                </span>
              </Link>

              <a
                href={VINILART_MAIN_URL !== "#" ? VINILART_MAIN_URL : "http://localhost:3000"}
                className="inline-flex min-h-[48px] items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors py-2"
                rel="noopener noreferrer"
              >
                <span>Voltar à VinilArt Principal</span>
                <ArrowUpRight className="h-4 w-4 text-cyan-400" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
