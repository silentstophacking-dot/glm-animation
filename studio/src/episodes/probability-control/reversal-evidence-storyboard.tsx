import React from 'react';
import {useCurrentFrame} from 'remotion';
import {LabRoomDepthScene} from './lab-room-depth';
import {discoveryActorAt} from './clock-discovery-motion';
import {clockSecondsAt} from './lab-time-anomaly-motion';
import {planeTransform,projectWorld,WorldCamera} from './pseudo-depth-camera';
import {W,RoomActorPerformance} from './lab-room-geometry';
import {kf,clamp} from '../../engine/anim';
import {turnV5Geometry,CharacterTurnV5} from './character-turn-v5';
import {v2HandLocal} from './character-v2-motion';

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
type Beat='notice'|'noticeClose'|'broken'|'lift'|'mend'|'reaction'|'clock';
type Shot={from:number;to:number;beat:Beat;label:string;camera:WorldCamera;crop:[number,number,number,number]};
const wide:WorldCamera={x:-265,y:370,z:10,focal:1200};
const close:WorldCamera={x:-645,y:475,z:240,focal:1200};
const actorCam:WorldCamera={x:-105,y:360,z:135,focal:1200};
export const EVIDENCE_SHOTS:Shot[]=[
 {from:0,to:62,beat:'notice',label:'AN UNEASY SOUND IN THE LAB',camera:wide,crop:[60,100,1680,945]},
 {from:62,to:100,beat:'noticeClose',label:'HE LOOKS TOWARD THE BENCH',camera:actorCam,crop:[400,180,1020,573.75]},
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
// All pulses, shard trails and particles are keyed to the physical glass
// repair timing. Nothing is composited as a stationary screen-space overlay.
export const reversalFxAt=(f:number)=>{
  const active=amount(f,177,230)*(1-amount(f,372,410));
  const impact=Math.exp(-Math.pow((f-108)/8,2));
  const start=Math.exp(-Math.pow((f-196)/12,2));
  const seal=Math.exp(-Math.pow((f-360)/13,2));
  const flash=clamp(.7*impact+.85*start+.9*seal);
  const trail=Math.max(0,evidenceProgress(f).returnShards-
    evidenceProgress(Math.max(0,f-7)).returnShards);
  return {active,flash,trail};
};
// Six physical zones of the cylindrical bottle wall. Each shard has a
// corresponding destination on the complete vial's silhouette, rather than
// being an arbitrary tile scattered about the frame.
export const VIAL_SHARDS=[
  {x:-24,y:-126,bx:-122,by:-9,rot:-84,seal:344,
    shape:'M7 -22 L10 21 L-6 31 L-12 -8 Z'},
  {x:24,y:-126,bx:118,by:-8,rot:72,seal:344,
    shape:'M-10 -22 L-7 21 L12 15 L8 -17 Z'},
  {x:-35,y:-86,bx:-85,by:-13,rot:-58,seal:329,
    shape:'M6 -26 L-11 11 L-19 32 L-7 22 L15 -10 Z'},
  {x:35,y:-86,bx:82,by:-14,rot:61,seal:329,
    shape:'M-5 -25 L12 15 L17 28 L5 23 L-14 -10 Z'},
  {x:-47,y:-43,bx:-54,by:-7,rot:-43,seal:316,
    shape:'M-1 -19 L-8 -4 L-3 14 L12 30 L18 17 L6 -7 Z'},
  {x:47,y:-43,bx:53,by:-7,rot:40,seal:325,
    shape:'M1 -19 L8 -4 L3 14 L-12 30 L-18 17 L-6 -7 Z'}
] as const;
export const shardMotionAt=(f:number,i:number)=>{
  const p=VIAL_SHARDS[i];
  const q=amount(f,183+i*9,284+i*7);
  const arc=Math.sin(Math.PI*q);
  return {
    x:p.bx+(p.x-p.bx)*q+(i%2===0?-1:1)*10*arc,
    y:p.by+(p.y-p.by)*q-13*arc,
    angle:p.rot*(1-q),
    squash:.30+.70*q,
    progress:q,
    opacity:1-amount(f,p.seal,p.seal+18)
  };
};

// Every completed bottle patch is the inverse of its actual seated fragment.
// The glass wall and incoming shard occupy the same projection while welding;
// the completed wall persists even after the particle effects die away.
export const seamAt=(f:number,i:number)=>{
  const shard=shardMotionAt(f,i);
  const complete=1-shard.opacity;
  const glow=4*complete*(1-complete);
  return {complete,glow,remaining:shard.opacity};
};
export const evidenceActorAt=(f:number):RoomActorPerformance=>{
  const latest=discoveryActorAt(719);
  const notice=amount(f,42,90);

  // The approved ClockDiscoveryPerformance ends with the neck looking a
  // different direction from the torso. Keep exact frame-zero continuity,
  // then allow the body to follow the eyes instead of spinning the head
  // freely on top of an unmoving puffer jacket.
  // Keep the face oriented toward the reversing vial throughout this
  // scene. A negative-to-positive head-yaw crossover reads as a false
  // 180/360-degree face flip in the simple 2D facial projection.
  const bodyYaw=kf(f,[
    [0,latest.yaw],[34,.32],[80,.08],[110,.06],[378,.06],
    [391,.085],[428,.12],[457,.10],[509,.05]]);
  const desiredHeadYaw=kf(f,[
    [0,latest.headYaw],[34,-.24],[80,-.20],[110,-.19],[375,-.19],
    [387,-.17],[405,-.14],[429,-.12],[455,-.13],[509,-.18]]);
  const permittedNeckAngle=kf(f,[
    [0,Math.abs(latest.headYaw-latest.yaw)+.01],[75,.28],[509,.28]]);
  const headYaw=clamp(desiredHeadYaw,
    bodyYaw-permittedNeckAngle,bodyYaw+permittedNeckAngle);

  // Independent reaction timing: eyes -> head -> chest -> left and right
  // wrists. The torso actually changes facing while all shoes remain locked.
  const head=amount(f,379,400)*(1-amount(f,425,458));
  const chest=amount(f,392,416)*(1-amount(f,438,473));
  const nearArm=amount(f,401,426)*(1-amount(f,445,478));
  const farArm=amount(f,405,432)*(1-amount(f,447,481));
  const pose={...latest.pose};
  pose.torsoYaw=bodyYaw;
  pose.yaw=headYaw;
  pose.gaze=kf(f,[
    [0,latest.pose.gaze??0],[82,-.72],[375,-.72],
    [411,-.27],[509,-.42]]);
  pose.gazeY=(latest.pose.gazeY??0)-.54*notice+1.45*head;
  pose.headTilt=kf(f,[
    [0,latest.pose.headTilt??-3],[90,-6],[375,-6],
    [426,-3],[509,-5]])-3.6*head;
  pose.lean=(latest.pose.lean??0)-3*chest;

  // Preserve the planted sole world coordinates as torso yaw changes.
  // This is the same reach correction used in the approved discovery rig.
  const oldGeometry=turnV5Geometry(latest.yaw);
  const torso=turnV5Geometry(bodyYaw);
  const reach=(hips:number[])=>Math.max(...pose.feet.map((foot,i)=>{
    const dx=foot.x-hips[i];
    return foot.y-4+147.4-Math.sqrt(143**2-dx**2);
  }));
  const dropCorrection=reach(torso.hips)-reach(oldGeometry.hips);
  pose.drop+=dropCorrection;

  const far=latest.pose.farHand??{x:-25,y:-153};
  pose.farHand={x:far.x-8*farArm,y:far.y-7*farArm};
  pose.hand={x:latest.pose.hand.x+5*nearArm,
    y:latest.pose.hand.y+dropCorrection+4*nearArm};

  // Keep the original two-bone character rig in its reachable region.
  // No extra joints or independent neck revolutions are added.
  const near=v2HandLocal(pose);
  const dx=near.x-torso.nearShoulder,dy=near.y+270;
  const distance=Math.hypot(dx,dy);
  if(distance>132.5){
    const a=-(pose.lean??0)*Math.PI/180;
    const c=Math.cos(a),sn=Math.sin(a),q=132.5/distance;
    const ex=torso.nearShoulder+dx*q;
    const ey=-270+dy*q+146;
    pose.hand={x:ex*c+ey*sn,
      y:-ex*sn+ey*c+pose.drop-146};
  }
  const fx=pose.farHand.x-torso.farShoulder;
  const fy=pose.farHand.y+270,farDist=Math.hypot(fx,fy);
  if(farDist>119){
    const q=119/farDist;
    pose.farHand={x:torso.farShoulder+fx*q,y:-270+fy*q};
  }
  pose.blink=Math.max(...[91,450].map(t=>clamp(1-Math.abs(f-t)/2)));
  pose.surprised=head>.4;
  return {...latest,pose,yaw:bodyYaw,headYaw,
    mood:head>.4?'surprised':'concerned'};
};
/**
 * The new prop uses translucency with explicit back/rim/front layers,
 * a soft cast contact shadow, separated rear/front glass contours,
 * cool transmitted fill and a localized warm sunset highlight.
 */
// All liquid particles must have reached the flask by the end of the
// restoration window; delayed drops cannot hang in midair after w = 1.
export const dropletProgress=(w:number,index:number)=>{
  const delay=index*.058;
  return clamp((w-delay)/(1-delay));
};
const ReversingAmpoule:React.FC<{id:string;frame:number;camera:WorldCamera}>=({id,frame:f,camera:c})=>{
  const {water:w}=evidenceProgress(f);
  const fx=reversalFxAt(f);
  const u=(name:string)=>'url(#'+id+name+')';
  const origin=planeTransform(BASE,c);
  // Body bands appear only when the six incoming shards physically weld.
  // Unlike the former rising global clip, the shell cannot appear behind a
  // shard before that individual piece reaches its destination.
  const shell='M-17 -148L-17 -111L-48 -52Q-68 -24 -47 -9Q-30 7 0 8Q30 7 47 -9Q68 -24 48 -52L17 -111L17 -148Z';
  const inner='M-15 -145V-107L-43 -50Q-58 -23 -39 -13Q-22 0 0 1Q22 0 39 -13Q58 -23 43 -50L15 -107V-145Z';
  const liquidTop=-23-32*w+Math.sin(f*.12)*.6*(1-w);
  const puddle=1-w;
  const pieces=VIAL_SHARDS;
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
      <radialGradient id={id+'timebloom'}>
        <stop stopColor="#DDF6E9" stopOpacity=".88"/>
        <stop offset=".22" stopColor="#9FD7D9" stopOpacity=".55"/>
        <stop offset=".65" stopColor="#5DACC3" stopOpacity=".21"/>
        <stop offset="1" stopColor="#5DACC3" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id={id+'trail'} x1="0" y1="0" x2=".8" y2="1">
        <stop stopColor="#F0DAC4" stopOpacity=".9"/>
        <stop offset=".45" stopColor="#7EBFC8" stopOpacity=".7"/>
        <stop offset="1" stopColor="#6AAEC3" stopOpacity=".08"/>
      </linearGradient>
      <linearGradient id={id+'lightshaft'} x1="0" y1="1" x2="0" y2="0">
        <stop stopColor="#9AF0EE" stopOpacity=".54"/>
        <stop offset=".32" stopColor="#C1E8E0" stopOpacity=".24"/>
        <stop offset=".85" stopColor="#F7E4C9" stopOpacity=".09"/>
        <stop offset="1" stopColor="#F7E4C9" stopOpacity="0"/>
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
      <mask id={id+'rebuild'} x="-110" y="-180" width="220" height="220" maskUnits="userSpaceOnUse">
        <rect x="-105" y="-55" width="210" height="84" fill="white"/>
        {pieces.map((p,i)=>{
          const row=i<2?0:i<4?1:2;
          const y=row===0?-172:row===1?-129:-95;
          const h=row===0?55:row===1?44:44;
          const x=i%2===0?-105:-2;
          return <rect key={'band'+i} x={x} y={y} width="107"
            height={h} fill="white" opacity={seamAt(f,i).complete}/>;
        })}
      </mask>
      <clipPath id={id+'shellShape'}><path d={shell}/></clipPath>
      <clipPath id={id+'inside'}><path d={inner}/></clipPath>
    </defs>

    {/* The pooled fluid and fragment shadows are ON the world-projected
        counter, not drifting independently through screen space. */}
    <ellipse cx="17" cy="7" rx="113" ry="20" fill={u('benchshadow')}/>
    <ellipse cx="43" cy="-2" rx={73*puddle+1} ry={11*puddle+1}
      fill={u('puddle')} opacity={.86*puddle}/>
    <ellipse cx="35" cy={-4-.8*puddle} rx={54*puddle+1} ry={4*puddle+.6}
      fill="#D2ECE7" opacity={.31*puddle}/>
    {pieces.map((s,i)=>{
      const p=shardMotionAt(f,i);
      return <ellipse key={'shadow'+i}
        cx={p.x+3} cy="2" rx={(15+i%3*3)*(1-p.progress)+1.5}
        ry={4*(1-p.progress)+.5}
        fill="#101A25" opacity={p.opacity*.4*(1-p.progress)}/>;
    })}

    {/* The room reacts in the prop's own projected coordinate frame:
        warm/cool illumination on the vial and counter, two short physical
        shock pulses and tiny dust drawn toward the repairing glass. */}
    <ellipse cx="0" cy="-83" rx="150" ry="163" fill={u('timebloom')}
      opacity={clamp(.5*fx.active+.88*fx.flash)}/>
    <ellipse cx="5" cy="6" rx="111" ry="18" fill={u('timebloom')}
      opacity={clamp(.7*fx.active+.82*fx.flash)}/>
    {[0,1,2].map(i=>{
      const phase=(f-([190,217,347][i]))/45;
      const pulse=clamp(phase);
      return <g key={'pulse'+i} opacity={.7*Math.sin(Math.PI*pulse)*fx.active}>
        <ellipse cx="0" cy="3" rx={52+165*pulse} ry={8+34*pulse}
          fill="none" stroke={i===0?'#DBDBC0':'#85BAC4'}
          strokeWidth={2.5-1.6*pulse}/>
      </g>;
    })}
    {Array.from({length:16},(_,i)=>{
      const a=i*2.399963, radial=75+i%4*15;
      const converge=amount(f,180+i*3,324+i*2);
      const x=Math.cos(a)*radial*(1-converge)+Math.sin(i*4.3)*13;
      const y=-79+Math.sin(a)*58*(1-converge);
      const twinkle=.5+.5*Math.sin(f*.2+i*1.9);
      return <circle key={'dust'+i} cx={x} cy={y} r={.8+i%3*.48}
        fill={i%3===0?'#F5DDC8':'#B6E8E7'}
        opacity={.58*fx.active*twinkle*(1-converge*.8)}/>;
    })}
    {/* Refraction through the rebuilding bottle casts a beam and caustics
        in the existing projected glass/bench coordinate system. */}
    <path d="M-44 -58 Q-110 -172 -159 -294 Q0 -335 159 -294 Q110 -172 44 -58Z"
      fill={u('lightshaft')} opacity={clamp(.66*fx.active+.52*fx.flash)}/>
    {[0,1,2].map(i=>{
      const wave=.5+.5*Math.sin(f*.09+i*1.9);
      return <ellipse key={'caustic'+i} cx={-44+i*43+5*Math.sin(f*.05+i)}
        cy={8+i%2*5} rx={26+7*wave} ry={4+i%2*2}
        fill="none" stroke={i===1?'#F4D6B6':'#A2E1DB'}
        strokeWidth={1.5+wave} opacity={fx.active*(.32+.26*wave)}/>;
    })}
    {/* Reconstructed body has a clipped jagged fracture front which
        physically rises as each fragment returns. No complete ghost vial. */}
    <g mask={u('rebuild')}>
      <path d={shell} transform="translate(5 2)"
        fill="#122F40" stroke="#1B3547" strokeWidth="4.5" opacity=".67"/>
      <path d={shell} fill={u('glass')} stroke="#7EAEB6" strokeWidth="2.15"/>
      <path d={shell} fill="none" stroke="#F6E5CF" strokeWidth="3.8"
        opacity={clamp(fx.flash*.52+fx.active*.18)}/>
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
    {/* Irregular glass fracture traces brighten only during the moment of
        joining, then become entirely invisible on the continuous shell. */}
    <g clipPath={u('shellShape')}>
      {pieces.map((piece,i)=>{
        const merge=seamAt(f,i);
        const x=piece.x,y=piece.y;
        return <path key={'weld'+i}
          d={'M'+(x-12)+' '+(y-24)+'l8 6 7 -3 8 12 -4 10 8 9'}
          fill="none" stroke={i%2?'#CFEBE3':'#EBD2B8'}
          strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"
          opacity={merge.glow*.53}/>;
      })}
    </g>
    {/* Every real fragment rotates up from the bench (foreshortened),
        follows its own staggered arc, and seats into a part of the wall.
        Thin, faint edge echoes indicate motion without duplicated tiles. */}
    {pieces.map((s,i)=>{
      const p=shardMotionAt(f,i),old=shardMotionAt(Math.max(0,f-6),i);
      const speed=Math.hypot(p.x-old.x,p.y-old.y);
      return <g key={'real-shard'+i}>
        {speed>.5?<path d={s.shape}
          transform={'translate('+old.x+' '+old.y+') rotate('+old.angle+') scale(1 '+old.squash+')'}
          fill="none" stroke="#C6E7DF" strokeWidth="1.05"
          opacity={p.opacity*.18*clamp(speed/12)}/>:null}
        <g opacity={p.opacity}
          transform={'translate('+p.x+' '+p.y+') rotate('+p.angle+') scale(1 '+p.squash+')'}>
          <path d={s.shape} transform="translate(2.6 2)"
            fill="#182D41" stroke="#233E51" strokeWidth="2.3"/>
          <path d={s.shape} fill={u('glass')} stroke="#BACBC5"
            strokeWidth="1.9" strokeLinejoin="round"/>
          <path d={s.shape} fill={u('shard')} opacity=".24"/>
          <path d="M-9 -15 Q-3 -20 6 -15" fill="none" stroke="#F2DFC7"
            strokeWidth="1.5" opacity=".8" strokeLinecap="round"/>
          <path d="M5 -12L8 10" fill="none" stroke="#8BBEC0"
            strokeWidth="2.0" opacity=".44"/>
          <path d="M-6 14L4 16" fill="none" stroke="#DCE7DF"
            strokeWidth="1.2" opacity=".72"/>
        </g>
      </g>;
    })}
    {/* Localized glints are energy released at physical weld progress,
        not arbitrary global flickers or a permanent seam highlight. */}
    {pieces.map((s,i)=>{
      const join=seamAt(f,i).glow;
      return <g key={'glint'+i} opacity={join*.43}>
        <path d={'M'+(s.x-6)+' '+s.y+'h12 M'+s.x+' '+(s.y-7)+'v14'}
          stroke="#F7E7D5" strokeWidth="1.3" strokeLinecap="round"/>
      </g>;
    })}
    {/* A slender reversed liquid filament connects the counter spill to
        the vial's mouth during the return, with brighter reflected flecks. */}
    <path d={'M'+(43*(1-w))+' -3 Q'+(24-12*w)+' '+(-59-16*w)+
      ' '+(4*(1-w))+' -146'} fill="none" stroke="#83C8D4"
      strokeWidth={2.7+1.1*Math.sin(f*.19)**2}
      strokeLinecap="round" opacity={.8*Math.sin(Math.PI*clamp(w))}/>
    {/* Water rises out of its shrinking spill and ENTERS the vial through
        its open metal mouth, using one local/world coordinate system. */}
    {Array.from({length:10},(_,i)=>{
      const q=dropletProgress(w,i),inFlight=Math.sin(Math.PI*q);
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
  const shot=evidenceShotAt(f);
  // One optical push across the SAME world projection while shards travel.
  // Crop and entire room scale together; no detached background/parallax.
  const push=(shot.beat==='lift'||shot.beat==='mend')
    ? .105*amount(f,185,329):0;
  const crop: [number,number,number,number]=[
    shot.crop[0]+shot.crop[2]*push/2,
    shot.crop[1]+shot.crop[3]*push/2,
    shot.crop[2]*(1-push),shot.crop[3]*(1-push)];
  const clockTime=clockSecondsAt(719)-(f/30)*5;
  // viewBox is the optical crop; geometry is projected by one shared world camera
  return <svg viewBox={crop.join(' ')} width="100%" height="100%">
    <LabRoomDepthScene id={id+'lab'} frame={f} camera={shot.camera}
      clockSeconds={clockTime} signal={.95} clockStyle="cinematic"
      performance={evidenceActorAt(f)}/>
    <ReversingAmpoule id={id+'evidence'} frame={f} camera={shot.camera}/>
  </svg>;
};
export const ReversalEvidenceStoryBoard:React.FC=()=> <svg viewBox="0 0 1920 1848" width="100%" height="100%">
  <rect width="1920" height="1848" fill="#101622"/>
  {[56,129,254,341,419,484].map((f,i)=>{
    const label=evidenceShotAt(f).label;
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
  const quiet=reversalFxAt(0),active=reversalFxAt(250),sealed=reversalFxAt(390);
  if(quiet.active!==0 || quiet.trail!==0 ||
     active.active<.9 || active.trail<=0 ||
     sealed.active>.55)
    throw new Error('Physical reversal VFX timing is wrong');
  if(Array.from({length:10},(_,i)=>dropletProgress(1,i)).some(v=>v!==1))
    throw new Error('Liquid particles still suspended after restoration');
  if(evidenceProgress(173).returnShards!==0||
     evidenceProgress(318).returnShards!==1||
     evidenceProgress(378).restore!==1||
     evidenceProgress(380).water!==1)
    throw new Error('Glass and liquid reconstruction did not reach exact phase limits');
  const initial=evidenceActorAt(0),baseline=discoveryActorAt(719);
  if(initial.yaw!==baseline.yaw||initial.headYaw!==baseline.headYaw)
    throw new Error('Approved clock ending must match the continuation opening');
  if(initial.pose.yaw!==baseline.pose.yaw||
     initial.pose.gaze!==baseline.pose.gaze||
     initial.pose.gazeY!==baseline.pose.gazeY)
    throw new Error('Actor eyeline not continuous with approved ending');
  for(let i=0;i<VIAL_SHARDS.length;i++){
    const s=VIAL_SHARDS[i],initial=shardMotionAt(0,i),last=shardMotionAt(509,i);
    for(let f=0;f<REVERSAL_FRAMES;f++){
      const weld=seamAt(f,i);
      if(Math.abs(weld.complete+weld.remaining-1)>1e-8 ||
        weld.glow<0 || weld.glow>1.000001)
        throw new Error('Glass shard did not become its corresponding shell '+i+' at '+f);
      if(f<s.seal&&weld.complete!==0)
        throw new Error('Bottle shell appears before shard arrives '+i+' at '+f);
    }
    if(Math.abs(initial.x-s.bx)>.001||Math.abs(initial.y-s.by)>.001||
       Math.abs(last.x-s.x)>.001||Math.abs(last.y-s.y)>.001||
       last.opacity!==0||initial.opacity!==1)
      throw new Error('Shard lost physical landing or final welded location '+i);
    if(shardMotionAt(s.seal,i).progress<.999)
      throw new Error('Shard not fully seated before glass seal '+i);
  }
  let last=0,maxHandStep=0,maxFootDrift=0,maxHandAcceleration=0,prevHandStep=0;
  let maxNeckSeparation=0,maxHeadStep=0,maxBodyStep=0;
  for(let f=0;f<REVERSAL_FRAMES;f++){
    const shot=evidenceShotAt(f),phase=evidenceProgress(f);
    if(f!==0&&f%60===0&&phase.returnShards<last-.00001)throw new Error('Time reversal regressed');
    last=phase.returnShards;
    const camera=shot.camera;
    const q=projectWorld(BASE,camera);
    if(!Number.isFinite(q.x+q.y+q.scale)||q.scale<=0)throw new Error('Invalid world prop projection at '+f);
    if(f>=174&&f<376&&shot.crop[2]!==450)throw new Error('Close insert lost world framing');
    const actor=evidenceActorAt(f);
    // Render the actual posed actor for all 510 frames in the pre-render
    // source audit, not just its feet. This catches impossible arm IK.
    CharacterTurnV5({id:'reversal-rig-audit',x:0,y:0,scale:actor.scale,
      yaw:actor.yaw,headYaw:actor.headYaw,pose:actor.pose,mood:actor.mood,
      outfit:'puffer-black',lighting:'sunset',shadow:false});
    if(!actor.soleWorld.some(s=>Math.abs(s.y)<.001))throw new Error('Actor has no planted support '+f);
    if(f>0){
      const prev=evidenceActorAt(f-1);
      const neck=Math.abs(actor.headYaw-actor.yaw);
      if(f>=80)maxNeckSeparation=Math.max(maxNeckSeparation,neck);
      const headStep=Math.abs(actor.headYaw-prev.headYaw);
      const bodyStep=Math.abs(actor.yaw-prev.yaw);
      maxHeadStep=Math.max(maxHeadStep,headStep);
      maxBodyStep=Math.max(maxBodyStep,bodyStep);
      if((f>=80&&(neck>.281||actor.headYaw>-.099))||
         headStep>.075||bodyStep>.075||
         actor.pose.torsoYaw!==actor.yaw||actor.pose.yaw!==actor.headYaw)
        throw new Error('Independent neck spin, face flip or unsupported torso facing at '+f);
      const handStep=Math.hypot(actor.pose.hand.x-prev.pose.hand.x,
                                actor.pose.hand.y-prev.pose.hand.y);
      maxHandStep=Math.max(maxHandStep,handStep);
      maxHandAcceleration=Math.max(maxHandAcceleration,Math.abs(handStep-prevHandStep));
      prevHandStep=handStep;
      maxFootDrift=Math.max(maxFootDrift,
        ...actor.soleWorld.map((s,i)=>Math.abs(s.x-prev.soleWorld[i].x)+
          Math.abs(s.z-prev.soleWorld[i].z)));
      if(handStep>3.2||maxHandAcceleration>1.8||maxFootDrift>.001)throw new Error('Abrupt elbow/wrist or planted foot slide '+f);
    }
  }
  return {frames:REVERSAL_FRAMES,shots:EVIDENCE_SHOTS.length,prop:'detailed world-projected transparent glass and physical metal clamp',source:'approved ClockDiscoveryPerformance unchanged',renderGate:'MOTION_REVIEW_NOT_MASTER',maxHandStep,maxHandAcceleration,maxFootDrift,maxNeckSeparation,maxHeadStep,maxBodyStep};
};
