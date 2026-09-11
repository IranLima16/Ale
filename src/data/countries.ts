import type { Country } from "./types";

/**
 * DADOS DE DEMONSTRAÇÃO.
 * Edite, remova ou adicione países livremente. Um país sem times
 * cadastrados ainda aparece na navegação, mostrando uma mensagem
 * de "nenhum time cadastrado" — assim dá para preparar a estrutura
 * com antecedência.
 */
export const countries: Country[] = [
  { id: "brasil", name: "Brasil", slug: "brasil", flagImage: "/countries/brasil.png", order: 1, active: true },
  { id: "franca", name: "França", slug: "franca", flagImage: "/countries/franca.png", order: 2, active: true },
  { id: "inglaterra", name: "Inglaterra", slug: "inglaterra", flagImage: "/countries/inglaterra.png", order: 3, active: true },
  { id: "espanha", name: "Espanha", slug: "espanha", flagImage: "/countries/espanha.png", order: 4, active: true },
  { id: "italia", name: "Itália", slug: "italia", flagImage: "/countries/italia.png", order: 5, active: true },
  { id: "alemanha", name: "Alemanha", slug: "alemanha", flagImage: "/countries/alemanha.png", order: 6, active: true },
  { id: "argentina", name: "Argentina", slug: "argentina", flagImage: "/countries/argentina.png", order: 7, active: true },
  { id: "selecoes", name: "Seleções", slug: "selecoes", flagImage: "/countries/selecoes.png", order: 8, active: true },
  { id: "outros", name: "Outros", slug: "outros", flagImage: "/countries/outros.png", order: 9, active: true },
];
