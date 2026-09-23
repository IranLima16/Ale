import { useEffect, useMemo, useState } from "react";
import type { Category, Product } from "../data/types";
import ProductCard from "./ProductCard";

interface Item {
  product: Product;
  href: string;
}

interface Props {
  items: Item[];
  categories: Category[];
}

const ALL = "todos";
const PARAM = "categoria";

export default function CategoryFilterGrid({ items, categories }: Props) {
  const [active, setActive] = useState<string>(ALL);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get(PARAM);
    if (requested && categories.some((category) => category.id === requested)) {
      setActive(requested);
    }
  }, [categories]);

  const filtered = useMemo(() => {
    if (active === ALL) return items;
    return items.filter((item) => item.product.categoryId === active);
  }, [active, items]);

  function selectCategory(id: string) {
    setActive(id);
    const params = new URLSearchParams(window.location.search);
    if (id === ALL) {
      params.delete(PARAM);
    } else {
      params.set(PARAM, id);
    }
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <FilterPill label="Todos" isActive={active === ALL} onClick={() => selectCategory(ALL)} />
        {categories.map((category) => (
          <FilterPill
            key={category.id}
            label={category.name}
            isActive={active === category.id}
            onClick={() => selectCategory(category.id)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-surface-1 p-8 text-center">
          <p className="font-semibold text-white">Nenhuma camisa nessa categoria</p>
          <p className="mt-1 text-sm text-ink-400">Escolha outro filtro para ver as demais opções deste time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <ProductCard key={item.product.id} product={item.product} href={item.href} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors duration-150 ${
        isActive
          ? "border-brand-500 bg-brand-500 text-surface-0"
          : "border-white/10 bg-white/5 text-ink-300 hover:border-brand-400/50 hover:text-brand-400"
      }`}
    >
      {label}
    </button>
  );
}
