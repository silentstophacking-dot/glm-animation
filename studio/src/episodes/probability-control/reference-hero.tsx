import React from 'react';
import { Pose, joints, LEG_LEN, HEAD } from '../../engine';

/**
 * Studio reference-character family, deliberately designed for code-only SVG.
 *
 * Based on the user-provided screenshots' VISUAL GRAMMAR:
 * - solid circular near-black head
 * - tiny warm-white eyes and mouth, no human/anime anatomy
 * - thin capsule limbs, simple elbow/knee bends
 * - one easy-to-read color prop: coral hoodie or gold cap
 * - restrained warm rim rather than illustrated texture/shading
 *
 * Uses the ORIGINAL Hero pose and joints interface so the exact same animated
 * shot keyframes, hand-attached props, camera and environment can be reused.
 * No raster textures, sprites, puppetry plugins or AI images.
 */
export type ReferenceVariant = 'coral' | 'gold-cap';
type LimbGeom = { root: {x:number;y:number}; mid:{x:number;y:number}; end:{x:number;y:number} };

const PALETTE = {
  head:'#110B17',
  face:'#FFF7DA',
  outline:'#19111B',
  rim:'#F5B977',
  lit:'#EFC58C',
  unlit:'#332638',
  coral:'#E9533D',
  coralSide:'#B63731',
  coralHighlight:'#FF9470',
  gold:'#FFCA3B',
  goldShade:'#D99622',
  goldHighlight:'#FFE68B',
  pants:'#24202C',
  shoes:'#191621',
};

const minmax=(n:number,low=0,high=1)=>Math.min(high,Math.max(low,n));

/** The face has only three principal marks and can be animated frame-by-frame. */
const MinimalFace:React.FC<{pose:Pose}>=({pose})=>{
  const eyeY=HEAD.y-2;
  const blink=minmax(pose.blink);
  const yaw=pose.yaw;
  const far=Math.abs(yaw)>.65;
  const expr=pose.expr;
  const eye=(x:number)=>{
    if(far && x*yaw<0) return null;
    if(blink>.86) return <path key={x} d={'M'+(x-10)+' '+eyeY+' q10 8 20 0'}
      fill="none" stroke={PALETTE.face} strokeWidth="4.4" strokeLinecap="round"/>;
    if(expr==='happy')return <path key={x} d={'M'+(x-11)+' '+(eyeY+6)+' q11 -19 22 0'}
      fill="none" stroke={PALETTE.face} strokeWidth="5" strokeLinecap="round"/>;
    if(expr==='smug'||expr==='cool')return <path key={x} d={'M'+(x-10)+' '+(eyeY+3)+' q10 -9 20 0'}
      fill="none" stroke={PALETTE.face} strokeWidth="5" strokeLinecap="round"/>;
    if(expr==='shock')return <ellipse key={x} cx={x} cy={eyeY} rx={6.5} ry={10.8} fill={PALETTE.face}/>;
    if(expr==='worried')return <ellipse key={x} cx={x} cy={eyeY+1} rx={5} ry={7.2} fill={PALETTE.face}/>;
    return <circle key={x} cx={x} cy={eyeY} r={6.5} fill={PALETTE.face}/>;
  };
  const my=HEAD.y+30;
  const mouth=expr==='happy'
    ? <path d={'M -18 '+(my-3)+' Q0 '+(my+24)+' 18 '+(my-3)}
        stroke={PALETTE.face} strokeWidth={5.7} fill="none" strokeLinecap="round"/>
    : expr==='shock'
      ? <ellipse cx="0" cy={my+2} rx="6.2" ry="11" fill={PALETTE.face}/>
      : expr==='worried'
      ? <path d={'M -12 '+(my+7)+' Q0 '+(my-4)+' 12 '+(my+7)}
           stroke={PALETTE.face} strokeWidth={5} fill="none" strokeLinecap="round"/>
      : expr==='smug'||expr==='cool'
      ? <path d={'M -12 '+my+' Q3 '+(my+13)+' 15 '+(my-7)}
          stroke={PALETTE.face} strokeWidth={5.3} fill="none" strokeLinecap="round"/>
      : <path d={'M -10 '+my+' Q0 '+(my+7)+' 10 '+my}
          stroke={PALETTE.face} strokeWidth={4.8} fill="none" strokeLinecap="round"/>;
  return <g transform={'translate('+(yaw*10+pose.look*4)+' 0) scale('+(1-.20*Math.abs(yaw))+' 1)'}>
    {eye(-22)}{eye(22)}{mouth}
    {pose.glint && pose.glint>.1 && blink<.8
      ? <g opacity={Math.min(.75,pose.glint)}>
        <circle cx={-22} cy={eyeY} r={14} fill="#FFD36F" opacity=".28"/>
        <circle cx={22} cy={eyeY} r={14} fill="#FFD36F" opacity=".28"/>
      </g>:null}
  </g>;
};

