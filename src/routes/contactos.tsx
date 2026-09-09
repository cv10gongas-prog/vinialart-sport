import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PageShell } from "@/components/sport/PageShell";
import { SportButton } from "@/components/sport/SportButton";

export const Route = createFileRoute("/contactos")({
  component: Contactos,
  head: () => ({
    meta: [
      { title: "Contactos — VinilArt Sport" },
      {
        name: "description",
        content:
          "Fala com a VinilArt Sport sobre personalização de equipamentos, artigos para adeptos e encomendas de equipa.",
      },
      { property: "og:title", content: "Contactos — VinilArt Sport" },
      {
        property: "og:description",
        content: "Pedidos de orçamento e personalização desportiva na VinilArt Sport.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contactos" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contactos" }],
  }),
});

const fieldClass =
  "h-11 w-full border border-input bg-surface px-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-cyan";

function Contactos() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Contactos"
        title="Falar com a VinilArt Sport"
        text="Conta-nos o que queres personalizar. Formulário de demonstração — ainda não envia mensagens."
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="card-sport hover:!translate-y-0 grid gap-4 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                Nome
              </label>
              <input className={`mt-2 ${fieldClass}`} placeholder="O teu nome" />
            </div>
            <div>
              <label className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                Email
              </label>
              <input type="email" className={`mt-2 ${fieldClass}`} placeholder="email@exemplo.pt" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                Clube / Equipa
              </label>
              <input className={`mt-2 ${fieldClass}`} placeholder="Opcional" />
            </div>
            <div>
              <label className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                Tipo de pedido
              </label>
              <select className={`mt-2 ${fieldClass}`}>
                <option>Equipamentos</option>
                <option>Caneleiras</option>
                <option>Bandeiras</option>
                <option>Artigos para adeptos</option>
                <option>Estampagem / Impressão</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              Mensagem
            </label>
            <textarea
              rows={6}
              className="mt-2 w-full border border-input bg-surface p-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-cyan"
              placeholder="Descreve o que precisas: quantidades, tamanhos, prazos…"
            />
          </div>
          <SportButton size="lg" disabled className="justify-self-start">
            Enviar pedido
          </SportButton>
          <p className="text-xs text-muted-foreground">
            Envio de mensagens será ativado numa fase seguinte.
          </p>
        </form>

        <aside className="card-sport hover:!translate-y-0 h-fit p-6">
          <p className="font-display text-sm">Dados de contacto</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Telefone, email e morada a confirmar contigo antes de publicar.
          </p>
          <div className="brush-rule my-6" />
          <p className="font-display text-sm">Encomendas de equipa</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Para clubes, envia a lista de nomes, números e tamanhos junto com o pedido.
          </p>
        </aside>
      </section>
    </PageShell>
  );
}
