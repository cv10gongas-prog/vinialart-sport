import { useState } from "react";
import {
  Eraser,
  Image as ImageIcon,
  Move,
  RotateCw,
  Sparkles,
  Type,
  Upload,
  ZoomIn,
} from "lucide-react";
import caneleiras from "@/assets/prod-caneleiras.jpg";
import { SportButton } from "./SportButton";
import { cn } from "@/lib/utils";

const swatches = ["magenta", "cyan", "yellow", "foreground", "background"] as const;

const swatchClass: Record<string, string> = {
  magenta: "bg-magenta",
  cyan: "bg-cyan",
  yellow: "bg-yellow",
  foreground: "bg-foreground",
  background: "bg-background",
};

function ToolChip({
  icon: Icon,
  label,
}: {
  icon: typeof Move;
  label: string;
}) {
  return (
    <span className="flex items-center gap-2 border border-border bg-surface-2 px-3 py-2 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0 text-cyan" />
      <span className="truncate">{label}</span>
    </span>
  );
}

export function EditorMock({ className }: { className?: string }) {
  const [side, setSide] = useState<"Esquerdo" | "Direito">("Esquerdo");
  const [color, setColor] = useState<string>("magenta");

  return (
    <div className={cn("card-sport hover:!translate-y-0 p-4 sm:p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="font-display text-sm">Personalizador</p>
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
            Pré-visualização — em desenvolvimento
          </p>
        </div>
        <span className="skew-tag border border-yellow px-2 py-1 font-display text-[0.55rem] text-yellow">
          Demo visual
        </span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_minmax(0,15rem)]">
        {/* Preview canvas */}
        <div className="relative aspect-square overflow-hidden border border-border bg-background">
          <img
            src={caneleiras}
            alt="Pré-visualização do produto personalizado"
            loading="lazy"
            width={1024}
            height={1024}
            className="h-full w-full object-cover opacity-90"
          />
          {/* fake selection frame */}
          <div className="absolute left-1/2 top-1/2 h-2/5 w-2/5 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-cyan">
            <span className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-cyan" />
            <span className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-cyan" />
            <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-cyan" />
            <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-cyan" />
            <span className="absolute -top-7 left-0 bg-cyan px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-accent-foreground">
              A tua imagem
            </span>
          </div>
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            <span className="bg-background/80 px-2 py-1 text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">
              Lado {side}
            </span>
            <span className="bg-background/80 px-2 py-1 text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">
              Cor: {color}
            </span>
          </div>
        </div>

        {/* Tool panel */}
        <div className="flex flex-col gap-4">
          <div className="border border-dashed border-border bg-surface-2 p-4 text-center">
            <Upload className="mx-auto h-5 w-5 text-magenta" />
            <p className="mt-2 text-xs text-muted-foreground">
              Arrasta a tua imagem ou logo
            </p>
            <p className="text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground/70">
              Upload em breve
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ToolChip icon={Move} label="Mover" />
            <ToolChip icon={ZoomIn} label="Redimensionar" />
            <ToolChip icon={RotateCw} label="Rodar" />
            <ToolChip icon={ImageIcon} label="Logos" />
          </div>

          <div className="grid gap-2">
            <label className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              Nome
            </label>
            <input
              placeholder="Ex.: Silva"
              className="h-10 border border-input bg-surface-2 px-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-cyan"
            />
            <label className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              Número
            </label>
            <input
              placeholder="10"
              className="h-10 border border-input bg-surface-2 px-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-cyan"
            />
          </div>

          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              Lado
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["Esquerdo", "Direito"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className={cn(
                    "h-9 border text-[0.65rem] uppercase tracking-[0.12em] transition-colors",
                    side === s
                      ? "border-magenta bg-magenta text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-cyan",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              Cores
            </p>
            <div className="mt-2 flex gap-2">
              {swatches.map((s) => (
                <button
                  key={s}
                  aria-label={`Cor ${s}`}
                  onClick={() => setColor(s)}
                  className={cn(
                    "h-8 w-8 border",
                    swatchClass[s],
                    color === s ? "border-foreground" : "border-border",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <ToolChip icon={Type} label="Adicionar texto" />
            <ToolChip icon={Eraser} label="Remover fundo" />
          </div>

          <SportButton variant="gradient" className="w-full" disabled>
            <Sparkles className="h-4 w-4" /> Ajustar automaticamente com IA
          </SportButton>
          <p className="text-center text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground/70">
            Funcionalidade futura
          </p>
        </div>
      </div>
    </div>
  );
}
