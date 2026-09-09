/**
 * VinilArt Sport — Add Text Dialog
 *
 * Simple panel for adding name, number or custom text layers.
 */

import { useState } from "react";
import { Type, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddTextPanelProps {
  colorSwatches: string[];
  fontOptions: string[];
  onAdd: (
    text: string,
    options: { fill: string; fontSize: number; fontFamily: string },
  ) => void;
  onClose: () => void;
}

export function AddTextPanel({
  colorSwatches,
  fontOptions,
  onAdd,
  onClose,
}: AddTextPanelProps) {
  const [text, setText] = useState("");
  const [fill, setFill] = useState(colorSwatches[0] ?? "oklch(0.985 0 0)");
  const [fontSize, setFontSize] = useState(36);
  const [fontFamily, setFontFamily] = useState(fontOptions[0] ?? "Archivo Black");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim(), { fill, fontSize, fontFamily });
    onClose();
  }

  return (
    <div className="card-sport hover:!translate-y-0 border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-2 font-display text-xs uppercase tracking-widest">
          <Type className="h-3.5 w-3.5 text-cyan" />
          Adicionar Texto
        </p>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3">
        {/* Quick-fill shortcuts */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setText("Nome")}
            className="border border-border px-2 py-1.5 text-[0.65rem] uppercase tracking-widest text-muted-foreground hover:border-magenta hover:text-magenta transition-colors"
          >
            Nome
          </button>
          <button
            type="button"
            onClick={() => setText("10")}
            className="border border-border px-2 py-1.5 text-[0.65rem] uppercase tracking-widest text-muted-foreground hover:border-magenta hover:text-magenta transition-colors"
          >
            Número
          </button>
        </div>

        {/* Text input */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Texto personalizado…"
          className="h-10 border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-cyan"
          autoFocus
        />

        {/* Font */}
        <div>
          <label className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            Fonte
          </label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="mt-1.5 h-9 w-full border border-input bg-background px-2 text-xs outline-none focus:border-cyan"
          >
            {fontOptions.map((f) => (
              <option key={f} value={f} style={{ fontFamily: f }}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Font size */}
        <div>
          <label className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            Tamanho: {fontSize}px
          </label>
          <input
            type="range"
            min={12}
            max={120}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="mt-1.5 w-full accent-cyan"
          />
        </div>

        {/* Color swatches */}
        <div>
          <label className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            Cor
          </label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {colorSwatches.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Cor ${c}`}
                onClick={() => setFill(c)}
                className={cn(
                  "h-7 w-7 rounded-sm border transition-transform hover:scale-110",
                  fill === c
                    ? "border-foreground scale-110"
                    : "border-transparent",
                )}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div
          className="flex min-h-[3rem] items-center justify-center border border-dashed border-border bg-background px-2 py-2"
          style={{ fontFamily, fontSize: Math.min(fontSize, 40), color: fill }}
        >
          {text || <span className="text-muted-foreground/40 text-xs">Pré-visualização</span>}
        </div>

        <button
          type="submit"
          disabled={!text.trim()}
          className="h-10 bg-magenta font-display text-xs uppercase tracking-widest text-primary-foreground disabled:opacity-40 hover:brightness-110 transition-all"
        >
          Adicionar ao design
        </button>
      </form>
    </div>
  );
}
