import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  Check,
  Copy,
  Eraser,
  FlipHorizontal,
  FlipVertical,
  Loader2,
  RotateCcw,
  RotateCw,
  Sparkles,
  Target,
  Maximize2,
  Type,
  Undo2,
  Upload,
  Redo2,
} from "lucide-react";

import { AddTextPanel } from "./AddTextPanel";
import { LayerPanel } from "./LayerPanel";

import { cn } from "@/lib/utils";

import type {
  DesignLayer,
  LayerId,
  LayerReorderDirection,
} from "@/lib/customizer/types";

import type { ProductCustomizerHandle } from "@/hooks/useProductCustomizer";

interface CustomizerToolbarProps {
  customizer: ProductCustomizerHandle;
}

export function CustomizerToolbar({
  customizer,
}: CustomizerToolbarProps) {
  const {
    config,
    state,
    selectedLayer,
    canUndo,
    canRedo,
    activeLayers,
    saveStatus,
    addImagesFromFiles,
    addText,
    updateLayer,
    deleteLayer,
    duplicateLayer,
    toggleLock,
    toggleVisibility,
    reorderLayer,
    copyDesignToOtherSurface,
    selectLayer,
    smartFit,
    coverFit,
    smartFitIntelligent,
    removeBackground,
    restoreOriginal,
    toggleCompareOriginal,
    bgRemovalProgress,
    resetSurface,
    clearDraft,
    undo,
    redo,
    alignSelected,
    flipSelected,
    rotateSelected,
    setSelectedOpacity,
  } = customizer;

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [showTextPanel, setShowTextPanel] =
    useState(false);

  const [showConfirmCopy, setShowConfirmCopy] =
    useState(false);

  const [showConfirmClear, setShowConfirmClear] =
    useState(false);

  const [bgError, setBgError] =
    useState<string | null>(null);

  useEffect(() => {
    setShowTextPanel(false);
  }, [state.activeSurfaceId]);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    addImagesFromFiles(files);

    event.target.value = "";
    setShowTextPanel(false);
  }

  function handleUpdateLayer(
    changes: Partial<DesignLayer>,
    skipHistory?: boolean,
  ) {
    if (!selectedLayer) return;

    updateLayer(
      selectedLayer.id,
      changes,
      skipHistory,
    );
  }

  const otherSurface =
    config.surfaces.find(
      (surface) =>
        surface.id !==
        state.activeSurfaceId,
    );

  const otherSurfaceDesign =
    otherSurface
      ? state.surfaces[
          otherSurface.id
        ]
      : undefined;

  const otherHasContent =
    (otherSurfaceDesign?.layers
      .length ?? 0) > 0;

  function triggerCopy() {
    if (!otherSurface) return;

    if (otherHasContent) {
      setShowConfirmCopy(true);
      return;
    }

    copyDesignToOtherSurface(
      otherSurface.id,
    );
  }

  function confirmCopy() {
    if (otherSurface) {
      copyDesignToOtherSurface(
        otherSurface.id,
      );
    }

    setShowConfirmCopy(false);
  }

  const imageSelected =
    selectedLayer?.type === "image";

  const canEditImage =
    imageSelected &&
    !selectedLayer.locked;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-border pb-2 text-[0.65rem]">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {saveStatus ===
            "saving" && (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-cyan" />
              A guardar…
            </>
          )}

          {saveStatus ===
            "saved" && (
            <>
              <Check className="h-3 w-3 text-green-400" />
              Rascunho guardado
            </>
          )}

          {saveStatus ===
            "idle" && (
            <span>
              Rascunho local
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            setShowConfirmClear(true)
          }
          className="text-[0.6rem] uppercase tracking-wider text-muted-foreground hover:text-destructive"
        >
          Limpar rascunho
        </button>
      </div>

      {showConfirmClear && (
        <div className="border border-destructive/40 bg-destructive/10 p-3 text-xs">
          <p className="font-semibold text-destructive">
            Limpar a personalização?
          </p>

          <p className="mt-1 text-[0.7rem] text-muted-foreground">
            Serão removidos os
            elementos do rascunho atual.
          </p>

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() =>
                setShowConfirmClear(
                  false,
                )
              }
              className="border border-border px-3 py-1.5"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={async () => {
                await clearDraft();

                setShowConfirmClear(
                  false,
                );
              }}
              className="bg-destructive px-3 py-1.5 font-bold text-white"
            >
              Limpar
            </button>
          </div>
        </div>
      )}

      <div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={() => {
            setShowTextPanel(false);

            fileInputRef.current?.click();
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsPanelDragOver(true);
          }}
          onDragLeave={() => setIsPanelDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsPanelDragOver(false);

            if (event.dataTransfer.files.length > 0) {
              addImagesFromFiles(event.dataTransfer.files);
            }
          }}
          className={cn(
            "group flex w-full flex-col items-center gap-2.5 rounded-md border border-dashed px-3 py-6 text-center transition-all duration-200",
            isPanelDragOver
              ? "border-magenta bg-magenta/10 scale-[1.01]"
              : "border-white/10 bg-white/[0.02] hover:border-magenta/70 hover:bg-white/[0.04]",
          )}
        >
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
              isPanelDragOver
                ? "border-magenta bg-magenta/20 text-magenta"
                : "border-white/10 bg-white/[0.03] text-magenta group-hover:border-magenta/50",
            )}
          >
            <Upload className="h-4 w-4" />
          </span>

          <span className="text-xs text-foreground">
            {isPanelDragOver
              ? "Larga aqui o ficheiro"
              : "Arrasta a tua imagem ou clica para escolher"}
          </span>

          <span className="font-mono text-[0.56rem] uppercase tracking-[0.18em] text-muted-foreground">
            PNG · JPG · WEBP · Ctrl+V
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={() =>
          setShowTextPanel(
            (value) => !value,
          )
        }
        className={cn(
          "flex items-center gap-2 border px-3 py-2.5 text-xs uppercase tracking-widest transition-colors",
          showTextPanel
            ? "border-cyan text-cyan"
            : "border-border text-muted-foreground hover:border-cyan hover:text-cyan",
        )}
      >
        <Type className="h-4 w-4" />
        Adicionar texto
      </button>

      {showTextPanel && (
        <AddTextPanel
          colorSwatches={
            config.colorSwatches
          }
          fontOptions={
            config.fontOptions
          }
          onAdd={(
            text,
            options,
          ) => {
            addText(
              text,
              options,
            );

            setShowTextPanel(false);
          }}
          onClose={() =>
            setShowTextPanel(false)
          }
        />
      )}

      <div className="border border-border bg-surface-2 p-3">
        <LayerPanel
          layers={activeLayers}
          selectedLayerId={
            selectedLayer?.id ?? null
          }
          colorSwatches={
            config.colorSwatches
          }
          onSelectLayer={(
            id: LayerId | null,
          ) => selectLayer(id)}
          onUpdateLayer={
            handleUpdateLayer
          }
          onDeleteLayer={(
            id: LayerId,
          ) => deleteLayer(id)}
          onDuplicateLayer={(
            id: LayerId,
          ) => duplicateLayer(id)}
          onToggleLock={(
            id: LayerId,
          ) => toggleLock(id)}
          onToggleVisibility={(
            id: LayerId,
          ) =>
            toggleVisibility(id)
          }
          onReorderLayer={(
            id: LayerId,
            direction: LayerReorderDirection,
          ) =>
            reorderLayer(
              id,
              direction,
            )
          }
        />
      </div>

      {selectedLayer && (
        <div className="grid gap-2.5 border border-border bg-surface p-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
            Posição e transformação
          </p>

          <div className="grid grid-cols-4 gap-1.5">
            <button
              type="button"
              title="Centrar horizontalmente"
              onClick={() => alignSelected("horizontal")}
              className="flex items-center justify-center border border-border py-2 hover:border-cyan hover:text-cyan"
            >
              <AlignCenterHorizontal className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              title="Centrar verticalmente"
              onClick={() => alignSelected("vertical")}
              className="flex items-center justify-center border border-border py-2 hover:border-cyan hover:text-cyan"
            >
              <AlignCenterVertical className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              title="Espelhar na horizontal"
              onClick={() => flipSelected("x")}
              className="flex items-center justify-center border border-border py-2 hover:border-magenta hover:text-magenta"
            >
              <FlipHorizontal className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              title="Espelhar na vertical"
              onClick={() => flipSelected("y")}
              className="flex items-center justify-center border border-border py-2 hover:border-magenta hover:text-magenta"
            >
              <FlipVertical className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              title="Rodar -15°"
              onClick={() => rotateSelected(-15)}
              className="flex items-center justify-center gap-1 border border-border py-2 font-mono text-[0.6rem] hover:border-cyan hover:text-cyan"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              15°
            </button>

            <button
              type="button"
              title="Rodar +15°"
              onClick={() => rotateSelected(15)}
              className="flex items-center justify-center gap-1 border border-border py-2 font-mono text-[0.6rem] hover:border-cyan hover:text-cyan"
            >
              <RotateCw className="h-3.5 w-3.5" />
              15°
            </button>

            <button
              type="button"
              title="Repor rotação"
              onClick={() =>
                handleUpdateLayer({ rotation: 0 })
              }
              className="border border-border py-2 font-mono text-[0.6rem] uppercase hover:border-cyan hover:text-cyan"
            >
              0°
            </button>
          </div>

          <label className="grid gap-1">
            <span className="flex items-center justify-between font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
              Transparência
              <span className="text-cyan">
                {Math.round(
                  (selectedLayer.opacity ?? 1) * 100,
                )}
                %
              </span>
            </span>

            <input
              type="range"
              min={5}
              max={100}
              value={Math.round(
                (selectedLayer.opacity ?? 1) * 100,
              )}
              onChange={(event) =>
                setSelectedOpacity(
                  Number(event.target.value) / 100,
                )
              }
              className="accent-cyan"
            />
          </label>

          {selectedLayer.type === "image" && (
            <div className="grid gap-1">
              <span className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
                Fusão com o produto
              </span>

              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    ["multiply", "Realista"],
                    ["overlay", "Tecido"],
                    ["normal", "Sólido"],
                  ] as const
                ).map(([mode, label]) => {
                  const active =
                    (selectedLayer.type === "image" &&
                      selectedLayer.blendMode) ||
                    "multiply";

                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() =>
                        handleUpdateLayer({ blendMode: mode })
                      }
                      className={cn(
                        "border py-2 font-mono text-[0.58rem] uppercase tracking-wider transition-colors",
                        active === mode
                          ? "border-cyan text-cyan"
                          : "border-white/10 text-muted-foreground hover:border-cyan/60 hover:text-foreground",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}


          <p className="font-mono text-[0.55rem] leading-relaxed text-muted-foreground">
            Setas do teclado movem 1px · Shift+setas 10px ·
            Del apaga · Ctrl+Z desfaz
          </p>
        </div>
      )}

      {imageSelected && (
        <div className="grid gap-2 border border-border bg-surface p-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
            Ajustar imagem
          </p>

          {bgError && (
            <div className="border border-destructive/30 bg-destructive/10 p-2 text-[0.65rem] text-destructive">
              {bgError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={smartFit}
              disabled={!canEditImage}
              className="flex items-center justify-center gap-1.5 border border-border px-2.5 py-2 text-xs uppercase tracking-wider hover:border-cyan hover:text-cyan disabled:opacity-40"
            >
              <Target className="h-3.5 w-3.5" />
              Ajustar
            </button>

            <button
              type="button"
              onClick={coverFit}
              disabled={!canEditImage}
              className="flex items-center justify-center gap-1.5 border border-border px-2.5 py-2 text-xs uppercase tracking-wider hover:border-cyan hover:text-cyan disabled:opacity-40"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              Preencher
            </button>
          </div>

          <button
            type="button"
            onClick={
              smartFitIntelligent
            }
            disabled={!canEditImage}
            className="flex items-center gap-2 border border-cyan/50 bg-cyan/5 px-3 py-2 text-xs uppercase tracking-wider text-cyan hover:bg-cyan/10 disabled:opacity-40"
          >
            <Sparkles className="h-4 w-4" />
            Ajuste inteligente
          </button>

          {!selectedLayer.isBackgroundRemoved ? (
            <button
              type="button"
              onClick={async () => {
                setBgError(null);

                try {
                  await removeBackground(
                    selectedLayer.id,
                  );
                } catch (error) {
                  setBgError(
                    error instanceof Error
                      ? error.message
                      : "Não foi possível remover o fundo.",
                  );
                }
              }}
              disabled={
                selectedLayer.locked ||
                selectedLayer.isProcessingBg
              }
              className="flex items-center justify-center gap-2 border border-magenta/60 bg-magenta/10 px-3 py-2 text-xs uppercase tracking-wider text-magenta hover:bg-magenta hover:text-white disabled:opacity-40"
            >
              {selectedLayer.isProcessingBg ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {bgRemovalProgress?.statusText ??
                    "A processar…"}
                </>
              ) : (
                <>
                  <Eraser className="h-4 w-4" />
                  Remover fundo
                </>
              )}
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  toggleCompareOriginal(
                    selectedLayer.id,
                  )
                }
                className="border border-border px-2 py-2 text-[0.65rem] uppercase tracking-wider hover:border-cyan hover:text-cyan"
              >
                {selectedLayer.isViewingOriginal
                  ? "Ver sem fundo"
                  : "Ver original"}
              </button>

              <button
                type="button"
                onClick={() =>
                  restoreOriginal(
                    selectedLayer.id,
                  )
                }
                className="flex items-center justify-center gap-1 border border-border px-2 py-2 text-[0.65rem] uppercase tracking-wider hover:border-magenta hover:text-magenta"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restaurar
              </button>
            </div>
          )}
        </div>
      )}

      {otherSurface && (
        <div>
          <button
            type="button"
            disabled={
              activeLayers.length === 0
            }
            onClick={triggerCopy}
            className="flex w-full items-center justify-center gap-2 border border-border bg-surface px-3 py-2.5 text-xs uppercase tracking-wider text-muted-foreground hover:border-cyan hover:text-cyan disabled:opacity-30"
          >
            <Copy className="h-4 w-4" />
            Copiar para{" "}
            {otherSurface.label}
          </button>

          {showConfirmCopy && (
            <div className="mt-2 border border-yellow/50 bg-yellow/10 p-3 text-xs">
              <p className="font-semibold text-yellow">
                Substituir a outra
                área?
              </p>

              <p className="mt-1 text-muted-foreground">
                {otherSurface.label} já
                contém elementos.
              </p>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmCopy(
                      false,
                    )
                  }
                  className="border border-border px-3 py-1.5"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={confirmCopy}
                  className="bg-yellow px-3 py-1.5 font-bold text-black"
                >
                  Substituir
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          className="flex items-center justify-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-wider hover:border-cyan hover:text-cyan disabled:opacity-30"
        >
          <Undo2 className="h-4 w-4" />
          Desfazer
        </button>

        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          className="flex items-center justify-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-wider hover:border-cyan hover:text-cyan disabled:opacity-30"
        >
          <Redo2 className="h-4 w-4" />
          Refazer
        </button>
      </div>

      <button
        type="button"
        onClick={resetSurface}
        disabled={
          activeLayers.length === 0
        }
        className="border border-border px-3 py-2 text-[0.65rem] uppercase tracking-wider text-muted-foreground hover:border-destructive hover:text-destructive disabled:opacity-30"
      >
        Limpar área atual
      </button>

      <div className="border-t border-border pt-3">
        <p className="text-[0.65rem] leading-relaxed text-muted-foreground">
          Clica em{" "}
          <strong className="text-foreground">
            Ver Resultado
          </strong>{" "}
          para inspecionar o produto final em tamanho grande com acabamento limpo.
        </p>
      </div>
    </div>
  );
}
