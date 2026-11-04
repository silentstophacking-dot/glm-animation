import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame} from 'remotion';
import {LabRoomDepthScene} from './lab-room-depth';
import {LabClock} from './lab-clock';
import {anomalyActorAt,anomalyShotAt,clockSecondsAt,ANOMALY_SHOTS,ACTIVATION_FRAME} from './lab-time-anomaly-motion';
const Scene:React.FC<{frame:number;id:string}>=({frame,id})=>{
 const shot=anomalyShotAt(frame),signal=frame<ACTIVATION_FRAME?.5+.45*Math.sin(frame*.23):.95;
 return <svg viewBox={shot.crop.join(' ')} width="100%" height="100%">
 {shot.clock?<><rect x="-10000" y="-10000" width="20000" height="20000" fill="#302C3D"/><LabClock camera={shot.camera} seconds={clockSecondsAt(frame)}/></>:<LabRoomDepthScene id={id} frame={frame} camera={shot.camera} performance={anomalyActorAt(frame)} clockSeconds={clockSecondsAt(frame)} signal={signal}/>}
 </svg>;
};
export const LabTimeAnomaly:React.FC=()=>{const f=useCurrentFrame();return <AbsoluteFill style={{backgroundColor:'#161C2A'}}><Scene frame={f} id="time-anomaly"/><Audio src={staticFile('lab-time-anomaly/soundtrack.m4a')}/></AbsoluteFill>};
export const LabTimeAnomalyBoard:React.FC=()=> <svg viewBox="0 0 1920 1848" width="100%" height="100%">
 <rect width="1920" height="1848" fill="#111522"/>
 {[100,248,337,395,490,602].map((frame,i)=><g key={frame} transform={`translate(${i%2*960} ${Math.floor(i/2)*616})`}>
 <text x="28" y="40" fill="#F5E7D4" fontFamily="Arial,sans-serif" fontSize="24">{String(i+1).padStart(2,'0')}  {ANOMALY_SHOTS[i].name}</text>
 <svg x="12" y="65" width="936" height="526.5" viewBox="0 0 1920 1080"><Scene frame={frame} id={'anomaly-board'+i}/></svg>
 </g>)}
</svg>;
