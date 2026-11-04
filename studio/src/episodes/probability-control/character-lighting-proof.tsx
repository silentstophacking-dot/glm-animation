import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CharacterTurnV5,turnV5At} from './character-turn-v5';
import {LabBackground} from './cinematic-lab';
export const SunsetCharacterScene:React.FC<{id:string;frame:number;lit?:boolean}>=({id,frame,lit=true})=>{
 const s=turnV5At(frame),u=(n:string)=>`url(#${id+n})`;
 return <g>
  <defs>
   <radialGradient id={id+'pool'}><stop stopColor="#D39D70" stopOpacity=".18"/><stop offset="1" stopColor="#D39D70" stopOpacity="0"/></radialGradient>
   <radialGradient id={id+'vignette'}><stop offset=".45" stopColor="#071020" stopOpacity="0"/><stop offset="1" stopColor="#071020" stopOpacity=".5"/></radialGradient>
   <linearGradient id={id+'beam'} x2=".6" y2="1"><stop stopColor="#F9D7A4" stopOpacity=".055"/><stop offset="1" stopColor="#F9D7A4" stopOpacity="0"/></linearGradient>
   <filter id={id+'shadow'} x="-40%" y="-150%" width="200%" height="400%"><feGaussianBlur stdDeviation="10"/></filter>
  </defs>
  <g transform="translate(-40 -160) scale(1.15)"><LabBackground id={id+'lab'} soft/></g>
  <path d="M270 210L890 210L1720 1080H460Z" fill={u('beam')}/>
  <ellipse cx="1000" cy="930" rx="440" ry="125" fill={u('pool')}/>
  {/* Window is up/left. Cast shade runs away across the same fixed floor. */}
  <path d="M1044 930L1118 930L1390 1000Q1370 1030 1300 1015Z" fill="#080F1D" opacity=".38" filter={u('shadow')}/>
  {[-16,16].map(x=><ellipse key={x} cx={1080+x*1.9} cy="932" rx="22" ry="4" fill="#090D17" opacity=".65"/>)}
  <CharacterTurnV5 id={id+'actor'} x={1080} y={930} scale={1.9} yaw={s.body} headYaw={s.head} lighting={lit?'sunset':'baseline'}/>
  <rect width="1920" height="1080" fill={u('vignette')}/>
 </g>;
};
export const CharacterSunsetLightingProof:React.FC=()=> <svg viewBox="0 0 1920 1080" width="100%" height="100%"><SunsetCharacterScene id="sunset-proof" frame={useCurrentFrame()}/></svg>;
export const CharacterSunsetLightingBoard:React.FC=()=> <svg viewBox="0 0 1920 1230" width="100%" height="100%">
 <rect width="1920" height="1230" fill="#111522"/>
 {[{f:60,lit:false,label:'BEFORE / SAME ROOM & POSE'},{f:60,lit:true,label:'SUNSET / WARM EDGE & COOL FILL'},{f:0,lit:true,label:'FRONT / LIGHT FROM THE WINDOW'},{f:140,lit:true,label:'PROFILE / LIGHT STAYS IN THE ROOM'}].map((s,i)=><g key={i} transform={`translate(${i%2*960} ${Math.floor(i/2)*615})`}>
  <text x="32" y="43" fill="#F5E7D4" fontFamily="Arial,sans-serif" fontSize="25">{s.label}</text>
  <svg x="12" y="65" width="936" height="526.5" viewBox="0 0 1920 1080"><SunsetCharacterScene id={'sunset-board'+i} frame={s.f} lit={s.lit}/></svg>
 </g>)}
</svg>;
