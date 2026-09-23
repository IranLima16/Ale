import type { Country } from "../data/types";

interface Props {
  country: Country;
  href: string;
  teamCount?: number;
}

export default function CountryCard({ country, href, teamCount }: Props) {
  return (
    <a
      href={href}
      className="group flex shrink-0 flex-col overflow-hidden rounded-2xl border border-white/8 bg-surface-1 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-xl hover:shadow-black/40 focus-visible:-translate-y-0.5"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-surface-2">
        {country.flagImage && (
          <img
            src={country.flagImage}
            alt={`Camisas de times de ${country.name}`}
            width={400}
            height={267}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-col gap-0.5 border-t border-white/8 p-3">
        <h3 className="font-display text-base font-bold uppercase tracking-tight text-white group-hover:text-brand-400">
          {country.name}
        </h3>
        {typeof teamCount === "number" && (
          <span className="text-xs text-ink-400">
            {teamCount === 0
              ? "Em breve"
              : `${teamCount} ${teamCount === 1 ? "time" : "times"}`}
          </span>
        )}
      </div>
    </a>
  );
}
