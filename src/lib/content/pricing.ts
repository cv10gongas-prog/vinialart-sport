/**
 * VinilArt Sport — Apresentação de dados comerciais.
 *
 * Regra: o PRODUTO controla os seus dados comerciais (`commercial`), a UI apenas
 * os apresenta. Não existe aqui qualquer regra por slug, rota ou nome.
 * Quando os preços vierem do WordPress, chegam no mesmo campo `commercial`.
 */

export type PriceMode = "fixed" | "from" | "quote";

export type ProductCommercial = {
  priceMode: PriceMode;
  /** Valor numérico, quando aplicável (priceMode "fixed" ou "from"). */
  price?: number | undefined;
  currency?: string | undefined;
  /** Etiqueta explícita: se existir, é usada tal e qual. */
  priceLabel?: string | undefined;
};

export const QUOTE_PRICE_LABEL = "Sob Orçamento";

const CURRENCY_SUFFIX: Record<string, string> = {
  EUR: "€",
};

export function formatPriceValue(price: number, currency = "EUR"): string {
  const suffix = CURRENCY_SUFFIX[currency] ?? ` ${currency}`;
  return `${price.toFixed(2).replace(".", ",")}${suffix}`;
}

/** Etiqueta apresentada nos cartões e no personalizador. */
export function productPriceBadge(
  product: { commercial?: ProductCommercial | undefined } | undefined,
): string {
  const commercial = product?.commercial;
  if (!commercial) return QUOTE_PRICE_LABEL;
  if (commercial.priceLabel) return commercial.priceLabel;

  if (commercial.priceMode === "quote" || commercial.price === undefined) {
    return QUOTE_PRICE_LABEL;
  }

  const value = formatPriceValue(commercial.price, commercial.currency);
  return commercial.priceMode === "from" ? `Desde ${value}` : value;
}
