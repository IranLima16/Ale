# Camisas do Mundo — Catálogo Digital

Catálogo digital de camisas de futebol. **Não é uma loja virtual**: não há
carrinho, checkout, pagamento, login ou controle de estoque. O visitante
navega por país → time → camisa, vê fotos e preço, e clica em um botão para
falar com o vendedor no WhatsApp e fechar a compra por lá.

> Todos os times, camisas, preços e imagens deste repositório são
> **dados de demonstração fictícios**, usados apenas para testar o site.

---

## 1. Estrutura do projeto

```
src/
  config/
    site.ts            → nome da loja, WhatsApp, redes sociais, cores, rodapé
  data/
    types.ts            → formato (schema) de país, time, categoria e produto
    countries.ts         → lista de países
    teams.ts              → lista de times
    categories.ts          → lista de categorias (Torcedor, Retrô, etc.)
    products.ts             → lista de camisas (nome, preço, imagens...)
  lib/
    catalog.ts           → funções que leem os dados acima (buscar time por slug, etc.)
    whatsapp.ts           → monta o link do WhatsApp com a mensagem pronta
    format.ts              → formata preço em Real (R$)
  layouts/
    BaseLayout.astro     → estrutura de toda página (SEO, cabeçalho, rodapé)
  components/
    Header.astro, Footer.astro, Breadcrumbs.astro, EmptyState.astro,
    WhatsAppButton.astro    → componentes visuais estáticos
    ProductCard.tsx, TeamCard.tsx, CountryCard.tsx    → cards reutilizáveis
    SearchBar.tsx, SearchResults.tsx, CategoryFilterGrid.tsx,
    ImageGallery.tsx    → componentes interativos (busca, filtro, galeria)
  pages/
    index.astro                        → Home
    busca.astro                        → Página de busca
    404.astro                          → Página não encontrada
    [country]/index.astro              → Página de país (gerada para cada país)
    [country]/[team]/index.astro       → Página de time (gerada para cada time)
    [country]/[team]/[product].astro   → Página de produto (gerada para cada camisa)
public/
  countries/, teams/, products/<time>/  → imagens (hoje, placeholders)
  favicon.svg, og-cover.png             → ícone do site e imagem de compartilhamento
scripts/
  generate-placeholders.mjs             → gera as imagens placeholder de demonstração
```

**Regra de ouro do projeto:** nenhum componente ou página tem texto, preço ou
nome "escrito direto". Tudo vem de `src/data/*.ts`. Para mudar o que aparece
no site, você edita os dados — nunca precisa editar HTML/componentes.

---

## 2. Principais decisões técnicas

- **Astro + React + Tailwind CSS + TypeScript.** Astro gera páginas 100%
  estáticas (HTML puro) no build — ótimo para SEO e para o preview de link
  correto no WhatsApp, que só lê HTML pronto, sem executar JavaScript. React
  é usado **só** nos pontos realmente interativos (busca, filtro de
  categoria, galeria de imagens); o resto do site não envia JavaScript
  nenhum ao visitante, o que deixa o carregamento bem mais rápido no celular.
- **Sem backend, sem banco de dados.** Os "dados" são arquivos TypeScript
  dentro do próprio projeto. Isso elimina custo de servidor/banco e torna o
  deploy tão simples quanto hospedar arquivos estáticos (Cloudflare Pages,
  de graça).
- **Página própria por camisa** (em vez de modal). Assim cada camisa tem uma
  URL única, que pode ser compartilhada isoladamente no WhatsApp com a
  imagem e o preço certos.
- **Imagens placeholder 100% originais**, geradas localmente pelo script
  `scripts/generate-placeholders.mjs` (usa a biblioteca `sharp` apenas em
  modo desenvolvimento, para desenhar as imagens — isso não afeta o site
  publicado). Os produtos usam uma ilustração genérica de camisa (silhueta
  própria, nas cores tradicionais de cada clube) e os times um selo com
  iniciais — nenhum escudo oficial, logotipo ou foto de terceiros é usado em
  nenhum lugar do projeto.
