import React from 'react';
import {useCurrentFrame} from 'remotion';
import {basePose,camT,joints,Pose} from '../../engine';
import {
  CharacterRigV2,Point,rigV2Joints,rigLocalToWorld,
  rigWorldToLocal,distance
} from './character-rig-v2';
import {Room,Defs} from './character-v2-gallery';

/**
 * Acting study V3 — a complete, physical, 12-second micro-story.
 *
 * A strange coin falls out of an illuminated console. The character sees it,
 * advances with two planted-foot steps, leans and crouches, reaches, makes
 * exact hand-object contact, rises with the SAME coin, then reacts to its
 * unexpected glow. A single world-camera transforms ALL physical geometry.
 *
 * This is fully original artwork/behavior and isolated from the existing film.
 */
export const ACTING_V3_FRAMES=360;
export const ACTING_V3_FPS=30;
type XY={x:number;y:number};
const C={
  ink:'#100E18',cream:'#FFF2DE',gold:'#F2BF70',amber:'#F8C36A',
  coral:'#E35A45',mint:'#6DDBCC',steel:'#96A9B8',shadow:'#0B0C17'
};
const clamp=(x:number,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=(t:number)=>{const x=clamp(t);return x*x*(3-2*x);};
const ease=(t:number,a:number,b:number)=>smooth((t-a)/(b-a));
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const mixPoint=(a:XY,b:XY,t:number):XY=>({x:mix(a.x,b.x,t),y:mix(a.y,b.y,t)});
const restFoot={L:{x:694,y:857},R:{x:742,y:857}};
const stepFoot={L:{x:829,y:857},R:{x:902,y:857}};
const COIN_FLOOR={x:985,y:833};
const rainbow=(n:number)=>Math.sin(n)*.5+.5;
const blinkAt=(f:number,mark:number)=>Math.max(0,1-Math.abs(f-mark)/3);
const coinDrop=(f:number)=>{
  const drop=ease(f,22,64);
  const impact=f<64?0:Math.sin((f-64)*.42)*Math.exp(-(f-64)/10)*16;
  return {
    x:mix(1012,COIN_FLOOR.x,drop),
    y:mix(531,COIN_FLOOR.y,drop)-Math.max(0,impact),
    spin:f>=22&&f<65?(f-22)*12:0
  };
};
const arcStep=(from:XY,to:XY,f:number,a:number,b:number,lift:number):XY=>{
  const q=clamp((f-a)/(b-a));
  const x=mix(from.x,to.x,smooth(q));
  const y=from.y-Math.sin(Math.PI*q)*lift;
  return {x,y};
};
const poseAtFrame=(f:number):Pose=>{
  const advance=ease(f,55,127);
  const crouch=ease(f,122,174);
  const rise=ease(f,197,249);
  const recoil=ease(f,264,292);
  const anticipation=ease(f,35,49)*(1-ease(f,54,70));
  const focus=ease(f,129,162)*(1-ease(f,235,266));
  const x=716+139*advance-13*recoil;
  const y=662+10*advance+126*crouch-136*rise+3*anticipation;
  const tilt=1+19*crouch-19*rise-12*recoil+5*anticipation;
  const headTilt=-6*focus+8*recoil-5*anticipation;
  const expr:Pose['expr']=f<31?'neutral'
    :f<79?'shock'
    :f<202?'worried'
    :f<253?'happy'
    :'shock';
  const grounded:Pose={
    ...basePose,
    x,y,scale:1.44,yaw:f<115?.16:ease(f,115,155)*.17+.16,
    tilt,headTilt,expr,look:f<85?.75:.3,
    blink:Math.max(blinkAt(f,34),blinkAt(f,88),blinkAt(f,258)),
    armL:{
      a:mix(14,45,crouch)*(1-.30*rise),
      b:-12
    },
    armR:{
      a:mix(24,39,crouch),
      b:-18
    },
    // With IK targets these angles are only emergency fallbacks.
    legL:{a:4,b:-16},legR:{a:-5,b:14}
  };
  return grounded;
};
const worldFoot=(side:'L'|'R',f:number):Point=>{
  if(side==='R')return arcStep(restFoot.R,stepFoot.R,f,54,97,43);
  return arcStep(restFoot.L,stepFoot.L,f,79,124,36);
};
const poseTargets=(pose:Pose,f:number)=>{
  const L=rigWorldToLocal(pose,worldFoot('L',f));
  const R=rigWorldToLocal(pose,worldFoot('R',f));
  return {L,R};
};
const startingHandWorld=(pose:Pose)=>{
  const arm=rigV2Joints(pose).armR;
  return rigLocalToWorld(pose,arm.end);
};
const worldHand=(pose:Pose,f:number):XY|null=>{
  if(f<148)return null;
  const target=COIN_FLOOR;
  const progress=ease(f,148,187);
  const free=startingHandWorld(pose);
  const reach=mixPoint(free,target,progress);
  if(f<187)return reach;
  const lift=ease(f,189,246);
  const recoil=ease(f,261,289);
  return {
    x:mix(target.x,925,lift)-38*recoil,
    y:mix(target.y,627,lift)-28*recoil
  };
};
const anatomyAt=(f:number)=>{
  const pose=poseAtFrame(f);
  const feet=poseTargets(pose,f);
  const hand=worldHand(pose,f);
  const handLocal=hand?rigWorldToLocal(pose,hand):undefined;
  const j=rigV2Joints(pose,handLocal?{R:handLocal}:{},feet);
  const actualHand=rigLocalToWorld(pose,j.armR.end);
  const footL=rigLocalToWorld(pose,j.legL.end);
  const footR=rigLocalToWorld(pose,j.legR.end);
  return {pose,feet,hand,handLocal,actualHand,footL,footR};
};
/**
 * Deterministic contact audit. All these times are physically constrained.
 * Frames 0..360 are pure function of the frame: no synthetic randomness.
 */
export const validateActingV3=()=>{
  const frames=[0,18,40,53,62,76,86,102,118,145,174,187,195,220,250,277,310,359];
  for(const f of frames){
    const s=anatomyAt(f);
    if(!Number.isFinite(s.pose.x)||!Number.isFinite(s.actualHand.x))
      throw new Error('V3 nonfinite actor frame '+f);
    if(s.hand && f>=187 && distance(s.actualHand,s.hand)>8)
      throw new Error('V3 lost hand-object contact on frame '+f);
    if(f>124){
      if(distance(s.footL,stepFoot.L)>6 || distance(s.footR,stepFoot.R)>6)
        throw new Error('V3 feet drift after last step on '+f);
    }
  }
  return true;
};
validateActingV3();

const Coin:React.FC<{x:number;y:number;rotation?:number;energy?:number;held?:boolean}>=
({x,y,rotation=0,energy=0,held=false})=>{
  const charged=energy>0;
  return <g transform={'translate('+x+' '+y+') rotate('+rotation+') scale(1.3)'}>
    {charged?<g>
      <circle r={27+energy*90} fill="url(#actingV3GoldGlow)" opacity={energy*.8}/>
      <circle r={27+energy*27} stroke={C.gold} strokeWidth={2+3*energy}
        fill="none" opacity={.5+.4*energy}/>
      <circle r={45+energy*22} stroke={C.cream} strokeWidth="2"
        fill="none" opacity={energy*.3}/>
    </g>:null}
    <ellipse rx="17" ry="19" fill="#8D5C2B" stroke="#3D2E26" strokeWidth="4"/>
    <ellipse cx="-2" cy="-2" rx="14" ry="16" fill="#F7CB74"
      stroke="#FFE7A0" strokeWidth="3"/>
    <path d="M-7 -10L8 9M7 -10L-8 9" stroke="#9F642B" strokeWidth="3.3"
      strokeLinecap="round"/>
    {charged?<path d="M-9 -15Q-2 -18 5 -15" stroke="#FFF6CE"
      fill="none" strokeWidth="4" strokeLinecap="round"/>:null}
    {held?<circle cx="9" cy="10" r="5" fill={C.cream} opacity=".9"/>:null}
  </g>;
};
const EventLight:React.FC<{f:number;coin:XY}>=({f,coin})=>{
  const spark=ease(f,248,264);
  const exposure=Math.sin((f-260)*.24)*.5+.5;
  return <g>
    {spark>0?<g opacity={spark}>
      <circle cx={coin.x} cy={coin.y} r={50+exposure*20}
        fill="url(#actingV3GoldGlow)" opacity=".65"/>
      {Array.from({length:7},(_,i)=>{
        const ang=(i*2*Math.PI)/7+.12*f/30;
        const len=56+25*rainbow(f*.15+i);
        return <path key={i}
          d={'M'+(coin.x+Math.cos(ang)*30)+' '+(coin.y+Math.sin(ang)*30)
            +'L'+(coin.x+Math.cos(ang)*len)+' '+(coin.y+Math.sin(ang)*len)}
          stroke={i%2?C.gold:C.cream} strokeWidth={i%3?3:5}
          opacity={.22+spark*.5} strokeLinecap="round"/>;
      })}
    </g>:null}
  </g>;
};
const Shadows:React.FC<{f:number;coin:XY;held:boolean}>=({f,coin,held})=><g>
  {!held?<g>
    <ellipse cx={COIN_FLOOR.x} cy="849" rx="46" ry="11"
      fill={C.shadow} opacity=".12"/>
    <ellipse cx={COIN_FLOOR.x} cy="850" rx="23" ry="5.5"
      fill={C.shadow} opacity={.1+.38*ease(f,38,67)}/>
  </g>:null}
</g>;
const Stage:React.FC<{f:number}>=({f})=>{
  const actor=anatomyAt(f);
  const {pose,feet,handLocal,actualHand}=actor;
  const fallen=coinDrop(f);
  const held=f>=187;
  const coin=held?actualHand:fallen;
  const shine=ease(f,248,265);
  return <g>
    <Room lab active={shine>.2}/>
    <rect x="210" y="691" width="480" height="48" rx="18"
      fill="#34303A" stroke="#181625" strokeWidth="8" opacity=".7"/>
    <path d="M230 694H670" stroke="#746C74" strokeWidth="5" opacity=".65"/>
    <g>
      <ellipse cx={COIN_FLOOR.x} cy="853" rx="45" ry="11"
        fill={C.ink} opacity=".15"/>
      <Shadows f={f} coin={coin} held={held}/>
    </g>
    <CharacterRigV2
      pose={pose}
      variant="coral"
      feet={feet}
      hands={handLocal?{R:handLocal}:undefined}
      handStyles={{R:held?'grip':'open'}}
      shadow={.5}
    />
    <Coin x={coin.x} y={coin.y-(!held&&f>=64?1:0)}
      rotation={held?0:fallen.spin}
      energy={shine*(.64+.18*Math.sin(f*.15))}
      held={held}/>
    <EventLight f={f} coin={coin}/>
    {/* Physical world is now free of detached screen-space annotations. */}
  </g>;
};
const Camera:React.FC<{f:number;children:React.ReactNode}>=({f,children})=>{
  const press=ease(f,116,193);
  const reaction=ease(f,259,330);
  const cx=960-21*press-41*reaction;
  const cy=540+51*press-71*reaction;
  const zoom=.99+.07*press+.31*reaction;
  return <g transform={camT(cx,cy,zoom)}>{children}</g>;
};
const safeText:React.FC<{f:number}>=()=>null;
export const CharacterActingV3:React.FC=()=>{
  const f=useCurrentFrame();
  return <svg width="100%" height="100%" viewBox="0 0 1920 1080"
    xmlns="http://www.w3.org/2000/svg">
    <Defs/>
    <defs>
      <radialGradient id="actingV3GoldGlow">
        <stop offset="0" stopColor="#FFF2BA" stopOpacity=".7"/>
        <stop offset=".35" stopColor="#E5B461" stopOpacity=".33"/>
        <stop offset="1" stopColor="#E5B461" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <Camera f={f}><Stage f={f}/></Camera>
    {f>=260?<g opacity={ease(f,260,295)}>
      <rect x="1314" y="177" width="500" height="132" rx="17"
        fill="#111724" opacity=".86"/>
      <path d="M1342 202V284" stroke={C.gold} strokeWidth="5"/>
      <text x="1370" y="240" fontFamily="Arial,sans-serif"
        fontWeight="800" fill={C.cream} fontSize="42">IMPOSSIBLE.</text>
      <text x="1370" y="279" fontFamily="Arial,sans-serif"
        fill={C.steel} fontSize="24">THE COIN IS CHARGED.</text>
    </g>:null}
    <g opacity=".92">
      <path d="M73 92H490" stroke={C.gold} strokeWidth="5"
        strokeLinecap="round"/>
      <text x="74" y="143" fontFamily="Arial,sans-serif"
        fill={C.cream} fontSize="35" fontWeight="800" letterSpacing="1.5">
        CHARACTER ACTING STUDY
      </text>
      <text x="75" y="180" fontFamily="Arial,sans-serif"
        fill={C.steel} fontSize="25" letterSpacing="1.2">
        SEE → STEP → CROUCH → REACH → LIFT → REACT
      </text>
    </g>
    <text x="1800" y="1052" textAnchor="end"
      fontFamily="Arial,sans-serif" fontSize="24"
      fill={C.steel} opacity=".78">V3 / ORIGINAL SVG / WORLD-ANCHORED</text>
  </svg>;
};
