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

import {
  fitArtworkToPrintArea,
  DEFAULT_CONTAIN_SCALE,
} from "@/lib/customizer/utils";

import type { ProductCustomizerHandle } from "@/hooks/useProductCustomizer";

interface CanvasEditorProps {
  config: ProductCustomizerConfig;
  customizer: ProductCustomizerHandle;
  baseColor?: string | undefined;
}

const SVG_REFERENCE_SIZE = 800;

function createScaledSvgPath(
  svgPath: string,
  canvasWidth: number,
  canvasHeight: number,
): Path2D | null {
  if (
    typeof Path2D === "undefined" ||
    typeof DOMMatrix === "undefined"
  ) {
    return null;
  }

  try {
    const sourcePath = new Path2D(svgPath);
    const scaledPath = new Path2D();

    const matrix = new DOMMatrix().scale(
      canvasWidth / SVG_REFERENCE_SIZE,
      canvasHeight / SVG_REFERENCE_SIZE,
    );

    scaledPath.addPath(sourcePath, matrix);

    return scaledPath;
  } catch {
    return null;
  }
}

export function CanvasEditor({
  config,
  customizer,
  baseColor,
}: CanvasEditorProps) {
  const [mounted, setMounted] =
    useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [KonvaLib, setKonvaLib] =
    useState<any>(null);

  const stageViewportRef =
    useRef<HTMLDivElement>(null);

  const [size, setSize] =
    useState<{
      width: number;
      height: number;
    }>({
      width: 0,
      height: 0,
    });

  useEffect(() => {
    setMounted(true);

    import("react-konva").then(
      setKonvaLib,
    );
  }, []);

  useEffect(() => {
    const element =
      stageViewportRef.current;

    if (!element) return;

    const measure = () => {
      const rect =
        element.getBoundingClientRect();

      if (
        rect.width > 0 &&
        rect.height > 0
      ) {
        setSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    measure();

    const observer =
      new ResizeObserver(measure);

    observer.observe(element);

    window.addEventListener(
      "resize",
      measure,
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        measure,
      );
    };
  }, []);

  /*
   * IMPORTANTE:
   * As barras NÃO retiram espaço ao canvas.
   * O canvas continua a usar praticamente a área toda.
   */
  const PADDING = 18;

  const availableWidth =
    Math.max(
      0,
      size.width - PADDING * 2,
    );

  const availableHeight =
    Math.max(
      0,
      size.height - PADDING * 2,
    );

  const baseScale =
    availableWidth > 0 &&
    availableHeight > 0
      ? Math.min(
          availableWidth /
            config.canvasWidth,

          availableHeight /
            config.canvasHeight,
        )
      : 0;

  const zoom =
    customizer.zoom ?? 1;

  const totalScale =
    baseScale * zoom;

  const selectedLayer =
    customizer.selectedLayer;

  const controlsVisible =
    Boolean(selectedLayer) &&
    customizer.viewMode === "edit";

  const selectedScale =
    selectedLayer
      ? Math.max(
          0.1,
          Math.abs(
            selectedLayer.scaleX ??
              1,
          ),
        )
      : 1;

  const selectedScalePercent =
    Math.round(
      selectedScale * 100,
    );

  const selectedRotation =
    Math.round(
      selectedLayer?.rotation ??
        0,
    );

  const sliderScaleValue =
    Math.min(
      800,
      Math.max(
        10,
        selectedScalePercent,
      ),
    );

  const updateSelectedScale =
    useCallback(
      (percent: number) => {
        const layer =
          customizer.selectedLayer;

        if (
          !layer ||
          layer.locked
        ) {
          return;
        }

        const scale =
          Math.min(
            8,
            Math.max(
              0.1,
              percent / 100,
            ),
          );

        customizer.updateLayer(
          layer.id,
          {
            scaleX: scale,
            scaleY: scale,
          },
        );
      },
      [customizer],
    );

  const updateSelectedRotation =
    useCallback(
      (rotation: number) => {
        const layer =
          customizer.selectedLayer;

        if (
          !layer ||
          layer.locked
        ) {
          return;
        }

        customizer.updateLayer(
          layer.id,
          {
            rotation,
          },
        );
      },
      [customizer],
    );

  const handleWheel =
    useCallback(
      (
        event: React.WheelEvent,
      ) => {
        if (
          !event.ctrlKey &&
          !event.metaKey
        ) {
          return;
        }

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
      onWheel={handleWheel}
      className="relative h-full min-h-[300px] w-full min-w-0 overflow-hidden"
      style={{
        touchAction: "none",
      }}
    >
      {/* CANVAS — ocupa novamente praticamente a altura TODA */}
      <div
        ref={stageViewportRef}
        className="absolute inset-0"
      >
        {!mounted ||
        !KonvaLib ||
        baseScale === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              A carregar editor…
            </span>
          </div>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-200"
            style={{
              /*
               * Com as barras visíveis, só deslocamos a peça
               * ligeiramente para cima.
               *
               * NÃO reduzimos o scale.
               */
              transform: controlsVisible
                ? "translateY(-32px)"
                : "translateY(0px)",
            }}
          >
            <div
              style={{
                width:
                  config.canvasWidth,

                height:
                  config.canvasHeight,

                flex: "0 0 auto",

                transformOrigin:
                  "center center",

                transform: `scale(${totalScale})`,

                transition:
                  "transform 150ms ease-out",
              }}
            >
              <KonvaStageInner
                config={config}
                customizer={
                  customizer
                }
                baseColor={
                  baseColor
                }
                KonvaLib={
                  KonvaLib
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* BARRAS — flutuam por cima da zona inferior, sem encolher o canvas */}
      {controlsVisible &&
        selectedLayer && (
          <div className="absolute bottom-[78px] left-1/2 z-30 w-[min(86%,540px)] -translate-x-1/2 rounded-xl border border-white/10 bg-zinc-950/95 px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.55)] backdrop-blur-md">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* TAMANHO */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-wider text-zinc-400">
                    Tamanho
                  </span>

                  <span className="min-w-[48px] text-right font-mono text-[0.65rem] font-semibold text-cyan-300">
                    {selectedScalePercent}%
                  </span>
                </div>

                <input
                  type="range"
                  min={10}
                  max={800}
                  step={1}
                  value={
                    sliderScaleValue
                  }
                  disabled={
                    selectedLayer.locked
                  }
                  onChange={(event) =>
                    updateSelectedScale(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                  className="
                    h-1.5
                    w-full
                    cursor-pointer
                    appearance-none
                    rounded-full
                    bg-white/10
                    outline-none

                    [&::-webkit-slider-thumb]:h-3.5
                    [&::-webkit-slider-thumb]:w-3.5
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:border
                    [&::-webkit-slider-thumb]:border-cyan-200
                    [&::-webkit-slider-thumb]:bg-cyan-400
                    [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(34,211,238,0.6)]

                    [&::-moz-range-thumb]:h-3.5
                    [&::-moz-range-thumb]:w-3.5
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:border
                    [&::-moz-range-thumb]:border-cyan-200
                    [&::-moz-range-thumb]:bg-cyan-400

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                  aria-label="Tamanho do elemento selecionado"
                />
              </div>

              {/* ROTAÇÃO */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-wider text-zinc-400">
                    Rotação
                  </span>

                  <span className="min-w-[48px] text-right font-mono text-[0.65rem] font-semibold text-cyan-300">
                    {selectedRotation}°
                  </span>
                </div>

                <input
                  type="range"
                  min={-180}
                  max={180}
                  step={1}
                  value={Math.min(
                    180,
                    Math.max(
                      -180,
                      selectedRotation,
                    ),
                  )}
                  disabled={
                    selectedLayer.locked
                  }
                  onChange={(event) =>
                    updateSelectedRotation(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                  className="
                    h-1.5
                    w-full
                    cursor-pointer
                    appearance-none
                    rounded-full
                    bg-white/10
                    outline-none

                    [&::-webkit-slider-thumb]:h-3.5
                    [&::-webkit-slider-thumb]:w-3.5
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:border
                    [&::-webkit-slider-thumb]:border-cyan-200
                    [&::-webkit-slider-thumb]:bg-cyan-400
                    [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(34,211,238,0.6)]

                    [&::-moz-range-thumb]:h-3.5
                    [&::-moz-range-thumb]:w-3.5
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:border
                    [&::-moz-range-thumb]:border-cyan-200
                    [&::-moz-range-thumb]:bg-cyan-400

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                  aria-label="Rotação do elemento selecionado"
                />
              </div>
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
  const transformerRef =
    useRef<any>(null);

  const [
    mockupImg,
    setMockupImg,
  ] =
    useState<HTMLImageElement | null>(
      null,
    );

  const [
    shadeImg,
    setShadeImg,
  ] =
    useState<HTMLImageElement | null>(
      null,
    );

  const [
    layerImgs,
    setLayerImgs,
  ] = useState<
    Record<
      string,
      HTMLImageElement
    >
  >({});

  const [snap, setSnap] =
    useState<{
      v: boolean;
      h: boolean;
    }>({
      v: false,
      h: false,
    });

  useEffect(() => {
    const img =
      new window.Image();

    img.onload = () => {
      setMockupImg(img);
    };

    img.src =
      activeSurface.mockupSrc;
  }, [
    activeSurface.mockupSrc,
  ]);

  const shadeSrc =
    activeSurface.mockup
      ?.overlaySrc;

  useEffect(() => {
    if (!shadeSrc) {
      setShadeImg(null);
      return;
    }

    const img =
      new window.Image();

    img.onload = () => {
      setShadeImg(img);
    };

    img.src = shadeSrc;
  }, [shadeSrc]);

  const {
    printArea,
  } = activeSurface;

  const paX =
    printArea.xFraction *
    config.canvasWidth;

  const paY =
    printArea.yFraction *
    config.canvasHeight;

  const paW =
    printArea.widthFraction *
    config.canvasWidth;

  const paH =
    printArea.heightFraction *
    config.canvasHeight;

  const centerX =
    paX + paW / 2;

  const centerY =
    paY + paH / 2;

  const shape =
    printArea.shape;

  const svgPathData =
    shape?.type ===
    "svg-path"
      ? shape.svgPath
      : undefined;

  useEffect(() => {
    activeLayers.forEach(
      (layer) => {
        if (
          layer.type !==
          "image"
        ) {
          return;
        }

        const current =
          layerImgs[layer.id];

        if (
          current &&
          current.src ===
            layer.srcUrl
        ) {
          return;
        }

        const img =
          new window.Image();

        img.onload = () => {
          setLayerImgs(
            (previous) => ({
              ...previous,

              [layer.id]:
                img,
            }),
          );

          if (
            img.naturalWidth >
              0 &&
            img.naturalHeight >
              0
          ) {
            const currentRatio =
              layer.width /
              (layer.height ||
                1);

            const realRatio =
              img.naturalWidth /
              img.naturalHeight;

            if (
              Math.abs(
                currentRatio -
                  realRatio,
              ) > 0.03 ||
              !layer.naturalWidth
            ) {
              const fit =
                fitArtworkToPrintArea(
                  img.naturalWidth,
                  img.naturalHeight,
                  printArea,
                  config.canvasWidth,
                  config.canvasHeight,
                  "contain",
                  DEFAULT_CONTAIN_SCALE,
                );

              dispatch({
                type: "UPDATE_LAYER",

                surfaceId:
                  state.activeSurfaceId,

                layerId:
                  layer.id,

                changes: {
                  width:
                    fit.width,

                  height:
                    fit.height,

                  naturalWidth:
                    img.naturalWidth,

                  naturalHeight:
                    img.naturalHeight,

                  x: fit.x,

                  y: fit.y,

                  scaleX: 1,

                  scaleY: 1,
                },
              });
            }
          }
        };

        img.src =
          layer.srcUrl;
      },
    );
  }, [
    activeLayers,
    layerImgs,
    paW,
    paH,
    paX,
    paY,
    printArea,
    config.canvasWidth,
    config.canvasHeight,
    dispatch,
    state.activeSurfaceId,
  ]);

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
      transformerRef.current.nodes(
        [],
      );

      transformerRef.current
        .getLayer()
        ?.batchDraw();

      return;
    }

    const node =
      stageRef.current.findOne(
        `#${selectedLayer.id}`,
      );

    if (node) {
      transformerRef.current.nodes(
        [node],
      );

      transformerRef.current.update();
    } else {
      transformerRef.current.nodes(
        [],
      );
    }

    transformerRef.current
      .getLayer()
      ?.batchDraw();
  }, [
    selectedLayer?.id,
    selectedLayer?.locked,
    selectedLayer?.visible,
    selectedLayer?.x,
    selectedLayer?.y,
    selectedLayer?.width,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (selectedLayer as any)
      ?.height,
    selectedLayer?.scaleX,
    selectedLayer?.scaleY,
    selectedLayer?.rotation,
    state.activeSurfaceId,
    activeLayers.length,
    layerImgs,
    stageRef,
  ]);

  const isEditMode =
    customizer.viewMode ===
    "edit";

  const showGuides =
    Boolean(selectedLayer) ||
    activeLayers.length === 0;

  const sortedLayers = [
    ...activeLayers,
  ]
    .filter(
      (layer) =>
        layer.visible,
    )
    .sort(
      (a, b) =>
        a.zIndex - b.zIndex,
    );

  const contourPoints =
    shape?.type ===
      "contour" &&
    shape.points
      ? shape.points.reduce<
          number[]
        >(
          (
            result,
            value,
            index,
          ) => {
            if (
              index % 2 ===
              0
            ) {
              result.push(
                paX +
                  value * paW,
              );
            } else {
              result.push(
                paY +
                  value * paH,
              );
            }

            return result;
          },
          [],
        )
      : null;

  const clipFunc =
    useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ctx: any) => {
        if (
          shape?.type ===
            "svg-path" &&
          shape.svgPath
        ) {
          const scaledPath =
            createScaledSvgPath(
              shape.svgPath,

              config.canvasWidth,

              config.canvasHeight,
            );

          if (scaledPath) {
            return [
              scaledPath,
              "nonzero",
            ] as [
              Path2D,
              CanvasFillRule,
            ];
          }
        }

        if (
          shape?.type ===
            "contour" &&
          shape.points &&
          shape.points.length >=
            6
        ) {
          const points =
            shape.points;

          ctx.beginPath();

          ctx.moveTo(
            paX +
              (points[0] ??
                0) *
                paW,

            paY +
              (points[1] ??
                0) *
                paH,
          );

          for (
            let index = 2;
            index <
            points.length;
            index += 2
          ) {
            ctx.lineTo(
              paX +
                (points[
                  index
                ] ??
                  0) *
                  paW,

              paY +
                (points[
                  index + 1
                ] ??
                  0) *
                  paH,
            );
          }

          ctx.closePath();

          return;
        }

        if (
          shape?.type ===
          "rounded"
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
        shape,
        paX,
        paY,
        paW,
        paH,
        config.canvasWidth,
        config.canvasHeight,
      ],
    );

  const handleStageClick =
    useCallback(
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

  const handleLayerClick =
    useCallback(
      (layerId: string) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (event: any) => {
          event.cancelBubble =
            true;

          selectLayer(layerId);
        },
      [selectLayer],
    );

  const handleDragMove =
    useCallback(
      (layer: DesignLayer) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (event: any) => {
          const node =
            event.target;

          const tolerance =
            10;

          const nodeW =
            node.width() *
            node.scaleX();

          const nodeH =
            node.height() *
            node.scaleY();

          const cx =
            node.x() +
            nodeW / 2;

          const cy =
            node.y() +
            nodeH / 2;

          let snapV =
            false;

          let snapH =
            false;

          if (
            Math.abs(
              cx -
                centerX,
            ) < tolerance
          ) {
            node.x(
              node.x() +
                (centerX -
                  cx),
            );

            snapV =
              true;
          }

          if (
            Math.abs(
              cy -
                centerY,
            ) < tolerance
          ) {
            node.y(
              node.y() +
                (centerY -
                  cy),
            );

            snapH =
              true;
          }

          setSnap(
            (previous) =>
              previous.v ===
                snapV &&
              previous.h ===
                snapH
                ? previous
                : {
                    v: snapV,
                    h: snapH,
                  },
          );
        },
      [
        centerX,
        centerY,
      ],
    );

  const handleDragEnd =
    useCallback(
      (layer: DesignLayer) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (event: any) => {
          setSnap({
            v: false,
            h: false,
          });

          if (
            layer.locked
          ) {
            return;
          }

          dispatch({
            type: "UPDATE_LAYER",

            surfaceId:
              state.activeSurfaceId,

            layerId:
              layer.id,

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
          if (
            layer.locked
          ) {
            return;
          }

          const node =
            event.target;

          dispatch({
            type: "UPDATE_LAYER",

            surfaceId:
              state.activeSurfaceId,

            layerId:
              layer.id,

            changes: {
              x: node.x(),

              y: node.y(),

              scaleX:
                node.scaleX(),

              scaleY:
                node.scaleY(),

              rotation:
                ((node.rotation() +
                  180) %
                  360 +
                  360) %
                  360 -
                180,
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
      width={
        config.canvasWidth
      }
      height={
        config.canvasHeight
      }
      onClick={
        handleStageClick
      }
      onTap={
        handleStageClick
      }
    >
      <Layer
        name="mockup-layer"
        listening={false}
      >
        {baseColor &&
          baseColor.toLowerCase() !==
            "#ffffff" &&
          (activeSurface.mockup
            ?.silhouettePath ? (
            <KonvaPath
              data={
                activeSurface.mockup
                  .silhouettePath
              }
              scaleX={
                config.canvasWidth /
                SVG_REFERENCE_SIZE
              }
              scaleY={
                config.canvasHeight /
                SVG_REFERENCE_SIZE
              }
              fill={
                baseColor
              }
            />
          ) : (
            <Rect
              x={0}
              y={0}
              width={
                config.canvasWidth
              }
              height={
                config.canvasHeight
              }
              fill={
                baseColor
              }
            />
          ))}

        {mockupImg && (
          <KonvaImage
            image={
              mockupImg
            }
            width={
              config.canvasWidth
            }
            height={
              config.canvasHeight
            }
            globalCompositeOperation={
              baseColor &&
              baseColor.toLowerCase() !==
                "#ffffff"
                ? "multiply"
                : "source-over"
            }
          />
        )}
      </Layer>

      <Layer
        name="guide-layer"
        listening={false}
        visible={
          isEditMode &&
          showGuides
        }
        opacity={
          selectedLayer
            ? 0.95
            : 0.65
        }
      >
        {svgPathData ? (
          <KonvaPath
            data={
              svgPathData
            }
            scaleX={
              config.canvasWidth /
              SVG_REFERENCE_SIZE
            }
            scaleY={
              config.canvasHeight /
              SVG_REFERENCE_SIZE
            }
            stroke="rgba(0, 200, 255, 0.75)"
            strokeWidth={2}
            dash={[
              6,
              5,
            ]}
            lineJoin="round"
            listening={false}
          />
        ) : contourPoints ? (
          <Line
            points={
              contourPoints
            }
            closed
            stroke="rgba(0, 200, 255, 0.75)"
            strokeWidth={
              1.5
            }
            dash={[
              5,
              5,
            ]}
            lineJoin="round"
          />
        ) : (
          <Rect
            x={paX}
            y={paY}
            width={paW}
            height={paH}
            cornerRadius={
              typeof shape
                ?.cornerRadius ===
              "number"
                ? shape.cornerRadius
                : 8
            }
            stroke="rgba(0, 200, 255, 0.75)"
            strokeWidth={
              1.5
            }
            dash={[
              5,
              5,
            ]}
          />
        )}
      </Layer>

      <Layer name="design-layer">
        <Group
          clipFunc={
            clipFunc
          }
        >
          {sortedLayers.map(
            (layer) => {
              if (
                layer.type ===
                "image"
              ) {
                const image =
                  layerImgs[
                    layer.id
                  ];

                if (!image) {
                  return null;
                }

                return (
                  <KonvaImage
                    key={
                      layer.id
                    }
                    id={
                      layer.id
                    }
                    image={
                      image
                    }
                    x={
                      layer.x
                    }
                    y={
                      layer.y
                    }
                    width={
                      layer.width
                    }
                    height={
                      layer.height
                    }
                    scaleX={
                      layer.scaleX
                    }
                    scaleY={
                      layer.scaleY
                    }
                    rotation={
                      layer.rotation
                    }
                    opacity={1}
                    globalCompositeOperation="source-over"
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
                    onDragMove={handleDragMove(
                      layer,
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
                layer.type ===
                "text"
              ) {
                return (
                  <Text
                    key={
                      layer.id
                    }
                    id={
                      layer.id
                    }
                    text={
                      layer.text
                    }
                    x={
                      layer.x
                    }
                    y={
                      layer.y
                    }
                    width={
                      layer.width
                    }
                    fontSize={
                      layer.fontSize
                    }
                    fontFamily={
                      layer.fontFamily
                    }
                    fill={
                      layer.fill
                    }
                    fontStyle={
                      layer.fontStyle
                    }
                    align={
                      layer.align
                    }
                    scaleX={
                      layer.scaleX
                    }
                    scaleY={
                      layer.scaleY
                    }
                    rotation={
                      layer.rotation
                    }
                    opacity={1}
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
                    onDragMove={handleDragMove(
                      layer,
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

        {isEditMode &&
          snap.v && (
            <Line
              points={[
                centerX,
                paY,
                centerX,
                paY +
                  paH,
              ]}
              stroke="rgba(255,255,255,0.65)"
              strokeWidth={
                1.5
              }
              dash={[
                6,
                4,
              ]}
              listening={
                false
              }
            />
          )}

        {isEditMode &&
          snap.h && (
            <Line
              points={[
                paX,
                centerY,
                paX +
                  paW,
                centerY,
              ]}
              stroke="rgba(255,255,255,0.65)"
              strokeWidth={
                1.5
              }
              dash={[
                6,
                4,
              ]}
              listening={
                false
              }
            />
          )}

        {isEditMode && (
          <Transformer
            name="selection-transformer"
            ref={
              transformerRef
            }
            borderStroke="rgba(255,255,255,0.95)"
            borderStrokeWidth={
              1
            }
            borderDash={[
              3,
              3,
            ]}
            anchorFill="#ffffff"
            anchorStroke="#00c8ed"
            anchorStrokeWidth={
              1
            }
            anchorSize={
              9
            }
            anchorCornerRadius={
              5
            }
            rotateEnabled
            rotateAnchorOffset={
              24
            }
            rotationSnaps={[
              0,
              15,
              30,
              45,
              60,
              75,
              90,
              105,
              120,
              135,
              150,
              165,
              180,
              195,
              210,
              225,
              240,
              255,
              270,
              285,
              300,
              315,
              330,
              345,
            ]}
            rotationSnapTolerance={
              6
            }
            keepRatio
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
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
        {shadeImg && (
          <KonvaImage
            image={
              shadeImg
            }
            width={
              config.canvasWidth
            }
            height={
              config.canvasHeight
            }
            globalCompositeOperation="multiply"
          />
        )}
      </Layer>
    </Stage>
  );
}
