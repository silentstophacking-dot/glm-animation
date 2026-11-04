import React from 'react';
import {kf} from '../../engine/anim';
import {floorPolygon,planeTransform,projectWorld,WorldCamera,WorldPoint} from './pseudo-depth-camera';
const CX=-1320,CY=800;
const at=(x:number,y:number,z:number):WorldPoint=>({x:CX+x,y:CY+y,z});
export const clockInsertCameraAt=(f:number):WorldCamera=>({x:kf(f,[[450,-1190],[539,-1170]]),y:855,z:kf(f,[[450,1300],[539,1330]]),focal:1200});
export const CLOCK_INSERT_CROP:[number,number,number,number]=[480,490,480,270];
const ring=(r:number,z:number,c:WorldCamera)=>floorPolygon(Array.from({length:96},(_,i)=>at(r*Math.cos(i*Math.PI/48),r*Math.sin(i*Math.PI/48),z)),c);
/** Wall joints and cable conduit are fixed world geometry in both wide and insert views. */
export const ClockWallDetail:React.FC<{id:string;camera:WorldCamera;backdrop?:boolean}>=({id,camera:c,backdrop=false})=>{
 const u=(s:string)=>`url(#${id+s})`;
 return <g>
 <defs>
 <linearGradient id={id+'wall'} x2="1" y2=".7"><stop stopColor="#4B3B49"/><stop offset=".5" stopColor="#343140"/><stop offset="1" stopColor="#252D40"/></linearGradient>
 <linearGradient id={id+'light'} x2=".8" y2="1"><stop stopColor="#ECC69B" stopOpacity=".085"/><stop offset="1" stopColor="#ECC69B" stopOpacity="0"/></linearGradient>
 <filter id={id+'soft'} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.5"/></filter>
 </defs>
 {backdrop?<><path d={floorPolygon([at(-700,-400,800),at(700,-400,800),at(700,500,800),at(-700,500,800)],c)} fill={u('wall')}/><path d={floorPolygon([at(-400,210,799),at(240,80,799),at(300,-80,799),at(-350,50,799)],c)} fill={u('light')} filter={u('soft')}/></>:null}
 <g transform={planeTransform(at(0,0,799),c)}>
 <path d="M-134 -190V190M113 -190V190M-180 133H180" fill="none" stroke="#171F2F" strokeWidth="1.5" opacity=".55"/>
 <path d="M-132 -190V190M115 -190V190M-180 135H180" fill="none" stroke="#B19787" strokeWidth=".65" opacity=".3"/>
 <path d="M-160 -65H-142M120 74h32M-164 61h11M65 146h18" stroke="#C0A58F" strokeWidth=".4" opacity=".12"/>
 </g>
 {/* A shallow conduit and its clamp show the wall plane beyond the clock's casing. */}
 <g transform={planeTransform(at(132,0,794),c)}>
 <path d="M3 -180V180" stroke="#141E2C" strokeWidth="8" opacity=".25"/>
 <path d="M0 -180V180" stroke="#414552" strokeWidth="5"/>
 <path d="M-1.5 -180V180" stroke="#9F8F86" strokeWidth=".7" opacity=".65"/>
 {[-95,82].map(y=><g key={y} transform={`translate(0 ${y})`}><path d="M-6 -3H6V3H-6Z" fill="#44434F" stroke="#242A39" strokeWidth=".7"/><circle cx="-4" r=".7" fill="#A3978C"/><circle cx="4" r=".7" fill="#A3978C"/></g>)}
 </g>
 </g>;
};
/** Extruded case, recessed face, raised hands and a glass cover share physical depth. */
export const CinematicLabClock:React.FC<{id:string;camera:WorldCamera;seconds:number}>=({id,camera:c,seconds})=>{
 const u=(s:string)=>`url(#${id+s})`;
 const hand=(angle:number,length:number,width:number,z:number,color:string)=>{
  const a=angle*Math.PI/180,world=(x:number,y:number,depth:number)=>at(x*Math.cos(a)+y*Math.sin(a),-x*Math.sin(a)+y*Math.cos(a),depth);
  const points=[[-width,5],[-width*.65,-length+4],[0,-length],[width*.65,-length+4],[width,5],[0,7]];
  const shape=(dx:number,dy:number,depth:number)=>floorPolygon(points.map(([x,y])=>{const p=world(x,-y,depth);return {...p,x:p.x+dx,y:p.y+dy};}),c);
  // Positive clock angles turn clockwise in screen space, matching the archived clock.
  return <g><path d={shape(1.5,-1.5,774)} fill="#070F1D" opacity=".55"/><path d={shape(0,0,z)} fill={color} stroke="#192332" strokeWidth=".3"/><path d={floorPolygon([world(-width*.45,2,z-.2),world(-width*.25,length-4,z-.2),world(0,length-2,z-.2)],c)} fill="#F6D9AD" opacity=".55"/></g>;
 };
 return <g>
 <defs>
 <linearGradient id={id+'case'} x2=".9" y2="1"><stop stopColor="#C2A58B"/><stop offset=".12" stopColor="#8F807B"/><stop offset=".34" stopColor="#555766"/><stop offset=".7" stopColor="#252E41"/><stop offset="1" stopColor="#746E73"/></linearGradient>
 <linearGradient id={id+'bevel'} x2=".7" y2="1"><stop stopColor="#D6B597"/><stop offset=".25" stopColor="#6D6D76"/><stop offset=".7" stopColor="#222F43"/><stop offset="1" stopColor="#A49A91"/></linearGradient>
 <radialGradient id={id+'dial'} cx=".26" cy=".18" r=".95"><stop stopColor="#3A414B"/><stop offset=".55" stopColor="#222D3C"/><stop offset="1" stopColor="#111E30"/></radialGradient>
 <linearGradient id={id+'glass'} x2=".9" y2="1"><stop stopColor="#E4C6A6" stopOpacity=".11"/><stop offset=".3" stopColor="#D6DCE0" stopOpacity=".015"/><stop offset="1" stopColor="#557B93" stopOpacity=".08"/></linearGradient>
 <filter id={id+'shadow'} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
 <clipPath id={id+'glassClip'}><path d={ring(35.5,768,c)}/></clipPath>
 </defs>
 <g transform={planeTransform(at(8,-9,799),c)}><ellipse rx="45" ry="44" fill="#101927" opacity=".55" filter={u('shadow')}/></g>
 <g transform={planeTransform(at(0,47,796),c)}><rect x="-7" y="-6" width="14" height="12" rx="3" fill="#45414B" stroke="#242735"/><circle r="1.5" fill="#B19B87"/><path d="M-1 0H1" stroke="#3C3B46" strokeWidth=".6"/></g>
 <path d={ring(43,793,c)} fill="#1B2638" stroke="#111C2C" strokeWidth="1"/>
 {Array.from({length:64},(_,i)=>{
  const a=i*Math.PI/32,b=(i+1)*Math.PI/32,light=Math.max(0,-Math.cos(a)*.65+Math.sin(a)*.75);
  return <path key={i} d={floorPolygon([at(43*Math.cos(a),43*Math.sin(a),793),at(43*Math.cos(b),43*Math.sin(b),793),at(43*Math.cos(b),43*Math.sin(b),775),at(43*Math.cos(a),43*Math.sin(a),775)],c)} fill={`rgb(${Math.round(37+light*53)},${Math.round(45+light*41)},${Math.round(61+light*27)})`}/>;
 })}
 <path d={ring(43,775,c)} fill={u('case')} stroke="#1C2434" strokeWidth=".7"/>
 <path d={ring(40.5,774,c)} fill="#172336" stroke="#C9AD91" strokeWidth=".35"/>
 <path d={ring(38.7,773,c)} fill={u('bevel')}/>
 <path d={ring(35.5,774,c)} fill={u('dial')} stroke="#0C1829" strokeWidth="1.5"/>
 <g transform={planeTransform(at(0,0,773.5),c)}>
 {Array.from({length:60},(_,i)=><g key={i} transform={`rotate(${i*6})`}><path d={i%5?'M0 -32V-33.5':'M-.6 -29.6H.6V-33.5H-.6Z'} stroke={i%5?'#AB9F93':'#D2BDA4'} strokeWidth={i%5?.4:.3} fill={i%5?'none':'#C8B39B'} opacity={i%5?.65:1}/>{i%5===0?<path d="M-.6 -33.5V-29.6" stroke="#F0D2AA" strokeWidth=".3"/>:null}</g>)}
 {[['12',0,-21],['3',24,3],['6',0,28],['9',-24,3]].map(([n,x,y])=><text key={n} x={x} y={y} textAnchor="middle" fill="#DDCBB2" fontFamily="Arial,sans-serif" fontSize="6.5">{n}</text>)}
 <text y="17" textAnchor="middle" fill="#9A9EA2" fontFamily="Arial,sans-serif" fontSize="2.4" letterSpacing=".7">LAB • 04</text>
 <path d="M-8 20H8" stroke="#66757E" strokeWidth=".3"/>
 </g>
 {hand(seconds*.5-20,20,1.6,772.5,'#BBA68D')}
 {hand(seconds*6,29,.95,771.5,'#D4C5AE')}
 {hand(seconds*36+80,32,.3,770.5,'#DA9C77')}
 <g transform={planeTransform(at(0,0,770),c)}><circle r="3" fill="#1D2939" stroke="#B9A58E" strokeWidth=".6"/><circle r="1.35" fill="#CAB193"/><path d="M-1 -1Q0 -2 1 -1" fill="none" stroke="#FADEB4" strokeWidth=".35"/></g>
 <path d={ring(35.5,768,c)} fill={u('glass')}/>
 <g clipPath={u('glassClip')}><g transform={planeTransform(at(0,0,768),c)}>
 <path d="M-53 -10L-10 -53L17 -53L-53 17ZM-53 23L23 -53L29 -53L-53 29Z" fill="#F2D8BD" opacity=".055"/>
 <path d="M-29 -13Q-20 -32 3 -33" fill="none" stroke="#F4D7B4" strokeWidth=".6" opacity=".35"/>
 <path d="M14 32Q29 25 33 9" fill="none" stroke="#8BB0C3" strokeWidth=".5" opacity=".25"/>
 </g></g>
 </g>;
};
export function auditCinematicClock(){
 let minGap=Infinity;
 for(let f=450;f<540;f++){
  const c=clockInsertCameraAt(f);
  for(const z of [768,775,793,799]){const p=projectWorld(at(0,0,z),c);if(!Number.isFinite(p.x+p.y+p.scale))throw new Error('Invalid clock projection');}
  const front=projectWorld(at(43,0,775),c),rear=projectWorld(at(43,0,793),c);minGap=Math.min(minGap,Math.hypot(front.x-rear.x,front.y-rear.y));
 }
 if(minGap<.5)throw new Error('Case depth is not visible');
 return {frames:90,caseDepth:18,faceZ:774,handsZ:[772.5,771.5,770.5],glassZ:768,wallZ:800,minProjectedSideGap:minGap};
}
