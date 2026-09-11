import type { Team } from "./types";

/**
 * DADOS DE DEMONSTRAÇÃO.
 * Cada time pertence a um país (countryId deve bater com um id em countries.ts).
 * Para adicionar um time novo: copie um bloco, troque os valores e pronto —
 * a página do time é gerada automaticamente.
 */
export const teams: Team[] = [
  // França
  { id: "psg", name: "Paris Saint-Germain", slug: "psg", countryId: "franca", logo: "/teams/psg.png", order: 1, active: true, featured: true },
  { id: "marseille", name: "Olympique de Marseille", slug: "marseille", countryId: "franca", logo: "/teams/marseille.png", order: 2, active: true },

  // Espanha
  { id: "barcelona", name: "Barcelona", slug: "barcelona", countryId: "espanha", logo: "/teams/barcelona.png", order: 1, active: true, featured: true },
  { id: "real-madrid", name: "Real Madrid", slug: "real-madrid", countryId: "espanha", logo: "/teams/real-madrid.png", order: 2, active: true, featured: true },

  // Inglaterra
  { id: "manchester-city", name: "Manchester City", slug: "manchester-city", countryId: "inglaterra", logo: "/teams/manchester-city.png", order: 1, active: true, featured: true },
  { id: "liverpool", name: "Liverpool", slug: "liverpool", countryId: "inglaterra", logo: "/teams/liverpool.png", order: 2, active: true },
  { id: "arsenal", name: "Arsenal", slug: "arsenal", countryId: "inglaterra", logo: "/teams/arsenal.png", order: 3, active: true },
];
