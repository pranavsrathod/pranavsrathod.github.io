import * as THREE from 'three';
import {loadModel,disposeModel} from '../assets/registry.js';

// A separate serving board preserves every mesh in the original stall asset.
export async function createContact(world) {
 const root=new THREE.Group(); root.name='Contact serving board';
 root.position.set(4.55,1.035,2.87);
 const board=new THREE.Mesh(new THREE.BoxGeometry(.94,.045,1.16),new THREE.MeshStandardMaterial({color:0x725038,roughness:.9}));
 board.position.y=-.023;root.add(board);
 for(const x of [-.35,.35]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.035,.99,.035),new THREE.MeshStandardMaterial({color:0x41443e,metalness:.5,roughness:.65}));leg.position.set(x,-.52,.36);root.add(leg);}
 const geometry=new THREE.PlaneGeometry(.72,.96,24,32);geometry.rotateX(-Math.PI/2);
 const paper=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:0xfff5e2,roughness:1,side:THREE.DoubleSide}));paper.position.y=.006;root.add(paper);
 const original=geometry.attributes.position.array.slice();
 let opening=0,active=false,dead=false,revealDelay=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 for(let i=0;i<geometry.attributes.position.count;i++){
  const x=original[i*3],z=original[i*3+2],edge=Math.max(0,(Math.abs(x)-.22)/.14);
  geometry.attributes.position.setXYZ(i,x-Math.sign(x)*edge*.085,.005+edge*edge*.14+.002*Math.sin(z*18),z);
 }
 geometry.computeVertexNormals();
 world.scene.add(root);world.prepareModel(root);
 const light=new THREE.PointLight(0xffe3bd,.8,2,2);light.position.set(0,.7,.3);root.add(light);
 const hotspots=[
  ['LinkedIn','https://www.linkedin.com/in/pranavsrathod/',.016,.059],
  ['Email Pranav','mailto:pranavdev@duck.com',.063,.105],
  ['GitHub','https://github.com/pranavsrathod',.109,.151],
 ].map(([label,href,back,front])=>{
  const a=document.createElement('a');a.className='paper-hotspot';a.href=href;a.setAttribute('aria-label',label);a.title=label;
  if(!href.startsWith('mailto:')){a.target='_blank';a.rel='noopener noreferrer';}
  document.querySelector('#contact').append(a);return {a,back,front};
 });
 root.updateMatrixWorld(true);
 const unsubscribe=world.onFrame(dt=>{
  for(const {a,back,front} of active?hotspots:[]){
   const points=[[.10,back],[.32,back],[.10,front],[.32,front]].map(([x,z])=>root.localToWorld(new THREE.Vector3(x,.013,z)).project(world.camera));
   const xs=points.map(p=>(p.x+1)*innerWidth/2),ys=points.map(p=>(1-p.y)*innerHeight/2);
   const left=Math.min(...xs),top=Math.min(...ys);
   a.hidden=!active||world.camera.position.distanceTo(root.position)>4;
   Object.assign(a.style,{left:left+'px',top:top+'px',width:(Math.max(...xs)-left)+'px',height:(Math.max(...ys)-top)+'px'});
  }
  revealDelay=Math.max(0,revealDelay-dt);
  const target=active&&revealDelay===0?1:0;
  const next=reduced.matches?target:THREE.MathUtils.damp(opening,target,4,dt);
  if(Math.abs(next-opening)<.0001)return;opening=next;
  const p=geometry.attributes.position;
  for(let i=0;i<p.count;i++){
   const x=original[i*3],z=original[i*3+2];
   // Fold just the outside margins, leaving the food and printed ad exposed.
   const edge=Math.max(0,(Math.abs(x)-.22)/.14);
   p.setXYZ(i,x-Math.sign(x)*edge*.085*(1-opening),.005+edge*edge*.14*(1-opening)+.002*Math.sin(z*18),z);
  }
  p.needsUpdate=true;geometry.computeVertexNormals();world.renderer.shadowMap.needsUpdate=true;
 });
 const pending=[new THREE.TextureLoader().loadAsync(import.meta.env.BASE_URL+'contact/newspaper.png').then(texture=>{
  if(dead){texture.dispose();return;}texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;paper.material.map=texture;paper.material.color.set(0xffffff);paper.material.needsUpdate=true;
 }),loadModel({url:import.meta.env.BASE_URL+'contact/wada-pavs.glb'}).then(food=>{
  if(dead){disposeModel(food);return;}
  // Original model contains two assembled pavs. Keep both to the left of the ad.
  const box=new THREE.Box3().setFromObject(food);food.scale.setScalar(.57);
  food.position.set(-.03-box.max.x*.57,.015-box.min.y*.57,-.15-box.min.z*.57);
  root.add(food);world.prepareModel(food);
 })];
 const results=await Promise.allSettled(pending);results.forEach(r=>{if(r.status==='rejected')console.warn('Contact prop unavailable',r.reason);});
 return {setActive(value){if(value!==active)revealDelay=value&&!reduced.matches?1.3:0;active=value;hotspots.forEach(({a})=>a.hidden=!value);},dispose(){dead=true;unsubscribe();hotspots.forEach(({a})=>a.remove());root.removeFromParent();disposeModel(root);}};
}
