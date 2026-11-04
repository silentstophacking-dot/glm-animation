import React from 'react';
import {kf,clamp} from '../../engine/anim';
import {limb} from './slender-mechanics';

// V4 garment/proportion construction, with an independent view-aware rest rig.
// A controlled turn only: this does not replace the contact/acting rig.
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
export const CharacterTurnV5:React.FC<{id:string;x:number;y:number;scale?:number;yaw:number;headYaw?:number;solid?:boolean;lighting?:'baseline'|'sunset'}>=({id,x,y,scale=1,yaw,headYaw=yaw,solid=false,lighting='baseline'})=>{
 const lit=lighting==='sunset';
 const g=turnV5Geometry(yaw),{c,s,width:w}=g,ink='#120F17',rim='#E2B680',cream='#F5E8D0';
 const ha=clamp(headYaw)*Math.PI/2,hc=Math.cos(ha),hs=Math.sin(ha),seam=w*.8*s;
 const u=(n:string)=>`url(#${id+n})`;
 const arm=(side:number)=>{
  const sh=side>0?g.nearShoulder:g.farShoulder,wr=side>0?g.nearWrist:g.farWrist;
  // The elbow bows outward in the front plane, rather than keeping a profile bend.
  const elbow=side*(31*c+10*s);
  return <g>
   <path d={`M${sh} -270Q${elbow} -242 ${elbow} -211Q${wr} -178 ${wr} -151`} fill="none" stroke={ink} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
   <path d={`M${sh} -270Q${elbow} -242 ${elbow} -211Q${wr} -178 ${wr} -151`} fill="none" stroke={u(side>0?'cloth':'far')} strokeWidth="16.5" strokeLinecap="round"/>
   <g transform={`translate(${wr} -151) scale(${side} 1)`}>
    <path d="M-8 -3H8V2H-8Z" fill="#B94A3E" stroke={ink} strokeWidth="1.2"/>
    <path d="M-5 2H5L6 11Q5 16 1 16Q-3 16 -4 12L-7 10Q-9 6 -5 5Z" fill={ink}/>
    <path d="M-5 6L-4 11" stroke={rim} strokeWidth=".8" opacity=".55"/>
   </g>
  </g>;
 };
 const shoe=(heel:number)=>{
  // Heel anchor is stationary; the floor-projected toe swings around it.
  const toe=17*s,half=8*c+5*s;
  return <g transform={`translate(${heel} 0)`}>
   <path d={`M-6 -8Q0 -11 6 -8L${toe+half} -5Q${toe+half+2} -1 ${toe+half} 0H${-half}Q${-half-2} -3 -6 -8Z`} fill="#1D1B26" stroke="#0E111C" strokeWidth="1.5"/>
   <path d={`M${-half} -1H${toe+half}`} stroke={rim} strokeWidth="1.1" opacity=".7"/>
  </g>;
 };
 return <g transform={`translate(${x} ${y}) scale(${scale})`} filter={solid?u('solid'):undefined}>
  <defs>
   <linearGradient id={id+'cloth'} x2="1" y2=".3"><stop stopColor={lit?"#F28A60":"#E36A50"}/><stop offset=".3" stopColor={lit?"#DC6049":"#D85845"}/><stop offset="1" stopColor={lit?"#803D49":"#AA3E38"}/></linearGradient>
   <linearGradient id={id+'far'} x2="1"><stop stopColor={lit?"#CD7055":"#D65B47"}/><stop offset="1" stopColor={lit?"#703D4B":"#A7413B"}/></linearGradient>
   <linearGradient id={id+'pants'} x2="1"><stop stopColor={lit?"#38303A":"#302632"}/><stop offset="1" stopColor={lit?"#131D2C":"#101521"}/></linearGradient>
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
  <ellipse cx="0" cy="2" rx="42" ry="4" fill="#090C15" opacity=".3"/>
  <g filter={lit?u('sunRim'):undefined}>
  {g.hips.map((hip,i)=><g key={i}>
   <path d={limb({x:hip,y:-147.4},{x:g.heels[i],y:-4},72,i?1:-1).path} fill="none" stroke="#10131E" strokeWidth="15.5" strokeLinecap="round"/>
   <path d={limb({x:hip,y:-147.4},{x:g.heels[i],y:-4},72,i?1:-1).path} fill="none" stroke={u('pants')} strokeWidth="13" strokeLinecap="round"/>
   {shoe(g.heels[i])}
  </g>)}
  {arm(-1)}
  <path d={`M${-w*.65} -290Q${-w-8} -285 ${-w-4} -270L${-w*.6} -254L${w*.5} -273L${w*.55} -287Z`} fill="#B7463C" stroke={ink} strokeWidth="1.4"/>
  <path d={`M${-w} -272Q${-w*.8} -278 ${-w*.42} -280L0 -277L${w*.46} -280Q${w*.83} -277 ${w} -270L${w*.93} -237L${w*.83} -207L${w*.87} -155Q0 -149 ${-w*.87} -155L${-w*.83} -207Z`} fill={u('cloth')} stroke={ink} strokeWidth="1.5"/>
  <path d={`M${seam} -276Q${seam+3} -243 ${seam} -207L${seam} -155Q${w*.65} -151 ${w*.87} -155L${w*.83} -207L${w} -270Z`} fill="#8D3537" opacity={.35*s}/>
  <path d={`M${seam} -266V-170`} stroke="#A63C34" strokeWidth="1" opacity=".6"/>
  <path d={`M${-w*.83} -164Q0 -160 ${w*.83} -164L${w*.87} -155Q0 -149 ${-w*.87} -155Z`} fill="#C44C3D" stroke="#9B3834" strokeWidth=".8"/>
  <path d={`M${seam-10*c} -184L${seam-6*c} -198H${seam+10*c}L${seam+14*c} -183`} fill="none" stroke="#A03932" strokeWidth="1.5"/>
  <path d="M-6 -297H6L7 -274Q1 -269 -6 -275Z" fill={ink}/>
  <path d="M-4 -288V-277" stroke={rim} strokeWidth="1" opacity=".75"/>
  <path d={`M${seam-9*c} -268l${-c} 22M${seam+6*c} -267l${c} 20`} stroke="#EFD9BC" strokeWidth="1.4" strokeLinecap="round"/>
  <g transform="translate(2 -326)">
   <ellipse rx="36" ry="36" fill={lit?u('headLight'):ink}/>
   <path d="M-35 0Q-35 -27 -10 -35Q12 -41 29 -21" fill="none" stroke={rim} strokeWidth={lit?1.05:1.8} strokeLinecap="round"/>
   <g clipPath={u('face')}>
    {[-.32,.32].map((offset,i)=>{
     const a=ha+offset;
     // The far eye disappears behind the head surface; visible eyes never fade.
     return Math.cos(a)>0?<ellipse key={i} cx={35.4*Math.sin(a)} cy="-5" rx={2.8*Math.max(.25,Math.cos(a))} ry="3.6" fill={cream}/>:null;
    })}
    <path d={`M${24*hs-9*Math.max(.5,hc)} 9Q${24*hs} ${13+4*hc} ${24*hs+9*Math.max(.5,hc)} 8`} fill="none" stroke={cream} strokeWidth="2" strokeLinecap="round"/>
   </g>
  </g>
  {arm(1)}
  </g>
 </g>;
};
