import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";

import {
  ArrowRight,
  Eye,
  ImagePlus,
  Layers,
  Palette,
} from "lucide-react";

import heroBrush from "@/assets/hero-brush.jpg";

import { PageShell } from "@/components/sport/PageShell";
import { SectionHeading } from "@/components/sport/SectionHeading";
import { SportLink } from "@/components/sport/SportButton";
import { ProductCard } from "@/components/sport/ProductCard";
import { EditorMock } from "@/components/sport/EditorMock";

import {
  categories,
  products,
  steps,
} from "@/lib/sport-data";

import { shinGuardPairWhite } from "@/lib/customizer/mockups";

export const Route =
  createFileRoute("/")({
    component: Home,

    head: () => ({
      meta: [
        {
          title:
            "VinilArt Sport — Personalizamos a tua paixão",
        },
        {
          name: "description",
          content:
            "Caneleiras, equipamentos, bandeiras, artigos para adeptos, estampagem e impressão com personalização VinilArt Sport.",
        },
      ],
    }),
  });

function Home() {
  return (
    <PageShell>
      <section className="grain relative overflow-hidden bg-tech-grid">
        <img
          src={heroBrush}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-screen"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/35" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:py-36">
          <span className="inline-block bg-magenta px-3 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-white">
            VinilArt Sport
          </span>

          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[0.94] sm:text-6xl md:text-8xl">
            PERSONALIZAMOS{" "}
            <span className="text-sport-gradient">
              A TUA PAIXÃO.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Cria uma proposta visual
            para caneleiras,
            equipamentos, bandeiras,
            artigos para adeptos,
            estampagem e impressão.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <SportLink
              to="/personalizar"
              size="lg"
            >
              Abrir Studio
              <ArrowRight className="h-4 w-4" />
            </SportLink>

            <SportLink
              to="/loja"
              variant="outline"
              shape="square"
              size="lg"
            >
              Ver loja
            </SportLink>
          </div>

          <div className="mt-12 grid max-w-3xl grid-cols-2 gap-3 border-t border-border/60 pt-6 sm:grid-cols-4">
            <div className="flex items-center gap-2 text-xs">
              <ImagePlus className="h-4 w-4 text-magenta" />
              Upload de imagens
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Layers className="h-4 w-4 text-cyan" />
              Camadas editáveis
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Eye className="h-4 w-4 text-yellow" />
              Preview no site
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Palette className="h-4 w-4 text-magenta" />
              Texto e grafismos
            </div>
          </div>
        </div>

        <div className="brush-rule" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <SectionHeading
          eyebrow="Personalização"
          title="Escolhe onde queres começar"
          text="Todas estas áreas ficam preparadas para receber uma proposta visual no personalizador online."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative overflow-hidden border-2 border-magenta/60 bg-surface p-6 sm:col-span-2 sm:p-8">
            <img
              src={shinGuardPairWhite}
              alt="Caneleiras brancas para personalização"
              className="absolute bottom-0 right-0 h-full w-[45%] object-contain opacity-55"
            />

            <div className="relative z-10 max-w-lg">
              <span className="bg-magenta px-2.5 py-1 font-mono text-[0.58rem] font-bold uppercase tracking-widest text-white">
                Personalizador disponível
              </span>

              <h2 className="mt-4 text-2xl font-black sm:text-4xl">
                Caneleiras brancas.
                <br />
                O design é teu.
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A base já não traz
                grafismos incorporados.
                Adiciona fotografias,
                nomes, números e logos no
                editor.
              </p>

              <SportLink
                to="/personalizar"
                search={{
                  produto:
                    "caneleiras-personalizadas",
                }}
                className="mt-6"
              >
                Personalizar caneleiras
              </SportLink>
            </div>
          </div>

          {categories
            .slice(1)
            .map(
              (
                category,
                index,
              ) => (
                <Link
                  key={
                    category.slug
                  }
                  to="/loja"
                  search={{
                    categoria:
                      category.name,
                  }}
                  className="group relative flex min-h-44 flex-col justify-between overflow-hidden border border-border bg-surface p-6 transition-colors hover:border-cyan"
                >
                  <span className="absolute right-4 top-2 font-display text-5xl text-white/5">
                    {String(
                      index + 2,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <div>
                    <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted-foreground">
                      Categoria
                    </p>

                    <h3 className="mt-2 font-display text-xl">
                      {
                        category.name
                      }
                    </h3>
                  </div>

                  <span className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-widest text-cyan">
                    Explorar
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ),
            )}
        </div>
      </section>

      <section className="grain border-y border-border bg-tech-grid py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="VinilArt Sport Studio"
            title="Do teu design para o produto."
            text="Carrega imagens, adiciona texto e vê o resultado diretamente no produto com preview limpo em tempo real."
          />

          <div className="mt-10">
            <EditorMock />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Loja"
            title="Personaliza o teu artigo"
            text="Cada área disponível pode abrir o mesmo motor de personalização com uma base adequada ao produto."
          />

          <SportLink
            to="/loja"
            variant="outline"
            shape="square"
          >
            Ver toda a loja
          </SportLink>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(
            (product) => (
              <ProductCard
                key={
                  product.slug
                }
                product={product}
              />
            ),
          )}
        </div>
      </section>
    </PageShell>
  );
}
