import { useState } from "react";
import {
  CheckCircle,
  Eye,
  Pencil,
  ShoppingBag,
} from "lucide-react";

import { CanvasEditor } from "./CanvasEditor";
import { CustomizerToolbar } from "./CustomizerToolbar";

import { useProductCustomizer } from "@/hooks/useProductCustomizer";
import { useCart } from "@/lib/cart/store";
import { SportButton } from "@/components/sport/SportButton";
import { cn } from "@/lib/utils";

import type { ProductCustomizerConfig } from "@/lib/customizer/types";

interface ProductCustomizerProps {
  config: ProductCustomizerConfig;
  className?: string;
  initialDesignJson?: string;
  cartItemId?: string;
}

export function ProductCustomizer({
  config,
  className,
  initialDesignJson,
  cartItemId,
}: ProductCustomizerProps) {
  const customizer =
    useProductCustomizer(config, {
      initialDesignJson,
    });

  const {
    state,
    setSurface,
    activeSurface,
    exportCustomerPreview,
    serializeDesign,
  } = customizer;

  const { addItem, updateItem } =
    useCart();

  const [savedToCart, setSavedToCart] =
    useState(false);

  const layerCount =
    state.surfaces[
      state.activeSurfaceId
    ]?.layers.length ?? 0;

  function handleAddToCart() {
    const previewDataUrl =
      exportCustomerPreview() ??
      undefined;

    const customizerDesign =
      serializeDesign();

    if (cartItemId) {
      updateItem(cartItemId, {
        customizerDesign,
        previewDataUrl,
      });
    } else {
      addItem(
        config.id,
        config.name,
        {
          quantity: 1,
          customizerDesign,
          previewDataUrl,
        },
      );
    }

    setSavedToCart(true);

    window.setTimeout(() => {
      setSavedToCart(false);
    }, 2500);
  }

  return (
    <div
      className={cn(
        "card-sport p-4 hover:!translate-y-0 sm:p-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-cyan">
            Personalizador online
          </p>

          <h2 className="mt-1 font-display text-lg">
            {config.name}
          </h2>
        </div>

        <div className="flex border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() =>
              customizer.setViewMode(
                "edit",
              )
            }
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-wider transition-colors",
              customizer.viewMode ===
                "edit"
                ? "bg-cyan text-black"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </button>

          <button
            type="button"
            onClick={() =>
              customizer.setViewMode(
                "preview",
              )
            }
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-wider transition-colors",
              customizer.viewMode ===
                "preview"
                ? "bg-magenta text-white"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            Pré-visualizar
          </button>
        </div>
      </div>

      <div
        className="mt-5 flex flex-wrap gap-2 border-b border-border/80 pb-3"
        role="tablist"
        aria-label="Áreas do produto"
      >
        {config.surfaces.map(
          (surface, index) => {
            const active =
              state.activeSurfaceId ===
              surface.id;

            const activeClass =
              index % 3 === 0
                ? "bg-magenta text-white"
                : index % 3 === 1
                  ? "bg-cyan text-black"
                  : "bg-yellow text-black";

            return (
              <button
                key={surface.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() =>
                  setSurface(surface.id)
                }
                className={cn(
                  "border px-4 py-2 font-display text-[0.65rem] uppercase tracking-wider transition-all",
                  active
                    ? `${activeClass} border-transparent`
                    : "border-border bg-surface text-muted-foreground hover:border-cyan hover:text-foreground",
                )}
              >
                {surface.label}
              </button>
            );
          },
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
        <span>
          {layerCount}{" "}
          {layerCount === 1
            ? "elemento"
            : "elementos"}
        </span>

        <span>
          {customizer.viewMode ===
          "preview"
            ? "PREVIEW LIMPO"
            : "MODO DE EDIÇÃO"}
        </span>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="mx-auto w-full max-w-[560px] min-w-0 lg:mx-0">
          <div
            className={cn(
              "relative overflow-hidden border bg-black p-1 transition-colors",
              customizer.viewMode ===
                "preview"
                ? "border-magenta/60 shadow-glow-magenta"
                : "border-border",
            )}
          >
            <CanvasEditor
              config={config}
              customizer={customizer}
            />
          </div>

          <div className="mt-2 flex items-center justify-between font-mono text-[0.58rem] uppercase tracking-widest text-muted-foreground">
            <span>
              {activeSurface.label}
            </span>

            <span>
              Zoom{" "}
              {Math.round(
                customizer.zoom * 100,
              )}
              %
            </span>
          </div>
        </div>

        {customizer.viewMode ===
        "edit" ? (
          <div className="flex flex-col gap-4">
            <CustomizerToolbar
              customizer={customizer}
            />

            <div className="border-t border-border pt-4">
              <SportButton
                size="lg"
                onClick={handleAddToCart}
                className={cn(
                  "w-full justify-center",
                  savedToCart &&
                    "border-green-500 bg-green-500/10 text-green-400",
                )}
              >
                {savedToCart ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    {cartItemId
                      ? "Personalização atualizada"
                      : "Guardado no carrinho"}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    {cartItemId
                      ? "Guardar alterações"
                      : "Adicionar ao carrinho"}
                  </>
                )}
              </SportButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-between border border-magenta/40 bg-surface p-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-magenta px-2.5 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-white">
                <Eye className="h-3.5 w-3.5" />
                Pré-visualização
              </div>

              <h3 className="mt-5 font-display text-xl">
                Vê o resultado aqui.
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Este modo remove as
                linhas de edição, caixas
                de seleção e controlos do
                canvas. Podes alternar
                entre as áreas do produto
                acima sem descarregar
                qualquer ficheiro.
              </p>

              <div className="mt-5 border-t border-border pt-4">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                  Área atual
                </p>

                <p className="mt-1 font-display text-sm text-cyan">
                  {activeSurface.label}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-2">
              <SportButton
                type="button"
                variant="cyan"
                shape="square"
                onClick={() =>
                  customizer.setViewMode(
                    "edit",
                  )
                }
                className="w-full"
              >
                <Pencil className="h-4 w-4" />
                Continuar a editar
              </SportButton>

              <SportButton
                type="button"
                onClick={handleAddToCart}
                className="w-full"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartItemId
                  ? "Guardar alterações"
                  : "Guardar no carrinho"}
              </SportButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
