import { Link } from "@tanstack/react-router";
import { MessageSquare, Users, ArrowRight } from "lucide-react";

export function TeamClubBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-cyan-950/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
      {/* Ambient background lighting */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="max-w-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users size={14} />
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-400">
              Clubes & Equipas
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl uppercase tracking-wider text-white">
            Pedido para toda a equipa
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Equipamentos, caneleiras e merchandising para o teu clube, claque ou grupo de atletas.
            Condições especiais e maquetes personalizadas para quantidades.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="https://wa.me/351912066804?text=Ol%C3%A1%2C%20gostaria%20de%20pedir%20uma%20proposta%20para%20a%20minha%20equipa%20%2F%20clube."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-cyan-300 hover:shadow-[0_0_24px_rgba(0,200,255,0.4)]"
          >
            <MessageSquare size={16} />
            <span>Falar no WhatsApp</span>
          </a>

          <Link
            to="/contactos"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-200 transition-all hover:border-white/20 hover:bg-white/10"
          >
            <span>Pedir Proposta de Clube</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
