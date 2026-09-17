import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import { useCms } from "@/lib/cms/store";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({
    meta: [
      { title: "Administração — VinilArt Sport" },
      {
        name: "description",
        content:
          "Área de administração VinilArt Sport: produtos, categorias, portefólio, contactos, personalizador e configurações.",
      },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Administração — VinilArt Sport" },
      {
        property: "og:description",
        content: "Gestão de conteúdo do site VinilArt Sport.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const adminNav = [
  { to: "/admin", label: "Visão geral", exact: true },
  { to: "/admin/inicio", label: "Início" },
  { to: "/admin/produtos", label: "Produtos" },
  { to: "/admin/categorias", label: "Categorias" },
  { to: "/admin/personalizador", label: "Personalizador" },
  { to: "/admin/portfolio", label: "Portefólio" },
  { to: "/admin/contactos", label: "Contactos" },
  { to: "/admin/pedidos", label: "Pedidos" },
  { to: "/admin/configuracoes", label: "Configurações" },
];

function AdminLayout() {
  const { saving, ready } = useCms();

  return (
    <div className="min-h-screen bg-[#080b0f] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080b0f]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm uppercase tracking-[0.2em] text-white">
              VinilArt Sport
            </span>
            <span className="hidden font-mono text-[0.58rem] uppercase tracking-[0.18em] text-cyan-400 sm:inline">
              Administração
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span
              aria-live="polite"
              className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-zinc-500"
            >
              {!ready ? "A carregar…" : saving ? "A guardar…" : "Guardado"}
            </span>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3 py-2 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-zinc-300 transition hover:border-cyan-400/50 hover:text-white"
            >
              Ver site
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:gap-12 lg:py-12">
        <nav
          aria-label="Navegação da administração"
          className="lg:w-56 lg:shrink-0"
        >
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {adminNav.map((entry) => (
              <li key={entry.to} className="shrink-0">
                <Link
                  to={entry.to}
                  activeOptions={{ exact: entry.exact ?? false }}
                  activeProps={{
                    className:
                      "border-cyan-400/50 bg-cyan-400/10 text-white",
                  }}
                  className="block rounded-full border border-white/10 px-4 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.13em] text-zinc-400 transition hover:border-white/25 hover:text-white lg:rounded-xl"
                >
                  {entry.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
