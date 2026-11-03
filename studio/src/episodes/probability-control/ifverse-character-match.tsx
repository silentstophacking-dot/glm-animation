import React from 'react';
import {useCurrentFrame} from 'remotion';

/**
 * CHARACTER APPEARANCE STUDY — based directly on user-supplied reference
 * frames from Ifverse's Reaction Time + Kindergarten episodes.
 *
 * Deliberately low-detail stick-figure silhouettes: circular ink heads,
 * tiny ivory expressions, narrow shoulders, slim limbs and flat apparel.
 * This is an SVG redraw; no video frame or raster image is embedded.
 * The old V2–V5 rigs are not imported: their chunky anatomy was the problem.
 */
export type RefRole='red-hoodie'|'yellow-cap'|'blue-shirt'|'pink-shirt';
export type RefMood='neutral'|'smile'|'shock'|'worried'|'thinking';
export type RefGesture='stand'|'point'|'wave'|'sit';
export type RefFacing='front'|'right'|'left';
export type RefCharacterProps={
  x:number;y:number;scale?:number;
  role?:RefRole;emotion?:RefMood;gesture?:RefGesture;facing?:RefFacing;
  armProgress?:number;headTilt?:number;
};

const colors={
  ink:'#0D090E',night:'#17131F',cream:'#FFF7E9',warm:'#F8C982',
  coral:'#E85343',coralShade:'#BD392F',coralLight:'#FF8668',
  cap:'#F4C842',capLight:'#FFE475',pants:'#15151E',
  blue:'#397FBA',pink:'#D76C8A',line:'#281920'
};
const mix=(a:number,b:number,t:number)=>a+(b-a)*Math.max(0,Math.min(1,t));
const ease=(t:number)=>{const x=Math.max(0,Math.min(1,t));return x*x*(3-2*x);};
const path=(arr:number[])=>arr.map((x,i)=>i===0?'M'+x:i%2===0?' '+x:','+x).join('');
const EyeFace:React.FC<{emotion:RefMood;facing:RefFacing}>=({emotion,facing})=>{
  const front=facing==='front',shock=emotion==='shock';
  const look=facing==='left'?-1:1;
  if(!front){
    return <g transform={'translate('+(look*7)+' 0)'}>
      {shock?<ellipse cx={10*look} cy="-7" rx="5" ry="8" fill={colors.cream}/>:
      emotion==='thinking'?<path d={'M'+(4*look)+' -8q'+(8*look)+' -3 '+(11*look)+' 0'}
        stroke={colors.cream} strokeWidth="3.2" fill="none" strokeLinecap="round"/>:
      <path d={'M'+(3*look)+' -8q'+(5*look)+' -7 '+(10*look)+' 0'}
        stroke={colors.cream} strokeWidth="3.7" fill="none" strokeLinecap="round"/>}
      {shock?<ellipse cx={17*look} cy="9" rx="3.4" ry="5.3" fill={colors.cream}/>:
      emotion==='worried'?<path d={'M'+(9*look)+' 13q'+(8*look)+' -8 '+(12*look)+' -2'}
        stroke={colors.cream} strokeWidth="3.2" fill="none" strokeLinecap="round"/>:
      <path d={'M'+(9*look)+' 9q'+(7*look)+' 7 '+(13*look)+' -1'}
        stroke={colors.cream} strokeWidth="3.2" fill="none" strokeLinecap="round"/>}
    </g>;
  }
  return <g>
    {[-10,10].map(x=>shock?<ellipse key={x} cx={x} cy="-7" rx="4.8" ry="7" fill={colors.cream}/>:
      emotion==='thinking'?<path key={x} d={'M'+(x-5)+' -7h10'}
        stroke={colors.cream} strokeWidth="3" strokeLinecap="round"/>:
      <circle key={x} cx={x} cy="-7" r="3.4" fill={colors.cream}/>)}
    {shock?<ellipse cx="0" cy="10" rx="4" ry="6" fill={colors.cream}/>:
      emotion==='worried'?<path d="M-10 12Q0 1 10 12" stroke={colors.cream}
        strokeWidth="3.2" strokeLinecap="round" fill="none"/>:
      <path d="M-10 7Q0 20 10 7" stroke={colors.cream} strokeWidth="3.1"
        strokeLinecap="round" fill="none"/>}
  </g>;
};
const TwoStroke:React.FC<{d:string;outer:number;inner:number;fill:string;highlight?:string}>=
({d,outer,inner,fill,highlight})=><g>
  <path d={d} fill="none" stroke={colors.ink} strokeWidth={outer} strokeLinecap="round"
    strokeLinejoin="round"/>
  <path d={d} fill="none" stroke={fill} strokeWidth={inner} strokeLinecap="round"
    strokeLinejoin="round"/>
  {highlight?<path d={d} fill="none" stroke={highlight} strokeWidth="1.5"
    strokeLinecap="round" opacity=".5"/>:null}
