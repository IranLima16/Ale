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
  const discountPct = hasPromo ? Math.round((1 - product.promoPrice! / product.price) * 100) : 0;

  return (
    <a
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-surface-1 shadow-lg shadow-black/20 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/50 focus-visible:-translate-y-1"
    >
      <div className="relative p-2.5 sm:p-3">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-surface-2 ring-1 ring-inset ring-white/5">
          <img
            src={product.mainImage}
            alt={product.name}
            width={800}
            height={1000}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
          />
        </div>

        {hasPromo ? (
          <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-brand-500 px-2.5 py-1 text-xs font-bold text-surface-0 shadow-md shadow-black/30">
            -{discountPct}%
          </span>
        ) : (
          product.featured && (
            <span className="absolute left-4 top-4 rounded-full bg-gold-400 px-2.5 py-1 text-xs font-bold text-surface-0 shadow-md shadow-black/30">
              Destaque
            </span>
          )
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 border-t border-white/8 p-4 pt-3">
        {teamName && (
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">{teamName}</span>
        )}
        <h3 className="font-semibold leading-snug text-white">{product.name}</h3>
        <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-ink-300">
          Temporada {product.season}
        </span>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-white/8 pt-3">
          <div className="flex flex-col font-display leading-none">
            {hasPromo && (
              <span className="text-xs text-ink-500 line-through">{formatPrice(product.price)}</span>
            )}
            <span className={`text-2xl font-bold ${hasPromo ? "text-brand-400" : "text-white"}`}>
              {formatPrice(hasPromo ? product.promoPrice! : product.price)}
            </span>
          </div>
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ink-300 transition-colors duration-200 group-hover:border-brand-400/50 group-hover:bg-brand-500 group-hover:text-surface-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}
