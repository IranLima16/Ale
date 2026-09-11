/**
 * Configuração central da loja/catálogo.
 *
 * Altere os valores abaixo para atualizar, em todo o site:
 * nome, logo, WhatsApp, redes sociais, cores e rodapé.
 *
 * Nenhum outro arquivo do projeto deve conter número de WhatsApp,
 * nome da loja ou textos de contato "fixos" — tudo referencia este arquivo.
 */
export const siteConfig = {
  /** Nome exibido no cabeçalho, título das páginas e rodapé. */
  name: "Camisas do Mundo",

  /** Frase curta exibida na home, abaixo do nome. */
  tagline: "Catálogo de camisas de futebol para consulta e encomenda",

  /** Usado como meta description padrão (SEO) quando a página não define uma própria. */
  description:
    "Navegue por países e times, escolha sua camisa favorita e fale direto com o vendedor pelo WhatsApp.",

  /**
   * URL pública final do site (sem barra no final).
   * IMPORTANTE: atualize este valor depois de publicar no Cloudflare Pages
   * (ex: "https://catalogo-de-camisas.pages.dev" ou seu domínio próprio).
   * É usado para gerar sitemap.xml, robots.txt e tags de compartilhamento (Open Graph).
   */
  url: "https://seu-catalogo.pages.dev",

  /**
   * Caminho de uma imagem de logo (ex: "/logo.svg"), se você tiver uma.
   * Deixe como string vazia para usar apenas o nome da loja em texto no cabeçalho.
   */
  logoImage: "",

  whatsapp: {
    /** Número no formato internacional, somente dígitos (país + DDD + número). */
    number: "5511999999999",
    /** Mensagem padrão usada no botão de WhatsApp geral (fora da página de produto). */
    defaultMessage:
      "Olá! Vim pelo catálogo online e gostaria de mais informações.",
  },

  social: {
    instagram: "https://instagram.com/seu-usuario",
  },

  contact: {
    email: "contato@seudominio.com",
  },

  /** Texto curto exibido no rodapé, abaixo dos links. */
  footerText:
    "Catálogo digital para consulta de camisas de futebol. Preço, tamanhos e condições são confirmados diretamente com o vendedor pelo WhatsApp.",
};
