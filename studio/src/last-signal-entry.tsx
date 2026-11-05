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


const NightStreet:React.FC<{shot:'wide'|'double'|'empty';frame:number}>=({shot,frame})=>{
 const push=1+Math.min(.11,frame*.00035),ghost=shot==='double';
 return <svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <defs>
 <linearGradient id="night-sky" x2="0" y2="1"><stop stopColor="#080F1E"/><stop offset=".65" stopColor="#1C2C42"/><stop offset="1" stopColor="#253B4B"/></linearGradient>
 <linearGradient id="night-road" x2="0" y2="1"><stop stopColor="#293846"/><stop offset="1" stopColor="#0B1724"/></linearGradient>
 <linearGradient id="night-building" x2="1" y2=".4"><stop stopColor="#17293D"/><stop offset=".55" stopColor="#26364A"/><stop offset="1" stopColor="#0E1B2B"/></linearGradient>
 <radialGradient id="night-light"><stop stopColor="#F9D9A1" stopOpacity=".48"/><stop offset="1" stopColor="#F9D9A1" stopOpacity="0"/></radialGradient>
 <radialGradient id="night-vig"><stop offset=".35" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".8"/></radialGradient>
 </defs>
 <g transform={`translate(${960*(1-push)} ${540*(1-push)}) scale(${push})`}>
 <rect width="1920" height="1080" fill="url(#night-sky)"/>
 <path d="M0 780L790 670L1160 670L1920 780V1080H0Z" fill="url(#night-road)"/>
 <path d="M0 777L790 667L1160 667L1920 777" stroke="#A2A2A3" strokeWidth="7" opacity=".38"/>
 <path d="M900 1080L955 710L1010 710L1080 1080" fill="#9B9D97" opacity=".1"/>
 {Array.from({length:12},(_,i)=>{const left=i<6,idx=i%6,x=left?idx*143-60:1130+idx*156,w=145+(idx%3)*26,h=330+(idx*91%380),y=760-h;return <g key={i}>
 <path d={`M${x} ${y}l${w} -20v${h+150}l-${w} 20Z`} fill="url(#night-building)" stroke="#58677A" strokeWidth="3"/>
 <path d={`M${x+w} ${y-20}l28 15v${h+130}l-28 5Z`} fill="#101B2B"/>
 <path d={`M${x-7} ${y-5}l${w+14} -22`} stroke="#8490A0" strokeWidth="5"/>
 {Array.from({length:Math.floor(h/51)},(_,r)=>[0,1,2,3].map(c=><g key={r+'-'+c}><rect x={x+13+c*(w-20)/4} y={y+22+r*50} width="19" height="29" fill={(r*3+c+i)%7===0?'#B7A083':'#101F30'} stroke="#4D6074" strokeWidth="2"/><path d={`M${x+13+c*(w-20)/4} ${y+35+r*50}h19`} stroke="#73859A" opacity=".4"/></g>))}
 </g>})}
 <path d="M970 650V110" stroke="#465568" strokeWidth="20"/><path d="M960 132Q960 110 995 108h112" stroke="#637387" strokeWidth="16" fill="none"/>
 <path d="M1105 110l-12 44h-68l-15-44Z" fill="#A69A88" stroke="#D8C7AB" strokeWidth="5"/>
 <ellipse cx="1057" cy="145" rx="260" ry="300" fill="url(#night-light)"/>
 <path d="M1030 700L850 1080H1270L1100 700Z" fill="#D7B27C" opacity=".065"/>
 <path d="M0 890L1920 800" stroke="#6E8192" strokeWidth="5" opacity=".24"/>
 {Array.from({length:13},(_,i)=><path key={i} d={`M${i*160} 875l-35 220`} stroke="#92A4B4" strokeWidth="3" opacity=".1"/>)}
 {ghost&&<g transform="translate(1050 770) scale(1.15)">
 <ellipse cx="0" cy="4" rx="100" ry="22" fill="#040B12" opacity=".7"/>
 <CharacterTurnV5 id="daniel-double" x={0} y={0} yaw={-.62} headYaw={-.85} lighting="baseline" mood="calm" outfit="hoodie"/>
 </g>}
 <rect width="1920" height="1080" fill="url(#night-vig)"/>
 </g>
 </svg>;
};
const PhoneShot:React.FC<{frame:number;message:string}>=({frame,message})=><svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <defs><linearGradient id="phone-bg" x2=".7" y2="1"><stop stopColor="#283448"/><stop offset="1" stopColor="#080F1C"/></linearGradient><radialGradient id="phone-glow"><stop stopColor="#D4E3F2" stopOpacity=".25"/><stop offset="1" stopColor="#D4E3F2" stopOpacity="0"/></radialGradient></defs>
 <rect width="1920" height="1080" fill="url(#phone-bg)"/>
 {Array.from({length:20},(_,i)=><path key={i} d={`M${i*120-100} 0l-450 1080`} stroke="#9DB5CA" strokeWidth="2" opacity=".07"/>)}
 <ellipse cx="960" cy="550" rx="540" ry="570" fill="url(#phone-glow)"/>
 <g transform={`translate(${Math.sin(frame*.018)*5} ${Math.cos(frame*.015)*4})`}>
 <rect x="655" y="65" width="610" height="970" rx="94" fill="#080D16" stroke="#8495A8" strokeWidth="18"/>
 <rect x="679" y="90" width="562" height="922" rx="71" fill="#111D2D" stroke="#34475D" strokeWidth="5"/>
 <rect x="844" y="105" width="235" height="37" rx="18" fill="#050A13"/>
 <text x="725" y="202" fontSize="43" fill="#E3EAF0" fontFamily="Arial" fontWeight="bold">2:17</text>
 <path d="M726 259H1190" stroke="#667B8D" strokeWidth="2" opacity=".6"/>
 <rect x="710" y="330" width="500" height="320" rx="30" fill="#26374A" stroke="#B6A49C" strokeWidth="4"/>
 <text x="750" y="396" fontSize="32" fontFamily="Arial" fill="#E7A39B">EMERGENCY MESSAGE</text>
 {message.split('|').map((line,i)=><text key={i} x="750" y={485+i*65} fontFamily="Arial" fontWeight="bold" fontSize={line.length>19?35:44} fill="#F2E9DF">{line}</text>)}
 <circle cx="960" cy="949" r="8" fill="#7D91A4"/>
 </g></svg>;
