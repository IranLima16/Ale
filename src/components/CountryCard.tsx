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
      className="group flex shrink-0 flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5 focus-visible:-translate-y-0.5"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-ink-900">
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
      <div className="flex flex-col gap-0.5 p-3">
        <h3 className="font-display text-base font-bold uppercase tracking-tight text-ink-900 group-hover:text-brand-700">
          {country.name}
        </h3>
        {typeof teamCount === "number" && (
          <span className="text-xs text-ink-500">
            {teamCount === 0
              ? "Em breve"
              : `${teamCount} ${teamCount === 1 ? "time" : "times"}`}
          </span>
        )}
      </div>
    </a>
  );
}
