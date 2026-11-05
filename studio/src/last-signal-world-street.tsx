import React from 'react';
import {planeTransform,floorPolygon,projectWorld,WorldCamera,WorldPoint} from './episodes/probability-control/pseudo-depth-camera';
import {CharacterTurnV5} from './episodes/probability-control/character-turn-v5';
// Every building, prop, and actor uses one fixed world coordinate system.
// The camera moves; the world does not. Approved pseudo-depth-camera.ts is the projection source.
const W=(x:number,y:number,z:number):WorldPoint=>({x,y,z});
const ease=(t:number)=>{const a=Math.max(0,Math.min(1,t));return a*a*(3-2*a)};
const face=(pts:WorldPoint[],c:WorldCamera,fill:string,stroke?:string)=><path d={floorPolygon(pts,c)} fill={fill} stroke={stroke} strokeWidth="2"/>;
const Cuboid:React.FC<{x:number;z:number;w:number;h:number;d:number;c:WorldCamera;id:string;light?:boolean}>=({x,z,w,h,d,c,id,light=false})=>{
 const front=[W(x,0,z),W(x+w,0,z),W(x+w,h,z),W(x,h,z)];
 const side=[W(x+w,0,z),W(x+w,0,z+d),W(x+w,h,z+d),W(x+w,h,z)];
 const roof=[W(x,h,z),W(x+w,h,z),W(x+w,h,z+d),W(x,h,z+d)];
 return <g>{face(side,c,'#162338','#425067')}{face(front,c,'#2B394C','#526176')}{face(roof,c,'#4A4856','#7C7481')}
 {Array.from({length:Math.floor(h/78)},(_,r)=>Array.from({length:Math.floor(w/64)},(_,col)=>{
  const px=x+24+col*64,py=35+r*78,p=projectWorld(W(px,py,z-2),c),s=p.scale;
  return <g key={r+'-'+col} transform={`translate(${p.x} ${p.y}) scale(${s})`}><rect x="0" y="-42" width="32" height="48" fill={(r*3+col*7+id.length)%8===0?'#B89B7C':'#14263A'} stroke="#748395" strokeWidth="3"/><path d="M16 -42V6M0 -18H32" stroke="#718092" strokeWidth="2"/><path d="M-6 12h44" stroke="#A0A2A1" opacity=".4" strokeWidth="3"/></g>;
 }))}</g>;
};
export const WorldStreet:React.FC<{frame:number;id:string;showDouble?:boolean;disappear?:boolean}>=({frame,id,showDouble=true,disappear=false})=>{
 const t=ease(frame/180),c:WorldCamera={x:-110+220*t,y:410,z:-720+90*t,focal:1200};
 const road=[W(-1600,0,-250),W(1600,0,-250),W(1600,0,1800),W(-1600,0,1800)];
 const sidewalk=[W(500,3,-250),W(1600,3,-250),W(1600,3,1800),W(500,3,1800)];
 const lamp=projectWorld(W(230,0,330),c),person=projectWorld(W(260,0,360),c);
 const alpha=disappear?1-ease((frame-55)/18):1;
 return <svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <defs><linearGradient id={id+'sky'} x2="0" y2="1"><stop stopColor="#0B1728"/><stop offset="1" stopColor="#27384C"/></linearGradient><linearGradient id={id+'street'} x2="0" y2="1"><stop stopColor="#374353"/><stop offset="1" stopColor="#111D2D"/></linearGradient><radialGradient id={id+'light'}><stop stopColor="#EED0A3" stopOpacity=".65"/><stop offset="1" stopColor="#EED0A3" stopOpacity="0"/></radialGradient><radialGradient id={id+'vig'}><stop offset=".4" stopColor="#050B14" stopOpacity="0"/><stop offset="1" stopColor="#050B14" stopOpacity=".7"/></radialGradient></defs>
 <rect width="1920" height="1080" fill={`url(#${id}sky)`}/>
 {face(road,c,`url(#${id}street)`)}
 {face(sidewalk,c,'#374452','#697382')}
 {Array.from({length:12},(_,i)=>{const z=i*185-100;return <g key={i}>{face([W(-30,2,z),W(30,2,z),W(30,2,z+65),W(-30,2,z+65)],c,'#B7A59A')}{face([W(470,4,z),W(480,4,z),W(480,4,z+185),W(470,4,z+185)],c,'#6B7A89')}</g>})}
 {Array.from({length:7},(_,i)=><Cuboid key={'left'+i} id={'left'+i} c={c} x={-1250+i%2*60} z={i*310-100} w={430} h={480+i%3*90} d={250}/>)}
 {Array.from({length:6},(_,i)=><Cuboid key={'right'+i} id={'right'+i} c={c} x={690+i%2*50} z={i*350-40} w={410} h={540+i%3*100} d={260}/>)}
 <g transform={planeTransform(W(230,0,330),c)}>
 <path d="M0 0V-540" stroke="#596777" strokeWidth="16"/><path d="M0 -540H150" stroke="#77818A" strokeWidth="12"/><path d="M145 -540v40" stroke="#7D8790" strokeWidth="9"/><ellipse cx="145" cy="-493" rx="60" ry="23" fill="#D8B99A" stroke="#747D84" strokeWidth="5"/><circle cx="145" cy="-480" r="300" fill={`url(#${id}light)`}/><path d="M90 -475L-200 0H440L200 -475Z" fill="#E3C197" opacity=".065"/>
 </g>
 {showDouble&&<g opacity={alpha} transform={planeTransform(W(260,0,360),c)}><ellipse cy="0" rx="55" ry="16" fill="#07101C" opacity=".8"/><CharacterTurnV5 id={id+'actor'} x={0} y={0} scale={1.2} yaw={.1} headYaw={-.15} outfit="hoodie" lighting="baseline" mood="calm"/></g>}
 {Array.from({length:35},(_,i)=>{const p=projectWorld(W((i*83)%2200-1100,750-(frame*5+i*63)%700,(i*179)%1450),c);return <path key={i} d={`M${p.x} ${p.y}l-6 28`} stroke="#B0C7D3" strokeWidth={Math.max(.5,p.scale*2)} opacity=".25"/>})}
 <rect width="1920" height="1080" fill={`url(#${id}vig)`}/>
 </svg>;
};
