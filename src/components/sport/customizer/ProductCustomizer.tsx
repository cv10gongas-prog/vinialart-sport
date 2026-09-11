import { useState, lazy, Suspense } from "react";
import {
  Eye,
  ShoppingBag,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Box,
  Image as ImageIcon,
} from "lucide-react";

import { CanvasEditor } from "./CanvasEditor";
import { CustomizerControlPanel } from "./CustomizerControlPanel";
import { ProductPresentationModal } from "./ProductLivePreview";

const Product3DViewer = lazy(() =>
  import("./Product3DViewer").then((mod) => ({ default: mod.Product3DViewer }))
);

import { useProductCustomizer } from "@/hooks/useProductCustomizer";
import { useCart } from "@/lib/cart/store";
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
  } = customizer;

  const { addItem, updateItem } = useCart();

  const [savedToCart, setSavedToCart] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [viewDimension, setViewDimension] = useState<"2D" | "3D">("2D");

  // Real 3D support is only enabled where solid: Caneleiras and Bandeira
  const supports3D =
    config.id === "caneleiras-personalizadas" ||
    config.id === "bandeira-personalizada";

  function handleAddToCart() {
    const previewDataUrl = exportCustomerPreview() ?? undefined;

    let customizerDesign = serializeDesign();
    try {
      customizerDesign = JSON.stringify({
        ...JSON.parse(customizerDesign),
        productionSpec: customizer.buildProductionSpec(),
      });
    } catch {
      // fallback to plain design
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
    }, 3000);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* 1. TÍTULO DO PRODUTO & CONTROLO DE VISTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-cyan font-bold">
            Personalização Online
          </span>
          <h1 className="mt-1 font-display text-2xl sm:text-4xl font-black uppercase text-foreground">
            {config.name}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tabs de Superfície: [ CANELEIRA ESQUERDA ] [ CANELEIRA DIREITA ] ou [ FRENTE ] [ COSTAS ] */}
          {config.surfaces.length > 1 && (
            <div className="flex items-center gap-1.5 bg-surface p-1 border border-border">
              {config.surfaces.map((surface) => {
                const active = state.activeSurfaceId === surface.id;
                return (
                  <button
                    key={surface.id}
                    type="button"
                    onClick={() => setSurface(surface.id)}
                    className={cn(
                      "px-4 py-1.5 font-display text-xs uppercase tracking-wider font-bold transition-all",
                      active
                        ? "bg-cyan text-black shadow-glow-cyan"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {surface.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Toggle 2D / 3D: apenas visível se 3D verdadeiro estiver disponível */}
          {supports3D && (
            <div className="flex items-center gap-1 bg-surface p-1 border border-border">
              <button
                type="button"
                onClick={() => setViewDimension("2D")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 font-display text-xs uppercase tracking-wider font-bold transition-all",
                  viewDimension === "2D"
                    ? "bg-white text-black"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>2D</span>
              </button>
              <button
                type="button"
                onClick={() => setViewDimension("3D")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 font-display text-xs uppercase tracking-wider font-bold transition-all",
                  viewDimension === "3D"
                    ? "bg-cyan text-black shadow-glow-cyan"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Box className="h-3.5 w-3.5" />
                <span>3D</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. NOVO LAYOUT PREMIUM (70% PRODUTO / 30% CONTROLOS):
             ESQUERDA: PRODUTO GRANDE COM ARTE APLICADA (2D ou 3D INTERATIVO)
             DIREITA: PAINEL DE CONTROLO COMERCIAL LIMPO
      */}
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* COLUNA: O PRODUTO É O PREVIEW PRINCIPAL */}
        <div className="order-1 lg:order-1 relative overflow-hidden border border-border/80 bg-[#06080b] p-2 sm:p-6 flex flex-col items-center justify-center min-h-[480px]">
          {/* Subtitle discreto */}
          <div className="mb-2 flex w-full items-center justify-between font-mono text-[0.68rem] text-muted-foreground">
            <span className="uppercase tracking-wider text-cyan font-semibold">
              {activeSurface.label}
            </span>
            <span className="hidden sm:inline">
              {viewDimension === "3D" ? "Arrasta para rodar em 3D" : "Arrasta para mover · Clica e ajusta"}
            </span>
          </div>

          {/* O PRODUTO EM 2D (Konva) OU EM 3D (Three.js PBR) */}
          {supports3D && (
            <div
              className={cn(
                "relative h-[540px] w-full items-center justify-center",
                viewDimension === "3D" ? "flex" : "hidden",
              )}
            >
              <Suspense
                fallback={
                  <div className="flex h-full w-full items-center justify-center text-xs font-mono text-muted-foreground uppercase">
                    A inicializar estúdio 3D…
                  </div>
                }
              >
                <Product3DViewer
                  config={config}
                  customizer={customizer}
                  className="h-full w-full"
                  onFallbackTo2D={() => setViewDimension("2D")}
                />
              </Suspense>
            </div>
          )}

          <div
            className={cn(
              "relative flex w-full items-center justify-center",
              viewDimension === "3D" && supports3D && "hidden",
            )}
            style={{
              aspectRatio: `${config.canvasWidth} / ${config.canvasHeight}`,
              maxHeight: "min(75vh, 660px)",
            }}
          >
            <CanvasEditor config={config} customizer={customizer} />
          </div>
        </div>

        {/* COLUNA: PAINEL DE CONTROLO + CTAS */}
        <div className="order-2 lg:order-2 flex flex-col gap-5">
          <CustomizerControlPanel customizer={customizer} />

          {/* AÇÕES FINAIS: VER RESULTADO + ADICIONAR AO PEDIDO */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setIsPresentationOpen(true)}
              className="flex h-12 w-full items-center justify-center gap-2 border border-magenta bg-magenta/10 font-display text-xs uppercase tracking-wider text-magenta font-bold hover:bg-magenta hover:text-white transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>Ver Resultado Final</span>
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className={cn(
                "flex h-14 w-full items-center justify-center gap-2 font-display text-sm uppercase tracking-wider font-bold transition-all shadow-lg",
                savedToCart
                  ? "bg-green-600 text-white"
                  : "bg-cyan text-black hover:bg-cyan/90 shadow-glow-cyan",
              )}
            >
              {savedToCart ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>{cartItemId ? "Alterações Guardadas" : "Guardado no Pedido"}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  <span>{cartItemId ? "Guardar Alterações" : "Adicionar ao Pedido"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Apresentação / Preview Final Limpo */}
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