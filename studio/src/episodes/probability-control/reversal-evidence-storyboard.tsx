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
 {from:0,to:100,beat:'notice',label:'A SOUND FROM THE BENCH',camera:wide,crop:[60,100,1680,945]},
 {from:100,to:174,beat:'broken',label:'THE GLASS IS SHATTERED',camera:close,crop:[585,515,450,253.125]},
 {from:174,to:286,beat:'lift',label:'THE SHARDS RISE BACKWARD',camera:close,crop:[585,515,450,253.125]},
 {from:286,to:376,beat:'mend',label:'THE LIQUID RETURNS INTO THE VIAL',camera:close,crop:[585,515,450,253.125]},
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
  const q=amount(f,42,90),look=amount(f,380,414),recover=amount(f,452,506);
  // Copy source pose before adapting. Never mutate the approved baseline.
  const pose={...latest.pose};
  pose.yaw=kf(f,[[0,latest.pose.yaw??0],[87,-.40],[375,-.40],[431,-.28],[509,-.46]]);
  pose.gaze=kf(f,[[0,latest.pose.gaze??0],[80,-1.1],[400,-1.1],[447,-.35],[509,-.9]]);
  pose.gazeY=(latest.pose.gazeY??0)-.8*q;
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
  // At the beginning ONLY the broken bowl is still on the bench. The
  // upper walls reappear behind converging glass pieces; there is never an
  // intact, translucent "ghost" bottle behind the broken pieces.
  const fracture=-48-117*m;
  const fractureMask='M-94 '+(fracture-3)+' L-52 '+(fracture-9)+
    ' L-19 '+(fracture+5)+' L7 '+(fracture-10)+
    ' L31 '+(fracture+4)+' L66 '+(fracture-6)+
    ' L94 '+(fracture-2)+' V25 H-94 Z';
  const shell='M-17 -148L-17 -111L-48 -52Q-68 -24 -47 -9Q-30 7 0 8Q30 7 47 -9Q68 -24 48 -52L17 -111L17 -148Z';
  const inner='M-15 -145V-107L-43 -50Q-58 -23 -39 -13Q-22 0 0 1Q22 0 39 -13Q58 -23 43 -50L15 -107V-145Z';
  const liquidTop=-23-32*w+Math.sin(f*.12)*.6*(1-w);
  const puddle=1-w;
  const fragmentVisibility=clamp((.73-m)/.47);
  const pieces=[
    {x:-27,y:-119,bx:-112,by:-9,rot:-86,shape:'M-13 -17 L4 -25 L15 -6 L3 16 L-16 9 Z'},
    {x:24,y:-120,bx:106,by:-4,rot:68,shape:'M-10 -24 L12 -19 L17 4 L-4 19 L-16 3 Z'},
    {x:-39,y:-76,bx:-77,by:-20,rot:-55,shape:'M-12 -21 L9 -16 L17 4 L-8 19 L-18 5 Z'},
    {x:38,y:-75,bx:72,by:-17,rot:49,shape:'M-15 -20 L10 -23 L20 5 L-5 20 L-17 4 Z'},
    {x:-21,y:-48,bx:-41,by:-5,rot:-63,shape:'M-16 -12 L6 -23 L16 5 L-6 17 Z'},
    {x:24,y:-48,bx:40,by:-9,rot:52,shape:'M-14 -19 L10 -16 L19 9 L-8 18 Z'},
    {x:3,y:-136,bx:8,by:-13,rot:100,shape:'M-11 -15 L10 -23 L15 11 L-6 20 Z'}
  ];
  return <g transform={origin}>
    <defs>
      <linearGradient id={id+'glass'} x1="0" y1="0" x2="1" y2=".42">
        <stop stopColor="#EFD3AD" stopOpacity=".34"/>
        <stop offset=".15" stopColor="#E3EBE1" stopOpacity=".18"/>
        <stop offset=".39" stopColor="#6A99A7" stopOpacity=".13"/>
        <stop offset=".75" stopColor="#AAD7D1" stopOpacity=".30"/>
        <stop offset="1" stopColor="#315164" stopOpacity=".57"/>
      </linearGradient>
      <linearGradient id={id+'shard'} x1=".06" y1="0" x2=".94" y2="1">
        <stop stopColor="#F7D7B0" stopOpacity=".75"/>
        <stop offset=".27" stopColor="#94BDC2" stopOpacity=".62"/>
        <stop offset=".7" stopColor="#34556C" stopOpacity=".84"/>
        <stop offset="1" stopColor="#182D43" stopOpacity=".94"/>
      </linearGradient>
      <linearGradient id={id+'liquid'} x1="0" y1="0" x2=".6" y2="1">
        <stop stopColor="#C9ECE8" stopOpacity=".93"/>
        <stop offset=".34" stopColor="#5C9DA7" stopOpacity=".89"/>
        <stop offset="1" stopColor="#194E69" stopOpacity=".95"/>
      </linearGradient>
      <linearGradient id={id+'metal'} x1="0" y1="0" x2="1" y2=".55">
        <stop stopColor="#D6B396"/>
        <stop offset=".24" stopColor="#8C7773"/>
        <stop offset=".57" stopColor="#424C5C"/>
        <stop offset=".82" stopColor="#78828C"/>
        <stop offset="1" stopColor="#243344"/>
      </linearGradient>
      <radialGradient id={id+'benchshadow'}>
        <stop stopColor="#080F19" stopOpacity=".72"/>
        <stop offset="1" stopColor="#080F19" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id={id+'puddle'} x1="0" y1="0" x2=".55" y2="1">
        <stop stopColor="#A6DFDC" stopOpacity=".65"/>
        <stop offset=".57" stopColor="#34798E" stopOpacity=".79"/>
        <stop offset="1" stopColor="#133D59" stopOpacity=".84"/>
      </linearGradient>
      <clipPath id={id+'rebuild'}><path d={fractureMask}/></clipPath>
      <clipPath id={id+'inside'}><path d={inner}/></clipPath>
    </defs>

    {/* The pooled fluid and fragment shadows are ON the world-projected
        counter, not drifting independently through screen space. */}
    <ellipse cx="17" cy="7" rx="113" ry="20" fill={u('benchshadow')}/>
    <ellipse cx="43" cy="-2" rx={73*puddle+1} ry={11*puddle+1}
      fill={u('puddle')} opacity={.86*puddle}/>
    <ellipse cx="35" cy={-4-.8*puddle} rx={54*puddle+1} ry={4*puddle+.6}
      fill="#D2ECE7" opacity={.31*puddle}/>
    {pieces.map((s,i)=><ellipse key={'shadow'+i}
      cx={s.bx*(1-t)+s.x*t+3} cy="2"
      rx={(15+i%3*3)*(1-t)+1.5} ry={4*(1-t)+.5}
      fill="#101A25" opacity={fragmentVisibility*.48}/> )}

    {/* Reconstructed body has a clipped jagged fracture front which
        physically rises as each fragment returns. No complete ghost vial. */}
    <g clipPath={u('rebuild')}>
      <path d={shell} transform="translate(5 2)"
        fill="#122F40" stroke="#1B3547" strokeWidth="4.5" opacity=".67"/>
      <path d={shell} fill={u('glass')} stroke="#7EAEB6" strokeWidth="2.15"/>
      <path d={inner} fill="#A8CCCF" fillOpacity=".095" stroke="#F1DBC2"
        strokeWidth="1.25" strokeOpacity=".4"/>
      <g clipPath={u('inside')}>
        <path d={'M-61 '+liquidTop+
          ' Q-27 '+(liquidTop-3)+' 0 '+(liquidTop-2)+
          ' Q29 '+(liquidTop+4)+' 61 '+liquidTop+' V16 H-61 Z'}
          fill={u('liquid')} opacity={.33+.59*w}/>
        <ellipse cx="0" cy={liquidTop} rx="41" ry="4.3"
          fill="#BDE4DF" opacity={.26+.54*w}/>
        <path d="M-33 -92Q-40 -66 -47 -32" fill="none" stroke="#FBE3C7"
          strokeWidth="7" strokeLinecap="round" opacity=".39"/>
        <path d="M-25 -94Q-31 -68 -40 -47" fill="none" stroke="#FBF6E8"
          strokeWidth="1.7" opacity=".66"/>
        <path d="M31 -86Q38 -57 44 -28" fill="none" stroke="#8CD1CF"
          strokeWidth="5" opacity=".42"/>
      </g>
      <path d="M-18 -149H18V-136H-18Z" fill={u('metal')} stroke="#273646"
        strokeWidth="2.5"/>
      <ellipse cx="0" cy="-151" rx="24" ry="6.6"
        fill="#77838C" stroke="#DAB99F" strokeWidth="2"/>
      <ellipse cx="0" cy="-151" rx="17" ry="3.4"
        fill="#183345" stroke="#9DC2C3" strokeWidth="1.3"/>
      <path d="M-18 -141H18" stroke="#F5D6B3" strokeWidth="2"
        opacity=".72"/>
      <path d="M-43 -28Q-30 -3 0 1Q32 -3 43 -28"
        fill="none" stroke="#C0DBD6" strokeWidth="3.2" opacity=".75"/>
    </g>
    {/* The glass breaks into actual tinted faces with dark extruded
        thickness, not hollow diamonds. Broken positions are near the bench;
        each deterministic trajectory rises into its former bottle surface. */}
    {pieces.map((s,i)=><g key={i} opacity={fragmentVisibility}
      transform={'translate('+(s.bx*(1-t)+s.x*t)+' '+(s.by*(1-t)+s.y*t)+
        ') rotate('+(s.rot*(1-t))+')'}>
      <path d={s.shape} transform="translate(4 3)"
        fill="#1E3D50" stroke="#183145" strokeWidth="1.7"/>
      <path d={s.shape} fill={u('shard')} stroke="#D8C6AF"
        strokeWidth="2.3" strokeLinejoin="round"/>
      <path d="M-9 -13L0 -18L7 -3" fill="none"
        stroke="#F8E6D1" strokeWidth="2.1" strokeLinecap="round" opacity=".94"/>
      <path d="M-8 10L6 2L12 10" fill="none"
        stroke="#85C5CA" strokeWidth="1.7" opacity=".64"/>
      <path d="M-3 -6L10 5" fill="none"
        stroke="#264D64" strokeWidth="2.2" opacity=".62"/>
    </g>)}

    {/* Water rises out of its shrinking spill and ENTERS the vial through
        its open metal mouth, using one local/world coordinate system. */}
    {Array.from({length:10},(_,i)=>{
      const q=clamp((w-i*.075)*2.1),inFlight=Math.sin(Math.PI*q);
      const x=43*(1-q)+Math.sin(i*1.7)*17*inFlight;
      const y=-6-146*q+Math.cos(i*1.9)*4*inFlight;
      return <g key={'water'+i} opacity={.84*inFlight}>
        <ellipse cx={x} cy={y} rx={2.2+i%3*.9} ry={3.7+i%3*1.2}
          fill={u('liquid')} stroke="#CBEAE2" strokeWidth=".85"/>
        <path d={'M'+(x-1.1)+' '+(y-1.5)+'l1.2 -1.6'}
          fill="none" stroke="#F9EDDD" strokeWidth=".9"/>
      </g>;
    })}

    {/* Cast support: actual foot and copper-toned lateral jaws, rather
        than a decorative straight line through the vessel. */}
    <ellipse cx="0" cy="1" rx="49" ry="9.5"
      fill="#122335" fillOpacity=".32" stroke="#7D7779" strokeWidth="2"/>
    <path d="M-70 -3L-51 -3L-46 -18 M70 -3L51 -3L46 -18" fill="none"
      stroke={u('metal')} strokeWidth="5" strokeLinecap="round"/>
    <path d="M-48 -18L-43 -14 M48 -18L43 -14" stroke="#E4C2A0"
      strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M-85 7H85V16Q0 21 -85 16Z"
      fill={u('metal')} stroke="#253447" strokeWidth="2.6"/>
    <path d="M-81 7H81" stroke="#F0D1A9" strokeWidth="2" opacity=".78"/>
    <path d="M-64 18H64" stroke="#182A3A" strokeWidth="2" opacity=".88"/>
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
  {[56,129,254,341,419,484].map((f,i)=>{
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
  if(evidenceProgress(173).returnShards!==0||
     evidenceProgress(318).returnShards!==1||
     evidenceProgress(378).restore!==1||
     evidenceProgress(380).water!==1)
    throw new Error('Glass and liquid reconstruction did not reach exact phase limits');
  const initial=evidenceActorAt(0),baseline=discoveryActorAt(719);
  if(initial.pose.yaw!==baseline.pose.yaw||
     initial.pose.gaze!==baseline.pose.gaze||
     initial.pose.gazeY!==baseline.pose.gazeY)
    throw new Error('Actor eyeline not continuous with approved ending');
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
