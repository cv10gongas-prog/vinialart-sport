import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  Plus,
  Loader2,
} from "lucide-react";
import { nanoid } from "@/lib/customizer/nanoid";
import { saveImageBlob } from "@/lib/customizer/storage/db";
import type { AttachmentItem } from "@/lib/cart/types";

interface VinilartHelpPanelProps {
  requestedText: string;
  onRequestedTextChange: (val: string) => void;
  designNotes: string;
  onDesignNotesChange: (val: string) => void;
  contact: string;
  onContactChange: (val: string) => void;
  contactError?: string;
  attachments: AttachmentItem[];
  onAttachmentsChange: (items: AttachmentItem[]) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Creates a lightweight base64 thumbnail for fast rendering
 */
async function createThumbnail(file: File): Promise<string | undefined> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    return undefined;
  }

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const maxDim = 200;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        } else {
          resolve(undefined);
        }
      } catch {
        resolve(undefined);
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(undefined);
    };

    img.src = url;
  });
}

export function VinilartHelpPanel({
  requestedText,
  onRequestedTextChange,
  designNotes,
  onDesignNotesChange,
  contact,
  onContactChange,
  contactError,
  attachments,
  onAttachmentsChange,
}: VinilartHelpPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (!files.length) return;

    setIsUploading(true);
    setUploadError("");

    const newAttachments: AttachmentItem[] = [];

    for (const file of files) {
      // Validate file size (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        setUploadError(`"${file.name}" excede o limite máximo de 25 MB.`);
        continue;
      }

      // Check supported types
      const isImage = ["image/png", "image/jpeg", "image/webp"].includes(file.type);
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

      if (!isImage && !isPdf) {
        setUploadError(`Formato não suportado para "${file.name}". Usa PNG, JPG, WEBP ou PDF.`);
        continue;
      }

      try {
        const fileKey = `help_ref_${nanoid()}`;
        // Persist file into IndexedDB for export-order and preview survival
        await saveImageBlob(fileKey, file, file.name);

        const previewUrl = await createThumbnail(file);

        newAttachments.push({
          id: nanoid(),
          fileKey,
          fileName: file.name,
          fileSize: file.size,
          mimeType: isPdf ? "application/pdf" : file.type,
          previewUrl,
        });
      } catch (err) {
        console.error("Failed to store attachment:", err);
        setUploadError(`Erro ao guardar "${file.name}". Tenta novamente.`);
      }
    }

    if (newAttachments.length > 0) {
      onAttachmentsChange([...attachments, ...newAttachments]);
    }

    setIsUploading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.files) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    onAttachmentsChange(attachments.filter((item) => item.id !== id));
  };

  return (
    <div className="mt-4 space-y-4 rounded-xl border border-white/10 bg-zinc-950/70 p-4 sm:p-5 backdrop-blur-md">
      {/* HUD Header */}
      <div className="space-y-1 border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-cyan-400 shrink-0" />
          <h3 className="font-display text-sm sm:text-base uppercase tracking-wider text-white">
            Envia-nos a tua ideia
          </h3>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Envia referências, logos, fotografias ou indicações e a nossa equipa prepara a proposta gráfica.
        </p>
      </div>

      {/* 1. UPLOAD DE FICHEIROS / REFERÊNCIAS */}
      <div className="space-y-3">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-cyan-400 bg-cyan-500/[0.12] shadow-[0_0_20px_rgba(0,229,255,0.2)] scale-[1.01]"
              : "border-white/15 bg-white/[0.02] hover:border-cyan-400/60 hover:bg-cyan-500/[0.04]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                void processFiles(e.target.files);
              }
              e.target.value = "";
            }}
          />

          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-400 transition-transform group-hover:scale-110">
            {isUploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Upload size={20} />
            )}
          </div>

          <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
            Enviar imagens, logos ou referências
          </span>

          <span className="mt-1 text-[0.7rem] font-mono text-zinc-400">
            PNG, JPG, WEBP ou PDF · até 25 MB
          </span>

          <span className="mt-1.5 inline-block rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[0.65rem] font-mono uppercase tracking-wider text-zinc-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors">
            Clica ou arrasta múltiplos ficheiros
          </span>
        </div>

        {uploadError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            <AlertCircle size={14} className="shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Attachments List / Grid */}
        {attachments.length > 0 && (
          <div className="space-y-2 rounded-xl border border-white/10 bg-black/40 p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-cyan-400 font-semibold">
                <span>✓</span>
                <span>
                  {attachments.length === 1
                    ? "1 ficheiro adicionado"
                    : `${attachments.length} ficheiros adicionados`}
                </span>
              </span>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-[0.68rem] font-mono uppercase tracking-wider text-zinc-400 hover:text-cyan-300 transition-colors"
              >
                <Plus size={12} />
                Adicionar mais
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-2 transition-colors hover:border-white/15"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {att.previewUrl ? (
                      <img
                        src={att.previewUrl}
                        alt={att.fileName}
                        className="h-9 w-9 rounded-md object-cover border border-white/10 bg-zinc-900 shrink-0"
                      />
                    ) : att.mimeType === "application/pdf" ? (
                      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-red-500/30 bg-red-500/15 text-red-400 shrink-0">
                        <FileText size={18} />
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-cyan-500/30 bg-cyan-500/15 text-cyan-400 shrink-0">
                        <ImageIcon size={18} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p
                        className="truncate text-xs font-medium text-zinc-200"
                        title={att.fileName}
                      >
                        {att.fileName}
                      </p>
                      <p className="font-mono text-[0.65rem] text-zinc-500">
                        {formatFileSize(att.fileSize)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(att.id)}
                    aria-label={`Remover ${att.fileName}`}
                    className="rounded-md p-1.5 text-zinc-500 hover:bg-red-500/20 hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. DADOS DO PEDIDO */}
      <div className="space-y-3 pt-1 border-t border-white/5">
        {/* Campo 1: Nome / número / texto a incluir */}
        <div className="space-y-1.5">
          <label className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-wider text-zinc-400">
            <span>Nome / número / texto a incluir</span>
            <span className="text-zinc-600 lowercase font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            value={requestedText}
            onChange={(e) => onRequestedTextChange(e.target.value)}
            placeholder="Ex.: TOMÁS 10, nome da equipa, frase, etc."
            className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 transition-colors focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        {/* Campo 2: Como imaginas o design? */}
        <div className="space-y-1.5">
          <label className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-wider text-zinc-400">
            <span>Como imaginas o design?</span>
            <span className="text-zinc-600 lowercase font-normal">(opcional)</span>
          </label>
          <textarea
            rows={3}
            value={designNotes}
            onChange={(e) => onDesignNotesChange(e.target.value)}
            placeholder="Explica cores, estilo, posição dos elementos ou qualquer ideia que tenhas."
            className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 leading-relaxed transition-colors focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-none"
          />
        </div>

        {/* Campo 3: WhatsApp ou e-mail (Obrigatório) */}
        <div className="space-y-1.5">
          <label className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-wider text-zinc-300 font-semibold">
            <span>
              WhatsApp ou e-mail <span className="text-cyan-400">*</span>
            </span>
            <span className="text-[0.65rem] text-cyan-400/80 uppercase font-mono">
              obrigatório
            </span>
          </label>
          <input
            type="text"
            value={contact}
            onChange={(e) => onContactChange(e.target.value)}
            placeholder="Para te contactarmos sobre o design"
            className={`w-full rounded-xl border bg-zinc-900/80 px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 transition-colors focus:outline-none focus:ring-1 ${
              contactError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
                : "border-white/10 focus:border-cyan-400 focus:ring-cyan-400"
            }`}
          />

          {contactError && (
            <p className="flex items-center gap-1.5 text-[0.72rem] text-red-400 font-medium pt-0.5">
              <AlertCircle size={13} className="shrink-0" />
              <span>{contactError}</span>
            </p>
          )}
        </div>
      </div>

      {/* Helper footnote */}
      <div className="rounded-lg bg-cyan-500/[0.04] border border-cyan-500/15 p-2.5 text-[0.7rem] text-zinc-400 flex items-start gap-2">
        <Sparkles size={14} className="text-cyan-400 mt-0.5 shrink-0" />
        <p className="leading-snug">
          Após adicionares ao pedido, a nossa equipa analisa as indicações e envia a proposta gráfica para validares antes de qualquer produção.
        </p>
      </div>
    </div>
  );
}
