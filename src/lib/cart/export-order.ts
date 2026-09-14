import type { CartItem } from "./types";
import type { OrderRecord } from "@/lib/checkout/types";
import { ORDER_STATUS_LABELS } from "@/lib/checkout/types";
import { getImageBlob } from "@/lib/customizer/storage/db";

const escape = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

const dataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

/**
 * Exports and triggers download of a full OrderRecord HTML receipt.
 * Includes customer details, payment info, embedded proof file, and all product designs/attachments.
 */
export async function downloadFullOrder(order: OrderRecord) {
  const sections = await Promise.all(
    order.items.map(async (item) => {
      const keys = new Set<string>();
      if (item.serviceDetails?.fileKey) keys.add(item.serviceDetails.fileKey);
      if (item.serviceDetails?.attachments) {
        for (const att of item.serviceDetails.attachments) {
          if (att.fileKey) keys.add(att.fileKey);
        }
      }
      if (item.customizerDesign) {
        try {
          const design = JSON.parse(item.customizerDesign);
          for (const surface of Object.values(design.surfaces ?? {}) as {
            layers: { fileKey?: string; originalFileKey?: string }[];
          }[]) {
            for (const layer of surface.layers) {
              if (layer.fileKey) keys.add(layer.fileKey);
              if (layer.originalFileKey) keys.add(layer.originalFileKey);
            }
          }
        } catch {
          // ignore parse error
        }
      }

      const files = await Promise.all(
        [...keys].map(async (key) => {
          const record = await getImageBlob(key);
          if (!record) {
            return `<span style="color:#888;">(Ficheiro de referência ${escape(key)} indisponível)</span>`;
          }
          return `<a download="${escape(record.filename)}" href="${escape(await dataUrl(record.blob))}">📎 Descarregar: ${escape(record.filename)}</a>`;
        }),
      );

      if (item.serviceDetails?.fileDataUrl) {
        files.push(
          `<a download="${escape(item.serviceDetails.fileName)}" href="${escape(item.serviceDetails.fileDataUrl)}">📎 Descarregar: ${escape(item.serviceDetails.fileName)}</a>`,
        );
      }

      const mode = item.mode ?? (item.customizerDesign ? "design" : "ajuda");
      const spec = item.customizerDesign
        ? `<a download="configuracao.json" href="data:application/json;charset=utf-8,${encodeURIComponent(item.customizerDesign)}">⚙️ Configuração do design (JSON)</a>`
        : "";

      const detailsLines = [
        item.serviceDetails?.itemOrServiceType,
        item.serviceDetails?.userName ? `Nome: ${item.serviceDetails.userName}` : undefined,
        item.serviceDetails?.contact
          ? `Contacto: ${item.serviceDetails.contact}`
          : item.serviceDetails?.userContact
            ? `Contacto: ${item.serviceDetails.userContact}`
            : undefined,
        item.serviceDetails?.requestedText
          ? `Texto a incluir: ${item.serviceDetails.requestedText}`
          : undefined,
        item.serviceDetails?.designNotes
          ? `${mode === "design" ? "Nota" : "Ideia / Notas de design"}: ${item.serviceDetails.designNotes}`
          : undefined,
        item.serviceDetails?.description && item.serviceDetails.description !== item.serviceDetails?.designNotes
          ? `Descrição: ${item.serviceDetails.description}`
          : undefined,
        item.serviceDetails?.notes &&
        item.serviceDetails.notes !== item.serviceDetails?.designNotes &&
        item.serviceDetails.notes !== item.serviceDetails?.requestedText
          ? `Notas: ${item.serviceDetails.notes}`
          : undefined,
      ].filter(Boolean);

      return `<section class="item-card">
        <h3>${escape(item.productName)}</h3>
        <p class="item-meta">${item.quantity} unidade(s) · ${escape(item.variant || "Tamanho padrão")} · ${mode === "design" ? "Design carregado" : mode === "servico" ? "Pedido sob consulta" : "Ajuda VinilArt"}</p>
        ${item.previewDataUrl ? `<div class="preview-box"><img src="${escape(item.previewDataUrl)}" alt="Preview"></div>` : ""}
        ${detailsLines.length ? `<pre>${escape(detailsLines.join("\n"))}</pre>` : ""}
        <div class="files">${files.join("")}${spec}</div>
      </section>`;
    }),
  );

  // Load and embed proof file if available
  let proofHtml = "";
  if (order.payment.proofFile) {
    const proof = order.payment.proofFile;
    const proofRecord = await getImageBlob(proof.fileKey);
    let proofDownloadHref = "";
    if (proofRecord) {
      proofDownloadHref = await dataUrl(proofRecord.blob);
    } else if (proof.previewUrl) {
      proofDownloadHref = proof.previewUrl;
    }

    proofHtml = `
      <div class="proof-section">
        <h3>Comprovativo de Pagamento</h3>
        <p><strong>Ficheiro:</strong> ${escape(proof.fileName)} (${(proof.fileSize / 1024).toFixed(0)} KB)</p>
        ${proof.previewUrl ? `<div class="proof-preview"><img src="${escape(proof.previewUrl)}" alt="Comprovativo" style="max-width:300px;max-height:220px;border-radius:6px;border:1px solid #ccc;"></div>` : ""}
        ${proofDownloadHref ? `<p><a class="proof-download" download="${escape(proof.fileName)}" href="${escape(proofDownloadHref)}">📥 Descarregar comprovativo original</a></p>` : ""}
      </div>
    `;
  }

  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;

  const html = `<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pedido ${escape(order.orderId)} · VinilArt Sport</title>
  <style>
    body { font: 15px/1.6 system-ui, -apple-system, sans-serif; max-width: 880px; margin: 30px auto; padding: 25px; color: #17202a; background: #fafafa; }
    .container { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    h1 { margin-top: 0; color: #0f172a; border-bottom: 4px solid #00bddd; padding-bottom: 12px; display: flex; justify-content: space-between; align-items: baseline; }
    .status-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .card h2 { margin: 0 0 10px; font-size: 16px; text-transform: uppercase; color: #334155; }
    .card p { margin: 4px 0; color: #475569; }
    .item-card { border-top: 1px solid #e2e8f0; padding: 20px 0; }
    .item-card h3 { margin: 0; color: #0f172a; font-size: 18px; }
    .item-meta { color: #64748b; font-size: 13px; margin: 4px 0 12px; }
    .preview-box img { max-width: 240px; max-height: 240px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; background: #0b0e14; }
    pre { background: #f1f5f9; padding: 12px; border-radius: 6px; white-space: pre-wrap; font-size: 13px; color: #334155; }
    .files a { display: inline-block; margin: 6px 12px 6px 0; padding: 6px 12px; background: #f1f5f9; border-radius: 6px; text-decoration: none; color: #0284c7; font-weight: 500; font-size: 13px; }
    .files a:hover { background: #e0f2fe; }
    .proof-section { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin-top: 20px; }
    .proof-section h3 { margin-top: 0; color: #065f46; font-size: 16px; }
    .proof-download { display: inline-block; background: #059669; color: #ffffff !important; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 8px; }
    footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>
      <span>VinilArt Sport · Pedido ${escape(order.orderId)}</span>
      <span class="status-badge">${escape(statusLabel)}</span>
    </h1>

    <div class="grid">
      <div class="card">
        <h2>Dados do Cliente</h2>
        <p><strong>Nome:</strong> ${escape(order.customer.fullName)}</p>
        <p><strong>Email:</strong> ${escape(order.customer.email)}</p>
        <p><strong>Telemóvel:</strong> ${escape(order.customer.phone)}</p>
        <p><strong>Morada:</strong> ${escape(order.customer.address)}</p>
        <p><strong>Código Postal / Localidade:</strong> ${escape(order.customer.postalCode)} ${escape(order.customer.city)}</p>
        ${order.customer.taxId ? `<p><strong>NIF:</strong> ${escape(order.customer.taxId)}</p>` : ""}
      </div>

      <div class="card">
        <h2>Pagamento & Estado</h2>
        <p><strong>Método de Pagamento:</strong> ${escape(order.payment.methodName)}</p>
        <p><strong>Estado:</strong> ${escape(statusLabel)}</p>
        <p><strong>Data do Pedido:</strong> ${escape(new Date(order.createdAt).toLocaleString("pt-PT"))}</p>
        <p><strong>Total de Artigos:</strong> ${order.totalItems} unidade(s)</p>
      </div>
    </div>

    ${proofHtml}

    <h2 style="margin-top: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Artigos Encomendados</h2>
    ${sections.join("")}

    <footer>
      Documento gerado em ${escape(new Date().toLocaleString("pt-PT"))}. O pagamento deste pedido fica sujeito a validação pela VinilArt antes de avançar para produção.
    </footer>
  </div>
</body>
</html>`;

  const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `pedido-${order.orderId.toLowerCase()}.html`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Backwards-compatible downloadOrder for simple quote request flow.
 */
export async function downloadOrder(
  items: CartItem[],
  name: string,
  contact: string,
  notes: string,
) {
  const dummyOrder: OrderRecord = {
    orderId: "VA-" + Date.now().toString(36).toUpperCase(),
    createdAt: Date.now(),
    customer: {
      fullName: name,
      email: contact.includes("@") ? contact : "",
      phone: !contact.includes("@") ? contact : "",
      address: "Não indicada (Orçamento preliminar)",
      postalCode: "---",
      city: "---",
    },
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    payment: {
      method: "bank_transfer",
      methodName: "Sob Orçamento",
      proofFile: {
        fileKey: "",
        fileName: "Sem comprovativo preliminar",
        fileSize: 0,
        mimeType: "text/plain",
        uploadedAt: Date.now(),
      },
      status: "pending-payment-verification",
      submittedAt: Date.now(),
    },
    status: "pending-payment-verification",
    privacyAccepted: true,
    notes,
  };

  return downloadFullOrder(dummyOrder);
}
