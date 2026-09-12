import React, { useRef, useEffect, useCallback, useState } from "react";
import { Palette } from "lucide-react";

interface ColorWheelProps {
  value: string;
  onChange: (hex: string) => void;
}

// Utility: HSL to HEX
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return ("#" + f(0) + f(8) + f(4)).toUpperCase();
}

// Utility: HEX to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (cleanHex.length !== 6) return { h: 190, s: 100, l: 50 };

  const num = parseInt(cleanHex, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
  }

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

const VINILART_PRESETS = [
  "#00C8FF", // Cyan VinilArt
  "#FF0055", // Magenta VinilArt
  "#FFDD00", // Yellow
  "#FFFFFF", // White
  "#111622", // Night Navy
  "#10B981", // Emerald
  "#8B5CF6", // Violet
  "#F97316", // Orange
];

export function ColorWheel({ value, onChange }: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hsl, setHsl] = useState(() => hexToHsl(value));
  const [hexInput, setHexInput] = useState(value);
  const [isDraggingWheel, setIsDraggingWheel] = useState(false);

  useEffect(() => {
    if (value && value.toUpperCase() !== hslToHex(hsl.h, hsl.s, hsl.l)) {
      const parsed = hexToHsl(value);
      setHsl(parsed);
      setHexInput(value.toUpperCase());
    }
  }, [value]);

  const WHEEL_RADIUS = 72; // 144x144 px canvas
  const WHEEL_SIZE = WHEEL_RADIUS * 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);

    const imgData = ctx.createImageData(WHEEL_SIZE, WHEEL_SIZE);
    const data = imgData.data;

    for (let y = 0; y < WHEEL_SIZE; y++) {
      for (let x = 0; x < WHEEL_SIZE; x++) {
        const dx = x - WHEEL_RADIUS;
        const dy = y - WHEEL_RADIUS;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= WHEEL_RADIUS) {
          let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          if (angle < 0) angle += 360;

          const sat = Math.min(dist / WHEEL_RADIUS, 1);
          const h = angle / 360;
          const s = sat;
          const l = 0.5;

          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          const hue2rgb = (t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          };

          const r = Math.round(hue2rgb(h + 1 / 3) * 255);
          const g = Math.round(hue2rgb(h) * 255);
          const b = Math.round(hue2rgb(h - 1 / 3) * 255);

          const idx = (y * WHEEL_SIZE + x) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          const edgeAlpha = dist > WHEEL_RADIUS - 1 ? (WHEEL_RADIUS - dist) * 255 : 255;
          data[idx + 3] = Math.max(0, Math.min(255, Math.round(edgeAlpha)));
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [WHEEL_SIZE, WHEEL_RADIUS]);

  const handleWheelCoord = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left - WHEEL_RADIUS;
      const y = clientY - rect.top - WHEEL_RADIUS;

      let angle = (Math.atan2(y, x) * 180) / Math.PI;
      if (angle < 0) angle += 360;

      const dist = Math.min(Math.sqrt(x * x + y * y), WHEEL_RADIUS);
      const sat = Math.round((dist / WHEEL_RADIUS) * 100);

      const nextHsl = { ...hsl, h: Math.round(angle), s: sat };
      setHsl(nextHsl);
      const nextHex = hslToHex(nextHsl.h, nextHsl.s, nextHsl.l);
      setHexInput(nextHex);
      onChange(nextHex);
    },
    [hsl, WHEEL_RADIUS, onChange],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDraggingWheel(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handleWheelCoord(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingWheel) return;
    handleWheelCoord(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDraggingWheel(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleLightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const l = Number(e.target.value);
    const nextHsl = { ...hsl, l };
    setHsl(nextHsl);
    const nextHex = hslToHex(nextHsl.h, nextHsl.s, nextHsl.l);
    setHexInput(nextHex);
    onChange(nextHex);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setHexInput(val);
    if (/^#[0-9A-F]{6}$/.test(val)) {
      const parsed = hexToHsl(val);
      setHsl(parsed);
      onChange(val);
    }
  };

  const thumbAngleRad = (hsl.h * Math.PI) / 180;
  const thumbDist = (hsl.s / 100) * WHEEL_RADIUS;
  const thumbX = WHEEL_RADIUS + Math.cos(thumbAngleRad) * thumbDist;
  const thumbY = WHEEL_RADIUS + Math.sin(thumbAngleRad) * thumbDist;

  const currentHex = hslToHex(hsl.h, hsl.s, hsl.l);

  return (
    <div className="flex flex-col items-center space-y-3.5 select-none">
      {/* Header */}
      <div className="flex w-full items-center justify-between border-b border-white/10 pb-2.5">
        <span className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-white">
          <Palette size={14} className="text-cyan-400" />
          Roda Cromática
        </span>
        <div className="flex items-center gap-2">
          <span
            className="h-4 w-4 rounded-full border border-white/30 shadow-sm"
            style={{ backgroundColor: currentHex }}
          />
          <span className="font-mono text-xs uppercase font-bold text-cyan-400 tracking-wider">
            {currentHex}
          </span>
        </div>
      </div>

      {/* Circular Wheel */}
      <div className="relative flex items-center justify-center p-1">
        <div className="relative rounded-full shadow-[0_0_20px_rgba(0,0,0,0.6)] border-2 border-white/10 overflow-hidden cursor-crosshair">
          <canvas
            ref={canvasRef}
            width={WHEEL_SIZE}
            height={WHEEL_SIZE}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="block touch-none"
          />
        </div>

        {/* Thumb indicator on wheel */}
        <div
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_8px_rgba(0,0,0,0.8)]"
          style={{
            left: (thumbX + 4) + "px",
            top: (thumbY + 4) + "px",
            backgroundColor: hslToHex(hsl.h, hsl.s, 50),
          }}
        />
      </div>

      {/* Lightness Slider */}
      <div className="w-full space-y-1.5">
        <div className="flex justify-between items-center text-[0.65rem] font-mono text-zinc-400 uppercase">
          <span>Luminosidade</span>
          <span>{hsl.l}%</span>
        </div>
        <div className="relative flex items-center">
          <input
            type="range"
            min={5}
            max={95}
            value={hsl.l}
            onChange={handleLightnessChange}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer focus:outline-none transition-all"
            style={{
              background: "linear-gradient(to right, #000000, " + hslToHex(hsl.h, hsl.s, 50) + ", #ffffff)",
            }}
          />
        </div>
      </div>

      {/* HEX Input & Current Color Preview */}
      <div className="flex w-full items-center gap-2.5 pt-1">
        <div
          className="h-8 w-8 shrink-0 rounded-xl border border-white/20 shadow-inner"
          style={{ backgroundColor: currentHex }}
        />
        <div className="flex-1 relative">
          <input
            type="text"
            value={hexInput}
            maxLength={7}
            onChange={handleHexChange}
            placeholder="#00C8FF"
            className="w-full rounded-xl border border-white/15 bg-zinc-900/90 px-3 py-1.5 font-mono text-xs text-cyan-300 uppercase tracking-wider focus:border-cyan-400 focus:outline-none shadow-inner"
          />
        </div>
      </div>

      {/* Quick VinilArt Presets */}
      <div className="w-full space-y-1.5 pt-1 border-t border-white/5">
        <span className="text-[0.65rem] font-mono uppercase text-zinc-400">
          Cores Rápidas
        </span>
        <div className="flex items-center justify-between gap-1.5">
          {VINILART_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                const parsed = hexToHsl(preset);
                setHsl(parsed);
                setHexInput(preset);
                onChange(preset);
              }}
              style={{ backgroundColor: preset }}
              aria-label={"Cor " + preset}
              className={"h-5 w-5 rounded-full border transition-all hover:scale-110 " + (
                currentHex.toLowerCase() === preset.toLowerCase()
                  ? "border-cyan-400 scale-110 shadow-[0_0_8px_rgba(0,200,255,0.6)] ring-1 ring-cyan-400"
                  : "border-white/20"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
