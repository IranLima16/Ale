import { useMemo, useState } from "react";
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

export default function CategoryFilterGrid({ items, categories }: Props) {
  const [active, setActive] = useState<string>(ALL);

  const filtered = useMemo(() => {
    if (active === ALL) return items;
    return items.filter((item) => item.product.categoryId === active);
  }, [active, items]);

  return (
    <div className="flex flex-col gap-5">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <FilterPill label="Todos" isActive={active === ALL} onClick={() => setActive(ALL)} />
        {categories.map((category) => (
          <FilterPill
            key={category.id}
            label={category.name}
            isActive={active === category.id}
            onClick={() => setActive(category.id)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-8 text-center">
          <p className="font-semibold text-ink-900">Nenhuma camisa nessa categoria</p>
          <p className="mt-1 text-sm text-ink-500">Escolha outro filtro para ver as demais opções deste time.</p>
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
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
        isActive
          ? "border-brand-600 bg-brand-600 text-white"
          : "border-ink-200 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-700"
      }`}
    >
      {label}
    </button>
  );
}