const Reveal:React.FC<{frame:number}>=({frame})=><svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <defs><linearGradient id="reveal" x2="0" y2="1"><stop stopColor="#152439"/><stop offset="1" stopColor="#050912"/></linearGradient><radialGradient id="edge"><stop stopColor="#E4B590" stopOpacity=".25"/><stop offset="1" stopColor="#E4B590" stopOpacity="0"/></radialGradient></defs>
 <rect width="1920" height="1080" fill="url(#reveal)"/>
 <path d="M0 0H1920V1080H0Z" fill="#090E1A" opacity=".5"/>
 <path d="M1450 0L1900 0V1080L1400 1080Z" fill="#2B3442"/>
 <path d="M1430 0V1080" stroke="#5F6977" strokeWidth="22"/>
 <ellipse cx="1490" cy="500" rx="440" ry="560" fill="url(#edge)"/>
 <g transform="translate(890 965) scale(1.45)"><CharacterTurnV5 id="daniel-final" x={0} y={0} yaw={.25} headYaw={.7} lighting="baseline" mood="surprised" outfit="hoodie"/></g>
 {frame>40&&<g transform="translate(1530 950) scale(1.6)"><CharacterTurnV5 id="second-presence" x={0} y={0} yaw={-.65} headYaw={-.75} lighting="baseline" mood="calm" outfit="hoodie"/></g>}
 <rect width="1920" height="1080" fill="#030711" opacity={Math.max(0,(frame-105)/45)}/>
 </svg>;
const LastSignalFilm:React.FC=()=>{
 const f=useCurrentFrame();
 const shot=f<195?<PhoneShot frame={f} message="DO NOT LOOK|OUTSIDE."/>:
 f<510?<Apartment/>:
 f<830?<NightStreet frame={f-510} shot="empty"/>:
 f<1110?<NightStreet frame={f-830} shot="double"/>:
 f<1275?<PhoneShot frame={f-1110} message="THAT IS YOU.|30 SECONDS|FROM NOW."/>:
 f<1430?<Apartment/>:
 f<1510?<PhoneShot frame={f-1430} message="YOU HAVE|ALREADY LOOKED."/>:
 <Reveal frame={f-1510}/>;
 return <AbsoluteFill style={{backgroundColor:'#080D17'}}>{shot}</AbsoluteFill>;
};
const Root=()=> <><Composition id="LastSignalApartmentCheckpoint" component={Apartment} durationInFrames={360} fps={30} width={1920} height={1080}/><Composition id="LastSignalFilm" component={LastSignalFilm} durationInFrames={1635} fps={30} width={1920} height={1080}/></>;
registerRoot(Root);
