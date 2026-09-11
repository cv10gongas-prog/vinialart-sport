import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  Eye,
  Maximize2,
  Minimize2,
  ShoppingBag,
  Layers,
} from "lucide-react";

import type {
  ProductCustomizerConfig,
  Surface,
} from "@/lib/customizer/types";

import type { ProductCustomizerHandle } from "@/hooks/useProductCustomizer";
import { SportButton } from "@/components/sport/SportButton";
import { cn } from "@/lib/utils";

interface ProductLivePreviewProps {
  config: ProductCustomizerConfig;
  customizer: ProductCustomizerHandle;
  onOpenPresentation?: () => void;
  className?: string;
}

export function ProductLivePreview({
  config,
  customizer,
  onOpenPresentation,
  className,
}: ProductLivePreviewProps) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [KonvaLib, setKonvaLib] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    import("react-konva").then((mod) => {
      setKonvaLib(mod);
    });
  }, []);

  const activeSurface = customizer.activeSurface;

  const layerCount =
    customizer.state.surfaces[customizer.state.activeSurfaceId]?.layers
      .length ?? 0;

  if (!mounted || !KonvaLib) {
    return (
      <div className={cn("border border-border bg-surface p-3", className)}>
        <div className="flex aspect-square w-full items-center justify-center bg-black">
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
            A carregar preview...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden border border-border bg-surface transition-all hover:border-cyan/60",
        className,
      )}
    >
      {/* Top Header with Live Indicator */}
      <div className="flex items-center justify-between border-b border-border/70 bg-background/80 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
          </span>
          <span className="font-display text-[0.65rem] uppercase tracking-widest text-foreground">
            Preview em Tempo Real
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.55rem] uppercase tracking-wider text-muted-foreground">
            {activeSurface.label}
          </span>
          {onOpenPresentation && (
            <button
              type="button"
              onClick={onOpenPresentation}
              title="Expandir pré-visualização"
              className="flex items-center gap-1 rounded border border-border/80 px-1.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-wider text-cyan hover:border-cyan hover:bg-cyan/10 transition-colors"
            >
              <Maximize2 className="h-2.5 w-2.5" />
              <span>Ver Grande</span>
            </button>
          )}
        </div>
      </div>

      {/* Canvas Box */}
      <div className="relative flex w-full items-center justify-center bg-black/90 p-2">
        <LiveSurfaceRenderer
          surface={activeSurface}
          config={config}
          customizer={customizer}
          KonvaLib={KonvaLib}
        />

        {/* Hover Hint */}
        {onOpenPresentation && (
          <button
            type="button"
            onClick={onOpenPresentation}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100"
          >
            <span className="flex items-center gap-1.5 rounded border border-cyan/80 bg-black/90 px-3 py-1.5 font-display text-[0.65rem] uppercase tracking-widest text-cyan shadow-glow-cyan">
              <Eye className="h-3.5 w-3.5" />
              Ver Resultado Completo
            </span>
          </button>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-border/60 bg-background/50 px-3 py-1.5 font-mono text-[0.55rem] uppercase tracking-widest text-muted-foreground">
        <span className="flex items-center gap-1">
          <Layers className="h-3 w-3 text-cyan" />
          {layerCount} {layerCount === 1 ? "camada" : "camadas"}
        </span>
        <span className="text-cyan">Sem marcas de edição</span>
      </div>
    </div>
  );
}

interface ProductPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProductCustomizerConfig;
  customizer: ProductCustomizerHandle;
  onAddToCart: () => void;
  cartItemId?: string | undefined;
}

