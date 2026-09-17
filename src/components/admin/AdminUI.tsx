/**
 * VinilArt Sport — Componentes da área administrativa.
 * Identidade VinilArt Sport: fundo escuro, cyan/magenta/amarelo, tipografia atual.
 */

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

export function AdminPage({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-cyan-400">
            {eyebrow}
          </span>
          <h1 className="mt-2 font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </header>
      {children}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#0d1218] p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const styles: Record<string, string> = {
    primary: "bg-cyan-400 text-black hover:bg-cyan-300",
    outline: "border border-white/15 text-zinc-200 hover:border-white/35 hover:text-white",
    ghost: "text-zinc-400 hover:text-white",
    danger: "border border-fuchsia-500/40 text-fuchsia-300 hover:bg-fuchsia-500/10",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 font-mono text-[0.62rem] font-bold uppercase tracking-[0.13em] transition disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

const fieldClass =
  "mt-2 min-h-11 w-full rounded-xl border border-white/12 bg-[#080c11] px-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan-400/60";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-zinc-400">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-zinc-500">{hint}</span>}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={fieldClass}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={`${fieldClass} py-3 leading-6`}
    />
  );
}

export function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={fieldClass}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#080c11] px-3 py-2.5 text-left transition hover:border-white/25"
    >
      <span className="text-sm text-zinc-200">{label}</span>
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition ${
          checked ? "bg-cyan-400" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-black transition-all ${
            checked ? "left-[1.15rem]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export function OrderButtons({
  onUp,
  onDown,
}: {
  onUp: () => void;
  onDown: () => void;
}) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        aria-label="Mover para cima"
        onClick={onUp}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-zinc-300 transition hover:border-cyan-400/50 hover:text-white"
      >
        <ArrowUp size={14} />
      </button>
      <button
        type="button"
        aria-label="Mover para baixo"
        onClick={onDown}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-zinc-300 transition hover:border-cyan-400/50 hover:text-white"
      >
        <ArrowDown size={14} />
      </button>
    </div>
  );
}

export function StatusChip({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "off";
  children: ReactNode;
}) {
  const tones: Record<string, string> = {
    ok: "border-cyan-400/40 text-cyan-300",
    warn: "border-yellow-300/40 text-yellow-200",
    off: "border-white/15 text-zinc-400",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.55rem] font-bold uppercase tracking-[0.12em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function MediaField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <Field label={label} hint={hint ?? "Caminho da imagem (ex.: /catalog/imagem.jpg)"}>
        <TextInput value={value} onChange={onChange} placeholder="/catalog/imagem.jpg" />
      </Field>
      {value && (
        <div className="mt-3 flex items-center gap-3">
          <div className="h-16 w-16 overflow-hidden rounded-xl border border-white/10 bg-[#080c11]">
            <img src={value} alt="" className="h-full w-full object-contain" />
          </div>
          <Btn variant="ghost" onClick={() => onChange("")}>
            Remover imagem
          </Btn>
        </div>
      )}
    </div>
  );
}
