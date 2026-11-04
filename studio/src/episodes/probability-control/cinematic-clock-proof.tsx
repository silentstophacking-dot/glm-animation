import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame} from 'remotion';
import {AnomalyScene} from './lab-time-anomaly-proof';
export const LabTimeAnomalyV2:React.FC=()=>{const f=useCurrentFrame();return <AbsoluteFill style={{backgroundColor:'#161C2A'}}><AnomalyScene frame={f} id="anomaly-v2" refinedClock/><Audio src={staticFile('lab-time-anomaly/soundtrack.m4a')}/></AbsoluteFill>};
export const ClockInsertV2Proof:React.FC=()=>{const f=useCurrentFrame();return <AbsoluteFill style={{backgroundColor:'#161C2A'}}><AnomalyScene frame={450+f} id="clock-v2-proof" refinedClock/><Audio src={staticFile('lab-time-anomaly/soundtrack.m4a')} trimBefore={450} trimAfter={540}/></AbsoluteFill>};
export const CinematicClockStill:React.FC=()=> <AnomalyScene frame={490} id="clock-v2-still" refinedClock/>;
export const ClockInsertV2Board:React.FC=()=> <svg viewBox="0 0 1920 616" width="100%" height="100%"><rect width="1920" height="616" fill="#111522"/>{[false,true].map((refinedClock,i)=><g key={i} transform={`translate(${i*960} 0)`}><text x="28" y="40" fill="#F5E7D4" fontFamily="Arial,sans-serif" fontSize="24">{i?'REVISED / CASE, GLASS & WALL DEPTH':'PREVIOUS / FLAT CLOCK INSERT'}</text><svg x="12" y="65" width="936" height="526.5" viewBox="0 0 1920 1080"><AnomalyScene frame={490} id={'clock-compare'+i} refinedClock={refinedClock}/></svg></g>)}</svg>;
