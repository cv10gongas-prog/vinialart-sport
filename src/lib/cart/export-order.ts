import type { CartItem } from "./types";
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
export async function downloadOrder(
  items: CartItem[],
  name: string,
  contact: string,
  notes: string,
) {
  const sections = await Promise.all(
    items.map(async (item) => {
      const keys = new Set<string>();
      if (item.serviceDetails?.fileKey) keys.add(item.serviceDetails.fileKey);
      if (item.customizerDesign) {
        const design = JSON.parse(item.customizerDesign);
        for (const surface of Object.values(design.surfaces ?? {}) as {
          layers: { fileKey?: string; originalFileKey?: string }[];
        }[])
          for (const layer of surface.layers) {
            if (layer.fileKey) keys.add(layer.fileKey);
            if (layer.originalFileKey) keys.add(layer.originalFileKey);
          }
      }
      const files = await Promise.all(
        [...keys].map(async (key) => {
          const record = await getImageBlob(key);
          if (!record)
            throw new Error(
              `O ficheiro original de ${item.productName} já não está disponível neste navegador. Volta a anexá-lo antes de continuar.`,
            );
          return `<a download="${escape(record.filename)}" href="${escape(await dataUrl(record.blob))}">${escape(record.filename)}</a>`;
        }),
      );
      if (item.serviceDetails?.fileDataUrl)
        files.push(
          `<a download="${escape(item.serviceDetails.fileName)}" href="${escape(item.serviceDetails.fileDataUrl)}">${escape(item.serviceDetails.fileName)}</a>`,
        );
      const mode = item.mode ?? (item.customizerDesign ? "design" : "ajuda");
      const spec = item.customizerDesign
        ? `<a download="configuracao.json" href="data:application/json;charset=utf-8,${encodeURIComponent(item.customizerDesign)}">Configuração do design</a>`
        : "";
      return `<section><h2>${escape(item.productName)}</h2><p>${item.quantity} unidade(s) · Sob consulta · ${mode === "design" ? "Design carregado" : mode === "servico" ? "Pedido sob consulta" : "Ajuda VinilArt"}</p><p>${escape(item.variant)}</p>${item.previewDataUrl ? `<img src="${escape(item.previewDataUrl)}" alt="Preview">` : ""}<pre>${escape([item.serviceDetails?.itemOrServiceType, item.serviceDetails?.userName, item.serviceDetails?.userContact, item.serviceDetails?.description, item.serviceDetails?.notes].filter(Boolean).join("\n"))}</pre><div class="files">${files.join("")}${spec}</div></section>`;
    }),
  );
  const html = `<!doctype html><html lang="pt"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Pedido VinilArt Sport</title><style>body{font:16px/1.6 system-ui;max-width:900px;margin:40px auto;padding:20px;color:#17202a}h1{border-bottom:5px solid #00bddd}section{border-top:1px solid #ddd;padding:25px 0}img{max-width:100%;max-height:320px}pre{white-space:pre-wrap;font:inherit}.files a{display:block;margin:8px 0}small{color:#555}</style><h1>Pedido de orçamento · VinilArt Sport</h1><p>${escape(name)}<br>${escape(contact)}</p><pre>${escape(notes)}</pre><small>Preparado em ${escape(new Date().toLocaleString("pt-PT"))}. Pedido por enviar. Os ficheiros originais estão incluídos neste documento.</small>${sections.join("")}</html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "pedido-vinilart-sport.html";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
