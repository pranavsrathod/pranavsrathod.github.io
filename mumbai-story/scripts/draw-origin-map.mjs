import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const here=path.dirname(fileURLToPath(import.meta.url));
const draft=path.resolve(here,'..');
const root=path.resolve(here,'../../..');
const sharp=createRequire(path.join(root,'threejs-portfolio/package.json'))('sharp');
const out=path.join(draft,'public/BlogPhotos/mumbai-story');
const generated=path.join(draft,'sources/generated');
const wrap=(w,h,content)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#f5f1e8"/><style>text{font-family:Arial,sans-serif;fill:#173a3a}.label{font-size:28px}.sub{font-size:22px;fill:#626b63}.title{font-family:Georgia,serif;font-size:49px}.route{fill:none;stroke-width:7;stroke-linejoin:round;stroke-linecap:round}.station{fill:#f5f1e8;stroke:#173a3a;stroke-width:5}</style>${content}</svg>`;
const dot=(x,y)=>`<circle class="station" cx="${x}" cy="${y}" r="10"/>`;
const desktop=wrap(1440,760,`
<text class="title" x="65" y="87">One snack. Several side quests.</text>
<text class="sub" x="65" y="127">A local-train map of the connections in my head.</text>
<path class="route" stroke="#a44832" d="M110 225H785Q840 225 840 180V175Q840 155 865 155H1100M785 225Q840 225 840 270V300Q840 325 865 325H1100"/>
${dot(110,225)}${dot(360,225)}${dot(655,225)}${dot(1100,155)}${dot(1100,325)}
<text class="label" x="65" y="278">Two wada pavs</text>
<text class="label" x="274" y="278">Newspaper wrapper</text>
<text class="label" x="556" y="278">My own newspaper</text>
<text class="label" x="1130" y="165">Contact</text><text class="sub" x="1040" y="200">Unwrap it</text>
<text class="label" x="1130" y="335">Blog</text><text class="sub" x="1040" y="370">Pick up an edition</text>
<path class="route" stroke="#173a3a" d="M110 490H785Q840 490 840 470H1100M785 490Q840 490 840 540V605H1100"/>
${dot(110,490)}${dot(655,490)}${dot(1100,470)}${dot(1100,605)}
<text class="label" x="65" y="543">Mumbai + pixel games</text>
<text class="label" x="549" y="543">A street to explore</text>
<text class="label" x="1130" y="480">Projects</text><text class="sub" x="1035" y="515">A garage studio</text>
<text class="label" x="1130" y="615">Friends</text><text class="sub" x="912" y="656">Cricket cards → collectible neighbors</text>
<text class="sub" x="65" y="720">A map of associations, not a build schedule.</text>`);
const mobile=wrap(720,1120,`
<text class="title" x="44" y="70">One snack.</text><text class="title" x="44" y="127">Several side quests.</text>
<path class="route" stroke="#a44832" d="M65 210V375Q65 430 120 430H540M300 430V485M540 430V485"/>
${dot(65,210)}${dot(65,290)}${dot(65,370)}${dot(300,485)}${dot(540,485)}
<g class="label" style="font-size:32px"><text x="102" y="220">Two wada pavs</text><text x="102" y="300">Newspaper wrapper</text><text x="102" y="380">The Chai &amp; Code Chronicle</text><text x="229" y="538">Contact</text><text x="506" y="538">Blog</text></g>
<g class="sub" style="font-size:27px"><text x="223" y="578">Unwrap it</text><text x="450" y="578">An edition</text></g>
<path class="route" stroke="#173a3a" d="M65 675V765Q65 830 125 830H540M300 830V880M540 830V880M540 880H665V1010H300"/>
${dot(65,675)}${dot(65,765)}${dot(300,880)}${dot(540,880)}${dot(300,1010)}
<g class="label" style="font-size:32px"><text x="102" y="685">Mumbai + pixel games</text><text x="102" y="775">A street to explore</text><text x="230" y="934">Projects</text><text x="488" y="934">Friends</text><text x="45" y="1021">Cricket cards</text></g>
<g class="sub" style="font-size:27px"><text x="226" y="973">The garage</text><text x="484" y="973">Sprites</text><text x="330" y="1056">Collectible neighbors</text></g>
<text class="sub" x="44" y="1100" style="font-size:24px">Associations, not a build schedule.</text>`);
await fs.mkdir(generated,{recursive:true});
for(const [name,source] of [['origin-map',desktop],['origin-map-mobile',mobile]]){
 await fs.writeFile(path.join(generated,name+'.svg'),source);
 await sharp(Buffer.from(source)).webp({quality:93}).toFile(path.join(out,name+'.webp'));
}
for(let i=0;i<5;i++){
 const name=`workflow-paper-${String(i).padStart(2,'0')}`;
 await sharp(path.join(draft,'sources/captures',name+'.jpg')).webp({quality:88}).toFile(path.join(out,name+'.webp'));
}
console.log('Prepared association maps and five real paper inspection frames.');
