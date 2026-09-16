// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // IMPORTANTE: atualize para a URL final publicada no Cloudflare Pages
  // (ou seu domínio próprio). Usado para sitemap.xml, robots.txt e URLs
  // absolutas de compartilhamento (Open Graph / WhatsApp).
  site: 'https://ale.irandelima96.workers.dev',

  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});