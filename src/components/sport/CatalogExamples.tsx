import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { catalogExamples } from "@/lib/catalog-examples";
export function CatalogExamples({ limit = 6 }: { limit?: number }) {
  return (
    <div className="catalog-examples">
      {catalogExamples.slice(0, limit).map((example) => (
        <Link
          key={example.id}
          to="/adeptos"
          search={{ artigo: example.id, cartItem: undefined }}
          className="catalog-card"
        >
          <div className="catalog-card-image">
            <img src={example.image} alt={`${example.name} — ${example.kind}`} loading="lazy" />
          </div>
          <div className="catalog-card-copy">
            <small>{example.kind}</small>
            <h3>{example.name}</h3>
            <p>Sob consulta</p>
            <span className="catalog-card-action">
              Pedir personalização
              <ArrowUpRight size={18} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
