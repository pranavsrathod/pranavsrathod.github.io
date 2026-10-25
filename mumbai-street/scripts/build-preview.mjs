import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';

// The Website checkout stays read-only. Compile its native ProjectLayout,
// components, theme, collection schema, and math setup in an isolated copy.
// --check validates there without replacing draft deliverables.
const here=path.dirname(fileURLToPath(import.meta.url));
const draft=path.resolve(here,'..');
const website=process.env.MUMBAI_PREVIEW_WEBSITE||path.join(os.homedir(),'Desktop','Website');
const checkOnly=process.argv.includes('--check');
const keepFixture=process.argv.includes('--keep-fixture');
const require=createRequire(path.join(website,'package.json'));
const parse5=require('parse5');
const source=await fs.readFile(path.join(draft,'mumbai-street.mdx'),'utf8');
const frontmatter=source.match(/^---\s*\n[\s\S]*?\n---\s*\n/)?.[0];
if(!frontmatter)throw new Error('The MDX needs complete YAML frontmatter.');
// Canonicalize macOS /var → /private/var so Astro style-module cache keys agree.
const fixture=await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(),'mumbai-native-project-')));

async function copyIfPresent(from,to){
  try{await fs.access(from);}catch{return;}
  await fs.mkdir(path.dirname(to),{recursive:true});
  await fs.cp(from,to,{recursive:true});
}

async function localizeBuiltAssets(directory){
  for(const entry of await fs.readdir(directory,{withFileTypes:true})){
    const file=path.join(directory,entry.name);
    if(entry.isDirectory())await localizeBuiltAssets(file);
    else if(/\.(css|js)$/.test(entry.name)){
      const original=await fs.readFile(file,'utf8');
      // CSS font URLs are emitted at /_astro even when the HTML is localized.
      // All hashed dependencies live beside these emitted CSS/JS files.
      const localized=original.replaceAll('/_astro/','./');
      if(localized!==original)await fs.writeFile(file,localized);
    }
  }
}

