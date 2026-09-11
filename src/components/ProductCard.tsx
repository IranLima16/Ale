import type { Product } from "../data/types";
import { formatPrice } from "../lib/format";

interface Props {
  product: Product;
  href: string;
  /** Nome do time, exibido como subtítulo quando o card aparece fora da página do time (home, busca). */
  teamName?: string;
}

export default function ProductCard({ product, href, teamName }: Props) {
  const hasPromo = typeof product.promoPrice === "number";

  return (
    <a
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5 focus-visible:-translate-y-0.5"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-100">
        <img
          src={product.mainImage}
          alt={product.name}
          width={800}
          height={1000}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {hasPromo && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            Promoção
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {teamName && (
          <span className="text-xs font-medium uppercase tracking-wide text-ink-400">{teamName}</span>
        )}
        <h3 className="font-semibold leading-snug text-ink-900">{product.name}</h3>
        <span className="text-sm text-ink-500">Temporada {product.season}</span>

        <div className="mt-2 flex items-baseline gap-2">
          {hasPromo ? (
            <>
              <span className="text-lg font-bold text-brand-700">{formatPrice(product.promoPrice!)}</span>
              <span className="text-sm text-ink-400 line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-ink-900">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </a>
  );
}
