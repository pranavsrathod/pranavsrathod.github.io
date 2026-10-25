import {createPaperGeometry} from './contactPaper.js';
import {createContactNewspaperStack} from './contactNewspaperStack.js';
import * as THREE from 'three';
import {disposeModel} from '../assets/registry.js';

import {createFoodDrag} from './contactFoodDrag.js';
import {createContactFood} from './contactFood.js';
import {contactRows,paperSurface,paperMotion} from './contactLayout.js';

// Only runtime-owned paper and food are attached; the counter belongs to GLB.
export async function createContact(world,{visible=true,layout}={}) {
 if(!layout)throw new Error('Contact stall has no valid paper anchor');
 const root=new THREE.Group();root.name='Contact paper and food';
 const paperRoot=root;layout.anchor.add(root);
 const geometry=createPaperGeometry();
 const paper=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:0xfff5e2,roughness:1,side:THREE.DoubleSide}));paper.position.y=.006;paperRoot.add(paper);
 const food=createContactFood();paperRoot.add(food);
 const newspaperStack=createContactNewspaperStack();root.add(newspaperStack);
 const original=geometry.attributes.position.array.slice();
 let opening=0,active=false,dead=false;
 const drag=createFoodDrag(world,paperRoot,food,()=>active&&opening>.98&&world.isContactReady());
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 for(let i=0;i<geometry.attributes.position.count;i++){
  const x=original[i*3],z=original[i*3+2];
  const v=paperSurface(x,z,0);geometry.attributes.position.setXYZ(i,v.x,v.y,v.z);
 }
 geometry.computeVertexNormals();geometry.computeBoundingSphere();
 root.visible=visible;world.prepareModel(root);
 const light=new THREE.PointLight(0xffe3bd,.8,2,2);light.position.set(0,.7,.3);root.add(light);
 const hotspots=contactRows.map(({label,href,rect})=>{
  const a=document.createElement('a');a.className='paper-hotspot';a.href=href;a.setAttribute('aria-label',label);a.title=label;
  if(!href.startsWith('mailto:')){a.target='_blank';a.rel='noopener noreferrer';}
  document.querySelector('#contact').append(a);return {a,rect};
 });
 root.updateWorldMatrix(true,true);
 const unsubscribe=world.onFrame(dt=>{
  for(const {a,rect} of active?hotspots:[]){
   const [leftUV,topUV,rightUV,bottomUV]=rect;
   const points=[[leftUV,topUV],[rightUV,topUV],[rightUV,bottomUV],[leftUV,bottomUV]].map(([u,v])=>{
    const x=(u-.5)*.72,z=(v-.5)*.96;
    const surface=paperSurface(x,z,opening);surface.y+=.006;return paperRoot.localToWorld(surface).project(world.camera);
   });
   const xs=points.map(p=>(p.x+1)*innerWidth/2),ys=points.map(p=>(1-p.y)*innerHeight/2);
   const left=Math.min(...xs),top=Math.min(...ys);
   a.hidden=!active||opening<.92||world.camera.position.distanceTo(layout.point())>4;
   Object.assign(a.style,{left:left+'px',top:top+'px',width:(Math.max(...xs)-left)+'px',height:(Math.max(...ys)-top)+'px',clipPath:'polygon('+xs.map((x,i)=>`${x-left}px ${ys[i]-top}px`).join(',')+')'});
  }
  const target=active?1:0;
  const next=reduced.matches?target:THREE.MathUtils.clamp(opening+(target?1:-1)*dt/(target?paperMotion.openSeconds:paperMotion.closeSeconds),0,1);
  if(Math.abs(next-opening)<.0001)return;opening=next;
  const p=geometry.attributes.position;
  for(let i=0;i<p.count;i++){
   const x=original[i*3],z=original[i*3+2];
   const v=paperSurface(x,z,opening);p.setXYZ(i,v.x,v.y,v.z);
  }
  p.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere();world.renderer.shadowMap.needsUpdate=true;
 });
 const pending=[new THREE.TextureLoader().loadAsync(import.meta.env.BASE_URL+'contact/newspaper.png').then(texture=>{
  if(dead){texture.dispose();return;}texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;paper.material.map=texture;paper.material.color.set(0xffffff);paper.material.needsUpdate=true;newspaperStack.setNewspaperTexture(texture);
 })];
 const results=await Promise.allSettled(pending);results.forEach(r=>{if(r.status==='rejected'){console.warn('Contact prop unavailable',r.reason);document.body.classList.add('contact-asset-failed');}});
 return {root,paperMesh:paper,available:results.every(result=>result.status==='fulfilled'),setActive(value){active=value;if(!value)drag.cancel();hotspots.forEach(({a})=>a.hidden=true);},dispose(){dead=true;drag.dispose();unsubscribe();hotspots.forEach(({a})=>a.remove());root.removeFromParent();disposeModel(root);}};
}
