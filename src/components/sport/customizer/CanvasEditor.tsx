import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  DesignLayer,
  ProductCustomizerConfig,
} from "@/lib/customizer/types";

import type { ProductCustomizerHandle } from "@/hooks/useProductCustomizer";

interface CanvasEditorProps {
  config: ProductCustomizerConfig;
  customizer: ProductCustomizerHandle;
  baseColor?: string | undefined;
}

export function CanvasEditor({
  config,
  customizer,
  baseColor,
}: CanvasEditorProps) {
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [KonvaLib, setKonvaLib] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    setMounted(true);

    import("react-konva").then((mod) => {
      setKonvaLib(mod);
    });
  }, []);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) {
        setSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const PADDING = 30;
  const availableWidth = Math.max(0, size.width - PADDING * 2);
  const availableHeight = Math.max(0, size.height - PADDING * 2);

  const baseScale =
    availableWidth > 0 && availableHeight > 0
      ? Math.min(
          availableWidth / config.canvasWidth,
          availableHeight / config.canvasHeight,
        )
      : 0;

  const zoom = customizer.zoom ?? 1;
  const totalScale = baseScale * zoom;

  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;

      event.preventDefault();

      if (event.deltaY < 0) {
        customizer.zoomIn();
      } else {
        customizer.zoomOut();
      }
    },
    [customizer],
  );

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className="relative h-full min-h-[300px] w-full min-w-0 overflow-hidden"
      style={{ touchAction: "none" }}
    >
      {!mounted || !KonvaLib || baseScale === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            A carregar editor…
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            style={{
              width: config.canvasWidth,
              height: config.canvasHeight,
              flex: "0 0 auto",
              transformOrigin: "center center",
              transform: `scale(${totalScale})`,
              transition: "transform 150ms ease-out",
            }}
          >
            <KonvaStageInner
              config={config}
              customizer={customizer}
              baseColor={baseColor}
              KonvaLib={KonvaLib}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function KonvaStageInner({
  config,
  customizer,
  baseColor,
  KonvaLib,
}: CanvasEditorProps & {
  KonvaLib: any;
}) {
  const {
    Stage,
    Layer,
    Image: KonvaImage,
    Text,
    Transformer,
    Rect,
    Group,
    Line,
    Path: KonvaPath,
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

  const [mockupImg, setMockupImg] =
    useState<HTMLImageElement | null>(null);

  const [shadeImg, setShadeImg] =
    useState<HTMLImageElement | null>(null);

  const [layerImgs, setLayerImgs] = useState<
    Record<string, HTMLImageElement>
  >({});

  const [snap, setSnap] = useState<{
    v: boolean;
    h: boolean;
  }>({ v: false, h: false });

  useEffect(() => {
    const img = new window.Image();

    img.onload = () => {
      setMockupImg(img);
    };

    img.src = activeSurface.mockupSrc;
  }, [activeSurface.mockupSrc]);

  const shadeSrc = activeSurface.mockup?.overlaySrc;

  useEffect(() => {
    if (!shadeSrc) {
      setShadeImg(null);
      return;
    }

    const img = new window.Image();

    img.onload = () => {
      setShadeImg(img);
    };

    img.src = shadeSrc;
  }, [shadeSrc]);


  useEffect(() => {
    activeLayers.forEach((layer) => {
      if (layer.type !== "image") return;

      const current = layerImgs[layer.id];

      if (current && current.src === layer.srcUrl) {
        return;
      }

      const img = new window.Image();

      img.onload = () => {
        setLayerImgs((previous) => ({
          ...previous,
          [layer.id]: img,
        }));
      };

      img.src = layer.srcUrl;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLayers]);

  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) {
      return;
    }

    if (
      !selectedLayer ||
      selectedLayer.locked ||
      !selectedLayer.visible
    ) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();

      return;
    }

    const node = stageRef.current.findOne(
      `#${selectedLayer.id}`,
    );

    if (node) {
      transformerRef.current.nodes([node]);
      transformerRef.current.update();
    } else {
      transformerRef.current.nodes([]);
    }

    transformerRef.current.getLayer()?.batchDraw();
  }, [
    selectedLayer?.id,
    selectedLayer?.locked,
    selectedLayer?.visible,
    selectedLayer?.x,
    selectedLayer?.y,
    selectedLayer?.width,
    (selectedLayer as any)?.height,
    selectedLayer?.scaleX,
    selectedLayer?.scaleY,
    selectedLayer?.rotation,
    state.activeSurfaceId,
    activeLayers.length,
    layerImgs,
    stageRef,
  ]);

  const { printArea } = activeSurface;

  const paX = printArea.xFraction * config.canvasWidth;
  const paY = printArea.yFraction * config.canvasHeight;
  const paW = printArea.widthFraction * config.canvasWidth;
  const paH =
    printArea.heightFraction * config.canvasHeight;

  const centerX = paX + paW / 2;
  const centerY = paY + paH / 2;

  const isEditMode = customizer.viewMode === "edit";

  /**
   * Guides stay discreet: they only appear while a layer is selected or when
   * the surface is still empty, so the mockup reads like a real product photo.
   */
  const showGuides =
    Boolean(selectedLayer) || activeLayers.length === 0;

  const sortedLayers = [...activeLayers]
    .filter((layer) => layer.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

  const contourPoints =
    printArea.shape?.type === "contour" &&
    printArea.shape.points
      ? printArea.shape.points.reduce<number[]>(
          (result, value, index) => {
            if (index % 2 === 0) {
              result.push(paX + value * paW);
            } else {
              result.push(paY + value * paH);
            }

            return result;
          },
          [],
        )
      : null;

  const clipFunc = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ctx: any) => {
      const shape = printArea.shape;

      if (
        shape?.type === "contour" &&
        shape.points &&
        shape.points.length >= 6
      ) {
        const points = shape.points;

        ctx.beginPath();

        ctx.moveTo(
          paX + (points[0] ?? 0) * paW,
          paY + (points[1] ?? 0) * paH,
        );

        for (
          let index = 2;
          index < points.length;
          index += 2
        ) {
          ctx.lineTo(
            paX + (points[index] ?? 0) * paW,
            paY + (points[index + 1] ?? 0) * paH,
          );
        }

        ctx.closePath();

        return;
      }

      if (shape?.type === "rounded") {
        const radius =
          typeof shape.cornerRadius === "number"
            ? shape.cornerRadius
            : 12;

        ctx.beginPath();
        ctx.roundRect(paX, paY, paW, paH, radius);
        ctx.closePath();

        return;
      }

      ctx.beginPath();
      ctx.rect(paX, paY, paW, paH);
      ctx.closePath();
    },
    [printArea.shape, paX, paY, paW, paH],
  );

  const handleStageClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      if (event.target === event.target.getStage()) {
        selectLayer(null);
      }
    },
    [selectLayer],
  );

  const handleLayerClick = useCallback(
    (layerId: string) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event: any) => {
        event.cancelBubble = true;
        selectLayer(layerId);
      },
    [selectLayer],
  );

  /** Live magnetic snapping to the print area centre while dragging. */
  const handleDragMove = useCallback(
    (layer: DesignLayer) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event: any) => {
        const node = event.target;
        const tolerance = 10;

        const nodeW = node.width() * node.scaleX();
        const nodeH = node.height() * node.scaleY();

        const cx =
          layer.type === "image"
            ? node.x()
            : node.x() + nodeW / 2;

        const cy =
          layer.type === "image"
            ? node.y()
            : node.y() + nodeH / 2;

        let snapV = false;
        let snapH = false;

        if (Math.abs(cx - centerX) < tolerance) {
          node.x(node.x() + (centerX - cx));
          snapV = true;
        }

        if (Math.abs(cy - centerY) < tolerance) {
          node.y(node.y() + (centerY - cy));
          snapH = true;
        }

        setSnap((previous) =>
          previous.v === snapV && previous.h === snapH
            ? previous
            : { v: snapV, h: snapH },
        );
      },
    [centerX, centerY],
  );

  const handleDragEnd = useCallback(
    (layer: DesignLayer) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event: any) => {
        setSnap({ v: false, h: false });

        if (layer.locked) return;

        dispatch({
          type: "UPDATE_LAYER",
          surfaceId: state.activeSurfaceId,
          layerId: layer.id,
          changes: {
            x: event.target.x(),
            y: event.target.y(),
          },
        });
      },
    [dispatch, state.activeSurfaceId],
  );

  const handleTransformEnd = useCallback(
    (layer: DesignLayer) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event: any) => {
        if (layer.locked) return;

        const node = event.target;

        dispatch({
          type: "UPDATE_LAYER",
          surfaceId: state.activeSurfaceId,
          layerId: layer.id,
          changes: {
            x: node.x(),
            y: node.y(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            rotation: ((node.rotation() + 180) % 360 + 360) % 360 - 180,
          },
        });
      },
    [dispatch, state.activeSurfaceId],
  );

  return (
    <Stage
      ref={stageRef}
      width={config.canvasWidth}
      height={config.canvasHeight}
      onClick={handleStageClick}
      onTap={handleStageClick}
    >
      <Layer name="mockup-layer" listening={false}>
        {/* Base color tinting underlay: strictly clipped to the product silhouette */}
        {baseColor && baseColor.toLowerCase() !== "#ffffff" && (
          activeSurface.mockup?.silhouettePath ? (
            <KonvaPath
              data={activeSurface.mockup.silhouettePath}
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

      <Layer
        name="guide-layer"
        listening={false}
        visible={isEditMode && showGuides}
        opacity={selectedLayer ? 0.95 : 0.65}
      >
        {contourPoints ? (
          <Line
            points={contourPoints}
            closed
            stroke="rgba(0, 200, 255, 0.6)"
            strokeWidth={1.5}
            dash={[5, 5]}
            lineJoin="round"
          />
        ) : (
          <Rect
            x={paX}
            y={paY}
            width={paW}
            height={paH}
            cornerRadius={
              typeof printArea.shape?.cornerRadius ===
              "number"
                ? printArea.shape.cornerRadius
                : 8
            }
            stroke="rgba(0, 200, 255, 0.6)"
            strokeWidth={1.5}
            dash={[5, 5]}
          />
        )}
      </Layer>

      <Layer name="design-layer">
        <Group clipFunc={clipFunc}>
          {sortedLayers.map((layer) => {
            if (layer.type === "image") {
              const image = layerImgs[layer.id];

              if (!image) return null;

              return (
                <KonvaImage
                  key={layer.id}
                  id={layer.id}
                  image={image}
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
                  draggable={
                    !layer.locked && isEditMode
                  }
                  onClick={handleLayerClick(layer.id)}
                  onTap={handleLayerClick(layer.id)}
                  onDragMove={handleDragMove(layer)}
                  onDragEnd={handleDragEnd(layer)}
                  onTransformEnd={handleTransformEnd(
                    layer,
                  )}
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
                  opacity={1}
                  draggable={
                    !layer.locked && isEditMode
                  }
                  onClick={handleLayerClick(layer.id)}
                  onTap={handleLayerClick(layer.id)}
                  onDragMove={handleDragMove(layer)}
                  onDragEnd={handleDragEnd(layer)}
                  onTransformEnd={handleTransformEnd(
                    layer,
                  )}
                />
              );
            }

            return null;
          })}
        </Group>

        {isEditMode && snap.v && (
          <Line
            points={[centerX, paY, centerX, paY + paH]}
            stroke="rgba(255,255,255,0.65)"
            strokeWidth={1.5}
            dash={[6, 4]}
            listening={false}
          />
        )}

        {isEditMode && snap.h && (
          <Line
            points={[paX, centerY, paX + paW, centerY]}
            stroke="rgba(255,255,255,0.65)"
            strokeWidth={1.5}
            dash={[6, 4]}
            listening={false}
          />
        )}

        {isEditMode && (
          <Transformer
            name="selection-transformer"
            ref={transformerRef}
            borderStroke="#00c8ed"
            borderStrokeWidth={1}
            borderDash={[3, 3]}
            anchorFill="#ffffff"
            anchorStroke="#00c8ed"
            anchorStrokeWidth={1}
            anchorSize={9}
            anchorCornerRadius={5}
            rotateEnabled
            rotateAnchorOffset={24}
            rotationSnaps={[
              0, 15, 30, 45, 60, 75, 90, 105, 120, 135,
              150, 165, 180, 195, 210, 225, 240, 255,
              270, 285, 300, 315, 330, 345,
            ]}
            rotationSnapTolerance={6}
            keepRatio
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
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

      <Layer name="overlay-layer" listening={false}>
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
  );
}
