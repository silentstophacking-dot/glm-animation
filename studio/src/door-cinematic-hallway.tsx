import React from 'react';
import {RoomCuboid as Box,RoomFace,RoomLine,W,floorEllipse} from './episodes/probability-control/lab-room-geometry';
import {planeTransform,WorldCamera} from './episodes/probability-control/pseudo-depth-camera';
import {CharacterTurnV5} from './episodes/probability-control/character-turn-v5';
import {discoveryActorAt} from './episodes/probability-control/clock-discovery-motion';
import {characterV2At} from './episodes/probability-control/character-v2-motion';
const smooth=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t)};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const CinematicHallway:React.FC<{id:string;shot:number;frame:number}>=({id,shot,frame:f})=>{
 const old=shot===3||shot===5,blackout=shot===7;
 const open=shot===8?smooth((f-6)/20)*(1-smooth((f-58)/12)):0;
 const c:WorldCamera={x:old?-35:mix(-200,-120,smooth(f/210)),y:old?420:370,z:old?110:mix(-320,-230,smooth(f/240)),focal:1200};
 const url=(s:string)=>`url(#${id+s})`;
 const slab=(x0:number,x1:number,y0:number,y1:number,z0:number,z1:number,front:string,side='#2B303F',top='#9D857B')=><Box box={{x0,x1,y0,y1,z0,z1}} camera={c} front={front} side={side} top={top}/>;
 const width=500,hinge=-260,theta=open*1.45,z=980;
 const doorPt=(x:number,y:number)=>W(hinge+x*Math.cos(theta),y,z+x*Math.sin(theta));
 const progress=smooth(f/70);
 const reaction=discoveryActorAt(Math.min(712,shot===2?440+Math.floor(f*.6):shot===6?612+Math.floor(f*.45):552));
 const walk=characterV2At(Math.min(140,Math.max(0,f+20)));
 return <svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <defs>
 <linearGradient id={id+'wall'} x2=".85" y2="1"><stop stopColor="#443544"/><stop offset=".6" stopColor="#302B40"/><stop offset="1" stopColor="#142133"/></linearGradient>
 <linearGradient id={id+'floor'} x2=".2" y2="1"><stop stopColor="#5D4C58"/><stop offset=".45" stopColor="#3E3748"/><stop offset="1" stopColor="#152132"/></linearGradient>
 <linearGradient id={id+'wood'} x2="1" y2=".2"><stop stopColor="#775654"/><stop offset=".33" stopColor="#47313B"/><stop offset="1" stopColor="#231D2C"/></linearGradient>
 <radialGradient id={id+'light'}><stop stopColor="#EAC09B" stopOpacity=".54"/><stop offset="1" stopColor="#EAC09B" stopOpacity="0"/></radialGradient>
 <radialGradient id={id+'vignette'}><stop offset=".35" stopColor="#090F1C" stopOpacity="0"/><stop offset="1" stopColor="#090F1C" stopOpacity=".72"/></radialGradient>
 <filter id={id+'shadow'}><feGaussianBlur stdDeviation="5"/></filter>
 </defs>
 <rect width="1920" height="1080" fill="#172235"/>
 <RoomFace points={[W(-1450,0,1040),W(1450,0,1040),W(1450,900,1040),W(-1450,900,1040)]} camera={c} fill={url('wall')}/>
 <RoomFace points={[W(-1450,0,-600),W(-1450,0,1040),W(-1450,900,1040),W(-1450,900,-600)]} camera={c} fill="#282637"/>
 <RoomFace points={[W(1450,0,1040),W(1450,0,-600),W(1450,900,-600),W(1450,900,1040)]} camera={c} fill="#1C293A"/>
 <RoomFace points={[W(-1450,900,-600),W(-1450,900,1040),W(1450,900,1040),W(1450,900,-600)]} camera={c} fill="#141D2C"/>
 <RoomFace points={[W(-1450,0,-600),W(1450,0,-600),W(1450,0,1040),W(-1450,0,1040)]} camera={c} fill={url('floor')}/>
 {Array.from({length:17},(_,i)=><RoomLine key={i} a={W(-1450+i*180,1,-600)} b={W(-1450+i*180,1,1040)} camera={c} stroke="#A98F94" opacity={.16}/>)}
 {Array.from({length:13},(_,i)=><RoomLine key={i} a={W(-1450,1,-540+i*128)} b={W(1450,1,-540+i*128)} camera={c} stroke="#B09490" opacity={.16}/>)}
 {[-1450,1400].map((x,i)=><g key={i}>{slab(x,x+50,0,38,-550,1040,'#4B3C47')}{slab(x,x+50,690,715,-550,1040,'#564451')}{slab(x,x+50,830,860,-550,1040,'#383543')}{Array.from({length:7},(_,j)=>slab(x,x+65,38,830,-350+j*215,-330+j*215,'#3D3545','#242A39','#84777A'))}</g>)}
 {[-800,800].map((x,i)=><g key={i}>
 {slab(x-40,x+40,440,590,940,1010,'#574C56')}
 <g transform={planeTransform(W(x,575,930),c)}><circle r="245" fill={url('light')}/><path d="M-35 -10L-48 -95H48L35 -10Z" fill="#D7B897" stroke="#ECD2B5" strokeWidth="6"/><path d="M-25 -65H25" stroke="#FAE2BD" strokeWidth="4"/></g>
 </g>)}
 {slab(-340,350,0,815,1020,1040,'#0C1320')}
 {slab(-365,-318,0,840,920,1060,'#65505A')}
 {slab(350,395,0,840,920,1060,'#62505A')}
 {slab(-365,395,815,845,910,1070,'#67545D')}
 <RoomFace points={[doorPt(0,0),doorPt(width,0),doorPt(width,795),doorPt(0,795)]} camera={c} fill={url('wood')} stroke="#B19686"/>
 {[70,415].map(y=><RoomFace key={y} points={[doorPt(30,y),doorPt(width-30,y),doorPt(width-30,y+282),doorPt(30,y+282)]} camera={c} fill="none" stroke="#9D7E75"/>)}
 <g transform={planeTransform(doorPt(width-90,405),c)}><circle r="19" fill="#B79B74" stroke="#F0D1A4" strokeWidth="5"/><path d="M8 0h26" stroke="#E5CEAE" strokeWidth="8" strokeLinecap="round"/></g>
 <g transform={planeTransform(doorPt(250,690),c)}><rect x="-80" y="-35" width="160" height="65" rx="3" fill="#6E6060" stroke="#BAA189" strokeWidth="4"/><text textAnchor="middle" y="12" fontFamily="Arial" fontWeight="bold" fontSize="38" fill="#F1D5B0">213</text></g>
 <g transform={planeTransform(doorPt(250,510),c)}><circle r="14" fill="#091522" stroke="#E1C19A" strokeWidth="6"/></g>
 {slab(590,970,350,635,1000,1040,'#1D2939','#222938','#AB8980')}
 <g transform={planeTransform(W(765,615,993),c)}><path d="M-150 220L-80 143L-20 165L82 50L160 105" stroke="#9FB6B9" strokeWidth="6" fill="none"/>{[70,120,170].map(y=><path key={y} d={`M-155 ${y}H155`} stroke="#A6A6AF" strokeWidth="2" opacity=".12"/>)}</g>
 {slab(-1180,-760,0,570,920,1030,'#272A3B','#1C2637','#695A65')}
 {Array.from({length:4},(_,i)=>slab(-1150+i*95,-1082+i*95,110,450,890,965,['#615366','#44566C','#75636D'][i%3],'#272D3E','#A8978B'))}
 {old?<g transform={planeTransform(W(0,0,1160),c)}>
 <CharacterTurnV5 id={id+'older'} x={0} y={0} scale={1.8} yaw={-.24} headYaw={-.3} outfit="puffer-black" lighting="sunset"/>
 <path d="M-30 -590L-11 -605M17 -590L30 -604" stroke="#B3B8C0" strokeWidth="8"/>
 <path d="M19 -596L-21 -540" stroke="#B46D70" strokeWidth="8" strokeLinecap="round"/>
 </g>:null}
 {!old&&<g>
 <path d={floorEllipse(-250,130,86,35,c)} fill="#050C17" opacity=".4" filter={url('shadow')}/>
 <g transform={planeTransform(W(shot===8?mix(-220,50,progress):-240,0,shot===8?mix(110,900,progress):95),c)}>
 <CharacterTurnV5 id={id+'actor'} x={0} y={0} scale={1.55} yaw={shot===6?mix(.25,.94,smooth(f/95)):shot===8?.7:.32} headYaw={shot===6?mix(.3,1,smooth(f/80)):.4} outfit="puffer-black" lighting="sunset" mood={shot>=6?'surprised':'calm'} pose={shot===8?walk.pose:shot===2||shot===6?reaction.pose:undefined}/>
 </g></g>}
 {shot>=7&&<g transform={planeTransform(W(-50,0,-250),c)} opacity={shot===7?smooth((f-50)/30):smooth((f-12)/15)}>
 <ellipse cy="-480" rx="40" ry="65" fill="#050913" stroke="#303A49" strokeWidth="3"/>
 <path d="M-55 0L-35 -380Q-85 -420 -55 -480H55Q85 -420 35 -380L55 0H15L0 -300L-15 0Z" fill="#060C17" stroke="#283140" strokeWidth="3"/>
 <path d="M-55 -440L-105 -140M55 -440L105 -140" stroke="#07101B" strokeWidth="29" strokeLinecap="round"/>
 </g>}
 <rect width="1920" height="1080" fill={url('vignette')}/>
 {old&&<path d="M0 0H1920V1080H0Z M960 540m-570 0a570 455 0 1 0 1140 0a570 455 0 1 0 -1140 0" fill="#02050B" fillRule="evenodd" opacity=".85"/>}
 {blackout&&<rect width="1920" height="1080" fill="#030710" opacity={.62+.23*Math.sin(f*.28)}/>}
 </svg>;
};
