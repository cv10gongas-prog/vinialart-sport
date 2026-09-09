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
            Personalizador — V1.5
          </p>
        </div>
        <span className="skew-tag border border-cyan px-2 py-1 font-display text-[0.55rem] text-cyan">
          Autosave + Camadas
        </span>
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

      {/* Status bar */}
      <div className="mt-2 flex gap-3 text-[0.6rem] uppercase tracking-widest text-muted-foreground/50">
        <span>{state.undoStack.length} acções no histórico</span>
        {state.redoStack.length > 0 && (
          <span>{state.redoStack.length} para refazer</span>
        )}
        <span>{layerCount} {layerCount === 1 ? "elemento" : "elementos"}</span>
      </div>

      {/* Main layout: canvas + toolbar */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
        {/* Canvas wrapper */}
        <div className="relative mx-auto w-full max-w-[480px] min-w-0 lg:mx-0">
          <div className="w-full min-w-0 overflow-hidden border border-border bg-surface">
            <CanvasEditor config={config} customizer={customizer} />
          </div>

          {/* Overlay labels */}
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-2">
            <span className="bg-background/80 px-2 py-1 text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">
              {activeSurface.label}
            </span>
            <span className="bg-background/80 px-2 py-1 text-[0.6rem] uppercase tracking-[0.12em] text-cyan/70">
              Zona azul = área de impressão
            </span>
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
