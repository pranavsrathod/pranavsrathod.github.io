import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const draft = path.resolve(here, '..');
const root = path.resolve(here, '../../..');
const require = createRequire(path.join(root, 'threejs-portfolio/package.json'));
const sharp = require('sharp');
const assets = path.join(draft, 'public/BlogPhotos/mumbai-story');
const captures = path.join(draft, 'sources/captures');
const generated = path.join(draft, 'sources/generated');
await fs.mkdir(assets, {recursive:true});
await fs.mkdir(generated, {recursive:true});

const svg = value => Buffer.from(value);
const font = 'Arial, Helvetica, sans-serif';
const ink = '#183c3c', paper = '#f3efe5', accent = '#ae4936';

async function webp(source, name, width) {
  await sharp(source).rotate().resize({width,withoutEnlargement:true}).webp({quality:87}).toFile(path.join(assets,name));
}
await webp(path.join(captures,'street-now-pixel.jpg'),'street-now.webp',1440);
await webp(path.join(root,'Newspaper/NewsPaper.png'),'newspaper.webp',1000);
await webp(path.join(captures,'street-early-original.jpg'),'street-early.webp',1440);

// Source models remain unchanged. This is a labeled layout of their saved renders.
const placeSources = [
  ['WadaPav/Stall/preview-three-quarter.png','CONTACT','Wada pav stall'],
  ['ChaiCodeChronicle/preview-three-quarter.png','WRITING','Chai & Code Chronicle'],
  ['ProjectsGarage/preview-three-quarter.png','PROJECTS','The garage studio']
];
const placeLayers=[];
for (let i=0;i<placeSources.length;i++) {
  const [source,section,label]=placeSources[i];
  const buffer=await sharp(path.join(root,source)).resize(474,520,{fit:'contain',background:paper}).png().toBuffer();
  placeLayers.push({input:buffer,left:13+i*500,top:16});
  placeLayers.push({input:svg(`<svg width="500" height="110" xmlns="http://www.w3.org/2000/svg"><text x="250" y="27" text-anchor="middle" font-family="${font}" font-size="17" letter-spacing="3" fill="${accent}">${section}</text><text x="250" y="64" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="${ink}">${label.replaceAll('&','&amp;')}</text></svg>`),left:i*500,top:548});
}
await sharp({create:{width:1500,height:670,channels:3,background:paper}}).composite(placeLayers).webp({quality:88}).toFile(path.join(assets,'places.webp'));

const handoff=`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200" role="img" aria-labelledby="title desc">
<title id="title">From a vague request to a reviewable handoff</title><desc id="desc">Define what changes, preserve what works, get specialist reviews, assign one implementer, and inspect the result in the street before accepting it.</desc>
<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="${accent}"/></marker></defs>
<rect width="800" height="1200" fill="${paper}"/>
<g font-family="${font}" fill="${ink}">
<text x="48" y="49" font-size="23" letter-spacing="3" fill="${accent}">A BETTER HANDOFF</text>
<text x="48" y="108" font-family="Georgia,serif" font-size="46">Put the biscuits down.</text>
<rect x="48" y="142" width="704" height="244" rx="6" fill="#fffdf6" stroke="#ccc8b8"/>
<text x="72" y="190" font-size="29" font-weight="700">Change</text>
<text x="72" y="233" font-size="32">Ground biscuit stacks. Clear the jars.</text>
<line x1="72" y1="257" x2="728" y2="257" stroke="#ddd6c6"/>
<text x="72" y="303" font-size="29" font-weight="700">Preserve</text>
<text x="72" y="346" font-size="32">Stall, newspapers, signs, jar positions.</text>
<path d="M400 387V430" fill="none" stroke="${accent}" stroke-width="2" marker-end="url(#arrow)"/>
<text x="48" y="470" font-size="24" letter-spacing="2" fill="${accent}">SPECIALIST REVIEWS</text>
<rect x="48" y="495" width="704" height="86" rx="5" fill="#e2e9df"/>
<text x="72" y="531" font-size="32" font-weight="700">Architect</text>
<text x="72" y="565" font-size="29">Proportions &amp; placement</text>
<rect x="48" y="592" width="704" height="86" rx="5" fill="#e2e9df"/>
<text x="72" y="628" font-size="32" font-weight="700">Set designer</text>
<text x="72" y="662" font-size="29">Props &amp; physical logic</text>
<rect x="48" y="689" width="704" height="86" rx="5" fill="#e2e9df"/>
<text x="72" y="725" font-size="32" font-weight="700">Blender technician</text>
<text x="72" y="759" font-size="29">Geometry, textures &amp; export</text>
<path d="M400 776V815" fill="none" stroke="${accent}" stroke-width="2" marker-end="url(#arrow)"/>
<rect x="48" y="832" width="704" height="108" rx="5" fill="${ink}"/>
<text x="400" y="876" text-anchor="middle" font-size="33" font-weight="700" fill="${paper}">One combined brief.</text>
<text x="400" y="919" text-anchor="middle" font-size="33" fill="${paper}">One implementer.</text>
<path d="M400 941V983" fill="none" stroke="${accent}" stroke-width="2" marker-end="url(#arrow)"/>
<text x="400" y="1032" text-anchor="middle" font-size="32" font-weight="700">Render both views. Check the export.</text>
<text x="400" y="1077" text-anchor="middle" font-size="32">Review it in the street.</text>
<text x="400" y="1153" text-anchor="middle" font-size="24" fill="#62685e">Based on the chai stall revision brief.</text>
</g></svg>`;
await fs.writeFile(path.join(generated,'handoff.svg'),handoff);
await sharp(svg(handoff)).png().toFile(path.join(assets,'handoff.png'));

