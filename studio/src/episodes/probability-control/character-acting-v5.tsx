import React from 'react';
import {useCurrentFrame} from 'remotion';
import {camT} from '../../engine';
import {
  CharacterRigV5,V5Pose,V5Point,actorV5At,deriveV5Rig,
  auditV5Mechanics,V5_CONTROL_POINT,ease,mix,dist
} from './character-rig-v5';

/**
 * Skill-led original 11-second physical acting demonstration.
 * Remotion: all frame state derives from useCurrentFrame(), no CSS animation.
 * Animate: only motivated action has movement (glance, load, step, brace,
 * press, recoil, settle).
 * Vector illustration: original component geometry, meaningful overlap,
 * visual audit at phone size, no AI raster or Blender.
 */
export const V5_TEST_FPS=30;
export const V5_TEST_FRAMES=330;
const P={cream:'#FFF2DE',ink:'#100E18',gold:'#F2BF70',
  teal:'#6DDBCC',gray:'#A5B7C8',coral:'#E35A45',violet:'#31283C'};
const BLUE='#18293E';
const done=(f:number)=>ease(f,224,238);
const contact=(f:number)=>ease(f,178,215)*(1-ease(f,247,274));
export const actingV5At=(frame:number):V5Pose=>{
  const pose=actorV5At(frame);
  const rest=deriveV5Rig(pose).nearHandTarget;
  const k=contact(frame);
  return {...pose,nearHand:{
    x:mix(rest.x,V5_CONTROL_POINT.x,k),
    y:mix(rest.y,V5_CONTROL_POINT.y,k)
  }};
};
export const auditV5Sequence=()=>{
  auditV5Mechanics();
  let maxContact=0,maxReachError=0;
  for(let f=0;f<V5_TEST_FRAMES;f++){
    const pose=actingV5At(f),rig=deriveV5Rig(pose);
    maxReachError=Math.max(maxReachError,rig.armNear.reachError);
    if(f>=215&&f<=247){
      maxContact=Math.max(maxContact,dist(rig.armNear.end,V5_CONTROL_POINT));
    }
    if(f>=142 && f<=329 &&
      (Math.abs(pose.footFar.y-847)>.01||Math.abs(pose.footNear.y-847)>.01))
      throw new Error('V5 feet broke contact after walking at '+f);
  }
  if(maxContact>1.2)throw new Error('V5 button hand misses its fixed target '+maxContact);
  if(maxReachError>1.2)throw new Error('V5 hands unreachable during motion '+maxReachError);
  return {maxContact,maxReachError};
};
auditV5Sequence();

