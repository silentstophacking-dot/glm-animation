import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame} from 'remotion';
import type {RoomActorPerformance} from './lab-room-geometry';
import {LabRoomDepthScene} from './lab-room-depth';
import {CinematicLabClock,ClockWallDetail,clockInsertCameraAt,CLOCK_INSERT_CROP} from './cinematic-lab-clock';
import {LabClock} from './lab-clock';
import {anomalyActorAt,anomalyShotAt,clockSecondsAt,ANOMALY_SHOTS,ACTIVATION_FRAME} from './lab-time-anomaly-motion';
export const AnomalyScene:React.FC<{frame:number;id:string;refinedClock?:boolean;performance?:RoomActorPerformance}>=({frame,id,refinedClock=false,performance})=>{
 const shot=anomalyShotAt(frame),signal=frame<ACTIVATION_FRAME?.5+.45*Math.sin(frame*.23):.95;
 const clockCamera=clockInsertCameraAt(frame),crop=shot.clock&&refinedClock?CLOCK_INSERT_CROP:shot.crop;
 return <svg viewBox={crop.join(' ')} width="100%" height="100%">
 {shot.clock?refinedClock?<><ClockWallDetail id={id+'wall'} camera={clockCamera} backdrop/><CinematicLabClock id={id+'clock'} camera={clockCamera} seconds={clockSecondsAt(frame)}/></>:<><rect x="-10000" y="-10000" width="20000" height="20000" fill="#302C3D"/><LabClock camera={shot.camera} seconds={clockSecondsAt(frame)}/></>:<LabRoomDepthScene id={id} frame={frame} camera={shot.camera} performance={performance??anomalyActorAt(frame)} clockSeconds={clockSecondsAt(frame)} signal={signal} clockStyle={refinedClock?'cinematic':'simple'}/>}
 </svg>;
};
export const LabTimeAnomaly:React.FC=()=>{const f=useCurrentFrame();return <AbsoluteFill style={{backgroundColor:'#161C2A'}}><AnomalyScene frame={f} id="time-anomaly"/><Audio src={staticFile('lab-time-anomaly/soundtrack.m4a')}/></AbsoluteFill>};
export const LabTimeAnomalyBoard:React.FC=()=> <svg viewBox="0 0 1920 1848" width="100%" height="100%">
 <rect width="1920" height="1848" fill="#111522"/>
 {[100,248,337,395,490,602].map((frame,i)=><g key={frame} transform={`translate(${i%2*960} ${Math.floor(i/2)*616})`}>
 <text x="28" y="40" fill="#F5E7D4" fontFamily="Arial,sans-serif" fontSize="24">{String(i+1).padStart(2,'0')}  {ANOMALY_SHOTS[i].name}</text>
 <svg x="12" y="65" width="936" height="526.5" viewBox="0 0 1920 1080"><AnomalyScene frame={frame} id={'anomaly-board'+i}/></svg>
 </g>)}
</svg>;
