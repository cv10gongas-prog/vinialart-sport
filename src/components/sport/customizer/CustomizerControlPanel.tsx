import { useRef } from "react";
import {
  Upload,
  Maximize,
  Minimize,
  Copy,
  Trash2,
  Undo2,
  Redo2,
  AlignCenterVertical,
} from "lucide-react";
import type { ProductCustomizerHandle } from "@/hooks/useProductCustomizer";
import { cn } from "@/lib/utils";

interface CustomizerControlPanelProps {
  customizer: ProductCustomizerHandle;
  className?: string | undefined;
}

const chip =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border bg-transparent px-4 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-foreground/40 hover:bg-foreground/5 disabled:opacity-35 disabled:hover:bg-transparent";

/**
 * Minimal, commercial control rail: upload, fit, sliders, duplicate, remove.
 * No technical vocabulary and no boxed-in software panels.
 */
export function CustomizerControlPanel({ customizer, className }: CustomizerControlPanelProps) {
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
    copyDesignToOtherSurface,
    deleteLayer,
    addImagesFromFiles,
    updateLayer,
  } = customizer;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isShinGuard = state.activeSurfaceId === "LEFT" || state.activeSurfaceId === "RIGHT";

  const otherSideLabel = isShinGuard
    ? state.activeSurfaceId === "LEFT"
      ? "Copiar para a direita"
      : "Copiar para a esquerda"
    : "Copiar para o outro lado";

  const otherSurface = config.surfaces.find((s) => s.id !== state.activeSurfaceId);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      addImagesFromFiles(e.target.files);
      e.target.value = "";
    }
  }

  const currentLayer = selectedLayer;

  const scale = currentLayer?.scaleX ?? 1;
  const rotation = currentLayer?.rotation ?? 0;

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* CARREGAR DESIGN */}
      <div>
        <p className="label-eyebrow">Tenho o design pronto</p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          id="customizer-file-input"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="customizer-upload mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-background transition-all hover:bg-foreground/90"
        >
          <Upload className="h-4 w-4" />
          <span>Carregar design</span>
        </button>

        <p className="mt-3 text-xs text-muted-foreground">
          PNG, JPG ou WEBP. Seleciona o design no produto para o ajustar.
        </p>
      </div>

      {/* AJUSTE */}
      <div className="border-t border-border pt-8">
        <div className="flex items-center justify-between">
          <p className="label-eyebrow">Ajuste</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              aria-label="Desfazer"
              className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground disabled:opacity-30"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              aria-label="Refazer"
              className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground disabled:opacity-30"
            >
              <Redo2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={smartFit} disabled={!currentLayer} className={chip}>
            <Minimize className="h-3.5 w-3.5" />
            Ajustar
          </button>
          <button type="button" onClick={coverFit} disabled={!currentLayer} className={chip}>
            <Maximize className="h-3.5 w-3.5" />
            Preencher
          </button>
          <button
            type="button"
            onClick={() => alignSelected("both")}
            disabled={!currentLayer}
            aria-label="Centrar"
            className={chip}
          >
            <AlignCenterVertical className="h-3.5 w-3.5" />
            Centrar
          </button>
        </div>
      </div>

      {/* TAMANHO */}
      <div className="border-t border-border pt-8">
        <div className="flex items-baseline justify-between">
          <label htmlFor="size-slider" className="label-eyebrow">
            Escala
          </label>
          <span className="text-xs text-muted-foreground">{Math.round(scale * 100)}%</span>
        </div>
        <input
          id="size-slider"
          type="range"
          min={0.2}
          max={3}
          step={0.02}
          value={scale}
          disabled={!currentLayer}
          onChange={(event) => {
            if (!currentLayer) return;
            const value = Number(event.target.value);
            updateLayer(currentLayer.id, { scaleX: value, scaleY: value });
          }}
          className="mt-4 h-1 w-full cursor-pointer appearance-none rounded-full bg-input accent-cyan disabled:opacity-40"
        />
      </div>

      {/* ROTAÇÃO */}
      <div className="border-t border-border pt-8">
        <div className="flex items-baseline justify-between">
          <label htmlFor="rotation-slider" className="label-eyebrow">
            Rotação
          </label>
          <span className="text-xs text-muted-foreground">{Math.round(rotation)}°</span>
        </div>
        <input
          id="rotation-slider"
          type="range"
          min={-180}
          max={180}
          step={1}
          value={rotation}
          disabled={!currentLayer}
          onChange={(event) => {
            if (!currentLayer) return;
            updateLayer(currentLayer.id, {
              rotation: Number(event.target.value),
            });
          }}
          className="mt-4 h-1 w-full cursor-pointer appearance-none rounded-full bg-input accent-cyan disabled:opacity-40"
        />
      </div>

      {/* AÇÕES SECUNDÁRIAS */}
      {(otherSurface || currentLayer) && (
        <div className="flex flex-wrap gap-2 border-t border-border pt-8">
          {otherSurface && (
            <button
              type="button"
              onClick={() => copyDesignToOtherSurface(otherSurface.id)}
              disabled={activeLayers.length === 0}
              className={chip}
            >
              <Copy className="h-3.5 w-3.5" />
              {otherSideLabel}
            </button>
          )}

          {currentLayer && (
            <button
              type="button"
              onClick={() => deleteLayer(currentLayer.id)}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remover
            </button>
          )}
        </div>
      )}
    </div>
  );
}
