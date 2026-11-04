import React from 'react';
import {SlenderPose,limb} from './slender-mechanics';

// Normalized standing height: 360. Head: 68 (18.9%); floor-to-hip: 142 (39.4%).
// Reference: supplied Reaction Time clip, 00:40 full-body profile.
// These are our reconstruction values, not source production specifications.
export const SlenderCharacter:React.FC<{
  x:number;y:number;scale?:number;facing?:'left'|'right'|'front';
  role?:'coral'|'cap';gesture?:'rest'|'point';pose?:SlenderPose;build?:'slim'|'balanced'|'fuller';
}>=({x,y,scale=1,facing='right',role='coral',gesture='rest',pose,build='slim'})=>{
  const coral=role==='coral',front=facing==='front',point=gesture==='point';
  const bodyWidth=build==='balanced'?1.35:build==='fuller'?1.6:1;
  const sleeveWidth=build==='balanced'?1.45:build==='fuller'?1.65:1;
  const legWidth=build==='balanced'?1.5:build==='fuller'?1.8:1;
  const handSize=build==='balanced'?1.25:build==='fuller'?1.45:1;
  const ink='#100D14',cloth=coral?'#DD5142':'#15131B',rim='#D8B079';
  const feet=pose?.feet??[{x:-12,y:-4},{x:13,y:-4}];
  const hand=pose?{x:pose.hand.x,y:pose.hand.y-pose.drop}:{x:point?90:20,y:point?-238:-147};
  const arm=pose?limb({x:10,y:-269},hand,60,-1).path:point?'M10 -269L38 -229L88 -238':'M10 -269L17 -211L20 -150';
  const sleeve=(d:string,near:boolean)=><g>
    <path d={d} fill="none" stroke={ink} strokeWidth={(near?11:9)*sleeveWidth}
      strokeLinecap="round" strokeLinejoin="round"/>
    <path d={d} fill="none" stroke={cloth} strokeWidth={(near?8:6.5)*sleeveWidth}
      strokeLinecap="round" strokeLinejoin="round"/>
  </g>;
  return <g transform={`translate(${x} ${y}) scale(${scale}) scale(${facing==='left'?-1:1} 1)`}>
    <ellipse cx="1" cy="3" rx="23" ry="3.5" fill="#080910" opacity=".27"/>
    {pose?feet.map((foot,i)=><g key={i}>
      <path d={limb({x:i?7:-6,y:-143+pose.drop},foot,70).path} stroke={ink} strokeWidth={7*legWidth} fill="none" strokeLinecap="round"/>
      <path d={`M${foot.x} ${foot.y}h12`} stroke={ink} strokeWidth="5" strokeLinecap="round"/>
      <path d={`M${foot.x+1} ${foot.y-1}h10`} stroke={rim} strokeWidth="1" opacity=".6"/>
    </g>):<g>
      <path d="M-6 -143L-9 -75L-12 -4M7 -143L10 -75L13 -4" stroke={ink} strokeWidth={7*legWidth} fill="none" strokeLinecap="round"/>
      <path d="M-12 -3H-1M13 -3H25" stroke={ink} strokeWidth="5" strokeLinecap="round"/>
      <path d="M-13 -4H-2M14 -4H24" stroke={rim} strokeWidth="1" opacity=".6"/>
    </g>}
    <g transform={`translate(0 ${pose?.drop??0})`}>
    {sleeve('M-9 -269L-18 -216L-16 -153',false)}
    <ellipse cx="-16" cy="-150" rx={3.5*handSize} ry={5*handSize} fill={ink}/>
    <g transform={`scale(${bodyWidth} 1)`}>
    {coral?<path d="M-10 -293Q-26 -285 -21 -258L-16 -249L-8 -275Z"
      fill="#B73F38" stroke={ink} strokeWidth="1.2"/>:null}
    <path d={front?'M-17 -275Q0 -281 17 -275L14 -143Q0 -139 -14 -143Z':
      'M-10 -275Q0 -279 11 -273L14 -143L-11 -143Z'}
      fill={cloth} stroke={ink} strokeWidth="1.4" strokeLinejoin="round"/>
    {coral?<g fill="none" strokeLinecap="round">
      <path d="M-8 -150H12" stroke="#F37D64" strokeWidth="1.4"/>
      <path d="M-3 -267V-249M5 -267V-250" stroke="#F0D6B6" strokeWidth="1.3"/>
      <path d="M-8 -175L-5 -188H8" stroke="#AC3C35" strokeWidth="1.3"/>
    </g>:null}
    </g>
    {/* Neck is exposed below the circular jaw and above the narrow collar. */}
    <path d="M-3 -299V-273Q1 -270 5 -274V-300" fill={ink}/>
    <path d="M-3 -292V-280" stroke={rim} strokeWidth="1" opacity=".65"/>
    <path d="M-7 -274Q0 -269 8 -273" fill="none" stroke={coral?'#E99178':'#4C414B'} strokeWidth="1.4"/>
    <g transform={`translate(2 -326) rotate(${pose?.headTilt??0})`}>
      <circle r="34" fill={ink}/>
      <path d="M-33 -5Q-28 -33 0 -34Q18 -34 29 -17" fill="none"
        stroke={rim} strokeWidth="1.8" strokeLinecap="round"/>
      {pose?.surprised?<ellipse cx="17" cy="-5" rx="3" ry="5" fill="#FFF2DE"/>:front?<g fill="#FFF2DE"><ellipse cx="-9" cy="-4" rx="2.4" ry="3.2"/>
        <ellipse cx="9" cy="-4" rx="2.4" ry="3.2"/></g>:
        <path d="M11 -5q4 -5 8 0" fill="none" stroke="#FFF2DE" strokeWidth="2.2" strokeLinecap="round"/>}
      {pose?.surprised?<ellipse cx="20" cy="10" rx="2.5" ry="4" fill="#FFF2DE"/>:<path d={front?'M-7 9Q0 15 7 9':'M13 9q7 5 12 -2'}
        fill="none" stroke="#FFF2DE" strokeWidth="2.2" strokeLinecap="round"/>}
      {!coral?<g>
        <path d="M-31 -13Q-30 -43 1 -43Q28 -42 31 -14Z" fill="#DABB4C" stroke={ink} strokeWidth="1.3"/>
        <path d="M-31 -13Q5 -17 36 -11L41 -8Q12 -7 -31 -10Z" fill="#E9CC64"/>
      </g>:null}
    </g>
    {sleeve(arm,true)}
    <ellipse cx={hand.x} cy={hand.y} rx={3.5*handSize} ry={5*handSize} fill={ink}/>
    {point&&!pose?<path d="M91 -239L99 -241" stroke={ink} strokeWidth="3" strokeLinecap="round"/>:null}
    </g>
  </g>;
};
