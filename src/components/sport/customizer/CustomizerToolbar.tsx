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
  Download,
  Eraser,
  RotateCcw,
  RotateCw,
  Sparkles,
  Target,
  Trash,
  Type,
  Undo2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SportButton } from "@/components/sport/SportButton";
import { AddTextPanel } from "./AddTextPanel";
import { LayerPanel } from "./LayerPanel";
import type { ProductCustomizerHandle } from "@/hooks/useProductCustomizer";
import type { DesignLayer } from "@/lib/customizer/types";

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
    addImageFromFile,
    addText,
    updateLayer,
    deleteLayer,
    smartFit,
    resetSurface,
    undo,
    redo,
    downloadPreview,
  } = customizer;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTextPanel, setShowTextPanel] = useState(false);

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

  function handleDeleteSelected() {
    if (selectedLayer) deleteLayer(selectedLayer.id);
  }

  function handleUpdateSelected(changes: Partial<DesignLayer>, skipHistory?: boolean) {
    if (selectedLayer) updateLayer(selectedLayer.id, changes, skipHistory);
  }

  const canSmartFit = selectedLayer?.type === "image";

  return (
    <div className="flex flex-col gap-4">
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

      {/* === Selected Layer Properties === */}
      {selectedLayer && (
        <div className="border border-border bg-surface-2 p-3">
          <LayerPanel
            layer={selectedLayer}
            colorSwatches={config.colorSwatches}
            onUpdate={handleUpdateSelected}
            onDelete={handleDeleteSelected}
          />
        </div>
      )}

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
            : "Seleciona uma imagem primeiro"
        }
      >
        <Target className="h-4 w-4" />
        Ajustar à área
      </button>

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

      {/* === Delete selected === */}
      {selectedLayer && (
        <button
          onClick={handleDeleteSelected}
          className="flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
        >
          <Trash className="h-3.5 w-3.5" />
          Eliminar elemento
        </button>
      )}

      {/* === Reset surface === */}
      <button
        onClick={resetSurface}
        className="flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-yellow hover:text-yellow"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Limpar {activeSurface.label}
      </button>

      {/* === Export Preview === */}
      <button
        onClick={downloadPreview}
        className="flex items-center gap-2 border border-border bg-surface px-3 py-2.5 text-xs uppercase tracking-widest text-foreground transition-colors hover:border-cyan hover:text-cyan"
      >
        <Download className="h-4 w-4" />
        Exportar preview PNG
      </button>

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
