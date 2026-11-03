import React from 'react';

/**
 * Character Rig V5 — independent SVG 2.5D actor.
 *
 * This is original clean-room vector artwork and a new skeleton rather than
 * another tweak of the legacy Pose/ReferenceHero system.
 *
 * PRINCIPLES:
 * - Feet and hands are fixed world points during contact.
 * - Hip, shoulders, neck, and head have independently meaningful motion.
 * - Both knees bend AWAY from the center of the stance, never cross.
 * - Two-bone IK does not fake contacts by stretching the limbs.
 * - All motion is a deterministic function of the Remotion frame.
 */
export type V5Point={x:number;y:number};
export type V5Emotion='neutral'|'notice'|'focus'|'effort'|'surprise'|'relief';
export type V5Pose={
  hip:V5Point;
  footFar:V5Point;
  footNear:V5Point;
  lean:number;
  headTilt:number;
  gaze:number;
  emotion:V5Emotion;
  blink:number;
  nearHand?:V5Point;
  farHand?:V5Point;
};
export type V5Joint={root:V5Point;knee:V5Point;end:V5Point;reachError:number};
export type V5Rig={hip:V5Point;shoulder:V5Point;head:V5Point;
  legFar:V5Joint;legNear:V5Joint;
  armFar:V5Joint;armNear:V5Joint;nearHandTarget:V5Point;
  farHandTarget:V5Point;
};
const P={night:'#100E18',edge:'#1B1824',cream:'#FFF1DC',
  coral:'#E35A45',coralShadow:'#B33E40',coralHighlight:'#F88F76',
  pants:'#252535',pantsHi:'#414458',gold:'#F2BF70',
  shoe:'#191D28',soft:'#D6B8A6',skin:'#F8DDC2'};
const p=(x:number,y:number):V5Point=>({x,y});
export const dist=(a:V5Point,b:V5Point)=>Math.hypot(a.x-b.x,a.y-b.y);
export const clamp=(n:number,a=0,b=1)=>Math.min(b,Math.max(a,n));
export const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const ease=(frame:number,start:number,end:number)=>{
  const t=clamp((frame-start)/(end-start));
  return t*t*(3-2*t);
};
const movingFoot=(a:V5Point,b:V5Point,frame:number,start:number,end:number,lift:number)=>{
  const u=clamp((frame-start)/(end-start));
  return p(mix(a.x,b.x,ease(frame,start,end)),a.y-lift*Math.sin(Math.PI*u));
};
export const GROUND_Y=855;
export const V5_CONTROL_POINT=p(918,721);
const START={far:p(634,847),near:p(701,847)};
const FINISH={far:p(751,847),near:p(827,847)};

export const actorV5At=(frame:number):V5Pose=>{
  const f=clamp(frame,0,329);
  const stepOne=ease(f,59,101);
  const stepTwo=ease(f,96,141);
  const settle=ease(f,139,152);
  const down=ease(f,148,202);
  const up=ease(f,258,303);
  const crouch=down*(1-up);
  const anticipate=ease(f,41,54)*(1-ease(f,57,69));
  const pushback=ease(f,258,276)*(1-ease(f,292,320));
  const bob=5*Math.sin(Math.PI*clamp((f-59)/42))+
    3.5*Math.sin(Math.PI*clamp((f-96)/45));
  const hip=p(
    666+62*stepOne+60*stepTwo-10*anticipate+8*crouch-6*pushback,
    679-bob+78*crouch+3*anticipate-4*pushback
  );
  const lean=2+3*anticipate+16*crouch-13*pushback;
  const headTilt= -3-4*anticipate-9*crouch+12*pushback;
  const footFar=movingFoot(START.far,FINISH.far,f,96,141,38);
  const footNear=movingFoot(START.near,FINISH.near,f,59,101,43);
  const emotion:V5Emotion=
    f<31?'neutral':f<79?'notice':f<159?'focus':
    f<219?'effort':f<273?'focus':f<310?'surprise':'relief';
  const blink=Math.max(...[34,117,210,277,315]
    .map(k=>Math.max(0,1-Math.abs(f-k)/2.5)));
  return {hip,footFar,footNear,lean,headTilt,
    gaze:f<250?.5:f<305?.85:.2,emotion,blink};
};

