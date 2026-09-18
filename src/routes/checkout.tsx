import { useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShoppingBag,
  ArrowLeft,
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Building2,
  Smartphone,
  ShieldCheck,
  Download,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { PageShell } from "@/components/sport/PageShell";
import { useCart } from "@/lib/cart/store";
import { catalogProducts as allProducts } from "@/lib/content/catalog-source";
import { PAYMENT_CONFIG, type PaymentMethodId } from "@/lib/checkout/payment-config";
import type {
  CustomerDetails,
  OrderRecord,
  PaymentProofFile,
} from "@/lib/checkout/types";
import { ORDER_STATUS_LABELS } from "@/lib/checkout/types";
import { saveOrderToStore, generateOrderId } from "@/lib/checkout/order-store";
import { saveImageBlob } from "@/lib/customizer/storage/db";
import { downloadFullOrder } from "@/lib/cart/export-order";
import { nanoid } from "@/lib/customizer/nanoid";


export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Checkout · Finalizar Pedido — VinilArt Sport" },
      {
        name: "description",
        content: "Finaliza o teu pedido com pagamento manual por MB WAY, transferência bancária, Revolut ou PayPal.",
      },
    ],
  }),
});

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function CheckoutPage() {
  const { items, totalItems, clear } = useCart();

  // Customer form state
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    taxId: "",
  });

  type CustomerFieldKey = keyof CustomerDetails;
  const [touched, setTouched] = useState<Partial<Record<CustomerFieldKey, boolean>>>({});
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<CustomerFieldKey, string>>>({});

  // Payment state
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>("mbway");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Proof file state
  const [proofFile, setProofFile] = useState<PaymentProofFile | null>(null);
  const [proofError, setProofError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Privacy state
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyError, setPrivacyError] = useState("");

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<OrderRecord | null>(null);

  // Copy helper
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Validation
  const validate = () => {
    const errors: Partial<Record<CustomerFieldKey, string>> = {};

    if (!customer.fullName.trim()) {
      errors.fullName = "Indica o teu nome completo.";
    }

    if (!customer.email.trim()) {
      errors.email = "Indica o teu email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      errors.email = "Indica um email válido.";
    }

    if (!customer.phone.trim()) {
      errors.phone = "Indica o teu número de telemóvel.";
    }

    if (!customer.address.trim()) {
      errors.address = "Indica a tua morada.";
    }

    if (!customer.postalCode.trim()) {
      errors.postalCode = "Indica o código postal.";
    }

    if (!customer.city.trim()) {
      errors.city = "Indica a localidade.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Proof file upload handling
  const handleProofUpload = async (file: File | undefined) => {
    if (!file) return;
    setProofError("");
    setUploadingProof(true);

    const validTypes = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isImage = ["image/png", "image/jpeg", "image/webp"].includes(file.type);

    if (!isPdf && !isImage) {
      setProofError("Formato não suportado. Envia JPG, PNG, WEBP ou PDF.");
      setUploadingProof(false);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setProofError("O comprovativo deve ter até 25 MB.");
      setUploadingProof(false);
      return;
    }

    try {
      const fileKey = `proof_${nanoid()}`;
      await saveImageBlob(fileKey, file, file.name);

      let previewUrl: string | undefined = undefined;
      if (isImage) {
        previewUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.readAsDataURL(file);
        });
      }

      setProofFile({
        fileKey,
        fileName: file.name,
        fileSize: file.size,
        mimeType: isPdf ? "application/pdf" : file.type,
        previewUrl,
        uploadedAt: Date.now(),
      });
    } catch (err) {
      console.error(err);
      setProofError("Não foi possível guardar o comprovativo. Tenta novamente.");
    } finally {
      setUploadingProof(false);
    }
  };

  // Form submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      address: true,
      postalCode: true,
      city: true,
    });

    const isCustomerValid = validate();

    if (!proofFile) {
      setProofError("Anexa o comprovativo de pagamento para concluir o pedido.");
    }

    if (!privacyAccepted) {
      setPrivacyError("Precisas de aceitar a Política de Privacidade para concluir o pedido.");
    } else {
      setPrivacyError("");
    }

    if (!isCustomerValid || !proofFile || !privacyAccepted) {
      return;
    }

    setSubmitting(true);

    try {
      const orderId = generateOrderId();
      const currentConfig = PAYMENT_CONFIG[selectedMethod];

      const newOrder: OrderRecord = {
        orderId,
        createdAt: Date.now(),
        customer: {
          fullName: customer.fullName.trim(),
          email: customer.email.trim(),
          phone: customer.phone.trim(),
          address: customer.address.trim(),
          postalCode: customer.postalCode.trim(),
          city: customer.city.trim(),
          taxId: customer.taxId?.trim() || undefined,
        },
        items: [...items],
        totalItems,
        payment: {
          method: selectedMethod,
          methodName: currentConfig.name,
          proofFile,
          status: "pending-payment-verification",
          submittedAt: Date.now(),
        },
        status: "pending-payment-verification",
        privacyAccepted: true,
      };

      // Save order in store
      saveOrderToStore(newOrder);

      // Clear the cart
      clear();

      setSubmittedOrder(newOrder);
    } catch (err) {
      console.error(err);
      alert("Erro ao registar o pedido. Tenta novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // If order was successfully submitted, show the confirmation screen
  if (submittedOrder) {
    return (
      <PageShell className="bg-[#0B0E14] text-foreground min-h-screen">
        <div className="mx-auto max-w-4xl px-4 sm:px-8 py-10 sm:py-16">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 sm:p-10 backdrop-blur-md space-y-8 shadow-2xl">
            {/* Header / Success Badge */}
            <div className="text-center space-y-3 border-b border-white/10 pb-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 text-cyan-400 shadow-[0_0_24px_rgba(0,229,255,0.3)]">
                <CheckCircle2 size={36} />
              </div>

              <span className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-amber-300">
                {ORDER_STATUS_LABELS[submittedOrder.status]}
              </span>

              <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-white">
                Pedido enviado com sucesso
              </h1>

              <p className="text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
                O pagamento ficará sujeito a confirmação pela VinilArt. Entraremos em contacto contigo através dos dados indicados.
              </p>

              <p className="font-mono text-xs text-cyan-400 tracking-wider">
                Referência: <span className="font-bold text-white">{submittedOrder.orderId}</span>
              </p>
            </div>

            {/* Order info summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-zinc-300">
              <div className="space-y-2 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <span className="font-mono text-[0.68rem] uppercase tracking-wider text-cyan-400 font-semibold block">
                  Dados de Envio & Cliente
                </span>
                <p><strong className="text-white">Nome:</strong> {submittedOrder.customer.fullName}</p>
                <p><strong className="text-white">Email:</strong> {submittedOrder.customer.email}</p>
                <p><strong className="text-white">Telemóvel:</strong> {submittedOrder.customer.phone}</p>
                <p><strong className="text-white">Morada:</strong> {submittedOrder.customer.address}, {submittedOrder.customer.postalCode} {submittedOrder.customer.city}</p>
                {submittedOrder.customer.taxId && (
                  <p><strong className="text-white">NIF:</strong> {submittedOrder.customer.taxId}</p>
                )}
              </div>

              <div className="space-y-2 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <span className="font-mono text-[0.68rem] uppercase tracking-wider text-cyan-400 font-semibold block">
                  Pagamento & Comprovativo
                </span>
                <p><strong className="text-white">Método:</strong> {submittedOrder.payment.methodName}</p>
                <p><strong className="text-white">Comprovativo:</strong> {submittedOrder.payment.proofFile.fileName}</p>
                <p><strong className="text-white">Artigos:</strong> {submittedOrder.totalItems} unidade(s)</p>
                <p><strong className="text-white">Data:</strong> {new Date(submittedOrder.createdAt).toLocaleString("pt-PT")}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => void downloadFullOrder(submittedOrder)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.25)]"
              >
                <Download size={16} />
                Descarregar Pedido Completo
              </button>

              <Link
                to="/loja"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:border-white/30 hover:bg-white/10"
              >
                Voltar à Loja
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <PageShell className="bg-[#0B0E14] text-foreground min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-zinc-400">
            <ShoppingBag size={28} />
          </div>
          <h1 className="font-display text-2xl uppercase tracking-wider text-white">
            O teu carrinho está vazio
          </h1>
          <p className="text-sm text-zinc-400">
            Adiciona artigos ao carrinho na loja antes de acederes ao checkout.
          </p>
          <Link
            to="/loja"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-black hover:bg-cyan-300"
          >
            Ver Loja
          </Link>
        </div>
      </PageShell>
    );
  }

  const currentMethodConfig = PAYMENT_CONFIG[selectedMethod];

  return (
    <PageShell className="bg-[#0B0E14] text-foreground min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center gap-2 text-xs text-zinc-500 font-mono uppercase tracking-wider"
          aria-label="Percurso"
        >
          <Link to="/carrinho" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <ArrowLeft size={12} />
            <span>Carrinho</span>
          </Link>
          <ChevronRight size={12} className="text-zinc-600" />
          <span className="text-white font-semibold">Checkout</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-white/10 pb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
            Finalizar Compra
          </span>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl uppercase tracking-wider text-white">
            Checkout · Pagamento Manual
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Preenche os teus dados, efetua o pagamento pelo método pretendido e anexa o comprovativo.
          </p>
        </div>

        {/* Main 2-column layout (Desktop) / 1-column (Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start w-full">
          {/* LEFT COLUMN: Customer Form + Payment Method + Proof Upload (7 cols) */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6 w-full">
            {/* 1. DADOS DO CLIENTE */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 sm:p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[0.65rem] font-bold text-cyan-400">
                    1
                  </span>
                  <h2 className="font-display text-sm uppercase tracking-wider text-white">
                    Dados do Cliente
                  </h2>
                </div>
                <span className="text-[0.65rem] font-mono uppercase tracking-wider text-zinc-500">
                  * Obrigatório
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome completo */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-mono text-xs sm:text-[0.68rem] uppercase tracking-wider text-zinc-300">
                    Nome completo <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={customer.fullName}
                    onChange={(e) => {
                      setCustomer({ ...customer, fullName: e.target.value });
                      if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: "" });
                    }}
                    onBlur={() => setTouched({ ...touched, fullName: true })}
                    placeholder="Ex.: Tomás Silva"
                    className={`w-full rounded-xl border bg-zinc-900/80 px-4 py-3 sm:py-2.5 text-base sm:text-xs text-white placeholder:text-zinc-600 transition-colors focus:outline-none focus:ring-1 ${
                      touched.fullName && fieldErrors.fullName
                        ? "border-red-500 focus:ring-red-500/40"
                        : "border-white/10 focus:border-cyan-400 focus:ring-cyan-400"
                    }`}
                  />
                  {touched.fullName && fieldErrors.fullName && (
                    <p className="text-xs sm:text-[0.68rem] text-red-400 flex items-center gap-1 pt-0.5">
                      <AlertCircle size={12} /> {fieldErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs sm:text-[0.68rem] uppercase tracking-wider text-zinc-300">
                    Email <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => {
                      setCustomer({ ...customer, email: e.target.value });
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                    }}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    placeholder="exemplo@email.com"
                    className={`w-full rounded-xl border bg-zinc-900/80 px-4 py-3 sm:py-2.5 text-base sm:text-xs text-white placeholder:text-zinc-600 transition-colors focus:outline-none focus:ring-1 ${
                      touched.email && fieldErrors.email
                        ? "border-red-500 focus:ring-red-500/40"
                        : "border-white/10 focus:border-cyan-400 focus:ring-cyan-400"
                    }`}
                  />
                  {touched.email && fieldErrors.email && (
                    <p className="text-xs sm:text-[0.68rem] text-red-400 flex items-center gap-1 pt-0.5">
                      <AlertCircle size={12} /> {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Telemóvel */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs sm:text-[0.68rem] uppercase tracking-wider text-zinc-300">
                    Telemóvel <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => {
                      setCustomer({ ...customer, phone: e.target.value });
                      if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: "" });
                    }}
                    onBlur={() => setTouched({ ...touched, phone: true })}
                    placeholder="912 345 678"
                    className={`w-full rounded-xl border bg-zinc-900/80 px-4 py-3 sm:py-2.5 text-base sm:text-xs text-white placeholder:text-zinc-600 transition-colors focus:outline-none focus:ring-1 ${
                      touched.phone && fieldErrors.phone
                        ? "border-red-500 focus:ring-red-500/40"
                        : "border-white/10 focus:border-cyan-400 focus:ring-cyan-400"
                    }`}
                  />
                  {touched.phone && fieldErrors.phone && (
                    <p className="text-xs sm:text-[0.68rem] text-red-400 flex items-center gap-1 pt-0.5">
                      <AlertCircle size={12} /> {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* Morada */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-mono text-xs sm:text-[0.68rem] uppercase tracking-wider text-zinc-300">
                    Morada <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={customer.address}
                    onChange={(e) => {
                      setCustomer({ ...customer, address: e.target.value });
                      if (fieldErrors.address) setFieldErrors({ ...fieldErrors, address: "" });
                    }}
                    onBlur={() => setTouched({ ...touched, address: true })}
                    placeholder="Rua, número, andar / fração"
                    className={`w-full rounded-xl border bg-zinc-900/80 px-4 py-3 sm:py-2.5 text-base sm:text-xs text-white placeholder:text-zinc-600 transition-colors focus:outline-none focus:ring-1 ${
                      touched.address && fieldErrors.address
                        ? "border-red-500 focus:ring-red-500/40"
                        : "border-white/10 focus:border-cyan-400 focus:ring-cyan-400"
                    }`}
                  />
                  {touched.address && fieldErrors.address && (
                    <p className="text-xs sm:text-[0.68rem] text-red-400 flex items-center gap-1 pt-0.5">
                      <AlertCircle size={12} /> {fieldErrors.address}
                    </p>
                  )}
                </div>

                {/* Código Postal */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs sm:text-[0.68rem] uppercase tracking-wider text-zinc-300">
                    Código Postal <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={customer.postalCode}
                    onChange={(e) => {
                      setCustomer({ ...customer, postalCode: e.target.value });
                      if (fieldErrors.postalCode) setFieldErrors({ ...fieldErrors, postalCode: "" });
                    }}
                    onBlur={() => setTouched({ ...touched, postalCode: true })}
                    placeholder="4700-000"
                    className={`w-full rounded-xl border bg-zinc-900/80 px-4 py-3 sm:py-2.5 text-base sm:text-xs text-white placeholder:text-zinc-600 transition-colors focus:outline-none focus:ring-1 ${
                      touched.postalCode && fieldErrors.postalCode
                        ? "border-red-500 focus:ring-red-500/40"
                        : "border-white/10 focus:border-cyan-400 focus:ring-cyan-400"
                    }`}
                  />
                  {touched.postalCode && fieldErrors.postalCode && (
                    <p className="text-xs sm:text-[0.68rem] text-red-400 flex items-center gap-1 pt-0.5">
                      <AlertCircle size={12} /> {fieldErrors.postalCode}
                    </p>
                  )}
                </div>

                {/* Localidade */}
                <div className="space-y-1.5">
                  <label className="font-mono text-xs sm:text-[0.68rem] uppercase tracking-wider text-zinc-300">
                    Localidade <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={customer.city}
                    onChange={(e) => {
                      setCustomer({ ...customer, city: e.target.value });
                      if (fieldErrors.city) setFieldErrors({ ...fieldErrors, city: "" });
                    }}
                    onBlur={() => setTouched({ ...touched, city: true })}
                    placeholder="Braga, Porto, Lisboa..."
                    className={`w-full rounded-xl border bg-zinc-900/80 px-4 py-3 sm:py-2.5 text-base sm:text-xs text-white placeholder:text-zinc-600 transition-colors focus:outline-none focus:ring-1 ${
                      touched.city && fieldErrors.city
                        ? "border-red-500 focus:ring-red-500/40"
                        : "border-white/10 focus:border-cyan-400 focus:ring-cyan-400"
                    }`}
                  />
                  {touched.city && fieldErrors.city && (
                    <p className="text-xs sm:text-[0.68rem] text-red-400 flex items-center gap-1 pt-0.5">
                      <AlertCircle size={12} /> {fieldErrors.city}
                    </p>
                  )}
                </div>

                {/* NIF (Opcional) */}
                <div className="sm:col-span-2 space-y-1.5 pt-1">
                  <div className="flex items-center justify-between font-mono text-xs sm:text-[0.68rem] uppercase tracking-wider text-zinc-400">
                    <span>NIF</span>
                    <span className="text-zinc-500 lowercase font-normal">(opcional)</span>
                  </div>
                  <input
                    type="text"
                    value={customer.taxId || ""}
                    onChange={(e) => setCustomer({ ...customer, taxId: e.target.value })}
                    placeholder="Para emissão de fatura com NIF"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 sm:py-2.5 text-base sm:text-xs text-white placeholder:text-zinc-600 transition-colors focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* 2. MÉTODO DE PAGAMENTO */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 sm:p-6 backdrop-blur-md space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[0.65rem] font-bold text-cyan-400">
                    2
                  </span>
                  <h2 className="font-display text-sm uppercase tracking-wider text-white">
                    Método de Pagamento
                  </h2>
                </div>
                <span className="text-[0.65rem] font-mono uppercase tracking-wider text-cyan-400">
                  Manual sem comissões
                </span>
              </div>

              {/* Selector grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(["mbway", "bank_transfer", "revolut", "paypal"] as PaymentMethodId[]).map((id) => {
                  const cfg = PAYMENT_CONFIG[id];
                  const isSelected = selectedMethod === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedMethod(id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                          : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      {id === "mbway" && <Smartphone size={18} className="mb-1.5" />}
                      {id === "bank_transfer" && <Building2 size={18} className="mb-1.5" />}
                      {id === "revolut" && <CreditCard size={18} className="mb-1.5" />}
                      {id === "paypal" && <ExternalLink size={18} className="mb-1.5" />}

                      <span className="text-xs font-semibold uppercase font-display tracking-wide">
                        {cfg.name}
                      </span>
                      <span className="text-[0.62rem] font-mono text-zinc-500 mt-0.5">
                        {cfg.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Instructions box for active method */}
              <div className="rounded-xl border border-cyan-400/30 bg-cyan-950/20 p-4 space-y-3">
                <p className="text-xs text-zinc-300 font-medium">
                  {currentMethodConfig.instructions}
                </p>

                <div className="space-y-2">
                  {currentMethodConfig.fields.map((field) => (
                    <div
                      key={field.label}
                      className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs"
                    >
                      <div>
                        <span className="block font-mono text-[0.65rem] uppercase text-zinc-500">
                          {field.label}
                        </span>
                        <span className="font-mono text-sm font-bold text-white">
                          {field.value}
                        </span>
                      </div>

                      {field.copyable && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(field.value, field.label)}
                          className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[0.68rem] font-mono uppercase text-zinc-300 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          {copiedKey === field.label ? (
                            <>
                              <Check size={12} className="text-cyan-400" />
                              <span>Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-[0.72rem] text-zinc-400 italic">
                  {currentMethodConfig.note}
                </p>
              </div>
            </div>

            {/* 3. COMPROVATIVO DE PAGAMENTO */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 sm:p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[0.65rem] font-bold text-cyan-400">
                    3
                  </span>
                  <h2 className="font-display text-sm uppercase tracking-wider text-white">
                    Comprovativo de Pagamento
                  </h2>
                </div>
                <span className="text-[0.65rem] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Obrigatório
                </span>
              </div>

              <p className="text-xs text-zinc-400">
                Depois de efetuares o pagamento, anexa aqui o comprovativo (recibo bancário, screenshot MB WAY ou PDF).
              </p>

              {/* Upload Dropzone */}
              {!proofFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.[0]) {
                      void handleProofUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                      : "border-white/15 bg-white/[0.02] hover:border-cyan-400/60 hover:bg-cyan-500/[0.04]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      void handleProofUpload(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />

                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-400">
                    <Upload size={20} />
                  </div>

                  <span className="text-xs font-semibold text-white">
                    {uploadingProof ? "A processar comprovativo..." : "Anexar comprovativo de pagamento"}
                  </span>
                  <span className="mt-1 text-[0.68rem] font-mono text-zinc-400">
                    JPG, PNG, WEBP ou PDF · até 25 MB
                  </span>
                </div>
              ) : (
                /* Uploaded proof file card */
                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {proofFile.previewUrl ? (
                      <img
                        src={proofFile.previewUrl}
                        alt="Comprovativo"
                        className="h-12 w-12 rounded-lg object-cover border border-white/10 bg-zinc-900 shrink-0"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/15 text-red-400 shrink-0">
                        <FileText size={24} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                        <p className="truncate text-xs font-medium text-white" title={proofFile.fileName}>
                          {proofFile.fileName}
                        </p>
                      </div>
                      <p className="font-mono text-[0.65rem] text-zinc-500 mt-0.5">
                        {formatBytes(proofFile.fileSize)} · Pronto para validação
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setProofFile(null)}
                    aria-label="Remover comprovativo"
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-zinc-400 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline text-[0.68rem] font-mono uppercase">Remover</span>
                  </button>
                </div>
              )}

              {proofError && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{proofError}</span>
                </div>
              )}
            </div>

            {/* 4. PRIVACIDADE & TERMOS */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 sm:p-5 backdrop-blur-md space-y-3">
              <label className="flex items-start gap-3 cursor-pointer text-sm sm:text-xs text-zinc-300 leading-relaxed">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => {
                    setPrivacyAccepted(e.target.checked);
                    if (e.target.checked) setPrivacyError("");
                  }}
                  className="mt-0.5 h-5 w-5 sm:h-4 sm:w-4 rounded border-white/20 bg-zinc-900 text-cyan-400 focus:ring-cyan-400 cursor-pointer shrink-0"
                />
                <span>
                  Li e aceito a{" "}
                  <strong className="text-white underline underline-offset-2">
                    Política de Privacidade
                  </strong>{" "}
                  e autorizo o tratamento dos meus dados para processamento deste pedido.
                </span>
              </label>

              {privacyError && (
                <p className="text-xs sm:text-[0.68rem] text-red-400 flex items-center gap-1">
                  <AlertCircle size={14} /> {privacyError}
                </p>
              )}
            </div>

            {/* SUBMISSION BUTTON */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[50px] flex items-center justify-center gap-2 rounded-xl bg-cyan-400 py-4 px-6 text-sm sm:text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-cyan-300 shadow-[0_0_25px_rgba(0,229,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShieldCheck size={18} />
              {submitting ? "A submeter pedido..." : "Finalizar Pedido · Enviar Comprovativo"}
            </button>
          </form>

          {/* RIGHT COLUMN: Order Summary (5 cols) */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 sm:p-6 backdrop-blur-md space-y-5">
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <h2 className="font-display text-sm uppercase tracking-wider text-white">
                  Resumo do Pedido
                </h2>
                <span className="font-mono text-xs text-cyan-400">
                  {totalItems} artigo(s)
                </span>
              </div>

              {/* Items list */}
              <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
                {items.map((item) => {
                  const product = allProducts.find((p) => p.slug === item.productId);
                  const preview = item.previewDataUrl || product?.catalogImage;
                  const mode = item.mode ?? (item.customizerDesign ? "design" : "ajuda");

                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs"
                    >
                      <div className="h-16 w-16 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        {preview ? (
                          <img
                            src={preview}
                            alt={item.productName}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <ShoppingBag size={20} className="text-zinc-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-white truncate">
                            {item.productName}
                          </h3>
                          <span className="font-mono text-zinc-400 shrink-0">
                            x{item.quantity}
                          </span>
                        </div>

                        {item.variant && (
                          <p className="text-[0.7rem] text-zinc-400">
                            Tamanho: <span className="text-white">{item.variant}</span>
                          </p>
                        )}

                        {/* Personalization Info */}
                        <div className="pt-0.5 space-y-0.5">
                          <span className="inline-block rounded px-1.5 py-0.5 text-[0.62rem] font-mono uppercase bg-white/5 text-cyan-300 border border-white/10">
                            {mode === "design"
                              ? "Design carregado"
                              : mode === "ajuda"
                                ? "Ajuda VinilArt"
                                : "Pedido sob consulta"}
                          </span>

                          {/* Notes if present */}
                          {(item.serviceDetails?.designNotes || item.serviceDetails?.notes || item.serviceDetails?.description) && (
                            <p className="text-[0.68rem] text-zinc-400 truncate">
                              <span className="text-zinc-500">Nota:</span>{" "}
                              {item.serviceDetails.designNotes || item.serviceDetails.notes || item.serviceDetails.description}
                            </p>
                          )}

                          {/* Help details */}
                          {mode === "ajuda" && (
                            <>
                              {item.serviceDetails?.requestedText && (
                                <p className="text-[0.68rem] text-zinc-400 truncate">
                                  <span className="text-zinc-500">Texto:</span>{" "}
                                  {item.serviceDetails.requestedText}
                                </p>
                              )}
                              {item.serviceDetails?.attachments && item.serviceDetails.attachments.length > 0 && (
                                <p className="text-[0.65rem] font-mono text-cyan-400/90">
                                  {item.serviceDetails.attachments.length} anexo(s) incluído(s)
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">Sob consulta</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Envio</span>
                  <span className="font-mono text-white">A calcular</span>
                </div>
                <div className="border-t border-white/5 pt-2 flex justify-between items-baseline">
                  <span className="font-display uppercase tracking-wider text-white text-sm">
                    Total
                  </span>
                  <span className="font-mono text-base font-bold text-cyan-400">
                    Sob consulta
                  </span>
                </div>
                <p className="text-[0.68rem] text-zinc-500 pt-1 leading-snug">
                  * O valor e detalhes do envio são validados com o cliente após receção do comprovativo.
                </p>
              </div>

              {/* Security note */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-[0.7rem] text-zinc-400 flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-cyan-400 shrink-0" />
                <span>
                  Pagamento 100% seguro por transferência ou MB WAY direto com a VinilArt.
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