- **Nenhum campo de tamanho, estoque ou disponibilidade existe no projeto**
  — nem escondido. Isso foi removido do modelo de dados de propósito, para
  garantir que nunca apareça por engano.

---

## 3. Como rodar localmente

Pré-requisito: [Node.js](https://nodejs.org) versão 20 ou superior instalado.

```bash
npm install
npm run dev
```

Abra `http://localhost:4321` no navegador. A cada alteração salva, a página
atualiza sozinha.

Para gerar (ou regenerar) as imagens placeholder de demonstração:

```bash
npm run placeholders
```

Para conferir o build de produção localmente antes de publicar:

```bash
npm run build
npm run preview
```

---

## 4. Como trocar um preço

Abra [`src/data/products.ts`](src/data/products.ts), encontre o produto pelo
`name` ou `id`, e altere o campo `price` (e/ou `promoPrice`):

```ts
{
  id: "psg-home-25-26",
  name: "PSG Home 25/26",
  price: 219.9,        // ← troque aqui
  promoPrice: 199.9,   // ← preço promocional (opcional; remova a linha para não ter promoção)
  ...
}
```

Salve o arquivo — a página do produto e todos os cards que o exibem (home,
time, busca) são atualizados automaticamente.

---

## 5. Como trocar uma imagem

Cada imagem é só um arquivo dentro de `public/`. Para trocar:

1. Prepare a foto real (formato `.png` ou `.jpg`, fundo neutro, boa
   iluminação — proporção próxima de 4:5 funciona melhor para camisas).
2. Salve com o **mesmo nome e caminho** do placeholder que ela vai
   substituir. Exemplo: para trocar a foto principal da PSG Home 25/26,
   salve sua imagem em `public/products/psg/home-25-26-1.png` (pode ser
   `.jpg`, só ajuste a extensão também no arquivo de dados).
3. Se o caminho/nome do arquivo mudar, atualize o campo correspondente
   (`mainImage`, `additionalImages`, `logo`, `flagImage`) em
   `src/data/products.ts`, `teams.ts` ou `countries.ts`.

Não é preciso mexer em nenhum componente — as páginas só exibem o caminho
que está cadastrado no dado.

---

## 6. Como adicionar uma camiseta

Abra [`src/data/products.ts`](src/data/products.ts) e adicione um novo
objeto na lista `products`, com um `id` e `slug` únicos:

```ts
{
  id: "psg-third-25-26",
  name: "PSG Third 25/26",
  slug: "psg-third-25-26",
  teamId: "psg",              // deve bater com o "id" de um time em teams.ts
  countryId: "franca",        // mesmo país do time
  season: "2025/26",
  categoryId: "torcedor",     // deve bater com um "id" em categories.ts
  price: 229.9,
  shortDescription: "Terceiro uniforme do PSG para a temporada 2025/26.",
  mainImage: "/products/psg/third-25-26-1.png",
  order: 4,
}
```

Salve o arquivo e coloque a imagem correspondente em `public/products/psg/`
(veja a seção 5). A página da camisa (`/franca/psg/psg-third-25-26`) é
criada automaticamente no próximo `npm run dev` ou `npm run build` — não é
necessário criar nenhuma página manualmente.

Se ainda não tiver a foto real, gere um placeholder rápido:

```bash
node scripts/generate-placeholders.mjs --single "PSG Third 25/26" public/products/psg/third-25-26-1.png 800x1000
```

---

## 7. Como remover uma camiseta

Abra `src/data/products.ts` e apague o objeto correspondente da lista (ou
defina um campo como inativo, se preferir manter o histórico — atualmente o
schema não tem um campo `active` em produtos; a forma mais simples é
remover o bloco inteiro). A página deixa de ser gerada no próximo build.

---

## 8. Como adicionar (ou remover) um time

Abra [`src/data/teams.ts`](src/data/teams.ts) e adicione um bloco novo:

```ts
{
  id: "monaco",
  name: "AS Monaco",
  slug: "monaco",
  countryId: "franca",       // deve bater com um "id" em countries.ts
  logo: "/teams/monaco.png",
  order: 3,
  active: true,
  featured: false,
}
```

Coloque o logo em `public/teams/monaco.png` (ou gere um placeholder como na
seção 6). Depois, cadastre as camisas desse time em `products.ts` normalmente
(seção 6). Para remover um time, apague o bloco (ou defina `active: false`
para escondê-lo sem apagar os dados).

Para adicionar um **país novo**, o processo é o mesmo em
[`src/data/countries.ts`](src/data/countries.ts).

---

## 9. Como alterar o WhatsApp, nome da loja, cores etc.

Tudo isso fica em um único arquivo:
[`src/config/site.ts`](src/config/site.ts).

```ts
export const siteConfig = {
  name: "Camisas do Mundo",              // nome exibido no site
  whatsapp: {
    number: "5511999999999",             // país + DDD + número, só dígitos
    defaultMessage: "...",
  },
  social: { instagram: "..." },
  ...
};
```

Para mudar as **cores** da identidade visual, edite o bloco `@theme` no
início de [`src/styles/global.css`](src/styles/global.css) — as variáveis
`--color-brand-*` controlam a cor de destaque (botões, links) e
`--color-ink-*` controlam a escala de cinza/preto usada em textos e fundos.

---

## 10. Como subir no GitHub

```bash
git init
git add .
git commit -m "Catálogo digital de camisas de futebol"
```

Crie um repositório vazio no GitHub (sem README, sem .gitignore — o projeto
já tem os seus) e depois:

```bash
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git branch -M main
git push -u origin main
```

---

## 11. Como publicar no Cloudflare Pages

> **Já publicado:** este projeto está no ar em
> **https://catalogo.irandelima96.workers.dev**, conectado ao repositório
> `IranLima16/Ale`. Os passos abaixo são para referência ou caso precise
> recriar o projeto do zero.

O painel atual do Cloudflare usa um fluxo unificado ("Workers Builds") em vez
da antiga tela separada de "Pages":

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com) → **Compute** →
   **Workers & Pages** → **Create application** (ou o atalho "Create app" na
   home) → **Connect GitHub**.
