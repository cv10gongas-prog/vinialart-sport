import {
  Eye,
  ImagePlus,
  Layers,
  Move,
} from "lucide-react";

import { SportLink } from "./SportButton";

import { shinGuardPairWhite } from "@/lib/customizer/mockups";
import { cn } from "@/lib/utils";

export function EditorMock({
  className,
}: {
  className?: string;
}) {
  const features = [
    {
      icon: ImagePlus,
      title: "Carrega as tuas imagens",
      text: "Fotografias, logótipos e outros grafismos.",
      color: "text-magenta",
    },
    {
      icon: Move,
      title: "Move e redimensiona",
      text: "Posiciona cada elemento diretamente sobre o produto.",
      color: "text-cyan",
    },
    {
      icon: Layers,
      title: "Trabalha por camadas",
      text: "Organiza imagens e texto sem perder o controlo do design.",
      color: "text-yellow",
    },
    {
      icon: Eye,
      title: "Pré-visualiza no site",
      text: "Vê o resultado limpo antes de guardares no carrinho.",
      color: "text-magenta",
    },
  ];

  return (
    <div
      className={cn(
        "card-sport overflow-hidden border border-border bg-surface p-5 hover:!translate-y-0 sm:p-8",
        className,
      )}
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-magenta px-3 py-1 font-mono text-[0.58rem] font-bold uppercase tracking-widest text-white">
              Caneleira base branca
            </span>

            <span className="font-mono text-[0.58rem] uppercase tracking-widest text-cyan">
              Personalização adicionada
              pelo cliente
            </span>
          </div>

          <div className="mt-5 overflow-hidden border border-border bg-black">
            <img
              src={shinGuardPairWhite}
              alt="Par de caneleiras brancas preparado para personalização"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            O produto começa neutro.
            Fotografias, nomes, números e
            logótipos só aparecem quando
            o utilizador os adiciona no
            personalizador.
          </p>
        </div>

        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-cyan">
            Personalizador real
          </p>

          <h3 className="mt-2 font-display text-2xl sm:text-3xl">
            Tu crias. O site mostra.
          </h3>

          <div className="mt-6 grid gap-3">
            {features.map(
              ({
                icon: Icon,
                title,
                text,
                color,
              }) => (
                <div
                  key={title}
                  className="flex gap-3 border border-border bg-background/60 p-3"
                >
                  <Icon
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      color,
                    )}
                  />

                  <div>
                    <p className="font-display text-xs uppercase">
                      {title}
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {text}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          <SportLink
            to="/personalizar"
            search={{
              produto:
                "caneleiras-personalizadas",
            }}
            size="lg"
            className="mt-6 w-full sm:w-auto"
          >
            Abrir personalizador
          </SportLink>
        </div>
      </div>
    </div>
  );
}
