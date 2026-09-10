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
      <div className="mt-4 flex gap-1 border-b border-border" role="tablist" aria-label="Lados do produto">
        {config.surfaces.map((surface) => (
          <button
            key={surface.id}
            role="tab"
            aria-selected={state.activeSurfaceId === surface.id}
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
            className="flex h-5 w-5 items-center justify-center border border-border bg-surface text-xs hover:border-cyan hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            <span aria-hidden="true">−</span>
          </button>
          <button
            type="button"
            onClick={customizer.resetZoom}
            aria-label={`Zoom atual: ${Math.round(customizer.zoom * 100)}%. Clica para repor.`}
            className="px-1.5 py-0.5 border border-border bg-surface text-[0.6rem] font-mono hover:border-cyan hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            {Math.round(customizer.zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={customizer.zoomIn}
            aria-label="Aumentar zoom"
            className="flex h-5 w-5 items-center justify-center border border-border bg-surface text-xs hover:border-cyan hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            <span aria-hidden="true">+</span>
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

          {/* Overlay label */}
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-2 pointer-events-none" aria-hidden="true">
            <span className="bg-background/80 px-2 py-1 text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">
              {activeSurface.label}
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
