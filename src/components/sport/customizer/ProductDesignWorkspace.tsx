import { useEffect, useRef, useState } from "react";
import type Konva from "konva";
import { Link } from "@tanstack/react-router";
import {
  Upload,
  Sparkles,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Trash2,
  Check,
  ShoppingBag,
  Paperclip,
  CheckCircle2,
  X,
  Layers,
  RotateCw,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  Copy,
  Type,
  AlignCenterHorizontal,
  AlignCenterVertical,
  Target,
} from "lucide-react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { CanvasEditor } from "./CanvasEditor";
import { SingleSurfacePreviewCanvas } from "./DualShinGuardPreview";
import { ColorWheel } from "./ColorWheel";
import { VinilartHelpPanel } from "./VinilartHelpPanel";

import { useProductCustomizer } from "@/hooks/useProductCustomizer";
import { useCart } from "@/lib/cart/store";

import type { CartItem, AttachmentItem } from "@/lib/cart/types";
import type { ProductCustomizerConfig } from "@/lib/customizer/types";
import type { Product } from "@/lib/sport-data";

const surfaceLabel = (
  id: string,
  fallback: string,
) => {
  if (id === "LEFT") return "Lado Esquerdo";
  if (id === "RIGHT") return "Lado Direito";
  if (id === "FRONT") return "Frente";
  if (id === "BACK") return "Costas";

  return fallback;
};

import {
  CUSTOMIZER_SCHEMA_VERSION,
  getDefaultColor,
  getSizeOptions,
} from "@/lib/customizer/views";

import { serializeCustomizerConfig } from "@/lib/customizer/wp/config-schema";

import { productPriceBadge } from "@/lib/content/pricing";

interface ProductDesignWorkspaceProps {
  config: ProductCustomizerConfig;
  product: Product;
  item?: CartItem | undefined;
  initialMethod?: "design" | "ajuda" | undefined;
}

