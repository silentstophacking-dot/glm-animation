import React from 'react';
import {Pose, Expr, joints, LEG_LEN} from '../../engine';

/**
 * Character Rig V2 — original SVG artwork. Isolated from previous films.
 * Targets are in actor-local coordinates relative to the hip.
 * When hand target is reachable, the palm remains exactly at that point.
 */
export type Point={x:number;y:number};
export type Side='L'|'R';
export type V2Variant='coral'|'gold'|'teal';
export type HandStyle='open'|'grip'|'fist'|'point';
export type V2Limb={root:Point;mid:Point;end:Point};
export type V2Targets=Partial<Record<Side,Point>>;
export type V2RigProps={
  pose:Pose; variant?:V2Variant;
  hands?:V2Targets; feet?:V2Targets;
  handStyles?:Partial<Record<Side,HandStyle>>;
  shadow?:number;
};
const PAL={
  ink:'#100E18',outline:'#1C1522',face:'#FFF2DE',soft:'#F2BF70',
  coral:'#E35A45',coralShade:'#AE3B39',coralHi:'#FC9474',
  teal:'#4D958F',tealShade:'#2D6768',tealHi:'#8AD9C2',
  gold:'#E5AA43',goldShade:'#9F6A35',goldHi:'#FADB8F',
  pants:'#272634',pantsHi:'#424050',shoes:'#1A1A27'
};
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const p=(x:number,y:number):Point=>({x,y});
export const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
/**
 * Two-bone inverse kinematics with stable elbow bias.
 * The target is never teleported: unreachable requests clamp to the
 * physical reach radius, while reachable endpoints are exact.
 */
export const solveTwoBone=(root:Point,target:Point,l1:number,l2:number,bias:1|-1):V2Limb=>{
  const dx=target.x-root.x,dy=target.y-root.y;
  const raw=Math.hypot(dx,dy);
  const ux=raw>0.00001?dx/raw:0;
  const uy=raw>0.00001?dy/raw:1;
  const d=clamp(raw,Math.abs(l1-l2)+.001,l1+l2-.001);
  const end=p(root.x+ux*d,root.y+uy*d);
  const along=(l1*l1-l2*l2+d*d)/(2*d);
  const across=Math.sqrt(Math.max(0,l1*l1-along*along));
  const mid=p(root.x+ux*along-uy*across*bias,root.y+uy*along+ux*across*bias);
  return {root,mid,end};
};
export const rigV2Joints=(pose:Pose,hands:V2Targets={},feet:V2Targets={})=>{
  const j=joints(pose);
  return {
    armL:hands.L?solveTwoBone(j.armL.root,hands.L,62,58,1):j.armL,
    armR:hands.R?solveTwoBone(j.armR.root,hands.R,62,58,-1):j.armR,
    legL:feet.L?solveTwoBone(j.legL.root,feet.L,72,68,-1):j.legL,
    legR:feet.R?solveTwoBone(j.legR.root,feet.R,72,68,1):j.legR,
    head:j.head
  };
};
export const rigLocalToWorld=(pose:Pose,q:Point):Point=>{
  const a=pose.spin*Math.PI/180;
  const ox=q.x,oy=q.y+90;
  return {
    x:pose.x+(ox*Math.cos(a)-oy*Math.sin(a))*pose.scale,
    y:pose.y+((ox*Math.sin(a)+oy*Math.cos(a))-90)*pose.scale
  };
};
/** Exact inverse of rigLocalToWorld for world-fixed interaction targets. */
export const rigWorldToLocal=(pose:Pose,q:Point):Point=>{
  const x=(q.x-pose.x)/pose.scale;
  const y=(q.y-pose.y)/pose.scale+90;
  const a=-pose.spin*Math.PI/180;
  return {x:x*Math.cos(a)-y*Math.sin(a),
    y:x*Math.sin(a)+y*Math.cos(a)-90};
};
const color=(v:V2Variant)=>v==='coral'
  ?[PAL.coral,PAL.coralShade,PAL.coralHi]
  :v==='gold'?[PAL.gold,PAL.goldShade,PAL.goldHi]
  :[PAL.teal,PAL.tealShade,PAL.tealHi];
