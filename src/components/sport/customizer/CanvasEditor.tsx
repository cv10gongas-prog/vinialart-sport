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
}

export function CanvasEditor({
  config,
  customizer,
}: CanvasEditorProps) {
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [KonvaLib, setKonvaLib] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(
    config.canvasWidth,
  );

  useEffect(() => {
    setMounted(true);

    import("react-konva").then((mod) => {
      setKonvaLib(mod);
    });
  }, []);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    const updateWidth = () => {
      const rect = element.getBoundingClientRect();

      if (rect.width > 0) {
        setContainerWidth(rect.width);
      }
    };

    updateWidth();

    const observer = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect.width > 0) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(element);

    window.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const baseScale = Math.min(
    containerWidth / config.canvasWidth,
    1,
  );

  const zoom = customizer.zoom ?? 1;
  const totalScale = baseScale * zoom;

  if (!mounted || !KonvaLib) {
    return (
      <div
        ref={containerRef}
        className="flex aspect-square w-full items-center justify-center border border-border bg-black"
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
      className="relative flex w-full max-w-full items-center justify-center overflow-hidden"
      style={{
        height: Math.round(
          config.canvasHeight * baseScale,
        ),
        touchAction: "none",
      }}
    >
      <div
        style={{
          width: config.canvasWidth,
          height: config.canvasHeight,
          transformOrigin: "center center",
          transform: `scale(${totalScale})`,
          transition: "transform 150ms ease-out",
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function KonvaStageInner({
  config,
  customizer,
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

  const [layerImgs, setLayerImgs] = useState<
    Record<string, HTMLImageElement>
  >({});

  useEffect(() => {
    const img = new window.Image();

    img.onload = () => {
      setMockupImg(img);
    };

    img.src = activeSurface.mockupSrc;
  }, [activeSurface.mockupSrc]);

  useEffect(() => {
    activeLayers.forEach((layer) => {
      if (layer.type !== "image") return;

      const current = layerImgs[layer.id];

      if (
        current &&
        current.src === layer.srcUrl
      ) {
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
    if (
      !transformerRef.current ||
      !stageRef.current
    ) {
      return;
    }

    if (
      !selectedLayer ||
      selectedLayer.locked ||
      !selectedLayer.visible
    ) {
      transformerRef.current.nodes([]);
      transformerRef.current
        .getLayer()
        ?.batchDraw();

      return;
    }

    const node = stageRef.current.findOne(
      `#${selectedLayer.id}`,
    );

    if (node) {
      transformerRef.current.nodes([node]);
    } else {
      transformerRef.current.nodes([]);
    }

    transformerRef.current
      .getLayer()
      ?.batchDraw();
  }, [
    selectedLayer?.id,
    selectedLayer?.locked,
    selectedLayer?.visible,
    state.activeSurfaceId,
    activeLayers.length,
    stageRef,
  ]);

  const { printArea } = activeSurface;

  const paX =
    printArea.xFraction * config.canvasWidth;

  const paY =
    printArea.yFraction * config.canvasHeight;

  const paW =
    printArea.widthFraction * config.canvasWidth;

  const paH =
    printArea.heightFraction * config.canvasHeight;

  const isEditMode =
    customizer.viewMode === "edit";

  const sortedLayers = [...activeLayers]
    .filter((layer) => layer.visible)
    .sort(
      (a, b) => a.zIndex - b.zIndex,
    );

  const contourPoints =
    printArea.shape?.type === "contour" &&
    printArea.shape.points
      ? printArea.shape.points.reduce<number[]>(
          (result, value, index) => {
            if (index % 2 === 0) {
              result.push(
                paX + value * paW,
              );
            } else {
              result.push(
                paY + value * paH,
              );
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
            paX +
              (points[index] ?? 0) *
                paW,
            paY +
              (points[index + 1] ?? 0) *
                paH,
          );
        }

        ctx.closePath();

        return;
      }

      if (
        shape?.type === "rounded"
      ) {
        const radius =
          typeof shape.cornerRadius ===
          "number"
            ? shape.cornerRadius
            : 12;

        ctx.beginPath();

        ctx.roundRect(
          paX,
          paY,
          paW,
          paH,
          radius,
        );

        ctx.closePath();

        return;
      }

      ctx.beginPath();

      ctx.rect(
        paX,
        paY,
        paW,
        paH,
      );

      ctx.closePath();
    },
    [
      printArea.shape,
      paX,
      paY,
      paW,
      paH,
    ],
  );

  const handleStageClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      if (
        event.target ===
        event.target.getStage()
      ) {
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

  const handleDragEnd = useCallback(
    (layer: DesignLayer) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event: any) => {
        if (layer.locked) return;

        dispatch({
          type: "UPDATE_LAYER",
          surfaceId:
            state.activeSurfaceId,
          layerId: layer.id,
          changes: {
            x: event.target.x(),
            y: event.target.y(),
          },
        });
      },
    [
      dispatch,
      state.activeSurfaceId,
    ],
  );

  const handleTransformEnd =
    useCallback(
      (layer: DesignLayer) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (event: any) => {
          if (layer.locked) return;

          const node = event.target;

          dispatch({
            type: "UPDATE_LAYER",
            surfaceId:
              state.activeSurfaceId,
            layerId: layer.id,
            changes: {
              x: node.x(),
              y: node.y(),
              scaleX: node.scaleX(),
              scaleY: node.scaleY(),
              rotation:
                node.rotation(),
            },
          });
        },
      [
        dispatch,
        state.activeSurfaceId,
      ],
    );

  return (
    <Stage
      ref={stageRef}
      width={config.canvasWidth}
      height={config.canvasHeight}
      onClick={handleStageClick}
      onTap={handleStageClick}
    >
      <Layer
        name="mockup-layer"
        listening={false}
      >
        {mockupImg && (
          <KonvaImage
            image={mockupImg}
            width={config.canvasWidth}
            height={config.canvasHeight}
          />
        )}
      </Layer>

      <Layer
        name="guide-layer"
        listening={false}
        visible={isEditMode}
      >
        {contourPoints ? (
          <Line
            points={contourPoints}
            closed
            stroke="#00c8ff"
            strokeWidth={2}
            dash={[7, 5]}
            lineJoin="round"
            fill="rgba(0,200,255,0.035)"
          />
        ) : (
          <Rect
            x={paX}
            y={paY}
            width={paW}
            height={paH}
            cornerRadius={
              typeof printArea.shape
                ?.cornerRadius ===
              "number"
                ? printArea.shape
                    .cornerRadius
                : 0
            }
            stroke="#00c8ff"
            strokeWidth={2}
            dash={[7, 5]}
            fill="rgba(0,200,255,0.035)"
          />
        )}
      </Layer>

      <Layer name="design-layer">
        <Group clipFunc={clipFunc}>
          {sortedLayers.map(
            (layer) => {
              if (
                layer.type === "image"
              ) {
                const image =
                  layerImgs[layer.id];

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
                    offsetX={
                      layer.width / 2
                    }
                    offsetY={
                      layer.height / 2
                    }
                    scaleX={layer.scaleX}
                    scaleY={layer.scaleY}
                    rotation={
                      layer.rotation
                    }
                    draggable={
                      !layer.locked &&
                      isEditMode
                    }
                    onClick={handleLayerClick(
                      layer.id,
                    )}
                    onTap={handleLayerClick(
                      layer.id,
                    )}
                    onDragEnd={handleDragEnd(
                      layer,
                    )}
                    onTransformEnd={handleTransformEnd(
                      layer,
                    )}
                  />
                );
              }

              if (
                layer.type === "text"
              ) {
                return (
                  <Text
                    key={layer.id}
                    id={layer.id}
                    text={layer.text}
                    x={layer.x}
                    y={layer.y}
                    width={layer.width}
                    fontSize={
                      layer.fontSize
                    }
                    fontFamily={
                      layer.fontFamily
                    }
                    fill={layer.fill}
                    fontStyle={
                      layer.fontStyle
                    }
                    align={layer.align}
                    scaleX={layer.scaleX}
                    scaleY={layer.scaleY}
                    rotation={
                      layer.rotation
                    }
                    draggable={
                      !layer.locked &&
                      isEditMode
                    }
                    onClick={handleLayerClick(
                      layer.id,
                    )}
                    onTap={handleLayerClick(
                      layer.id,
                    )}
                    onDragEnd={handleDragEnd(
                      layer,
                    )}
                    onTransformEnd={handleTransformEnd(
                      layer,
                    )}
                  />
                );
              }

              return null;
            },
          )}
        </Group>

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
            boundBoxFunc={(
              oldBox: any,
              newBox: any,
            ) => {
              if (
                Math.abs(
                  newBox.width,
                ) < 10 ||
                Math.abs(
                  newBox.height,
                ) < 10
              ) {
                return oldBox;
              }

              return newBox;
            }}
          />
        )}
      </Layer>

      <Layer
        name="overlay-layer"
        listening={false}
      >
        <Group clipFunc={clipFunc}>
          <Rect
            x={paX}
            y={paY}
            width={paW}
            height={paH * 0.45}
            fillLinearGradientStartPoint={{
              x: 0,
              y: 0,
            }}
            fillLinearGradientEndPoint={{
              x: paW,
              y: paH * 0.45,
            }}
            fillLinearGradientColorStops={[
              0,
              "rgba(255,255,255,0.17)",
              0.4,
              "rgba(255,255,255,0.05)",
              1,
              "rgba(255,255,255,0)",
            ]}
          />
        </Group>
      </Layer>
    </Stage>
  );
}
