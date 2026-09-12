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
  Palette,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CanvasEditor } from "./CanvasEditor";
import { SingleSurfacePreviewCanvas } from "./DualShinGuardPreview";
import { ColorWheel } from "./ColorWheel";
import { useProductCustomizer } from "@/hooks/useProductCustomizer";
import { useCart } from "@/lib/cart/store";
import type { CartItem } from "@/lib/cart/types";
import type { ProductCustomizerConfig } from "@/lib/customizer/types";
import type { Product } from "@/lib/sport-data";

const surfaceLabel = (id: string, fallback: string) => {
  if (id === "LEFT") return "Lado Esquerdo";
  if (id === "RIGHT") return "Lado Direito";
  if (id === "FRONT") return "Frente";
  if (id === "BACK") return "Costas";
  return fallback;
};

function getProductSizes(slug: string, configSizes?: string[]): string[] {
  if (configSizes && configSizes.length > 0) return configSizes;
  if (slug.includes("caneleiras")) {
    return ["S (14cm)", "M (16.5cm)", "L (19cm)"];
  }
  if (
    slug.includes("equipamento") ||
    slug.includes("tshirt") ||
    slug.includes("calcoes")
  ) {
    return ["XS", "S", "M", "L", "XL", "XXL"];
  }
  if (slug.includes("bone")) {
    return ["Tamanho Único"];
  }
  return ["Tamanho Único"];
}

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
  const c = useProductCustomizer(config, {
    initialDesignJson: item?.customizerDesign,
  });
  const cart = useCart();

  // Step 1: Base Selection
  const sizes = getProductSizes(product.slug, config.sizeOptions);
  const [selectedSize, setSelectedSize] = useState<string>(
    item?.variant || sizes[0] || "Tamanho Único",
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    config.colorSwatches?.[0] || "#ffffff",
  );
  const [customHex, setCustomHex] = useState<string>(
    config.colorSwatches?.[0] || "#00C8FF",
  );

  // Step 2: Design Method ("design" | "ajuda")
  const [method, setMethod] = useState<"design" | "ajuda">(
    item ? (item.mode === "ajuda" ? "ajuda" : "design") : initialMethod,
  );

  // Multi-surface sync ("Ambas iguais")
  const [same, setSame] = useState<boolean>(() => {
    try {
      return Boolean(JSON.parse(item?.customizerDesign ?? "{}").sameDesign);
    } catch {
      return config.surfaces.length === 2;
    }
  });

  // Help mode state (Cartão B)
  const [helpIdea, setHelpIdea] = useState<string>(
    item?.serviceDetails?.notes || "",
  );
  const [helpContact, setHelpContact] = useState<string>(
    item?.serviceDetails?.userContact || "",
  );
  const [helpFiles, setHelpFiles] = useState<File[]>([]);

  // Step 3: Purchase & Confirmation
  const [quantity, setQuantity] = useState<number>(item?.quantity ?? 1);
  const [confirmed, setConfirmed] = useState<boolean>(true);
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [konva, setKonva] = useState<any>(null);
  const stages = useRef<Record<string, Konva.Stage | null>>({});

  useEffect(() => {
    import("react-konva").then(setKonva);
  }, []);

  // Sync surfaces when "Ambas iguais" is enabled
  const signature = JSON.stringify(c.activeLayers);
  useEffect(() => {
    if (same && config.surfaces.length === 2) {
      const other = config.surfaces.find(
        (s) => s.id !== c.state.activeSurfaceId,
      );
      if (other) c.syncSurface(c.state.activeSurfaceId, other.id);
    }
  }, [same, signature, c.state.activeSurfaceId, config, c.syncSurface]);

  // Handle direct upload for active surface (supports up to 4 layers)
  async function handleFileUpload(file: File | undefined, surfaceId: string, replace = false) {
    if (!file) return;
    const currentCount = c.state.surfaces[surfaceId]?.layers.length ?? 0;
    if (!replace && currentCount >= 4) {
      setError("Limite de 4 imagens/logos por superfície atingido.");
      return;
    }
    setBusy(true);
    setError("");
    setAddedSuccess(false);
    try {
      await c.addImageFromFile(file, surfaceId, replace);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar imagem.");
    } finally {
      setBusy(false);
    }
  }

  // Generate thumbnail for cart
  async function generateThumbnail() {
    try {
      const sources = config.surfaces.map((s) =>
        s.id === c.state.activeSurfaceId
          ? c.exportCustomerPreview()
          : stages.current[s.id]?.toDataURL({ pixelRatio: 1 }),
      );
      const validSources = sources.filter(Boolean) as string[];
      if (!validSources.length) return undefined;

      const images = await Promise.all(
        validSources.map(
          (src) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = reject;
              img.src = src;
            }),
        ),
      );

      const canvas = document.createElement("canvas");
      canvas.width = 320 * images.length;
      canvas.height = 320;
      const ctx = canvas.getContext("2d");
      if (!ctx) return undefined;

      ctx.fillStyle = "#0b0e14";
      ctx.fillRect(0, 0, canvas.width, 320);
      images.forEach((img, i) => ctx.drawImage(img, i * 320, 0, 320, 320));
      return canvas.toDataURL("image/jpeg", 0.85);
    } catch {
      return undefined;
    }
  }

  // Save / Add to Cart
  async function handleAddToCart() {
    if (!confirmed) {
      setError("Por favor, confirma a pré-visualização para prosseguir.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      if (method === "design") {
        const serialized = await c.persistDesign();
        const customizerDesign = JSON.stringify({
          ...JSON.parse(serialized),
          sameDesign: same,
        });
        const previewDataUrl = await generateThumbnail();

        const options = {
          quantity,
          variant: selectedSize,
          customizerDesign,
          previewDataUrl,
          mode: "design" as const,
        };

        if (item) {
          cart.updateItem(item.id, options);
        } else {
          cart.addItem(config.id, product.name, options);
        }
      } else {
        // Method === "ajuda"
        const options = {
          quantity,
          variant: selectedSize,
          mode: "ajuda" as const,
          serviceDetails: {
            itemOrServiceType: product.name,
            userContact: helpContact || undefined,
            notes: helpIdea || undefined,
            fileName: helpFiles.map((f) => f.name).join(", ") || undefined,
            approxDimensions: selectedSize,
            quantity,
          },
        };

        if (item) {
          cart.updateItem(item.id, options);
        } else {
          cart.addItem(config.id, product.name, options);
        }
      }

      setAddedSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao adicionar ao carrinho.");
    } finally {
      setBusy(false);
    }
  }

  // Toggle surface (e.g. Left <-> Right or Front <-> Back)
  function toggleSurface() {
    if (config.surfaces.length < 2) return;
    const currentIndex = config.surfaces.findIndex(
      (s) => s.id === c.state.activeSurfaceId,
    );
    const nextIndex = (currentIndex + 1) % config.surfaces.length;
    const nextSurface = config.surfaces[nextIndex];
    if (nextSurface) {
      c.setSurface(nextSurface.id);
      const artwork = c.state.surfaces[nextSurface.id]?.layers.find(
        (l) => l.visible && !l.locked,
      );
      if (artwork) {
        c.dispatch({
          type: "SELECT_LAYER",
          surfaceId: nextSurface.id,
          layerId: artwork.id,
        });
      }
    }
  }

  const activeSurfaceObj =
    config.surfaces.find((s) => s.id === c.state.activeSurfaceId) ||
    config.surfaces[0]!;

  const hasArtOnActiveSurface =
    (c.state.surfaces[c.state.activeSurfaceId]?.layers.length ?? 0) > 0;

  const currentArtworkLayer = c.state.surfaces[
    c.state.activeSurfaceId
  ]?.layers.find((l) => l.type === "image");

  return (
    <div className="w-full space-y-12">
      {/* Main 12-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================================================================ */}
        {/* A. ÁREA DE PREVIEW (Esquerda / lg:col-span-7)                     */}
        {/* ================================================================ */}
        <div className="lg:col-span-7 flex flex-col items-center w-full">
          <div className="flex flex-col items-center justify-center relative min-h-[600px] w-full p-6 lg:p-10 rounded-3xl bg-[#111622] border border-white/5 shadow-2xl">
            {/* Subtle top spotlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-cyan-500/[0.07] via-transparent to-transparent blur-xl" />

            {/* Surface Pill Indicator (Top-Left, z-40) */}
            <div className="absolute top-4 left-4 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/80 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-300">
                {surfaceLabel(activeSurfaceObj.id, activeSurfaceObj.label)}
              </span>
              {config.surfaces.length > 1 && (
                <span className="font-mono text-[0.65rem] text-zinc-500">
                  ({config.surfaces.findIndex((s) => s.id === activeSurfaceObj.id) + 1}/{config.surfaces.length})
                </span>
              )}
            </div>

            {/* Central Mockup & Canvas Editor */}
            <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] flex items-center justify-center">
              {config.surfaces.map((s) => {
                const isActive = c.state.activeSurfaceId === s.id;
                return (
                  <div
                    key={s.id}
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                      isActive ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                    }`}
                  >
                    {isActive ? (
                      <CanvasEditor
                        config={config}
                        customizer={c}
                        baseColor={selectedColor}
                      />
                    ) : konva ? (
                      <SingleSurfacePreviewCanvas
                        config={config}
                        surface={s}
                        customizer={c}
                        baseColor={selectedColor}
                        KonvaLib={konva}
                        stageRef={(stage) => {
                          stages.current[s.id] = stage;
                        }}
                      />
                    ) : (
                      <img
                        src={s.mockupSrc}
                        alt={surfaceLabel(s.id, s.label)}
                        className="max-h-[85%] max-w-[85%] object-contain"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Floating Toolbar at bottom-4 left-1/2 -translate-x-1/2 z-40 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/15 bg-zinc-950/90 px-3 py-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.85)] backdrop-blur-md">
              {/* 1. Ajustar / Smart Fit */}
              <button
                type="button"
                onClick={() => {
                  c.smartFit();
                }}
                disabled={!hasArtOnActiveSurface}
                title="Ajustar à área útil imprimível"
                aria-label="Ajustar à área útil"
                className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition-all hover:bg-white/10 hover:text-cyan-400 disabled:opacity-30 disabled:pointer-events-none"
              >
                <Maximize2 size={16} />
              </button>

              <div className="h-4 w-px bg-white/10" />

              {/* 2. Zoom - / + (Layer or Canvas) */}
              <button
                type="button"
                onClick={() => {
                  if (c.selectedLayer) {
                    const nextScaleX = Number((c.selectedLayer.scaleX * 0.9).toFixed(3));
                    const nextScaleY = Number((c.selectedLayer.scaleY * 0.9).toFixed(3));
                    c.updateLayer(c.selectedLayer.id, { scaleX: nextScaleX, scaleY: nextScaleY });
                  } else {
                    c.zoomOut();
                  }
                }}
                disabled={!hasArtOnActiveSurface}
                title={c.selectedLayer ? "Diminuir elemento selecionado" : "Diminuir Zoom"}
                aria-label="Diminuir"
                className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition-all hover:bg-white/10 hover:text-cyan-400 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ZoomOut size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (c.selectedLayer) {
                    const nextScaleX = Number((c.selectedLayer.scaleX * 1.1).toFixed(3));
                    const nextScaleY = Number((c.selectedLayer.scaleY * 1.1).toFixed(3));
                    c.updateLayer(c.selectedLayer.id, { scaleX: nextScaleX, scaleY: nextScaleY });
                  } else {
                    c.zoomIn();
                  }
                }}
                disabled={!hasArtOnActiveSurface}
                title={c.selectedLayer ? "Aumentar elemento selecionado" : "Aumentar Zoom"}
                aria-label="Aumentar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition-all hover:bg-white/10 hover:text-cyan-400 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ZoomIn size={16} />
              </button>

              <div className="h-4 w-px bg-white/10" />

              {/* 3. Rodar Elemento Selecionado */}
              <button
                type="button"
                onClick={() => {
                  c.rotateSelected(15);
                }}
                disabled={!c.selectedLayer}
                title="Rodar elemento (+15°)"
                aria-label="Rodar elemento selecionado"
                className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition-all hover:bg-white/10 hover:text-cyan-400 disabled:opacity-30 disabled:pointer-events-none"
              >
                <RotateCw size={16} />
              </button>

              {/* 4. Alternar Lado (se multi-superfície) */}
              {config.surfaces.length > 1 && (
                <>
                  <div className="h-4 w-px bg-white/10" />
                  <button
                    type="button"
                    onClick={toggleSurface}
                    title="Alternar entre superfícies (Frente/Costas ou Esquerda/Direita)"
                    aria-label="Alternar superfície"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition-all hover:bg-white/10 hover:text-cyan-400"
                  >
                    <RefreshCw size={16} />
                  </button>
                </>
              )}

              <div className="h-4 w-px bg-white/10" />

              {/* 5. Eliminar Elemento / Reset */}
              <button
                type="button"
                onClick={() => {
                  if (c.selectedLayer) {
                    c.deleteLayer(c.selectedLayer.id);
                  } else {
                    c.resetSurface();
                  }
                }}
                disabled={!hasArtOnActiveSurface}
                title={c.selectedLayer ? "Eliminar camada selecionada" : "Remover arte da superfície"}
                aria-label="Remover arte"
                className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-all hover:bg-red-500/20 hover:text-red-400 disabled:opacity-30 disabled:pointer-events-none"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-zinc-500 text-center">
            Clica e arrasta na arte para posicionar ou rodar com precisão.
          </p>
        </div>

        {/* ================================================================ */}
        {/* B. PAINEL DE AÇÃO GUIADO (Direita / lg:col-span-5)               */}
        {/* ================================================================ */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header do Artigo */}
          <div className="space-y-2 border-b border-white/10 pb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
              {product.category}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-white">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 pt-1">
              <span className="rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-cyan-300">
                {product.slug === "caneleiras-personalizadas"
                  ? "Desde 19,90€"
                  : "Sob Orçamento"}
              </span>
              <span className="text-xs text-zinc-400">
                Maquete digital incluída
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* PASSO 1: Seleção Base (Tamanhos e Cor)                          */}
          {/* -------------------------------------------------------------- */}
          <div className="space-y-3 rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[0.65rem] font-bold text-cyan-400">
                  1
                </span>
                Tamanho & Medidas
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {selectedSize}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {sizes.map((s) => {
                const isSelected = selectedSize === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(0,200,255,0.15)]"
                        : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/25 hover:bg-white/10"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* Cor Base (se aplicável) */}
            {config.colorSwatches && config.colorSwatches.length > 1 && (
              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Cor da Peça Base
                  </span>
                  <span className="font-mono text-[0.7rem] uppercase text-cyan-400">
                    {selectedColor}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {config.colorSwatches.slice(0, 5).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color);
                        setCustomHex(color);
                      }}
                      style={{ backgroundColor: color }}
                      aria-label={`Cor ${color}`}
                      className={`h-7 w-7 rounded-full border-2 transition-transform ${
                        selectedColor.toLowerCase() === color.toLowerCase()
                          ? "border-cyan-400 scale-110 shadow-[0_0_10px_rgba(0,200,255,0.4)]"
                          : "border-white/20 hover:scale-105"
                      }`}
                    />
                  ))}

                  {/* Rainbow Color Picker Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        aria-label="Escolher cor personalizada (Arco-íris)"
                        title="Cor personalizada (Arco-íris)"
                        className={`h-7 w-7 rounded-full bg-[conic-gradient(at_center,_red,_orange,_yellow,_green,_cyan,_blue,_violet,_red)] border-2 transition-transform shadow-md hover:scale-110 flex items-center justify-center ${
                          !config.colorSwatches.slice(0, 5).some(c => c.toLowerCase() === selectedColor.toLowerCase())
                            ? "border-cyan-400 scale-110 shadow-[0_0_10px_rgba(0,200,255,0.5)] ring-2 ring-cyan-400/50"
                            : "border-white/40"
                        }`}
                      >
                        <span className="sr-only">Cor personalizada</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="top"
                      align="start"
                      className="w-72 rounded-2xl border border-white/10 bg-[#111622] p-4 text-white shadow-2xl backdrop-blur-xl"
                    >
                      <ColorWheel
                        value={selectedColor}
                        onChange={(hex) => {
                          setSelectedColor(hex);
                          setCustomHex(hex);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>

          {/* -------------------------------------------------------------- */}
          {/* PASSO 2: Método de Design (Dois Cartões Elegantes)             */}
          {/* -------------------------------------------------------------- */}
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
              {/* Cartão A: Tenho o meu design pronto */}
              <button
                type="button"
                onClick={() => setMethod("design")}
                className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                  method === "design"
                    ? "border-cyan-400 bg-cyan-500/[0.07] shadow-[0_0_20px_rgba(0,200,255,0.12)]"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                    method === "design"
                      ? "border-cyan-400/40 bg-cyan-500/20 text-cyan-300"
                      : "border-white/10 bg-zinc-900 text-zinc-400"
                  }`}
                >
                  <Upload size={18} />
                </span>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm uppercase tracking-wide text-white">
                      Tenho o meu design pronto
                    </h4>
                    {method === "design" && (
                      <CheckCircle2 size={16} className="text-cyan-400" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    PDF, PNG ou JPG de alta definição com aplicação imediata.
                  </p>
                </div>
              </button>

              {/* Cartão B: Quero ajuda da VinilArt */}
              <button
                type="button"
                onClick={() => setMethod("ajuda")}
                className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                  method === "ajuda"
                    ? "border-cyan-400 bg-cyan-500/[0.07] shadow-[0_0_20px_rgba(0,200,255,0.12)]"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                    method === "ajuda"
                      ? "border-cyan-400/40 bg-cyan-500/20 text-cyan-300"
                      : "border-white/10 bg-zinc-900 text-zinc-400"
                  }`}
                >
                  <Sparkles size={18} />
                </span>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm uppercase tracking-wide text-white">
                      Quero ajuda da VinilArt
                    </h4>
                    {method === "ajuda" && (
                      <CheckCircle2 size={16} className="text-cyan-400" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Envia as tuas fotos/logos e a nossa equipa monta a maquete.
                  </p>
                </div>
              </button>
            </div>

            {/* Conteúdo Expandido do Cartão A (Dropzone & Superfícies) */}
            {method === "design" && (
              <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                {/* Se multi-superfície, selector de lado e toggle "Ambas iguais" */}
                {config.surfaces.length === 2 && (
                  <div className="space-y-2 border-b border-white/10 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {config.surfaces.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => c.setSurface(s.id)}
                            className={`rounded-lg px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-wider transition-all border ${
                              c.state.activeSurfaceId === s.id
                                ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold"
                                : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {surfaceLabel(s.id, s.label)}
                          </button>
                        ))}
                      </div>

                      <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={same}
                          onChange={(e) => setSame(e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-white/20 bg-zinc-900 text-cyan-400 focus:ring-cyan-400"
                        />
                        <span>Ambas iguais</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Multi-Layer List & Management (Até 4 camadas) */}
                {c.activeLayers.length > 0 && (
                  <div className="space-y-2 border-b border-white/10 pb-3">
                    <div className="flex items-center justify-between text-[0.68rem] font-mono text-zinc-400">
                      <span className="flex items-center gap-1.5 uppercase tracking-wider">
                        <Layers size={12} className="text-cyan-400" />
                        <span>Elementos ({c.activeLayers.length}/4)</span>
                      </span>
                      <span className="text-[0.62rem] text-zinc-500">
                        Clica num elemento para ajustar
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {c.activeLayers.map((l, index) => {
                        const isSelected = c.selectedLayer?.id === l.id;
                        const label =
                          l.type === "image"
                            ? l.filename || `Imagem ${index + 1}`
                            : l.text || `Texto ${index + 1}`;
                        return (
                          <div
                            key={l.id}
                            className={`group flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-all ${
                              isSelected
                                ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 font-semibold shadow-[0_0_10px_rgba(0,200,255,0.2)]"
                                : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => c.selectLayer(l.id)}
                              className="max-w-[130px] truncate text-[0.68rem] text-left"
                              title={label}
                            >
                              {index + 1}. {label}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                c.deleteLayer(l.id);
                              }}
                              className="text-zinc-500 hover:text-red-400 transition-colors p-0.5"
                              title="Remover elemento"
                              aria-label={`Remover elemento ${index + 1}`}
                            >
                              <X size={11} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dropzone & Adicionar Elemento */}
                <div className="space-y-2">
                  {c.activeLayers.length === 0 ? (
                    <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 bg-white/[0.02] p-5 text-center cursor-pointer transition-colors hover:border-cyan-400/50 hover:bg-cyan-500/[0.03]">
                      <Upload size={20} className="text-cyan-400" />
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-white">
                          Carregar ficheiro de arte
                        </span>
                        <p className="text-[0.68rem] text-zinc-400">
                          Arrasta ou clica (PNG, JPG, WEBP até 20MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,application/pdf"
                        disabled={busy}
                        onChange={(e) => {
                          void handleFileUpload(
                            e.target.files?.[0],
                            c.state.activeSurfaceId,
                            false,
                          );
                          e.target.value = "";
                        }}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-2">
                      {c.activeLayers.length < 4 && (
                        <label className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-400/40 bg-cyan-500/10 px-3 py-2.5 text-center cursor-pointer transition-colors hover:border-cyan-400 hover:bg-cyan-500/20">
                          <Plus size={14} className="text-cyan-400" />
                          <span className="text-xs font-semibold text-cyan-300">
                            Adicionar outra imagem / logo
                          </span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,application/pdf"
                            disabled={busy}
                            onChange={(e) => {
                              void handleFileUpload(
                                e.target.files?.[0],
                                c.state.activeSurfaceId,
                                false,
                              );
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                      <label className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-center cursor-pointer transition-colors hover:border-white/25 hover:bg-white/10">
                        <Upload size={13} className="text-zinc-400" />
                        <span className="text-xs text-zinc-300">
                          Substituir tudo
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,application/pdf"
                          disabled={busy}
                          onChange={(e) => {
                            void handleFileUpload(
                              e.target.files?.[0],
                              c.state.activeSurfaceId,
                              true,
                            );
                            e.target.value = "";
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Conteúdo Expandido do Cartão B (Formulário Assistência Gráfica) */}
            {method === "ajuda" && (
              <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                {/* Upload até 3 ficheiros */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    Ficheiros / Fotos / Logos (até 3)
                  </label>
                  <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-3 text-center cursor-pointer hover:border-cyan-400/40">
                    <Paperclip size={14} className="text-cyan-400" />
                    <span className="text-xs text-zinc-300">
                      {helpFiles.length
                        ? `${helpFiles.length} ficheiro(s) selecionado(s)`
                        : "Anexar ficheiros de referência"}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files || []).slice(
                          0,
                          3,
                        );
                        setHelpFiles(newFiles);
                      }}
                      className="hidden"
                    />
                  </label>
                  {helpFiles.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {helpFiles.map((f, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[0.65rem] text-zinc-300"
                        >
                          {f.name}
                          <button
                            type="button"
                            onClick={() =>
                              setHelpFiles(helpFiles.filter((_, idx) => idx !== i))
                            }
                            className="text-zinc-400 hover:text-white"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Campo curto Ideia */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    Nome / Número / Ideia Pretendida
                  </label>
                  <input
                    type="text"
                    value={helpIdea}
                    onChange={(e) => setHelpIdea(e.target.value)}
                    placeholder="Ex: Emblema do clube e nome Tomás nº 10"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Campo de Contacto */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    WhatsApp ou E-mail para Envio da Maquete
                  </label>
                  <input
                    type="text"
                    value={helpContact}
                    onChange={(e) => setHelpContact(e.target.value)}
                    placeholder="Contacto telefónico ou e-mail"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* -------------------------------------------------------------- */}
          {/* PASSO 3: Conclusão & Compra                                    */}
          {/* -------------------------------------------------------------- */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[0.65rem] font-bold text-cyan-400">
                  3
                </span>
                Conclusão & Quantidade
              </span>

              {/* Stepper de Quantidade */}
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-6 w-6 rounded text-zinc-400 hover:text-white transition-colors flex items-center justify-center text-sm"
                >
                  −
                </button>
                <span className="w-8 text-center font-mono text-xs font-semibold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-6 w-6 rounded text-zinc-400 hover:text-white transition-colors flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Resumo de valores */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <span className="text-zinc-400">Proposta de Valor:</span>
              <span className="font-mono font-semibold text-cyan-300">
                {product.slug === "caneleiras-personalizadas"
                  ? `${(19.9 * quantity).toFixed(2).replace(".", ",")}€ (Estimado)`
                  : "Sob Orçamento Gratuito"}
              </span>
            </div>

            {/* Checkbox de confirmação */}
            <label className="flex items-start gap-2.5 pt-2 text-[0.72rem] text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 rounded border-white/20 bg-zinc-900 text-cyan-400 focus:ring-cyan-400"
              />
              <span>
                Confirmo a pré-visualização e a qualidade dos ficheiros fornecidos.
              </span>
            </label>

            {/* Mensagem de Erro */}
            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-950/40 p-2.5 text-xs text-red-400">
                {error}
              </p>
            )}

            {/* Botão Principal Ciano */}
            <button
              type="button"
              disabled={busy || !confirmed}
              onClick={() => void handleAddToCart()}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-cyan-400 py-3.5 font-display text-sm uppercase tracking-wider text-black transition-all hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(0,200,255,0.4)] disabled:opacity-40 disabled:pointer-events-none"
            >
              <ShoppingBag size={18} />
              <span>
                {busy
                  ? "A processar…"
                  : item
                    ? "Guardar Alterações"
                    : "Adicionar ao Carrinho"}
              </span>
            </button>

            {/* Sucesso com link direto */}
            {addedSuccess && (
              <div className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-950/40 p-3 text-xs text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-cyan-400" />
                  Artigo adicionado com sucesso!
                </span>
                <Link
                  to="/carrinho"
                  className="font-semibold underline hover:text-white"
                >
                  Ver Carrinho →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
