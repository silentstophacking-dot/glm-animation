import React from 'react';
import {useCurrentFrame} from 'remotion';
import {LabRoomDepthScene} from './lab-room-depth';
import {discoveryActorAt} from './clock-discovery-motion';
import {clockSecondsAt} from './lab-time-anomaly-motion';
import {planeTransform,projectWorld,WorldCamera} from './pseudo-depth-camera';
import {W,RoomActorPerformance} from './lab-room-geometry';
import {kf,clamp} from '../../engine/anim';

/**
 * NEXT BEAT / REVERSAL EVIDENCE — STILLS ONLY / NOT OWNER-APPROVED.
 *
 * Visual continuation from ClockDiscoveryPerformance. Existing lab, puffer,
 * sunset lighting, clock and fixed-world camera are reused directly.
 * A broken glass ampoule on the established rear workbench reverses toward
 * wholeness. No glass is screen-space decoration; every fragment is fixed to
 * the same bench world origin and projected by the shot camera.
 *
 * First produce this storyboard and phone-size stills. DO NOT auto-render
 * the 17s movie before visual review of the material/depth and eyelines.
 */

export const REVERSAL_FRAMES=510;
const BASE=W(-860,278,535);
const EASE=(n:number)=>{const x=clamp(n);return x*x*(3-2*x);};
const amount=(f:number,a:number,b:number)=>EASE((f-a)/(b-a));
type Beat='notice'|'broken'|'lift'|'mend'|'reaction'|'clock';
type Shot={from:number;to:number;beat:Beat;label:string;camera:WorldCamera;crop:[number,number,number,number]};
const wide:WorldCamera={x:-265,y:370,z:10,focal:1200};
const close:WorldCamera={x:-645,y:475,z:240,focal:1200};
const actorCam:WorldCamera={x:-105,y:360,z:135,focal:1200};
export const EVIDENCE_SHOTS:Shot[]=[
 {from:0,to:100,beat:'notice',label:'THE GLASS BREAKS — SOUND FROM THE BENCH',camera:wide,crop:[60,100,1680,945]},
 {from:100,to:174,beat:'broken',label:'A REAL GLASS VIAL, SHATTERED',camera:close,crop:[585,420,450,253.125]},
 {from:174,to:286,beat:'lift',label:'GLASS SHARDS MOVE BACK TO THEIR ORIGIN',camera:close,crop:[585,420,450,253.125]},
 {from:286,to:376,beat:'mend',label:'THE CRACKS SEAL; LIQUID RETURNS',camera:close,crop:[585,420,450,253.125]},
 {from:376,to:458,beat:'reaction',label:'HE UNDERSTANDS THE CLOCK AFFECTS MATTER',camera:actorCam,crop:[400,180,1020,573.75]},
 {from:458,to:510,beat:'clock',label:'CLOCK & RESTORED VIAL — A NEW THREAT',camera:wide,crop:[60,80,1680,945]},
];
export const evidenceShotAt=(f:number)=>EVIDENCE_SHOTS.find(s=>s.from<=f&&f<s.to)??EVIDENCE_SHOTS.at(-1)!;
export const evidenceProgress=(f:number)=>{
  const returnShards=amount(f,180,318);
  const restore=amount(f,286,378);
  const water=amount(f,294,380);
  return {returnShards,restore,water};
};
export const evidenceActorAt=(f:number):RoomActorPerformance=>{
  const latest=discoveryActorAt(719);
  const actor:{[key:string]:unknown}={...latest};
  const q=amount(f,42,90),look=amount(f,380,414),recover=amount(f,452,506);
  // Copy source pose before adapting. Never mutate the approved baseline.
  const pose={...latest.pose};
  pose.yaw=kf(f,[[0,latest.pose.yaw??0],[87,-.40],[375,-.40],[431,-.28],[509,-.46]]);
  pose.gaze=kf(f,[[0,latest.pose.gaze??0],[80,-1.1],[400,-1.1],[447,-.35],[509,-.9]]);
  pose.gazeY=-.8*q;
  pose.headTilt=kf(f,[[0,latest.pose.headTilt??-3],[83,-9],[382,-9],[431,-5],[509,-10]]);
  pose.blink=Math.max(...[91,418,484].map(t=>clamp(1-Math.abs(f-t)/2)));
  return {...latest,pose,headYaw:pose.yaw??-.4,mood:look>.5?'surprised':'concerned'};
};
/**
 * The new prop uses translucency with explicit back/rim/front layers,
 * a soft cast contact shadow, separated rear/front glass contours,
 * cool transmitted fill and a localized warm sunset highlight.
 */