const LimbPath:React.FC<{j:V2Limb;type:'arm'|'leg';near:boolean;variant:V2Variant}>=
({j,type,near,variant})=>{
  const [main,shade,hi]=color(variant);
  const c=type==='arm'?main:PAL.pants;
  const edge=type==='arm'?shade:PAL.pantsHi;
  const d='M'+j.root.x+' '+j.root.y+' L'+j.mid.x+' '+j.mid.y+' L'+j.end.x+' '+j.end.y;
  const thick=type==='arm'?(near?22:19):(near?23:21);
  return <g>
    <path d={d} fill="none" stroke={PAL.outline} strokeWidth={thick+7}
      strokeLinecap="round" strokeLinejoin="round"/>
    <path d={d} fill="none" stroke={c} strokeWidth={thick}
      strokeLinecap="round" strokeLinejoin="round"/>
    <path d={'M'+j.root.x+' '+j.root.y+' L'+j.mid.x+' '+j.mid.y}
      stroke={edge} strokeWidth="5" fill="none" opacity={near?.54:.4}
      strokeLinecap="round"/>
    <circle cx={j.mid.x} cy={j.mid.y} r={thick*.47} fill={c}/>
    {type==='leg'?<g>
      <ellipse cx={j.end.x+9} cy={j.end.y+6} rx={24} ry={11}
        fill={PAL.shoes} stroke={PAL.outline} strokeWidth="3"/>
      <path d={'M'+(j.end.x-5)+' '+(j.end.y+12)+' h23'}
        stroke={hi} strokeWidth="2.7" opacity=".56" strokeLinecap="round"/>
    </g>:null}
  </g>;
};
const Hand:React.FC<{at:Point;style:HandStyle;near:boolean}>=({at,style,near})=><g
  transform={'translate('+at.x+' '+at.y+')'}>
  {style==='fist'?<g>
    <circle r="12" fill={PAL.face} stroke={PAL.outline} strokeWidth="3"/>
    <path d="M-8 3H7" stroke="#CBAE9A" strokeWidth="2.5" strokeLinecap="round"/>
  </g>:style==='point'?<g>
    <ellipse rx="10" ry="12" fill={PAL.face} stroke={PAL.outline} strokeWidth="3"/>
    <path d="M4 -6L26 -19" stroke={PAL.outline} strokeWidth="12" strokeLinecap="round"/>
    <path d="M4 -6L26 -19" stroke={PAL.face} strokeWidth="7" strokeLinecap="round"/>
  </g>:style==='grip'?<g>
    <ellipse rx="11" ry="13" fill={PAL.face} stroke={PAL.outline} strokeWidth="3"/>
    <path d="M-5 -3Q5 3 2 11" fill="none" stroke="#C9A99A"
      strokeWidth="3" strokeLinecap="round"/>
  </g>:<g>
    <ellipse rx="11" ry="13" fill={PAL.face} stroke={PAL.outline} strokeWidth="3"/>
    <ellipse cx={near?10:-10} cy="-2" rx="5" ry="7" fill={PAL.face}
      stroke={PAL.outline} strokeWidth="2.5"/>
  </g>}
</g>;
const FaceV2:React.FC<{expr:Expr;blink:number;yaw:number;look:number}>=
({expr,blink,yaw,look})=>{
  const isSide=Math.abs(yaw)>.7;
  const hidden=yaw>0?'L':'R';
  const eye=(x:number,s:Side)=>{
    if(isSide&&s===hidden)return null;
    const cx=x+look*4;
    if(blink>.8)return <path key={s} d={'M'+(cx-8)+' -9 Q'+cx+' -3 '+(cx+8)+' -9'}
      fill="none" stroke={PAL.face} strokeWidth="3.8" strokeLinecap="round"/>;
    if(expr==='happy')return <path key={s} d={'M'+(cx-9)+' -8 Q'+cx+' -20 '+(cx+9)+' -8'}
      fill="none" stroke={PAL.face} strokeWidth="4" strokeLinecap="round"/>;
    return <ellipse key={s} cx={cx} cy="-11"
      rx={expr==='shock'?6.5:5.4}
      ry={expr==='shock'?10:expr==='tired'?4:7}
      fill={PAL.face}/>;
  };
  const mouth=expr==='shock'?<ellipse cy="22" rx="7" ry="11" fill={PAL.face}/>
    :expr==='happy'?<path d="M-16 17Q0 36 16 17" stroke={PAL.face} strokeWidth="5"
      fill="none" strokeLinecap="round"/>
    :expr==='worried'?<path d="M-13 28Q0 11 13 28" fill="none"
      stroke={PAL.face} strokeWidth="4.7" strokeLinecap="round"/>
    :expr==='smug'||expr==='cool'?<path d="M-12 20Q5 29 14 14" fill="none"
      stroke={PAL.face} strokeWidth="4.5" strokeLinecap="round"/>
    :<path d="M-10 21Q0 25 10 21" stroke={PAL.face} strokeWidth="4"
      fill="none" strokeLinecap="round"/>;
  return <g transform={'translate('+(yaw*12)+' 0)'}>
    {eye(-18,'L')}{eye(18,'R')}
    {expr==='worried'||expr==='shock'?<path
      d={expr==='shock'?'M-30 -28Q-19 -36 -10 -28M10 -28Q19 -36 30 -28'
        :'M-30 -23L-12 -31M12 -31L30 -23'}
      fill="none" stroke={PAL.face} strokeWidth="4" strokeLinecap="round"/>:null}
    {mouth}
  </g>;
};
/**
 * Design is intentionally not a replica of any creator's own character.
 * Slight jacket taper, readable elbow positions, matte head, and limited
 * warm rim are our independent construction choices.
 */
