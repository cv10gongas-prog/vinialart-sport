import { createFileRoute, Link } from "@tanstack/react-router";

import { AdminPage, Card, StatusChip } from "@/components/admin/AdminUI";
import { productCustomizerConfigs } from "@/lib/customizer/configs";
import { useCms } from "@/lib/cms/store";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { content } = useCms();

  const published = content.products.filter((p) => p.status === "published").length;
  const drafts = content.products.length - published;
  const configured = content.products.filter(
    (p) => productCustomizerConfigs[p.customizerConfigId],
  ).length;
  const visiblePortfolio = content.portfolio.filter((item) => item.visible).length;
  const contactsFilled = content.contacts.filter(
    (channel) => channel.value.trim() !== "",
  ).length;

  const cards = [
    { label: "Produtos publicados", value: `${published}`, to: "/admin/produtos" },
    { label: "Produtos em rascunho", value: `${drafts}`, to: "/admin/produtos" },
    { label: "Categorias ativas", value: `${content.categories.filter((c) => c.active).length}`, to: "/admin/categorias" },
    { label: "Personalização configurada", value: `${configured}/${content.products.length}`, to: "/admin/personalizador" },
    { label: "Trabalhos visíveis", value: `${visiblePortfolio}`, to: "/admin/portfolio" },
    { label: "Canais de contacto preenchidos", value: `${contactsFilled}`, to: "/admin/contactos" },
  ];

  return (
    <AdminPage
      eyebrow="Visão geral"
      title="Administração VinilArt Sport"
      description="Gere aqui o conteúdo do site: produtos, categorias, personalização, trabalhos, contactos e configurações. As alterações ficam guardadas neste navegador."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className="group block">
            <Card className="transition group-hover:border-cyan-400/30">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-zinc-500">
                {card.label}
              </span>
              <p className="mt-3 font-display text-3xl text-white">{card.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <StatusChip tone="warn">Guardado apenas neste navegador</StatusChip>
          <p className="text-sm text-zinc-400">
            Nesta fase o conteúdo é guardado localmente. Quando quiseres que as alterações
            fiquem visíveis para todos os visitantes, passamos a guardar online.
          </p>
        </div>
      </Card>
    </AdminPage>
  );
}
