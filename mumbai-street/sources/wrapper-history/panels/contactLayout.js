import {Vector3} from 'three';

export const contactLayout = {
 position: new Vector3(4.55,1.035,2.87),
 paperAngle: -.09,
 adCenter: new Vector3(.215,.017,.065),
};
export function paperPoint(x,y,z) {
 return new Vector3(x,y,z).applyAxisAngle(new Vector3(0,1,0),contactLayout.paperAngle).add(contactLayout.position);
}
export function contactShots(aspect) {
 const table=paperPoint(0,.02,0);
 const ad=paperPoint(.18,.02,.065);
 const tableDistance=Math.max(1.5,.90/(.65*aspect));
 // Finish on the ad; dragging reveals the rest of the sheet.
 const adDistance=Math.max(.70,.45/(.65*aspect));
 const direction=new Vector3(.12,.92,.37).normalize();
 return [
  {target:table,end:table.clone().add(new Vector3(.10,.82,.56).normalize().multiplyScalar(tableDistance)),roll:0,duration:1.8},
  {target:ad,end:ad.clone().add(direction.multiplyScalar(adDistance)),roll:-.06,duration:4.2},
 ];
}

// Bounds measured in the original newspaper image, normalized from its top left.
export const contactRows = [
 {label:'LinkedIn',href:'https://www.linkedin.com/in/pranavsrathod/',rect:[.653,.518,.929,.553]},
 {label:'Email Pranav',href:'mailto:pranavdev@duck.com',rect:[.653,.556,.929,.590]},
 {label:'GitHub',href:'https://github.com/pranavsrathod',rect:[.653,.592,.929,.625]},
];
// Four separately tessellated panels around the serving area. Adjacent
// corners have tucked seams while closed and meet exactly when laid flat.
export const paperFolds = [
 {axis:'x',sign:-1,edge:.13,start:.75,height:.145},
 {axis:'x',sign:1,edge:.13,start:.50,height:.151},
 {axis:'z',sign:-1,edge:.18,start:.25,height:.157},
 {axis:'z',sign:1,edge:.18,start:0,height:.163},
];
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*t*(t*(t*6-15)+10);};
export function paperSurface(x,z,settled=1,panel=-1){
 const point=new Vector3(x,.005,z);
 if(panel<0){
  if(Math.abs(x)<=.13&&Math.abs(z)<=.18)return point;
  panel=(Math.abs(x)-.13)/.23>(Math.abs(z)-.18)/.30?(x<0?0:1):(z<0?2:3);
 }
 const fold=paperFolds[panel];if(!fold)return point;
 const distance=fold.sign*point[fold.axis]-fold.edge;
 if(distance<=0)return point;
 const release=smooth((settled-fold.start)/.25),angle=(1-release)*Math.PI/2;
 const bend=.016,wall=fold.height-2*bend/(Math.PI/2);
 let along=0,lift=0,remaining=distance*(1+(fold.axis==='z'?.35:0)*(1-release));
 const arc=Math.min(remaining,bend);remaining-=arc;
 if(angle>1e-7){along+=bend/angle*Math.sin(angle*arc/bend);lift+=bend/angle*(1-Math.cos(angle*arc/bend));}else along+=arc;
 const straight=Math.min(remaining,wall);remaining-=straight;
 along+=straight*Math.cos(angle);lift+=straight*Math.sin(angle);
 const upper=Math.min(remaining,bend);remaining-=upper;
 if(angle>1e-7){along+=bend/angle*(Math.sin(angle+angle*upper/bend)-Math.sin(angle));lift+=bend/angle*(Math.cos(angle)-Math.cos(angle+angle*upper/bend));}else along+=upper;
 along+=remaining*Math.cos(2*angle);lift+=remaining*Math.sin(2*angle);
 point[fold.axis]=fold.sign*(fold.edge+along);point.y+=lift;
 // Gather the surplus corner width into the tucked side seam, rather than
 // allowing broad corners to project through the neighbouring flap.
 const tangent=fold.axis==='x'?'z':'x';
 const halfWidth=fold.axis==='x'?.18:.13;
 const excess=Math.max(0,Math.abs(point[tangent])-halfWidth);
 point[tangent]-=Math.sign(point[tangent])*excess*(1-release);
 return point;
}
export function paperHeight(x,z,settled=1){return paperSurface(x,z,settled).y;}
