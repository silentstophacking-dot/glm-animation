import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame} from 'remotion';
import {AnomalyScene} from './lab-time-anomaly-proof';
import {discoveryActorAt} from './clock-discovery-motion';
const Scene:React.FC<{frame:number;id:string}>=({frame,id})=><AnomalyScene frame={frame} id={id} refinedClock performance={discoveryActorAt(frame)}/>;
export const ClockDiscoveryPerformance:React.FC=()=>{const f=useCurrentFrame();return <AbsoluteFill style={{backgroundColor:'#161C2A'}}><Scene frame={f} id="discovery-v3"/><Audio src={staticFile('lab-discovery-v3/soundtrack.m4a')}/></AbsoluteFill>};
export const ClockDiscoveryBoard:React.FC=()=> <svg viewBox="0 0 1920 1848" width="100%" height="100%"><rect width="1920" height="1848" fill="#111522"/>{[{f:440,label:'01  ATTENTION LEADS TO THE CLOCK'},{f:490,label:'02  THE SAME DETAILED CLOCK'},{f:552,label:'03  HOLD / REALISATION'},{f:615,label:'04  LOOK BACK BEFORE REACHING'},{f:660,label:'05  STOP SHORT / DOUBT'},{f:710,label:'06  WITHDRAW / STILL UNCERTAIN'}].map((s,i)=><g key={s.f} transform={`translate(${i%2*960} ${Math.floor(i/2)*616})`}><text x="28" y="40" fill="#F5E7D4" fontFamily="Arial,sans-serif" fontSize="24">{s.label}</text><svg x="12" y="65" width="936" height="526.5" viewBox="0 0 1920 1080"><Scene frame={s.f} id={'discovery-board'+i}/></svg></g>)}</svg>;