const ReversingAmpoule:React.FC<{id:string;frame:number;camera:WorldCamera}>=({id,frame:f,camera:c})=>{
  const {returnShards:t,restore:m,water:w}=evidenceProgress(f);
  const u=(name:string)=>'url(#'+id+name+')';
  const origin=planeTransform(BASE,c);
  const fluct=Math.max(0,1-t);
  const pieces=[
    {x:-22,y:-108,dx:-43,dy:-58,rot:-37,path:'M-12 -15L1 -28L8 0L-4 18Z'},
    {x:22,y:-113,dx:58,dy:-72,rot:51,path:'M-7 -20L10 -11L10 14L-12 10Z'},
    {x:-32,y:-53,dx:-72,dy:13,rot:-47,path:'M-13 -18L8 -18L13 14L-8 7Z'},
    {x:34,y:-54,dx:71,dy:7,rot:61,path:'M-7 -19L9 -8L12 16L-11 10Z'},
    {x:9,y:-29,dx:38,dy:47,rot:24,path:'M-15 -11L12 -19L14 18L-12 14Z'}
  ];
  return <g transform={origin}>
    <defs>
      <linearGradient id={id+'glass'} x1="0" y1="0" x2="1" y2=".35">
        <stop stopColor="#E9C9A5" stopOpacity=".28"/>
        <stop offset=".22" stopColor="#8FB7BB" stopOpacity=".13"/>
        <stop offset=".67" stopColor="#A3CED1" stopOpacity=".19"/>
        <stop offset="1" stopColor="#486E86" stopOpacity=".44"/>
      </linearGradient>
      <linearGradient id={id+'water'} x1="0" y1="0" x2=".8" y2="1">
        <stop stopColor="#B5E1E2" stopOpacity=".73"/>
        <stop offset=".5" stopColor="#608E9A" stopOpacity=".63"/>
        <stop offset="1" stopColor="#234E69" stopOpacity=".78"/>
      </linearGradient>
      <linearGradient id={id+'neck'} x1="0" y1="0" x2=".5" y2="1">
        <stop stopColor="#BCAB9A"/><stop offset=".55" stopColor="#515C65"/>
        <stop offset="1" stopColor="#243549"/>
      </linearGradient>
      <radialGradient id={id+'benchshadow'}>
        <stop stopColor="#07101A" stopOpacity=".62"/>
        <stop offset="1" stopColor="#07101A" stopOpacity="0"/>
      </radialGradient>
      <filter id={id+'soft'} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5"/>
      </filter>
      <clipPath id={id+'inner'}>
        <path d="M-16 -145V-106L-43 -49Q-63 -12 -28 -3Q0 6 28 -3Q63 -12 43 -49L16 -106V-145Z"/>
      </clipPath>
    </defs>
    {/* rear rim, bench support and shadow must share the bottle position */}
    <ellipse cx="26" cy="6" rx="85" ry="18" fill={u('benchshadow')}/>
    <ellipse cx="0" cy="0" rx="43" ry="10" fill="#121D2E" opacity=".38"/>
    <g opacity={.18+.82*m}>
      <path d="M-17 -144L-17 -111L-48 -51Q-64 -17 -37 -5Q0 13 37 -5Q64 -17 48 -51L17 -111V-144Z"
        fill="#233E51" opacity=".5" stroke="#12283B" strokeWidth="4"/>
      <path d="M-15 -142V-105L-43 -49Q-62 -12 -28 -3Q0 5 28 -3Q62 -12 43 -49L15 -105V-142Z"
        fill={u('glass')} stroke="#A4B6B6" strokeWidth="2.8"/>
      <g clipPath={u('inner')}>
        <path d={'M-55 '+(-38+23*(1-w))+'Q0 '+(-33+24*(1-w))+
          ' 55 '+(-40+22*(1-w))+'V12H-55Z'}
          fill={u('water')} opacity={.38+.62*w}/>
        <ellipse cx="0" cy={-40+22*(1-w)} rx="43" ry="6"
          fill="#A5D7DB" opacity={.48+.4*w}/>
        <path d="M-29 -88Q-36 -58 -42 -31" fill="none"
          stroke="#EED4BD" strokeWidth="6" opacity=".28"/>
        <path d="M26 -81Q30 -54 40 -27" fill="none"
          stroke="#8BC9D0" strokeWidth="4" opacity=".4"/>
      </g>
      <path d="M-19 -149H19V-136H-19Z" fill={u('neck')}
        stroke="#2C3342" strokeWidth="2"/>
      <rect x="-24" y="-158" width="48" height="11" rx="4"
        fill="#4F5B66" stroke="#B6A08B" strokeWidth="2"/>
      <path d="M-17 -155H15" stroke="#EFCC9E" strokeWidth="1.5" opacity=".55"/>
      <path d="M-17 -132L-17 -112" stroke="#ECDAC1" opacity=".65" strokeWidth="3"/>
      <path d="M38 -49Q50 -28 41 -15" fill="none" stroke="#78A6B7"
        strokeWidth="3" opacity=".55"/>
      {m<.99?<g opacity={1-m} stroke="#D3E0DA" strokeWidth="1.9" fill="none">
        <path d="M-18 -107L-3 -86L-10 -62L17 -41L7 -17"/>
        <path d="M24 -104L11 -80L33 -59L19 -38"/>
      </g>:null}
    </g>
    {/* broken fragments show volume, edge rims and convergent trajectory */}
    {pieces.map((s,i)=><g key={i} opacity={.94*(1-m*.93)}
      transform={'translate('+(s.x+s.dx*(1-t))+' '+(s.y+s.dy*(1-t))+') rotate('+(s.rot*(1-t))+')'}>
      <path d={s.path} transform="translate(3 2)" fill="#0C263A" opacity=".34"/>
      <path d={s.path} fill={u('glass')} stroke="#D9C7AF" strokeWidth="2.2"/>
      <path d="M-7 -15L3 -7" stroke="#F5E1C8" strokeWidth="1.8" opacity=".8"/>
    </g>)}
    {/* Fluid drops move up in world-y toward the actual mouth, never on screen. */}
    {[0,1,2,3,4].map((i)=>{
      const p=.15+.16*i,dy=88*(1-w),dx=Math.sin(i*2.2)*35*(1-w);
      const y=-164+dy+p*80*(1-w);
      return <g key={i} opacity={clamp((1-w)*1.3)}>
        <ellipse cx={dx+(i-2)*8} cy={y} rx={3.5+i%2*2}
          ry={5+i%3*2} fill="#A9DEE0" stroke="#4E8296" strokeWidth="1"/>
        <path d={'M'+(dx+(i-2)*8-1)+' '+(y-3)+'q-2 3 0 5'}
          stroke="#F8E9D4" strokeWidth=".8" opacity=".7"/>
      </g>;
    })}
    {/* copper clamp on the same bench is proof the vial is supported */}
    <path d="M-76 7H76" stroke="#8C7A75" strokeWidth="3"/>
    <rect x="-82" y="5" width="164" height="10" rx="3" fill="#353A49"
      stroke="#857C7B" strokeWidth="2"/>
    <path d="M-79 5H77" stroke="#C6A389" strokeWidth="1.5" opacity=".55"/>
  </g>;
};
/**
 * Keep previous ending as a baseline. This is an original scene, not an edit
 * of ClockDiscoveryPerformance's exact 720 frames.
 */