const Lab:React.FC<{lit:boolean}>=({lit})=><g>
  <defs>
    <linearGradient id="v5Wall" x1="0" y1="0" x2="1" y2="1">
      <stop stopColor="#34293A"/>
      <stop offset=".55" stopColor="#252234"/>
      <stop offset="1" stopColor="#111C2B"/>
    </linearGradient>
    <linearGradient id="v5City" x1="0" y1="0" x2=".1" y2="1">
      <stop stopColor="#6A87A7"/>
      <stop offset=".55" stopColor="#364964"/>
      <stop offset="1" stopColor="#1B2941"/>
    </linearGradient>
    <linearGradient id="v5Floor" x1="0" y1="0" x2="0" y2="1">
      <stop stopColor="#3A3442"/>
      <stop offset="1" stopColor="#171B2B"/>
    </linearGradient>
    <radialGradient id="v5WarmHalo">
      <stop stopColor="#EFB973" stopOpacity=".35"/>
      <stop offset="1" stopColor="#EFB973" stopOpacity="0"/>
    </radialGradient>
    <radialGradient id="v5ActiveHalo">
      <stop stopColor="#74EBD2" stopOpacity=".48"/>
      <stop offset="1" stopColor="#74EBD2" stopOpacity="0"/>
    </radialGradient>
  </defs>
  <rect x="-800" y="-700" width="3700" height="2800" fill="url(#v5Wall)"/>
  <rect x="0" y="852" width="1920" height="560" fill="url(#v5Floor)"/>
  <path d="M0 849H1920" stroke="#181827" strokeWidth="23"/>
  <path d="M0 840H1920" stroke="#A28B8C" strokeWidth="4" opacity=".4"/>
  {/* Fixed perspective floor lines provide a grounding plane. */}
  <g stroke="#C5A3A0" strokeWidth="2" opacity=".14">
    {Array.from({length:14},(_,i)=>
      <path key={i} d={'M'+(i*170-170)+' 1080L'+(950+(i*170-950)*.27)+' 850'}/>)}
    {[920,1030].map(y=><path key={y} d={'M-200 '+y+'H2200'}/>)}
  </g>
  {/* Window and distant silhouette: not independently animated. */}
  <g>
    <rect x="116" y="195" width="540" height="495" rx="20"
      fill="#151B2B" stroke="#594B5B" strokeWidth="23"/>
    <rect x="138" y="216" width="496" height="451" fill="url(#v5City)"/>
    <circle cx="516" cy="315" r="39" fill="#C8D9E2" opacity=".8"/>
    <path d="M140 560L210 503L290 551L337 479L405 544L495 510L634 568V669H140Z"
      fill="#26334A" opacity=".8"/>
    {Array.from({length:9},(_,i)=>
      <rect key={i} x={154+i*53} y={490+(i%4)*26}
        width={36} height={180} fill="#1B293D" opacity=".87"/>)}
    <path d="M380 214V665M137 434H635" stroke="#534B61" strokeWidth="17"/>
    <path d="M170 226H610" stroke="#C0ACAA" strokeWidth="5" opacity=".2"/>
  </g>
  {/* Lab utility surface; all props stay anchored in world coordinates. */}
  <rect x="1164" y="230" width="575" height="329" rx="17"
    fill="#1A2434" stroke="#586477" strokeWidth="9"/>
  <rect x="1184" y="251" width="536" height="286" rx="8" fill="#283F51"/>
  <path d="M1210 449L1268 418L1324 429L1405 348L1474 383L1550 327L1623 361"
    fill="none" stroke={lit?P.teal:'#6B9BA5'}
    strokeWidth="8" strokeLinecap="round"/>
  <path d="M1215 286H1680M1215 501H1680" stroke="#7995A6" strokeWidth="3" opacity=".28"/>
  {Array.from({length:7},(_,i)=>
    <rect key={i} x={1210+i*66} y="466" width="44"
      height={12+(i%3)*10} rx="4"
      fill={i===4&&lit?P.teal:'#547383'} opacity=".75"/>)}
  <rect x="1280" y="641" width="450" height="158" rx="18"
    fill="#292B3B" stroke="#444958" strokeWidth="9"/>
  {[0,1,2].map(i=><path key={i}
    d={'M1319 '+(689+i*42)+'H1660'} stroke="#67778A"
    strokeWidth="9" opacity=".48"/>)}
  <ellipse cx="1667" cy="208" rx="540" ry="390" fill="url(#v5WarmHalo)" opacity=".6"/>
  {/* Low wall console exactly matches the hand's world-contact target. */}
  <rect x="869" y="510" width="242" height="313" rx="19"
    fill="#303644" stroke="#171D29" strokeWidth="12"/>
  <rect x="890" y="538" width="200" height="86" rx="8"
    fill="#111B2A" stroke="#5B687A" strokeWidth="6"/>
  <path d="M912 590L941 574L965 590L1005 559L1060 584"
    fill="none" stroke={lit?P.teal:'#6994A1'}
    strokeWidth="5" strokeLinecap="round"/>
  <g>
    <circle cx={V5_CONTROL_POINT.x} cy={V5_CONTROL_POINT.y} r="31"
      fill="#1B202C" stroke="#79808F" strokeWidth="6"/>
    <circle cx={V5_CONTROL_POINT.x} cy={V5_CONTROL_POINT.y} r="19"
      fill={lit?P.teal:P.coral} stroke="#EAC59C" strokeWidth="4"/>
    <circle cx={V5_CONTROL_POINT.x} cy={V5_CONTROL_POINT.y}
      r={lit?49:39} fill="none"
      stroke={lit?P.teal:P.coral} strokeWidth="3" opacity={lit?.9:.33}/>
  </g>
  <path d="M920 822V849" stroke="#4C5567" strokeWidth="13"/>
  <path d="M980 822V849" stroke="#4C5567" strokeWidth="13"/>
  <ellipse cx={950} cy={849} rx="133" ry="17" fill="#090B14" opacity=".27"/>
  {lit?<ellipse cx="918" cy="674" rx="220" ry="180"
    fill="url(#v5ActiveHalo)" opacity=".88"/>:null}
  <path d="M80 151H1852" stroke="#5B5066" strokeWidth="20" opacity=".8"/>
  {[265,550,1780].map(x=><rect key={x} x={x} y="148"
    width="36" height="104" rx="8" fill="#313044"/>)}
</g>;
const Camera:React.FC<{frame:number;children:React.ReactNode}>=({frame,children})=>{
  const near=ease(frame,149,194);
  const reaction=ease(frame,264,303);
  const cx=mix(960,885,near)-64*reaction;
  const cy=mix(540,572,near)-38*reaction;
  const zoom=1+.15*near+.12*reaction;
  return <g transform={camT(cx,cy,zoom)}>{children}</g>;
};
const Hud:React.FC<{frame:number}>=({frame})=>{
  const stage=frame<56?'NOTICE'
    :frame<147?'STEP & TRANSFER WEIGHT'
    :frame<214?'BRACE & LOWER'
    :frame<259?'PHYSICAL CONTACT'
    :'RECOIL & SETTLE';
  return <g fontFamily="Arial,sans-serif">
    <rect x="74" y="65" width="830" height="128" rx="16"
      fill="#111722" opacity=".82"/>
    <path d="M94 83V172" stroke={P.gold} strokeWidth="6"/>
    <text x="120" y="119" fontSize="35" fill={P.cream}
      fontWeight="800" letterSpacing="1">RIG V5 — BODY MECHANICS</text>
    <text x="120" y="161" fontSize="26" fill="#AABCCA"
      letterSpacing="1">{stage}</text>
    <text x="1790" y="1041" textAnchor="end" fontSize="23"
      fill="#BBC4D4" opacity=".75">ORIGINAL SVG • FIXED WORLD • NO BLENDER</text>
  </g>;
};
export const CharacterActingV5:React.FC=()=>{
  const f=useCurrentFrame();
  const pose=actingV5At(f);
  const pressed=done(f)>.01;
  const reflect=ease(f,231,250)*(1-ease(f,290,324));
  return <svg width="100%" height="100%" viewBox="0 0 1920 1080"
    xmlns="http://www.w3.org/2000/svg">
    <Camera frame={f}>
      <Lab lit={pressed}/>
      <CharacterRigV5 pose={pose} grip={contact(f)>.95}/>
      {pressed?<g opacity={reflect}>
        <path d="M1066 657H1210" stroke={P.teal} strokeWidth="5"/>
        <text x="1220" y="665" fontFamily="Arial,sans-serif"
          fontSize="34" fontWeight="800" fill={P.teal}>SYSTEM LIVE</text>
        <ellipse cx="912" cy="710" rx="140" ry="142"
          fill="url(#v5ActiveHalo)" opacity=".48"/>
      </g>:null}
    </Camera>
    <Hud frame={f}/>
  </svg>;
};
