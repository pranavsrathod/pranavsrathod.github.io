import * as THREE from 'three';

// Deterministic geometry and vertex colours keep the close-up editable without
// replacing the user's original Blender scene or adding texture downloads.
export function createContactFood(){
 const group=new THREE.Group();group.name='Two wada pavs with red chutney';
 let seed=41;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
 const bread=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.83});
 const fried=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.96});
 const chutney=new THREE.MeshStandardMaterial({color:0xa52512,roughness:.94});
 const crisp=new THREE.MeshStandardMaterial({color:0xb87918,roughness:1});
 const crumbGeometry=new THREE.IcosahedronGeometry(1,0);
 const noise=(x,y,z)=>Math.sin(x*73+y*97)*Math.cos(z*89-x*31);
 function bun(){
  // A single C-shaped bread profile: the slit stops at the rear quarter,
  // leaving a continuous baked hinge instead of two stacked burger buns.
  const outline=new THREE.Shape();
  outline.moveTo(.063,.040);
  outline.bezierCurveTo(.081,.009,.042,.008,0,.008);
  outline.bezierCurveTo(-.058,.006,-.073,.027,-.073,.069);
  outline.bezierCurveTo(-.074,.120,-.046,.153,0,.153);
  outline.bezierCurveTo(.049,.154,.077,.138,.072,.114);
  outline.bezierCurveTo(.041,.109,-.017,.098,-.037,.078);
  outline.bezierCurveTo(-.024,.058,.032,.047,.063,.040);
  const ring=outline.getPoints(14),positions=[],colors=[],indices=[],rings=40,n=ring.length;
  for(let j=0;j<=rings;j++){
   const u=j/rings*2-1,round=Math.pow(Math.max(0,1-Math.pow(Math.abs(u),5)),.42);
   for(let k=0;k<n;k++){
    const q=ring[k],z=q.x*round,y=.073+(q.y-.073)*round,x=u*.075;
    positions.push(x,y,z);
    const cut=k>=57,grain=noise(x*11,y*9,z*11);
    const toast=THREE.MathUtils.smoothstep(y,.07,.15);
    const c=new THREE.Color(cut?0xf1d7a2:0xe4ae63);
    if(!cut)c.lerp(new THREE.Color(0x984316),toast*.72);
    c.multiplyScalar(1+grain*.035);colors.push(c.r,c.g,c.b);
    if(j<rings&&k<n-1){const v=j*n+k;indices.push(v,v+1,v+n,v+1,v+n+1,v+n);}
   }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.setIndex(indices);g.computeVertexNormals();
  const mesh=new THREE.Mesh(g,bread);mesh.name='Pav — connected three-quarter slit';return mesh;
 }
 function vada(){
  const g=new THREE.IcosahedronGeometry(1,4),p=g.attributes.position,colors=[];
  for(let i=0;i<p.count;i++){
   const x=p.getX(i),y=p.getY(i),z=p.getZ(i),n=noise(x,y,z),r=1+n*.075;
   p.setXYZ(i,x*.063*r,y*.037*r,z*.060*r);
   const c=new THREE.Color(0xe9a632).lerp(new THREE.Color(0x8e480d),(n+1)*.19);colors.push(c.r,c.g,c.b);
  }
  g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.computeVertexNormals();
  const m=new THREE.Mesh(g,fried);m.position.set(0,.070,.020);return m;
 }
 function flecks(parent,material,count,position){
  const mesh=new THREE.InstancedMesh(crumbGeometry,material,count),dummy=new THREE.Object3D();
  for(let i=0;i<count;i++){
   position(dummy.position,i);dummy.rotation.set(random()*3,random()*3,random()*3);
   const s=.0012+random()*.0018;dummy.scale.set(s,s*.6,s*1.15);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate=true;parent.add(mesh);
 }
 for(const [x,z,angle] of [[.045,-.10,-.12],[-.005,.025,.12]]){
  const pav=new THREE.Group();pav.position.set(x,.012,z);pav.rotation.y=angle;pav.scale.setScalar(.80);group.add(pav);
  pav.name='Wada pav '+(group.children.length);pav.userData.draggablePav=true;pav.add(bun(),vada());
  // Red garlic chutney on both cut faces, visible around the filling.
  for(const y of [.048,.101]){
   const spread=new THREE.Mesh(new THREE.SphereGeometry(1,28,12),chutney);
   spread.scale.set(.060,.003,.048);spread.position.set(0,y,.020);pav.add(spread);
   flecks(pav,chutney,65,(p)=>{const a=random()*Math.PI*2,r=Math.sqrt(random())*.071;p.set(Math.cos(a)*r,y+.004+random()*.002,Math.sin(a)*r*.92);});
  }
  flecks(pav,crisp,95,(p)=>{const a=random()*Math.PI*2,y=(random()-.5)*1.6,r=Math.sqrt(1-y*y);p.set(Math.cos(a)*r*.064,.073+y*.038,Math.sin(a)*r*.061);});
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(.068,32),new THREE.MeshBasicMaterial({color:0x3c2415,transparent:true,opacity:.16,depthWrite:false}));
  shadow.rotation.x=-Math.PI/2;shadow.position.set(0,.002,0);shadow.scale.y=.9;pav.add(shadow);
 }
 flecks(group,chutney,30,(p)=>p.set(-.055+random()*.11,.018,.055+random()*.03));
 const green=new THREE.MeshStandardMaterial({color:0x42671c,roughness:.7});
 for(const shift of [0,.025]){
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.11+shift,.023,-.03),new THREE.Vector3(-.08+shift,.027,.03),new THREE.Vector3(-.03+shift,.022,.085)]);
  const g=new THREE.TubeGeometry(curve,18,.006,8,false);const p=g.attributes.position;
  // Taper the chilli toward its tip using the curve centre.
  for(let i=0;i<p.count;i++){const t=Math.floor(i/9)/18,center=curve.getPointAt(t),v=new THREE.Vector3().fromBufferAttribute(p,i);v.sub(center).multiplyScalar(1-t*.92).add(center);p.setXYZ(i,v.x,v.y,v.z);}
  g.computeVertexNormals();group.add(new THREE.Mesh(g,green));
 }
 return group;
}
