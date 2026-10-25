import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createPaperGeometry as panelGeometry} from './panels/contactPaper.js';
import {paperSurface as panelSurface} from './panels/contactLayout.js';
import {createPaperGeometry as bloomGeometry} from './bloom/contactPaper.js';
import {paperSurface as bloomSurface} from './bloom/contactLayout.js';
import {createPaperGeometry as parcelGeometry} from './parcel/contactPaper.js';
import {paperSurface as parcelSurface} from './parcel/contactLayout.js';
import {createContactWrapper} from './baked/contactWrapper.js';

export const stages = Object.freeze([
  {id:'corners',label:'September 19 · Raised margins',commit:'707010f',date:'2026-09-19',note:'Literal earliest geometry: raised side margins, food and ad left exposed. This is not the documented boat revision.'},
  {id:'panels',label:'September 30 · Separate panels',commit:'467087a',date:'2026-09-30',note:'Base plus four separately tessellated flaps. September29 worklog, September30 committed source.'},
  {id:'bloom',label:'October 11 · Continuous bloom',commit:'8022f78',date:'2026-10-11',note:'One continuous72×96 grid with a low crumpled surround and staggered release.'},
  {id:'parcel',label:'October 15 · Covered parcel',commit:'420e1a6',date:'2026-10-15',note:'Perimeter gathers above the food. Worklog records the local revision onOctober11; first committed snapshot isOctober15.'},
  {id:'baked',label:'October 25 · Baked folds',commit:null,date:'2026-10-25',note:'Frozen uncommitted working-copy asset: closed base plus24 morph targets,25 poses, STEP interpolation. Cloth-assisted, artistically cleaned and sculpted; no browser cloth solver.'},
]);

// Transplanted literally from707010f:src/world/contact.js:45–50.
function earliestSurface(x,z,opening){
  const edge=Math.max(0,(Math.abs(x)-.22)/.14);
  return new THREE.Vector3(x-Math.sign(x)*edge*.085*(1-opening),.005+edge*edge*.14*(1-opening)+.002*Math.sin(z*18),z);
}

function procedural(geometry,surface,texture){
  const material=new THREE.MeshStandardMaterial({map:texture,color:0xffffff,roughness:1,side:THREE.DoubleSide});
  const mesh=new THREE.Mesh(geometry,material);mesh.position.y=.006;
  mesh.castShadow=true;mesh.receiveShadow=true;
  const root=new THREE.Group();root.add(mesh);
  const rest=geometry.attributes.position.array.slice();
  let progress=0;
  function setProgress(value){
    if(!Number.isFinite(value))throw new TypeError('Progress must be finite');
    progress=THREE.MathUtils.clamp(value,0,1);
    const p=geometry.attributes.position,panels=geometry.attributes.paperPanel;
    for(let i=0;i<p.count;i++){
      const point=surface(rest[i*3],rest[i*3+2],progress,panels?.getX(i));
      p.setXYZ(i,point.x,point.y,point.z);
    }
    p.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere();
  }
  setProgress(0);
  return {root,mesh,setProgress,get progress(){return progress;},dispose(){root.removeFromParent();geometry.dispose();material.dispose();}};
}

/** A normalized geometry inspector, not a recreation of each version's route timing. */
export async function createStage(id,{legacyTexture,bakedTexture}={}){
  if(id==='corners'){
    const geometry=new THREE.PlaneGeometry(.72,.96,24,32);geometry.rotateX(-Math.PI/2);
    return procedural(geometry,earliestSurface,legacyTexture);
  }
  if(id==='panels')return procedural(panelGeometry(),panelSurface,legacyTexture);
  if(id==='bloom')return procedural(bloomGeometry(),bloomSurface,legacyTexture);
  if(id==='parcel')return procedural(parcelGeometry(),parcelSurface,legacyTexture);
  if(id==='baked'){
    const gltf=await new GLTFLoader().loadAsync(new URL('./baked/wrapper-unwrap.glb',import.meta.url).href);
    const wrapper=createContactWrapper(gltf,{texture:bakedTexture});
    return {root:wrapper.root,mesh:wrapper.paperMesh,setProgress:value=>wrapper.setProgress(value),get progress(){return wrapper.progress;},dispose:()=>wrapper.dispose()};
  }
  throw new Error('Unknown history stage: '+id);
}
