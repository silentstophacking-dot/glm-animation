import React from 'react';
import {useCurrentFrame} from 'remotion';
import {DepthScene} from './pseudo-depth-proof';
import {performanceCamera} from './performance-v3-motion';
export const PerformanceV3Proof:React.FC=()=>{
 const f=useCurrentFrame();
 return <svg viewBox="0 0 1920 1080" width="100%" height="100%">
  <DepthScene t={0} id="performance-v3" performanceFrame={f} camera={performanceCamera(f)}/>
 </svg>;
};
export const PerformanceV3Board:React.FC=()=> <svg viewBox="0 0 1920 1230" width="100%" height="100%">
 <rect width="1920" height="1230" fill="#111522"/>
 {[{f:32,t:'01  NOTICE / WEIGHT LOAD'},{f:81,t:'02  PASS / SUPPORT'},{f:184,t:'03  FOCUS / BUTTON PRESS'},{f:211,t:'04  RECOIL / BRACE'}].map((s,i)=><g key={s.f} transform={`translate(${i%2*960} ${Math.floor(i/2)*615})`}>
  <text x="40" y="45" fontFamily="Arial,sans-serif" fontSize="29" fill="#F5E7D4">{s.t}</text>
  <svg x="12" y="65" width="936" height="526.5" viewBox="0 0 1920 1080"><DepthScene t={0} id={'performance-board'+i} performanceFrame={s.f} camera={performanceCamera(s.f)}/></svg>
 </g>)}
</svg>;
