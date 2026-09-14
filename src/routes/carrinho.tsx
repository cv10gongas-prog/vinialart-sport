import { useState } from "react";
import { downloadOrder } from "@/lib/cart/export-order";
import { products as coreProducts } from "@/lib/sport-data";
import { supporterProducts } from "@/lib/supporter-products";
const products = [...coreProducts, ...supporterProducts];
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Edit3 } from "lucide-react";
import { PageHero, PageShell } from "@/components/sport/PageShell";
import { SportLink } from "@/components/sport/SportButton";
import { useCart } from "@/lib/cart/store";
import { shinGuardPairWhite } from "@/lib/customizer/mockups";

export const Route = createFileRoute("/carrinho")({
  component: Carrinho,
  head: () => ({
    meta: [
      { title: "Carrinho — VinilArt Sport" },
      {
        name: "description",
        content:
          "O teu carrinho VinilArt Sport. Revê os produtos selecionados e pede o teu orçamento personalizado.",
      },
      { property: "og:title", content: "Carrinho — VinilArt Sport" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/carrinho" }],
  }),
});

function Carrinho() {
  const { items, totalItems, removeItem, updateQty } = useCart();
  const [quote, setQuote] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  async function exportRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await downloadOrder(
        items,
        String(form.get("nome")),
        String(form.get("contacto")),
        String(form.get("notas")),
      );
      setReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível preparar o pedido.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <PageShell className="commerce-cart">
      <PageHero
        eyebrow="Resumo do pedido"
        title={items.length ? "O teu pedido." : "O teu pedido ainda está vazio."}
        text={
          items.length
            ? "Revê os produtos, os designs e as quantidades antes de pedir orçamento."
            : "Escolhe um produto na loja para começar."
        }
      />
      <section className="product-container cart-layout">
        {!items.length ? (
          <SportLink to="/loja" size="lg">
            Ver loja
          </SportLink>
        ) : (
          <>
            <div>
              {items.map((item) => {
                const product = products.find((p) => p.slug === item.productId);
                const mode =
                  item.mode ??
                  (item.customizerDesign ? "design" : item.serviceDetails ? "ajuda" : "servico");
                const preview = item.previewDataUrl || product?.catalogImage;
                const edit =
                  item.productId === "artigos-adeptos" ? (
                    <Link to="/adeptos" search={{ artigo: undefined, cartItem: item.id }}>
                      Editar pedido
                    </Link>
                  ) : (
                    <Link
                      to="/produto/$slug"
                      params={{ slug: item.productId }}
                      search={{ cartItem: item.id, modo: undefined }}
                    >
                      Editar pedido
                    </Link>
                  );
                return (
                  <article key={item.id} className="cart-product">
                    <div className="cart-image">
                      {preview ? (
                        <img src={preview} alt={`Preview de ${item.productName}`} />
                      ) : (
                        <ShoppingBag />
                      )}
                    </div>
                    <div className="cart-product-info">
                      <h2>{item.productName}</h2>
                      <p className="cart-mode">
                        {mode === "design"
                          ? "Design carregado"
                          : mode === "ajuda"
                            ? "Ajuda VinilArt"
                            : "Pedido sob consulta"}
                      </p>
                      {item.variant && <p>Tamanho: {item.variant}</p>}
                      {item.serviceDetails && (
                        <>
                          {item.serviceDetails.itemOrServiceType &&
                            item.serviceDetails.itemOrServiceType !== item.productName && (
                              <p>{item.serviceDetails.itemOrServiceType}</p>
                            )}
                          {item.serviceDetails.requestedText && (
                            <p className="text-xs text-zinc-300">
                              <span className="text-zinc-500 font-mono uppercase text-[0.68rem] block">Texto a incluir:</span>
                              {item.serviceDetails.requestedText}
                            </p>
                          )}
                          {(item.serviceDetails.designNotes || item.serviceDetails.description || item.serviceDetails.notes) && (
                            <p className="cart-brief text-xs text-zinc-300">
                              <span className="text-zinc-500 font-mono uppercase text-[0.68rem] block">
                                {mode === "design" ? "Nota:" : "Ideia / Notas:"}
                              </span>
                              {item.serviceDetails.designNotes || item.serviceDetails.description || item.serviceDetails.notes}
                            </p>
                          )}
                          {(item.serviceDetails.contact || item.serviceDetails.userContact) && (
                            <p className="text-xs text-zinc-400">
                              <span className="text-zinc-500 font-mono uppercase text-[0.68rem] block">Contacto:</span>
                              {item.serviceDetails.contact || item.serviceDetails.userContact}
                            </p>
                          )}
                          {item.serviceDetails.attachments && item.serviceDetails.attachments.length > 0 ? (
                            <div className="mt-2 space-y-1">
                              <span className="text-[0.68rem] font-mono uppercase tracking-wider text-cyan-400">
                                Anexos ({item.serviceDetails.attachments.length}):
                              </span>
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {item.serviceDetails.attachments.map((att) => (
                                  <span
                                    key={att.id || att.fileKey}
                                    className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[0.7rem] text-zinc-300"
                                  >
                                    {att.mimeType === "application/pdf" ? "📄" : "🖼️"} {att.fileName}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : item.serviceDetails.fileName ? (
                            <p className="cart-filename">
                              Referência: {item.serviceDetails.fileName}
                            </p>
                          ) : null}
                        </>
                      )}
                      <p>Sob consulta</p>
                      <div className="cart-actions">
                        {edit}
                        <button
                          onClick={() => {
                            try {
                              removeItem(item.id);
                            } catch (e) {
                              setError(String(e));
                            }
                          }}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                    <label className="cart-quantity">
                      Quantidade
                      <input
                        aria-label={`Quantidade de ${item.productName}`}
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => {
                          try {
                            updateQty(item.id, Math.max(1, Math.floor(+e.target.value) || 1));
                          } catch (err) {
                            setError(String(err));
                          }
                        }}
                      />
                    </label>
                  </article>
                );
              })}
            </div>
            <aside className="cart-summary">
              <h2>Resumo</h2>
              <p>{totalItems} unidade(s)</p>
              <p>Sob consulta</p>
              <p className="text-muted-foreground">
                A VinilArt analisa os artigos, ficheiros e quantidades para preparar o orçamento.
              </p>
              <Link
                to="/checkout"
                className="order-primary inline-flex items-center justify-center text-center font-bold no-underline py-3 px-6 rounded-lg shadow transition hover:opacity-90"
              >
                Avançar para o Checkout
              </Link>
              <button
                type="button"
                className="w-full text-xs text-muted-foreground hover:text-foreground underline pt-2 pb-1"
                onClick={() => setQuote(!quote)}
              >
                {quote ? "Ocultar exportação manual" : "Prefiro apenas descarregar resumo / pedir orçamento"}
              </button>
              <SportLink to="/loja" variant="outline" className="w-full">
                Continuar na loja
              </SportLink>
              {quote && (
                <form onSubmit={exportRequest} className="quote-request mt-6">
                  <h3>Preparar orçamento</h3>
                  <label>
                    Nome
                    <input name="nome" required autoComplete="name" />
                  </label>
                  <label>
                    Email ou telefone
                    <input name="contacto" required />
                  </label>
                  <label>
                    Observações
                    <textarea name="notas" rows={3} />
                  </label>
                  <p>
                    Descarrega o pedido com os previews e ficheiros originais para o enviares à
                    VinilArt pelo teu canal habitual. O envio não é automático.
                  </p>
                  <button className="order-primary" disabled={busy}>
                    {busy ? "A preparar…" : "Descarregar pedido completo"}
                  </button>
                  {ready && (
                    <p role="status" className="order-success">
                      Pedido descarregado. Envia o ficheiro à VinilArt para receberes o orçamento.
                    </p>
                  )}
                </form>
              )}
            </aside>
          </>
        )}
        {error && (
          <p role="alert" className="order-error">
            {error}
          </p>
        )}
      </section>
    </PageShell>
  );
}
