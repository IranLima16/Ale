import { siteConfig } from "../config/site";
import { formatPrice } from "./format";
import type { Product, Team } from "../data/types";

function buildWhatsAppUrl(message: string): string {
  const digits = siteConfig.whatsapp.number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Link geral de WhatsApp, usado fora do contexto de um produto específico. */
export function getGeneralWhatsAppLink(): string {
  return buildWhatsAppUrl(siteConfig.whatsapp.defaultMessage);
}

/** Link de WhatsApp com mensagem pré-preenchida a partir dos dados do produto. */
export function getProductWhatsAppLink(product: Product, team: Team): string {
  const price = product.promoPrice ?? product.price;
  const message = [
    "Olá! Gostei desta camiseta que vi no catálogo:",
    "",
    `${team.name} - ${product.name}`,
    formatPrice(price),
    "",
    "Você consegue me passar mais informações?",
  ].join("\n");

  return buildWhatsAppUrl(message);
}
