import {BufferGeometry,Float32BufferAttribute} from 'three';
// Explicit seams stop triangles spanning different fold hinges. Each patch
// keeps its original image coordinates; the open result is one complete page.
export function createPaperGeometry(){
 const patches=[
  {id:4,p:[[-.13,-.18],[.13,-.18],[.13,.18],[-.13,.18]]},
  {id:0,p:[[-.36,-.48],[-.13,-.18],[-.13,.18],[-.36,.48]]},
  {id:1,p:[[.13,-.18],[.36,-.48],[.36,.48],[.13,.18]]},
  {id:2,p:[[-.36,-.48],[.36,-.48],[.13,-.18],[-.13,-.18]]},
  {id:3,p:[[-.13,.18],[.13,.18],[.36,.48],[-.36,.48]]},
 ];
 const positions=[],uvs=[],panels=[],indices=[],steps=40;
 for(const {id,p}of patches){const offset=positions.length/3;
  for(let v=0;v<=steps;v++)for(let u=0;u<=steps;u++){
   const a=u/steps,b=v/steps;
   const x=(p[0][0]*(1-a)+p[1][0]*a)*(1-b)+(p[3][0]*(1-a)+p[2][0]*a)*b;
   const z=(p[0][1]*(1-a)+p[1][1]*a)*(1-b)+(p[3][1]*(1-a)+p[2][1]*a)*b;
   positions.push(x,0,z);uvs.push(x/.72+.5,.5-z/.96);panels.push(id);
  }
  for(let v=0;v<steps;v++)for(let u=0;u<steps;u++){const a=offset+v*(steps+1)+u,b=a+1,c=a+steps+1,d=c+1;indices.push(a,c,b,b,c,d);}
 }
 const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(positions,3));g.setAttribute('uv',new Float32BufferAttribute(uvs,2));g.setAttribute('paperPanel',new Float32BufferAttribute(panels,1));g.setIndex(indices);g.computeVertexNormals();return g;
}
