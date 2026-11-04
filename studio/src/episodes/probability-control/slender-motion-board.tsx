import React from 'react';
import {characterV2At} from './character-v2-motion';
import {CinematicCharacterV2} from './cinematic-character-v2';
import {SlenderCharacter} from './slender-character';
import {slenderAt,balancedAt,auditSlender} from './slender-mechanics';
import {LabBackground,LabForeground} from './cinematic-lab';
import {LabConsole} from './lab-console';
import {camT} from '../../engine/anim';
auditSlender();
export const SlenderMotionScene:React.FC<{frame:number;id:string;camera:string;build?:'slim'|'balanced'|'fuller';character?:'classic'|'cinematic-v2'}>=({frame,id,camera,build='slim',character='classic'})=>{
 const {x,pose}=character==='cinematic-v2'?characterV2At(frame):build==='balanced'?balancedAt(frame):slenderAt(frame),active=frame>=174;
 return <g transform={camera}>
  <LabBackground id={id} soft={frame>=132}/>
  <LabConsole id={id} active={active}/>
  <g filter={`url(#${id}rim)`}>{character==='cinematic-v2'?<CinematicCharacterV2 id={id+'-actor'} x={x} y={890} scale={1.5} pose={pose} mood={frame<32?'curious':'calm'}/>:<SlenderCharacter x={x} y={890} scale={1.5} pose={pose} build={build}/>}</g>
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
  <svg x="12" y="65" width="936" height="526.5" viewBox="0 0 1920 1080"><SlenderMotionScene frame={s.f} id={'board'+i} camera={s.cam}/></svg>
 </g>)}
</svg>;
