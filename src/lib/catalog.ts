import { countries } from "../data/countries";
import { teams } from "../data/teams";
import { products } from "../data/products";
import { categories } from "../data/categories";
import type { Country, Team, Product, Category } from "../data/types";

export function getActiveCountries(): Country[] {
  return countries.filter((c) => c.active).sort((a, b) => a.order - b.order);
}

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug && c.active);
}

export function getCountryById(id: string): Country | undefined {
  return countries.find((c) => c.id === id);
}

export function getTeamsByCountryId(countryId: string): Team[] {
  return teams
    .filter((t) => t.countryId === countryId && t.active)
    .sort((a, b) => a.order - b.order);
}

export function getTeamBySlug(countrySlug: string, teamSlug: string): Team | undefined {
  const country = getCountryBySlug(countrySlug);
  if (!country) return undefined;
  return teams.find((t) => t.slug === teamSlug && t.countryId === country.id && t.active);
}

export function getTeamById(id: string): Team | undefined {
  return teams.find((t) => t.id === id);
}

export function getAllActiveTeams(): Team[] {
  return teams.filter((t) => t.active);
}

export function getFeaturedTeams(limit = 6): Team[] {
  return getAllActiveTeams()
    .filter((t) => t.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, limit);
}

export function getProductsByTeamId(teamId: string): Product[] {
  return products.filter((p) => p.teamId === teamId).sort((a, b) => a.order - b.order);
}

export function getProductBySlug(teamId: string, productSlug: string): Product | undefined {
  return products.find((p) => p.teamId === teamId && p.slug === productSlug);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, limit);
}

export function getAllProducts(): Product[] {
  return products;
}

export function getCategories(): Category[] {
  return categories;
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

/** Retorna apenas as categorias realmente usadas pelos produtos de um time (para montar os filtros). */
export function getCategoriesForTeam(teamId: string): Category[] {
  const usedIds = new Set(getProductsByTeamId(teamId).map((p) => p.categoryId));
  return categories.filter((c) => usedIds.has(c.id));
}

export function getProductPath(product: Product): string {
  const team = getTeamById(product.teamId);
  const country = getCountryById(product.countryId);
  if (!team || !country) return "/";
  return `/${country.slug}/${team.slug}/${product.slug}`;
}

export function getTeamPath(team: Team): string {
  const country = getCountryById(team.countryId);
  if (!country) return "/";
  return `/${country.slug}/${team.slug}`;
}

export function getCountryPath(country: Country): string {
  return `/${country.slug}`;
}

export interface SearchIndexItem {
  product: Product;
  teamName: string;
  countryName: string;
  categoryName: string;
  href: string;
  /** Texto combinado (produto + temporada + time + país + categoria) em minúsculas, pronto para busca. */
  haystack: string;
}

/**
 * Índice plano usado pela busca no cliente (SearchBar / SearchResults).
 * Cobre nome do produto, temporada, time, país e categoria.
 */
export function getSearchIndex(): SearchIndexItem[] {
  return products.map((product) => {
    const team = getTeamById(product.teamId);
    const country = getCountryById(product.countryId);
    const category = getCategoryById(product.categoryId);
    const teamName = team?.name ?? "";
    const countryName = country?.name ?? "";
    const categoryName = category?.name ?? "";

    return {
      product,
      teamName,
      countryName,
      categoryName,
      href: getProductPath(product),
      haystack: [product.name, product.season, teamName, countryName, categoryName]
        .join(" ")
        .toLowerCase(),
    };
  });
}
