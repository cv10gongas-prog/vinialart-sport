import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/sport/PageShell";
import { SportLink } from "@/components/sport/SportButton";
import { usePortfolio } from "@/lib/content/store";

export const Route = createFileRoute("/portfolio")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "Portfólio — VinilArt Sport" },
      {
        name: "description",
        content:
          "Trabalhos reais de personalização desportiva, equipamentos, caneleiras, estampagem e acessórios produzidos pela VinilArt Sport.",
      },
      {
        property: "og:title",
        content: "Portfólio — VinilArt Sport",
      },
      {
        property: "og:description",
        content:
          "Uma seleção de trabalhos reais de personalização da VinilArt Sport.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
});

/**
 * Composição visual do mosaico (apresentação, não conteúdo).
 * O conteúdo — imagens, títulos, categorias e ordem — vem do repositório.
 */
const mosaicLayouts = [
  "md:col-span-7 min-h-[460px] md:min-h-[540px]",
  "md:col-span-5 min-h-[460px] md:min-h-[540px]",
  "md:col-span-5 min-h-[340px]",
  "md:col-span-7 min-h-[340px]",
  "md:col-span-4 min-h-[380px]",
  "md:col-span-8 min-h-[380px]",
  "md:col-span-7 min-h-[400px]",
  "md:col-span-5 min-h-[400px]",
  "md:col-span-12 min-h-[340px] md:min-h-[410px]",
  "md:col-span-6 min-h-[360px]",
  "md:col-span-6 min-h-[360px]",
];

function Portfolio() {
  const items = usePortfolio({ onlyVisible: true });

  return (
    <PageShell className="bg-[#090c11] text-white">
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0c0f16]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-40 h-[520px] w-[190px] rotate-[27deg] bg-cyan-400/[0.08]" />
          <div className="absolute right-4 -top-40 h-[520px] w-[115px] rotate-[27deg] bg-fuchsia-500/[0.08]" />
          <div className="absolute right-20 -top-40 h-[520px] w-[55px] rotate-[27deg] bg-yellow-400/[0.07]" />

          <div className="absolute -left-40 bottom-[-240px] h-[430px] w-[430px] rounded-full bg-fuchsia-500/[0.08] blur-[130px]" />
          <div className="absolute right-[20%] top-[-250px] h-[500px] w-[500px] rounded-full bg-cyan-400/[0.06] blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="max-w-5xl">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.25em] text-cyan-400">
              Portfólio // Trabalho real
            </span>

            <h1 className="mt-5 font-display text-[2.8rem] uppercase leading-[0.9] tracking-tight text-white sm:text-6xl lg:text-7xl">
              A identidade
              <br />

              <span className="relative inline-block">
                ganha forma.

                <span className="absolute -bottom-3 left-0 h-[3px] w-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400" />
              </span>
            </h1>

            <p className="mt-9 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Uma seleção de trabalhos reais de personalização, estampagem e
              produção para o universo desportivo.
            </p>
          </div>
        </div>
      </section>

      {/* PORTFÓLIO */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="mb-10 flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.22em] text-cyan-400">
              01 // Trabalhos realizados
            </span>

            <h2 className="mt-2 font-display text-3xl uppercase leading-none tracking-tight text-white sm:text-5xl">
              Do ficheiro
              <br />

              <span className="text-zinc-500">
                ao produto.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-zinc-500">
            Fotografias reais de personalizações produzidas pela VinilArt
            Sport.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {items.map((item, index) => (
            <figure
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111622] ${
                mosaicLayouts[index % mosaicLayouts.length]
              }`}
            >
              <img
                src={item.image}
                alt={item.description || item.title}
                loading={index < 2 ? "eager" : "lazy"}
                className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]`}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-black/5" />

              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <figcaption>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-cyan-300">
                    {item.categoryName}
                  </span>

                  <h3 className="mt-1 font-display text-xl uppercase tracking-wide text-white sm:text-2xl">
                    {item.title}
                  </h3>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-[#11121a]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-28 h-[360px] w-[170px] rotate-[24deg] bg-cyan-400/[0.16]" />
            <div className="absolute right-8 -top-28 h-[360px] w-[120px] rotate-[24deg] bg-fuchsia-500/[0.18]" />
            <div className="absolute right-24 -top-28 h-[360px] w-[60px] rotate-[24deg] bg-yellow-400/[0.14]" />

            <div className="absolute bottom-[-220px] left-[-100px] h-[420px] w-[420px] rounded-full bg-fuchsia-500/[0.11] blur-[120px]" />
          </div>

          <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-zinc-500">
              O teu projeto
            </span>

            <h2 className="mt-3 max-w-3xl font-display text-3xl uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
              O próximo projeto
              <br />

              <span className="text-cyan-400">
                pode ser o teu.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-400">
              Tens uma ideia, referência ou design? Fala com a VinilArt Sport e
              explica-nos o que pretendes personalizar.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <SportLink
                to="/contactos"
                size="lg"
              >
                Falar com a VinilArt
              </SportLink>

              <SportLink
                to="/loja"
                size="lg"
                variant="outline"
              >
                Ver loja
              </SportLink>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
