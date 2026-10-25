import {BufferGeometry,Float32BufferAttribute} from 'three';

// One connected sheet: neighbouring folds share vertices, including corners.
// UVs stay in the original newspaper rectangle as the paper gathers and opens.
export function createPaperGeometry(){
 const positions=[],uvs=[],indices=[],columns=72,rows=96;
 for(let row=0;row<=rows;row++)for(let column=0;column<=columns;column++){
  const u=column/columns,v=row/rows;
  positions.push((u-.5)*.72,.005,(v-.5)*.96);uvs.push(u,1-v);
 }
 for(let row=0;row<rows;row++)for(let column=0;column<columns;column++){
  const a=row*(columns+1)+column,b=a+1,c=a+columns+1,d=c+1;
  indices.push(a,c,b,b,c,d);
 }
 const geometry=new BufferGeometry();
 geometry.setAttribute('position',new Float32BufferAttribute(positions,3));
 geometry.setAttribute('uv',new Float32BufferAttribute(uvs,2));
 geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
