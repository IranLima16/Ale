import { useEffect, useMemo, useState } from "react";
import type { SearchIndexItem } from "../lib/catalog";
import ProductCard from "./ProductCard";

interface Props {
  index: SearchIndexItem[];
}

export default function SearchResults({ index }: Props) {
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");
    setReady(true);
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return index.filter((item) => item.haystack.includes(term));
  }, [query, index]);

  if (!ready) return null;

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const params = new URLSearchParams(window.location.search);
          params.set("q", query);
          window.history.replaceState(null, "", `/busca?${params.toString()}`);
        }}
        className="flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 shadow-sm focus-within:border-brand-500"
      >

        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0 text-ink-400">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          name="q"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por time, país, camisa…"
          aria-label="Buscar no catálogo"
          className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
        />
      </form>

      {query.trim().length === 0 ? (
        <p className="text-ink-500">Digite um termo para buscar — por exemplo, o nome de um time ou país.</p>
      ) : results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-8 text-center">
          <p className="font-semibold text-ink-900">Nenhum resultado para "{query}"</p>
          <p className="mt-1 text-sm text-ink-500">Tente buscar por outro time, país ou temporada.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-ink-500">
            {results.length} {results.length === 1 ? "resultado encontrado" : "resultados encontrados"}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((item) => (
              <ProductCard key={item.product.id} product={item.product} href={item.href} teamName={item.teamName} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
