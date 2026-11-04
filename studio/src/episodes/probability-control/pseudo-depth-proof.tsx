import React from 'react';
import {performanceV3At} from './performance-v3-motion';
import {useCurrentFrame} from 'remotion';
import {CinematicCharacterV2} from './cinematic-character-v2';
import {LabBackground} from './cinematic-lab';
import {LabConsole} from './lab-console';
import {characterV2At} from './character-v2-motion';
import {depthCameraAt,projectWorld,planeTransform,floorPolygon,WorldCamera,WorldPoint} from './pseudo-depth-camera';
const P=(x:number,z:number):WorldPoint=>({x,y:0,z});
function shadow(x:number,z:number,rx:number,rz:number,c:WorldCamera){
 return floorPolygon(Array.from({length:30},(_,i)=>{const a=i/30*Math.PI*2;return P(x+Math.cos(a)*rx,z+Math.sin(a)*rz);}),c);
}
export const DepthScene:React.FC<{t:number;id:string;camera?:WorldCamera;performanceFrame?:number}>=({t,id,camera,performanceFrame})=>{
 const performance=performanceFrame===undefined?null:performanceV3At(performanceFrame);
 const c=camera??depthCameraAt(t),view=performance?.pose.torsoYaw??(.15+.8*t);
 const state=performance??characterV2At(166);
 // Correct the original drawing's floor baseline without changing the console anchor.
 const pose={...state.pose,hand:{...state.pose.hand,y:state.pose.hand.y+3.5/1.5},yaw:view};
 const u=(s:string)=>`url(#${id+s})`;
 return <g>
  <defs>
   <linearGradient id={id+'floor'} x2="0" y2="1"><stop stopColor="#49404C"/><stop offset="1" stopColor="#151B29"/></linearGradient>
   <linearGradient id={id+'glass'} x2="1" y2=".1"><stop stopColor="#8A705E" stopOpacity=".1"/><stop offset=".24" stopColor="#B0A183" stopOpacity=".36"/><stop offset=".4" stopColor="#5B737D" stopOpacity=".14"/><stop offset="1" stopColor="#263D50" stopOpacity=".45"/></linearGradient>
   <filter id={id+'fg'} x="-35%" y="-35%" width="170%" height="170%"><feGaussianBlur stdDeviation="5"/></filter>
   <clipPath id={id+'wallClip'}><rect x="-2000" y="-2000" width="6000" height="2802"/></clipPath>
   <radialGradient id={id+'vignette'}><stop offset=".4" stopColor="#070C16" stopOpacity="0"/><stop offset="1" stopColor="#070C16" stopOpacity=".58"/></radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="#182131"/>
  {/* The room artwork is on a rear plane whose bottom meets the projected floor. */}
  <g transform={planeTransform(P(0,650),c)}><g transform="scale(1.6) translate(-960 -802)">
   <g clipPath={u('wallClip')}><LabBackground id={id+'rear'} soft/></g>
  </g></g>
  <path d={floorPolygon([P(-2200,650),P(2200,650),P(2200,-520),P(-2200,-520)],c)} fill={u('floor')}/>
  <g stroke="#A68B83" strokeWidth="1.5" opacity=".18" fill="none">
   {Array.from({length:17},(_,i)=>{
    const a=projectWorld(P(-2000+i*250,-520),c),b=projectWorld(P(-2000+i*250,650),c);
    return <path key={i} d={`M${a.x} ${a.y}L${b.x} ${b.y}`}/>;
   })}
   {[-440,-300,-140,40,240,440,650].map(z=>{
    const a=projectWorld(P(-2200,z),c),b=projectWorld(P(2200,z),c);
    return <path key={z} d={`M${a.x} ${a.y}L${b.x} ${b.y}`}/>;
   })}
  </g>
  {/* Ground shadows are polygons on the floor, rather than camera-facing ellipses. */}
  <path d={shadow(0,0,145,32,c)} fill="#090E19" opacity=".35"/>
  <path d={shadow(state.x-950,-22,65,26,c)} fill="#090E19" opacity=".2"/>
  {state.pose.feet.map((foot,i)=><path key={i} d={shadow(state.x-960+foot.x*1.5,0,16,8,c)} fill="#080C16" opacity={foot.y< -4.01?.15:.4}/>)}
  {/* Character, hand and console share this exact interaction transform. */}
  <g transform={planeTransform(P(0,0),c)}><g transform="translate(-960 -885)">
   <LabConsole id={id+'console'} active={performance?.active??true} press={performance?.press??0} shadowY={885} shadow={false}/>
   <CinematicCharacterV2 id={id+'actor'} x={state.x} y={886.5} scale={1.5} pose={pose} bodyYaw={view} headYaw={performance?.pose.yaw} mood={performance?.mood??'calm'} shadow={false}/>
  </g></g>
  {/* Glass on a physically nearer plane moves more for the same camera translation. */}
  {[-650,650].map((x,i)=><g key={x} transform={planeTransform(P(x,-300),c)} opacity=".66" filter={u('fg')}>
   <ellipse cx="0" cy="3" rx="93" ry="8" fill="#070E19" opacity=".55"/>
   <path d="M-18 -360H18V-210L77 -45Q94 -12 64 -5Q0 5 -64 -5Q-94 -12 -77 -45L-18 -210Z" fill={u('glass')} stroke={i?'#63818C':'#A58C73'} strokeWidth="2"/>
   <ellipse cy="-360" rx="21" ry="6" fill="#1B2D3C" stroke="#A58C73" strokeWidth="2"/>
   <path d="M-56 -55Q0 -40 56 -55L65 -26Q0 -10 -65 -26Z" fill={i?'#3E6572':'#A0824F'} opacity=".45"/>
   <path d="M-12 -342V-209L-55 -58" fill="none" stroke="#B9B49B" strokeWidth="4" opacity=".3"/>
   <ellipse cy="-22" rx="65" ry="10" fill="none" stroke="#9B8C7F" strokeWidth="2" opacity=".35"/>
  </g>)}
  <rect width="1920" height="1080" fill={u('vignette')} pointerEvents="none"/>
 </g>;
};
export const DepthCameraProof:React.FC=()=>{
 const f=useCurrentFrame();
 return <svg viewBox="0 0 1920 1080" width="100%" height="100%"><DepthScene t={f/179} id="depth-motion"/></svg>;
};
export const DepthCharacterStudy:React.FC=()=> <svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <rect width="1920" height="1080" fill="#252331"/>
 <path d="M0 892H1920" stroke="#75636F" strokeWidth="2"/>
 <g fontFamily="Arial,sans-serif" fill="#F3E6D2">
  <text x="90" y="105" fontSize="42">PSEUDO-3D CHARACTER — CHANGING FORMS</text>
  <text x="90" y="153" fontSize="26" fill="#B8ADB7">Torso planes · shoulder overlap · hood volume · far-eye visibility · planted feet</text>
  {[['FRONT',370],['THREE-QUARTER',960],['PROFILE-LIKE',1550]].map(([s,x])=><text key={s} x={x} y="277" textAnchor="middle" fontSize="29">{s}</text>)}
 </g>
 {[.05,.55,.95].map((v,i)=><CinematicCharacterV2 key={v} id={'depth-form'+i} x={370+i*590} y={886} scale={1.5} bodyYaw={v} mood="calm"/>)}
 <text x="960" y="982" textAnchor="middle" fontFamily="Arial,sans-serif" fill="#B8ADB7" fontSize="25">Same height and floor anchors; the body surfaces and overlaps change with the view.</text>
</svg>;
export const DepthContactBoard:React.FC=()=> <svg viewBox="0 0 1920 1230" width="100%" height="100%">
 <rect width="1920" height="1230" fill="#111522"/>
 {[0,.35,.7,1].map((t,i)=><g key={t} transform={`translate(${i%2*960} ${Math.floor(i/2)*615})`}>
  <text x="40" y="45" fontFamily="Arial,sans-serif" fontSize="29" fill="#F5E7D4">{['01  CAMERA LEFT / FRONT','02  CAMERA DOLLY / TURN','03  NEAR / FAR SEPARATION','04  CAMERA RIGHT / PROFILE-LIKE'][i]}</text>
  <svg x="12" y="65" width="936" height="526.5" viewBox="0 0 1920 1080"><DepthScene t={t} id={'depth-board'+i}/></svg>
 </g>)}
</svg>;
