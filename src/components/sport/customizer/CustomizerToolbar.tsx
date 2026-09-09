/**
 * VinilArt Sport — Customizer Toolbar
 *
 * Right-hand tool panel.
 * All actions are real except the two clearly marked "future" features:
 *  - Remover fundo (background removal)
 *  - Ajustar com IA (AI adjust)
 */

import { useRef, useState, useEffect } from "react";
import {
  Check,
  Copy,
  Download,
  Eraser,
  Loader2,
  RotateCcw,
  RotateCw,
  Sparkles,
  Target,
  Type,
  Undo2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SportButton } from "@/components/sport/SportButton";
import { AddTextPanel } from "./AddTextPanel";
import { LayerPanel } from "./LayerPanel";
import type { ProductCustomizerHandle } from "@/hooks/useProductCustomizer";
import type { DesignLayer, LayerId, LayerReorderDirection } from "@/lib/customizer/types";

interface CustomizerToolbarProps {
  customizer: ProductCustomizerHandle;
}

export function CustomizerToolbar({ customizer }: CustomizerToolbarProps) {
  const {
    config,
    state,
    selectedLayer,
    canUndo,
    canRedo,
    activeSurface,
    activeLayers,
    saveStatus,
    addImageFromFile,
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
    resetSurface,
    clearDraft,
    undo,
    redo,
    downloadPreview,
  } = customizer;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTextPanel, setShowTextPanel] = useState(false);
  const [showConfirmCopy, setShowConfirmCopy] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Close text panel when switching surfaces
  useEffect(() => {
    setShowTextPanel(false);
  }, [state.activeSurfaceId]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    addImageFromFile(file);
    e.target.value = "";
    setShowTextPanel(false);
  }

  function handleAddText(
    text: string,
    options: { fill: string; fontSize: number; fontFamily: string },
  ) {
    addText(text, options);
    setShowTextPanel(false);
  }

  function handleUpdateLayer(changes: Partial<DesignLayer>, skipHistory?: boolean) {
    if (selectedLayer) updateLayer(selectedLayer.id, changes, skipHistory);
  }

  // Find the other surface (for 2-surface products like caneleiras)
  const otherSurface = config.surfaces.find((s) => s.id !== state.activeSurfaceId);
  const otherSurfaceDesign = otherSurface ? state.surfaces[otherSurface.id] : undefined;
  const otherHasContent = (otherSurfaceDesign?.layers.length ?? 0) > 0;

  function handleTriggerCopy() {
    if (otherHasContent) {
      setShowConfirmCopy(true);
    } else if (otherSurface) {
      copyDesignToOtherSurface(otherSurface.id);
    }
  }

  function handleConfirmCopy() {
    if (otherSurface) {
      copyDesignToOtherSurface(otherSurface.id);
    }
    setShowConfirmCopy(false);
  }

  const canSmartFit = selectedLayer?.type === "image" && !selectedLayer.locked;

  return (
    <div className="flex flex-col gap-4">
      {/* === Draft Save Status Banner === */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2 text-[0.65rem]">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-cyan" />
              <span>A guardar...</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check className="h-3 w-3 text-neon-green" />
              <span>Rascunho guardado</span>
            </>
          )}
          {saveStatus === "idle" && <span>Rascunho local</span>}
        </div>

        <button
          type="button"
          onClick={() => setShowConfirmClear(true)}
          className="text-muted-foreground/60 hover:text-destructive transition-colors uppercase tracking-wider text-[0.6rem]"
        >
          Limpar rascunho
        </button>
      </div>

      {/* Confirmation Modal: Clear Draft */}
      {showConfirmClear && (
        <div className="rounded border border-destructive/40 bg-destructive/10 p-3 text-xs">
          <p className="font-semibold text-destructive">Limpar todo o rascunho?</p>
          <p className="mt-1 text-[0.7rem] text-muted-foreground">
            Isto irá apagar todas as camadas e imagens guardadas localmente em ambos os lados.
          </p>
          <div className="mt-2.5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowConfirmClear(false)}
              className="border border-border px-2.5 py-1 text-[0.65rem] uppercase tracking-wider hover:bg-surface"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={async () => {
                await clearDraft();
                setShowConfirmClear(false);
              }}
              className="bg-destructive px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-destructive-foreground hover:opacity-90"
            >
              Sim, limpar tudo
            </button>
          </div>
        </div>
      )}

      {/* === Upload Image === */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleFileChange}
        />
        <button
          onClick={() => {
            setShowTextPanel(false);
            fileInputRef.current?.click();
          }}
          className="flex w-full flex-col items-center gap-2 border border-dashed border-border bg-surface-2 px-3 py-4 text-center transition-colors hover:border-magenta hover:bg-surface"
        >
          <Upload className="h-5 w-5 text-magenta" />
          <span className="text-xs text-muted-foreground">
            Carregar imagem / logo
          </span>
          <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground/60">
            JPG · PNG · WEBP
          </span>
        </button>
      </div>

      {/* === Text Panel toggle === */}
      <button
        onClick={() => setShowTextPanel((v) => !v)}
        className={cn(
          "flex items-center gap-2 border px-3 py-2.5 text-xs uppercase tracking-widest transition-colors",
          showTextPanel
            ? "border-cyan text-cyan"
            : "border-border text-muted-foreground hover:border-cyan hover:text-cyan",
        )}
      >
        <Type className="h-4 w-4" />
        Adicionar Texto
      </button>

      {/* === Add Text Panel (expanded) === */}
      {showTextPanel && (
        <AddTextPanel
          colorSwatches={config.colorSwatches}
          fontOptions={config.fontOptions}
          onAdd={handleAddText}
          onClose={() => setShowTextPanel(false)}
        />
      )}

      {/* === Real Layer Management Stack === */}
      <div className="border border-border bg-surface-2 p-3">
        <LayerPanel
          layers={activeLayers}
          selectedLayerId={selectedLayer?.id ?? null}
          colorSwatches={config.colorSwatches}
          onSelectLayer={(id: LayerId | null) => selectLayer(id)}
          onUpdateLayer={handleUpdateLayer}
          onDeleteLayer={(id: LayerId) => deleteLayer(id)}
          onDuplicateLayer={(id: LayerId) => duplicateLayer(id)}
          onToggleLock={(id: LayerId) => toggleLock(id)}
          onToggleVisibility={(id: LayerId) => toggleVisibility(id)}
          onReorderLayer={(id: LayerId, dir: LayerReorderDirection) => reorderLayer(id, dir)}
        />
      </div>

      {/* === Smart Fit (real, no AI) === */}
      <button
        onClick={smartFit}
        disabled={!canSmartFit}
        className={cn(
          "flex items-center gap-2 border px-3 py-2.5 text-xs uppercase tracking-widest transition-colors",
          canSmartFit
            ? "border-cyan text-cyan hover:bg-cyan/10"
            : "border-border text-muted-foreground/40 cursor-not-allowed",
        )}
        title={
          canSmartFit
            ? "Ajusta automaticamente à área de impressão"
            : "Seleciona uma imagem desbloqueada primeiro"
        }
      >
        <Target className="h-4 w-4" />
        Ajustar à área
      </button>

      {/* === "Aplicar este design aos dois lados" === */}
      {otherSurface && (
        <div>
          <button
            type="button"
            onClick={handleTriggerCopy}
            disabled={activeLayers.length === 0}
            className="flex w-full items-center justify-center gap-2 border border-border bg-surface px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-cyan hover:text-cyan disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Copy className="h-3.5 w-3.5" />
            Aplicar aos dois lados
          </button>

          {/* Confirm overwrite modal */}
          {showConfirmCopy && (
            <div className="mt-2 rounded border border-yellow/50 bg-yellow/10 p-3 text-xs">
              <p className="font-semibold text-yellow">Substituir design existente?</p>
              <p className="mt-1 text-[0.7rem] text-muted-foreground">
                O lado <strong>{otherSurface.label}</strong> já tem elementos. Queres substituí-los pelo design atual?
              </p>
              <div className="mt-2.5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmCopy(false)}
                  className="border border-border px-2.5 py-1 text-[0.65rem] uppercase tracking-wider hover:bg-surface"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCopy}
                  className="bg-yellow px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-yellow-foreground hover:opacity-90"
                >
                  Substituir
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === Undo / Redo === */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="flex items-center justify-center gap-1.5 border border-border px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-cyan hover:text-cyan disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Desfazer
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="flex items-center justify-center gap-1.5 border border-border px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-cyan hover:text-cyan disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Refazer
        </button>
      </div>

      {/* === Reset surface === */}
      <button
        onClick={resetSurface}
        className="flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-yellow hover:text-yellow"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Limpar {activeSurface.label}
      </button>

      {/* === Export Options === */}
      <div className="grid gap-2">
        <button
          onClick={customizer.downloadPreview}
          className="flex items-center gap-2 border border-border bg-surface px-3 py-2 text-xs uppercase tracking-widest text-foreground transition-colors hover:border-cyan hover:text-cyan"
          title="Exporta o produto completo com o design e reflexos para apresentação ao cliente"
        >
          <Download className="h-4 w-4 text-cyan" />
          Exportar Preview do Produto
        </button>

        <button
          onClick={customizer.downloadProductionArt}
          className="flex items-center gap-2 border border-border bg-surface px-3 py-2 text-xs uppercase tracking-widest text-foreground transition-colors hover:border-magenta hover:text-magenta"
          title="Exporta a arte personalizada isolada (estrutura técnica preliminar para integração de produção futura)"
        >
          <Download className="h-4 w-4 text-magenta" />
          Exportar Arte (Técnica)
        </button>
      </div>

      {/* === FUTURE features === */}
      <div className="grid gap-2 border-t border-border pt-4">
        <p className="text-[0.6rem] uppercase tracking-widest text-muted-foreground/50">
          Funcionalidades futuras
        </p>
        <button
          disabled
          className="flex cursor-not-allowed items-center gap-2 border border-dashed border-border px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground/40"
        >
          <Eraser className="h-3.5 w-3.5" />
          Remover fundo
        </button>
        <SportButton variant="gradient" className="w-full opacity-40" disabled>
          <Sparkles className="h-4 w-4" />
          Ajustar com IA
        </SportButton>
        <p className="text-center text-[0.6rem] uppercase tracking-widest text-muted-foreground/40">
          Em desenvolvimento
        </p>
      </div>
    </div>
  );
}
