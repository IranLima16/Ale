export interface Country {
  id: string;
  name: string;
  slug: string;
  /** Caminho da imagem em /public, ex: "/countries/franca.png". Opcional. */
  flagImage?: string;
  /** Define a ordem de exibição (menor primeiro). */
  order: number;
  /** Países inativos não aparecem em nenhuma listagem nem geram página. */
  active: boolean;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  /** Deve corresponder ao "id" de um país em countries.ts. */
  countryId: string;
  /** Caminho do logo/escudo em /public, ex: "/teams/psg.png". */
  logo: string;
  /** Imagem de capa opcional para a página do time. */
  coverImage?: string;
  order: number;
  active: boolean;
  /** Se true, o time pode aparecer na seção de destaques da home. */
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  /** Deve corresponder ao "id" de um time em teams.ts. */
  teamId: string;
  /** Deve corresponder ao "id" de um país em countries.ts (mesmo país do time). */
  countryId: string;
  /** Ex: "2025/26" ou "1994" para peças retrô. */
  season: string;
  /** Deve corresponder ao "id" de uma categoria em categories.ts. */
  categoryId: string;
  /** Preço normal, em reais (número, ex: 219.9). */
  price: number;
  /** Preço promocional opcional, em reais. Quando definido, é exibido no lugar do preço normal com o preço normal riscado. */
  promoPrice?: number;
  shortDescription: string;
  /** Caminho da imagem principal em /public. */
  mainImage: string;
  /** Caminhos de imagens adicionais para a galeria do produto. */
  additionalImages?: string[];
  /** Se true, o produto pode aparecer na seção de destaques da home. */
  featured?: boolean;
  /** Define a ordem de exibição dentro do time (menor primeiro). */
  order: number;
}
