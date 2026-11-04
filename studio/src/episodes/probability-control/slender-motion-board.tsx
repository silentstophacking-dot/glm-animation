import React from 'react';
import {SlenderCharacter} from './slender-character';
import {slenderAt,BUTTON,auditSlender} from './slender-mechanics';
import {LabBackground,LabForeground} from './cinematic-lab';
import {camT} from '../../engine/anim';
auditSlender();
const Scene:React.FC<{frame:number;id:string;camera:string}>=({frame,id,camera})=>{
 const {x,pose}=slenderAt(frame),active=frame>=174;
 return <g transform={camera}>
  <LabBackground id={id} soft={frame>=132}/>
  <ellipse cx="950" cy="888" rx="160" ry="14" fill="#10121D" opacity=".5"/>
  <path d="M850 580V883M1070 580V883" stroke="#171C28" strokeWidth="18"/>
  <path d="M838 578H1090" stroke="#65606A" strokeWidth="18" strokeLinecap="round"/>
  <path d="M850 854H1070" stroke="#232735" strokeWidth="10"/>
  <rect x="830" y="504" width="118" height="66" rx="7" fill="#292E3D" stroke="#191C28" strokeWidth="5"/>
  <circle cx={BUTTON.x} cy={BUTTON.y} r="11" fill={active?'#88DBBE':'#CF986C'} stroke="#E5C398" strokeWidth="2"/>
  <path d="M843 572H1084" stroke="#B19A86" strokeWidth="2" opacity=".5"/>
  <path d="M850 583L1074 583L1060 595H858Z" fill="#141722" opacity=".6"/>
  <path d="M922 566V577H966V583" stroke="#0F1723" strokeWidth="4" fill="none"/>
  <rect x="897" y="519" width="35" height="12" rx="2" fill="#121F2B"/>
  <path d="M901 525H928" stroke={active?'#86CDB6':'#7C746A'} strokeWidth="2"/>
  <g filter={`url(#${id}rim)`}><SlenderCharacter x={x} y={890} scale={1.5} pose={pose}/></g>
  <LabForeground id={id}/>
 </g>;
};
export const SlenderMotionBoard:React.FC=()=> <svg viewBox="0 0 1920 1230" width="100%" height="100%">
 <rect width="1920" height="1230" fill="#111522"/>
 {[
  {f:12,label:'01  NOTICE',cam:camT(960,540,1)},
  {f:72,label:'02  STEP & TRANSFER WEIGHT',cam:camT(960,540,1)},
  {f:166,label:'03  CONTACT — SHARED PROP',cam:camT(810,500,1.8)},
  {f:214,label:'04  REACT & SETTLE',cam:camT(770,395,2.05)},
 ].map((s,i)=><g key={s.f} transform={`translate(${i%2*960} ${Math.floor(i/2)*615})`}>
  <text x="40" y="45" fontFamily="Arial,sans-serif" fontSize="29" fill="#FFF0DB">{s.label}</text>
  <svg x="12" y="65" width="936" height="526.5" viewBox="0 0 1920 1080"><Scene frame={s.f} id={'board'+i} camera={s.cam}/></svg>
 </g>)}
</svg>;
