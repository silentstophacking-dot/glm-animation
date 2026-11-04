import React from 'react';
import {CharacterV2Pose,v2HandLocal} from './character-v2-motion';
import {limb,XY} from './slender-mechanics';
export type CharacterMood='calm'|'curious'|'confident'|'surprised'|'concerned'|'focused'|'relieved';
export type CharacterAction='stand'|'explain'|'reach'|'stride';
export const CinematicCharacterV2:React.FC<{
 id:string;x:number;y:number;scale?:number;facing?:'right'|'front'|'left';
 mood?:CharacterMood;action?:CharacterAction;pose?:CharacterV2Pose;bodyYaw?:number;headYaw?:number;shadow?:boolean;design?:'v2'|'silhouette-v4';
}>=({id,x,y,scale=1,facing='right',mood='calm',action='stand',pose,bodyYaw,headYaw,shadow=true,design='v2'})=>{
 const revised=design==='silhouette-v4';
 const ink='#120F17',cream='#F5E8D0',rim='#E2B680';
 const view=bodyYaw===undefined?undefined:Math.max(0,Math.min(1,bodyYaw));
 const bodyWidth=view===undefined?1:1-(revised?.16:.25)*view;
 const yaw=headYaw??view??pose?.yaw??(facing==='front'?0:.85);
 const mouthCenter=18*yaw;
 const front=facing==='front',surprise=mood==='surprised'||pose?.surprised;
 // A frontal resting pose needs frontal limb geometry and shared draw order.
 const frontRest=revised&&front&&!pose&&action==='stand';
 const drop=pose?.drop??0;
 const feet:XY[]=pose?.feet??(action==='stride'?[{x:-29,y:-4},{x:36,y:-4}]:(revised?[{x:-14,y:-4},{x:18,y:-4}]:[{x:-13,y:-4},{x:14,y:-4}]));
 const handTip:XY=pose?v2HandLocal(pose):
  action==='explain'?{x:91,y:-237}:action==='reach'?{x:101,y:-232}:{x:revised?36:26,y:-140};
 const shoulder={x:(revised?23:17)-(view??0)*4.2,y:-271};
 const dx=handTip.x-shoulder.x,dy=handTip.y-shoulder.y,d=Math.hypot(dx,dy);
 const ux=dx/d,uy=dy/d;
 const wrist={x:handTip.x-ux*11,y:handTip.y-uy*11};
 const arm=limb(shoulder,wrist,61,-1);
 const u=(s:string)=>`url(#${id+s})`;
 const farWrist=pose?.farHand??{x:(revised?-33:-23)+12*(view??0)+(pose?.farSwing??0),y:revised?-150:-153};
 const farIK=pose||view!==undefined?limb({x:(revised?-21:-15)+6*(view??0),y:-269},farWrist,60,-1):undefined;
 const farHandAngle=farIK?Math.atan2(farWrist.y-farIK.knee.y,farWrist.x-farIK.knee.x)*180/Math.PI-90:0;
 const farArm=farIK?farIK.path:revised?'M-21 -269Q-32 -252 -32 -218L-33 -153':'M-15 -269Q-26 -255 -27 -218L-23 -153';
 const legPath=(i:number)=>pose?limb({x:i?8:-8,y:-146+drop},feet[i],72).path:
  action==='stride'?limb({x:i?8:-8,y:-146+12},feet[i],72).path:
  revised?(i?'M8 -146Q13 -112 15 -77L18 -4':'M-8 -146Q-11 -112 -13 -77L-14 -4'):i?'M8 -146Q14 -110 13 -80L14 -4':'M-8 -146Q-12 -105 -12 -77L-13 -4';
 const shoe=(at:XY,near:boolean)=><g transform={`translate(${at.x} ${at.y}) rotate(${pose?.shoeAngles?.[near?1:0]??0})`}>
  <path d="M-5 -7Q0 -10 5 -7L8 -4L18 -3Q23 -2 22 2Q17 5 -6 3Q-9 0 -5 -7Z"
   fill={near?'#1D1B26':'#14151F'} stroke="#0E111C" strokeWidth="1.5"/>
  <path d="M-6 2Q9 4 21 1" stroke={rim} strokeWidth="1.3" opacity={near?.8:.5} fill="none"/>
  <path d="M4 -5L10 -3M1 -4L7 -2" stroke="#6F6465" strokeWidth="1" opacity=".65"/>
 </g>;
 const sleeve=(path:string,near:boolean)=><g>
  <path d={path} fill="none" stroke={ink} strokeWidth={near?(revised?20:16):(revised?18:14)} strokeLinecap="round" strokeLinejoin="round"/>
  <path d={path} fill="none" stroke={u(near?'cloth':'farCloth')} strokeWidth={near?(revised?16.5:12.5):(revised?14.8:10.8)} strokeLinecap="round" strokeLinejoin="round"/>
  <path d={path} fill="none" stroke="#ED8D68" strokeWidth="1.2" strokeLinecap="round" opacity={near?.25:.12}/>
 </g>;
 return <g transform={`translate(${x} ${y}) scale(${scale}) scale(${facing==='left'?-1:1} 1)`}>
  <defs>
   <linearGradient id={id+'cloth'} x1="0" y1="0" x2="1" y2=".3"><stop stopColor="#E36A50"/><stop offset=".3" stopColor="#D85845"/><stop offset="1" stopColor="#AA3E38"/></linearGradient>
   <linearGradient id={id+'farCloth'} x2="1" y2=".2"><stop stopColor="#BD4A3E"/><stop offset="1" stopColor="#9D3B38"/></linearGradient>
   <linearGradient id={id+'head'} x2=".8" y2="1"><stop stopColor="#1A141C"/><stop offset="1" stopColor="#0B0E17"/></linearGradient>
   <linearGradient id={id+'trousers'} x2="1" y2="0"><stop stopColor="#2B2430"/><stop offset=".4" stopColor="#191A25"/><stop offset="1" stopColor="#0E1420"/></linearGradient>
  </defs>
  {shadow?<ellipse cx="3" cy="4" rx="33" ry="4" fill="#090C15" opacity=".32"/>:null}
  <path d={legPath(0)} stroke="#10131E" strokeWidth={revised?15:11.5} strokeLinecap="round" fill="none"/>
  <path d={legPath(0)} stroke={u('trousers')} strokeWidth={revised?12.5:9} strokeLinecap="round" fill="none"/>
  {shoe(feet[0],false)}
  <path d={legPath(1)} stroke="#10131E" strokeWidth={revised?15.5:12} strokeLinecap="round" fill="none"/>
  <path d={legPath(1)} stroke={u('trousers')} strokeWidth={revised?13:9.7} strokeLinecap="round" fill="none"/>
  {shoe(feet[1],true)}
  <g transform={`translate(0 ${drop+(action==='stride'&&!pose?12:0)}) rotate(${pose?.lean??0} 0 -146)`}>
   {!frontRest&&sleeve(farArm,false)}
   {!frontRest&&(pose?.farHand?<g transform={`translate(${farWrist.x} ${farWrist.y}) rotate(${farHandAngle})`}>
    <path d="M-5 -3h10" stroke="#B95744" strokeWidth="2"/>
    <path d="M-3 0L3 0L4 3Q8 4 6 8L4 10Q0 13 -3 10L-5 5Z" fill={ink}/>
    <path d="M-3 3v5" stroke={rim} strokeWidth=".8" opacity=".65"/>
   </g>:<g>
   <path transform={`translate(${farWrist.x+23} ${farWrist.y+153})`} d="M-28 -159L-17 -159L-18 -151L-28 -151Z" fill="#AC423A" stroke={ink} strokeWidth="1"/>
   <g transform={`translate(${farWrist.x} ${farWrist.y+4}) rotate(0)`}>
    <path d="M-3 -4L3 -4L4 0Q8 1 6 5L4 7Q2 12 -3 9L-5 3Z" fill={ink}/>
    <path d="M-3 0v6" stroke={rim} strokeWidth=".8" opacity=".65"/>
   </g>
   </g>)}
   <g transform={`scale(${bodyWidth} 1)`}>
   {/* Hood wraps the nape rather than sticking out like a triangular backpack. */}
   <path d="M-10 -290Q-26 -287 -25 -273Q-24 -259 -16 -254L-6 -272L10 -278L7 -287Z"
    fill="#B7463C" stroke={ink} strokeWidth="1.4"/>
   <path d="M-20 -281Q-24 -271 -17 -263" fill="none" stroke="#EB8967" strokeWidth="1.4" opacity=".7"/>
   <path d={revised?'M-24 -272Q-19 -278 -10 -280L0 -277L11 -280Q20 -277 26 -270L23 -237L20 -207L21 -155Q3 -149 -21 -155L-20 -207L-24 -239Z':front||view!==undefined?'M-21 -275Q-9 -282 0 -279Q11 -282 22 -274L20 -228L18 -155Q0 -146 -19 -155L-19 -228Z':
    'M-16 -275Q-6 -280 8 -277Q16 -276 20 -270L18 -222L20 -155Q4 -147 -15 -154L-17 -218Z'}
    fill={u('cloth')} stroke={ink} strokeWidth="1.5" strokeLinejoin="round"/>
   <path d={revised?"M16 -275Q23 -255 19 -228L18 -159L21 -155L20 -207L23 -237L26 -270Z":"M9 -273Q16 -250 13 -223L15 -159L19 -155L18 -222L20 -270Z"} fill="#A83D36" opacity=".38"/>
   <path d={revised?"M-20 -165Q1 -161 20 -165L21 -155Q3 -149 -21 -155Z":"M-14 -164Q2 -159 18 -165L20 -155Q4 -147 -15 -154Z"} fill="#C44C3D" stroke="#9B3834" strokeWidth=".8"/>
   <path d={revised?"M-18 -156Q1 -152 18 -157":"M-12 -156Q1 -152 16 -157"} fill="none" stroke="#F1906B" strokeWidth="1.1" opacity=".5"/>
   <path d="M3 -265L4 -169" stroke="#A63C34" strokeWidth="1" opacity=".6"/>
   <path d="M-10 -184L-6 -198H10L14 -183" fill="none" stroke="#A03932" strokeWidth="1.5" strokeLinecap="round"/>
   <path d="M-8 -184L-5 -193M12 -185L9 -193" stroke="#F08E69" strokeWidth=".7" opacity=".5"/>
   {view!==undefined&&!frontRest?<g>
    <path d={`M${18-12*view} -277Q22 -274 22 -254L20 -155Q${12-9*view} -149 ${9-10*view} -153L${12-9*view} -225Z`}
      fill="#8D3537" opacity={.12+.46*view}/>
    <path d={`M${18-12*view} -273L${12-9*view} -225L${9-10*view} -157`} fill="none" stroke="#893036" strokeWidth="1.2" opacity=".65"/>
   </g>:null}
   </g>
   <path d={revised?"M-6 -297H6L7 -274Q1 -269 -6 -275Z":"M-5 -297L5 -297L6 -274Q1 -269 -5 -275Z"} fill={ink}/>
   <path d="M-4 -288V-277" stroke={rim} strokeWidth="1" opacity=".75"/>
   <path d="M-13 -276Q1 -267 14 -276" fill="none" stroke="#EFA482" strokeWidth="1.6"/>
   <path d="M-4 -268L-5 -246M7 -267L8 -248" stroke="#EFD9BC" strokeWidth="1.4" strokeLinecap="round"/>
   <circle cx="-5" cy="-246" r="1.2" fill="#EFD9BC"/>
   <g transform={`translate(2 -326) rotate(${pose?.headTilt??(mood==='curious'?-5:0)}) scale(${headYaw===undefined?(view===undefined?1:1-.08*view):1-.08*headYaw} 1)`}>
    <ellipse rx={36-2*yaw} ry="36" fill={ink}/>
    <path d={front?'M-35 0Q-35 -27 -10 -35Q12 -41 29 -21':'M-34 0Q-34 -27 -10 -35Q12 -40 29 -20'}
     fill="none" stroke={rim} strokeWidth="1.8" strokeLinecap="round"/>
    {[-11+17*yaw,11+10*yaw].map((e,i)=><g key={e} opacity={revised?1:i===0?1-(view===undefined?.4:.8)*yaw:1}>
     {(pose?.blink??0)>.5?<path d={`M${e-4} -4h8`} stroke={cream} strokeWidth="1.8" strokeLinecap="round"/>:mood==='relieved'?<path d={`M${e-4} -4q4 -5 8 0`} stroke={cream} strokeWidth="1.8" strokeLinecap="round" fill="none"/>:mood==='confident'||mood==='focused'?<path d={`M${e-4} -5h8q-1 6 -5 4Z`} fill={cream}/>:
      <ellipse cx={e+(pose?.gaze??0)*1.3} cy="-5" rx={surprise?3.8:2.8} ry={surprise?6:mood==='curious'?4.6:3.6} fill={cream}/>}
     {mood==='curious'||mood==='concerned'?<path d={`M${e-4} -14q4 ${mood==='curious'?-4:3} 8 -1`} fill="none" stroke={cream} strokeWidth="1.6" strokeLinecap="round"/>:null}
    </g>)}
    {mood==='focused'?<path d={`M${mouthCenter-5} 10h10`} stroke={cream} strokeWidth="1.8" strokeLinecap="round"/>:surprise?<ellipse cx={mouthCenter} cy="10" rx="3.7" ry="5.5" fill={cream}/>:
     <path d={mood==='concerned'?`M${mouthCenter-8} 12Q${mouthCenter} 4 ${mouthCenter+8} 12`:
      `M${mouthCenter-9} 8Q${mouthCenter} 17 ${mouthCenter+10} 7`} fill="none" stroke={cream} strokeWidth="2" strokeLinecap="round"/>}
   </g>
   {frontRest?[-1,1].map(side=><g key={side} transform={`scale(${side} 1)`}>
    {sleeve('M26 -270Q31 -244 31 -211Q32 -179 34 -151',true)}
    <path d="M26 -154H42V-149H26Z" fill="#B94A3E" stroke={ink} strokeWidth="1.2"/>
    <path d="M29 -149H39L40 -140Q39 -135 35 -135Q31 -135 30 -139L27 -141Q25 -145 29 -146Z" fill={ink}/>
    <path d="M29 -145L30 -140" stroke={rim} strokeWidth=".8" opacity=".55"/>
   </g>):<g>
   {sleeve(arm.path,true)}
   <g transform={`translate(${handTip.x} ${handTip.y}) rotate(${Math.atan2(uy,ux)*180/Math.PI})`}>
    <path d="M-14 -4L-8 -4Q-5 -6 -2 -3L0 -1Q1 2 -3 4L-7 5Q-8 9 -11 7L-12 4H-14Z" fill={ink}/>
    <path d="M-14 -5V5" stroke="#B94A3E" strokeWidth="1.6"/>
    <path d="M-12 -4L-7 -4" stroke={rim} strokeWidth=".8" opacity=".6"/>
   </g>
   </g>}
  </g>
 </g>;
};
