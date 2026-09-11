import { useMemo, useRef, useState } from "react";
import type { SearchIndexItem } from "../lib/catalog";
import { formatPrice } from "../lib/format";

interface Props {
  index: SearchIndexItem[];
}

const MAX_SUGGESTIONS = 6;

export default function SearchBar({ index }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return index.filter((item) => item.haystack.includes(term)).slice(0, MAX_SUGGESTIONS);
  }, [query, index]);

  function goToSearchPage() {
    const term = query.trim();
    if (!term) return;
    window.location.href = `/busca?q=${encodeURIComponent(term)}`;
  }

  return (
    <div
      ref={containerRef}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
      className="relative w-full"
    >
      <div className="flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 shadow-sm focus-within:border-brand-500">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0 text-ink-400">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter") goToSearchPage();
            if (event.key === "Escape") setOpen(false);
          }}
          placeholder="Buscar por time, país, camisa..."
          aria-label="Buscar no catálogo"
          className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
        />
      </div>

      {open && query.trim().length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-xl">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-ink-500">Nenhum resultado para "{query}".</p>
          ) : (
            <ul>
              {results.map((item) => (
                <li key={item.product.id}>
                  <a
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-ink-50"
                  >
                    <img
                      src={item.product.mainImage}
                      alt=""
                      width={40}
                      height={50}
                      loading="lazy"
                      className="h-12 w-10 shrink-0 rounded-md object-cover"
                    />
                    <span className="flex flex-1 flex-col overflow-hidden">
                      <span className="truncate text-sm font-medium text-ink-900">{item.product.name}</span>
                      <span className="truncate text-xs text-ink-500">
                        {item.teamName} · {item.countryName}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-ink-700">
                      {formatPrice(item.product.promoPrice ?? item.product.price)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={goToSearchPage}
            className="w-full border-t border-ink-100 px-4 py-3 text-left text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            Ver todos os resultados para "{query}"
          </button>
        </div>
      )}
    </div>
  );
}
