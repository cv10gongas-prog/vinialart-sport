import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Printer } from "lucide-react";
import type { Product } from "@/lib/sport-data";
import { productPresentationImage } from "@/lib/sport-presentation";
export function ProductCard({
  product,
}: {
  product: Product;
  size?: "default" | "feature";
  personalize?: boolean;
  mode?: "design" | "ajuda" | undefined;
}) {
  const body = (
    <>
      <div className="catalog-card-image">
        {product.catalogImage ? (
          <img
            src={product.catalogImage}
            alt={`${product.name} — ${product.imageKind}`}
            loading="lazy"
          />
        ) : product.customizationMode === "product" ? (
          <img src={productPresentationImage(product.image)} alt={product.name} loading="lazy" />
        ) : (
          <div className="catalog-service-graphic">
            <Printer size={64} />
            <span>Impressão</span>
          </div>
        )}
        <span className="catalog-price">Sob consulta</span>
      </div>
      <div className="catalog-card-copy">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <span className="catalog-card-action">
          {product.customizationMode === "product"
            ? "Ver produto / Personalizar"
            : "Pedir orçamento"}
          <ArrowUpRight size={18} />
        </span>
      </div>
    </>
  );
  return product.customizationMode === "catalog" ? (
    <Link
      to="/adeptos"
      search={{ artigo: undefined, cartItem: undefined }}
      className="catalog-card"
    >
      {body}
    </Link>
  ) : (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      search={{ cartItem: undefined, modo: undefined }}
      className="catalog-card"
    >
      {body}
    </Link>
  );
}
