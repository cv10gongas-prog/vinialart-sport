import { useState } from "react";
import { CanvasEditor } from "./CanvasEditor";
import { CustomizerToolbar } from "./CustomizerToolbar";
import { useProductCustomizer } from "@/hooks/useProductCustomizer";
import { useCart } from "@/lib/cart/store";
import { SportButton } from "@/components/sport/SportButton";
import { ShoppingBag, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductCustomizerConfig } from "@/lib/customizer/types";

interface ProductCustomizerProps {
  config: ProductCustomizerConfig;
  className?: string;
  initialDesignJson?: string | undefined;
  cartItemId?: string | undefined;
}

export function ProductCustomizer({
  config,
  className,
  initialDesignJson,
  cartItemId,
}: ProductCustomizerProps) {
  const customizer = useProductCustomizer(config, { initialDesignJson });
  const { state, setSurface, activeSurface, exportCustomerPreview, serializeDesign } = customizer;
  const { addItem, updateItem } = useCart();
  const [added, setAdded] = useState(false);

  const layerCount = state.surfaces[state.activeSurfaceId]?.layers.length ?? 0;

  function handleAddToCart() {
    const previewUrl = exportCustomerPreview() ?? undefined;
    const serialized = serializeDesign();

    if (cartItemId) {
      // Editing existing cart item
      updateItem(cartItemId, {
        customizerDesign: serialized,
        previewDataUrl: previewUrl,
      });
    } else {
      // Adding new customized item
      addItem(config.id, config.name, {
        quantity: 1,
        customizerDesign: serialized,
        previewDataUrl: previewUrl,
      });
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className={cn("card-sport hover:!translate-y-0 p-4 sm:p-6", className)}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="font-display text-sm">{config.name}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Editar vs Pré-visualizar */}
          <div className="flex items-center rounded border border-border bg-surface p-0.5">
            <button
              type="button"
              aria-pressed={customizer.viewMode === "edit"}
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
              aria-pressed={customizer.viewMode === "preview"}
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
        </div>
      </div>

      {/* Surface Tabs */}
      <div className="mt-4 flex gap-2 border-b border-border/80 pb-1" role="tablist" aria-label="Lados do produto">
        {config.surfaces.map((surface) => {
          const isActive = state.activeSurfaceId === surface.id;
          const isLeft = surface.id === "left";
          return (
            <button
              key={surface.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setSurface(surface.id)}
              className={cn(
                "flex items-center gap-2 rounded-t px-4 py-2 font-display text-xs uppercase tracking-wider transition-all",
                isActive
                  ? isLeft
                    ? "bg-magenta text-white shadow-glow-magenta"
                    : "bg-cyan text-black shadow-glow-cyan"
                  : "border border-border/60 bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", isActive ? (isLeft ? "bg-white" : "bg-black") : "bg-muted-foreground/50")} />
              {surface.label}
            </button>
          );
        })}
      </div>

      {/* Status bar & Viewport Zoom Controls */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[0.6rem] font-mono uppercase tracking-widest text-muted-foreground/70">
        <div className="flex items-center gap-3">
          {state.undoStack.length > 0 && (
            <span aria-live="polite">
              {state.undoStack.length} {state.undoStack.length === 1 ? "acção" : "acções"}
            </span>
          )}
          <span aria-live="polite">{layerCount} {layerCount === 1 ? "elemento" : "elementos"}</span>
        </div>

        {/* Viewport Zoom Controls */}
        <div className="flex items-center gap-1" role="group" aria-label="Zoom do editor">
          <button
            type="button"
            onClick={customizer.zoomOut}
            aria-label="Diminuir zoom"
            className="flex h-6 w-6 items-center justify-center border border-border bg-surface text-xs hover:border-cyan hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            <span aria-hidden="true">−</span>
          </button>
          <button
            type="button"
            onClick={customizer.resetZoom}
            aria-label={`Zoom atual: ${Math.round(customizer.zoom * 100)}%. Clica para repor.`}
            className="px-2 py-0.5 border border-border bg-surface text-[0.6rem] font-mono hover:border-cyan hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            {Math.round(customizer.zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={customizer.zoomIn}
            aria-label="Aumentar zoom"
            className="flex h-6 w-6 items-center justify-center border border-border bg-surface text-xs hover:border-cyan hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>

      {/* Main layout: canvas + toolbar */}
      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
        {/* Canvas wrapper */}
        <div className="relative mx-auto w-full max-w-[480px] min-w-0 lg:mx-0">
          <div className="relative w-full min-w-0 overflow-hidden rounded-sm border border-border/80 bg-black/90 p-1 shadow-card">
            <CanvasEditor config={config} customizer={customizer} />

            {/* Corner technical crosshairs */}
            <div className="pointer-events-none absolute inset-2 border border-white/5" />
            <span className="pointer-events-none absolute right-3 top-3 font-mono text-[0.55rem] text-muted-foreground/50">
              HUD // 100% SCALE
            </span>
          </div>

          {/* Overlay label */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 pointer-events-none" aria-hidden="true">
            <span className="skew-tag border border-cyan/40 bg-black/90 px-2.5 py-1 font-mono text-[0.6rem] text-cyan backdrop-blur-sm">
              LADO ATIVO: {activeSurface.label.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4">
          <CustomizerToolbar customizer={customizer} />

          {/* Dedicated Primary CTA: Add / Update in Cart */}
          <div className="border-t border-border pt-4">
            <SportButton
              size="lg"
              onClick={handleAddToCart}
              className={cn(
                "w-full justify-center gap-2",
                added && "border-green-500 bg-green-500/10 text-green-400",
              )}
            >
              {added ? (
                <>
                  <CheckCircle className="h-4 w-4" aria-hidden="true" />
                  {cartItemId ? "Personalização atualizada!" : "Adicionado ao carrinho!"}
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  {cartItemId ? "Guardar no carrinho" : "Adicionar ao carrinho"}
                </>
              )}
            </SportButton>
          </div>
        </div>
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