const Sleeve:React.FC<{joint:LimbGeom;variant:ReferenceVariant;near:boolean}>=({joint,variant,near})=>{
  const d='M'+joint.root.x+' '+joint.root.y+' L'+joint.mid.x+' '+joint.mid.y+' L'+joint.end.x+' '+joint.end.y;
  const c=variant==='coral'?PALETTE.coral:PALETTE.unlit;
  const hi=variant==='coral'?PALETTE.coralHighlight:PALETTE.lit;
  return <g>
    <path d={d} fill="none" stroke={PALETTE.outline} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round"/>
    <path d={d} fill="none" stroke={c} strokeWidth={near?22:20} strokeLinecap="round" strokeLinejoin="round"/>
    <path d={d} fill="none" stroke={hi} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={near?.68:.33}/>
    <circle cx={joint.mid.x} cy={joint.mid.y} r={near?12:10} fill={c}/>
    {/* Simple warm mitten/hand, instead of anatomical fingers. */}
    <ellipse cx={joint.end.x} cy={joint.end.y} rx={10} ry={13}
      fill={variant==='coral'?PALETTE.face:PALETTE.head} stroke={PALETTE.outline} strokeWidth={3}/>
  </g>;
};

const Leg:React.FC<{joint:LimbGeom;near:boolean}>=({joint,near})=>{
  const d='M'+joint.root.x+' '+joint.root.y+' L'+joint.mid.x+' '+joint.mid.y+' L'+joint.end.x+' '+joint.end.y;
  return <g>
    <path d={d} stroke={PALETTE.outline} strokeWidth={28} fill="none"
      strokeLinecap="round" strokeLinejoin="round"/>
    <path d={d} stroke={near?'#322B38':'#211D2B'} strokeWidth={22} fill="none"
      strokeLinecap="round" strokeLinejoin="round"/>
    <path d={d} stroke="#E0B079" strokeWidth={3} fill="none"
      strokeLinecap="round" strokeLinejoin="round" opacity={near?.4:.2}/>
    <ellipse cx={joint.end.x+9} cy={joint.end.y+6} rx={25} ry={11}
      fill={PALETTE.shoes} stroke={PALETTE.outline} strokeWidth={3}/>
    <path d={'M'+(joint.end.x-5)+' '+(joint.end.y+11)+' h25'}
      stroke={PALETTE.lit} opacity=".46" strokeWidth="3" strokeLinecap="round"/>
  </g>;
};

