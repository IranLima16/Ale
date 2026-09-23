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
      className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-surface-1 p-4 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-xl hover:shadow-black/40 focus-visible:-translate-y-0.5"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-2 ring-1 ring-inset ring-white/10">
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
        <h3 className="font-display text-lg font-bold uppercase leading-snug tracking-tight text-white group-hover:text-brand-400">
          {team.name}
        </h3>
        {typeof productCount === "number" && (
          <span className="text-sm text-ink-400">
            {productCount} {productCount === 1 ? "camisa" : "camisas"} no catálogo
          </span>
        )}
      </div>
      <span aria-hidden="true" className="text-ink-500 transition-transform group-hover:translate-x-1 group-hover:text-brand-400">
        →
      </span>
    </a>
  );
}