2. Autorize o GitHub e selecione o repositório do catálogo.
3. Na configuração, confirme:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
4. Clique em **Deploy**. Em poucos minutos você recebe uma URL pública do
   tipo `https://seu-projeto.SEU-USUARIO.workers.dev`.
5. **Importante:** depois de publicar, atualize a URL final em dois lugares
   — `site` em [`astro.config.mjs`](astro.config.mjs) e `url` em
   [`src/config/site.ts`](src/config/site.ts) — e suba um novo commit. Isso
   corrige o sitemap, o `robots.txt` e as imagens de compartilhamento (Open
   Graph) usadas pelo preview do link no WhatsApp.
6. (Opcional) Em **Domains**, conecte um domínio próprio.

Esse fluxo publica o site como um **Worker de assets estáticos**, controlado
pelo arquivo [`wrangler.jsonc`](wrangler.jsonc) na raiz do projeto — é ele
que informa ao Cloudflare que a pasta `dist/` (gerada pelo `npm run build`)
deve ser servida como o site. Se você recriar o projeto do zero, mantenha
esse arquivo; sem ele o comando `wrangler deploy` não sabe o que publicar.

---

## 12. Como atualizar o site depois de publicado

Qualquer alteração local (preço, imagem, time novo etc.) só precisa ser
enviada ao GitHub — o Cloudflare Pages publica sozinho a cada push:

```bash
git add .
git commit -m "Atualiza preços e adiciona camisa nova"
git push
```

Em 1–2 minutos a nova versão já está no ar, no mesmo link.

---

## O que este projeto propositalmente não tem

Carrinho, checkout, pagamento online, login/cadastro de clientes, painel
administrativo, controle de estoque, tamanhos (P/M/G) e qualquer indicação
de disponibilidade — tudo isso é combinado diretamente pelo WhatsApp. A
estrutura de dados (país → time → produto) foi pensada para, no futuro, dar
para evoluir sem reescrever o site — por exemplo, trocando os arquivos em
`src/data/` por uma fonte de dados externa, sem tocar nas páginas ou
componentes.
