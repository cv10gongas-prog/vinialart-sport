import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Users } from "lucide-react";
import heroBrush from "@/assets/hero-brush.jpg";
import { PageShell } from "@/components/sport/PageShell";
import { SectionHeading } from "@/components/sport/SectionHeading";
import { SportButton, SportLink } from "@/components/sport/SportButton";
import { ProductCard } from "@/components/sport/ProductCard";
import { EditorMock } from "@/components/sport/EditorMock";
import { categories, products, steps } from "@/lib/sport-data";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "VinilArt Sport — Personalizamos a tua paixão" },
      {
        name: "description",
        content:
          "Produtos desportivos e artigos personalizados à tua medida: caneleiras, equipamentos, bandeiras e artigos para adeptos.",
      },
      { property: "og:title", content: "VinilArt Sport — Personalizamos a tua paixão" },
      {
        property: "og:description",
        content: "Personalização desportiva premium: equipamentos, caneleiras, bandeiras e adeptos.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const accentText: Record<string, string> = {
  magenta: "text-magenta",
  cyan: "text-cyan",
  yellow: "text-yellow",
};
const accentBorder: Record<string, string> = {
  magenta: "hover:border-magenta",
  cyan: "hover:border-cyan",
  yellow: "hover:border-yellow",
};

function Home() {
  return (
    <PageShell>
      {/* HERO */}
      <section className="grain relative overflow-hidden">
        <img
          src={heroBrush}
          alt="Atletas com pinceladas magenta, cyan e amarelas sobre fundo preto"
          width={1600}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, var(--background) 8%, transparent 75%)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-32">
          <span className="skew-tag bg-magenta px-3 py-1 font-display text-[0.6rem] text-primary-foreground">
            VinilArt Sport
          </span>
          <h1 className="mt-5 max-w-3xl text-[2.6rem] leading-[0.88] sm:text-6xl md:text-7xl">
            Personalizamos <span className="text-sport-gradient">a tua paixão.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
            Produtos desportivos e artigos personalizados à tua medida.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <SportLink to="/personalizar" size="lg">
              Personalizar produto
            </SportLink>
            <SportLink to="/loja" variant="outline" size="lg">
              Explorar loja
            </SportLink>
          </div>
        </div>
        <div className="brush-rule" />
      </section>

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <SectionHeading
          eyebrow="Categorias"
          title="O que podemos personalizar"
          text="Escolhe uma categoria e leva a tua identidade para o campo."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              to="/loja"
              search={{ categoria: c.name }}
              className={`card-sport group relative flex min-h-[9rem] flex-col justify-between overflow-hidden p-5 ${accentBorder[c.accent]}`}
            >
              <span
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 opacity-25 transition-opacity group-hover:opacity-50"
                style={{ background: "var(--gradient-sport)", clipPath: "polygon(40% 0,100% 0,60% 100%,0 100%)" }}
                aria-hidden
              />
              <span className="font-display text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="relative">
                <span className="block font-display text-xl leading-tight">{c.name}</span>
                <span
                  className={`mt-2 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.14em] ${accentText[c.accent]}`}
                >
                  Ver artigos <ArrowRight className="h-3 w-3" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* PERSONALIZAÇÃO */}
      <section className="grain relative border-y border-border bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Personalização"
            title={
              <>
                Tu imaginas.
                <br />
                <span className="text-sport-gradient">Nós personalizamos.</span>
              </>
            }
            text="Um processo simples, do teu design até à produção."
          />

          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s) => (
              <li key={s.n} className="border border-border bg-background p-4">
                <span className="font-display text-2xl text-magenta">{s.n}</span>
                <p className="mt-2 font-display text-sm leading-tight">{s.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12">
            <EditorMock />
          </div>

          <div className="mt-8">
            <SportLink to="/personalizar" variant="cyan" size="lg">
              Ver o personalizador
            </SportLink>
          </div>
        </div>
      </section>

      {/* PRODUTOS EM DESTAQUE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Destaques" title="Produtos em destaque" />
          <SportLink to="/loja" variant="outline" size="sm">
            Ver toda a loja
          </SportLink>
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Produtos e preços demonstrativos
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* CRIAR COM IA */}
      <section className="relative overflow-hidden border-y border-border py-16 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{ background: "var(--gradient-sport)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="skew-tag border border-yellow px-3 py-1 font-display text-[0.6rem] text-yellow">
            Em breve
          </span>
          <h2 className="mt-5 text-3xl leading-[0.95] sm:text-5xl">
            Não tens um design?
            <br />
            <span className="text-sport-gradient">Cria um com IA.</span>
          </h2>
          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              placeholder="Descreve o design que imaginas…"
              className="h-12 flex-1 border border-input bg-surface px-4 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-cyan"
            />
            <SportButton variant="gradient" size="lg" disabled>
              <Sparkles className="h-4 w-4" /> Criar design
            </SportButton>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Exemplo: “Preto e verde, número 10, estilo agressivo e moderno.”
          </p>
        </div>
      </section>

      {/* CLUBES & EQUIPAS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Clubes & Equipas"
              title="Soluções para equipas, clubes e adeptos."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Equipamentos",
                "Nomes e números",
                "Encomendas de equipa",
                "Artigos para adeptos",
                "Personalização de identidade",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 border border-border bg-surface px-4 py-3 text-sm"
                >
                  <Users className="h-4 w-4 shrink-0 text-cyan" />
                  <span className="min-w-0 truncate">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <SportLink to="/contactos" size="lg">
                Falar com a VinilArt Sport
              </SportLink>
            </div>
          </div>
          <div className="grain relative min-h-[18rem] overflow-hidden border border-border">
            <img
              src={heroBrush}
              alt="Composição gráfica desportiva VinilArt Sport"
              loading="lazy"
              width={1600}
              height={1104}
              className="h-full w-full object-cover opacity-70"
            />
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section className="border-y border-border bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Trabalhos"
            title="Galeria"
            text="Espaço reservado para trabalhos reais. Em preparação."
          />
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="grain flex aspect-square items-center justify-center border border-dashed border-border bg-background"
              >
                <span className="text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
                  Trabalho {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="grain relative overflow-hidden py-20 text-center md:py-28">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-25"
          style={{ background: "var(--gradient-sport)", clipPath: "polygon(0 0,100% 25%,100% 75%,0 100%)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl leading-[0.95] sm:text-5xl">Pronto para criar algo teu?</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SportLink to="/personalizar" size="lg">
              Personalizar
            </SportLink>
            <SportLink to="/loja" variant="outline" size="lg">
              Ver loja
            </SportLink>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
