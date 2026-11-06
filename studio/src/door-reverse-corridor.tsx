import React from 'react';
import {RoomCuboid,RoomFace,RoomLine,W,floorEllipse} from './episodes/probability-control/lab-room-geometry';
import {planeTransform,WorldCamera} from './episodes/probability-control/pseudo-depth-camera';

// The reverse camera looks DOWN THE OTHER END of the SAME KIND of corridor.
// It is a purpose-built matching shot, not a flipped screen-space background.
// It anchors lamps, exit signs, mailbox details and the apparition in world coordinates.
const smooth=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t)};
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
export const DoorReverseCorridor:React.FC<{frame:number;id:string;danger?:boolean}>=({frame:f,id,danger=false})=>{
 const p=smooth((f-60)/90);
 const c:WorldCamera={x:danger?lerp(-90,80,p):-90,y:385,z:danger?lerp(-240,-70,p):-260,focal:1200};
 const glow=danger?smooth((f-60)/38):0;
 const flicker=danger?1-.25*smooth((f-18)/15)+.22*Math.sin(f*.28):1;
 const u=(k:string)=>`url(#${id+k})`;
 const cuboid=(x0:number,x1:number,y0:number,y1:number,z0:number,z1:number,front:string,top='#A38C83',side='#2A2B3C')=><RoomCuboid box={{x0,x1,y0,y1,z0,z1}} camera={c} front={front} top={top} side={side}/>;
 const worldZ=danger?lerp(1370,350,p):1500;
 const worldX=danger?lerp(45,20,p):0;
 return <svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <defs>
 <linearGradient id={id+'back'} x1="0" y1="0" x2=".15" y2="1"><stop stopColor="#483748"/><stop offset=".55" stopColor="#302B40"/><stop offset="1" stopColor="#171F31"/></linearGradient>
 <linearGradient id={id+'floor'} x2=".2" y2="1"><stop stopColor="#6B5261"/><stop offset=".5" stopColor="#3C3546"/><stop offset="1" stopColor="#172335"/></linearGradient>
 <radialGradient id={id+'red'}><stop stopColor="#CB6177" stopOpacity=".62"/><stop offset=".35" stopColor="#D86C79" stopOpacity=".24"/><stop offset="1" stopColor="#793B54" stopOpacity="0"/></radialGradient>
 <radialGradient id={id+'amber'}><stop stopColor="#F2CBA6" stopOpacity=".4"/><stop offset="1" stopColor="#EFBF9D" stopOpacity="0"/></radialGradient>
 <radialGradient id={id+'vig'}><stop offset=".35" stopColor="#070E19" stopOpacity="0"/><stop offset="1" stopColor="#050812" stopOpacity=".68"/></radialGradient>
 </defs>
 <rect width="1920" height="1080" fill="#1A2334"/>
 <RoomFace points={[W(-1200,0,1790),W(1200,0,1790),W(1200,880,1790),W(-1200,880,1790)]} camera={c} fill={u('back')}/>
 <RoomFace points={[W(-1200,0,-750),W(-1200,0,1790),W(-1200,880,1790),W(-1200,880,-750)]} camera={c} fill="#2B2B3F"/>
 <RoomFace points={[W(1200,0,1790),W(1200,0,-750),W(1200,880,-750),W(1200,880,1790)]} camera={c} fill="#243044"/>
 <RoomFace points={[W(-1200,880,-750),W(-1200,880,1790),W(1200,880,1790),W(1200,880,-750)]} camera={c} fill="#171F30"/>
 <RoomFace points={[W(-1200,0,-750),W(1200,0,-750),W(1200,0,1790),W(-1200,0,1790)]} camera={c} fill={u('floor')}/>
 {Array.from({length:16},(_,i)=><RoomLine key={'tile-x'+i} a={W(-1200+i*160,1,-750)} b={W(-1200+i*160,1,1790)} camera={c} stroke="#BCA3A5" width={1.7} opacity={.16}/>)}
 {Array.from({length:16},(_,i)=><RoomLine key={'tile-z'+i} a={W(-1200,1,-680+i*150)} b={W(1200,1,-680+i*150)} camera={c} stroke="#BCA3A5" width={1.7} opacity={.14}/>)}
 {/* Light fixtures, trim and door frames recede at different rates and never drift independently. */}
 {[-1190,1150].map((x,i)=><g key={i}>
 {cuboid(x,x+44,0,36,-400,1760,'#57424C')}
 {cuboid(x,x+44,750,773,-400,1760,'#5A4855')}
 {Array.from({length:6},(_,j)=>cuboid(x,x+55,30,810,-350+j*365,-326+j*365,'#41394B','#A18982'))}
 </g>)}
 {[0,470,940,1400].map((z,i)=><g key={'lamp'+i}>
 {cuboid(-170,170,839,864,z,z+82,'#5C5461','#AD9990')}
 <g transform={planeTransform(W(0,831,z+45),c)}>
 <rect x="-140" y="-12" width="280" height="28" rx="5" fill="#E2C6B0" opacity={Math.max(.15,flicker)} />
 <ellipse cx="0" cy="10" rx="250" ry="140" fill={u('amber')} opacity={Math.max(.1,flicker)} />
 </g></g>)}
 {[420,1000].map(z=><g key={'unit'+z}>
 {cuboid(-1170,-780,0,720,z,z+25,'#333747')}
 {cuboid(800,1170,0,720,z,z+25,'#2B374A')}
 <g transform={planeTransform(W(900,545,z-7),c)}>
 <rect x="-100" y="-180" width="200" height="245" rx="5" fill="#222E40" stroke="#A59183" strokeWidth="6"/>
 <path d="M-90 -145H90M-90 -34H90M-90 50H90" stroke="#7E8188" strokeWidth="5"/>
 <circle cx="64" cy="-78" r="9" fill="#DCC3A1"/>
 </g>
 </g>)}
 <RoomFace points={[W(-190,3,-750),W(190,3,-750),W(190,3,1680),W(-190,3,1680)]} camera={c} fill="#483947" opacity=".72"/>
 {[-185,185].map(x=><RoomLine key={x} a={W(x,4,-750)} b={W(x,4,1680)} camera={c} stroke="#BBA39B" opacity={.38} width={4}/>)}
 {cuboid(-265,265,0,760,1760,1785,'#182336','#3C3342')}
 <g transform={planeTransform(W(0,590,1755),c)}>
 <rect x="-135" y="-35" width="270" height="70" fill="#2C6159" stroke="#90C8AD" strokeWidth="7"/>
 <text x="0" y="18" fontSize="44" fill="#D6F2DC" fontWeight="bold" fontFamily="Arial" textAnchor="middle">EXIT</text>
 </g>
 {danger&&<g>
  <path d={floorEllipse(worldX,worldZ,100,47,c)} fill="#05080E" opacity=".7"/>
  <g transform={planeTransform(W(worldX,0,worldZ),c)} opacity={glow}>
  <ellipse cy="-380" rx="280" ry="440" fill={u('red')} opacity=".72"/>
  {/* Original elongated silhouette with no visible facial features. */}
  <path d="M-57 -6L-31 -328Q-82 -388 -58 -479Q-47 -523 -23 -532H24Q48 -520 60 -475Q81 -382 31 -326L57 -6H15L0 -286L-16 -6Z" fill="#080B15" stroke="#606679" strokeWidth="4"/>
  <path d="M-58 -468Q-120 -358 -112 -142M58 -468Q119 -365 116 -143" fill="none" stroke="#121726" strokeWidth="32" strokeLinecap="round"/>
  <path d="M-114 -142l-29 62M-114 -142l15 64M115 -143l-7 75M115 -143l28 70" stroke="#0E1421" strokeWidth="12" fill="none" strokeLinecap="round"/>
  <ellipse cy="-557" rx="50" ry="70" fill="#080B15" stroke="#9194A5" strokeWidth="4"/>
  <path d="M-24 -602Q0 -613 22 -592" stroke="#ADB0B3" strokeWidth="2" opacity=".25" fill="none"/>
  </g>
  </g>}
 {danger&&<rect width="1920" height="1080" fill="#060814" opacity={Math.max(.12,.42-.27*glow)} />}
 <rect width="1920" height="1080" fill={u('vig')}/>
 </svg>;
};
