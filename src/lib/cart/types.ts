/**
 * VinilArt Sport — Cart types.
 *
 * No prices. No totals. No checkout.
 * Cart items hold product references and user selections.
 * Order completion goes through the quote/contact flow.
 */

export type ServiceQuoteDetails = {
  itemOrServiceType: string;
  quantity?: string | number | undefined;
  approxDimensions?: string | undefined;
  notes?: string | undefined;
  fileName?: string | undefined;
  fileDataUrl?: string | undefined;
};

export type CartItem = {
  /** Unique cart item ID (nanoid) */
  id: string;
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
