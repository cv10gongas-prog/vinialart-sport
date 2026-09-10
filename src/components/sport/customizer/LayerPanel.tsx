/**
 * VinilArt Sport — Real Layer Stack & Properties Panel
 *
 * Requirements (V1.5):
 *  - Visual list of all layers of active surface in real z-index order
 *  - Type badge (Imagem / Texto / Nome / Número) + short name
 *  - Selection indicator
 *  - Layer actions: Select, Delete, Duplicate, Move up/down, Bring to front, Send to back
 *  - Lock / Unlock toggle
 *  - Show / Hide toggle (visibility)
 *  - Properties section when a layer is selected (text content, font size, colors, rotation)
 */

import {
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsUp,
  Copy,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Lock,
  Trash2,
  Type,
  Unlock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  DesignLayer,
  LayerId,
  LayerReorderDirection,
} from "@/lib/customizer/types";

interface LayerPanelProps {
  layers: DesignLayer[];
  selectedLayerId: LayerId | null;
  colorSwatches: string[];
  onSelectLayer: (layerId: LayerId | null) => void;
  onUpdateLayer: (changes: Partial<DesignLayer>, skipHistory?: boolean) => void;
  onDeleteLayer: (layerId: LayerId) => void;
  onDuplicateLayer: (layerId: LayerId) => void;
  onToggleLock: (layerId: LayerId) => void;
  onToggleVisibility: (layerId: LayerId) => void;
  onReorderLayer: (layerId: LayerId, direction: LayerReorderDirection) => void;
}

