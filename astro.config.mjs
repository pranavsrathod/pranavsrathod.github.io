import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// https://astro.build/config
export default defineConfig({
    site: 'https://pranavrathod.com',
    markdown: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
    },
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [
        mdx({
            experimental: {
                contentCollections: true,
            },
        }),
        sitemap(),
    ],
});
