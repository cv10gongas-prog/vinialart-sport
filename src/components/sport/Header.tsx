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
          className="fixed inset-0 top-0 z-40 flex flex-col bg-background md:hidden"
        >
          <div className="flex items-center justify-between px-5 py-5">
            <Wordmark onClick={() => setOpen(false)} />
            <button
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
              className="grid h-11 w-11 place-items-center rounded-full border border-border"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav
            aria-label="Menu móvel"
            className="flex flex-1 flex-col justify-center gap-2 px-6 pb-16"
          >
            {nav.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${index * 60}ms` }}
                className="rise-in font-display text-[2.4rem] leading-[1.05] text-foreground/90 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}

            <a
              href={VINILART_MAIN_URL !== "#" ? VINILART_MAIN_URL : "http://localhost:3000"}
              className="mt-10 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground"
              rel="noopener noreferrer"
            >
              <span>Voltar à VinilArt</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
