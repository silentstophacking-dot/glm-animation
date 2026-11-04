import React from 'react';
import {pufferSleeveSeams} from './puffer-sleeve-seams';
import {CharacterOutfit,OutfitGarment,outfitPalette,isPufferOutfit} from './character-outfits';
import {kf,clamp} from '../../engine/anim';
import {CharacterV2Pose,v2HandLocal} from './character-v2-motion';
import type {CharacterMood} from './cinematic-character-v2';
import {limb} from './slender-mechanics';

// V4 garment/proportion construction, with an independent view-aware rest rig.
// Default is the original controlled turn; optional pose drives the combined performance.
export const TURN_FRAMES=180;
export function turnV5At(f:number){
 const body=kf(f,[[0,0],[18,0],[59,.5],[76,.5],[122,1],[179,1]]);
 const head=kf(f,[[0,0],[12,0],[53,.5],[72,.5],[116,1],[179,1]]);
 return {body,head};
}
export function turnV5Geometry(yaw:number){
 const a=clamp(yaw)*Math.PI/2,c=Math.cos(a),s=Math.sin(a);
 return {c,s,width:Math.hypot(24*c,15*s),nearShoulder:26*c+8*s,farShoulder:-26*c-8*s,
  nearWrist:34*c+12*s,farWrist:-34*c-12*s,hips:[-8*c-4*s,8*c+4*s],heels:[-16,16]};
}
export function auditTurnV5(lighting:'baseline'|'sunset'='baseline'){
 let maxHeelDrift=0;
 for(let f=0;f<TURN_FRAMES;f++){
  const {body}=turnV5At(f),g=turnV5Geometry(body);
  g.hips.forEach((x,i)=>limb({x,y:-147.4},{x:g.heels[i],y:-4},72));
  maxHeelDrift=Math.max(maxHeelDrift,...g.heels.map((x,i)=>Math.abs(x-[-16,16][i])));
  limb({x:g.nearShoulder,y:-270},{x:g.nearWrist,y:-151},61);
  limb({x:g.farShoulder,y:-270},{x:g.farWrist,y:-151},61);
  CharacterTurnV5({id:'turn-audit',x:0,y:0,yaw:body,headYaw:turnV5At(f).head,lighting});
  if(!Number.isFinite(g.width)||g.width<15||g.width>24.001)throw new Error('Invalid torso width '+f);
 }
 return {lighting,frames:TURN_FRAMES,maxHeelDrift,headDiameter:72,floorY:0,footAction:'heels planted; toes pivot on floor'};
}
export const CharacterTurnV5:React.FC<{id:string;x:number;y:number;scale?:number;yaw:number;headYaw?:number;solid?:boolean;lighting?:'baseline'|'sunset';pose?:CharacterV2Pose;mood?:CharacterMood;shadow?:boolean;outfit?:CharacterOutfit}>=({id,x,y,scale=1,yaw,headYaw=yaw,solid=false,lighting='baseline',pose,mood='calm',shadow=true,outfit='hoodie'})=>{
 const lit=lighting==='sunset',palette=outfitPalette(outfit,lighting==='sunset'),puffer=isPufferOutfit(outfit);
 const g=turnV5Geometry(yaw),{c,s,width:w}=g,ink='#120F17',rim='#E2B680',cream='#F5E8D0';
 const ha=clamp(headYaw,-1,1)*Math.PI/2,hc=Math.cos(ha),hs=Math.sin(ha),seam=w*.8*s;
 const drop=pose?.drop??0;
 const feet=pose?.feet??g.heels.map(x=>({x,y:0}));
 const surprise=mood==='surprised'||pose?.surprised;
 const u=(n:string)=>`url(#${id+n})`;
 const arm=(side:number)=>{
  const sh=side>0?g.nearShoulder:g.farShoulder,wr=side>0?g.nearWrist:g.farWrist;
  const elbow=side*(31*c+10*s);
  let path=`M${sh} -270Q${elbow} -242 ${elbow} -211Q${wr} -178 ${wr} -151`;
  let tip={x:wr,y:-151},angle=90;
  let stitchChain:{elbow:{x:number;y:number};wrist:{x:number;y:number}}|undefined;
  if(pose){
   tip=side>0?v2HandLocal(pose):(pose.farHand??{x:wr,y:-151});
   const dx=tip.x-sh,dy=tip.y+270,d=Math.hypot(dx,dy);
   const wrist=side>0?{x:tip.x-dx/d*11,y:tip.y-dy/d*11}:tip;
   const ik=limb({x:sh,y:-270},wrist,side>0?61:60,-1);
   path=ik.path;
   stitchChain={elbow:ik.knee,wrist};
   angle=(side>0?Math.atan2(dy,dx):Math.atan2(tip.y-ik.knee.y,tip.x-ik.knee.x))*180/Math.PI;
  }
  return <g>
   <path d={path} fill="none" stroke={ink} strokeWidth={puffer?23:20} strokeLinecap="round" strokeLinejoin="round"/>
   <path d={path} fill="none" stroke={u(side>0?'cloth':'far')} strokeWidth={puffer?19.5:16.5} strokeLinecap="round" strokeLinejoin="round"/>
   {puffer&&!pose?[-250,-226,-202,-178].map(y=>{
    const x=sh+(wr-sh)*(y+270)/119;
    return <g key={y}><path d={`M${x-9} ${y}q9 4 18 0`} fill="none" stroke="#101D2B" strokeWidth="1.2" opacity=".7"/><path d={`M${x-8} ${y-2}q8 3 16 0`} fill="none" stroke="#C2D6D8" strokeWidth=".8" opacity=".18"/></g>;
   }):null}
   {puffer&&stitchChain?pufferSleeveSeams({x:sh,y:-270},stitchChain.elbow,stitchChain.wrist).map((seam,i)=><g key={i}>
    <path d={seam.path} fill="none" stroke="#101D2B" strokeWidth="1.2" opacity=".7"/>
    <path d={seam.highlight} fill="none" stroke="#C2D6D8" strokeWidth=".8" opacity=".18"/>
   </g>):null}
   {pose&&side>0?<g transform={`translate(${tip.x} ${tip.y}) rotate(${angle})`}>
    <path d="M-14 -4L-8 -4Q-5 -6 -2 -3L0 -1Q1 2 -3 4L-7 5Q-8 9 -11 7L-12 4H-14Z" fill={ink}/>
    <path d="M-14 -5V5" stroke={palette.cuff} strokeWidth="1.6"/>
    {outfit==='cobalt-lead'?<path d="M-12 -4V4" stroke="#D5AD57" strokeWidth="1.4"/>:null}
    <path d="M-12 -4L-7 -4" stroke={rim} strokeWidth=".8" opacity=".6"/>
   </g>:<g transform={`translate(${tip.x} ${tip.y}) rotate(${pose?angle-90:0}) scale(${pose?(puffer?-1:1):side} 1)`}>
    <path d="M-8 -3H8V2H-8Z" fill={palette.cuff} stroke={ink} strokeWidth="1.2"/>
    {outfit==='cobalt-lead'?<path d="M-7 -1H7" stroke="#D5AD57" strokeWidth="1.4"/>:null}
    <path d="M-5 2H5L6 11Q5 16 1 16Q-3 16 -4 12L-7 10Q-9 6 -5 5Z" fill={ink}/>
    <path d="M-5 6L-4 11" stroke={rim} strokeWidth=".8" opacity=".55"/>
   </g>}
  </g>;
 };
 const shoe=(at:{x:number;y:number},i:number)=>{
  // Turn: planted heel pivot. Performance: the supplied world-space sole target drives each shoe.
  const toe=17*s,half=8*c+5*s;
  return <g transform={`translate(${at.x} ${at.y}) rotate(${pose?.shoeAngles?.[i]??0})`}>
   <path d={`M-6 -8Q0 -11 6 -8L${toe+half} -5Q${toe+half+2} -1 ${toe+half} 0H${-half}Q${-half-2} -3 -6 -8Z`} fill={palette.shoe} stroke="#0E111C" strokeWidth="1.5"/>
   <path d={`M${-half} -1H${toe+half}`} stroke={palette.sole} strokeWidth="1.1" opacity=".7"/>
  </g>;
 };
 return <g transform={`translate(${x} ${y}) scale(${scale})`} filter={solid?u('solid'):undefined}>
  <defs>
   <linearGradient id={id+'cloth'} x2="1" y2=".3"><stop stopColor={palette.cloth[0]}/><stop offset=".3" stopColor={palette.cloth[1]}/><stop offset="1" stopColor={palette.cloth[2]}/></linearGradient>
   <linearGradient id={id+'far'} x2="1"><stop stopColor={palette.far[0]}/><stop offset="1" stopColor={palette.far[1]}/></linearGradient>
   <linearGradient id={id+'pants'} x2="1"><stop stopColor={palette.pants[0]}/><stop offset="1" stopColor={palette.pants[1]}/></linearGradient>
   <radialGradient id={id+'headLight'} cx=".2" cy=".18" r=".9"><stop stopColor="#20202C"/><stop offset=".55" stopColor="#12121E"/><stop offset="1" stopColor="#090E18"/></radialGradient>
   <filter id={id+'sunRim'} x="-15%" y="-5%" width="130%" height="110%" colorInterpolationFilters="sRGB">
    <feOffset in="SourceAlpha" dx="1.25" dy="1" result="inset"/>
    <feComposite in="SourceAlpha" in2="inset" operator="out" result="litEdge"/>
    <feFlood floodColor="#FFD095" floodOpacity=".92" result="warm"/>
    <feComposite in="warm" in2="litEdge" operator="in" result="rim"/>
    <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="rim"/></feMerge>
   </filter>
   <clipPath id={id+'face'}><ellipse rx="35.5" ry="35.5"/></clipPath>
   <filter id={id+'solid'}><feColorMatrix type="matrix" values="0 0 0 0 .08 0 0 0 0 .08 0 0 0 0 .1 0 0 0 1 0"/></filter>
  </defs>
  {shadow?<ellipse cx="0" cy="2" rx="42" ry="4" fill="#090C15" opacity=".3"/>:null}
  <g filter={lit?u('sunRim'):undefined}>
  {g.hips.map((hip,i)=><g key={i}>
   <path d={limb({x:hip,y:-147.4+drop},{x:feet[i].x,y:feet[i].y-4},72,pose?1:i?1:-1).path} fill="none" stroke="#10131E" strokeWidth="15.5" strokeLinecap="round"/>
   <path d={limb({x:hip,y:-147.4+drop},{x:feet[i].x,y:feet[i].y-4},72,pose?1:i?1:-1).path} fill="none" stroke={u('pants')} strokeWidth="13" strokeLinecap="round"/>
   {shoe(feet[i],i)}
  </g>)}
  <g transform={`translate(0 ${drop}) rotate(${pose?.lean??0} 0 -146)`}>
  {arm(-1)}
  {outfit!=='hoodie'?<path d={`M${-w*.78} -192Q0 -196 ${w*.78} -192L${g.hips[1]+7} -144Q0 -140 ${g.hips[0]-7} -144Z`} fill={u('pants')}/>:null}
  {outfit==='hoodie'?<>
  <path d={`M${-w*.65} -290Q${-w-8} -285 ${-w-4} -270L${-w*.6} -254L${w*.5} -273L${w*.55} -287Z`} fill="#B7463C" stroke={ink} strokeWidth="1.4"/>
  <path d={`M${-w} -272Q${-w*.8} -278 ${-w*.42} -280L0 -277L${w*.46} -280Q${w*.83} -277 ${w} -270L${w*.93} -237L${w*.83} -207L${w*.87} -155Q0 -149 ${-w*.87} -155L${-w*.83} -207Z`} fill={u('cloth')} stroke={ink} strokeWidth="1.5"/>
  <path d={`M${seam} -276Q${seam+3} -243 ${seam} -207L${seam} -155Q${w*.65} -151 ${w*.87} -155L${w*.83} -207L${w} -270Z`} fill="#8D3537" opacity={.35*s}/>
  <path d={`M${seam} -266V-170`} stroke="#A63C34" strokeWidth="1" opacity=".6"/>
  <path d={`M${-w*.83} -164Q0 -160 ${w*.83} -164L${w*.87} -155Q0 -149 ${-w*.87} -155Z`} fill="#C44C3D" stroke="#9B3834" strokeWidth=".8"/>
  <path d={`M${seam-10*c} -184L${seam-6*c} -198H${seam+10*c}L${seam+14*c} -183`} fill="none" stroke="#A03932" strokeWidth="1.5"/>
  </>:<OutfitGarment id={id+'outfit'} outfit={outfit} w={w} c={c} s={s} seam={seam} cloth={u('cloth')}/>}
  <path d="M-6 -297H6L7 -274Q1 -269 -6 -275Z" fill={ink}/>
  <path d="M-4 -288V-277" stroke={rim} strokeWidth="1" opacity=".75"/>
  {outfit==='hoodie'?<path d={`M${seam-9*c} -268l${-c} 22M${seam+6*c} -267l${c} 20`} stroke="#EFD9BC" strokeWidth="1.4" strokeLinecap="round"/>:null}
  <g transform={`translate(2 -326) rotate(${pose?.headTilt??0})`}>
   <ellipse rx="36" ry="36" fill={lit?u('headLight'):ink}/>
   <path d="M-35 0Q-35 -27 -10 -35Q12 -41 29 -21" fill="none" stroke={rim} strokeWidth={lit?1.05:1.8} strokeLinecap="round"/>
   <g clipPath={u('face')}>
    <g transform={pose?.gazeY?`translate(0 ${pose.gazeY})`:undefined}>
    {[-.32,.32].map((offset,i)=>{
     const a=ha+offset;
     // The far eye disappears behind the head surface; visible eyes never fade.
     const e=35.4*Math.sin(a)+(pose?.gaze??0)*.7,ex=Math.max(.25,Math.cos(a));
     return Math.cos(a)>0?<g key={i}>
      {(pose?.blink??0)>.5?<path d={`M${e-3*ex} -4h${6*ex}`} stroke={cream} strokeWidth="1.8" strokeLinecap="round"/>:mood==='relieved'?<path d={`M${e-3*ex} -4q${3*ex} -4 ${6*ex} 0`} fill="none" stroke={cream} strokeWidth="1.8"/>:mood==='focused'?<path d={`M${e-4*ex} -5h${8*ex}q${-ex} 6 ${-5*ex} 4Z`} fill={cream}/>:<ellipse cx={e} cy="-5" rx={(surprise?3.8:2.8)*ex} ry={surprise?6:mood==='curious'?4.6:3.6} fill={cream}/>}
      {mood==='curious'||mood==='concerned'?<path d={`M${e-4*ex} -14q${4*ex} ${mood==='curious'?-4:3} ${8*ex} -1`} fill="none" stroke={cream} strokeWidth="1.5"/>:null}
     </g>:null;
    })}
    </g>
    {mood==='focused'?<path d={`M${24*hs-5} 10h10`} stroke={cream} strokeWidth="1.8" strokeLinecap="round"/>:surprise?<ellipse cx={24*hs} cy="10" rx="3.7" ry="5.5" fill={cream}/>:mood==='concerned'?<path d={`M${24*hs-7} 12q7 -7 14 0`} fill="none" stroke={cream} strokeWidth="2"/>:<path d={`M${24*hs-9*Math.max(.5,hc)} 9Q${24*hs} ${13+4*hc} ${24*hs+9*Math.max(.5,hc)} 8`} fill="none" stroke={cream} strokeWidth="2" strokeLinecap="round"/>}
   </g>
  </g>
  {arm(1)}
  </g>
  </g>
 </g>;
};
