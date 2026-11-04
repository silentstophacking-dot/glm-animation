import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CharacterTurnV5,turnV5At} from './character-turn-v5';
const Back:React.FC<{floor:number}>=({floor})=><>
 <defs><linearGradient id="turn-bg" x2="0" y2="1"><stop stopColor="#39313F"/><stop offset="1" stopColor="#191E2C"/></linearGradient></defs>
 <rect width="1920" height="1080" fill="url(#turn-bg)"/>
 <path d={`M80 ${floor}H1840`} stroke="#84737C" strokeWidth="2"/>
</>;
export const CharacterTurnV5Proof:React.FC=()=>{
 const f=useCurrentFrame(),s=turnV5At(f);
 return <svg viewBox="0 0 1920 1080" width="100%" height="100%">
  <Back floor={930}/>
  <g fontFamily="Arial,sans-serif" fill="#F5E7D4"><text x="85" y="90" fontSize="36">CHARACTER TURN V5</text><text x="85" y="139" fontSize="24" fill="#C4B5BC">Front → three-quarter → profile</text></g>
  <CharacterTurnV5 id="turn-proof" x={960} y={930} scale={2.1} yaw={s.body} headYaw={s.head}/>
  <g stroke="#D9B58B" opacity=".5"><path d="M916 937v9m-6 -4h12M984 937v9m-6 -4h12"/></g>
 </svg>;
};
export const CharacterTurnV5Board:React.FC=()=> <svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <Back floor={900}/>
 <g fontFamily="Arial,sans-serif" fill="#F5E7D4"><text x="70" y="80" fontSize="38">TURN V5 — KEY VIEWS</text><text x="70" y="128" fontSize="24" fill="#C4B5BC">Shared head size, body proportions and floor baseline. Fixed heel contacts.</text></g>
 {[{yaw:0,label:'FRONT',x:340},{yaw:.5,label:'THREE-QUARTER',x:960},{yaw:1,label:'PROFILE',x:1580}].map(v=><g key={v.yaw}>
  <text x={v.x} y="210" textAnchor="middle" fill="#F5E7D4" fontFamily="Arial,sans-serif" fontSize="28">{v.label}</text>
  <CharacterTurnV5 id={'turn-view'+v.yaw} x={v.x} y={900} scale={1.75} yaw={v.yaw}/>
  <CharacterTurnV5 id={'turn-solid'+v.yaw} x={v.x+150} y={900} scale={.65} yaw={v.yaw} solid/>
 </g>)}
 <text x="960" y="1008" textAnchor="middle" fill="#D6C6C6" fontFamily="Arial,sans-serif" fontSize="25">View-dependent shoulders, garment planes, arm overlap and eye occlusion — fixed camera.</text>
</svg>;
