import {AnimationMixer,BackSide,Box3,DoubleSide,FrontSide,InterpolateDiscrete,LoopOnce,MathUtils,Mesh,MeshStandardMaterial,Sphere,Vector3} from 'three';
import {paperMotion} from './contactLayout.js';

// Artwork belongs to the caller. The GLB owns only a sheet and baked poses.
export function createContactWrapper(gltf,{texture=null}={}){
 const root=gltf.scene,meshes=[];
 root?.traverse(node=>{if(node.isMesh)meshes.push(node);});
 const paper=meshes[0],clip=gltf.animations?.find(value=>value.name==='Unwrap');
 const track=clip?.tracks[0],geometry=paper?.geometry;
 if(meshes.length!==1||!geometry?.attributes.uv||geometry.morphAttributes.position?.length!==24||geometry.morphAttributes.normal?.length!==24||
    !clip||Math.abs(clip.duration-2)>1e-5||clip.tracks.length!==1||!track.name.endsWith('.morphTargetInfluences')||track.times.length!==25||track.getInterpolation()!==InterpolateDiscrete){
  throw new Error('Contact wrapper requires one sheet and the 25-pose stepped Unwrap clip');
 }
 for(const material of new Set([].concat(paper.material)))material.dispose();
 const frontMaterial=new MeshStandardMaterial({color:0xffffff,roughness:1,map:texture,side:FrontSide,shadowSide:DoubleSide});
 paper.material=frontMaterial;
 paper.castShadow=true;paper.receiveShadow=true;paper.userData.outlineRevision=0;
 const backMaterial=new MeshStandardMaterial({color:0xfff5e2,roughness:1,side:BackSide});
 const back=new Mesh(geometry,backMaterial);
 back.name='ContactWrapper_BlankBack';back.morphTargetInfluences=paper.morphTargetInfluences;
 back.morphTargetDictionary=paper.morphTargetDictionary;back.receiveShadow=true;
 back.userData.skipOutline=true;back.userData.skipShadowCast=true;
 // Pixel mode overrides every mesh with one FrontSide normal material. Match
 // this sheet's reverse during its draw, then restore the shared override.
 let normalSide=null;
 back.onBeforeRender=(_renderer,_scene,_camera,_geometry,material)=>{
  if(!material.isMeshNormalMaterial)return;
  normalSide=material.side;if(material.side!==BackSide){material.side=BackSide;material.needsUpdate=true;}
 };
 back.onAfterRender=(_renderer,_scene,_camera,_geometry,material)=>{
  if(normalSide===null)return;
  if(material.side!==normalSide){material.side=normalSide;material.needsUpdate=true;}normalSide=null;
 };
 // Child transform is identity: both surfaces use exactly the same vertices.
 paper.add(back);
 const bounds=new Box3(),v=new Vector3(),delta=new Vector3(),base=geometry.attributes.position;
 for(let i=0;i<base.count;i++){
  v.fromBufferAttribute(base,i);bounds.expandByPoint(v);
  for(const target of geometry.morphAttributes.position){delta.fromBufferAttribute(target,i);if(geometry.morphTargetsRelative)delta.add(v);bounds.expandByPoint(delta);}
 }
 geometry.boundingBox=bounds;geometry.boundingSphere=bounds.getBoundingSphere(new Sphere());
 const mixer=new AnimationMixer(root),action=mixer.clipAction(clip);
 action.setLoop(LoopOnce,1);action.clampWhenFinished=true;action.play();action.paused=true;
 let pose=-1,dead=false;
 const api={
  root,paperMesh:paper,backMesh:back,
  get progress(){return pose/24;},
  setProgress(value){
   if(dead)return false;
   if(!Number.isFinite(value))throw new TypeError('Wrapper progress must be finite');
   const next=Math.floor(MathUtils.clamp(value,0,1)*24+1e-7);
   if(next===pose)return false;
   pose=next;action.enabled=true;action.time=track.times[pose];mixer.update(0);
   paper.userData.outlineRevision++;return true;
  },
  setTexture(value){if(dead)return;for(const material of new Set([frontMaterial,paper.material])){material.map=value;material.needsUpdate=true;}},
  dispose(){
   if(dead)return;dead=true;mixer.stopAllAction();mixer.uncacheRoot(root);root.removeFromParent();
   geometry.dispose();for(const material of new Set([frontMaterial,backMaterial,paper.material,back.material]))material.dispose();
  },
 };
 api.setProgress(0);return api;
}

// Leaving Contact changes input ownership, never the opened parcel or food.
export function createWrapperPlayback(wrapper){
 let started=false,elapsed=0;
 return {
  setActive(value){if(value)started=true;},
  update(dt,reduced=false){
   if(!started)return false;
   elapsed=reduced?paperMotion.openSeconds:Math.min(paperMotion.openSeconds,elapsed+Math.max(0,Number.isFinite(dt)?dt:0));
   return wrapper.setProgress(elapsed/paperMotion.openSeconds);
  },
  get complete(){return wrapper.progress===1;},
  get started(){return started;},
 };
}
