import React from 'react';
import {useCurrentFrame} from 'remotion';
import {basePose,camT,Pose} from '../../engine';
import {
  CharacterRigV2,Point,distance,rigWorldToLocal,rigV2Joints,
  rigLocalToWorld
} from './character-rig-v2';
import {Defs,Room} from './character-v2-gallery';

/**
 * Character Acting V4: staged body mechanics.
 * One original coin, two readable planted steps, a genuine knee-flex squat,
 * a motivated macro hand pickup, and a reaction with a physically held prop.
 * All actual set layers use the SAME world camera. Cuts do not move props.
 * Previous V2/V3 compositions and the long film remain untouched.
 */
export const ACTING_V4_FRAMES=360;
export const ACTING_V4_FPS=30;
const GROUND=857;
const COIN:Point={x:918,y:834};
const END_HAND:Point={x:878,y:575};
const REST={L:{x:600,y:GROUND},R:{x:664,y:GROUND}};
const FINISH={L:{x:704,y:GROUND},R:{x:772,y:GROUND}};
const C={cream:'#FFF2DE',ink:'#100E18',gold:'#F2BF70',teal:'#6DDBCC',
  coral:'#E35A45',dark:'#151825',steel:'#A2B0C0'};
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const ease=(f:number,a:number,b:number)=>{const t=clamp((f-a)/(b-a));return t*t*(3-2*t)};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const between=(a:Point,b:Point,t:number):Point=>({x:mix(a.x,b.x,t),y:mix(a.y,b.y,t)});
const step=(a:Point,b:Point,f:number,start:number,end:number,height:number):Point=>{
  const q=clamp((f-start)/(end-start));
  return {x:mix(a.x,b.x,ease(f,start,end)),y:a.y-Math.sin(Math.PI*q)*height};
};
const feetAt=(f:number)=>({
  L:step(REST.L,FINISH.L,f,85,117,37),
  R:step(REST.R,FINISH.R,f,56,92,46)
});
const squatAt=(f:number)=>ease(f,122,179)*(1-ease(f,220,260));
const actorAt=(f:number):Pose=>{
  const walkA=ease(f,56,92), walkB=ease(f,85,117), squat=squatAt(f);
  const recoil=ease(f,281,294)*(1-ease(f,308,332));
  const stepBob= (Math.sin(Math.PI*clamp((f-56)/36))*4+
    Math.sin(Math.PI*clamp((f-85)/32))*3);
  const x=632+53*walkA+53*walkB+12*squat-5*recoil;
  const y=675-stepBob+66*squat-2*recoil;
  const armSwingR= Math.sin(Math.PI*clamp((f-56)/36))*23;
  const armSwingL= Math.sin(Math.PI*clamp((f-85)/32))*21;
  const face:Pose['expr']=f<35?'neutral':f<98?'shock':
    f<220?'worried':f<275?'neutral':'shock';
  return {...basePose,x,y,scale:1.45,yaw:.18+ .08*ease(f,115,145),
    tilt:3+6*squat-8*recoil,
    headTilt:-3-10*squat+11*recoil,
    look:f<275?.6:.85,
    blink:Math.max(...[47,129,273,323].map(b=>Math.max(0,1-Math.abs(f-b)/2))),
    expr:face,
    armR:{a:19+armSwingR*(1-squat),b:-10-7*squat},
    armL:{a:19-armSwingL*(1-squat),b:-10-7*squat},
    legR:{a:4,b:-12}, legL:{a:3,b:15}};
};
const handsAt=(pose:Pose,f:number):{L?:Point;R?:Point}=>{
  const squat=squatAt(f);
  if(f>=260)return {R:rigWorldToLocal(pose,END_HAND)};
  if(squat<.01)return {};
  // Hands brace above the knees while the pelvis lowers. This prevents
  // the impossible floor pickup shown by V3's wide-angle rig.
  return {
    L:rigWorldToLocal(pose,{x:pose.x-68,y:pose.y-24}),
    R:rigWorldToLocal(pose,{x:pose.x+73,y:pose.y-24})
  };
};
const anatomy=(f:number)=>{
  const pose=actorAt(f);
  const targets=feetAt(f);
  const feet={
    L:rigWorldToLocal(pose,targets.L),
    R:rigWorldToLocal(pose,targets.R)
  };
  const hands=handsAt(pose,f);
  const j=rigV2Joints(pose,hands,feet);
  return {
    pose,feet,hands,targets,j,
    worldL:rigLocalToWorld(pose,j.legL.end),
    worldR:rigLocalToWorld(pose,j.legR.end),
    worldHand:rigLocalToWorld(pose,j.armR.end)
  };
};
/** Unit-style runtime contact + gait audit, independent of any render. */
export const auditV4=()=>{
  let maxFootError=0;
  for(let f=0;f<ACTING_V4_FRAMES;f+=2){
    const a=anatomy(f);
    maxFootError=Math.max(maxFootError,
      distance(a.worldL,a.targets.L),distance(a.worldR,a.targets.R));
    if(!Number.isFinite(a.pose.x)||!Number.isFinite(a.worldHand.y))
      throw new Error('Nonfinite actor position at frame '+f);
    if(f>=117&&f<260 &&
      (distance(a.targets.L,FINISH.L)>.01||distance(a.targets.R,FINISH.R)>.01))
      throw new Error('Planted targets shifted after walking '+f);
    if(f>=260&&distance(a.worldHand,END_HAND)>2)
      throw new Error('Coin-hand contact lost '+f);
  }
  if(maxFootError>2)throw new Error('Foot sliding from unreachable target: '+maxFootError);
  const standing=anatomy(118), squatting=anatomy(182);
  if(squatting.pose.y-standing.pose.y<56)
    throw new Error('Insufficient hip drop to read as crouch');
  const stance=distance(FINISH.L,FINISH.R);
  if(!(stance>=55&&stance<=90))throw new Error('Unstable finishing stance');
  return {frames:ACTING_V4_FRAMES,maxFootError,stance};
};
auditV4();

