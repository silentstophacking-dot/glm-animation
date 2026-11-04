import React from 'react';
import {turnV5Geometry} from './character-turn-v5';
import {projectWorld,floorPolygon,WorldCamera,WorldPoint} from './pseudo-depth-camera';
export const ROOM_FRAMES=210;
export const W=(x:number,y:number,z:number):WorldPoint=>({x,y,z});
export function roomCameraAt(f:number):WorldCamera{
 const q=Math.max(0,Math.min(1,(f-12)/186)),t=q*q*(3-2*q);
 return {x:-130+260*t,y:350+30*t,z:-50+170*t,focal:1200};
}
export type RoomBox={x0:number;x1:number;y0:number;y1:number;z0:number;z1:number};
export const ROOM_ACTOR={origin:W(-260,0,-40),scale:1.5,yaw:.45};
export const FOREGROUND_BENCHES:RoomBox[]=[
 {x0:-1000,x1:-500,y0:175,y1:205,z0:-420,z1:-240},
 {x0:480,x1:1100,y0:175,y1:205,z0:-420,z1:-240},
];
export const boxCorners=(b:RoomBox)=>[
 W(b.x0,b.y0,b.z0),W(b.x1,b.y0,b.z0),W(b.x1,b.y1,b.z0),W(b.x0,b.y1,b.z0),
 W(b.x0,b.y0,b.z1),W(b.x1,b.y0,b.z1),W(b.x1,b.y1,b.z1),W(b.x0,b.y1,b.z1),
];
export const RoomFace:React.FC<{points:WorldPoint[];camera:WorldCamera;fill:string;stroke?:string;opacity?:number}>=({points,camera,fill,stroke='#171E2B',opacity=1})=><path d={floorPolygon(points,camera)} fill={fill} stroke={stroke} strokeWidth="1.25" strokeLinejoin="round" opacity={opacity}/>;
export const RoomCuboid:React.FC<{box:RoomBox;camera:WorldCamera;front?:string;top?:string;side?:string}>=({box:b,camera:c,front='#363846',top='#70636A',side='#252B3B'})=>{
 const p=boxCorners(b),faces:{indices:number[];fill:string}[]=[];
 if(c.x<b.x0)faces.push({indices:[0,3,7,4],fill:side});
 if(c.x>b.x1)faces.push({indices:[1,5,6,2],fill:side});
 if(c.y>b.y1)faces.push({indices:[3,2,6,7],fill:top});
 if(c.y<b.y0)faces.push({indices:[0,4,5,1],fill:side});
 faces.push({indices:[0,1,2,3],fill:front});
 return <g>{faces.map((face,i)=><RoomFace key={i} points={face.indices.map(n=>p[n])} camera={c} fill={face.fill}/>)}</g>;
};
export const RoomLine:React.FC<{a:WorldPoint;b:WorldPoint;camera:WorldCamera;stroke:string;width?:number;opacity?:number}>=({a,b,camera,stroke,width=2,opacity=1})=>{
 const p=projectWorld(a,camera),q=projectWorld(b,camera);
 return <path d={`M${p.x} ${p.y}L${q.x} ${q.y}`} fill="none" stroke={stroke} strokeWidth={width} opacity={opacity} strokeLinecap="round"/>;
};
export function floorEllipse(x:number,z:number,rx:number,rz:number,c:WorldCamera){
 return floorPolygon(Array.from({length:32},(_,i)=>{const a=i*Math.PI/16;return W(x+rx*Math.cos(a),0,z+rz*Math.sin(a));}),c);
}
export function auditLabRoom(){
 let maxFootContact=0,maxGlassSupport=0;
 const checks=[W(-284,0,-40),W(-236,0,-40),W(-110,0,-25),W(100,0,-25),W(600,0,450),W(960,0,450)];
 for(let f=0;f<ROOM_FRAMES;f++){
  const c=roomCameraAt(f);
  for(const point of checks){
   const p=projectWorld(point,c);
   if(!Number.isFinite(p.x+p.y+p.scale)||p.scale<=0)throw new Error('Invalid projection at '+f);
  }
  // Actual actor heel local coordinates transformed onto the floor plane.
  for(const heel of turnV5Geometry(ROOM_ACTOR.yaw).heels){
   const heelX=ROOM_ACTOR.origin.x+heel*ROOM_ACTOR.scale;
   const root=projectWorld(ROOM_ACTOR.origin,c);
   const a={x:root.x+heel*ROOM_ACTOR.scale*root.scale,y:root.y};
   const b=projectWorld(W(heelX,0,ROOM_ACTOR.origin.z),c);
   maxFootContact=Math.max(maxFootContact,Math.hypot(a.x-b.x,a.y-b.y));
  }
  for(const [i,x] of [-620,520].entries()){
   const support=FOREGROUND_BENCHES[i];
   if(x<support.x0||x>support.x1||-350<support.z0||-350>support.z1)throw new Error('Glass outside bench');
   const base=projectWorld(W(x,205,-350),c),bench=projectWorld(W(x,support.y1,-350),c);
   maxGlassSupport=Math.max(maxGlassSupport,Math.hypot(base.x-bench.x,base.y-bench.y));
  }
 }
 if(Math.max(maxFootContact,maxGlassSupport)>.001)throw new Error('Room support contact lost');
 const movement=(z:number)=>Math.abs(projectWorld(W(0,0,z),roomCameraAt(209)).x-projectWorld(W(0,0,z),roomCameraAt(0)).x);
 const travel=[movement(-350),movement(0),movement(800),movement(1350)];
 if(!travel.every((v,i)=>i===0||travel[i-1]>v))throw new Error('Depth travel ordering invalid');
 return {frames:ROOM_FRAMES,maxFootContact,maxGlassSupport,travel:{foreground:travel[0],interaction:travel[1],wall:travel[2],city:travel[3]},camera:'one truck/dolly; no camera orbit',scope:'projection checks; rendered visual review remains required'};
}
