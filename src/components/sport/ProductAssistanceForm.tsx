import { useState, useRef } from "react";
import { Upload, CheckCircle, FileText, ArrowRight, Trash2 } from "lucide-react";
import { SportButton } from "./SportButton";
import { useCart } from "@/lib/cart/store";
import type { ServiceQuoteDetails } from "@/lib/cart/types";
import { cn } from "@/lib/utils";

interface ProductAssistanceFormProps {
  productId: string;
  productName: string;
  className?: string | undefined;
}

export function ProductAssistanceForm({
  productId,
  productName,
  className,
}: ProductAssistanceFormProps) {
  const { addItem } = useCart();

  const [userName, setUserName] = useState("");
  const [userContact, setUserContact] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
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

    const fullNotes = [
      userName ? `Nome: ${userName}` : null,
      userContact ? `Contacto: ${userContact}` : null,
      `Ideia / Instruções: ${description}`,
      notes.trim() ? `Observações: ${notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const details: ServiceQuoteDetails = {
      itemOrServiceType: `Ajuda de Design — ${productName}`,
      quantity: validQty,
      notes: fullNotes,
      fileName,
      fileDataUrl,
    };

    addItem(productId, `${productName} (Com Apoio VinilArt)`, {
      quantity: validQty,
      previewDataUrl: fileDataUrl,
      serviceDetails: details,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 3500);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "card-sport hover:!translate-y-0 border border-border bg-surface p-6 sm:p-8",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-magenta px-2.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-white">
              Apoio de Personalização
            </span>
            <span className="font-mono text-[0.6rem] text-cyan uppercase tracking-wider">
              {productName}
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl text-foreground sm:text-2xl">
            Envia a tua ideia. A VinilArt trata do resto.
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Envia-nos a tua ideia, imagem ou referência. A VinilArt trata do resto.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5">
        {/* Identificação */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="assistName"
              className="block font-mono text-xs uppercase tracking-wider text-muted-foreground"
            >
              Nome *
            </label>
            <input
              id="assistName"
              type="text"
              required
              placeholder="Ex.: João Silva"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-2 h-11 w-full border border-input bg-background px-3 text-sm text-foreground focus:border-cyan focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="assistContact"
              className="block font-mono text-xs uppercase tracking-wider text-muted-foreground"
            >
              Contacto (Email ou Telefone) *
            </label>
            <input
              id="assistContact"
              type="text"
              required
              placeholder="Ex.: joao@email.com ou 912 345 678"
              value={userContact}
              onChange={(e) => setUserContact(e.target.value)}
              className="mt-2 h-11 w-full border border-input bg-background px-3 text-sm text-foreground focus:border-cyan focus:outline-none"
            />
          </div>
        </div>

        {/* Quantidade */}
        <div>
          <label
            htmlFor="assistQty"
            className="block font-mono text-xs uppercase tracking-wider text-muted-foreground"
          >
            Quantidade opcional
          </label>
          <input
            id="assistQty"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-2 h-11 w-full max-w-xs border border-input bg-background px-3 text-sm text-foreground focus:border-cyan focus:outline-none"
          />
        </div>

        {/* Explica o que pretendes */}
        <div>
          <label
            htmlFor="assistDesc"
            className="block font-mono text-xs uppercase tracking-wider text-muted-foreground"
          >
            Explica-nos o que pretendes *
          </label>
          <textarea
            id="assistDesc"
            required
            rows={4}
            placeholder="Descreve as cores, nomes, números, logótipos ou estilo visual pretendido..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-cyan focus:outline-none"
          />
        </div>

        {/* Upload */}
        <div>
          <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Upload de imagem / logótipo / referência (opcional)
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
                Carregar imagem, logótipo ou foto de referência
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
                    alt="Referência carregada"
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
                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
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
            htmlFor="assistNotes"
            className="block font-mono text-xs uppercase tracking-wider text-muted-foreground"
          >
            Observações (opcional)
          </label>
          <textarea
            id="assistNotes"
            rows={2}
            placeholder="Informação adicional útil..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2 w-full border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-cyan focus:outline-none"
          />
        </div>

        {/* Botão */}
        <div className="mt-3">
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
                Pedido registado no resumo!
              </>
            ) : (
              <>
                Pedir Personalização
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </SportButton>
          <p className="mt-2 text-center font-mono text-[0.6rem] text-muted-foreground">
            A equipa da VinilArt entrará em contacto para apresentar a proposta antes da produção.
          </p>
        </div>
      </div>
    </form>
  );
}