const FloorCoin:React.FC<{at:Point;power?:number;rotation?:number}>=
({at,power=0,rotation=0})=><g transform={'translate('+at.x+' '+at.y+') rotate('+rotation+')'}>
  {power>0?<g>
    <circle r={35+power*72} fill="url(#actingV4CoinGlow)" opacity={.83*power}/>
    <circle r={34+power*14} stroke={C.gold} strokeWidth={3.4}
      fill="none" opacity={.55*power}/>
  </g>:null}
  <ellipse rx="17" ry="18" fill="#92612F" stroke="#291D20" strokeWidth="4"/>
  <ellipse cx="-2" cy="-2" rx="14" ry="15" fill="#F8D585"
    stroke="#FFEDBA" strokeWidth="2.5"/>
  <path d="M-8 -8L8 9M7 -8L-8 8" stroke="#8D5B2F"
    strokeWidth="3" strokeLinecap="round"/>
</g>;
const releasedCoin=(f:number):Point=>{
  const t=ease(f,27,61);
  const q=f<61?0:Math.max(0,Math.sin((f-61)*.55))*Math.exp(-(f-61)/11)*11;
  return {x:mix(1012,COIN.x,t),y:mix(532,COIN.y,t)-q};
};
const macroHand=(f:number):Point=>{
  const grasp=ease(f,197,231), lift=ease(f,234,259);
  const first=between({x:700,y:623},COIN,grasp);
  return between(first,END_HAND,lift);
};
const CloseHand:React.FC<{f:number}>=({f})=>{
  const at=macroHand(f);
  const start={x:680,y:560};
  const d='M'+start.x+' '+start.y+'Q'+(at.x-89)+' '+(at.y-110)
    +' '+at.x+' '+at.y;
  return <g>
    <path d={d} stroke="#160F18" strokeWidth="50" fill="none"
      strokeLinecap="round"/>
    <path d={d} stroke={C.coral} strokeWidth="39" fill="none"
      strokeLinecap="round"/>
    <path d={'M'+start.x+' '+start.y+'Q'+(at.x-92)+' '+(at.y-118)
      +' '+at.x+' '+at.y}
      stroke="#F28E71" strokeWidth="6" opacity=".7" fill="none"
      strokeLinecap="round"/>
    <ellipse cx={at.x} cy={at.y} rx="22" ry="24"
      fill={C.cream} stroke="#2B2025" strokeWidth="5"/>
    <path d={'M'+(at.x-12)+' '+(at.y-3)+'Q'+at.x+' '+(at.y+17)
      +' '+(at.x+10)+' '+(at.y-2)}
      fill="none" stroke="#CEA99C" strokeWidth="4" strokeLinecap="round"/>
  </g>;
};
const Background:React.FC<{charged:boolean}>=({charged})=><g>
  <Room lab active={charged}/>
  <path d="M90 850H1860" stroke="#151623" strokeWidth="12" opacity=".48"/>
  <path d="M0 860H1920" stroke="#797078" strokeWidth="2" opacity=".28"/>
  <ellipse cx={COIN.x} cy={GROUND-5} rx="38" ry="8"
    fill="#0B0B15" opacity=".4"/>
  <rect x="312" y="691" width="390" height="42" rx="18"
    fill="#3F3644" stroke="#1D1B29" strokeWidth="8"/>
