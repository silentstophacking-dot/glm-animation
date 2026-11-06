import React from 'react';
import {CharacterTurnV5} from './episodes/probability-control/character-turn-v5';
const ease=(x:number)=>{const t=Math.max(0,Math.min(1,x));return t*t*(3-2*t)};
export const OlderEthan:React.FC<{id:string;frame:number;x?:number;y?:number}>=({id,frame,x=960,y=950})=><g transform={`translate(${x} ${y})`}>
 <CharacterTurnV5 id={id} x={0} y={0} scale={2.15} yaw={-.2} headYaw={-.2} outfit="puffer-black" lighting="baseline"/>
 <path d="M-40 -666l24 -11 15 9M24 -668l14 -8" stroke="#B8BEC2" strokeWidth="9" fill="none"/>
 <path d="M18 -660L-23 -604" stroke="#C1807C" strokeWidth="7" strokeLinecap="round"/>
 <path d="M21 -661L-20 -605" stroke="#E2AAA1" strokeWidth="2" strokeLinecap="round"/>
 </g>;
export const FacelessFigure:React.FC<{id:string;frame:number;x?:number;y?:number;opacity?:number}>=({id,frame,x=960,y=1050,opacity=1})=><g transform={`translate(${x} ${y})`} opacity={opacity}>
 <defs><linearGradient id={id+'body'} x2="1"><stop stopColor="#070A11"/><stop offset=".5" stopColor="#1C2532"/><stop offset="1" stopColor="#020409"/></linearGradient></defs>
 <ellipse cy="10" rx="90" ry="19" fill="#020409" opacity=".8"/>
 <path d="M-48 0L-30 -300Q-80 -360 -68 -500Q-56 -560 -20 -555H20Q56 -560 68 -500Q80 -360 30 -300L48 0H12L0 -280L-12 0Z" fill={`url(#${id}body)`} stroke="#344050" strokeWidth="3"/>
 <path d="M-60 -485Q-95 -355 -125 -185M60 -485Q95 -355 125 -185" fill="none" stroke="#090C15" strokeWidth="30" strokeLinecap="round"/>
 <path d="M-125 -185l-18 70m18 -70l10 70M125 -185l-15 70m15 -70l24 70" stroke="#090C15" strokeWidth="11" fill="none"/>
 <ellipse cy="-585" rx="46" ry="66" fill="#090D17" stroke="#3B4351" strokeWidth="4"/>
 </g>;
export const DoorMechanism:React.FC<{id:string;frame:number;openAt?:number;closeAt?:number;knock?:boolean}>=({id,frame,openAt=9999,closeAt=9999,knock=false})=>{
 const open=ease((frame-openAt)/19)*(1-ease((frame-closeAt)/10));
 const pulse=knock&&[24,37,50].some(f=>Math.abs(frame-f)<3)?3:0;
 return <g transform="translate(795 135)">
 <defs><linearGradient id={id+'grain'} x2="1"><stop stopColor="#281E25"/><stop offset=".5" stopColor="#644A47"/><stop offset="1" stopColor="#261C25"/></linearGradient></defs>
 <rect x="-12" y="-12" width="570" height="760" fill="#101722" stroke="#AE947B" strokeWidth="25"/>
 <rect x="8" y="5" width="530" height="725" fill="#B48D69" opacity={open}/>
 <g transform={`translate(${pulse} 0) scale(${1-open*.91} 1)`}>
 <rect width="540" height="730" fill={`url(#${id}grain)`} stroke="#B18D76" strokeWidth="10"/>
 <rect x="35" y="42" width="470" height="300" fill="none" stroke="#977761" strokeWidth="13"/>
 <rect x="35" y="375" width="470" height="305" fill="none" stroke="#977761" strokeWidth="13"/>
 <circle cx="450" cy="438" r="23" fill="#B9A17D" stroke="#E4CBA0" strokeWidth="5"/>
 <circle cx="268" cy="310" r="12" fill="#101823" stroke="#D3B28A" strokeWidth="7"/>
 <text x="270" y="125" textAnchor="middle" fill="#D5B995" fontFamily="Arial" fontSize="44" fontWeight="bold">213</text>
 </g></g>;
};
export const DoorStoryBeat:React.FC<{shot:number;frame:number}>=({shot,frame})=>{
 if(![0,3,7,8].includes(shot))return null;
 return <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
 {shot===0&&<DoorMechanism id="door-knock" frame={frame} knock/>}
 {shot===3&&<><rect width="1920" height="1080" fill="#0B1320"/><rect x="700" y="115" width="520" height="840" fill="#263240" stroke="#B49C83" strokeWidth="25"/><OlderEthan id="older-real" frame={frame}/><ellipse cx="960" cy="540" rx="560" ry="480" fill="none" stroke="#16151B" strokeWidth="240"/></>}
 {shot===7&&<FacelessFigure id="figure" frame={frame} opacity={ease((frame-85)/25)}/>}
 {shot===8&&<><DoorMechanism id="door-final" frame={frame} openAt={5} closeAt={58}/><g transform={`translate(${420+frame*9} 960) scale(1.7)`}><CharacterTurnV5 id="ethan-running" x={0} y={0} yaw={.7} headYaw={.85} outfit="puffer-black" lighting="baseline" mood="surprised"/></g><FacelessFigure id="creature-final" frame={frame} x={-180+frame*9} opacity={ease((frame-8)/15)}/></>}
 </svg>;
};