// Pair a current browser-rendered card with frames from the actual walking atlas.
const layers=[];
const card=await sharp(path.join(captures,'friend-card-original.jpg')).resize({height:730}).png().toBuffer();
await webp(path.join(captures,'friend-card-original.jpg'),'friend-card-mobile.webp',464);
layers.push({input:card,left:855,top:85});
const atlas=path.join(root,'threejs-portfolio/public/characters/payal-walk.png');
const walk=JSON.parse(await fs.readFile(path.join(root,'threejs-portfolio/public/characters/payal-walk.json'),'utf8'));
for (const [i,frameIndex] of [0,2,4].entries()) {
  const f=walk.frames[frameIndex];
  const sprite=await sharp(atlas).extract({left:f.x,top:f.y,width:f.width,height:f.height}).trim().resize({height:330,kernel:'nearest'}).png().toBuffer();
  const meta=await sharp(sprite).metadata();
  layers.push({input:sprite,left:65+i*235+Math.round((210-meta.width)/2),top:340});
}
layers.push({input:svg(`<svg width="1440" height="900" xmlns="http://www.w3.org/2000/svg"><g fill="${ink}"><text x="70" y="105" font-family="${font}" font-size="18" letter-spacing="3" fill="${accent}">A STREET NEEDS PEOPLE</text><text x="70" y="176" font-family="Georgia,serif" font-size="48">A familiar face.</text><text x="70" y="234" font-family="Georgia,serif" font-size="48">A few favorite things.</text><text x="70" y="748" font-family="${font}" font-size="18" letter-spacing="2">FRAMES FROM PAYAL’S WALKING SPRITE</text><text x="855" y="855" font-family="${font}" font-size="18" letter-spacing="2">HER COLLECTIBLE CARD</text></g></svg>`),left:0,top:0});
await sharp({create:{width:1440,height:900,channels:3,background:paper}}).composite(layers).webp({quality:89}).toFile(path.join(assets,'friend-card.webp'));

// Preserve distinct checkpoints; do not interpolate or invent development states.
const stages = [
  {source:path.join(captures,'street-early-original.jpg'),name:'01-early',label:'01  /  THE EARLY STREET',note:'September 11 source · reconstructed October 17 · commit 831726c'},
  {source:path.join(root,'threejs-portfolio/docs/backdrop-v3/integrated-before-front.jpg'),name:'02-v2',label:'02  /  ROOFTOP STORIES',note:'V2 backdrop · saved browser review capture · October 13'},
  {source:path.join(root,'threejs-portfolio/docs/backdrop-v3/integrated-after-front.jpg'),name:'03-v3',label:'03  /  THE CITY GROWS',note:'V3 backdrop · saved browser review capture · October 13'},
  {source:path.join(root,'threejs-portfolio/docs/backdrop-v3-1/previews/front-desktop.jpg'),name:'04-v3-1',label:'04  /  PARK, PROMENADE, SEA',note:'V3.1 backdrop · saved browser review capture · October 15'},
  {source:path.join(captures,'street-now-pixel.jpg'),name:'05-now',label:'05  /  A STREET WITH FRIENDS',note:'Current local build · captured October 17, 2026 · pixel presentation'}
];
const frames=path.join(generated,'evolution');await fs.mkdir(frames,{recursive:true});
for (const stage of stages) {
  const scene=await sharp(stage.source).resize(1280,704,{fit:'contain',background:paper}).png().toBuffer();
  const caption=svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="96"><rect width="1280" height="96" fill="${ink}"/><text x="32" y="37" font-family="${font}" font-size="23" letter-spacing="2" fill="${paper}">${stage.label}</text><text x="32" y="71" font-family="${font}" font-size="19" fill="#d8ddd0">${stage.note}</text></svg>`);
  await sharp({create:{width:1280,height:800,channels:3,background:paper}}).composite([{input:scene,left:0,top:0},{input:caption,left:0,top:704}]).png().toFile(path.join(frames,stage.name+'.png'));
}
await webp(path.join(frames,'05-now.png'),'evolution-poster.webp',1280);
const list=stages.map(stage=>`file '${path.join(frames,stage.name+'.png')}'\nduration 2.8`).join('\n')+`\nfile '${path.join(frames,stages.at(-1).name+'.png')}'\n`;
await fs.writeFile(path.join(generated,'evolution.ffconcat'),list);
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',path.join(generated,'evolution.ffconcat'),'-vf','fps=12','-t','14','-c:v','libx264','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart','-an',path.join(assets,'street-evolution.mp4')]);
// Low frame count keeps a real GIF practical; the controlled MP4 is the default embed.
await sharp(path.join(frames,'01-early.png')).resize(960,600).png().toFile(path.join(generated,'gif-first.png'));
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',path.join(generated,'evolution.ffconcat'),'-vf','fps=2,scale=960:600:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=192:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3','-t','14','-loop','0',path.join(assets,'street-evolution.gif')]);

const originalTest=path.join(root,'Newspaper/NewspaperCrumpling-10001-0050.mp4');
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',originalTest,'-vf','scale=1280:-2','-c:v','libx264','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart','-an',path.join(assets,'newspaper-test.mp4')]);
const testPoster=execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-i',originalTest,'-frames:v','1','-f','image2pipe','-vcodec','png','pipe:1'],{maxBuffer:20*1024*1024});
await sharp(testPoster).resize(1280,720).webp({quality:86}).toFile(path.join(assets,'newspaper-test-poster.webp'));

console.log('Prepared model renders, workflow, friend card, and five honest evolution checkpoints.');
