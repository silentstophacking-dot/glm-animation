import React from 'react';
import {useCurrentFrame} from 'remotion';
import {RefCharacter,Stage} from './ifverse-contact-rig';

const ease=(f:number,a:number,b:number)=>{
  const t=Math.max(0,Math.min(1,(f-a)/(b-a)));return t*t*(3-2*t);
};
export const contactPose=(f:number)=>({
  reach:ease(f,36,72)*(1-ease(f,132,158)),
  response:ease(f,91,105)*(1-ease(f,174,192)),
  anticipate:ease(f,24,31)*(1-ease(f,31,36)),
  blink:Math.max(0,1-Math.abs(f-18)/2,1-Math.abs(f-199)/2),
});
// Same actor-local endpoint is used by the button and the pointing fingertip.
export const CONTACT={x:670+(84+14)*2.2,y:807-134*2.2};
export const IfverseContactPreview:React.FC=()=>{
  const f=useCurrentFrame(),p=contactPose(f);
  const active=f>=84;
  return <svg viewBox="0 0 1920 1080" width="100%" height="100%">
    {/* Locked camera: backdrop, floor, actors and contact prop share world space. */}
    <g>
      <Stage/>
      <g>
        <path d={'M'+CONTACT.x+' 807V'+(CONTACT.y+40)} stroke="#171821" strokeWidth="24"/>
        <rect x={CONTACT.x-46} y={CONTACT.y-50} width="92" height="100" rx="12"
          fill="#35303E" stroke="#171821" strokeWidth="6"/>
        <circle cx={CONTACT.x} cy={CONTACT.y} r="18" fill={active?'#6DDBCC':'#D6A06E'}
          stroke="#FFF2DE" strokeWidth="3"/>
      </g>
      <RefCharacter x={670} y={807} scale={2.2} facing="right" gesture="point"
        armProgress={p.reach} headTilt={5*p.anticipate-4*p.reach}
        emotion={f<36?'thinking':f<105?'neutral':'smile'} blink={p.blink}/>
      <RefCharacter x={1275} y={807} scale={2.2} role="yellow-cap" facing="left"
        gesture="wave" armProgress={.28*p.response} headTilt={6*p.response}
        emotion={f<91?'neutral':f<174?'shock':'smile'} blink={p.blink}/>
      <path d="M60 1080V225M1860 1080V225" stroke="#100F19" strokeWidth="95" opacity=".65"/>
    </g>
    <text x="110" y="110" fill="#FFF2DE" fontFamily="Arial,sans-serif" fontSize="38">
      REACH → CONTACT → RESPONSE
    </text>
  </svg>;
};
