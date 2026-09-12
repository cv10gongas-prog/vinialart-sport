import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { catalogExamples } from "@/lib/catalog-examples";
export function CatalogExamples({ limit = 7 }: { limit?: number }) {
  return (
    <div className="catalog-examples">
      {catalogExamples.slice(0, limit).map((example) => (
        <Link
          key={example.id}
          to="/produto/$slug"
          params={{slug:`${example.id}-personalizado`}}
          search={{ modo: undefined, cartItem: undefined }}
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
              Personalizar
              <ArrowUpRight size={18} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