</g>;
export const RefCharacter:React.FC<RefCharacterProps>=({
  x,y,scale=1,role='red-hoodie',emotion='smile',gesture='stand',
  facing='right',armProgress=0,headTilt=0
})=>{
  const isCap=role==='yellow-cap';
  const torsoColor=role==='red-hoodie'?colors.coral:isCap?colors.ink:
    role==='blue-shirt'?colors.blue:colors.pink;
  const dark=role==='red-hoodie'?colors.coralShade:colors.ink;
  const faceShift=facing==='right'?4:facing==='left'?-4:0;
  const flip=facing==='left'?-1:1;
  const side=facing!=='front';
  // Frame-space actor proportions: 72px black head on ~258px tall
  // body (~28%), ~30px wide hoodie and 8px limbs.
  const farLeg=gesture==='sit'?'M-8 -62L-5 -44L27 -43':
    'M-9 -66L-9 -31L-13 0';
  const nearLeg=gesture==='sit'?'M9 -64L34 -62L35 -32':
    'M8 -66L11 -29L13 0';
  const armSwing=ease(armProgress);
  const farArm=gesture==='sit'?'M-16 -159L-17 -108L2 -91':
    gesture==='wave'?'M-16 -158L-37 -121L-31 -91':
    'M-15 -158Q-23 -132 -20 -90';
  const idleNear='M16 -159Q28 -122 19 -84';
  const pointNear='M16 -159L30 -129L84 -134';
  const waveNear='M16 -159L36 -195L42 -220';
  const nearArm=gesture==='wave'?waveNear:gesture==='point'?
    (armSwing>=1?pointNear:idleNear):idleNear;
  const handX=gesture==='wave'?42:gesture==='point'?mix(19,84,armSwing):19;
  const handY=gesture==='wave'?-220:gesture==='point'?mix(-84,-134,armSwing):-84;
  return <g transform={'translate('+x+' '+y+') scale('+scale+')'}>
    <ellipse cx="2" cy="5" rx="29" ry="6" fill="#000" opacity=".26"/>
    {/* Distant limbs draw first so an overlaid sleeve makes depth legible. */}
    <TwoStroke d={farLeg} outer={10} inner={5.8} fill={colors.pants}/>
    <TwoStroke d={farArm} outer={12} inner={8} fill={torsoColor}/>
    {/* Ifverse's characteristic red hood behind a simple circular head. */}
    {role==='red-hoodie'?<g>
      <path d="M-18 -181Q-39 -176 -32 -135L-31 -79L-9 -82L-8 -163Z"
        fill={colors.coralShade}/>
      <path d="M-18 -171Q-29 -157 -27 -129" fill="none"
        stroke={colors.coralLight} strokeWidth="2.3" opacity=".6"/>
    </g>:null}
    <path d="M-18 -168Q-7 -174 14 -166L18 -75Q0 -68 -17 -75Z"
      fill={torsoColor} stroke={isCap?colors.ink:dark} strokeWidth={2.8}
      strokeLinejoin="round"/>
    {role==='red-hoodie'?<g>
      <path d="M-5 -160L-4 -135M6 -159L7 -135" stroke={colors.cream}
        strokeWidth="2.2" opacity=".9" strokeLinecap="round"/>
      <path d="M-14 -82Q0 -85 15 -82" fill="none" stroke={colors.coralLight}
        strokeWidth="1.6" opacity=".6"/>
      <path d="M15 -159L17 -76" stroke={colors.coralShade} strokeWidth="3"
        opacity=".8"/>
    </g>:null}
    {role==='blue-shirt'||role==='pink-shirt'?<path d="M0 -160V-80"
      stroke={colors.ink} strokeWidth="2" opacity=".45"/>:null}
    <TwoStroke d={nearLeg} outer={11} inner={6.2} fill={colors.pants}/>
    {gesture!=='sit'?<g stroke={colors.ink} strokeWidth="6" strokeLinecap="round">
      <path d="M-13 0L-20 0"/><path d="M13 0L21 0"/>
    </g>:null}
    {/* The neck is almost invisible in the supplied frames. */}
    <rect x="-5" y="-181" width="10" height="16" rx="4" fill={colors.ink}/>
    <g transform={'translate('+faceShift+' -204) rotate('+headTilt+')'}>
      <circle cx="0" cy="0" r="37" fill={colors.ink}/>
      {/* The thin warm upper/side rim, NOT a broad cartoon outline. */}
      <path d="M-36 4Q-39 -27 -10 -36Q10 -41 28 -25"
        fill="none" stroke={colors.warm} strokeWidth={3.3}
        strokeLinecap="round" opacity={role==='yellow-cap'?.95:.84}/>
      <EyeFace emotion={emotion} facing={facing}/>
      {isCap?<g>
        <path d="M-36 -17Q-34 -53 6 -54Q37 -53 41 -21L39 -13
          Q2 -21 -36 -17Z" fill={colors.cap} stroke="#B78C39" strokeWidth="2"/>
        <path d="M-30 -23Q0 -35 33 -23Q6 -10 -50 -13L-54 -18Z"
          fill={colors.capLight} stroke="#C4932E" strokeWidth="1.6"/>
        <path d="M-23 -42Q2 -53 25 -38" stroke="#FFF2A3"
          strokeWidth="2.4" fill="none" strokeLinecap="round"/>
      </g>:null}
    </g>
    <TwoStroke d={nearArm} outer={13} inner={9}
      fill={torsoColor} highlight={role==='red-hoodie'?colors.coralLight:undefined}/>
    {gesture==='point'?<g transform={'translate('+handX+' '+handY+')'}>
      <path d={'M0 0l'+(14*flip)+' -2'} fill="none"
        stroke={colors.cream} strokeWidth={5} strokeLinecap="round"/>
    </g>:gesture==='wave'?<ellipse cx={handX} cy={handY} rx={5} ry={6}
      fill={colors.cream}/>:null}
  </g>;
};
/** Original setting, not a source frame or bitmap. */
const Stage:React.FC=()=><g>
  <defs>
    <linearGradient id="matchBg" x1="0" y1="0" x2="0" y2="1">
      <stop stopColor="#302132"/><stop offset=".55" stopColor="#241A2A"/>
      <stop offset="1" stopColor="#141724"/>
    </linearGradient>
    <linearGradient id="matchWindow" x1="0" y1="0" x2="0" y2="1">
      <stop stopColor="#DFA076"/><stop offset="1" stopColor="#6D526D"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#matchBg)"/>
  <path d="M0 820H1920V1080H0Z" fill="#302738"/>
  <path d="M0 822H1920" stroke="#453743" strokeWidth="12"/>
  {[240,700,1160,1600].map(n=><g key={n}>
    <rect x={n} y="180" width="320" height="470" rx="9" fill="url(#matchWindow)"
      stroke="#332332" strokeWidth="25"/>
    <path d={'M'+(n+150)+' 180V650M'+n+' 450H'+(n+320)}
      stroke="#483440" strokeWidth="17"/>
  </g>)}
  <path d="M0 120H1920" stroke="#261B2B" strokeWidth="55"/>
  <path d="M0 675H1920" stroke="#1B1722" strokeWidth="39"/>
  <path d="M0 830H1920" stroke="#795E65" strokeWidth="6" opacity=".45"/>
