/**
 * VinilArt Sport — Konva Canvas Component
 *
 * SSR-safe wrapper around react-konva.
 * TanStack Start does SSR — Konva needs `window`, so the Stage is only
 * rendered after mounting. A simple `mounted` state guard handles this.
 *
 * Responsive & Touch-enabled:
 *  - Uses ResizeObserver to dynamically scale down on mobile while keeping
 *    native canvas resolution (config.canvasWidth × config.canvasHeight).
 *  - Sets `touchAction: "none"` so mobile touch gestures drag/transform layers
 *    instead of scrolling the page.
 *  - Layers:
 *    - Layer 0: Mockup background (non-interactive)
 *    - Layer 1 (name="guide-layer"): Print-area masks & cyan border (hidden on export)
 *    - Layer 2: Design elements (Group clipped to printArea) + Transformer (name="selection-transformer")
 */

import { useEffect, useState, useRef, useCallback } from "react";
import type {
  ProductCustomizerConfig,
  DesignLayer,
} from "@/lib/customizer/types";
import type { ProductCustomizerHandle } from "@/hooks/useProductCustomizer";

interface CanvasEditorProps {
  config: ProductCustomizerConfig;
  customizer: ProductCustomizerHandle;
}

/**
 * Public wrapper — SSR guard + responsive scale container with touchAction: none.
 */
