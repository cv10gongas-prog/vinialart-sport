import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Eraser,
  Layers,
  Move,
  RotateCw,
  Sparkles,
  Type,
  Upload,
} from "lucide-react";
import caneleiras from "@/assets/prod-caneleiras.jpg";
import { SportLink } from "./SportButton";
import { cn } from "@/lib/utils";

export function EditorMock({ className }: { className?: string }) {
  const [activeSide, setActiveSide] = useState<"left" | "right">("left");

  const highlights = [
    {
      icon: Eraser,
      title: "Remoção de Fundo Local",
      desc: "Remove fundos de fotos e logos diretamente no teu browser sem esperas.",
      color: "text-magenta",
      borderColor: "border-magenta/40",
    },
    {
      icon: Sparkles,
      title: "Ajuste Inteligente da Imagem",
      desc: "Enquadra fotos, rostos e grafismos no centro útil da área imprimível.",
      color: "text-cyan",
      borderColor: "border-cyan/40",
    },
    {
      icon: Layers,
      title: "Lados Independentes (L / R)",
      desc: "Podes desenhar uma caneleira para a esquerda e outra diferente para a direita.",
      color: "text-yellow",
      borderColor: "border-yellow/40",
    },
    {
      icon: CheckCircle2,
      title: "Pré-visualização & Arte Técnica",
      desc: "Visualiza com acabamento realista e exporta o ficheiro pronto para encomenda.",
      color: "text-green-400",
      borderColor: "border-green-400/40",
    },
  ];

  return (
    <div
      className={cn(
        "card-sport group relative overflow-hidden border border-border/80 bg-surface p-5 sm:p-8 hover:!translate-y-0 shadow-card",
        className,
      )}
    >
      {/* Background athletic pattern */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 bg-sport-gradient opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-tech-grid opacity-30" />

      {/* Top Header Bar */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-cyan animate-ping" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display text-base tracking-tight sm:text-lg">
                ESTÚDIO DE PERSONALIZAÇÃO 2D
              </p>
              <span className="skew-tag bg-cyan px-2 py-0.5 text-[0.55rem] font-black text-black">
                MOTOR REAL ATIVO
              </span>
            </div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              Caneleiras // Lados L / R // Konva Engine
            </p>
          </div>
        </div>

        {/* Side switcher */}
        <div className="flex items-center rounded border border-border/80 bg-background/80 p-1">
          <button
            type="button"
            onClick={() => setActiveSide("left")}
            className={cn(
              "px-3 py-1 font-display text-[0.65rem] uppercase tracking-wider transition-all",
              activeSide === "left"
                ? "bg-magenta text-white shadow-glow-magenta"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Lado Esquerdo
          </button>
          <button
            type="button"
            onClick={() => setActiveSide("right")}
            className={cn(
              "px-3 py-1 font-display text-[0.65rem] uppercase tracking-wider transition-all",
              activeSide === "right"
                ? "bg-cyan text-black shadow-glow-cyan"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Lado Direito
          </button>
        </div>
      </div>

      {/* Main Studio Showcase grid */}
      <div className="relative mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        {/* Left: Realistic Visual Canvas Display */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-border bg-background sm:aspect-square">
          <img
            src={caneleiras}
            alt="Simulação do personalizador VinilArt Sport"
            width={1024}
            height={1024}
            className="h-full w-full object-cover"
          />

          {/* Athletic framing & technical crosshairs */}
          <div className="pointer-events-none absolute inset-0 border border-white/5">
            <span className="absolute left-4 top-4 font-mono text-[0.6rem] text-muted-foreground/60">
              SYS::VIEW // 100% SCALE
            </span>
            <span className="absolute right-4 top-4 font-mono text-[0.6rem] text-cyan">
              {activeSide === "left" ? "CANVAS: LEFT_SURFACE" : "CANVAS: RIGHT_SURFACE"}
            </span>
            <span className="absolute bottom-4 left-4 font-mono text-[0.6rem] text-muted-foreground/60">
              ÁREA ÚTIL // PERSONALIZAÇÃO
            </span>
          </div>

          {/* Interactive focal bounding box */}
          <div
            className={cn(
              "absolute top-1/2 h-[74%] w-[38%] -translate-y-1/2 border-2 border-dashed transition-all duration-300",
              activeSide === "left"
                ? "left-[29%] -translate-x-1/2 border-magenta shadow-glow-magenta"
                : "left-[71%] -translate-x-1/2 border-cyan shadow-glow-cyan",
            )}
          >
            {/* Corner handles */}
            <span className={cn("absolute -left-1.5 -top-1.5 h-3 w-3", activeSide === "left" ? "bg-magenta" : "bg-cyan")} />
            <span className={cn("absolute -right-1.5 -top-1.5 h-3 w-3", activeSide === "left" ? "bg-magenta" : "bg-cyan")} />
            <span className={cn("absolute -bottom-1.5 -left-1.5 h-3 w-3", activeSide === "left" ? "bg-magenta" : "bg-cyan")} />
            <span className={cn("absolute -bottom-1.5 -right-1.5 h-3 w-3", activeSide === "left" ? "bg-magenta" : "bg-cyan")} />

            <div
              className={cn(
                "absolute -top-7 left-0 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider",
                activeSide === "left" ? "bg-magenta text-white" : "bg-cyan text-black",
              )}
            >
              {activeSide === "left" ? "ÁREA DE DESIGN // ESQUERDA" : "ÁREA DE DESIGN // DIREITA"}
            </div>
          </div>

          {/* Floating feature pills on mockup */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
            <span className="skew-tag bg-black/80 px-2 py-1 font-mono text-[0.6rem] text-white border border-border backdrop-blur-sm">
              ✨ PRÉ-VISUALIZAÇÃO EM TEMPO REAL
            </span>
          </div>
        </div>

        {/* Right: Studio Capabilities & Action */}
        <div className="flex flex-col justify-between gap-6">
          <div className="grid gap-3">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex items-start gap-3.5 border bg-background/60 p-3.5 transition-all hover:bg-background/90",
                    item.borderColor,
                  )}
                >
                  <div className={cn("mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded bg-surface", item.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-display text-xs uppercase tracking-wider text-foreground">
                      {item.title}
                    </h4>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action box */}
          <div className="border-t border-border/80 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-sm">Pronto para criar o teu par?</p>
                <p className="text-xs text-muted-foreground">
                  Sem necessidade de registo imediato. Começa a editar agora.
                </p>
              </div>
              <SportLink
                to="/personalizar"
                variant="primary"
                size="lg"
                shape="slant"
                className="w-full sm:w-auto shadow-glow-magenta"
              >
                Abrir Personalizador <ArrowRight className="h-4 w-4" />
              </SportLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

