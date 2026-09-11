import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/sport/PageShell";
import { ArrowRight, Shield, Shirt, Flag, Sparkles } from "lucide-react";

import prodCaneleiras from "@/assets/prod-caneleiras.jpg";
import prodCaneleiraDetail from "@/assets/prod-caneleira-detail.jpg";
import prodCaneleiraAngle from "@/assets/prod-caneleira-angle.jpg";
import prodCaneleiraBack from "@/assets/prod-caneleira-back.jpg";
import prodEquipamento from "@/assets/prod-equipamento.jpg";
import prodBandeira from "@/assets/prod-bandeira.jpg";

export const Route = createFileRoute("/portfolio")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "Portfólio — VinilArt Sport" },
      {
        name: "description",
        content:
          "Trabalhos reais e produções desportivas realizadas pela VinilArt Sport: caneleiras, equipamentos e artigos desportivos.",
      },
    ],
  }),
});

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  tag: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: "caneleiras-real-1",
    title: "Caneleiras Personalizadas de Jogo",
    category: "Caneleiras",
    image: prodCaneleiras,
    description: "Personalização de caneleiras com fotografia, dorsal e grafismo de alta definição.",
    tag: "Caneleiras",
  },
  {
    id: "caneleiras-detail",
    title: "Aplicação & Detalhe Gráfico",
    category: "Caneleiras",
    image: prodCaneleiraDetail,
    description: "Cores vivas e integração nítida do design com a curvatura da caneleira.",
    tag: "Detalhe",
  },
  {
    id: "caneleiras-angle",
    title: "Vista Lateral em Perspetiva",
    category: "Caneleiras",
    image: prodCaneleiraAngle,
    description: "Perspetiva angular que realça a linha anatómica e o enquadramento do design.",
    tag: "Perspetiva",
  },
  {
    id: "caneleiras-back",
    title: "Vista Posterior da Caneleira",
    category: "Caneleiras",
    image: prodCaneleiraBack,
    description: "Enquadramento posterior com acabamento interior e perfil anatómico.",
    tag: "Verso",
  },
  {
    id: "equipamento-jogo",
    title: "Equipamento Desportivo de Competição",
    category: "Equipamentos",
    image: prodEquipamento,
    description: "Camisola desportiva com estampagem e personalização gráfica de equipa.",
    tag: "Equipamento",
  },
  {
    id: "bandeira-clube",
    title: "Bandeira Desportiva para Adeptos & Clubes",
    category: "Bandeiras",
    image: prodBandeira,
    description: "Impressão gráfica têxtil de grande formato para apoio nos estádios e pavilhões.",
    tag: "Bandeira",
  },
];

function Portfolio() {
  return (
    <PageShell>
      {/* Portfolio Hero Header */}
      <section className="grain relative border-b border-border bg-tech-grid py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="bg-cyan px-3 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-widest text-black">
            Galeria de Trabalhos
          </span>
          <h1 className="mt-4 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl">
            Portfólio VinilArt Sport
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Produções reais de caneleiras personalizadas, equipamentos desportivos e artigos de apoio para atletas e clubes.
          </p>
        </div>
      </section>

      {/* Portfolio Gallery Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="card-sport group relative flex flex-col overflow-hidden border border-border bg-surface hover:border-cyan hover:shadow-lg hover:shadow-cyan/5 transition-all"
            >
              <div className="relative aspect-square overflow-hidden bg-black/50">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-black/80 border border-border px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-cyan backdrop-blur-sm">
                    {item.tag}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                  {item.category}
                </span>
                <h3 className="mt-1 font-display text-lg font-bold text-foreground group-hover:text-cyan transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <section className="mt-16 card-sport flex flex-col items-center justify-between gap-6 border-2 border-magenta/40 bg-surface p-8 text-center sm:flex-row sm:text-left">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-magenta font-bold">
              Gostaste dos nossos trabalhos?
            </span>
            <h3 className="mt-2 font-display text-xl sm:text-2xl font-black uppercase text-foreground">
              Personaliza o teu artigo ou pede orçamento à equipa
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xl">
              Podes testar o teu design online ou enviar a tua ideia para a VinilArt Sport tratar de toda a criação.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/loja"
              className="inline-flex items-center gap-2 border border-cyan bg-cyan px-6 py-3 font-display text-xs uppercase tracking-wider text-black font-bold hover:bg-cyan/90 transition-colors"
            >
              <span>Ver Loja</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contactos"
              className="inline-flex items-center gap-2 border border-border bg-surface px-6 py-3 font-display text-xs uppercase tracking-wider text-foreground hover:border-magenta hover:text-magenta transition-colors"
            >
              <span>Pedir Orçamento</span>
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}