/**
 * Analytic two-link IK: returns exact end when in reach and an honest error
 * when outside it. No bone stretching is allowed.
 */
export const solveV5=(root:V5Point,target:V5Point,l1:number,l2:number,bend:-1|1):V5Joint=>{
  const vx=target.x-root.x,vy=target.y-root.y;
  const raw=Math.hypot(vx,vy);
  const ux=raw>1e-7?vx/raw:0,uy=raw>1e-7?vy/raw:1;
  const d=clamp(raw,Math.abs(l1-l2)+.0001,l1+l2-.0001);
  const advance=(l1*l1-l2*l2+d*d)/(2*d);
  const offset=Math.sqrt(Math.max(0,l1*l1-advance*advance));
  const end=p(root.x+ux*d,root.y+uy*d);
  const knee=p(root.x+ux*advance-uy*offset*bend,
    root.y+uy*advance+ux*offset*bend);
  return {root,knee,end,reachError:dist(end,target)};
};
export const deriveV5Rig=(pose:V5Pose):V5Rig=>{
  const h=pose.hip;
  // Torso can tip and shift independently of hip translation.
  const shoulder=p(h.x+6+pose.lean*.96,h.y-121+Math.abs(pose.lean)*.10);
  const head=p(shoulder.x+6,shoulder.y-61);
  const nearShoulder=p(shoulder.x+28,shoulder.y+6);
  const farShoulder=p(shoulder.x-29,shoulder.y+9);
  const nearHandRest=p(nearShoulder.x+45,nearShoulder.y+93);
  const farHandRest=p(farShoulder.x-37,farShoulder.y+96);
  const nearHandTarget=pose.nearHand??nearHandRest;
  const farHandTarget=pose.farHand??farHandRest;
  // Far knee bends left; near knee right. Wide, readable stance.
  return {hip:h,shoulder,head,
    legFar:solveV5(p(h.x-19,h.y+7),pose.footFar,105,103,1),
    legNear:solveV5(p(h.x+19,h.y+7),pose.footNear,105,103,-1),
    armFar:solveV5(farShoulder,farHandTarget,70,68,1),
    armNear:solveV5(nearShoulder,nearHandTarget,70,68,-1),
    nearHandTarget,farHandTarget
  };
};
/** Frame-spanning physical audits: reject impossible acting geometry. */
export const auditV5Mechanics=()=>{
  let maxFootError=0,maxHandError=0;
  for(let f=0;f<330;f++){
    const pose=actorV5At(f);
    const rig=deriveV5Rig(pose);
    maxFootError=Math.max(maxFootError,rig.legFar.reachError,rig.legNear.reachError);
    maxHandError=Math.max(maxHandError,rig.armFar.reachError,rig.armNear.reachError);
    if([pose.hip.x,pose.hip.y,rig.head.x,rig.head.y].some(v=>!Number.isFinite(v)))
      throw new Error('V5 nonfinite actor at '+f);
    if(f>=141 && f<330 &&
       (dist(pose.footFar,FINISH.far)>.001||dist(pose.footNear,FINISH.near)>.001))
      throw new Error('V5 planted foot moves after step '+f);
    if(rig.legFar.knee.x>=rig.legNear.knee.x)
      throw new Error('V5 knees cross at '+f);
  }
  const rest=actorV5At(145),low=actorV5At(207);
  if(low.hip.y-rest.hip.y<65)throw new Error('V5 crouch lacks weight shift');
  if(maxFootError>1.5)throw new Error('V5 bone cannot reach foot, max error '+maxFootError);
  if(maxHandError>1.5)throw new Error('V5 bone cannot reach resting hand, max error '+maxHandError);
  return {maxFootError,maxHandError,frames:330};
};
const Capsule:React.FC<{joint:V5Joint;kind:'arm'|'leg';near:boolean}>=({joint,kind,near})=>{
  const d='M'+joint.root.x+' '+joint.root.y+'L'+joint.knee.x+' '+joint.knee.y+
    'L'+joint.end.x+' '+joint.end.y;
  const w=kind==='leg'?(near?27:24):(near?26:23);
  const col=kind==='leg'?P.pants:(near?P.coral:P.coralShadow);
  return <g>
    <path d={d} fill="none" stroke={P.edge} strokeWidth={w+8}
      strokeLinecap="round" strokeLinejoin="round"/>
    <path d={d} fill="none" stroke={col} strokeWidth={w}
      strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx={joint.knee.x} cy={joint.knee.y} r={w*.47} fill={col}/>
    <path d={'M'+joint.root.x+' '+joint.root.y+'L'+joint.knee.x+' '+joint.knee.y}
      stroke={kind==='leg'?P.pantsHi:P.coralHighlight}
      strokeWidth="4.5" opacity={near?.66:.35} strokeLinecap="round"/>
  </g>;
};
const Foot:React.FC<{point:V5Point;near:boolean}>=({point,near})=><g>
  <ellipse cx={point.x+13} cy={point.y+3} rx={near?33:30} ry="13"
    fill={P.shoe} stroke={P.edge} strokeWidth="4"/>
  <path d={'M'+(point.x+4)+' '+(point.y+9)+'h29'}
    stroke={P.cream} opacity=".48" strokeWidth="3" strokeLinecap="round"/>