export function CanvasEditor({ config, customizer }: CanvasEditorProps) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [KonvaLib, setKonvaLib] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(
    config.canvasWidth,
  );

  useEffect(() => {
    setMounted(true);
    import("react-konva").then((mod) => {
      setKonvaLib(mod);
    });
  }, []);

  // Observe container width for responsive scaling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) setContainerWidth(rect.width);
    };
    update();
    const observer = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect.width > 0) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const baseScale = Math.min(containerWidth / config.canvasWidth, 1);
  const effectiveZoom = customizer.zoom ?? 1;
  const totalScale = baseScale * effectiveZoom;

  if (!mounted || !KonvaLib) {
    return (
      <div
        ref={containerRef}
        className="flex w-full items-center justify-center border border-border bg-surface"
        style={{ aspectRatio: "1 / 1" }}
      >
        <span className="text-[0.7rem] uppercase tracking-widest text-muted-foreground">
          A carregar editor…
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-full overflow-hidden flex items-center justify-center"
      style={{
        height: Math.round(config.canvasHeight * baseScale),
        touchAction: "none",
      }}
    >
      {/* Zoom / Scale wrapper */}
      <div
        style={{
          transformOrigin: "center center",
          transform: `scale(${totalScale})`,
          width: config.canvasWidth,
          height: config.canvasHeight,
          transition: "transform 0.15s ease-out",
        }}
      >
        <KonvaStageInner
          config={config}
          customizer={customizer}
          KonvaLib={KonvaLib}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inner component — client-only, uses react-konva APIs
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function KonvaStageInner({
  config,
  customizer,
  KonvaLib,
}: CanvasEditorProps & { KonvaLib: any }) {
  const {
    Stage,
    Layer,
    Image: KonvaImage,
    Text,
    Transformer,
    Rect,
    Group,
  } = KonvaLib;

  const {
    stageRef,
    activeSurface,
    activeLayers,
    selectedLayer,
    selectLayer,
    dispatch,
    state,
  } = customizer;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformerRef = useRef<any>(null);
  const [mockupImg, setMockupImg] = useState<HTMLImageElement | null>(null);
  const [layerImgs, setLayerImgs] = useState<
    Record<string, HTMLImageElement>
  >({});

  // Load mockup image when surface changes
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setMockupImg(img);
    img.src = activeSurface.mockupSrc;
  }, [activeSurface.mockupSrc]);

  // Load images for image-type layers (reload if layer.srcUrl changed e.g. bg removal or restore)
  useEffect(() => {
    activeLayers.forEach((layer) => {
      if (layer.type !== "image") return;
      const current = layerImgs[layer.id];
      if (current && current.src === layer.srcUrl) return;

      const img = new window.Image();
      img.onload = () =>
        setLayerImgs((prev) => ({ ...prev, [layer.id]: img }));
      img.src = layer.srcUrl;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLayers]);

  // Attach / detach transformer when selectedLayer changes
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    if (!selectedLayer || selectedLayer.locked || !selectedLayer.visible) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
      return;
    }
    const node = stageRef.current.findOne(`#${selectedLayer.id}`);
    if (node) {
      transformerRef.current.nodes([node]);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedLayer?.id, selectedLayer?.locked, selectedLayer?.visible, state.activeSurfaceId, activeLayers.length, stageRef]);

  // Print area in canvas-space pixels
  const { printArea } = activeSurface;
  const paX = printArea.xFraction * config.canvasWidth;
  const paY = printArea.yFraction * config.canvasHeight;
  const paW = printArea.widthFraction * config.canvasWidth;
  const paH = printArea.heightFraction * config.canvasHeight;

  const handleStageClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      if (e.target === e.target.getStage()) selectLayer(null);
    },
    [selectLayer],
  );

  const handleLayerClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (layerId: string) => (e: any) => {
      e.cancelBubble = true;
      selectLayer(layerId);
    },
    [selectLayer],
  );

  const handleDragEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (layer: DesignLayer) => (e: any) => {
      if (layer.locked) return;
      dispatch({
        type: "UPDATE_LAYER",
        surfaceId: state.activeSurfaceId,
        layerId: layer.id,
        changes: { x: e.target.x(), y: e.target.y() },
      });
    },
    [dispatch, state.activeSurfaceId],
  );

  const handleTransformEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (layer: DesignLayer) => (e: any) => {
      if (layer.locked) return;
      const node = e.target;
      dispatch({
        type: "UPDATE_LAYER",
        surfaceId: state.activeSurfaceId,
        layerId: layer.id,
        changes: {
          x: node.x(),
          y: node.y(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
          rotation: node.rotation(),
        },
      });
    },
    [dispatch, state.activeSurfaceId],
  );

  const isEditMode = (customizer.viewMode ?? "edit") === "edit";

  const sortedLayers = [...activeLayers]
    .filter((l) => l.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

  // Clipping function: if shape is contour, build a smooth polygon path; otherwise clip rectangle
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clipFunc = useCallback((ctx: any) => {
    const shape = printArea.shape;
    if (shape?.type === "contour" && shape.points && shape.points.length >= 6) {
      const pts = shape.points;
      const x0 = pts[0] ?? 0;
      const y0 = pts[1] ?? 0;
      ctx.beginPath();
      ctx.moveTo(paX + x0 * paW, paY + y0 * paH);
      for (let i = 2; i < pts.length; i += 2) {
        const xi = pts[i] ?? 0;
        const yi = pts[i + 1] ?? 0;
        ctx.lineTo(paX + xi * paW, paY + yi * paH);
      }
      ctx.closePath();
    } else {
      ctx.beginPath();
      ctx.rect(paX, paY, paW, paH);
      ctx.closePath();
    }
  }, [printArea.shape, paX, paY, paW, paH]);

  return (
    <Stage
      ref={stageRef}
      width={config.canvasWidth}
      height={config.canvasHeight}
      onClick={handleStageClick}
      onTap={handleStageClick}
    >
      {/* Layer 0: Mockup background (non-interactive) */}
      <Layer name="mockup-layer" listening={false}>
        {mockupImg && (
          <KonvaImage
            image={mockupImg}
            width={config.canvasWidth}
            height={config.canvasHeight}
          />
        )}
      </Layer>

      {/* Layer 1 (guide-layer): Print-area masks & border (visible ONLY in edit mode, hidden in preview & export) */}
      <Layer name="guide-layer" listening={false} visible={isEditMode}>
        <Rect
          x={0}
          y={0}
          width={config.canvasWidth}
          height={paY}
          fill="rgba(0,0,0,0.5)"
        />
        <Rect
          x={0}
          y={paY + paH}
          width={config.canvasWidth}
          height={config.canvasHeight - paY - paH}
          fill="rgba(0,0,0,0.5)"
        />
        <Rect x={0} y={paY} width={paX} height={paH} fill="rgba(0,0,0,0.5)" />
        <Rect
          x={paX + paW}
          y={paY}
          width={config.canvasWidth - paX - paW}
          height={paH}
          fill="rgba(0,0,0,0.5)"
        />
        {/* Print-area border / contour guide */}
        <Rect
          x={paX}
          y={paY}
          width={paW}
          height={paH}
          stroke="rgba(0, 200, 255, 0.8)"
          strokeWidth={1.5}
          dash={[6, 4]}
          fill="transparent"
        />
      </Layer>

      {/* Layer 2: Design elements clipped to anatomical shape */}
      <Layer name="design-layer">
        <Group clipFunc={clipFunc}>
          {sortedLayers.map((layer) => {
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
                  draggable={!layer.locked && isEditMode}
                  onClick={handleLayerClick(layer.id)}
                  onTap={handleLayerClick(layer.id)}
                  onDragEnd={handleDragEnd(layer)}
                  onTransformEnd={handleTransformEnd(layer)}
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
                  fontSize={layer.fontSize}
                  fontFamily={layer.fontFamily}
                  fill={layer.fill}
                  fontStyle={layer.fontStyle}
                  align={layer.align}
                  scaleX={layer.scaleX}
                  scaleY={layer.scaleY}
                  rotation={layer.rotation}
                  draggable={!layer.locked && isEditMode}
                  onClick={handleLayerClick(layer.id)}
                  onTap={handleLayerClick(layer.id)}
                  onDragEnd={handleDragEnd(layer)}
                  onTransformEnd={handleTransformEnd(layer)}
                />
              );
            }

            return null;
          })}
        </Group>

        {/* Transformer — rendered ONLY in edit mode */}
        {isEditMode && (
          <Transformer
            name="selection-transformer"
            ref={transformerRef}
            borderStroke="#00c8ff"
            borderStrokeWidth={1.5}
            anchorFill="#ffffff"
            anchorStroke="#00c8ff"
            anchorSize={10}
            rotateAnchorOffset={20}
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
              "middle-left",
              "middle-right",
            ]}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            boundBoxFunc={(oldBox: any, newBox: any) => {
              if (
                Math.abs(newBox.width) < 10 ||
                Math.abs(newBox.height) < 10
              ) {
                return oldBox;
              }
              return newBox;
            }}
          />
        )}
      </Layer>

      {/* Layer 3: Realistic Specular Shine & Curvature Highlight Overlay (non-interactive, passes clicks) */}
      <Layer name="overlay-layer" listening={false}>
        <Group clipFunc={clipFunc}>
          {/* Subtle glossy curvature highlight gradient across upper shell */}
          <Rect
            x={paX}
            y={paY}
            width={paW}
            height={paH * 0.45}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{ x: paW * 0.8, y: paH * 0.45 }}
            fillLinearGradientColorStops={[
              0, "rgba(255, 255, 255, 0.22)",
              0.4, "rgba(255, 255, 255, 0.08)",
              1, "rgba(255, 255, 255, 0)",
            ]}
          />
          {/* Subtle perimeter bevel / shadow inside contour */}
          <Rect
            x={paX}
            y={paY}
            width={paW}
            height={paH}
            stroke="rgba(0, 0, 0, 0.35)"
            strokeWidth={3}
            fill="transparent"
          />
        </Group>
      </Layer>
    </Stage>
  );
}
