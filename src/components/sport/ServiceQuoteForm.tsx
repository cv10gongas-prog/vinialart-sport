import { useState, useRef } from "react";
import { Upload, CheckCircle, FileText, ArrowRight, Trash2 } from "lucide-react";
import { SportButton } from "./SportButton";
import { useCart } from "@/lib/cart/store";
import type { ServiceQuoteDetails } from "@/lib/cart/types";
import { cn } from "@/lib/utils";

interface ServiceQuoteFormProps {
  productId: string;
  productName: string;
  defaultItemOrService?: string | undefined;
  serviceType: "estampagem" | "impressao" | "adeptos";
  className?: string | undefined;
}

export function ServiceQuoteForm({
  productId,
  productName,
  defaultItemOrService = "",
  serviceType,
  className,
}: ServiceQuoteFormProps) {
  const { addItem } = useCart();

  const [itemOrServiceType, setItemOrServiceType] = useState(defaultItemOrService);
  const [quantity, setQuantity] = useState("1");
  const [approxDimensions, setApproxDimensions] = useState("");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [fileDataUrl, setFileDataUrl] = useState<string | undefined>(undefined);
  const [added, setAdded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        setFileDataUrl(loadEvt.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFileDataUrl(undefined);
    }
  }

  function handleRemoveFile() {
    setFileName(undefined);
    setFileDataUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsedQty = parseInt(quantity, 10);
    const validQty = isNaN(parsedQty) || parsedQty < 1 ? 1 : parsedQty;

    const details: ServiceQuoteDetails = {
      itemOrServiceType:
        itemOrServiceType.trim() ||
        (serviceType === "estampagem"
          ? "Estampagem Geral"
          : serviceType === "impressao"
            ? "Impressão Gráfica"
            : "Artigo para Adeptos"),
      quantity: validQty,
      approxDimensions: approxDimensions.trim() || undefined,
      notes: notes.trim() || undefined,
      fileName,
      fileDataUrl,
    };

    addItem(productId, productName, {
      quantity: validQty,
      previewDataUrl: fileDataUrl,
      serviceDetails: details,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "card-sport hover:!translate-y-0 border border-border bg-surface p-6 sm:p-8",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
        <div>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-cyan">
            Pedido de Orçamento
          </span>
          <h3 className="font-display text-lg sm:text-xl text-foreground mt-0.5">
            O teu pedido de {productName.toLowerCase()}
          </h3>
        </div>

      </div>

      <div className="mt-6 grid gap-5">
        {/* Campo 1: Artigo / Tipo */}
        <div>
          <label
            htmlFor="itemOrServiceType"
            className="block font-mono text-xs uppercase tracking-wider text-muted-foreground"
          >
            {serviceType === "estampagem"
              ? "Peça / Artigo a personalizar *"
              : serviceType === "impressao"
                ? "Descrição do trabalho *"
                : "Artigo pretendido *"}
          </label>
          <input
            id="itemOrServiceType"
            type="text"
            required
            placeholder={
              serviceType === "estampagem"
                ? "Ex.: Nome do artigo a personalizar..."
                : serviceType === "impressao"
                  ? "Descrição do trabalho pretendido..."
                  : "Artigo pretendido..."
            }
            value={itemOrServiceType}
            onChange={(e) => setItemOrServiceType(e.target.value)}
            className="mt-2 h-11 w-full border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-cyan focus:outline-none"
          />
        </div>

        {/* Quantidade e Medidas (quando impressão) */}
        <div className={cn("grid gap-5", serviceType === "impressao" ? "sm:grid-cols-2" : "grid-cols-1")}>
          {/* Quantidade */}
          <div>
            <label
              htmlFor="serviceQuantity"
              className="block font-mono text-xs uppercase tracking-wider text-muted-foreground"
            >
              Quantidade (opcional)
            </label>
            <input
              id="serviceQuantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-2 h-11 w-full border border-input bg-background px-3 text-sm text-foreground focus:border-cyan focus:outline-none"
            />
          </div>

          {/* Medidas (opcional para impressão) */}
          {serviceType === "impressao" && (
            <div>
              <label
                htmlFor="approxDimensions"
                className="block font-mono text-xs uppercase tracking-wider text-muted-foreground"
              >
                Medidas aproximadas (opcional)
              </label>
              <input
                id="approxDimensions"
                type="text"
                placeholder="Ex.: 100 x 50 cm"
                value={approxDimensions}
                onChange={(e) => setApproxDimensions(e.target.value)}
                className="mt-2 h-11 w-full border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-cyan focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Upload de Design / Ficheiro */}
        <div>
          <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Ficheiro / Logótipo / Referência
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.ai,.eps,.svg,.zip"
            onChange={handleFileChange}
            className="sr-only"
          />

          {!fileName ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 flex w-full flex-col items-center justify-center gap-2 border border-dashed border-border bg-surface-2 px-4 py-6 text-center transition-colors hover:border-cyan"
            >
              <Upload className="h-5 w-5 text-cyan" />
              <span className="text-xs text-foreground font-medium">
                Carregar ficheiro ou design
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                PNG · JPG · PDF · SVG · EPS (máx. 20MB)
              </span>
            </button>
          ) : (
            <div className="mt-2 flex items-center justify-between border border-cyan/40 bg-cyan/5 p-3">
              <div className="flex items-center gap-3 min-w-0">
                {fileDataUrl ? (
                  <img
                    src={fileDataUrl}
                    alt="Ficheiro carregado"
                    className="h-10 w-10 shrink-0 border border-border object-cover"
                  />
                ) : (
                  <FileText className="h-8 w-8 shrink-0 text-cyan" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{fileName}</p>
                  <p className="font-mono text-[0.6rem] text-cyan uppercase tracking-wider">
                    Ficheiro anexado ao pedido
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 text-muted-foreground hover:text-destructive"
                title="Remover ficheiro"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Observações */}
        <div>
          <label
            htmlFor="notes"
            className="block font-mono text-xs uppercase tracking-wider text-muted-foreground"
          >
            Observações e detalhes do pedido
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Acrescenta informação útil sobre o pedido."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2 w-full border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-cyan focus:outline-none"
          />
        </div>

        {/* Botão de Adicionar */}
        <div className="mt-2">
          <SportButton
            type="submit"
            size="lg"
            variant="primary"
            className={cn(
              "w-full justify-center",
              added && "border-green-500 bg-green-500/10 text-green-400",
            )}
          >
            {added ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Pedido adicionado ao carrinho!
              </>
            ) : (
              <>
                Adicionar ao resumo do pedido
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </SportButton>
        </div>
      </div>
    </form>
  );
}