</g>;
const ShotInfo:React.FC<{f:number}>=({f})=>{
  const title=f<116?'01  /  WEIGHT TRANSFER'
    :f<196?'02  /  SUPPORTED CROUCH'
    :f<260?'03  /  INSERT: THE PICKUP'
    :'04  /  REACTION & PROP CONTINUITY';
  return <g>
    <rect x="72" y="60" width="845" height="113" rx="16"
      fill="#141825" opacity=".82"/>
    <path d="M92 78V150" stroke={C.gold} strokeWidth="6"/>
    <text x="123" y="113" fill={C.cream} fontFamily="Arial,sans-serif"
      fontWeight="800" fontSize="36">{title}</text>
    <text x="124" y="148" fill={C.steel} fontFamily="Arial,sans-serif"
      fontSize="23" letterSpacing="1.3">
      ORIGINAL SVG / 2.5D / SHARED WORLD CAMERA
    </text>
  </g>;
};
const Scene:React.FC<{f:number}>=({f})=>{
  const wide=f<116, crouch=f>=116&&f<196, insert=f>=196&&f<260;
  const a=anatomy(f), held=f>=260;
  const shine=held?ease(f,278,306):0;
  const cam=wide
    ?camT(960,550,1.02)
    :crouch
      ?camT(828+10*ease(f,128,180),622+18*ease(f,128,180),1.37)
      :insert
        ?camT(901,786,2.22)
        :camT(811,522,1.65+.065*ease(f,284,334));
  const coin=held?a.worldHand:
    insert?(f<231?COIN:macroHand(f)):releasedCoin(f);
  return <svg xmlns="http://www.w3.org/2000/svg" width="100%"
    height="100%" viewBox="0 0 1920 1080">
    <Defs/>
    <defs>
      <radialGradient id="actingV4CoinGlow">
        <stop offset="0" stopColor="#FFF6BE" stopOpacity=".83"/>
        <stop offset=".3" stopColor="#E6B55B" stopOpacity=".38"/>
        <stop offset="1" stopColor="#E6B55B" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <g transform={cam}>
      <Background charged={shine>.12}/>
      {!insert?<CharacterRigV2 pose={a.pose}
        variant="coral" feet={a.feet} hands={a.hands}
        handStyles={{L:crouch?'grip':'open',R:crouch||held?'grip':'open'}}
        shadow={.65}
        shadowAt={{x:(a.targets.L.x+a.targets.R.x)/2,y:GROUND+8}}/>:null}
      {insert?<CloseHand f={f}/>:null}
      <FloorCoin at={coin}
        power={shine*(.6+.1*Math.sin(.15*f))}
        rotation={f<61?f*9:0}/>
    </g>
    <ShotInfo f={f}/>
    {held?<g opacity={ease(f,278,307)}>
      <rect x="1380" y="157" width="455" height="119" rx="15"
        fill="#141825" opacity=".82"/>
      <path d="M1405 182V249" stroke={C.gold} strokeWidth="5"/>
      <text x="1427" y="206" fill={C.cream} fontFamily="Arial,sans-serif"
        fontSize="32" fontWeight="800">IT'S GLOWING.</text>
      <text x="1427" y="248" fill={C.steel} fontFamily="Arial,sans-serif"
        fontSize="24">HE DIDN'T EXPECT THAT.</text>
    </g>:null}
  </svg>;
};
export const CharacterActingV4:React.FC=()=> <Scene f={useCurrentFrame()}/>;
