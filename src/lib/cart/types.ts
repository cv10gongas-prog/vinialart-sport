/**
 * VinilArt Sport — Cart types.
 *
 * No prices. No totals. No checkout.
 * Cart items hold product references and user selections.
 * Order completion goes through the quote/contact flow.
 */

export interface AttachmentItem {
  id: string;
  fileKey: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  previewUrl?: string | undefined;
}

export type ServiceQuoteDetails = {
  itemOrServiceType: string;
  userName?: string | undefined;
  userContact?: string | undefined;
  description?: string | undefined;
  fileKey?: string | undefined;
  quantity?: string | number | undefined;
  approxDimensions?: string | undefined;
  notes?: string | undefined;
  fileName?: string | undefined;
  fileDataUrl?: string | undefined;

  /** Specialized fields for "QUERO AJUDA DA VINILART" (VinilArt Design Assistance) */
  personalizationMode?: "vinilart-help" | "ready-design" | undefined;
  contact?: string | undefined;
  requestedText?: string | undefined;
  designNotes?: string | undefined;
  attachments?: AttachmentItem[] | undefined;
};

export type CartItem = {
  /** Unique cart item ID (nanoid) */
  id: string;
  mode?: "design" | "ajuda" | "servico" | undefined;
  /** Product slug from sport-data.ts */
  productId: string;
  /** Human-readable product name (denormalized for display) */
  productName: string;
  /** Quantity selected by the user (min: 1) */
  quantity: number;
  /** Selected size variant (e.g. "M"), if applicable */
  variant?: string | undefined;
  /**
   * Serialized customizer design snapshot (JSON string).
   * Lightweight: excludes large binary blobs.
   * Optional — only present if product was customized before adding to cart.
   */
  customizerDesign?: string | undefined;
  /**
   * Versão do esquema de configuração do personalizador usada neste item.
   * Uma encomenda antiga nunca muda por a configuração do produto mudar depois.
   */
  configVersion?: number | undefined;
  /**
   * Fotografia (snapshot) da configuração do produto no momento da encomenda:
   * vistas, mockups, áreas máxima e recomendada, ferramentas, cores e tamanhos.
   * JSON serializado, independente da resolução.
   */
  configSnapshot?: string | undefined;
  /**
   * Small preview thumbnail as a base64 data URL.
   * Optional — only present if a preview was generated.
   */
  previewDataUrl?: string | undefined;
  /**
   * Structured details for service quote requests (Estampagem, Impressão, Pedidos Especiais).
   */
  serviceDetails?: ServiceQuoteDetails | undefined;
  /** Unix timestamp (ms) when the item was added */
  addedAt: number;
};
