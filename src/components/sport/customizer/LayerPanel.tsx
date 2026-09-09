/**
 * VinilArt Sport — Layer Properties Panel
 *
 * Shown when a layer is selected.
 * Provides controls for:
 *  - Text editing & font size slider (text layers)
 *  - Colour picker (text layers)
 *  - Rotation slider (all layers)
 *  - Delete action
 */

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DesignLayer } from "@/lib/customizer/types";

interface LayerPanelProps {
  layer: DesignLayer;
  colorSwatches: string[];
  onUpdate: (changes: Partial<DesignLayer>, skipHistory?: boolean) => void;
  onDelete: () => void;
}

export function LayerPanel({
  layer,
  colorSwatches,
  onUpdate,
  onDelete,
}: LayerPanelProps) {
  const currentFill = layer.type === "text" ? layer.fill : null;

  return (
    <div className="grid gap-3">
      {/* Layer type badge + delete */}
      <div className="flex items-center justify-between">
        <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
          {layer.type === "image" ? "🖼 Imagem" : "📝 Texto"}
          {layer.type === "image" && (
            <span className="ml-2 max-w-[120px] truncate opacity-60 inline-block align-bottom">
              {layer.filename}
            </span>
          )}
        </span>
        <button
          onClick={onDelete}
          className="text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Eliminar elemento"
          title="Eliminar elemento"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Text layer specific: edit text content */}
      {layer.type === "text" && (
        <div>
          <label className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            Texto
          </label>
          <input
            value={layer.text}
            onChange={(e) => onUpdate({ text: e.target.value } as Partial<DesignLayer>)}
            className="mt-1 h-8 w-full border border-input bg-background px-2 text-xs outline-none focus:border-cyan"
          />
        </div>
      )}

      {/* Text layer specific: font size slider */}
      {layer.type === "text" && (
        <div>
          <div className="flex justify-between text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            <span>Tamanho</span>
            <span>{Math.round(layer.fontSize)}px</span>
          </div>
          <input
            type="range"
            min={14}
            max={120}
            value={Math.round(layer.fontSize)}
            onChange={(e) =>
              onUpdate(
                { fontSize: Number(e.target.value) } as Partial<DesignLayer>,
                true, // skip history during sliding
              )
            }
            onPointerUp={(e) =>
              onUpdate({
                fontSize: Number((e.target as HTMLInputElement).value),
              } as Partial<DesignLayer>)
            }
            className="mt-1 w-full accent-cyan"
          />
        </div>
      )}

      {/* Colour picker — only for text layers */}
      {layer.type === "text" && colorSwatches.length > 0 && (
        <div>
          <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            Cor do texto
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {colorSwatches.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Cor ${c}`}
                onClick={() =>
                  onUpdate({ fill: c } as Partial<DesignLayer>)
                }
                className={cn(
                  "h-7 w-7 rounded-sm border-2 transition-transform hover:scale-110",
                  currentFill === c
                    ? "border-foreground scale-110"
                    : "border-transparent",
                )}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Rotation slider */}
      <div>
        <div className="flex justify-between text-[0.65rem] uppercase tracking-widest text-muted-foreground">
          <span>Rotação</span>
          <span>{Math.round(layer.rotation)}°</span>
        </div>
        <input
          type="range"
          min={-180}
          max={180}
          value={Math.round(layer.rotation)}
          onChange={(e) =>
            onUpdate(
              { rotation: Number(e.target.value) } as Partial<DesignLayer>,
              true, // skip history during sliding
            )
          }
          onPointerUp={(e) =>
            onUpdate({
              rotation: Number((e.target as HTMLInputElement).value),
            } as Partial<DesignLayer>)
          }
          className="mt-1 w-full accent-cyan"
        />
      </div>

      {/* Help tip */}
      <p className="text-[0.6rem] leading-relaxed text-muted-foreground/60">
        Usa os controlos azuis no canvas para mover, redimensionar e rodar.
      </p>
    </div>
  );
}
