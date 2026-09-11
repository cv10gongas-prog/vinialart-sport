import {
  ArrowRight,
  Sparkles,
  Upload,
  HelpCircle,
} from "lucide-react";

import { SportLink } from "./SportButton";
import { shinGuardPairWhite } from "@/lib/customizer/mockups";
import { cn } from "@/lib/utils";

export function EditorMock({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card-sport overflow-hidden border border-border bg-surface p-5 hover:!translate-y-0 sm:p-8",
        className,
      )}
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        {/* Visual: Preview Real */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-magenta px-2.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-white">
                O Teu Design
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="bg-cyan px-2.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-black">
                No Produto
              </span>
            </div>
            <span className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
              Visualização Direta
            </span>
          </div>

          <div className="relative overflow-hidden border border-border bg-black">
            <img
              src={shinGuardPairWhite}
              alt="Design aplicado ao produto final em tempo real"
              className="aspect-[16/10] w-full object-contain p-6"
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between border border-border/60 bg-black/80 px-3 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-2 font-mono text-[0.6rem] text-cyan">
                <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
                <span>PREVIEW LIMPO DO PRODUTO</span>
              </div>
              <span className="font-mono text-[0.58rem] text-muted-foreground">
                SEM MARCAS OU GRELHAS
              </span>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Carrega o teu ficheiro e pré-visualiza-o diretamente no artigo. Se ainda não tens o design final, envia-nos a tua ideia e tratamos do resto.
          </p>
        </div>

        {/* Copy & CTAs */}
        <div>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-cyan">
            VinilArt Sport
          </span>

          <h3 className="mt-2 font-display text-2xl uppercase sm:text-3xl">
            Já tens o design? Vê como fica.
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Carrega o teu ficheiro e pré-visualiza-o diretamente no produto. Se ainda não tens o design final, envia-nos a tua ideia e tratamos do resto.
          </p>

          <div className="mt-6 grid gap-2.5">
            <div className="flex items-center gap-3 border border-border bg-background/60 p-3">
              <Upload className="h-4 w-4 text-cyan shrink-0" />
              <div>
                <p className="font-display text-xs uppercase">Carregamento simples</p>
                <p className="text-[0.7rem] text-muted-foreground">PNG, JPG, WEBP ou PDF com ajuste rápido</p>
              </div>
            </div>

            <div className="flex items-center gap-3 border border-border bg-background/60 p-3">
              <HelpCircle className="h-4 w-4 text-magenta shrink-0" />
              <div>
                <p className="font-display text-xs uppercase">Apoio na criação</p>
                <p className="text-[0.7rem] text-muted-foreground">Envia a tua ideia e a equipa VinilArt desenvolve a proposta</p>
              </div>
            </div>

            <div className="flex items-center gap-3 border border-border bg-background/60 p-3">
              <Sparkles className="h-4 w-4 text-yellow shrink-0" />
              <div>
                <p className="font-display text-xs uppercase">Sem complicações</p>
                <p className="text-[0.7rem] text-muted-foreground">Foco no produto desportivo real, sem editores complexos</p>
              </div>
            </div>
          </div>

          {/* Versatility chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
              Disponível em:
            </span>
            <span className="border border-border bg-background px-2 py-0.5 font-mono text-[0.62rem] uppercase text-cyan">
              Caneleiras
            </span>
            <span className="border border-border bg-background px-2 py-0.5 font-mono text-[0.62rem] uppercase text-magenta">
              Equipamento
            </span>
            <span className="border border-border bg-background px-2 py-0.5 font-mono text-[0.62rem] uppercase text-yellow">
              Bandeira
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <SportLink
              to="/personalizar"
              search={{ modo: "design" }}
              size="lg"
              className="font-display"
            >
              Testar o meu design
            </SportLink>

            <SportLink
              to="/personalizar"
              search={{ modo: "ajuda" }}
              variant="primary"
              size="lg"
              className="font-display"
            >
              Quero ajuda
            </SportLink>
          </div>
        </div>
      </div>
    </div>
  );
}
