import {createPaperGeometry} from './contactPaper.js';
import * as THREE from 'three';
import {disposeModel} from '../assets/registry.js';

import {createFoodDrag} from './contactFoodDrag.js';
import {createContactFood} from './contactFood.js';
import {contactLayout,contactRows,paperSurface} from './contactLayout.js';

// A separate serving board preserves every mesh in the original stall asset.
export async function createContact(world,{visible=true}={}) {
 const root=new THREE.Group(); root.name='Contact serving board';
 root.position.copy(contactLayout.position);
 const paperRoot=new THREE.Group();paperRoot.rotation.y=contactLayout.paperAngle;root.add(paperRoot);
 const board=new THREE.Mesh(new THREE.BoxGeometry(.94,.045,1.16),new THREE.MeshStandardMaterial({color:0x725038,roughness:.9}));
 board.position.y=-.023;root.add(board);
 for(const x of [-.35,.35]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.035,.99,.035),new THREE.MeshStandardMaterial({color:0x41443e,metalness:.5,roughness:.65}));leg.position.set(x,-.52,.36);root.add(leg);}
 const geometry=createPaperGeometry();
 const paper=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:0xfff5e2,roughness:1,side:THREE.DoubleSide}));paper.position.y=.006;paperRoot.add(paper);
 const food=createContactFood();paperRoot.add(food);
 const original=geometry.attributes.position.array.slice();
 let opening=0,active=false,dead=false,revealDelay=0;
 const drag=createFoodDrag(world,paperRoot,food,()=>active&&opening>.98&&world.isContactReady());
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 for(let i=0;i<geometry.attributes.position.count;i++){
  const x=original[i*3],z=original[i*3+2];
  const v=paperSurface(x,z,0,geometry.attributes.paperPanel.getX(i));geometry.attributes.position.setXYZ(i,v.x,v.y,v.z);
 }
 geometry.computeVertexNormals();
 root.visible=visible;world.scene.add(root);world.prepareModel(root);
 const light=new THREE.PointLight(0xffe3bd,.8,2,2);light.position.set(0,.7,.3);root.add(light);
 const hotspots=contactRows.map(({label,href,rect})=>{
  const a=document.createElement('a');a.className='paper-hotspot';a.href=href;a.setAttribute('aria-label',label);a.title=label;
  if(!href.startsWith('mailto:')){a.target='_blank';a.rel='noopener noreferrer';}
  document.querySelector('#contact').append(a);return {a,rect};
 });
 root.updateMatrixWorld(true);
 const unsubscribe=world.onFrame(dt=>{
  for(const {a,rect} of active?hotspots:[]){
   const [leftUV,topUV,rightUV,bottomUV]=rect;
   const points=[[leftUV,topUV],[rightUV,topUV],[rightUV,bottomUV],[leftUV,bottomUV]].map(([u,v])=>{
    const x=(u-.5)*.72,z=(v-.5)*.96;
    const surface=paperSurface(x,z,opening);surface.y+=.006;return paperRoot.localToWorld(surface).project(world.camera);
   });
   const xs=points.map(p=>(p.x+1)*innerWidth/2),ys=points.map(p=>(1-p.y)*innerHeight/2);
   const left=Math.min(...xs),top=Math.min(...ys);
   a.hidden=!active||opening<.92||world.camera.position.distanceTo(root.position)>4;
   Object.assign(a.style,{left:left+'px',top:top+'px',width:(Math.max(...xs)-left)+'px',height:(Math.max(...ys)-top)+'px',clipPath:'polygon('+xs.map((x,i)=>`${x-left}px ${ys[i]-top}px`).join(',')+')'});
  }
  revealDelay=Math.max(0,revealDelay-dt);
  const target=active&&revealDelay===0?1:0;
  const next=reduced.matches?target:THREE.MathUtils.clamp(opening+(target?1:-1)*dt/3.1,0,1);
  if(Math.abs(next-opening)<.0001)return;opening=next;
  const p=geometry.attributes.position;
  for(let i=0;i<p.count;i++){
   const x=original[i*3],z=original[i*3+2];
   const v=paperSurface(x,z,opening,geometry.attributes.paperPanel.getX(i));p.setXYZ(i,v.x,v.y,v.z);
  }
  p.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere();world.renderer.shadowMap.needsUpdate=true;
 });
 const pending=[new THREE.TextureLoader().loadAsync(import.meta.env.BASE_URL+'contact/newspaper.png').then(texture=>{
  if(dead){texture.dispose();return;}texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;paper.material.map=texture;paper.material.color.set(0xffffff);paper.material.needsUpdate=true;
 })];
 const results=await Promise.allSettled(pending);results.forEach(r=>{if(r.status==='rejected'){console.warn('Contact prop unavailable',r.reason);document.body.classList.add('contact-asset-failed');}});
 return {root,setActive(value){if(value!==active)revealDelay=value&&!reduced.matches?1.65:0;active=value;if(!value)drag.cancel();hotspots.forEach(({a})=>a.hidden=!value);},dispose(){dead=true;drag.dispose();unsubscribe();hotspots.forEach(({a})=>a.remove());root.removeFromParent();disposeModel(root);}};
}
