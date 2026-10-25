import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const here=path.dirname(fileURLToPath(import.meta.url));
const draft=path.resolve(here,'..'),root=path.resolve(here,'../../..');
const sharp=createRequire(path.join(root,'threejs-portfolio/package.json'))('sharp');
const out=path.join(draft,'public/ProjectPhotos/mumbai-street');
await fs.mkdir(out,{recursive:true});
const captures=path.join(root,'blog-draft/mumbai-story/sources/captures');
const hero=path.join(draft,'sources/captures/street-live-2026-10-24.jpg');
if(process.argv.includes('--hero-only')){
 await sharp(hero).webp({quality:90}).toFile(path.join(out,'street.webp'));
 console.log('Prepared the actual October 24 live-city capture.');
 process.exit(0);
}
await fs.mkdir(path.join(out,'evidence'),{recursive:true});
for(const name of ['biscuit-preservation.json','biscuit-glb-roundtrip.json']){
 await fs.copyFile(path.join(draft,'sources/evidence',name),path.join(out,'evidence',name));
}
// Reuse saved October 19 inspection poses, not recreated historical states.
// These JPEGs already contain the same 800×425 crop; do not crop or resize again.
// Stage names/progress follow the actual contact-paper-preview.html buttons.
const paperPoses=[
 {output:'paper-closed.webp',source:'workflow-paper-00.jpg',label:'Wrapped',progress:0},
 {output:'paper-quarter.webp',source:'workflow-paper-01.jpg',label:'Loosen',progress:.22},
 {output:'paper-half.webp',source:'workflow-paper-02.jpg',label:'Spread',progress:.45},
 {output:'paper-three-quarter.webp',source:'workflow-paper-03.jpg',label:'Settle',progress:.70},
 {output:'paper-open.webp',source:'workflow-paper-04.jpg',label:'Flat',progress:1},
];
for(const {output,source,label,progress} of paperPoses){
 await sharp(path.join(captures,source)).webp({lossless:true,effort:6}).toFile(path.join(out,output));
 console.log(`${output}: ${label} (${Math.round(progress*100)}%), 800×425 saved inspection capture`);
}
for(const [output,source] of [['original.webp','street-now-original.jpg'],['pixel.webp','street-now-pixel.jpg']]){
 await sharp(path.join(captures,source)).webp({lossless:true,effort:6}).toFile(path.join(out,output));
}
// The native widgets can be refreshed without regenerating legacy composites.
if(!process.argv.includes('--native-media-only')){
await sharp(hero).webp({quality:90}).toFile(path.join(out,'street.webp'));
await sharp(path.join(root,'ChaiCodeChronicle/preview-biscuit-detail.png')).resize({width:1000}).webp({quality:88}).toFile(path.join(out,'biscuit-detail.webp'));
const stages=[['Original rendering','street-now-original.jpg'],['Pixel rendering','street-now-pixel.jpg']];
const label=(text,width,height)=>Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#f5f3ed"/><text x="25" y="45" fill="#142d3d" font-family="Arial,sans-serif" font-size="30">${text}</text></svg>`);
const desktop=[],mobile=[];
for(let i=0;i<stages.length;i++){
 const [title,file]=stages[i];
 const image=await sharp(path.join(captures,file)).resize(690,432,{fit:'contain',background:'#f5f3ed'}).png().toBuffer();
 desktop.push({input:label(title,690,75),left:15+i*720,top:10},{input:image,left:15+i*720,top:85});
 mobile.push({input:label(title,690,75),left:15,top:i*525},{input:image,left:15,top:i*525+75});
}
await sharp({create:{width:1440,height:540,channels:3,background:'#f5f3ed'}}).composite(desktop).webp({quality:90}).toFile(path.join(out,'rendering.webp'));
await sharp({create:{width:720,height:1050,channels:3,background:'#f5f3ed'}}).composite(mobile).webp({quality:90}).toFile(path.join(out,'rendering-mobile.webp'));
}
console.log('Prepared saved paper poses and separate rendering modes; lossless WebP preserves decoded JPEG pixels.');
