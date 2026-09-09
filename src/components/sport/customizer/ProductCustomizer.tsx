/**
 * VinilArt Sport — Product Customizer (main composed component)
 *
 * Assembles:
 *   - Surface switcher (LEFT / RIGHT tabs)
 *   - CanvasEditor (Konva stage, SSR-safe)
 *   - CustomizerToolbar (right panel)
 *
 * This is the drop-in replacement for EditorMock.
 */

import { cn } from "@/lib/utils";
import { useProductCustomizer } from "@/hooks/useProductCustomizer";
import type { ProductCustomizerConfig } from "@/lib/customizer/types";
import { CanvasEditor } from "./CanvasEditor";
import { CustomizerToolbar } from "./CustomizerToolbar";

interface ProductCustomizerProps {
  config: ProductCustomizerConfig;
  className?: string;
}

export function ProductCustomizer({ config, className }: ProductCustomizerProps) {
  const customizer = useProductCustomizer(config);
  const { state, setSurface, activeSurface } = customizer;

  const layerCount = state.surfaces[state.activeSurfaceId]?.layers.length ?? 0;

  return (
    <div className={cn("card-sport hover:!translate-y-0 p-4 sm:p-6", className)}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="font-display text-sm">{config.name}</p>
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
            Personalizador — V2.0
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Editar vs Pré-visualizar */}
          <div className="flex items-center rounded border border-border bg-surface p-0.5">
            <button
              type="button"
              onClick={() => customizer.setViewMode("edit")}
              className={cn(
                "px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider transition-colors",
                customizer.viewMode === "edit"
                  ? "bg-cyan text-black"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => customizer.setViewMode("preview")}
              className={cn(
                "px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider transition-colors",
                customizer.viewMode === "preview"
                  ? "bg-magenta text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Pré-visualizar
            </button>
          </div>
          <span className="skew-tag border border-cyan px-2 py-1 font-display text-[0.55rem] text-cyan">
            Mockup Realista
          </span>
        </div>
      </div>

      {/* Surface Tabs */}
      <div className="mt-4 flex gap-1 border-b border-border">
        {config.surfaces.map((surface) => (
          <button
            key={surface.id}
            onClick={() => setSurface(surface.id)}
            className={cn(
              "-mb-px border-b-2 px-4 pb-2.5 pt-1.5 font-display text-[0.65rem] uppercase tracking-[0.14em] transition-colors",
              state.activeSurfaceId === surface.id
                ? "border-magenta text-foreground"
                : "border-transparent text-muted-foreground hover:text-cyan",
            )}
          >
            {surface.label}
          </button>
        ))}
      </div>

      {/* Status bar & Viewport Zoom Controls */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[0.6rem] uppercase tracking-widest text-muted-foreground/60">
        <div className="flex items-center gap-3">
          <span>{state.undoStack.length} acções</span>
          {state.redoStack.length > 0 && (
            <span>{state.redoStack.length} refazer</span>
          )}
          <span>{layerCount} {layerCount === 1 ? "elemento" : "elementos"}</span>
        </div>

        {/* Viewport Zoom Controls */}
        <div className="flex items-center gap-1">
          <span className="text-[0.6rem] text-muted-foreground/60 mr-1">Zoom:</span>
          <button
            type="button"
            onClick={customizer.zoomOut}
            title="Diminuir zoom"
            aria-label="Diminuir zoom"
            className="flex h-5 w-5 items-center justify-center border border-border bg-surface text-xs hover:border-cyan hover:text-cyan"
          >
            -
          </button>
          <button
            type="button"
            onClick={customizer.resetZoom}
            title="Repor zoom a 100%"
            aria-label="Repor zoom"
            className="px-1.5 py-0.5 border border-border bg-surface text-[0.6rem] font-mono hover:border-cyan hover:text-cyan"
          >
            {Math.round(customizer.zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={customizer.zoomIn}
            title="Aumentar zoom"
            aria-label="Aumentar zoom"
            className="flex h-5 w-5 items-center justify-center border border-border bg-surface text-xs hover:border-cyan hover:text-cyan"
          >
            +
          </button>
        </div>
      </div>

      {/* Main layout: canvas + toolbar */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
        {/* Canvas wrapper */}
        <div className="relative mx-auto w-full max-w-[480px] min-w-0 lg:mx-0">
          <div className="w-full min-w-0 overflow-hidden border border-border bg-surface">
            <CanvasEditor config={config} customizer={customizer} />
          </div>

          {/* Overlay labels */}
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-2 pointer-events-none">
            <span className="bg-background/80 px-2 py-1 text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">
              {activeSurface.label}
            </span>
            {customizer.viewMode === "edit" && (
              <span className="bg-background/80 px-2 py-1 text-[0.6rem] uppercase tracking-[0.12em] text-cyan/70">
                Contorno anatómico = área de impressão
              </span>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <CustomizerToolbar customizer={customizer} />
      </div>

      {/* Mockup disclaimer */}
      {config.mockupNote && (
        <p className="mt-4 text-[0.6rem] text-muted-foreground/40">
          ⚠ {config.mockupNote}
        </p>
      )}
    </div>
  );
}
