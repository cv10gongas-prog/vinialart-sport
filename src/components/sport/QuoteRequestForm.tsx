import { nanoid } from "@/lib/customizer/nanoid";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Upload, FileText } from "lucide-react";
import { useCart } from "@/lib/cart/store";
import type { CartItem } from "@/lib/cart/types";
import { saveImageBlob } from "@/lib/customizer/storage/db";
export function QuoteRequestForm({
  productId,
  productName,
  item,
  example = "",
  mode = "ajuda",
}: {
  productId: string;
  productName: string;
  item?: CartItem | undefined;
  example?: string;
  mode?: "ajuda" | "servico";
}) {
  const cart = useCart();
  const old = item?.serviceDetails;
  const [name, setName] = useState(old?.userName ?? "");
  const [contact, setContact] = useState(old?.userContact ?? "");
  const [description, setDescription] = useState(old?.description ?? old?.notes ?? "");
  const [notes, setNotes] = useState(old?.description ? (old.notes ?? "") : "");
  const [article, setArticle] = useState(old?.itemOrServiceType ?? example ?? productName);
  const [quantity, setQuantity] = useState(item?.quantity ?? 1);
  const [file, setFile] = useState({
    name: old?.fileName ?? "",
    key: old?.fileKey ?? "",
    preview: item?.previewDataUrl ?? "",
    legacy: old?.fileDataUrl,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  async function attach(upload: File | undefined) {
    if (!upload) return;
    setBusy(true);
    setError("");
    try {
      if (upload.size > 20 * 1024 * 1024) throw new Error("O ficheiro deve ter até 20 MB.");
      const key = `reference_${nanoid()}`;
      await saveImageBlob(key, upload, upload.name);
      let preview = "";
      if (["image/png", "image/jpeg", "image/webp"].includes(upload.type)) {
        const url = URL.createObjectURL(upload);
        try {
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
            img.src = url;
          });
          const canvas = document.createElement("canvas");
          const factor = Math.min(1, 240 / Math.max(img.width, img.height));
          canvas.width = img.width * factor;
          canvas.height = img.height * factor;
          canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
          preview = canvas.toDataURL("image/png");
        } finally {
          URL.revokeObjectURL(url);
        }
      }
      setFile({ name: upload.name, key, preview, legacy: undefined });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível guardar o ficheiro.");
    } finally {
      setBusy(false);
    }
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const options = {
        mode,
        quantity,
        customizerDesign: undefined,
        previewDataUrl: file.preview,
        serviceDetails: {
          userName: name,
          userContact: contact,
          description,
          notes,
          itemOrServiceType: article || productName,
          quantity,
          fileName: file.name,
          fileKey: file.key,
          fileDataUrl: file.legacy,
        },
      };
      if (item) {
        cart.updateItem(item.id, options);
        setSaved(item.id);
      } else if (saved) {
        cart.updateItem(saved, options);
      } else setSaved(cart.addItem(productId, productName, options));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível guardar.");
    }
  }
  return (
    <form className="quote-request" onSubmit={submit}>
      <p className="label-eyebrow">{mode === "ajuda" ? "Ajuda VinilArt" : "Pedido sob consulta"}</p>
      <h2>{mode === "ajuda" ? "Conta-nos a tua ideia." : "O que precisas?"}</h2>
      <p className="text-muted-foreground">
        Envia-nos a tua ideia, imagem ou referência. A VinilArt trata do resto.
      </p>
      {mode === "servico" && (
        <label>
          Artigo / serviço
          <input required value={article} onChange={(e) => setArticle(e.target.value)} />
        </label>
      )}
      <div className="quote-fields">
        <label>
          Nome
          <input
            required
            minLength={2}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Email ou telefone
          <input
            required
            autoComplete="email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </label>
      </div>
      <label>
        Quantidade (opcional)
        <input
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.floor(+e.target.value) || 1))}
        />
      </label>
      <label className="surface-upload">
        <span>Imagem, logótipo ou referência</span>
        <span className="upload-action">
          <Upload size={17} />
          {file.name ? "Substituir referência" : "Carregar referência"}
        </span>
        <input
          aria-label="Carregar referência"
          type="file"
          accept="image/*,.pdf,.ai,.eps,.zip"
          disabled={busy}
          onChange={(e) => {
            void attach(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <small>Até 20 MB</small>
      </label>
      {file.name && (
        <div className="reference-file">
          {file.preview ? <img src={file.preview} alt="Referência carregada" /> : <FileText />}
          <span>{file.name}</span>
          <button
            type="button"
            onClick={() => setFile({ name: "", key: "", preview: "", legacy: undefined })}
          >
            Remover referência
          </button>
        </div>
      )}
      <label>
        Explica-nos o que pretendes
        <textarea
          required
          minLength={10}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label>
        Observações (opcional)
        <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>
      {error && (
        <p role="alert" className="order-error">
          {error}
        </p>
      )}
      <button className="order-primary" disabled={busy}>
        {busy
          ? "A guardar ficheiro…"
          : item || saved
            ? "Guardar alterações"
            : "Pedir personalização"}
      </button>
      {saved && (
        <p role="status" className="order-success">
          Adicionado ao pedido. <Link to="/carrinho">Ver resumo do pedido →</Link>
        </p>
      )}
    </form>
  );
}
