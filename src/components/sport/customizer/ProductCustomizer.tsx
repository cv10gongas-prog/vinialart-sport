import { useState } from "react";
import { Eye, ShoppingBag, Check } from "lucide-react";

import { CanvasEditor } from "./CanvasEditor";
import { CustomizerControlPanel } from "./CustomizerControlPanel";
import { ProductPresentationModal } from "./ProductLivePreview";

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

/**
 * Product-first customizer: the product takes ~75% of the screen and the
 * commercial rail stays quiet on the right. 3D is intentionally not exposed.
 */
export function ProductCustomizer({
  config,
  className,
  initialDesignJson,
  cartItemId,
}: ProductCustomizerProps) {
  const customizer = useProductCustomizer(config, { initialDesignJson });

  const { state, setSurface, exportCustomerPreview, serializeDesign } = customizer;

  const { addItem, updateItem } = useCart();

  const [savedToCart, setSavedToCart] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

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
      updateItem(cartItemId, { customizerDesign, previewDataUrl });
    } else {
      addItem(config.id, config.name, {
        quantity: 1,
        customizerDesign,
        previewDataUrl,
      });
    }

    setSavedToCart(true);
    window.setTimeout(() => setSavedToCart(false), 3000);
  }

  return (
    <div className={cn("customizer-shell flex flex-col gap-8", className)}>
      {/* TÍTULO + SUPERFÍCIES */}
      <div className="customizer-heading flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="label-eyebrow">Personalização</span>
          <h1 className="mt-3 text-[2rem] leading-[0.95] sm:text-5xl">{config.name}</h1>
        </div>
      </div>

      {/* PRODUTO GRANDE + RAIL DE CONTROLOS */}
      <div className="customizer-layout">
        <div className="customizer-product">
          <div className="customizer-product-frame">
            <CanvasEditor config={config} customizer={customizer} />
          </div>
          {config.surfaces.length > 1 && (
            <div role="tablist" aria-label="Lados do produto" className="customizer-tabs">
              {config.surfaces.map((surface) => {
                const active = state.activeSurfaceId === surface.id;
                return (
                  <button
                    key={surface.id}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => setSurface(surface.id)}
                    className={cn(
                      "rounded-full px-5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-all duration-300",
                      active
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {surface.id === "LEFT"
                      ? "Esquerda"
                      : surface.id === "RIGHT"
                        ? "Direita"
                        : surface.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="customizer-controls flex flex-col gap-6 lg:sticky lg:top-28">
          <CustomizerControlPanel customizer={customizer} />

          <div className="flex flex-col gap-3 border-t border-border pt-8">
            <button
              type="button"
              onClick={() => setIsPresentationOpen(true)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-foreground/40 hover:bg-foreground/5"
            >
              <Eye className="h-4 w-4" />
              <span>Ver resultado</span>
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className={cn(
                "flex h-14 w-full items-center justify-center gap-2 rounded-full text-[0.74rem] font-semibold uppercase tracking-[0.2em] transition-all",
                savedToCart
                  ? "bg-cyan text-accent-foreground"
                  : "bg-magenta text-primary-foreground hover:shadow-glow-magenta hover:brightness-110",
              )}
            >
              {savedToCart ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>{cartItemId ? "Alterações guardadas" : "Guardado"}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  <span>{cartItemId ? "Guardar alterações" : "Adicionar ao pedido"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

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
