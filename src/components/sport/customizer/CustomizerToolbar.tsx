import {
  useRef,
  useState,
} from "react";

import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  Check,
  Copy,
  Loader2,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  RotateCw,
  Target,
  Trash2,
  Undo2,
  Redo2,
  Upload,
  FileText,
} from "lucide-react";

import { cn } from "@/lib/utils";
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
    deleteLayer,
    copyDesignToOtherSurface,
    smartFit,
    coverFit,
    resetSurface,
    clearDraft,
    undo,
    redo,
    alignSelected,
    rotateSelected,
    updateLayer,
  } = customizer;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showConfirmCopy, setShowConfirmCopy] = useState(false);
  const [isPanelDragOver, setIsPanelDragOver] = useState(false);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const pdfFile = fileList.find(f => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    const imageFiles = fileList.filter(f => f.type.startsWith("image/"));

    if (pdfFile) {
      setPdfFileName(pdfFile.name);
    }

    if (imageFiles.length > 0) {
      const dt = new DataTransfer();
      imageFiles.forEach(f => dt.items.add(f));
      addImagesFromFiles(dt.files);
    }

    event.target.value = "";
  }

  const otherSurface = config.surfaces.find(
    (surface) => surface.id !== state.activeSurfaceId,
  );

  const imageSelected = selectedLayer?.type === "image";
  const currentLayer = selectedLayer ?? activeLayers[activeLayers.length - 1] ?? null;

  function handleScaleChange(delta: number) {
    if (!currentLayer) return;
    const currentScale = currentLayer.scaleX ?? 1;
    const newScale = Math.max(0.1, Math.min(5, currentScale + delta));
    updateLayer(currentLayer.id, {
      scaleX: newScale,
      scaleY: newScale,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Status & Limpar */}
      <div className="flex items-center justify-between border-b border-border pb-2 text-[0.65rem]">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-cyan" />
              A guardar…
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check className="h-3 w-3 text-green-400" />
              Design guardado
            </>
          )}
          {saveStatus === "idle" && (
            <span>Design pronto a aplicar</span>
          )}
        </div>

        {activeLayers.length > 0 && (
          <button
            type="button"
            onClick={() => setShowConfirmClear(true)}
            className="text-[0.6rem] uppercase tracking-wider text-muted-foreground hover:text-destructive transition-colors"
          >
            Limpar
          </button>
        )}
      </div>

      {showConfirmClear && (
        <div className="border border-destructive/40 bg-destructive/10 p-3 text-xs">
          <p className="font-semibold text-destructive">
            Remover ficheiro desta área?
          </p>
          <p className="mt-1 text-[0.7rem] text-muted-foreground">
            O ficheiro aplicado será removido.
          </p>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowConfirmClear(false)}
              className="border border-border px-3 py-1.5 font-display text-[0.65rem] uppercase"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={async () => {
                await clearDraft();
                setPdfFileName(null);
                setShowConfirmClear(false);
              }}
              className="bg-destructive px-3 py-1.5 font-display text-[0.65rem] uppercase font-bold text-white"
            >
              Remover
            </button>
          </div>
        </div>
      )}

      {/* 2. Upload de Ficheiro */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf,image/svg+xml"
          className="sr-only"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsPanelDragOver(true);
          }}
          onDragLeave={() => setIsPanelDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsPanelDragOver(false);
            if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
              const fileList = Array.from(event.dataTransfer.files);
              const pdf = fileList.find(f => f.type === "application/pdf" || f.name.endsWith(".pdf"));
              if (pdf) setPdfFileName(pdf.name);
              const imgs = fileList.filter(f => f.type.startsWith("image/"));
              if (imgs.length > 0) {
                const dt = new DataTransfer();
                imgs.forEach(f => dt.items.add(f));
                addImagesFromFiles(dt.files);
              }
            }
          }}
          className={cn(
            "flex w-full flex-col items-center gap-2 border-2 border-dashed bg-surface-2 px-3 py-5 text-center transition-all",
            isPanelDragOver
              ? "border-cyan bg-cyan/10"
              : "border-border hover:border-cyan",
          )}
        >
          <Upload className="h-6 w-6 text-cyan" />
          <div>
            <span className="font-display text-xs uppercase tracking-wider text-foreground">
              Carregar ficheiro de design
            </span>
            <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-widest text-muted-foreground">
              PNG · JPG · WEBP · PDF
            </p>
          </div>
        </button>

        {pdfFileName && (
          <div className="mt-2 flex items-center justify-between border border-cyan/40 bg-cyan/5 p-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-4 w-4 shrink-0 text-cyan" />
              <span className="truncate font-mono text-[0.65rem] text-cyan">
                {pdfFileName}
              </span>
            </div>
            <span className="font-mono text-[0.55rem] uppercase text-muted-foreground">
              Ficheiro anexado
            </span>
          </div>
        )}
      </div>

      {/* 3. Controlos Simples de Posicionamento (quando há design aplicado) */}
      {activeLayers.length > 0 && (
        <div className="grid gap-3 border border-border bg-surface p-3.5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[0.62rem] uppercase tracking-widest text-cyan">
              Ajustar no Produto
            </p>
            <span className="font-mono text-[0.55rem] uppercase text-muted-foreground">
              Área Personalizável
            </span>
          </div>

          {/* Ajustar e Preencher */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={smartFit}
              className="flex items-center justify-center gap-1.5 border border-border bg-background/60 py-2.5 font-display text-[0.65rem] uppercase tracking-wider hover:border-cyan hover:text-cyan transition-colors"
            >
              <Target className="h-3.5 w-3.5 text-cyan" />
              Ajustar
            </button>

            <button
              type="button"
              onClick={coverFit}
              className="flex items-center justify-center gap-1.5 border border-border bg-background/60 py-2.5 font-display text-[0.65rem] uppercase tracking-wider hover:border-cyan hover:text-cyan transition-colors"
            >
              <Maximize2 className="h-3.5 w-3.5 text-cyan" />
              Preencher
            </button>
          </div>

          {/* Centrar / Mover */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => alignSelected("horizontal")}
              className="flex items-center justify-center gap-1.5 border border-border bg-background/60 py-2 font-display text-[0.62rem] uppercase tracking-wider text-muted-foreground hover:border-cyan hover:text-foreground transition-colors"
            >
              <AlignCenterHorizontal className="h-3.5 w-3.5" />
              Centrar H.
            </button>

            <button
              type="button"
              onClick={() => alignSelected("vertical")}
              className="flex items-center justify-center gap-1.5 border border-border bg-background/60 py-2 font-display text-[0.62rem] uppercase tracking-wider text-muted-foreground hover:border-cyan hover:text-foreground transition-colors"
            >
              <AlignCenterVertical className="h-3.5 w-3.5" />
              Centrar V.
            </button>
          </div>

          {/* Tamanho: Aumentar / Diminuir */}
          <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
            <span className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
              Tamanho
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScaleChange(-0.1)}
                className="flex items-center gap-1 border border-border bg-background px-2 py-1 font-mono text-xs hover:border-cyan"
                title="Diminuir"
              >
                <Minus className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => handleScaleChange(0.1)}
                className="flex items-center gap-1 border border-border bg-background px-2 py-1 font-mono text-xs hover:border-cyan"
                title="Aumentar"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Rotação */}
          <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
            <span className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
              Rodar
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => rotateSelected(-15)}
                className="flex items-center gap-1 border border-border bg-background px-2.5 py-1 font-mono text-[0.6rem] hover:border-cyan"
                title="Rodar -15°"
              >
                <RotateCcw className="h-3 w-3" />
                -15°
              </button>
              <button
                type="button"
                onClick={() => rotateSelected(15)}
                className="flex items-center gap-1 border border-border bg-background px-2.5 py-1 font-mono text-[0.6rem] hover:border-cyan"
                title="Rodar +15°"
              >
                <RotateCw className="h-3 w-3" />
                +15°
              </button>
              <button
                type="button"
                onClick={() => updateLayer(currentLayer?.id ?? "", { rotation: 0 })}
                className="border border-border bg-background px-2 py-1 font-mono text-[0.6rem] hover:border-cyan"
                title="Repor 0°"
              >
                0°
              </button>
            </div>
          </div>

          {/* Remover ficheiro desta superfície */}
          <button
            type="button"
            onClick={() => {
              if (currentLayer) deleteLayer(currentLayer.id);
            }}
            className="mt-1 flex items-center justify-center gap-1 text-[0.62rem] uppercase tracking-wider text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            Remover do produto
          </button>
        </div>
      )}

      {/* 4. Copiar para o outro lado (ex.: Caneleiras Esquerda -> Direita) */}
      {otherSurface && activeLayers.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => {
              copyDesignToOtherSurface(otherSurface.id);
              setShowConfirmCopy(true);
              setTimeout(() => setShowConfirmCopy(false), 2000);
            }}
            className="flex w-full items-center justify-center gap-2 border border-border bg-surface px-3 py-2.5 font-display text-[0.65rem] uppercase tracking-wider text-muted-foreground hover:border-cyan hover:text-cyan transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
            Copiar para {otherSurface.label}
          </button>
          {showConfirmCopy && (
            <p className="mt-1 text-center font-mono text-[0.6rem] text-green-400">
              Copiado para {otherSurface.label}!
            </p>
          )}
        </div>
      )}

      {/* 5. Desfazer / Refazer */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          className="flex items-center justify-center gap-1.5 border border-border px-3 py-2 font-display text-[0.65rem] uppercase tracking-wider hover:border-cyan hover:text-cyan disabled:opacity-30 transition-colors"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Desfazer
        </button>

        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          className="flex items-center justify-center gap-1.5 border border-border px-3 py-2 font-display text-[0.65rem] uppercase tracking-wider hover:border-cyan hover:text-cyan disabled:opacity-30 transition-colors"
        >
          <Redo2 className="h-3.5 w-3.5" />
          Refazer
        </button>
      </div>
    </div>
  );
}
