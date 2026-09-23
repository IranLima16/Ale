import type { Team } from "../data/types";

interface Props {
  team: Team;
  href: string;
  productCount?: number;
}

export default function TeamCard({ team, href, productCount }: Props) {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5 focus-visible:-translate-y-0.5"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ink-900">
        <img
          src={team.logo}
          alt={`Escudo do ${team.name}`}
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <h3 className="font-display text-lg font-bold uppercase leading-snug tracking-tight text-ink-900 group-hover:text-brand-700">
          {team.name}
        </h3>
        {typeof productCount === "number" && (
          <span className="text-sm text-ink-500">
            {productCount} {productCount === 1 ? "camisa" : "camisas"} no catálogo
          </span>
        )}
      </div>
      <span aria-hidden="true" className="text-ink-300 transition-transform group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}
