import React from 'react';
import {SlenderCharacter} from './slender-character';
import {slenderAt,BUTTON,auditSlender} from './slender-mechanics';
import {camT} from '../../engine/anim';
auditSlender();
const Scene:React.FC<{frame:number;id:string;camera:string}>=({frame,id,camera})=>{
 const {x,pose}=slenderAt(frame),active=frame>=174;
 return <g transform={camera}>
  <defs>
   <linearGradient id={id+'wall'} x2="0" y2="1"><stop stopColor="#322B3F"/><stop offset="1" stopColor="#192334"/></linearGradient>
   <linearGradient id={id+'sky'} x2="0" y2="1"><stop stopColor="#BC8779"/><stop offset="1" stopColor="#6C627E"/></linearGradient>
   <radialGradient id={id+'light'}><stop stopColor="#F5C885" stopOpacity=".24"/><stop offset="1" stopColor="#F5C885" stopOpacity="0"/></radialGradient>
  </defs>
  <rect x="-1000" y="-1000" width="4000" height="3000" fill={`url(#${id}wall)`}/>
  <rect y="780" width="1920" height="500" fill="#3B3541"/>
  <g stroke="#A19091" strokeWidth="2" opacity=".18">
   {[0,1,2,3,4,5,6,7,8].map(i=><path key={i} d={`M${i*270-100} 1200L${680+i*60} 780`}/>)}
   <path d="M0 880H1920M0 1010H1920"/>
  </g>
  <rect x="160" y="160" width="610" height="555" rx="8" fill={`url(#${id}sky)`} stroke="#151925" strokeWidth="18"/>
  <path d="M170 620L260 570L340 605L410 551L510 600L590 565L760 616V705H170Z" fill="#33384F"/>
  <circle cx="650" cy="300" r="42" fill="#F5CA94" opacity=".8"/>
  <path d="M460 165V710M165 430H765" stroke="#302A3B" strokeWidth="13"/>
  <ellipse cx="580" cy="620" rx="520" ry="470" fill={`url(#${id}light)`}/>
  <rect x="1160" y="250" width="480" height="240" rx="9" fill="#192838" stroke="#545569" strokeWidth="5"/>
  <path d="M1200 420L1280 360L1370 390L1450 310L1590 350" fill="none" stroke={active?'#75C9BB':'#718394'} strokeWidth="6"/>
  <ellipse cx="950" cy="888" rx="160" ry="14" fill="#10121D" opacity=".5"/>
  <path d="M850 580V883M1070 580V883" stroke="#171C28" strokeWidth="18"/>
  <path d="M838 578H1090" stroke="#65606A" strokeWidth="18" strokeLinecap="round"/>
  <path d="M850 854H1070" stroke="#232735" strokeWidth="10"/>
  <rect x="830" y="504" width="118" height="66" rx="7" fill="#292E3D" stroke="#191C28" strokeWidth="5"/>
  <circle cx={BUTTON.x} cy={BUTTON.y} r="11" fill={active?'#88DBBE':'#CF986C'} stroke="#E5C398" strokeWidth="2"/>
  <SlenderCharacter x={x} y={890} scale={1.5} pose={pose}/>
  <path d="M60 1080V130M1860 1080V130" stroke="#10131D" strokeWidth="90" opacity=".65"/>
 </g>;
};
export const SlenderMotionBoard:React.FC=()=> <svg viewBox="0 0 1920 1230" width="100%" height="100%">
 <rect width="1920" height="1230" fill="#111522"/>
 {[
  {f:12,label:'01  NOTICE',cam:camT(960,540,1)},
  {f:72,label:'02  STEP & TRANSFER WEIGHT',cam:camT(960,540,1)},
  {f:166,label:'03  CONTACT — SHARED PROP',cam:camT(820,555,1.45)},
  {f:214,label:'04  REACT & SETTLE',cam:camT(755,550,1.5)},
 ].map((s,i)=><g key={s.f} transform={`translate(${i%2*960} ${Math.floor(i/2)*615})`}>
  <text x="40" y="45" fontFamily="Arial,sans-serif" fontSize="29" fill="#FFF0DB">{s.label}</text>
  <svg x="12" y="65" width="936" height="526.5" viewBox="0 0 1920 1080"><Scene frame={s.f} id={'board'+i} camera={s.cam}/></svg>
 </g>)}
</svg>;
