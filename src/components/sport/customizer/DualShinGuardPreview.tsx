import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  ProductCustomizerConfig,
  Surface,
} from "@/lib/customizer/types";

import type { ProductCustomizerHandle } from "@/hooks/useProductCustomizer";

interface DualShinGuardPreviewProps {
  config: ProductCustomizerConfig;
  customizer: ProductCustomizerHandle;
  baseColor?: string | undefined;
}

export function DualShinGuardPreview({
  config,
  customizer,
  baseColor,
}: DualShinGuardPreviewProps) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [KonvaLib, setKonvaLib] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    import("react-konva").then((mod) => {
      setKonvaLib(mod);
    });
  }, []);

  const leftSurface =
    config.surfaces.find((s) => s.id === "LEFT") ?? config.surfaces[0];
  const rightSurface =
    config.surfaces.find((s) => s.id === "RIGHT") ?? config.surfaces[1] ?? leftSurface;

  if (!mounted || !KonvaLib || !leftSurface || !rightSurface) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center border border-border bg-black">
        <span className="text-[0.7rem] uppercase tracking-widest text-muted-foreground">
          A carregar pré-visualização do par…
        </span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header bar indicating pair preview */}
      <div className="mb-3 flex items-center justify-between border-b border-magenta/40 bg-surface px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-magenta animate-pulse" />
          <span className="font-display uppercase tracking-widest text-foreground text-[0.65rem]">
            Pré-visualização do Par
          </span>
        </div>
        <span className="font-mono text-[0.6rem] text-cyan uppercase tracking-wider">
          Esquerda + Direita
        </span>
      </div>

      {/* Grid of the 2 shin guards side-by-side */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* LEFT Shin Guard */}
        <div className="relative overflow-hidden border border-border bg-black p-2 transition-all hover:border-cyan/50">
          <div className="mb-2 flex items-center justify-between border-b border-border/40 pb-1 font-mono text-[0.6rem] uppercase tracking-widest">
            <span className="text-muted-foreground">01 // Lado Esquerdo</span>
            <span className="text-cyan font-bold">LEFT</span>
          </div>
          <SingleSurfacePreviewCanvas
            surface={leftSurface}
            config={config}
            customizer={customizer}
            baseColor={baseColor}
            KonvaLib={KonvaLib}
          />
        </div>

        {/* RIGHT Shin Guard */}
        <div className="relative overflow-hidden border border-border bg-black p-2 transition-all hover:border-magenta/50">
          <div className="mb-2 flex items-center justify-between border-b border-border/40 pb-1 font-mono text-[0.6rem] uppercase tracking-widest">
            <span className="text-muted-foreground">02 // Lado Direito</span>
            <span className="text-magenta font-bold">RIGHT</span>
          </div>
          <SingleSurfacePreviewCanvas
            surface={rightSurface}
            config={config}
            customizer={customizer}
            baseColor={baseColor}
            KonvaLib={KonvaLib}
          />
        </div>
      </div>
    </div>
  );
}

export function SingleSurfacePreviewCanvas({
  surface,
  config,
  customizer,
  baseColor,
  KonvaLib,
  stageRef,
}: {
  surface: Surface;
  config: ProductCustomizerConfig;
  customizer: ProductCustomizerHandle;
  baseColor?: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  KonvaLib: any;
  stageRef?: ((stage: import("konva").default.Stage | null) => void) | undefined;
}) {
  const { Stage, Layer, Image: KonvaImage, Text, Rect, Group, Path: KonvaPath } = KonvaLib;
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: config.canvasWidth,
    height: config.canvasHeight,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize({ width: rect.width, height: rect.height });
      } else if (rect.width > 0) {
        setSize((prev) => ({ ...prev, width: rect.width }));
      }
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

  const PADDING = 16;
  const availableWidth = Math.max(0, size.width - PADDING * 2);
  const availableHeight = Math.max(0, (size.height > 0 ? size.height : size.width) - PADDING * 2);

  const baseScale =
    availableWidth > 0 && availableHeight > 0
      ? Math.min(
          availableWidth / config.canvasWidth,
          availableHeight / config.canvasHeight,
        )
      : availableWidth > 0
        ? availableWidth / config.canvasWidth
        : 1;

  const [mockupImg, setMockupImg] = useState<HTMLImageElement | null>(null);
  const [shadeImg, setShadeImg] = useState<HTMLImageElement | null>(null);
  const [layerImgs, setLayerImgs] = useState<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setMockupImg(img);
    img.src = surface.mockupSrc;
  }, [surface.mockupSrc]);

  const shadeSrc = surface.mockup?.overlaySrc;
  useEffect(() => {
    if (!shadeSrc) {
      setShadeImg(null);
      return;
    }
    const img = new window.Image();
    img.onload = () => setShadeImg(img);
    img.src = shadeSrc;
  }, [shadeSrc]);

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
          flexShrink: 0,
          width: config.canvasWidth,
          height: config.canvasHeight,
          transformOrigin: "center center",
          transform: `scale(${baseScale})`,
        }}
      >
        <Stage ref={stageRef} width={config.canvasWidth} height={config.canvasHeight}>
          {/* Base Neutral Mockup with color tinting (strictly clipped to product silhouette) */}
          <Layer listening={false}>
            {baseColor && baseColor.toLowerCase() !== "#ffffff" && (
              surface.mockup?.silhouettePath ? (
                <KonvaPath
                  data={surface.mockup.silhouettePath}
                  scaleX={config.canvasWidth / 800}
                  scaleY={config.canvasHeight / 800}
                  fill={baseColor}
                />
              ) : (
                <Rect
                  x={0}
                  y={0}
                  width={config.canvasWidth}
                  height={config.canvasHeight}
                  fill={baseColor}
                />
              )
            )}
            {mockupImg && (
              <KonvaImage
                image={mockupImg}
                width={config.canvasWidth}
                height={config.canvasHeight}
                globalCompositeOperation={
                  baseColor && baseColor.toLowerCase() !== "#ffffff"
                    ? "multiply"
                    : "source-over"
                }
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
                      opacity={1}
                      globalCompositeOperation="source-over"
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

          {/* Shading / Reflection Overlay (above artwork) */}
          <Layer listening={false}>
            {shadeImg && (
              <KonvaImage
                image={shadeImg}
                width={config.canvasWidth}
                height={config.canvasHeight}
                globalCompositeOperation="multiply"
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