/** Props intentionally match the existing Hero calls. */
export const ReferenceHero:React.FC<{
  pose:Pose;
  variant?:ReferenceVariant;
  rimId?:string;
  shadow?:number;
}>=({pose,variant='coral',rimId='rimR',shadow=.3})=>{
  const j=joints(pose);
  const thin=1-.30*Math.abs(pose.yaw);
  const isCoral=variant==='coral';
  const chest=isCoral?PALETTE.coral:PALETTE.head;
  const chestShade=isCoral?PALETTE.coralSide:'#25202B';
  const handNear=pose.yaw>=0?'R':'L';
  const torso=<g transform={'rotate('+pose.tilt+') scale('+thin+' 1)'}>
    {/* Long straight jacket and clear hood silhouette: limited geometry. */}
    {isCoral&&<path d="M-43 -110 Q-81 -112 -76 -57 Q-67 -12 -45 11
      L-33 -5 L-49 -98Z" fill={PALETTE.coralSide} stroke={PALETTE.outline} strokeWidth={4}/>}
    <path d="M-40 -113 Q0 -127 40 -113 L35 22 Q0 34 -35 22Z"
      fill={chest} stroke={PALETTE.outline} strokeWidth={5} strokeLinejoin="round"/>
    <path d="M18 -112 L36 -112 L32 20 L11 27Z" fill={chestShade} opacity=".75"/>
    {isCoral&&<path d="M-32 -104 Q0 -88 32 -105" stroke={PALETTE.coralHighlight}
      strokeWidth={6} fill="none" strokeLinecap="round"/>}
    {!isCoral&&<path d="M-23 -112 L0 -86 L23 -112" stroke="#665267"
      strokeWidth={5} fill="none" strokeLinecap="round"/>}
    <path d="M0 -98 V19" stroke={chestShade} strokeWidth={3} opacity=".85"/>
    {isCoral&&<path d="M-25 -10 Q0 -1 25 -10" stroke="#F07A56"
      strokeWidth={2.5} fill="none" opacity=".65"/>}
  </g>;
  const head=<g transform={'rotate('+pose.tilt+') rotate('+pose.headTilt+' 0 '+HEAD.y+')'}>
    {/* Single black circle: the reference's visual anchor. */}
    <circle cx={0} cy={HEAD.y} r={65} fill={PALETTE.head}
      stroke={PALETTE.outline} strokeWidth={4}/>
    <path d={'M -51 '+(HEAD.y-43)+' A 67 67 0 0 1 25 '+(HEAD.y-61)}
      stroke={PALETTE.rim} strokeWidth={7} fill="none" opacity=".95" strokeLinecap="round"/>
    <path d={'M 49 '+(HEAD.y+36)+' A 65 65 0 0 1 13 '+(HEAD.y+62)}
      stroke={PALETTE.rim} strokeWidth={3} fill="none" opacity=".18"/>
    {variant==='gold-cap'&&<g>
      <path d={'M -64 '+(HEAD.y-30)+' Q -62 '+(HEAD.y-92)+' 0 '+(HEAD.y-90)+
        ' Q 68 '+(HEAD.y-86)+' 71 '+(HEAD.y-30)+' Z'}
        fill={PALETTE.gold} stroke={PALETTE.goldShade} strokeWidth={5} strokeLinejoin="round"/>
      <path d={'M -63 '+(HEAD.y-29)+' Q -80 '+(HEAD.y-17)+' -105 '+(HEAD.y-15)+
        ' Q -113 '+(HEAD.y-4)+' -89 '+(HEAD.y-2)+' Q -21 '+(HEAD.y+3)+' 31 '+(HEAD.y-19)+'Z'}
        fill={PALETTE.gold} stroke={PALETTE.goldShade} strokeWidth={4}/>
      <path d={'M -49 '+(HEAD.y-56)+' Q 7 '+(HEAD.y-83)+' 52 '+(HEAD.y-42)}
        stroke={PALETTE.goldHighlight} strokeWidth={6} fill="none" strokeLinecap="round" opacity=".8"/>
    </g>}
    <MinimalFace pose={pose}/>
  </g>;
  return <g>
    {shadow>0&&<ellipse cx={pose.x} cy={pose.y+LEG_LEN*pose.scale+8}
      rx={66*pose.scale} ry={12*pose.scale} fill="#080510" opacity={shadow*.28}/>}
    <g transform={'translate('+pose.x+' '+pose.y+') scale('+pose.scale+') rotate('+pose.spin+' 0 -90)'}
      filter={'url(#'+rimId+')'}>
      <g transform={'translate(0 '+LEG_LEN+') scale('+(1+.6*pose.squash)+' '+(1-pose.squash)+') translate(0 '+(-LEG_LEN)+')'}>
        <Leg joint={j.legL} near={pose.yaw>=0}/>
        <Leg joint={j.legR} near={pose.yaw<0}/>
        {pose.yaw>=0&&<Sleeve joint={j.armL} near={false} variant={variant}/>}
        {pose.yaw<0&&<Sleeve joint={j.armR} near={false} variant={variant}/>}
        {isCoral&&<g transform={'rotate('+pose.tilt+')'}>
          <path d="M -34 -118 Q -61 -122 -62 -165 Q -43 -197 -18 -169
            L 18 -134 L32 -103" fill={PALETTE.coral} stroke={PALETTE.outline} strokeWidth={5}/>
          <path d="M-52 -162 Q-40 -177 -28 -169" stroke={PALETTE.coralHighlight}
            strokeWidth={5} fill="none" opacity=".65"/>
        </g>}
        {torso}
        {pose.yaw>=0&&<Sleeve joint={j.armR} near={true} variant={variant}/>}
        {pose.yaw<0&&<Sleeve joint={j.armL} near={true} variant={variant}/>}
        {head}
      </g>
    </g>
  </g>;
};
