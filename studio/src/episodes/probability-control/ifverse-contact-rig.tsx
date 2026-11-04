import React from 'react';

/**
 * CONTACT PREVIEW RIG — extends the preserved appearance study and supplied reference
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
  armProgress?:number;headTilt?:number;blink?:number;
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
const EyeFace:React.FC<{emotion:RefMood;facing:RefFacing;blink:number}>=({emotion,facing,blink})=>{
  if(blink>.5)return <g stroke={colors.cream} strokeWidth="3" strokeLinecap="round"><path d="M-15 -7h9M6 -7h9"/><path d="M-7 11h14"/></g>;
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
      emotion==='neutral'?<path d="M7 10h12" stroke={colors.cream} strokeWidth="3" strokeLinecap="round"/>:
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
      emotion==='neutral'?<path d="M-8 11h16" stroke={colors.cream} strokeWidth="3" strokeLinecap="round"/>:
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
  facing='right',armProgress=0,headTilt=0,blink=0
})=>{
  const isCap=role==='yellow-cap';
  const torsoColor=role==='red-hoodie'?colors.coral:isCap?colors.ink:
    role==='blue-shirt'?colors.blue:colors.pink;
  const dark=role==='red-hoodie'?colors.coralShade:colors.ink;
  const faceShift=facing==='front'?0:4;
  const flip=1;
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
  const waveNear='M16 -159L49 -195L72 -235';
  const handX=gesture==='wave'?mix(19,64,armSwing):gesture==='point'?mix(19,84,armSwing):19;
  const handY=gesture==='wave'?mix(-84,-215,armSwing):gesture==='point'?mix(-84,-134,armSwing):-84;
  // Fixed-length two-bone arm: the wrist moves, the sleeve cannot stretch.
  const dx=handX-16,dy=handY+159,d=Math.hypot(dx,dy),length=40;
  if(d>length*2)throw new Error('Contact preview wrist is unreachable');
  const h=Math.sqrt(length*length-d*d/4);
  const ex=16+dx/2-dy/d*h,ey=-159+dy/2+dx/d*h;
  const nearArm='M16 -159L'+ex+' '+ey+'L'+handX+' '+handY;
  return <g transform={'translate('+x+' '+y+') scale('+scale+') scale('+(facing==='left'?-1:1)+' 1)'}>
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
    {/* Expose a narrow neck between the jaw and collar, including in profile. */}
    <path d="M-5 -192L5 -192L6 -164Q0 -159 -6 -164Z" fill={colors.ink}/>
    <path d="M-4 -181L-4 -173" fill="none" stroke={colors.warm}
      strokeWidth="1.5" strokeLinecap="round" opacity=".7"/>
    <path d="M-12 -168Q0 -158 12 -168" fill="none"
      stroke={role==='red-hoodie'?colors.coralLight:'#64535A'}
      strokeWidth="2.5" strokeLinecap="round"/>
    <g transform={'translate('+faceShift+' -218) rotate('+headTilt+')'}>
      <circle cx="0" cy="0" r="37" fill={colors.ink}/>
      {/* The thin warm upper/side rim, NOT a broad cartoon outline. */}
      <path d="M-36 4Q-39 -27 -10 -36Q10 -41 28 -25"
        fill="none" stroke={colors.warm} strokeWidth={3.3}
        strokeLinecap="round" opacity={role==='yellow-cap'?.95:.84}/>
      <EyeFace emotion={emotion} facing={facing==='left'?'right':facing} blink={blink}/>
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
      <ellipse rx={4} ry={5} fill={colors.cream}/>
    </g>:gesture==='wave'?<ellipse cx={handX} cy={handY} rx={5} ry={6}
      fill={colors.cream}/>:<ellipse cx={handX} cy={handY} rx={4} ry={5} fill={colors.cream}/>}
  </g>;
};
/** Original setting, not a source frame or bitmap. */
export const Stage:React.FC=()=><g>
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