export function ProductDesignWorkspace({
  config,
  product,
  item,
  initialMethod = "design",
}: ProductDesignWorkspaceProps) {
  const c = useProductCustomizer(
    config,
    {
      initialDesignJson:
        item?.customizerDesign,
    },
  );

  const cart = useCart();

  // Tamanhos e cor base vêm da configuração do produto.
  const sizes = getSizeOptions(config);

  const [
    selectedSize,
    setSelectedSize,
  ] = useState<string>(
    item?.variant ||
      sizes[0] ||
      "Tamanho Único",
  );

  const defaultColor =
    getDefaultColor(config);

  const [
    selectedColor,
    setSelectedColor,
  ] = useState<string>(defaultColor);

  const [
    customHex,
    setCustomHex,
  ] = useState<string>(defaultColor);

  const [
    method,
    setMethod,
  ] = useState<
    "design" | "ajuda"
  >(
    item
      ? item.mode === "ajuda"
        ? "ajuda"
        : "design"
      : initialMethod,
  );

  const [same, setSame] =
    useState<boolean>(() => {
      try {
        return Boolean(
          JSON.parse(
            item?.customizerDesign ??
              "{}",
          ).sameDesign,
        );
      } catch {
        return (
          config.surfaces.length ===
          2
        );
      }
    });

  const [
    helpRequestedText,
    setHelpRequestedText,
  ] = useState<string>(
    item?.serviceDetails?.requestedText ||
      "",
  );

  const [
    helpIdea,
    setHelpIdea,
  ] = useState<string>(
    item?.serviceDetails?.designNotes ||
      item?.serviceDetails?.notes ||
      item?.serviceDetails?.description ||
      "",
  );

  const [
    helpContact,
    setHelpContact,
  ] = useState<string>(
    item?.serviceDetails?.contact ||
      item?.serviceDetails?.userContact ||
      "",
  );

  const [
    helpAttachments,
    setHelpAttachments,
  ] = useState<AttachmentItem[]>(
    item?.serviceDetails?.attachments || [],
  );

  const [
    helpContactError,
    setHelpContactError,
  ] = useState<string>("");

  const [
    quantity,
    setQuantity,
  ] = useState<number>(
    item?.quantity ?? 1,
  );

  const [designNote, setDesignNote] = useState<string>(
    item?.serviceDetails?.notes ||
      item?.serviceDetails?.description ||
      "",
  );

  const [busy, setBusy] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

  const [
    addedSuccess,
    setAddedSuccess,
  ] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [konva, setKonva] =
    useState<any>(null);

  const stages = useRef<
    Record<
      string,
      Konva.Stage | null
    >
  >({});

  useEffect(() => {
    import("react-konva").then(
      setKonva,
    );
  }, []);

  const signature =
    JSON.stringify(
      c.activeLayers,
    );

  useEffect(() => {
    if (
      same &&
      config.surfaces.length === 2
    ) {
      const other =
        config.surfaces.find(
          (s) =>
            s.id !==
            c.state
              .activeSurfaceId,
        );

      if (other) {
        c.syncSurface(
          c.state
            .activeSurfaceId,
          other.id,
        );
      }
    }
  }, [
    same,
    signature,
    c.state.activeSurfaceId,
    config,
    c.syncSurface,
  ]);

  async function handleFileUpload(
    file: File | undefined,
    surfaceId: string,
    replace = false,
  ) {
    if (!file) return;

    setBusy(true);
    setError("");
    setAddedSuccess(false);

    try {
      await c.addImageFromFile(
        file,
        surfaceId,
        replace,
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Falha ao carregar imagem.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function generateThumbnail() {
    try {
      const sources =
        config.surfaces.map(
          (s) =>
            s.id ===
            c.state.activeSurfaceId
              ? c.exportCustomerPreview()
              : stages.current[
                  s.id
                ]?.toDataURL({
                  pixelRatio: 1,
                }),
        );

      const validSources =
        sources.filter(
          Boolean,
        ) as string[];

      if (!validSources.length) {
        return undefined;
      }

      const images =
        await Promise.all(
          validSources.map(
            (src) =>
              new Promise<
                HTMLImageElement
              >(
                (
                  resolve,
                  reject,
                ) => {
                  const img =
                    new Image();

                  img.onload =
                    () =>
                      resolve(
                        img,
                      );

                  img.onerror =
                    reject;

                  img.src =
                    src;
                },
              ),
          ),
        );

      const canvas =
        document.createElement(
          "canvas",
        );

      canvas.width =
        320 * images.length;

      canvas.height = 320;

      const ctx =
        canvas.getContext(
          "2d",
        );

      if (!ctx) {
        return undefined;
      }

      ctx.fillStyle =
        "#0b0e14";

      ctx.fillRect(
        0,
        0,
        canvas.width,
        320,
      );

      images.forEach(
        (img, i) =>
          ctx.drawImage(
            img,
            i * 320,
            0,
            320,
            320,
          ),
      );

      return canvas.toDataURL(
        "image/jpeg",
        0.85,
      );
    } catch {
      return undefined;
    }
  }

  async function handleAddToCart() {
    setBusy(true);
    setError("");

    try {
      if (
        method === "design"
      ) {
        const serialized =
          await c.persistDesign();

        const customizerDesign =
          JSON.stringify({
            ...JSON.parse(
              serialized,
            ),

            sameDesign:
              same,
          });

        const previewDataUrl =
          await generateThumbnail();

        const options = {
          quantity,
          variant:
            selectedSize,
          customizerDesign,
          previewDataUrl,
          mode: "design" as const,
          // Snapshot imutável: a encomenda guarda a configuração usada.
          configVersion:
            config.schemaVersion ??
            CUSTOMIZER_SCHEMA_VERSION,
          configSnapshot:
            JSON.stringify(
              serializeCustomizerConfig(
                config,
              ),
            ),
          serviceDetails: designNote.trim()
            ? {
                itemOrServiceType: product.name,
                notes: designNote.trim(),
                description: designNote.trim(),
                designNotes: designNote.trim(),
                quantity,
                approxDimensions: selectedSize,
              }
            : undefined,
        };

        if (item) {
          cart.updateItem(
            item.id,
            options,
          );
        } else {
          cart.addItem(
            config.id,
            product.name,
            options,
          );
        }
      } else {
        if (!helpContact.trim()) {
          setHelpContactError(
            "Indica um WhatsApp ou e-mail para podermos contactar-te.",
          );
          setError(
            "Indica um WhatsApp ou e-mail para podermos contactar-te.",
          );
          setBusy(false);
          return;
        }

        setHelpContactError("");

        const previewDataUrl =
          c.activeLayers.length > 0
            ? await generateThumbnail()
            : helpAttachments.find((a) => a.previewUrl)?.previewUrl ||
              undefined;

        const options = {
          quantity,
          variant: selectedSize,
          previewDataUrl,
          mode: "ajuda" as const,
          serviceDetails: {
            itemOrServiceType: product.name,
            personalizationMode: "vinilart-help" as const,
            contact: helpContact.trim(),
            userContact: helpContact.trim(),
            requestedText: helpRequestedText.trim() || undefined,
            designNotes: helpIdea.trim() || undefined,
            notes:
              helpIdea.trim() ||
              helpRequestedText.trim() ||
              undefined,
            description: helpIdea.trim() || undefined,
            attachments: helpAttachments,
            fileName:
              helpAttachments
                .map((f) => f.fileName)
                .join(", ") || undefined,
            fileKey:
              helpAttachments[0]?.fileKey ||
              undefined,
            approxDimensions: selectedSize,
            quantity,
          },
        };

        if (item) {
          cart.updateItem(
            item.id,
            options,
          );
        } else {
          cart.addItem(
            config.id,
            product.name,
            options,
          );
        }
      }

      setAddedSuccess(true);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Erro ao adicionar ao carrinho.",
      );
    } finally {
      setBusy(false);
    }
  }

  function toggleSurface() {
    if (
      config.surfaces.length <
      2
    ) {
      return;
    }

    const currentIndex =
      config.surfaces.findIndex(
        (s) =>
          s.id ===
          c.state
            .activeSurfaceId,
      );

    const nextIndex =
      (currentIndex + 1) %
      config.surfaces.length;

    const nextSurface =
      config.surfaces[
        nextIndex
      ];

    if (nextSurface) {
      c.setSurface(
        nextSurface.id,
      );

      const artwork =
        c.state.surfaces[
          nextSurface.id
        ]?.layers.find(
          (l) =>
            l.visible &&
            !l.locked,
        );

      if (artwork) {
        c.dispatch({
          type: "SELECT_LAYER",
          surfaceId:
            nextSurface.id,
          layerId:
            artwork.id,
        });
      }
    }
  }

  const activeSurfaceObj =
    config.surfaces.find(
      (s) =>
        s.id ===
        c.state.activeSurfaceId,
    ) ||
    config.surfaces[0]!;

  const hasArtOnActiveSurface =
    (c.state.surfaces[
      c.state
        .activeSurfaceId
    ]?.layers.length ??
      0) > 0;

  const selectedLayer =
    c.selectedLayer;

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

  const sliderScaleValue =
    Math.min(
      800,
      Math.max(
        10,
        selectedScalePercent,
      ),
    );

  const selectedRotation =
    Math.round(
      selectedLayer?.rotation ??
        0,
    );

  const updateSelectedScale = (
    percent: number,
  ) => {
    if (
      !selectedLayer ||
      selectedLayer.locked
    ) {
      return;
    }

    const scale = Math.min(
      8,
      Math.max(
        0.1,
        percent / 100,
      ),
    );

    c.updateLayer(
      selectedLayer.id,
      {
        scaleX: scale,
        scaleY: scale,
      },
    );
  };

  const updateSelectedRotation =
    (rotation: number) => {
      if (
        !selectedLayer ||
        selectedLayer.locked
      ) {
        return;
      }

      c.updateLayer(
        selectedLayer.id,
        {
          rotation,
        },
      );
    };

  return (
    <div className="w-full space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col items-center w-full">
          <div className="flex flex-col items-center justify-center relative min-h-[600px] w-full p-6 lg:p-10 rounded-3xl bg-[#111622] border border-white/5 shadow-2xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-cyan-500/[0.07] via-transparent to-transparent blur-xl" />

            <div className="absolute top-4 left-4 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/80 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />

              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-300">
                {surfaceLabel(
                  activeSurfaceObj.id,
                  activeSurfaceObj.label,
                )}
              </span>

              {config
                .surfaces
                .length >
                1 && (
                <span className="font-mono text-[0.65rem] text-zinc-500">
                  (
                  {config.surfaces.findIndex(
                    (s) =>
                      s.id ===
                      activeSurfaceObj.id,
                  ) + 1}
                  /
                  {
                    config
                      .surfaces
                      .length
                  }
                  )
                </span>
              )}
            </div>

            <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] flex items-center justify-center">
              {config.surfaces.map(
                (s) => {
                  const isActive =
                    c.state
                      .activeSurfaceId ===
                    s.id;

                  return (
                    <div
                      key={
                        s.id
                      }
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                        isActive
                          ? "opacity-100 z-10"
                          : "opacity-0 pointer-events-none z-0"
                      }`}
                    >
                      {isActive ? (
                        <CanvasEditor
                          config={
                            config
                          }
                          customizer={
                            c
                          }
                          baseColor={
                            selectedColor
                          }
                        />
                      ) : konva ? (
                        <SingleSurfacePreviewCanvas
                          config={
                            config
                          }
                          surface={
                            s
                          }
                          customizer={
                            c
                          }
                          baseColor={
                            selectedColor
                          }
                          KonvaLib={
                            konva
                          }
                          stageRef={(
                            stage,
                          ) => {
                            stages.current[
                              s.id
                            ] =
                              stage;
                          }}
                        />
                      ) : (
                        <img
                          src={
                            s.mockupSrc
                          }
                          alt={surfaceLabel(
                            s.id,
                            s.label,
                          )}
                          className="max-h-[85%] max-w-[85%] object-contain"
                        />
                      )}
                    </div>
                  );
                },
              )}
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 sm:gap-1.5 rounded-full border border-white/15 bg-zinc-950/90 px-3 py-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.85)] backdrop-blur-md max-w-[95vw] overflow-x-auto">
              <button
                type="button"
                onClick={() =>
                  c.smartFit()
                }
                disabled={
                  !c.selectedLayer
                }
                title="Ajustar à área útil (conter)"
                aria-label="Ajustar"
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-zinc-300 transition-all hover:bg-white/10 hover:text-cyan-400 disabled:opacity-30 disabled:pointer-events-none"
              >
                <Target
                  size={
                    15
                  }
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  c.coverFit()
                }
                disabled={
                  !c.selectedLayer
                }
                title="Preencher área útil (cobrir)"
                aria-label="Preencher"
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-zinc-300 transition-all hover:bg-white/10 hover:text-cyan-400 disabled:opacity-30 disabled:pointer-events-none"
              >
                <Maximize2
                  size={
                    15
                  }
                />
              </button>

              <div className="h-4 w-px bg-white/10 shrink-0" />

              <button
                type="button"
                onClick={() =>
                  c.alignSelected(
                    "horizontal",
                  )
                }
                disabled={
                  !c.selectedLayer
                }
                title="Centrar horizontalmente"
                aria-label="Centrar horizontal"
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-zinc-300 transition-all hover:bg-white/10 hover:text-cyan-400 disabled:opacity-30 disabled:pointer-events-none"
              >
                <AlignCenterHorizontal
                  size={
                    15
                  }
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  c.alignSelected(
                    "vertical",
                  )
                }
                disabled={
                  !c.selectedLayer
                }
                title="Centrar verticalmente"
                aria-label="Centrar vertical"
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-zinc-300 transition-all hover:bg-white/10 hover:text-cyan-400 disabled:opacity-30 disabled:pointer-events-none"
              >
                <AlignCenterVertical
                  size={
                    15
                  }
                />
              </button>

              <div className="h-4 w-px bg-white/10 shrink-0" />

              <button
                type="button"
                onClick={() => {
                  if (
                    c.selectedLayer
                  ) {
                    c.updateLayer(
                      c.selectedLayer.id,
                      {
                        scaleX:
                          Number(
                            (
                              c
                                .selectedLayer
                                .scaleX *
                              0.9
                            ).toFixed(
                              3,
                            ),
                          ),

                        scaleY:
                          Number(
                            (
                              c
                                .selectedLayer
                                .scaleY *
                              0.9
                            ).toFixed(
                              3,
                            ),
                          ),
                      },
                    );
                  } else {
                    c.zoomOut();
                  }
                }}
                disabled={
                  !hasArtOnActiveSurface
                }
                title="Diminuir"
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-zinc-300 transition-all hover:bg-white/10 hover:text-cyan-400 disabled:opacity-30"
              >
                <ZoomOut
                  size={
                    15
                  }
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (
                    c.selectedLayer
                  ) {
                    c.updateLayer(
                      c.selectedLayer.id,
                      {
                        scaleX:
                          Number(
                            (
                              c
                                .selectedLayer
                                .scaleX *
                              1.1
                            ).toFixed(
                              3,
                            ),
                          ),

                        scaleY:
                          Number(
                            (
                              c
                                .selectedLayer
                                .scaleY *
                              1.1
                            ).toFixed(
                              3,
                            ),
                          ),
                      },
                    );
                  } else {
                    c.zoomIn();
                  }
                }}
                disabled={
                  !hasArtOnActiveSurface
                }
                title="Aumentar"
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-zinc-300 transition-all hover:bg-white/10 hover:text-cyan-400 disabled:opacity-30"
              >
                <ZoomIn
                  size={
                    15
                  }
                />
              </button>

              <div className="h-4 w-px bg-white/10 shrink-0" />

              <button
                type="button"
                onClick={() =>
                  c.rotateSelected(
                    15,
                  )
                }
                disabled={
                  !c.selectedLayer
                }
                title="Rodar elemento (+15°)"
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-zinc-300 transition-all hover:bg-white/10 hover:text-cyan-400 disabled:opacity-30"
              >
                <RotateCw
                  size={
                    15
                  }
                />
              </button>

              {config
                .surfaces
                .length >
                1 && (
                <>
                  <div className="h-4 w-px bg-white/10 shrink-0" />

                  <button
                    type="button"
                    onClick={
                      toggleSurface
                    }
                    title="Alternar superfície"
                    className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-zinc-300 transition-all hover:bg-white/10 hover:text-cyan-400"
                  >
                    <RefreshCw
                      size={
                        15
                      }
                    />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  c.setViewMode(
                    c.viewMode ===
                      "edit"
                      ? "preview"
                      : "edit",
                  );

                  c.selectLayer(
                    null,
                  );
                }}
                title="Pré-visualização"
                className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full transition-all ${
                  c.viewMode ===
                  "preview"
                    ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-400/50"
                    : "text-zinc-300 hover:bg-white/10 hover:text-cyan-400"
                }`}
              >
                <Eye
                  size={
                    15
                  }
                />
              </button>

              <div className="h-4 w-px bg-white/10 shrink-0" />

              <button
                type="button"
                onClick={() => {
                  if (
                    c.selectedLayer
                  ) {
                    c.deleteLayer(
                      c
                        .selectedLayer
                        .id,
                    );
                  } else {
                    c.resetSurface();
                  }
                }}
                disabled={
                  !hasArtOnActiveSurface
                }
                title="Eliminar"
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-all hover:bg-red-500/20 hover:text-red-400 disabled:opacity-30"
              >
                <Trash2
                  size={
                    15
                  }
                />
              </button>
            </div>
          </div>

          {selectedLayer &&
            c.viewMode ===
              "edit" && (
              <div className="mt-4 w-full max-w-[560px] rounded-xl border border-white/10 bg-zinc-950/90 px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[0.62rem] uppercase tracking-wider text-zinc-400">
                        Tamanho
                      </span>

                      <span className="font-mono text-[0.65rem] font-semibold text-cyan-300">
                        {
                          selectedScalePercent
                        }
                        %
                      </span>
                    </div>

                    <input
                      type="range"
                      min={
                        10
                      }
                      max={
                        800
                      }
                      step={
                        1
                      }
                      value={
                        sliderScaleValue
                      }
                      disabled={
                        selectedLayer.locked
                      }
                      onChange={(
                        event,
                      ) =>
                        updateSelectedScale(
                          Number(
                            event
                              .target
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
                      "
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[0.62rem] uppercase tracking-wider text-zinc-400">
                        Rotação
                      </span>

                      <span className="font-mono text-[0.65rem] font-semibold text-cyan-300">
                        {
                          selectedRotation
                        }
                        °
                      </span>
                    </div>

                    <input
                      type="range"
                      min={
                        -180
                      }
                      max={
                        180
                      }
                      step={
                        1
                      }
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
                      onChange={(
                        event,
                      ) =>
                        updateSelectedRotation(
                          Number(
                            event
                              .target
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
                      "
                    />
                  </div>
                </div>
              </div>
            )}

          <p className="mt-3 text-xs text-zinc-500 text-center">
            Clica e arrasta na arte para posicionar ou rodar com precisão.
          </p>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-white/10 pb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
              {
                product.category
              }
            </span>

            <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-white">
              {
                product.name
              }
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <span className="rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-cyan-300">
                {productPriceBadge(
                  product.slug,
                )}
              </span>

              <span className="text-xs text-zinc-400">
                Maquete digital incluída
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-2">
              {
                product.description
              }
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[0.65rem] font-bold text-cyan-400">
                  1
                </span>
                Tamanho & Medidas
              </span>

              <span className="text-xs text-zinc-500 font-mono">
                {
                  selectedSize
                }
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {sizes.map(
                (s) => {
                  const isSelected =
                    selectedSize ===
                    s;

                  return (
                    <button
                      key={
                        s
                      }
                      type="button"
                      onClick={() =>
                        setSelectedSize(
                          s,
                        )
                      }
                      className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(0,200,255,0.15)]"
                          : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/25 hover:bg-white/10"
                      }`}
                    >
                      {
                        s
                      }
                    </button>
                  );
                },
              )}
            </div>

            {config.colorSwatches &&
              config.colorSwatches.length > 1 && (
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Cor da Peça Base
                    </span>

                    <span className="font-mono text-[0.7rem] uppercase text-cyan-400">
                      {
                        selectedColor
                      }
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    {config.colorSwatches
                      .slice(
                        0,
                        5,
                      )
                      .map(
                        (
                          color,
                        ) => (
                          <button
                            key={
                              color
                            }
                            type="button"
                            onClick={() => {
                              setSelectedColor(
                                color,
                              );

                              setCustomHex(
                                color,
                              );
                            }}
                            style={{
                              backgroundColor:
                                color,
                            }}
                            className={`h-7 w-7 rounded-full border-2 transition-transform ${
                              selectedColor.toLowerCase() ===
                              color.toLowerCase()
                                ? "border-cyan-400 scale-110 shadow-[0_0_10px_rgba(0,200,255,0.4)]"
                                : "border-white/20 hover:scale-105"
                            }`}
                          />
                        ),
                      )}

                    <Popover>
                      <PopoverTrigger
                        asChild
                      >
                        <button
                          type="button"
                          className="h-7 w-7 rounded-full bg-[conic-gradient(at_center,_red,_orange,_yellow,_green,_cyan,_blue,_violet,_red)] border-2 border-white/40"
                        />
                      </PopoverTrigger>

                      <PopoverContent className="w-72 rounded-2xl border border-white/10 bg-[#111622] p-4 text-white shadow-2xl">
                        <ColorWheel
                          value={
                            selectedColor
                          }
                          onChange={(
                            hex,
                          ) => {
                            setSelectedColor(
                              hex,
                            );

                            setCustomHex(
                              hex,
                            );
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[0.65rem] font-bold text-cyan-400">
                2
              </span>

              <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Personalização
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-1">
              <button
                type="button"
                onClick={() =>
                  setMethod(
                    "design",
                  )
                }
                className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                  method ===
                  "design"
                    ? "border-cyan-400 bg-cyan-500/[0.07]"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <Upload
                  size={
                    18
                  }
                />

                <div>
                  <h4 className="font-display text-sm uppercase tracking-wide text-white">
                    Tenho o meu design pronto
                  </h4>

                  <p className="text-xs text-zinc-400">
                    PDF, PNG ou JPG de alta definição.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setMethod(
                    "ajuda",
                  )
                }
                className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                  method ===
                  "ajuda"
                    ? "border-cyan-400 bg-cyan-500/[0.07]"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <Sparkles
                  size={
                    18
                  }
                />

                <div>
                  <h4 className="font-display text-sm uppercase tracking-wide text-white">
                    Quero ajuda da VinilArt
                  </h4>

                  <p className="text-xs text-zinc-400">
                    Envia fotos/logos e montamos a maquete.
                  </p>
                </div>
              </button>
            </div>

            {method ===
              "design" && (
              <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                {config
                  .surfaces
                  .length ===
                  2 && (
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex gap-1.5">
                      {config.surfaces.map(
                        (
                          s,
                        ) => (
                          <button
                            key={
                              s.id
                            }
                            type="button"
                            onClick={() =>
                              c.setSurface(
                                s.id,
                              )
                            }
                            className={`rounded-lg px-3 py-1.5 font-mono text-[0.68rem] uppercase border ${
                              c.state
                                .activeSurfaceId ===
                              s.id
                                ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                                : "border-white/10 bg-white/5 text-zinc-400"
                            }`}
                          >
                            {surfaceLabel(
                              s.id,
                              s.label,
                            )}
                          </button>
                        ),
                      )}
                    </div>

                    <label className="flex items-center gap-2 text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={
                          same
                        }
                        onChange={(
                          e,
                        ) =>
                          setSame(
                            e.target
                              .checked,
                          )
                        }
                      />

                      <span>
                        Ambas iguais
                      </span>
                    </label>
                  </div>
                )}

                {c
                  .activeLayers
                  .length >
                  0 && (
                  <div className="space-y-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Layers
                        size={
                          12
                        }
                      />

                      Camadas (
                      {
                        c
                          .activeLayers
                          .length
                      }
                      )
                    </div>

                    {[...c.activeLayers]
                      .map(
                        (
                          layer,
                          originalIndex,
                        ) => ({
                          layer,
                          originalIndex,
                        }),
                      )
                      .reverse()
                      .map(
                        ({
                          layer:
                            l,
                        }) => (
                          <div
                            key={
                              l.id
                            }
                            onClick={() =>
                              c.selectLayer(
                                l.id,
                              )
                            }
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-2 text-xs"
                          >
                            <span>
                              {l.type ===
                              "image"
                                ? l.filename
                                : l.text}
                            </span>

                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  c.toggleVisibility(
                                    l.id,
                                  )
                                }
                              >
                                {l.visible ? (
                                  <Eye
                                    size={
                                      13
                                    }
                                  />
                                ) : (
                                  <EyeOff
                                    size={
                                      13
                                    }
                                  />
                                )}
                              </button>

                              <button
                                onClick={() =>
                                  c.toggleLock(
                                    l.id,
                                  )
                                }
                              >
                                {l.locked ? (
                                  <Lock
                                    size={
                                      13
                                    }
                                  />
                                ) : (
                                  <Unlock
                                    size={
                                      13
                                    }
                                  />
                                )}
                              </button>

                              <button
                                onClick={() =>
                                  c.duplicateLayer(
                                    l.id,
                                  )
                                }
                              >
                                <Copy
                                  size={
                                    13
                                  }
                                />
                              </button>

                              <button
                                onClick={() =>
                                  c.deleteLayer(
                                    l.id,
                                  )
                                }
                              >
                                <Trash2
                                  size={
                                    13
                                  }
                                />
                              </button>
                            </div>
                          </div>
                        ),
                      )}
                  </div>
                )}

                <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-400/40 bg-cyan-500/10 px-3 py-2.5 cursor-pointer">
                  <Plus
                    size={
                      14
                    }
                  />

                  Adicionar imagem / logo

                  <input
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp,application/pdf"
                    className="hidden"
                    onChange={(
                      e,
                    ) => {
                      const files =
                        Array.from(
                          e.target
                            .files ??
                            [],
                        );

                      void (async () => {
                        for (const file of files) {
                          await handleFileUpload(
                            file,
                            c.state
                              .activeSurfaceId,
                            false,
                          );
                        }
                      })();

                      e.target.value =
                        "";
                    }}
                  />
                </label>

                <div className="space-y-1.5 pt-1">
                  <label className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-wider text-zinc-400">
                    <span>Nota</span>
                    <span className="text-zinc-600 lowercase font-normal">(opcional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={designNote}
                    onChange={(e) => setDesignNote(e.target.value)}
                    placeholder="Instruções, observações ou posicionamento pretendido..."
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 leading-relaxed transition-colors focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-none"
                  />
                </div>
              </div>
            )}

            {method === "ajuda" && (
              <VinilartHelpPanel
                requestedText={helpRequestedText}
                onRequestedTextChange={setHelpRequestedText}
                designNotes={helpIdea}
                onDesignNotesChange={setHelpIdea}
                contact={helpContact}
                onContactChange={(val) => {
                  setHelpContact(val);
                  if (val.trim()) {
                    setHelpContactError("");
                    if (
                      error ===
                      "Indica um WhatsApp ou e-mail para podermos contactar-te."
                    ) {
                      setError("");
                    }
                  }
                }}
                contactError={helpContactError}
                attachments={helpAttachments}
                onAttachmentsChange={setHelpAttachments}
              />
            )}
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                Quantidade
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setQuantity(
                      (
                        q,
                      ) =>
                        Math.max(
                          1,
                          q - 1,
                        ),
                    )
                  }
                >
                  −
                </button>

                <span>
                  {
                    quantity
                  }
                </span>

                <button
                  onClick={() =>
                    setQuantity(
                      (
                        q,
                      ) =>
                        q + 1,
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400">
                {
                  error
                }
              </p>
            )}

            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void handleAddToCart()
              }
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-black"
            >
              <ShoppingBag
                size={
                  18
                }
              />

              {busy
                ? "A processar…"
                : item
                  ? "Guardar Alterações"
                  : "Adicionar ao Carrinho"}
            </button>

            {addedSuccess && (
              <Link
                to="/carrinho"
                className="text-xs text-cyan-300"
              >
                <Check
                  size={
                    14
                  }
                />{" "}
                Ver Carrinho
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