export function ProductPresentationModal({
  isOpen,
  onClose,
  config,
  customizer,
  onAddToCart,
  cartItemId,
}: ProductPresentationModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [KonvaLib, setKonvaLib] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      import("react-konva").then((mod) => {
        setKonvaLib(mod);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  const isShinGuard = config.id === "caneleiras-personalizadas";
  const isJersey = config.id === "equipamento-personalizado";
  const isFlag = config.id === "bandeira-personalizada";
  const primarySurface = config.surfaces[0];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-2 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative flex max-h-[96vh] w-full max-w-5xl flex-col overflow-hidden border border-border bg-[#090b0f] shadow-2xl">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-3 sm:px-6">
          <div className="min-w-0 flex items-center gap-2 sm:gap-3">
            <span className="shrink-0 bg-cyan px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-black">
              PREVIEW
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-display text-sm uppercase sm:text-base">
                {config.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 z-10 flex items-center gap-1 border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:border-cyan hover:text-cyan transition-colors"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            <span>Fechar</span>
          </button>
        </div>

        {/* Modal Body: Products Presentation on single dark clean canvas */}
        <div className="overflow-y-auto p-3 sm:p-8 bg-[#090b0f]">
          {KonvaLib ? (
            <div>
              {isShinGuard && (
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="font-mono text-[0.65rem] uppercase tracking-widest text-cyan">
                      Par Completo · Caneleira Esquerda & Direita
                    </span>
                    <span className="font-mono text-[0.58rem] text-muted-foreground">
                      Vista em Par
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {config.surfaces.map((surface) => {
                      const ptLabel =
                        surface.id === "LEFT"
                          ? "CANELEIRA ESQUERDA"
                          : surface.id === "RIGHT"
                            ? "CANELEIRA DIREITA"
                            : surface.label;

                      return (
                        <div
                          key={surface.id}
                          className="flex flex-col items-center justify-center p-2"
                        >
                          <div className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
                            {ptLabel}
                          </div>
                          <div className="w-full max-w-[420px]">
                            <LiveSurfaceRenderer
                              surface={surface}
                              config={config}
                              customizer={customizer}
                              KonvaLib={KonvaLib}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {isJersey && (
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="font-mono text-[0.65rem] uppercase tracking-widest text-cyan">
                      Equipamento Completo · Frente & Costas
                    </span>
                    <span className="font-mono text-[0.58rem] text-muted-foreground">
                      Vista Frente e Traseira
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {config.surfaces.map((surface) => {
                      const ptLabel =
                        surface.id === "FRONT"
                          ? "FRENTE"
                          : surface.id === "BACK"
                            ? "COSTAS"
                            : surface.label;

                      return (
                        <div
                          key={surface.id}
                          className="flex flex-col items-center justify-center p-2"
                        >
                          <div className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
                            {ptLabel}
                          </div>
                          <div className="w-full max-w-[420px]">
                            <LiveSurfaceRenderer
                              surface={surface}
                              config={config}
                              customizer={customizer}
                              KonvaLib={KonvaLib}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {isFlag && primarySurface && (
                <div className="mx-auto max-w-2xl flex flex-col items-center">
                  <div className="mb-4 w-full flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="font-mono text-[0.65rem] uppercase tracking-widest text-cyan">
                      Bandeira Personalizada · Vista Total
                    </span>
                    <span className="font-mono text-[0.58rem] text-muted-foreground">
                      Visualização completa
                    </span>
                  </div>
                  <div className="w-full max-w-[560px]">
                    <LiveSurfaceRenderer
                      surface={primarySurface}
                      config={config}
                      customizer={customizer}
                      KonvaLib={KonvaLib}
                    />
                  </div>
                </div>
              )}

              {!isShinGuard && !isJersey && !isFlag && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {config.surfaces.map((surface) => (
                    <div
                      key={surface.id}
                      className="flex flex-col items-center justify-center p-2"
                    >
                      <div className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
                        {surface.label}
                      </div>
                      <div className="w-full max-w-[420px]">
                        <LiveSurfaceRenderer
                          surface={surface}
                          config={config}
                          customizer={customizer}
                          KonvaLib={KonvaLib}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                A renderizar produto...
              </span>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background px-4 py-3 sm:px-6">
          <p className="text-xs text-muted-foreground hidden sm:block">
            Resultado pronto para avançar no pedido.
          </p>

          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="border border-border px-4 py-2 font-display text-xs uppercase tracking-wider text-muted-foreground hover:border-cyan hover:text-cyan transition-colors"
            >
              Voltar a Editar
            </button>

            <SportButton
              onClick={() => {
                onAddToCart();
                onClose();
              }}
              size="md"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{cartItemId ? "Guardar Alterações" : "Adicionar ao Pedido"}</span>
            </SportButton>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function LiveSurfaceRenderer({
  surface,
  config,
  customizer,
  KonvaLib,
}: {
  surface: Surface;
  config: ProductCustomizerConfig;
  customizer: ProductCustomizerHandle;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  KonvaLib: any;
}) {
  const { Stage, Layer, Image: KonvaImage, Text, Rect, Group } = KonvaLib;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(config.canvasWidth);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) setContainerWidth(rect.width);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const baseScale = Math.min(containerWidth / config.canvasWidth, 1);

  const [mockupImg, setMockupImg] = useState<HTMLImageElement | null>(null);
  const [layerImgs, setLayerImgs] = useState<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setMockupImg(img);
    img.src = surface.mockupSrc;
  }, [surface.mockupSrc]);

  const layers = customizer.state.surfaces[surface.id]?.layers ?? [];
  const visibleLayers = [...layers]
    .filter((l) => l.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

  useEffect(() => {
    visibleLayers.forEach((layer) => {
      if (layer.type !== "image") return;
      if (layerImgs[layer.id]?.src === layer.srcUrl) return;

      const img = new window.Image();
      img.onload = () => {
        setLayerImgs((prev) => ({ ...prev, [layer.id]: img }));
      };
      img.src = layer.srcUrl;
    });
  }, [visibleLayers, layerImgs]);

  const { printArea } = surface;
  const paX = printArea.xFraction * config.canvasWidth;
  const paY = printArea.yFraction * config.canvasHeight;
  const paW = printArea.widthFraction * config.canvasWidth;
  const paH = printArea.heightFraction * config.canvasHeight;

  const clipFunc = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ctx: any) => {
      const shape = printArea.shape;
      if (shape?.type === "contour" && shape.points && shape.points.length >= 6) {
        const points = shape.points;
        ctx.beginPath();
        ctx.moveTo(paX + (points[0] ?? 0) * paW, paY + (points[1] ?? 0) * paH);
        for (let i = 2; i < points.length; i += 2) {
          ctx.lineTo(paX + (points[i] ?? 0) * paW, paY + (points[i + 1] ?? 0) * paH);
        }
        ctx.closePath();
        return;
      }
      if (shape?.type === "rounded") {
        const r = typeof shape.cornerRadius === "number" ? shape.cornerRadius : 12;
        ctx.beginPath();
        ctx.roundRect(paX, paY, paW, paH, r);
        ctx.closePath();
        return;
      }
      ctx.beginPath();
      ctx.rect(paX, paY, paW, paH);
      ctx.closePath();
    },
    [printArea.shape, paX, paY, paW, paH],
  );

  return (
    <div
      ref={containerRef}
      className="relative flex w-full items-center justify-center overflow-hidden"
      style={{
        height: Math.round(config.canvasHeight * baseScale),
      }}
    >
      <div
        style={{
          width: config.canvasWidth,
          height: config.canvasHeight,
          transformOrigin: "center center",
          transform: "scale(" + baseScale + ")",
        }}
      >
        <Stage width={config.canvasWidth} height={config.canvasHeight}>
          {/* Base Neutral Mockup */}
          <Layer listening={false}>
            {mockupImg && (
              <KonvaImage
                image={mockupImg}
                width={config.canvasWidth}
                height={config.canvasHeight}
              />
            )}
          </Layer>

          {/* User Artwork (Clipped to printArea contour) */}
          <Layer listening={false}>
            <Group clipFunc={clipFunc}>
              {visibleLayers.map((layer) => {
                if (layer.type === "image") {
                  const img = layerImgs[layer.id];
                  if (!img) return null;
                  return (
                    <KonvaImage
                      key={layer.id}
                      id={layer.id}
                      image={img}
                      x={layer.x}
                      y={layer.y}
                      width={layer.width}
                      height={layer.height}
                      offsetX={layer.width / 2}
                      offsetY={layer.height / 2}
                      scaleX={layer.scaleX}
                      scaleY={layer.scaleY}
                      rotation={layer.rotation}
                    />
                  );
                }
                if (layer.type === "text") {
                  return (
                    <Text
                      key={layer.id}
                      id={layer.id}
                      text={layer.text}
                      x={layer.x}
                      y={layer.y}
                      width={layer.width}
                      fontSize={layer.fontSize}
                      fontFamily={layer.fontFamily}
                      fill={layer.fill}
                      fontStyle={layer.fontStyle}
                      align={layer.align}
                      scaleX={layer.scaleX}
                      scaleY={layer.scaleY}
                      rotation={layer.rotation}
                    />
                  );
                }
                return null;
              })}
            </Group>
          </Layer>

          {/* Realistic Surface Shading/Highlight */}
          <Layer listening={false}>
            <Group clipFunc={clipFunc}>
              <Rect
                x={paX}
                y={paY}
                width={paW}
                height={paH * 0.45}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: paW, y: paH * 0.45 }}
                fillLinearGradientColorStops={[
                  0,
                  "rgba(255,255,255,0.18)",
                  0.4,
                  "rgba(255,255,255,0.06)",
                  1,
                  "rgba(255,255,255,0)",
                ]}
              />
            </Group>
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
