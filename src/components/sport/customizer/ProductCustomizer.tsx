import { useState } from "react";
import {
  CheckCircle,
  Eye,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";

import { CanvasEditor } from "./CanvasEditor";
import { CustomizerToolbar } from "./CustomizerToolbar";
import { ProductLivePreview, ProductPresentationModal } from "./ProductLivePreview";

import { useProductCustomizer } from "@/hooks/useProductCustomizer";
import { useCart } from "@/lib/cart/store";
import { SportButton } from "@/components/sport/SportButton";
import { cn } from "@/lib/utils";

import type { ProductCustomizerConfig } from "@/lib/customizer/types";

interface ProductCustomizerProps {
  config: ProductCustomizerConfig;
  className?: string | undefined;
  initialDesignJson?: string | undefined;
  cartItemId?: string | undefined;
}

export function ProductCustomizer({
  config,
  className,
  initialDesignJson,
  cartItemId,
}: ProductCustomizerProps) {
  const customizer = useProductCustomizer(config, {
    initialDesignJson,
  });

  const {
    state,
    setSurface,
    activeSurface,
    exportCustomerPreview,
    serializeDesign,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
  } = customizer;

  const { addItem, updateItem } = useCart();

  const [savedToCart, setSavedToCart] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  function handleAddToCart() {
    const previewDataUrl = exportCustomerPreview() ?? undefined;

    // Design payload + production spec (exact placement data for print/WooCommerce)
    let customizerDesign = serializeDesign();

    try {
      customizerDesign = JSON.stringify({
        ...JSON.parse(customizerDesign),
        productionSpec: customizer.buildProductionSpec(),
      });
    } catch {
      // keep the plain design payload if merging fails
    }

    if (cartItemId) {
      updateItem(cartItemId, {
        customizerDesign,
        previewDataUrl,
      });
    } else {
      addItem(config.id, config.name, {
        quantity: 1,
        customizerDesign,
        previewDataUrl,
      });
    }

    setSavedToCart(true);

    window.setTimeout(() => {
      setSavedToCart(false);
    }, 2500);
  }

  const zoomPercent = Math.round((zoom ?? 1) * 100);

  return (
    <div
      className={cn(
        "card-sport p-4 hover:!translate-y-0 sm:p-6",
        className,
      )}
    >
      {/* Top Header Bar: Product Title + Presentation Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-cyan">
              VinilArt Sport Studio
            </span>
            <span className="font-mono text-[0.58rem] text-muted-foreground">
              • Preço sob consulta
            </span>
          </div>

          <h1 className="mt-1 font-display text-xl sm:text-2xl">
            {config.name}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPresentationOpen(true)}
            className="flex items-center gap-1.5 border border-magenta/60 bg-magenta/10 px-3.5 py-2 font-display text-xs uppercase tracking-wider text-magenta hover:bg-magenta hover:text-white transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Ver Resultado</span>
          </button>
        </div>
      </div>

      {/* Surface Switcher Tabs: Caneleira Esquerda | Caneleira Direita OR Frente | Costas */}
      <div
        className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3"
        role="tablist"
        aria-label="Áreas de personalização"
      >
        <div className="flex flex-wrap gap-2">
          {config.surfaces.map((surface, index) => {
            const active = state.activeSurfaceId === surface.id;
            const activeColorClass =
              index === 0
                ? "bg-magenta text-white"
                : index === 1
                  ? "bg-cyan text-black"
                  : "bg-yellow text-black";

            return (
              <button
                key={surface.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSurface(surface.id)}
                className={cn(
                  "border px-4 py-2 font-display text-[0.65rem] uppercase tracking-wider transition-all",
                  active
                    ? activeColorClass + " border-transparent shadow-sm"
                    : "border-border bg-surface text-muted-foreground hover:border-cyan hover:text-foreground",
                )}
              >
                {surface.label}
              </button>
            );
          })}
        </div>

        {/* Zoom Controls for Design Canvas */}
        <div className="flex items-center gap-1 border border-border/80 bg-surface px-2 py-1">
          <span className="mr-1 font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
            Zoom
          </span>
          <button
            type="button"
            onClick={zoomOut}
            aria-label="Diminuir zoom"
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>

          <button
            type="button"
            onClick={resetZoom}
            title="Repor zoom 100%"
            className="min-w-10 font-mono text-[0.6rem] text-cyan hover:underline"
          >
            {zoomPercent}%
          </button>

          <button
            type="button"
            onClick={zoomIn}
            aria-label="Aumentar zoom"
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>

          <button
            type="button"
            onClick={resetZoom}
            title="Repor zoom inicial"
            aria-label="Repor zoom"
            className="ml-1 border-l border-border/60 pl-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      {/* Main Studio Workspace: 2 Columns on Desktop */}
      {/* Left (65-70%): Big Design Canvas. Right (30-35%): Live Preview + Tools + CTA */}
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1.4fr)_360px]">
        {/* LEFT: Big Design Workspace Canvas */}
        <div className="flex min-w-0 flex-col lg:sticky lg:top-24">
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDraggingFile(true);
            }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDraggingFile(false);

              if (event.dataTransfer.files.length > 0) {
                customizer.addImagesFromFiles(
                  event.dataTransfer.files,
                );
              }
            }}
            className={cn(
              "relative flex min-w-0 flex-1 flex-col overflow-hidden border bg-black/95 shadow-inner transition-colors",
              isDraggingFile
                ? "border-magenta"
                : "border-border",
            )}
          >
            {/* Top Workspace Header */}
            <div className="flex items-center justify-between border-b border-border/60 bg-surface/80 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan" />
                <span className="font-display text-[0.65rem] uppercase tracking-widest text-foreground">
                  Área de Design // {activeSurface.label}
                </span>
              </div>
              <span className="hidden font-mono text-[0.55rem] uppercase tracking-wider text-muted-foreground sm:inline">
                Arrasta imagens para aqui · setas movem · Del apaga
              </span>
            </div>

            {/* Design Canvas Viewport */}
            <div className="relative flex w-full min-w-0 items-center justify-center p-2 sm:p-3">
              {/* Stage keeps the product proportions so there is no dead space */}
              <div
                className="relative mx-auto w-full min-w-0"
                style={{
                  aspectRatio: `${config.canvasWidth} / ${config.canvasHeight}`,
                  maxHeight: "min(66vh, 620px)",
                  maxWidth: `calc(min(66vh, 620px) * ${config.canvasWidth / config.canvasHeight})`,
                }}
              >
                <CanvasEditor config={config} customizer={customizer} />
              </div>

              {isDraggingFile && (
                <div className="pointer-events-none absolute inset-2 flex items-center justify-center border-2 border-dashed border-magenta bg-magenta/10">
                  <span className="font-display text-xs uppercase tracking-widest text-magenta">
                    Larga a imagem para adicionar
                  </span>
                </div>
              )}
            </div>

            {/* Quick gizmo actions for the selected artwork */}
            <div
              className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] px-3 py-2"
              style={{ background: "#121214" }}
            >
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  disabled={!customizer.selectedLayer}
                  onClick={() => customizer.alignSelected("horizontal")}
                  className="border border-white/10 px-2.5 py-1.5 font-mono text-[0.56rem] uppercase tracking-wider text-muted-foreground transition-colors hover:border-cyan hover:text-cyan disabled:opacity-30"
                >
                  Centrar H
                </button>

                <button
                  type="button"
                  disabled={!customizer.selectedLayer}
                  onClick={() => customizer.alignSelected("vertical")}
                  className="border border-white/10 px-2.5 py-1.5 font-mono text-[0.56rem] uppercase tracking-wider text-muted-foreground transition-colors hover:border-cyan hover:text-cyan disabled:opacity-30"
                >
                  Centrar V
                </button>

                <button
                  type="button"
                  disabled={!customizer.selectedLayer}
                  onClick={() => {
                    if (customizer.selectedLayer) {
                      customizer.deleteLayer(customizer.selectedLayer.id);
                    }
                  }}
                  className="border border-white/10 px-2.5 py-1.5 font-mono text-[0.56rem] uppercase tracking-wider text-muted-foreground transition-colors hover:border-destructive hover:text-destructive disabled:opacity-30"
                >
                  Limpar camada
                </button>
              </div>

              <span className="font-mono text-[0.55rem] uppercase tracking-widest text-muted-foreground">
                {activeSurface.label}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Live Preview (Top) + Tooling & Layers (Middle) + Action (Bottom) */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* 1. Live 2.5D Mockup Preview */}
          <ProductLivePreview
            config={config}
            customizer={customizer}
            onOpenPresentation={() => setIsPresentationOpen(true)}
          />

          {/* 2. Simplified Tools & Layer Management */}
          <div
            className="rounded-md border border-white/[0.07] p-4"
            style={{ background: "#1a1a1e" }}
          >
            <CustomizerToolbar customizer={customizer} />
          </div>

          {/* 3. Primary CTA: Add to Order / Update */}
          <div className="mt-1">
            <SportButton
              size="lg"
              onClick={handleAddToCart}
              className={cn(
                "w-full justify-center shadow-lg",
                savedToCart && "border-green-500 bg-green-500/15 text-green-400",
              )}
            >
              {savedToCart ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    {cartItemId ? "Personalização atualizada" : "Guardado no pedido"}
                  </span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>
                    {cartItemId ? "Guardar alterações" : "Adicionar ao pedido"}
                  </span>
                </>
              )}
            </SportButton>
          </div>
        </div>
      </div>

      {/* Presentation Preview Modal */}
      <ProductPresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        config={config}
        customizer={customizer}
        onAddToCart={handleAddToCart}
        cartItemId={cartItemId}
      />
    </div>
  );
}
