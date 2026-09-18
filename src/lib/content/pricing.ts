/**
 * Etiquetas de preço — dados, não lógica por produto.
 *
 * Enquanto os preços não vierem do WordPress, ficam aqui numa tabela de dados
 * com uma etiqueta por produto e um valor por omissão para orçamento.
 */

export const QUOTE_PRICE_LABEL = "Sob Orçamento";

export const productPriceBadges: Record<string, string> = {
  "caneleiras-personalizadas": "Desde 19,90€",
};

export function productPriceBadge(productId: string): string {
  return productPriceBadges[productId] ?? QUOTE_PRICE_LABEL;
}
