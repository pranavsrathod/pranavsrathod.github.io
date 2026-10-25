import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const here=path.dirname(fileURLToPath(import.meta.url));
const draft=path.resolve(here,'..');
const root=path.resolve(here,'../../..');
const fixture=await fs.mkdtemp(path.join(os.tmpdir(),'mumbai-story-astro-'));
await fs.mkdir(path.join(fixture,'src/pages'),{recursive:true});
await fs.symlink(path.join(root,'threejs-portfolio/project-display/node_modules'),path.join(fixture,'node_modules'),'dir');
await fs.writeFile(path.join(fixture,'package.json'),JSON.stringify({name:'mumbai-story-preview',private:true,type:'module'}));
await fs.writeFile(path.join(fixture,'astro.config.mjs'),`import {defineConfig} from 'astro/config';\nimport mdx from '@astrojs/mdx';\nexport default defineConfig({outDir:'./dist',integrations:[mdx()]});\n`);
const article=path.join(draft,'two-wada-pavs.mdx');
// The Markdown export keeps the same prose, with a script-free workflow fallback.
let plain=await fs.readFile(article,'utf8');
plain=plain.replace(/import WorkflowNotebook[^\n]+\n/,'');
const fallback=`<figure>
  <img src="/BlogPhotos/mumbai-story/handoff.png" alt="The handoff loop: a bounded brief, specialist reviews, one implementer, and a visual and technical check." width="800" height="1200" loading="lazy" style="width:100%;max-height:760px;object-fit:contain;" />
  <figcaption>Three review perspectives. One scene writer. The creative judgment comes back around.</figcaption>
</figure>
<details><summary>The newspaper had other plans</summary><p>Corner curls made a boat; separate panels made a box. The revised brief called for one continuous sheet that hides the pavs, spreads unevenly, and settles flat. Five browser inspection poses made the in-between motion visible. The result is art-directed, not simulated cloth.</p></details>
<details><summary>The garage identity crisis</summary><p>The cleaner studio looked like a room behind a shutter. Keeping the facade, footprint, and monitor while restoring workshop supports, conduit, tools, and headphones brought its character back. The final check included the actual camera journey.</p></details>
<details><summary>Biscuits versus gravity</summary><p>Ground golden biscuit stacks on the jar bases, leave headspace, clarify the glass, and preserve the stall. Review both views, export, validate, and stop when that named change is complete.</p></details>`;
plain=plain.replace('<WorkflowNotebook />',fallback);
await fs.writeFile(path.join(draft,'two-wada-pavs.md'),plain);
const css=path.join(here,'preview.css');
const page=`---
import Content,{frontmatter} from ${JSON.stringify(article)};
import fs from 'node:fs';
const css=fs.readFileSync(${JSON.stringify(css)},'utf8');
---
<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="robots" content="noindex,nofollow"/><title>{frontmatter.title} — Draft</title><meta name="description" content={frontmatter.excerpt}/><style is:inline set:html={css}></style></head>
<body>
<div class="masthead"><div><strong>Chai &amp; Code Chronicle</strong><br/>Notes from the neighborhood</div><div><span>Unpublished draft</span><br/>Pranav Rathod · Revised 19 October 2026</div></div>
<header class="story-header"><p class="eyebrow">Creativity / Mumbai / Working with AI</p><h1>{frontmatter.title}</h1><p class="dek">{frontmatter.excerpt}</p><nav class="act-nav" aria-label="The three acts"><a href="#act-i-naturally-i-bought-two">I · The spark</a><a href="#act-ii-the-five-hour-waiting-room">II · The waiting room</a><a href="#act-iii-a-street-needs-people">III · The neighborhood</a></nav></header>
<main><article class="article"><Content/></article></main>
<footer><span>A personal story in three acts. Prepared for Astro.</span><span><a href="./two-wada-pavs.mdx">MDX source</a> · <a href="./two-wada-pavs.md">Plain Markdown</a> · <a href="./public/BlogPhotos/mumbai-story/street-evolution.gif">Evolution GIF</a></span></footer>
</body></html>`;
await fs.writeFile(path.join(fixture,'src/pages/index.astro'),page);
const binary=path.join(root,'threejs-portfolio/project-display/node_modules/astro/astro.js');
execFileSync(process.execPath,[binary,'build','--root',fixture],{cwd:fixture,stdio:'inherit',env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'}});
let html=await fs.readFile(path.join(fixture,'dist/index.html'),'utf8');
html=html.replaceAll('"/BlogPhotos/','"./public/BlogPhotos/');
await fs.writeFile(path.join(draft,'preview.html'),html);
console.log('Compiled the real MDX with Astro, exported the plain Markdown fallback, and wrote preview.html.');
