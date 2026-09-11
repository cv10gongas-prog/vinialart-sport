import { useRef } from "react";
import {
  Upload,
  RotateCw,
  RotateCcw,
  Maximize,
  Minimize,
  Copy,
  Trash2,
  Undo2,
  Redo2,
} from "lucide-react";
import type { ProductCustomizerHandle } from "@/hooks/useProductCustomizer";
import { cn } from "@/lib/utils";

interface CustomizerControlPanelProps {
  customizer: ProductCustomizerHandle;
  className?: string | undefined;
}

export function CustomizerControlPanel({
  customizer,
  className,
}: CustomizerControlPanelProps) {
  const {
    config,
    state,
    selectedLayer,
    activeLayers,
    undo,
    redo,
    canUndo,
    canRedo,
    smartFit,
    coverFit,
    alignSelected,
    rotateSelected,
    copyDesignToOtherSurface,
    deleteLayer,
    addImagesFromFiles,
    updateLayer,
  } = customizer;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isShinGuard =
    state.activeSurfaceId === "LEFT" || state.activeSurfaceId === "RIGHT";
  const otherSideLabel = isShinGuard
    ? state.activeSurfaceId === "LEFT"
      ? "Copiar para Direita"
      : "Copiar para Esquerda"
    : "Copiar para Costas";

  const otherSurface = config.surfaces.find(
    (s) => s.id !== state.activeSurfaceId,
  );

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      addImagesFromFiles(e.target.files);
      e.target.value = "";
    }
  }

  const currentLayer = selectedLayer ?? activeLayers[activeLayers.length - 1] ?? null;

  function handleScaleChange(delta: number) {
    if (!currentLayer) return;
    const currentScale = currentLayer.scaleX ?? 1;
    const newScale = Math.max(0.1, Math.min(5, currentScale + delta));
    updateLayer(currentLayer.id, {
      scaleX: newScale,
      scaleY: newScale,
    });
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* 1. CARREGAR DESIGN */}
      <div className="border border-border/80 bg-surface p-5">
        <h3 className="font-display text-base font-bold uppercase text-foreground">
          Carregar Design
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Carrega o teu ficheiro para veres o resultado aplicado imediatamente.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="customizer-file-input"
        />

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-12 w-full items-center justify-center gap-2 border-2 border-cyan bg-cyan font-display text-xs uppercase tracking-wider text-black font-bold hover:bg-cyan/90 transition-colors shadow-glow-cyan"
          >
            <Upload className="h-4 w-4" />
            <span>Carregar Ficheiro</span>
          </button>
          <span className="text-center font-mono text-[0.62rem] text-muted-foreground">
            PNG, JPG, WEBP ou PDF
          </span>
        </div>
      </div>

      {/* 2. CONTROLOS DE POSICIONAMENTO E AJUSTE */}
      <div className="border border-border/80 bg-surface p-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <span className="font-display text-xs uppercase tracking-wider font-bold text-foreground">
            Ajustar Posição
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              title="Desfazer"
              className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              title="Refazer"
              className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Botões Ajustar & Preencher */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={smartFit}
            disabled={!currentLayer}
            className="flex items-center justify-center gap-1.5 border border-border bg-background py-2 font-display text-xs uppercase tracking-wider text-foreground hover:border-cyan hover:text-cyan disabled:opacity-40 transition-colors"
          >
            <Minimize className="h-3.5 w-3.5" />
            <span>Ajustar</span>
          </button>
          <button
            type="button"
            onClick={coverFit}
            disabled={!currentLayer}
            className="flex items-center justify-center gap-1.5 border border-border bg-background py-2 font-display text-xs uppercase tracking-wider text-foreground hover:border-cyan hover:text-cyan disabled:opacity-40 transition-colors"
          >
            <Maximize className="h-3.5 w-3.5" />
            <span>Preencher</span>
          </button>
        </div>

        {/* Centrar H / V */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => alignSelected("horizontal")}
            disabled={!currentLayer}
            className="border border-border bg-background py-2 font-display text-xs uppercase tracking-wider text-foreground hover:border-cyan hover:text-cyan disabled:opacity-40 transition-colors"
          >
            Centrar H
          </button>
          <button
            type="button"
            onClick={() => alignSelected("vertical")}
            disabled={!currentLayer}
            className="border border-border bg-background py-2 font-display text-xs uppercase tracking-wider text-foreground hover:border-cyan hover:text-cyan disabled:opacity-40 transition-colors"
          >
            Centrar V
          </button>
        </div>

        {/* Escala */}
        <div className="mt-4 border-t border-border/60 pt-3">
          <span className="block font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
            Escala / Tamanho
          </span>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScaleChange(-0.15)}
              disabled={!currentLayer}
              className="flex-1 border border-border bg-background py-2 font-display text-xs uppercase tracking-wider text-foreground hover:border-cyan hover:text-cyan disabled:opacity-40 transition-colors"
            >
              − Diminuir
            </button>
            <button
              type="button"
              onClick={() => handleScaleChange(0.15)}
              disabled={!currentLayer}
              className="flex-1 border border-border bg-background py-2 font-display text-xs uppercase tracking-wider text-foreground hover:border-cyan hover:text-cyan disabled:opacity-40 transition-colors"
            >
              + Aumentar
            </button>
          </div>
        </div>

        {/* Rotação */}
        <div className="mt-4 border-t border-border/60 pt-3">
          <span className="block font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
            Rotação
          </span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => rotateSelected(-15)}
              disabled={!currentLayer}
              className="border border-border bg-background py-2 font-mono text-xs uppercase text-foreground hover:border-cyan hover:text-cyan disabled:opacity-40 transition-colors"
            >
              -15°
            </button>
            <button
              type="button"
              onClick={() => {
                if (currentLayer) updateLayer(currentLayer.id, { rotation: 0 });
              }}
              disabled={!currentLayer}
              className="border border-border bg-background py-2 font-mono text-xs uppercase text-foreground hover:border-cyan hover:text-cyan disabled:opacity-40 transition-colors"
            >
              0°
            </button>
            <button
              type="button"
              onClick={() => rotateSelected(15)}
              disabled={!currentLayer}
              className="border border-border bg-background py-2 font-mono text-xs uppercase text-foreground hover:border-cyan hover:text-cyan disabled:opacity-40 transition-colors"
            >
              +15°
            </button>
          </div>
        </div>

        {/* Copiar para o outro lado */}
        {otherSurface && (
          <div className="mt-4 border-t border-border/60 pt-3">
            <button
              type="button"
              onClick={() => copyDesignToOtherSurface(otherSurface.id)}
              disabled={activeLayers.length === 0}
              className="flex w-full items-center justify-center gap-1.5 border border-magenta/50 bg-magenta/10 py-2 font-display text-xs uppercase tracking-wider text-magenta hover:bg-magenta hover:text-white disabled:opacity-30 transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>{otherSideLabel}</span>
            </button>
          </div>
        )}

        {/* Remover design */}
        {currentLayer && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => deleteLayer(currentLayer.id)}
              className="flex w-full items-center justify-center gap-1.5 border border-red-500/30 bg-red-500/10 py-1.5 font-mono text-xs uppercase tracking-wider text-red-400 hover:bg-red-500 hover:text-white transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              <span>Remover Imagem</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}