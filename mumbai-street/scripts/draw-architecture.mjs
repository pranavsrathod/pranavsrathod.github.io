import {createRequire} from 'node:module';
import {mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const draft = path.resolve(here, '..');
const require = createRequire(path.join(root, 'threejs-portfolio/package.json'));
const sharp = require('sharp');
const palette = {paper:'#f5f3ed', ink:'#142d3d', muted:'#5b686c', teal:'#087d80', line:'#cad2ce'};
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text = (x,y,lines,{size=24,fill=palette.ink,weight=400,family='Arial, sans-serif',gap=size*1.25,anchor='start'}={}) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${[].concat(lines).map((line,i)=>`<tspan x="${x}" dy="${i ? gap : 0}">${escape(line)}</tspan>`).join('')}</text>`;
const rule = (y,width,pad) => `<path d="M${pad} ${y}H${width-pad}" stroke="${palette.line}" stroke-width="2"/>`;
const arrow = (x1,y1,x2,y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${palette.teal}" stroke-width="2.5" fill="none" marker-end="url(#arrow)"/>`;
const svg = (width,height,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">Mumbai Street architecture: a 3D world and readable documents</title><desc id="desc">At build time, Blender sources and artwork become GLB models and textures. MDX and photos pass through Astro and Sharp to become static HTML, JSON and image variants. In the browser, URL and history coordinate Three.js scene controllers with native HTML readers and a same-origin projects iframe. Original or optional Pixel rendering affects the street; HTML remains crisp.</desc><defs><marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L7 4L1 7" fill="none" stroke="${palette.teal}" stroke-width="1.4"/></marker></defs><rect width="${width}" height="${height}" fill="${palette.paper}"/>${body}</svg>`;

const desktop = svg(1440,760, [
  text(64,37,'MUMBAI STREET / IMPLEMENTATION MAP',{size:18,fill:palette.teal,weight:700}),
  text(64,88,'A 3D street, readable documents.',{size:40,family:'Georgia, serif'}),
  rule(120,1440,64),
  text(64,164,'BUILD TIME',{size:18,fill:palette.teal,weight:700}),
  text(64,210,'Blender sources + artwork',{size:26,weight:700}),
  text(794,210,'MDX + photos',{size:26,weight:700}),
  arrow(82,225,82,243),
  arrow(812,225,812,243),
  text(112,258,'Export + asset preparation',{size:22,fill:palette.muted}),
  text(842,258,'Astro + Sharp',{size:22,fill:palette.muted}),
  arrow(82,270,82,288),
  arrow(812,270,812,288),
  text(64,320,'GLB models + textures',{size:26}),
  text(794,320,'Static HTML, JSON + image variants',{size:26}),
  rule(350,1440,64),
  text(64,391,'RUNTIME / BROWSER',{size:18,fill:palette.teal,weight:700}),
  text(64,440,'Three.js scene + controllers',{size:28,weight:700}),
  text(794,440,'Native HTML readers',{size:28,weight:700}),
  text(64,480,'Assets, camera + interaction state',{size:23,fill:palette.muted}),
  text(794,480,['Blog, contact + photo albums','Same-origin projects iframe'],{size:23,fill:palette.muted,gap:34}),
  `<path d="M340 504V548H1094V535" stroke="${palette.teal}" stroke-width="2.5" fill="none" marker-start="url(#arrow)" marker-end="url(#arrow)"/>`,
  `<rect x="527" y="527" width="374" height="43" fill="${palette.paper}"/>`,
  text(714,556,'URL + browser history',{size:25,fill:palette.teal,weight:700,anchor:'middle'}),
  text(714,592,'Coordinate entry, transitions and return views',{size:22,fill:palette.muted,anchor:'middle'}),
  rule(624,1440,64),
  text(64,665,'Street rendering',{size:20,fill:palette.muted}),
  text(64,702,'Original or optional Pixel',{size:25,weight:700}),
  text(794,665,'Document interface',{size:20,fill:palette.muted}),
  text(794,702,'Crisp text + native controls',{size:25,weight:700}),
].join(''));

const mobile = svg(720,1120, [
  text(48,54,'MUMBAI STREET',{size:32,fill:palette.teal,weight:700}),
  text(48,111,'A street you can read.',{size:46,family:'Georgia, serif'}),
  rule(148,720,48),
  text(48,197,'BUILD TIME',{size:32,fill:palette.teal,weight:700}),
  text(48,263,['Blender sources','+ artwork'],{size:32,weight:700,gap:41}),
  text(386,263,'MDX + photos',{size:32,weight:700}),
  arrow(65,328,65,360),
  arrow(403,282,403,312),
  text(386,355,'Astro + Sharp',{size:32,fill:palette.muted}),
  arrow(403,374,403,405),
  text(48,407,['GLB models','+ textures'],{size:32,gap:43}),
  text(386,450,['HTML + JSON','Image variants'],{size:32,gap:43}),
  rule(532,720,48),
  text(48,585,'RUNTIME / BROWSER',{size:32,fill:palette.teal,weight:700}),
  text(48,653,'Three.js',{size:36,weight:700}),
  text(386,653,'Native HTML',{size:36,weight:700}),
  text(48,699,['Scene +','controllers'],{size:32,gap:42}),
  text(386,699,['Readers +','same-origin','project iframe'],{size:32,gap:42}),
  `<path d="M177 765V818H529V805" stroke="${palette.teal}" stroke-width="3" fill="none" marker-start="url(#arrow)" marker-end="url(#arrow)"/>`,
  text(360,864,'URL + browser history',{size:32,fill:palette.teal,weight:700,anchor:'middle'}),
  text(360,907,'Entry, transitions + return views',{size:32,fill:palette.muted,anchor:'middle'}),
  rule(940,720,48),
  text(48,986,'Rendering',{size:32,fill:palette.muted}),
  text(386,986,'HTML interface',{size:32,fill:palette.muted}),
  text(48,1030,['Original or','optional Pixel'],{size:32,gap:43}),
  text(386,1030,['Crisp text +','native controls'],{size:32,gap:43}),
].join(''));

const diagramDir = path.join(draft,'sources/diagrams');
const imageDir = path.join(draft,'public/ProjectPhotos/mumbai-street');
await Promise.all([mkdir(diagramDir,{recursive:true}),mkdir(imageDir,{recursive:true})]);
for (const [name,source] of [['architecture',desktop],['architecture-mobile',mobile]]) {
  const svgFile = path.join(diagramDir,`${name}.svg`);
  const imageFile = path.join(imageDir,`${name}.webp`);
  await writeFile(svgFile,source+'\n');
  await sharp(Buffer.from(source)).webp({quality:88,effort:6}).toFile(imageFile);
  const meta = await sharp(imageFile).metadata();
  console.log(`${name}: ${meta.width}×${meta.height}; editable SVG ${Buffer.byteLength(source)} bytes`);
}
