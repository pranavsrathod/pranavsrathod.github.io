import {Vector3,Plane,MathUtils,Box3} from 'three';

// Default layout is only a reference for isolated framing checks. Runtime
// contact is always attached to the named anchor in the loaded stall.
export const contactLayout = {
 position: new Vector3(5.01,1.065,1.45), paperAngle: -.09,
 adCenter: new Vector3(.215,.017,.065),
};
export function paperPoint(x,y,z,layout=null) {
 if(layout)return layout.point(x,y,z);
 return new Vector3(x,y,z).applyAxisAngle(new Vector3(0,1,0),contactLayout.paperAngle).add(contactLayout.position);
}
export function contactShots(aspect,layout=null) {
 const table=paperPoint(0,.02,0,layout),ad=paperPoint(.18,.02,.065,layout);
 const tableDistance=Math.max(1.5,.90/(.65*aspect)),adDistance=Math.max(.70,.45/(.65*aspect));
 const direction=v=>layout?layout.direction(v):v.normalize();
 return [
  {target:table,end:table.clone().add(direction(new Vector3(.10,.82,.56)).multiplyScalar(tableDistance)),roll:0,duration:1.8},
  {target:ad,end:ad.clone().add(direction(new Vector3(.12,.92,.37)).multiplyScalar(adDistance)),roll:-.06,duration:4.2},
 ];
}
export function createContactLayout(stall){
 const anchor=stall?.getObjectByName('Contact_PaperAnchor');
 if(!anchor)return null;
 anchor.updateWorldMatrix(true,false);
 const bounds=stall.getObjectByName('Contact_Surface_Min'),max=stall.getObjectByName('Contact_Surface_Max');
 if(!bounds||!max)return null;
 const layout={
  anchor,stall,
  point(x=0,y=0,z=0){anchor.updateWorldMatrix(true,false);return anchor.localToWorld(new Vector3(x,y,z));},
  direction(v){anchor.updateWorldMatrix(true,false);return v.clone().transformDirection(anchor.matrixWorld);},
  local(v){anchor.updateWorldMatrix(true,false);return anchor.worldToLocal(v.clone());},
  plane(){return new Plane().setFromNormalAndCoplanarPoint(layout.direction(new Vector3(0,1,0)),layout.point(0,.015,0));},
  panDelta(target,delta){const local=layout.local(target.clone().add(delta));local.x=MathUtils.clamp(local.x,-.30,.30);local.z=MathUtils.clamp(local.z,-.38,.38);local.y=layout.local(target).y;return layout.point(local.x,local.y,local.z).sub(target);},
  overviewShot(aspect){
   // Keep the whole service opening visible; bounds follow model placement.
   const box=new Box3().setFromObject(stall),size=box.getSize(new Vector3());
   const center=box.getCenter(new Vector3());center.y=layout.point().y+.65;
   const distance=Math.max(4.4,size.x*1.08/(2*Math.tan(Math.PI/10)*aspect),size.y*.85/(2*Math.tan(Math.PI/10)));
   return {target:center,end:center.clone().add(new Vector3(0,0,1).transformDirection(stall.matrixWorld).multiplyScalar(distance)),duration:1.2,roll:0};
  },
  photoCorners(){
   const low=stall.getObjectByName('Contact_PhotoWall_Min'),high=stall.getObjectByName('Contact_PhotoWall_Max');
   if(!low||!high)return null;
   stall.updateWorldMatrix(true,true);
   const a=stall.worldToLocal(low.getWorldPosition(new Vector3())),b=stall.worldToLocal(high.getWorldPosition(new Vector3()));
   return [[a.x,b.y,b.z],[b.x,b.y,b.z],[b.x,a.y,b.z],[a.x,a.y,b.z]].map(p=>stall.localToWorld(new Vector3(...p)));
  },
  photoShot(aspect){
   const corners=layout.photoCorners(),wall=stall.getObjectByName('Contact_PhotoWallAnchor');if(!corners||!wall)return null;
   const target=wall.getWorldPosition(new Vector3()),width=corners[0].distanceTo(corners[1]),height=corners[0].distanceTo(corners[3]);
   const distance=Math.max(height*1.24,width*1.24/aspect)/(2*Math.tan(Math.PI/10));
   return {target,end:target.clone().add(new Vector3(0,0,1).transformDirection(stall.matrixWorld).multiplyScalar(distance)),duration:1.4,roll:0};
  },
 };
 return layout;
}
// Bounds measured in the original newspaper image, normalized from its top left.
export const contactRows = [
 {label:'LinkedIn',href:'https://www.linkedin.com/in/pranavsrathod/',rect:[.653,.518,.929,.553]},
 {label:'Email Pranav',href:'mailto:pranavdev@duck.com',rect:[.653,.556,.929,.590]},
 {label:'GitHub',href:'https://github.com/pranavsrathod',rect:[.653,.592,.929,.625]},
];
// The baked clip has 24 held intervals plus the final readable pose.
export const paperMotion=Object.freeze({openSeconds:2,poseRate:12,poseCount:25});
export const paperSize=Object.freeze({width:.72,depth:.96,height:.011});
export function paperContactPoint(u,v){return new Vector3((u-.5)*paperSize.width,paperSize.height,(v-.5)*paperSize.depth);}
