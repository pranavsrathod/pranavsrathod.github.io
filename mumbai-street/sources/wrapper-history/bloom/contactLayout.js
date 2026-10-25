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
// A stylized gathered sheet, not four flap hinges. An elliptical island leaves a
// flat serving area under the food and blends continuously around every corner.
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*t*(t*(t*6-15)+10);};
export function paperSurface(x,z,settled=1){
 const point=new Vector3(x,.005,z);
 if(settled>=.90)return point;
 const radius=Math.hypot(x/.19,z/.27);
 if(radius<=1)return point;
 const length=Math.hypot(x,z),distance=length*(1-1/radius),angle=Math.atan2(z,x);
 const shoulder=smooth(distance/.095);
 // A continuous travelling release loosens one part of the crumple before its
 // neighbours. There are no discrete sides or level, box-like wall tops.
 const delay=.055*(1+Math.sin(angle+1.1))+.025*(1+Math.sin(3*angle-.4));
 const spread=smooth((settled-delay)/.60);
 const flatten=smooth((settled-delay-.08)/.65);
 const gathered=1-spread,creased=1-flatten;
 const compression=.35+.055*Math.sin(5*angle+.6);
 const along=distance*(compression+(1-compression)*spread);
 const scale=(length-distance+along)/length;
 point.x*=scale;point.z*=scale;
 // Broad folds collapse back down between ridges; finer diagonal creases give
 // the bundle a papery silhouette instead of a smooth bowl or inflated sack.
 const pleat=Math.pow(.5+.5*Math.sin(x*29+z*17+.6*Math.sin(z*21)),3);
 const cross=Math.pow(.5+.5*Math.sin(x*18-z*31+.8),3);
 const crumple=shoulder*(.003+.050*pleat+.025*cross);
 // Irregular lobes lift as they spread, like a loose flower bloom, then settle.
 const bloom=.55+.45*Math.pow(Math.sin(3*angle+.6),2);
 const loosen=.050*Math.sin(Math.PI*spread)*shoulder*bloom;
 point.y+=crumple*creased+loosen*gathered;
 return point;
}
export function paperHeight(x,z,settled=1){return paperSurface(x,z,settled).y;}