</g>;
const Hand:React.FC<{point:V5Point;grip:boolean;near:boolean}>=({point,grip,near})=><g>
  <ellipse cx={point.x} cy={point.y} rx={near?13:11} ry={near?14:12}
    fill={P.skin} stroke={P.edge} strokeWidth="3"/>
  {grip?<path d={'M'+(point.x-7)+' '+(point.y-3)+'q12 2 11 12'}
    stroke="#C69B8A" strokeWidth="3" fill="none" strokeLinecap="round"/>:
    <ellipse cx={point.x+(near?9:-9)} cy={point.y-5} rx="5" ry="7"
      fill={P.skin} stroke={P.edge} strokeWidth="2.5"/>}
</g>;
const FaceV5:React.FC<{pose:V5Pose}>=({pose})=>{
  const e=pose.emotion;
  const eyeY=-9,open=1-pose.blink;
  const eye=(x:number)=>{
    const dx=pose.gaze*3;
    if(open<.28)return <path key={x}
      d={'M'+(x-8)+' '+eyeY+'Q'+x+' '+(eyeY+7)+' '+(x+8)+' '+eyeY}
      fill="none" stroke={P.cream} strokeWidth="3.7" strokeLinecap="round"/>;
    if(e==='relief')return <path key={x}
      d={'M'+(x-9)+' '+eyeY+'Q'+x+' '+(eyeY-11)+' '+(x+9)+' '+eyeY}
      fill="none" stroke={P.cream} strokeWidth="4" strokeLinecap="round"/>;
    return <ellipse key={x} cx={x+dx} cy={eyeY}
      rx={e==='surprise'||e==='notice'?7:5.4}
      ry={(e==='surprise'||e==='notice'?10:e==='focus'?5:7)*open}
      fill={P.cream}/>;
  };
  return <g>
    {eye(-18)}{eye(18)}
    {(e==='surprise'||e==='notice'||e==='effort')?<g stroke={P.cream}
      strokeWidth="3.6" fill="none" strokeLinecap="round">
      <path d={e==='effort'?'M-28 -30L-10 -23M10 -23L29 -30':
        'M-29 -28Q-18 -38 -9 -29M9 -29Q18 -38 29 -28'}/>
    </g>:null}
    {e==='surprise'||e==='notice'?<ellipse cx="3" cy="24"
      rx="7" ry="10" fill={P.cream}/>:
      e==='effort'?<path d="M-12 26Q0 11 13 26"
        fill="none" stroke={P.cream} strokeWidth="4.5"
        strokeLinecap="round"/>:
      e==='relief'?<path d="M-15 20Q0 37 15 20"
        fill="none" stroke={P.cream} strokeWidth="4.5"
        strokeLinecap="round"/>:
      <path d="M-12 23Q0 27 12 23" stroke={P.cream} strokeWidth="4"
        fill="none" strokeLinecap="round"/>}
  </g>;
};
export const CharacterRigV5:React.FC<{
  pose:V5Pose;shadow?:number;grip?:boolean;
}>=({pose,shadow=.5,grip=false})=>{
  const r=deriveV5Rig(pose);
  const torsoTop=r.shoulder,hip=r.hip;
  const chest='M'+(torsoTop.x-43)+' '+(torsoTop.y+1)+
   'Q'+torsoTop.x+' '+(torsoTop.y-18)+' '+(torsoTop.x+43)+' '+(torsoTop.y+1)+
   'L'+(hip.x+34)+' '+(hip.y+6)+
   'Q'+hip.x+' '+(hip.y+18)+' '+(hip.x-33)+' '+(hip.y+6)+'Z';
  return <g>
    {shadow>0?<g>
      <ellipse cx={(pose.footFar.x+pose.footNear.x)/2+12} cy={GROUND_Y+12}
        rx="115" ry="17" fill="#06070E" opacity={shadow*.35}/>
      {[pose.footFar,pose.footNear].map((f,i)=><ellipse key={i}
        cx={f.x+5} cy={GROUND_Y+5} rx="38" ry="10"
        fill="#080814" opacity={shadow*.48}/>)}
    </g>:null}
    <Capsule joint={r.legFar} kind="leg" near={false}/>
    <Foot point={r.legFar.end} near={false}/>
    <Capsule joint={r.armFar} kind="arm" near={false}/>
    <Hand point={r.armFar.end} near={false} grip={false}/>
    <path d={chest} fill={P.coral} stroke={P.edge}
      strokeWidth="6" strokeLinejoin="round"/>
    <path d={'M'+(torsoTop.x+20)+' '+(torsoTop.y+6)+
      'L'+(hip.x+34)+' '+(hip.y+4)+'L'+(hip.x+7)+' '+(hip.y+12)+
      'L'+(torsoTop.x+8)+' '+(torsoTop.y+9)+'Z'}
      fill={P.coralShadow} opacity=".64"/>
    <path d={'M'+(torsoTop.x-22)+' '+(torsoTop.y+4)+
      'Q'+torsoTop.x+' '+(torsoTop.y+21)+' '+(torsoTop.x+23)+' '+(torsoTop.y+3)}
      fill="none" stroke={P.coralHighlight} strokeWidth="5" opacity=".82"/>
    <path d={'M'+torsoTop.x+' '+(torsoTop.y+21)+'L'+hip.x+' '+(hip.y-10)}
      stroke={P.coralShadow} strokeWidth="3" opacity=".6"/>
    <g transform={'translate('+r.head.x+' '+r.head.y+') rotate('+pose.headTilt+')'}>
      <circle r="58" fill={P.coralShadow} opacity=".86"/>
      <circle r="54" fill={P.night} stroke={P.edge} strokeWidth="4"/>
      <path d="M-40 -36Q-26 -56 9 -51" fill="none" stroke={P.gold}
        strokeWidth="4.6" strokeLinecap="round" opacity=".84"/>
      <FaceV5 pose={pose}/>
    </g>
    <Capsule joint={r.legNear} kind="leg" near={true}/>
    <Foot point={r.legNear.end} near={true}/>
    <Capsule joint={r.armNear} kind="arm" near={true}/>
    <Hand point={r.armNear.end} near={true} grip={grip}/>
  </g>;
};