export const CharacterRigV2:React.FC<V2RigProps>=({
  pose,variant='coral',hands={},feet={},handStyles={},shadow=.35
})=>{
  const j=rigV2Joints(pose,hands,feet);
  const [coat,coatShade,coatHi]=color(variant);
  const nearer:Side=pose.yaw>=0?'R':'L';
  const far:Side=nearer==='R'?'L':'R';
  const arm=(s:Side,near:boolean)=><g key={s}>
    <LimbPath j={s==='L'?j.armL:j.armR} type="arm" near={near} variant={variant}/>
    <Hand at={(s==='L'?j.armL:j.armR).end}
      style={handStyles[s]||'open'} near={near}/>
  </g>;
  const torso=<g transform={'rotate('+pose.tilt+')'}>
    {variant==='coral'?<path d="M-35 -111Q-65 -119 -64 -85L-42 -17L-35 13"
      fill="none" stroke={coatShade} strokeWidth="13" strokeLinecap="round"/>:null}
    <path d="M-36 -110Q0 -123 36 -110L31 20Q0 32 -31 20Z"
      fill={coat} stroke={PAL.outline} strokeWidth="5" strokeLinejoin="round"/>
    <path d="M18 -109L34 -106L31 19L11 27Z" fill={coatShade} opacity=".83"/>
    <path d="M-25 -100Q0 -84 25 -100" stroke={coatHi} strokeWidth="5"
      strokeLinecap="round" fill="none" opacity=".85"/>
    <path d="M0 -94V17" stroke={coatShade} strokeWidth="3" opacity=".8"/>
    <path d="M-21 -8Q0 0 21 -8" fill="none" stroke={coatHi}
      strokeWidth="2.5" opacity=".6"/>
  </g>;
  const head=<g transform={'translate('+j.head.x+' '+j.head.y+') rotate('+
    pose.headTilt+') scale('+(1-.16*Math.abs(pose.yaw))+' 1)'}>
    <circle r="52" fill={PAL.ink} stroke={PAL.outline} strokeWidth="4"/>
    <path d="M-42 -31Q-29 -52 4 -51" fill="none" stroke={PAL.soft}
      strokeWidth="4.5" opacity=".72" strokeLinecap="round"/>
    {variant==='gold'?<g>
      <path d="M-51 -25Q-50 -76 4 -75Q53 -76 55 -25Z"
        fill={PAL.gold} stroke={PAL.goldShade} strokeWidth="4"/>
      <path d="M-46 -27Q-1 -12 57 -27L86 -23Q61 -4 23 -17L-48 -21Z"
        fill={PAL.gold} stroke={PAL.goldShade} strokeWidth="3"/>
    </g>:null}
    {variant==='teal'?<path d="M-52 -9Q-66 -39 -39 -53"
      fill="none" stroke={PAL.tealHi} strokeWidth="7" strokeLinecap="round"/>:null}
    <FaceV2 expr={pose.expr} blink={pose.blink} yaw={pose.yaw} look={pose.look}/>
  </g>;
  return <g>
    {shadow>0?<ellipse cx={pose.x} cy={pose.y+LEG_LEN*pose.scale+7}
      rx={56*pose.scale} ry={11*pose.scale} opacity={shadow*.48} fill="#05040B"/>:null}
    <g transform={'translate('+pose.x+' '+pose.y+') scale('+pose.scale+
      ') rotate('+pose.spin+' 0 -90)'}>
      <LimbPath j={j.legL} type="leg" near={pose.yaw<0} variant={variant}/>
      <LimbPath j={j.legR} type="leg" near={pose.yaw>=0} variant={variant}/>
      {arm(far,false)}
      {torso}
      {head}
      {arm(nearer,true)}
    </g>
  </g>;
};