export const EvidenceScene:React.FC<{frame:number;id:string}>=({frame:f,id})=>{
  const shot=evidenceShotAt(f),sourceTime=719+f;
  const clockTime=clockSecondsAt(719)-(f/30)*5;
  // viewBox is the optical crop; geometry is projected by one shared world camera
  return <svg viewBox={shot.crop.join(' ')} width="100%" height="100%">
    <LabRoomDepthScene id={id+'lab'} frame={f} camera={shot.camera}
      clockSeconds={clockTime} signal={.95} clockStyle="cinematic"
      performance={evidenceActorAt(f)}/>
    <ReversingAmpoule id={id+'evidence'} frame={f} camera={shot.camera}/>
  </svg>;
};
export const ReversalEvidenceStoryBoard:React.FC=()=> <svg viewBox="0 0 1920 1848" width="100%" height="100%">
  <rect width="1920" height="1848" fill="#101622"/>
  {[56,129,222,341,419,484].map((f,i)=>{
    const label=EVIDENCE_SHOTS[i].label;
    return <g key={f} transform={'translate('+(i%2*960)+' '+(Math.floor(i/2)*616)+')'}>
      <text x="29" y="40" fontFamily="Arial,sans-serif" fontSize="25" fontWeight="600" fill="#F4E6D5">
        {String(i+1).padStart(2,'0')+'  '+label}
      </text>
      <svg x="12" y="65" width="936" height="526.5" viewBox="0 0 1920 1080">
        <EvidenceScene frame={f} id={'evidence-review'+i}/>
      </svg>
    </g>;
  })}
</svg>;
export const ReversalEvidenceFrame:React.FC=()=>{
  const f=useCurrentFrame();
  return <EvidenceScene frame={f} id="evidence-full-scene"/>;
};
export const auditReversalEvidence=()=>{
  if(EVIDENCE_SHOTS[0].from!==0||EVIDENCE_SHOTS.at(-1)!.to!==REVERSAL_FRAMES)
    throw new Error('Story beat boundaries incorrect');
  let last=0;
  for(let f=0;f<REVERSAL_FRAMES;f++){
    const shot=evidenceShotAt(f),phase=evidenceProgress(f);
    if(f!==0&&f%60===0&&phase.returnShards<last-.00001)throw new Error('Time reversal regressed');
    last=phase.returnShards;
    const camera=shot.camera;
    const q=projectWorld(BASE,camera);
    if(!Number.isFinite(q.x+q.y+q.scale)||q.scale<=0)throw new Error('Invalid world prop projection at '+f);
    if(f>=174&&f<376&&shot.crop[2]!==450)throw new Error('Close insert lost world framing');
    const actor=evidenceActorAt(f);
    if(!actor.soleWorld.some(s=>Math.abs(s.y)<.001))throw new Error('Actor has no planted support '+f);
  }
  return {frames:REVERSAL_FRAMES,shots:EVIDENCE_SHOTS.length,prop:'detailed world-projected transparent glass and physical metal clamp',source:'approved ClockDiscoveryPerformance unchanged',renderGate:'STILLS_ONLY'};
};
