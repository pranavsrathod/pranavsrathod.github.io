import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const draft=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const root=path.resolve(draft,'../..');
const require=createRequire(path.join(root,'threejs-portfolio/package.json'));
const sharp=require('sharp');
const source=path.join(draft,'sources/wrapper-history');
const output=path.join(draft,'public/ProjectPhotos/mumbai-street/wrapper-history');
const blogOutput=path.join(root,'blog-draft/mumbai-story/public/BlogPhotos/mumbai-story/wrapper-history');
const work=await fs.mkdtemp(path.join(os.tmpdir(),'wrapper-history-media-'));
await fs.mkdir(output,{recursive:true});await fs.mkdir(blogOutput,{recursive:true});
const stages=[['corners','19 SEP 2026','Raised margins'],['panels','30 SEP 2026','Four separate flaps'],['bloom','11 OCT 2026','One continuous sheet'],['parcel','15 OCT 2026','A covered parcel'],['baked','25 OCT 2026','Blender-authored folds']];
const order=[...Array(13).fill(0),...Array.from({length:24},(_,i)=>i+1),...Array(11).fill(24)];
const hashes=[];const montage=[];let combinedIndex=0;
for(const [id,date,label] of stages){
 const folder=path.join(work,id);await fs.mkdir(folder);
 for(let pose=0;pose<25;pose++){
  const file=path.join(source,'captures',id,String(pose).padStart(2,'0')+'.jpg');
  const bytes=await fs.readFile(file),meta=await sharp(bytes).metadata();
  if(meta.width!==960||meta.height!==600)throw new Error('Wrong capture dimensions: '+file);
  hashes.push({stage:id,pose,sha256:createHash('sha256').update(bytes).digest('hex')});
 }
 for(const pose of [0,12,24])montage.push({input:await sharp(path.join(source,'captures',id,String(pose).padStart(2,'0')+'.jpg')).resize(320,200).toBuffer(),left:stages.findIndex(s=>s[0]===id)*320,top:[0,12,24].indexOf(pose)*200});
 for(let frame=0;frame<order.length;frame++){
  const capture=path.join(source,'captures',id,String(order[frame]).padStart(2,'0')+'.jpg');
  await fs.copyFile(capture,path.join(folder,String(frame).padStart(3,'0')+'.jpg'));
  const note=id==='baked'?'LOCAL OCTOBER 25 EXPORT · NOT DEPLOYED':'SAVED SOURCE RE-RENDER · NORMALIZED MOTION';
  const labelSvg=Buffer.from(`<svg width="960" height="80" xmlns="http://www.w3.org/2000/svg"><rect width="960" height="80" fill="#142927"/><text x="28" y="30" font-family="Arial,sans-serif" font-size="21" fill="#f5e5c4">${date}  /  ${label}</text><text x="28" y="57" font-family="Arial,sans-serif" font-size="12" letter-spacing="1" fill="#a9c3b6">${note} · COMMON CAMERA, FOOD &amp; ARTWORK</text></svg>`);
  await sharp(capture).extend({bottom:80,background:'#142927'}).composite([{input:labelSvg,top:600,left:0}]).png().toFile(path.join(work,'cycle-'+String(combinedIndex++).padStart(3,'0')+'.png'));
 }
 execFileSync('/usr/local/bin/ffmpeg',['-y','-loglevel','error','-framerate','12','-i',path.join(folder,'%03d.jpg'),'-c:v','libx264','-crf','20','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',path.join(output,id+'.mp4')]);
 const posterPose=id==='baked'?16:0;
 await sharp(path.join(source,'captures',id,String(posterPose).padStart(2,'0')+'.jpg')).webp({quality:88}).toFile(path.join(output,id+'.webp'));
}
await sharp({create:{width:1600,height:600,channels:3,background:'#142927'}}).composite(montage).webp({quality:88}).toFile(path.join(source,'contact-sheet.webp'));
execFileSync('/usr/local/bin/ffmpeg',['-y','-loglevel','error','-framerate','12','-i',path.join(work,'cycle-%03d.png'),'-c:v','libx264','-crf','20','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',path.join(output,'wrapper-evolution.mp4')]);
execFileSync('/usr/local/bin/ffmpeg',['-y','-loglevel','error','-framerate','12','-i',path.join(work,'cycle-%03d.png'),'-vf','fps=8,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=3','-loop','0',path.join(output,'wrapper-evolution.gif')]);
for(const entry of await fs.readdir(output))await fs.copyFile(path.join(output,entry),path.join(blogOutput,entry));
await fs.writeFile(path.join(source,'capture-manifest.json'),JSON.stringify({capturedOn:'2026-10-25',method:'Browser UI stage buttons and Pose number input, each 0..24; CUA screenshot crop x0 y0 width960 height600. No scene retouching or interpolated frames.',comparison:'Fixed camera, current artwork and food. Procedural progress normalized to two seconds. Each four-second clip adds one-second endpoint holds. Current baked sequence retains the exported 12Hz schedule.',posterPoses:{corners:0,panels:0,bloom:0,parcel:0,baked:16},cycle:{seconds:20,gif:'720×510, 8fps, 128colors',mp4:'960×680, 12fps'},frames:hashes},null,2)+'\n');
console.log('Encoded five clips/posters, 20-second labeled MP4/GIF; mirrored assets into blog. Capture hashes and contact sheet saved.');