export function LayerPanel({
  layers,
  selectedLayerId,
  colorSwatches,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onToggleLock,
  onToggleVisibility,
  onReorderLayer,
}: LayerPanelProps) {
  // Display layers from top (highest zIndex) to bottom (lowest zIndex)
  const displayLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);
  const selectedLayer = layers.find((l) => l.id === selectedLayerId) ?? null;

  return (
    <div className="grid gap-4">
      {/* === Layer Stack Header === */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">
          Camadas ({layers.length})
        </span>
        {selectedLayer && (
          <span className="text-[0.6rem] text-cyan uppercase tracking-wider">
            1 selecionada
          </span>
        )}
      </div>

      {/* === Empty state === */}
      {layers.length === 0 && (
        <div className="rounded border border-dashed border-border/70 p-4 text-center">
          <p className="text-xs text-muted-foreground">Nenhuma camada adicionada</p>
          <p className="mt-1 text-[0.65rem] text-muted-foreground/60">
            Carrega uma imagem ou adiciona texto acima
          </p>
        </div>
      )}

      {/* === Visual Layers List === */}
      {layers.length > 0 && (
        <div className="grid gap-1.5 max-h-56 overflow-y-auto pr-1">
          {displayLayers.map((layer, index) => {
            const isSelected = layer.id === selectedLayerId;
            const isTop = index === 0;
            const isBottom = index === displayLayers.length - 1;

            return (
              <div
                key={layer.id}
                onClick={() => onSelectLayer(layer.id)}
                className={cn(
                  "group flex items-center justify-between gap-1.5 border px-2.5 py-1.5 text-xs transition-colors cursor-pointer select-none",
                  isSelected
                    ? "border-cyan bg-cyan/10 text-foreground"
                    : "border-border/60 bg-surface-2 text-muted-foreground hover:border-border hover:text-foreground",
                  !layer.visible && "opacity-40",
                )}
              >
                {/* Left: Icon + Name */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {layer.type === "image" ? (
                    <ImageIcon className="h-3.5 w-3.5 shrink-0 text-magenta" />
                  ) : (
                    <Type className="h-3.5 w-3.5 shrink-0 text-cyan" />
                  )}
                  <span className="truncate text-xs font-medium">
                    {layer.name || (layer.type === "image" ? layer.filename : layer.text)}
                  </span>
                  {layer.type === "image" && layer.isBackgroundRemoved && (
                    <span className="shrink-0 rounded bg-magenta/20 px-1 py-0.5 text-[0.55rem] font-semibold text-magenta uppercase tracking-wider">
                      Sem fundo
                    </span>
                  )}
                </div>

                {/* Right: Quick actions (Lock, Visibility, Duplicate, Reorder, Delete) */}
                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Visibility Toggle */}
                  <button
                    type="button"
                    onClick={() => onToggleVisibility(layer.id)}
                    title={layer.visible ? "Ocultar camada" : "Mostrar camada"}
                    aria-label={layer.visible ? "Ocultar camada" : "Mostrar camada"}
                    className={cn(
                      "p-1 rounded hover:text-foreground transition-colors",
                      layer.visible ? "text-muted-foreground" : "text-yellow",
                    )}
                  >
                    {layer.visible ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {/* Lock Toggle */}
                  <button
                    type="button"
                    onClick={() => onToggleLock(layer.id)}
                    title={layer.locked ? "Desbloquear camada" : "Bloquear camada"}
                    aria-label={layer.locked ? "Desbloquear camada" : "Bloquear camada"}
                    className={cn(
                      "p-1 rounded hover:text-foreground transition-colors",
                      layer.locked ? "text-yellow" : "text-muted-foreground",
                    )}
                  >
                    {layer.locked ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : (
                      <Unlock className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100" />
                    )}
                  </button>

                  {/* Duplicate */}
                  <button
                    type="button"
                    onClick={() => onDuplicateLayer(layer.id)}
                    title="Duplicar camada (Ctrl+D)"
                    aria-label="Duplicar camada"
                    className="p-1 text-muted-foreground hover:text-cyan transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>

                  {/* Reorder Up / Down */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      disabled={isTop}
                      onClick={() => onReorderLayer(layer.id, "up")}
                      title="Mover para cima"
                      aria-label="Mover para cima"
                      className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={isBottom}
                      onClick={() => onReorderLayer(layer.id, "down")}
                      title="Mover para baixo"
                      aria-label="Mover para baixo"
                      className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => onDeleteLayer(layer.id)}
                    title="Eliminar camada"
                    aria-label="Eliminar elemento"
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Reorder shortcuts for selected layer === */}
      {selectedLayer && (
        <div className="flex items-center justify-between border-t border-border pt-2 text-[0.65rem] text-muted-foreground">
          <span className="uppercase tracking-widest">Ordem:</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onReorderLayer(selectedLayer.id, "top")}
              className="flex items-center gap-1 px-1.5 py-1 border border-border bg-surface hover:border-cyan hover:text-cyan"
              title="Trazer para a frente de tudo"
            >
              <ChevronsUp className="h-3 w-3" /> Topo
            </button>
            <button
              type="button"
              onClick={() => onReorderLayer(selectedLayer.id, "up")}
              className="flex items-center gap-1 px-1.5 py-1 border border-border bg-surface hover:border-cyan hover:text-cyan"
              title="Avançar uma posição"
            >
              <ChevronUp className="h-3 w-3" /> Frente
            </button>
            <button
              type="button"
              onClick={() => onReorderLayer(selectedLayer.id, "down")}
              className="flex items-center gap-1 px-1.5 py-1 border border-border bg-surface hover:border-cyan hover:text-cyan"
              title="Recuar uma posição"
            >
              <ChevronDown className="h-3 w-3" /> Trás
            </button>
            <button
              type="button"
              onClick={() => onReorderLayer(selectedLayer.id, "bottom")}
              className="flex items-center gap-1 px-1.5 py-1 border border-border bg-surface hover:border-cyan hover:text-cyan"
              title="Enviar para o fundo de tudo"
            >
              <ChevronsDown className="h-3 w-3" /> Fundo
            </button>
          </div>
        </div>
      )}

      {/* === Selected Layer Properties Inspector === */}
      {selectedLayer && (
        <div className="grid gap-3 border-t border-border pt-3">
          {/* Status info if locked */}
          {selectedLayer.locked && (
            <div className="flex items-center gap-1.5 rounded bg-yellow/10 border border-yellow/30 px-2 py-1.5 text-[0.65rem] text-yellow">
              <Lock className="h-3 w-3 shrink-0" />
              <span>Camada bloqueada. Desbloqueia para arrastar ou transformar.</span>
            </div>
          )}

          {/* Layer Name / Label edit */}
          <div>
            <label className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              Nome da camada
            </label>
            <input
              value={selectedLayer.name || ""}
              placeholder={selectedLayer.type === "image" ? selectedLayer.filename : selectedLayer.text}
              onChange={(e) => onUpdateLayer({ name: e.target.value })}
              className="mt-1 h-8 w-full border border-input bg-background px-2 text-xs outline-none focus:border-cyan"
            />
          </div>

          {/* Text layer specific: edit text content */}
          {selectedLayer.type === "text" && (
            <div>
              <label className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Conteúdo do texto
              </label>
              <input
                value={selectedLayer.text}
                onChange={(e) => onUpdateLayer({ text: e.target.value })}
                className="mt-1 h-8 w-full border border-input bg-background px-2 text-xs outline-none focus:border-cyan"
              />
            </div>
          )}

          {/* Text layer specific: font size slider */}
          {selectedLayer.type === "text" && (
            <div>
              <div className="flex justify-between text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                <span>Tamanho do texto</span>
                <span>{Math.round(selectedLayer.fontSize)}px</span>
              </div>
              <input
                type="range"
                min={14}
                max={120}
                value={Math.round(selectedLayer.fontSize)}
                onChange={(e) =>
                  onUpdateLayer(
                    { fontSize: Number(e.target.value) },
                    true,
                  )
                }
                onPointerUp={(e) =>
                  onUpdateLayer({
                    fontSize: Number((e.target as HTMLInputElement).value),
                  })
                }
                className="mt-1 w-full accent-cyan"
              />
            </div>
          )}

          {/* Colour picker — text layers */}
          {selectedLayer.type === "text" && colorSwatches.length > 0 && (
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
                    onClick={() => onUpdateLayer({ fill: c })}
                    className={cn(
                      "h-7 w-7 rounded-sm border-2 transition-transform hover:scale-110",
                      selectedLayer.fill === c
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
              <span>{Math.round(selectedLayer.rotation)}°</span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              disabled={selectedLayer.locked}
              value={Math.round(selectedLayer.rotation)}
              onChange={(e) =>
                onUpdateLayer(
                  { rotation: Number(e.target.value) },
                  true,
                )
              }
              onPointerUp={(e) =>
                onUpdateLayer({
                  rotation: Number((e.target as HTMLInputElement).value),
                })
              }
              className="mt-1 w-full accent-cyan disabled:opacity-30"
            />
          </div>
        </div>
      )}
    </div>
  );
}
