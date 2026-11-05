import React from 'react';
import {AbsoluteFill,Composition,registerRoot,useCurrentFrame} from 'remotion';
import {CharacterTurnV5} from './episodes/probability-control/character-turn-v5';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const Apartment:React.FC=()=>{
 const f=useCurrentFrame(),u=(s:string)=>'url(#ls-'+s+')',push=1+Math.min(.075,f*.00022),look=clamp((f-190)/115);
 return <AbsoluteFill style={{background:'#0B1523'}}>
 <svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <defs>
 <linearGradient id="ls-wall" x2=".8" y2="1"><stop stopColor="#283344"/><stop offset=".58" stopColor="#192637"/><stop offset="1" stopColor="#0A1422"/></linearGradient>
 <linearGradient id="ls-floor" x2="0" y2="1"><stop stopColor="#3E3A43"/><stop offset="1" stopColor="#101824"/></linearGradient>
 <linearGradient id="ls-glass" x2="0" y2="1"><stop stopColor="#12283E"/><stop offset="1" stopColor="#071322"/></linearGradient>
 <linearGradient id="ls-wood" x2="0" y2="1"><stop stopColor="#655052"/><stop offset=".16" stopColor="#403B45"/><stop offset="1" stopColor="#211F2C"/></linearGradient>
 <radialGradient id="ls-lamp"><stop stopColor="#F8C995" stopOpacity=".32"/><stop offset="1" stopColor="#F8C995" stopOpacity="0"/></radialGradient>
 <radialGradient id="ls-vignette"><stop offset=".4" stopColor="#060D18" stopOpacity="0"/><stop offset="1" stopColor="#060D18" stopOpacity=".75"/></radialGradient>
 <clipPath id="ls-window"><path d="M1040 165L1610 133V742L1040 730Z"/></clipPath>
 </defs>
 <g transform={`translate(${960*(1-push)} ${540*(1-push)}) scale(${push})`}>
 <path d="M0 0H1920V1080H0Z" fill={u('wall')}/>
 <path d="M0 820L1920 752V1080H0Z" fill={u('floor')}/>
 {Array.from({length:11},(_,i)=><path key={i} d={`M${i*230-450} 1080L${i*190+10} 790`} stroke="#8B7480" strokeWidth="2" opacity=".15"/>)}
 <path d="M0 0L350 0L285 810L0 1080Z" fill="#1B2535"/>
 <path d="M0 0L350 0L285 810" fill="none" stroke="#647082" strokeWidth="5" opacity=".3"/>
 <path d="M1020 148L1630 112V761L1020 749Z" fill="#0A0F1C" stroke="#6E7381" strokeWidth="21"/>
 <path d="M1040 165L1610 133V742L1040 730Z" fill={u('glass')}/>
 <g clipPath={u('window')}>
 <path d="M1040 520L1610 500V742L1040 730Z" fill="#111F30"/>
 {Array.from({length:18},(_,i)=>{const x=1018+i*38,h=125+(i*53%220),y=680-h;return <g key={i}><path d={`M${x} ${y}h${27+i%3*6}v400h-${27+i%3*6}Z`} fill={i%2?'#172537':'#223045'} stroke="#405067" strokeWidth="1"/>{Array.from({length:Math.floor(h/24)},(_,r)=><g key={r}>{[0,1].map(c=><rect key={c} x={x+5+c*12} y={y+12+r*24} width="5" height="9" fill={(i+r+c)%4===0?'#E8B884':'#3A5365'} opacity=".75"/>)}</g>)}</g>})}
 <path d="M1050 575L1600 555" stroke="#9CA5B5" strokeWidth="1" opacity=".35"/>
 {Array.from({length:22},(_,i)=><path key={i} d={`M${1030+i*28} 150l-28 590`} stroke="#9AB0C0" opacity=".11" strokeWidth="2"/>)}
 </g>
 <path d="M1312 149V747M1020 456L1629 439" stroke="#414D5D" strokeWidth="20"/>
 <path d="M1028 161L1618 129" stroke="#B2A29C" strokeWidth="3" opacity=".5"/>
 <path d="M220 706L755 690L822 830L180 850Z" fill={u('wood')} stroke="#83737C" strokeWidth="3"/>
 <path d="M232 720L742 706" stroke="#BEA08E" strokeWidth="3" opacity=".38"/>
 <path d="M280 834V1020M740 824V995" stroke="#191D2A" strokeWidth="25"/>
 <path d="M385 675L500 672L530 700L355 704Z" fill="#222F3D" stroke="#7E8490" strokeWidth="3"/>
 <path d="M370 699L530 696" stroke="#8BA7BA" strokeWidth="3"/>
 <path d="M85 290L360 280V605L85 617Z" fill="#172334" stroke="#616779" strokeWidth="12"/>
 <path d="M110 313L335 305V575L110 583Z" fill="#283D50"/>
 {Array.from({length:8},(_,i)=><path key={i} d={`M${120+i*24} 340v225`} stroke="#547084" strokeWidth="2" opacity=".2"/>)}
 <circle cx="775" cy="610" r="330" fill={u('lamp')}/>
 <path d="M780 190V570" stroke="#817A84" strokeWidth="9"/><path d="M720 574Q780 525 840 574L870 620H692Z" fill="#5B5056" stroke="#B39A8D" strokeWidth="5"/>
 <ellipse cx="780" cy="625" rx="160" ry="55" fill="#E8B88B" opacity=".16"/>
 <g transform="translate(940 935) scale(1.13)">
 <CharacterTurnV5 id="daniel-apartment" x={0} y={0} yaw={look*.65} headYaw={look} lighting="baseline" mood={f>230?'surprised':'calm'} outfit="hoodie"/>
 </g>
 <rect x="0" y="0" width="1920" height="1080" fill={u('vignette')}/>
 </g>
 <g transform="translate(130 76)"><rect width="310" height="94" rx="15" fill="#101B2B" stroke="#8296A6" strokeWidth="2"/><text x="28" y="59" fontFamily="Arial" fontSize="43" fontWeight="bold" fill="#E6DFD4">02:17 AM</text></g>
 {f>70&&f<210&&<g transform="translate(470 85)"><rect width="1000" height="180" rx="22" fill="#111B2B" stroke="#BE8C82" strokeWidth="4"/><text x="44" y="58" fontFamily="Arial" fontSize="30" fill="#E2A69A">EMERGENCY ALERT</text><text x="44" y="126" fontFamily="Arial" fontWeight="bold" fontSize="53" fill="#F3E8DC">DO NOT LOOK OUTSIDE.</text></g>}
 </svg></AbsoluteFill>;
};
export const LastSignalApartmentCheckpoint=Apartment;
const Root=()=> <Composition id="LastSignalApartmentCheckpoint" component={Apartment} durationInFrames={360} fps={30} width={1920} height={1080}/>;
registerRoot(Root);
