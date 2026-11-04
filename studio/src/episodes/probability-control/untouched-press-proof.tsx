import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {kf} from '../../engine/anim';
import type {WorldCamera} from './pseudo-depth-camera';
import type {RoomActorPerformance} from './lab-room-geometry';
import {LabRoomDepthScene} from './lab-room-depth';
import {clockSecondsAt} from './lab-time-anomaly-motion';
import {discoveryActorAt} from './clock-discovery-motion';
import {v2HandLocal} from './character-v2-motion';
import {BUTTON} from './slender-mechanics';

export const UNTOUCHED_FRAMES=270; // 9s at 30fps; separate from approved 720f film
const original=discoveryActorAt(719);
const continuity:WorldCamera={x:-80,y:370,z:250,focal:1200};
const wide:WorldCamera={x:-120,y:350,z:0,focal:1200};
export const autonomousPressAt=(f:number)=>kf(f,[[0,0],[52,0],[73,4],[98,4],[122,0],[269,0]]);
export function untouchedActorAt(f:number):RoomActorPerformance{
 const alert=kf(f,[[0,0],[96,0],[138,1],[188,1],[233,.35],[269,.35]]);
 const flinch=kf(f,[[0,0],[123,0],[144,1],[172,1],[212,.25],[269,.25]]);
 const headYaw=original.headYaw+(.36-original.headYaw)*alert;
 const pose={...original.pose,yaw:headYaw,gaze:(original.pose.gaze??0)+.6*alert,
   gazeY:(original.pose.gazeY??0)+5*alert,
   headTilt:(original.pose.headTilt??0)+8*flinch,
   blink:Math.max(0,1-Math.abs(f-132)/2,1-Math.abs(f-212)/2)};
 return {...original,pose,headYaw,
   mood:f>=128&&f<183?'surprised':'concerned',
   // The control presses itself; no character hand approaches it.
   press:autonomousPressAt(f)};
}
type Shot={from:number;to:number;name:string;crop:[number,number,number,number];camera:WorldCamera};
export const UNTOUCHED_SHOTS:Shot[]=[
 {from:0,to:44,name:'01 / THE WITHDRAWN HAND',crop:[510,150,1040,585],camera:continuity},
 {from:44,to:118,name:'02 / THE BUTTON MOVES ALONE',crop:[690,410,590,331.875],camera:continuity},
 {from:118,to:200,name:'03 / HE SEES IT',crop:[510,150,1040,585],camera:continuity},
 {from:200,to:270,name:'04 / NOTHING TOUCHED IT',crop:[0,0,1920,1080],camera:wide},
];
const shotAt=(f:number)=>UNTOUCHED_SHOTS.find(s=>f>=s.from&&f<s.to)??UNTOUCHED_SHOTS[3];
export const UntouchedPressScene:React.FC<{frame:number;id:string}>=({frame,id})=>{
 const shot=shotAt(frame);
 return <svg viewBox={shot.crop.join(' ')} width="100%" height="100%">
   <LabRoomDepthScene id={id} frame={frame} camera={shot.camera}
     performance={untouchedActorAt(frame)} clockStyle="cinematic"
     clockSeconds={clockSecondsAt(719+frame)}
     signal={.95+Math.max(0,autonomousPressAt(frame)/4)*.24*Math.sin(frame*.82)}/>
 </svg>;
};
export const UntouchedPressProof:React.FC=()=>{
 const f=useCurrentFrame();
 return <AbsoluteFill style={{backgroundColor:'#161C2A'}}>
  <UntouchedPressScene frame={f} id="untouched-press"/>
 </AbsoluteFill>;
};
const frames=[
 {f:0,label:'01  CONTINUITY / HAND IS AWAY'},
 {f:57,label:'02  THE RECESSED CONTROL'},
 {f:86,label:'03  AUTONOMOUS PRESS'},
 {f:149,label:'04  EYES / CONCERNED REACTION'},
 {f:212,label:'05  THE ROOM STILL OBEYS DEPTH'},
 {f:263,label:'06  NO ONE TOUCHED THE BUTTON'},
];
export const UntouchedPressBoard:React.FC=()=> <svg viewBox="0 0 1920 1848" width="100%" height="100%">
 <rect width="1920" height="1848" fill="#111522"/>
 {frames.map((p,i)=><g key={p.f} transform={'translate('+(i%2*960)+' '+(Math.floor(i/2)*616)+')'}>
  <text x="28" y="40" fill="#F5E7D4" fontFamily="Arial,sans-serif" fontSize="24">{p.label}</text>
  <svg x="12" y="65" width="936" height="526.5" viewBox="0 0 1920 1080">
   <UntouchedPressScene frame={p.f} id={'untouched-board-'+i}/>
  </svg>
 </g>)}
</svg>;
export function auditUntouchedPress(){
 if(untouchedActorAt(0).headYaw!==original.headYaw||untouchedActorAt(0).press!==0)
   throw new Error('Continuity with approved end frame changed');
 let maximumPress=0,minimumHandButtonGap=Infinity;
 for(let f=0;f<UNTOUCHED_FRAMES;f++){
  const a=untouchedActorAt(f);
  maximumPress=Math.max(maximumPress,a.press);
  const tip=v2HandLocal(a.pose), angle=(a.pose.lean??0)*Math.PI/180;
  const c=Math.cos(angle),sn=Math.sin(angle);
  const palm={x:a.origin.x+(tip.x*c-(tip.y+146)*sn)*a.scale,
    y:a.origin.y-(tip.x*sn+(tip.y+146)*c-146+a.pose.drop)*a.scale};
  const gap=Math.hypot(palm.x-(BUTTON.x-960),palm.y-(885-BUTTON.y));
  minimumHandButtonGap=Math.min(minimumHandButtonGap,gap);
  if(a.press>0&&gap<24)throw new Error('Hand touches autonomous button at frame '+f);
  if(JSON.stringify(a.pose.feet)!==JSON.stringify(original.pose.feet)||
     JSON.stringify(a.pose.hand)!==JSON.stringify(original.pose.hand)||
     JSON.stringify(a.soleWorld)!==JSON.stringify(original.soleWorld))
    throw new Error('Support/hand moved at frame '+f);
  if((f<52||f>122)&&a.press!==0)throw new Error('Press outside intended beat');
 }
 if(maximumPress<3.99)throw new Error('Button does not depress');
 return {frames:UNTOUCHED_FRAMES,fps:30,maximumPress,minimumHandButtonGap,
  condition:'static planted feet and withdrawn hand; autonomous button only',
  review:'TypeScript, rendered mobile frame visibility and sound pending'};
}
