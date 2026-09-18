/**
 * VinilArt Sport — fonte única do catálogo (formato de apresentação).
 *
 * Todas as páginas (loja, produto, personalizador, carrinho, checkout) devem
 * ler o catálogo daqui, nunca concatenar listas próprias. Quando o conteúdo
 * passar a vir do WordPress, basta este módulo passar a ler do repositório.
 */

import { products as coreProducts, type Product } from "@/lib/sport-data";
import { supporterProducts } from "@/lib/supporter-products";

/** Catálogo completo, sem duplicações. */
export const catalogProducts: Product[] = [
  ...coreProducts,
  ...supporterProducts,
];

/** Procura por slug (identificador público estável do produto). */
export function findCatalogProduct(slug: string): Product | undefined {
  return catalogProducts.find((product) => product.slug === slug);
}