// Export rendered article content rather than leaking MDX imports/data exports.
// Native filmstrip and comparison data expands into readable static sections.
const attrs=node=>Object.fromEntries((node.attrs||[]).map(({name,value})=>[name,value]));
const children=node=>node.childNodes||[];
const textContent=node=>node.nodeName==='#text'?node.value:children(node).map(textContent).join('');
const hasClass=(node,name)=>(attrs(node).class||'').split(/\s+/).includes(name);
const find=(node,predicate)=>predicate(node)?node:children(node).map(child=>find(child,predicate)).find(Boolean);
const findAll=(node,predicate)=>[...(predicate(node)?[node]:[]),...children(node).flatMap(child=>findAll(child,predicate))];
const tidy=value=>value.replace(/[ \t]+\n/g,'\n').replace(/\n[ \t]+/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
const inline=value=>value.replace(/\s+/g,' ').trim();
const image=(src,alt='')=>`![${alt.replaceAll(']','\\]')}](${src})`;

function filmstripMarkdown(node){
  const data=find(node,child=>Boolean(attrs(child)['data-rolls']));
  const rolls=JSON.parse(attrs(data)['data-rolls']);
  return rolls.map(roll=>`\n\n### ${roll.label}\n\n`+roll.frames.map(frame=>
    `#### ${frame.title}\n\n${image(frame.image.src,frame.image.alt)}\n\n${frame.caption}\n\n${frame.desc}`+
    (frame.formula?`\n\n\`${frame.formula.replaceAll('`','')}\``:'')+
    (frame.note?`\n\n${frame.note}`:'')
  ).join('\n\n')).join('\n\n')+'\n\n';
}

function compareMarkdown(node){
  const data=find(node,child=>Boolean(attrs(child)['data-scenes']));
  const scenes=JSON.parse(attrs(data)['data-scenes']);
  const heading=children(node).find(child=>child.tagName==='div');
  return '\n\n'+(heading?inline(textContent(heading))+'\n\n':'')+scenes.map(scene=>
    `### ${scene.label}\n\n${image(scene.before.src,scene.before.alt)}\n\n${image(scene.after.src,scene.after.alt)}`
  ).join('\n\n')+'\n\n';
}

function markdown(node){
  const a=attrs(node),tag=node.tagName;
  if(node.nodeName==='#text')return node.value.replace(/\s+/g,' ');
  if(a['aria-hidden']==='true')return '';
  if(node.nodeName==='#comment'||['style','script','svg','noscript','button'].includes(tag))return '';
  if(a.id==='camera-ownership-demo')return '\n\n### One camera. The newest request.\n\nExplanatory model of the route-token check:\n\n1. Request Projects (token 1), then Contact (token 2), before releases resolve.\n2. When awaited releases finish, Projects is stale and stops.\n3. Contact is current and acquires the camera.\n\nThe actual controllers also stop obsolete transitions and manage camera/input ownership. This diagram is not live application telemetry.\n\n';
  if(hasClass(node,'case-actions')||hasClass(node,'hp-links'))return '\n\n'+children(node).map(markdown).filter(value=>value.trim()).join('\n\n')+'\n\n';
  if(hasClass(node,'case-index'))return '\n\n'+children(node).filter(child=>child.tagName==='a').map(link=>{
    const parts=children(link).filter(child=>child.tagName).map(child=>inline(textContent(child)));
    return '- ['+parts.slice(0,2).join(' — ')+']('+attrs(link).href+'): '+(parts[2]||'');
  }).join('\n')+'\n\n';
  if(a.id?.startsWith('filmstrip-')&&find(node,child=>Boolean(attrs(child)['data-rolls'])))return filmstripMarkdown(node);
  if(a.id?.startsWith('compare-')&&find(node,child=>Boolean(attrs(child)['data-scenes'])))return compareMarkdown(node);
  if(a.id?.startsWith('toggle-')){
    const labels=findAll(node,child=>attrs(child).role==='tab').map(textContent);
    return children(node).filter(child=>attrs(child)['data-panel']!==undefined).map(panel=>
      `\n\n### ${labels[Number(attrs(panel)['data-panel'])]||'View'}\n\n${children(panel).map(markdown).join('')}`
    ).join('\n\n');
  }
  if(hasClass(node,'katex-display')){
    const tex=find(node,child=>child.tagName==='annotation'&&attrs(child).encoding==='application/x-tex');
    return tex?`\n\n$$\n${textContent(tex)}\n$$\n\n`:'';
  }
  if(hasClass(node,'katex')){
    const tex=find(node,child=>child.tagName==='annotation'&&attrs(child).encoding==='application/x-tex');
    return tex?`$${textContent(tex)}$`:'';
  }
  if(tag==='pre'){
    const code=find(node,child=>child.tagName==='code');
    const language=(attrs(code||node).class||'').match(/language-([^\s]+)/)?.[1]||'';
    return `\n\n\`\`\`${language}\n${textContent(code||node).trimEnd()}\n\`\`\`\n\n`;
  }
  if(tag==='table'){
    const rows=findAll(node,child=>child.tagName==='tr').map(row=>children(row).filter(child=>['th','td'].includes(child.tagName)).map(cell=>inline(children(cell).map(markdown).join('')).replaceAll('|','\\|')));
    if(!rows.length)return '';
    const width=Math.max(...rows.map(row=>row.length));
    const line=row=>'| '+Array.from({length:width},(_,i)=>row[i]||'').join(' | ')+' |';
    return '\n\n'+[line(rows[0]),line(Array(width).fill('---')),...rows.slice(1).map(line)].join('\n')+'\n\n';
  }
  if(tag==='video'){
    const src=a.src||attrs(find(node,child=>child.tagName==='source')||{}).src;
    return '\n\n'+(a.poster?image(a.poster,a.title||a['aria-label']||'Video preview')+'\n\n':'')+(src?`[Watch video](${src})`:'')+'\n\n';
  }
  if(tag==='picture')return markdown(find(node,child=>child.tagName==='img')||{});
  if(tag==='source')return '';
  if(tag==='img')return '\n\n'+image(a.src||'',a.alt||'')+'\n\n';
  if(tag==='iframe')return a.src?`\n\n[${a.title||'Open demonstration'}](${a.src})\n\n`:'';
  const value=children(node).map(markdown).join('');
  if(/^h[1-6]$/.test(tag||''))return `\n\n${'#'.repeat(Number(tag[1]))} ${inline(value)}\n\n`;
  if(tag==='a')return a.href?`[${inline(value)}](${a.href})`:value;
  if(tag==='strong'||tag==='b')return `**${value.trim()}**`;
  if(tag==='em'||tag==='i')return `*${value.trim()}*`;
  if(tag==='code')return '`'+value.trim()+'`';
  if(tag==='br')return '\n';
  if(tag==='hr')return '\n\n---\n\n';
  if(tag==='li')return '\n- '+tidy(value).replaceAll('\n','\n  ')+'\n';
  if(tag==='dt')return '\n\n**'+inline(value)+'**\n';
  if(tag==='dd')return tidy(value)+'\n\n';
  if(tag==='blockquote'||hasClass(node,'callout'))return '\n\n'+tidy(value).split('\n').map(line=>'> '+line).join('\n')+'\n\n';
  if(tag==='summary')return '\n\n**'+inline(children(node).map(markdown).join(' '))+'**\n\n';
  if(['p','figure','figcaption','section','aside','header','footer','details','div','ul','ol','dl'].includes(tag))return '\n\n'+value+'\n\n';
  return value;
}

try{
  await fs.mkdir(path.join(fixture,'src/pages'),{recursive:true});
  for(const name of ['projects','blog','pages'])await fs.mkdir(path.join(fixture,'src/content',name),{recursive:true});
  for(const dir of ['components','layouts','styles','data','utils','icons']){
    await fs.cp(path.join(website,'src',dir),path.join(fixture,'src',dir),{recursive:true});
  }
  await fs.copyFile(path.join(website,'src/content.config.ts'),path.join(fixture,'src/content.config.ts'));
  await copyIfPresent(path.join(website,'tsconfig.json'),path.join(fixture,'tsconfig.json'));
  await fs.symlink(path.join(website,'node_modules'),path.join(fixture,'node_modules'),'dir');
  await fs.writeFile(path.join(fixture,'package.json'),JSON.stringify({name:'mumbai-native-project-preview',private:true,type:'module'}));
  let config=await fs.readFile(path.join(website,'astro.config.mjs'),'utf8');
  config=config.replace(/site:\s*['"][^'"]+['"]/,'site: "https://preview.invalid"');
  config=config.replace(/defineConfig\(\s*\{/,`defineConfig({ cacheDir: ${JSON.stringify(path.join(fixture,'.astro-cache'))},`);
  // Vite's default cache would follow the node_modules symlink back into the
  // read-only Website. Keep dependency optimization inside the temp fixture.
  config=config.replace(/vite:\s*\{/,`vite: { cacheDir: ${JSON.stringify(path.join(fixture,'.vite'))}, resolve: {preserveSymlinks: true},`);
  await fs.writeFile(path.join(fixture,'astro.config.mjs'),config);
  await fs.writeFile(path.join(fixture,'src/content/projects/mumbai-street.mdx'),source);
  await copyIfPresent(path.join(draft,'components'),path.join(fixture,'src/content/projects/components'));
  await fs.cp(path.join(draft,'public'),path.join(fixture,'public'),{recursive:true});
  for(const name of ['favicon.ico','favicon.svg','favicon-32.png','favicon-192.png','favicon-512.png','apple-touch-icon.png','logoPreview.png','Other']){
    await copyIfPresent(path.join(website,'public',name),path.join(fixture,'public',name));
  }
  const katex=path.dirname(require.resolve('katex/package.json'));
  await copyIfPresent(path.join(katex,'dist/katex.min.css'),path.join(fixture,'public/vendor/katex/katex.min.css'));
  await copyIfPresent(path.join(katex,'dist/fonts'),path.join(fixture,'public/vendor/katex/fonts'));

  const basePath=path.join(fixture,'src/layouts/BaseLayout.astro');
  let base=await fs.readFile(basePath,'utf8');
  base=base.replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/,'<!-- Analytics disabled in this isolated local preview. -->');
  base=base.replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/,'');
  base=base.replace(/<link\s+rel="stylesheet"\s+href="https:\/\/cdn\.jsdelivr\.net\/npm\/katex[^\"]+"\s*\/>/,'<link rel="stylesheet" href="/vendor/katex/katex.min.css" />');
  base=base.replace('<head>','<head>\n<meta name="robots" content="noindex,nofollow,noarchive" />');
  base=base.replace("script.dataset.dynamic = 'true';","script.dataset.dynamic = 'true';\n                    script.dataset.cat = '/Other/Oneko/oneko.png';");
  base=base.replace('<slot />','<aside class="not-prose mb-8 border-b border-dashed border-main/30 pb-3 text-xs text-muted">Private draft preview · Native Astro project layout · <a class="underline" href="./mumbai-street.mdx">MDX source</a> · <a class="underline" href="./mumbai-street.md">Markdown export</a> · <a class="underline" href="./evidence-map.md">Evidence map</a></aside>\n<slot />');
  if(/googletagmanager\.com|google-analytics\.com/.test(base))throw new Error('Preview analytics removal failed.');
  await fs.writeFile(basePath,base);
  await fs.writeFile(path.join(fixture,'src/pages/index.astro'),`---\nimport {getEntry} from 'astro:content';\nimport ProjectLayout from '../layouts/ProjectLayout.astro';\nconst project=await getEntry('projects','mumbai-street');\nif(!project)throw new Error('The project collection did not load the MDX.');\n---\n<ProjectLayout project={project} prevProject={null} nextProject={null} />\n`);
  execFileSync(process.execPath,[path.join(website,'node_modules/astro/astro.js'),'build','--root',fixture],{
    cwd:fixture,stdio:'inherit',env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'}
  });

  const rawHtml=await fs.readFile(path.join(fixture,'dist/index.html'),'utf8');
  if(/https?:\/\/(?:www\.)?(?:googletagmanager|google-analytics)\.com/.test(rawHtml))throw new Error('An analytics request remains in the preview.');
  if(/https:\/\/cdn\.jsdelivr\.net\/npm\/katex/.test(rawHtml))throw new Error('KaTeX CSS was not localized.');
  const parsed=parse5.parse(rawHtml);
  const article=find(parsed,node=>hasClass(node,'prose'));
  if(!article)throw new Error('Could not find ProjectLayout’s article body.');
  const displayMathPairs=(source.match(/^\$\$\s*$/gm)||[]).length/2;
  if(findAll(article,node=>hasClass(node,'katex-display')).length<displayMathPairs)throw new Error('Display math did not render through the native math setup.');
  for(const [component,predicate] of [
    ['Callout',node=>hasClass(node,'callout')],
    ['FilmstripViewer',node=>Boolean(attrs(node)['data-rolls'])],
    ['Compare',node=>Boolean(attrs(node)['data-scenes'])],
    ['ContactSheet',node=>attrs(node).id?.startsWith('contactsheet-')],
    ['TogglePanels',node=>attrs(node).id?.startsWith('toggle-')]
  ]){
    if(source.includes('<'+component)&&!find(article,predicate))throw new Error(`Native ${component} did not render.`);
  }
  const plain=frontmatter+'\n'+tidy(children(article).map(markdown).join(''))+'\n';
  if(/export const |import AgentWorkflow|<(FilmstripViewer|TogglePanels|ContactSheet|Callout)\b/.test(plain))throw new Error('The Markdown export contains unresolved MDX.');

  // URLs inside native component JSON also need rewriting for local controls.
  let html=rawHtml.replaceAll('/ProjectPhotos/','./public/ProjectPhotos/');
  html=html.replaceAll('/_astro/','./preview-assets/_astro/').replaceAll('/vendor/','./preview-assets/vendor/');
  html=html.replaceAll('/Other/','./preview-assets/native/Other/');
  html=html.replace(/(["'])\/(favicon[^"']*|apple-touch-icon\.png|logoPreview\.png)\1/g,'$1./preview-assets/native/$2$1');
  // Other site pages are outside this one-page fixture: keep native navigation
  // recognizable while sending those explicit clicks to the real portfolio.
  html=html.replace(/href="\/(?!\/)([^"#]*)"/g,(_,url)=>`href="https://pranavrathod.com/${url}"`);

  if(checkOnly){
    console.log(`Native layout, schema, math config, and Markdown export passed in ${fixture}.`);
    console.log(`Export preview: ${plain.length} characters. No draft deliverables replaced.`);
  }else{
    const output=path.join(draft,'preview-assets');
    await fs.rm(output,{recursive:true,force:true});
    await fs.mkdir(path.join(output,'native'),{recursive:true});
    await copyIfPresent(path.join(fixture,'dist/_astro'),path.join(output,'_astro'));
    await localizeBuiltAssets(path.join(output,'_astro'));
    await copyIfPresent(path.join(fixture,'dist/vendor'),path.join(output,'vendor'));
    for(const name of ['favicon.ico','favicon.svg','favicon-32.png','favicon-192.png','favicon-512.png','apple-touch-icon.png','logoPreview.png','Other']){
      await copyIfPresent(path.join(fixture,'dist',name),path.join(output,'native',name));
    }
    await fs.writeFile(path.join(draft,'mumbai-street.md'),plain);
    await fs.writeFile(path.join(draft,'preview.html'),html);
    console.log('Built preview.html through native Website ProjectLayout; exported rendered content to mumbai-street.md.');
  }
}finally{
  if(keepFixture)console.log(`Kept isolated fixture: ${fixture}`);
  else await fs.rm(fixture,{recursive:true,force:true});
}