</g>;
const Caption:React.FC<{title:string;sub:string}>=({title,sub})=><g>
  <rect x="84" y="79" width="1050" height="125" rx="14"
    fill="#151521" opacity=".85"/>
  <path d="M99 104V178" stroke={colors.coral} strokeWidth="6"/>
  <text x="129" y="133" fontFamily="Arial,sans-serif"
    fontSize="42" fontWeight="800" fill={colors.cream}>{title}</text>
  <text x="129" y="177" fontFamily="Arial,sans-serif" fontSize="27"
    fill="#B7A5A9">{sub}</text>
</g>;
export const ReferenceCharacterSheet:React.FC=()=>{
  return <svg viewBox="0 0 1920 1080" width="100%" height="100%">
    <Stage/>
    {([
      {x:285,role:'red-hoodie',gesture:'stand',facing:'right',emotion:'smile'},
      {x:690,role:'red-hoodie',gesture:'point',facing:'right',emotion:'smile'},
      {x:1085,role:'yellow-cap',gesture:'wave',facing:'right',emotion:'neutral'},
      {x:1490,role:'blue-shirt',gesture:'stand',facing:'front',emotion:'shock'},
    ] as const).map((c,i)=><React.Fragment key={i}>
      <RefCharacter {...c} y={810} scale={2.2} armProgress={1}/>
      <rect x={c.x-105} y={857} width="210" height="55" rx="9"
        fill="#151925" opacity=".8"/>
      <text x={c.x} y={892} textAnchor="middle" fontFamily="Arial,sans-serif"
        fontSize="24" fill={colors.cream}>{['RED / SIDE','RED / REACH','CAP / WAVE','FACE / SHOCK'][i]}</text>
    </React.Fragment>)}
    <Caption title="IFVERSE CHARACTER MATCH — SVG"
      sub="Direct visual study: black circular head · narrow limbs · flat hoodie/cap"/>
  </svg>;
};
const a=(f:number,start:number,end:number)=>ease((f-start)/(end-start));
export const ReferenceCharacterMotion:React.FC=()=>{
  const f=useCurrentFrame();
  const point=a(f,49,91);
  const surprise=a(f,103,126);
  const close=a(f,145,175);
  const eye:RefMood=surprise>.6?'shock':'neutral';
  // One shared camera for the whole world: objects do not drift separately.
  const camera='translate('+(-60*close)+' '+(32*close)+') scale('+(1+.17*close)+')';
  return <svg viewBox="0 0 1920 1080" width="100%" height="100%">
    <g transform={camera}>
      <Stage/>
      <RefCharacter x={670} y={807} scale={2.2}
        role="red-hoodie" emotion="smile" facing="right"
        gesture={point>.01?'point':'stand'} armProgress={point}
        headTilt={-4*point}/>
      <RefCharacter x={1275} y={807} scale={2.2}
        role="yellow-cap" facing="left" emotion={eye}
        gesture={surprise>.15?'wave':'stand'} headTilt={-6*surprise}/>
    </g>
    <Caption title="CHARACTER APPEARANCE TEST"
      sub="6 seconds · black circle heads · simplified arms · reference proportions"/>
  </svg>;
};
