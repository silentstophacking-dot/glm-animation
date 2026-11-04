import React from 'react';
import {useCurrentFrame} from 'remotion';
import {LabRoomDepthScene} from './lab-room-depth';
import {pufferRoomPerformanceAt,pufferPerformanceCamera} from './puffer-room-performance-motion';
const Scene:React.FC<{frame:number;id:string}>=({frame,id})=><LabRoomDepthScene id={id} frame={frame} camera={pufferPerformanceCamera(frame)} performance={pufferRoomPerformanceAt(frame)}/>;
export const PufferRoomPerformance:React.FC=()=>{const f=useCurrentFrame();return <svg viewBox="0 0 1920 1080" width="100%" height="100%"><Scene frame={f} id="puffer-performance"/></svg>};
export const PufferRoomPerformanceBoard:React.FC=()=> <svg viewBox="0 0 1920 1230" width="100%" height="100%">
 <rect width="1920" height="1230" fill="#111522"/>
 {[{f:32,label:'01  NOTICE / WEIGHT TRANSFER'},{f:81,label:'02  WALK / PLANTED SUPPORT'},{f:184,label:'03  PRESS / HAND CONTACT'},{f:211,label:'04  RECOIL / FREE-ARM BRACE'}].map((s,i)=><g key={s.f} transform={`translate(${i%2*960} ${Math.floor(i/2)*615})`}>
 <text x="32" y="43" fill="#F5E7D4" fontFamily="Arial,sans-serif" fontSize="26">{s.label}</text>
 <svg x="12" y="65" width="936" height="526.5" viewBox="0 0 1920 1080"><Scene frame={s.f} id={'puffer-board'+i}/></svg>
 </g>)}
</svg>;
