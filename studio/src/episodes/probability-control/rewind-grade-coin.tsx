import React from 'react';
import {
  defineEpisode, Timeline, ShotProps, ShotMap,
  Study, Desk, Hero, LOOKS, basePose, poseAt, joints, toWorld,
  faceAt, camT, kf, easeOut, easeIn, clamp, rnd, Glow, Foreground,
  FocusRings, Sparkle, S3, FONT
} from '../../engine';

/**
 * Quality proof, not a final episode.
 * Directly follows the studied Rewind shots: detailed Study/Desk set, real
 * arm/prop continuity, a motivated desk insert, then a character reaction.
 * A new coin prop and story; original Rewind/CopyPaste files unchanged.
 * All three shots use the real Episode clock at 30 fps, portrait 1080x1920.
 */
const T = { ink:'#141120', cream:'#F5E9D7', soft:'#D2BCCA', gold:'#FFD384',
  orange:'#F2A257', teal:'#8FF7E7' };
const cut = (t:number,a:number,b:number) => clamp((t-a)/(b-a));
const wiggle = (t:number,start:number)=> t<start?0:
  Math.sin((t-start)*1.2)*Math.exp(-(t-start)/9);
const copy=(str:string,x:number,y:number,size:number,color=T.cream,align:'middle'|'start'='middle')=>
  <text x={x} y={y} fill={color} textAnchor={align}
    fontFamily={FONT.title} fontWeight={850} fontSize={size} letterSpacing={1.3}>{str}</text>;

const Coin:React.FC<{
  x:number;y:number;r?:number;flip?:number;scale?:number;shadow?:boolean;
}>=({x,y,r=0,flip=0,scale=1,shadow=false})=>{
  const visible=Math.max(.09,Math.abs(Math.cos(flip)));
  return <g transform={'translate('+x+' '+y+') rotate('+r+') scale('+scale+')'}>
    {shadow&&<ellipse cy="55" rx={47} ry={13} fill="#090911" opacity=".36"/>}
    <g transform={'scale('+visible+' 1)'}>
      <ellipse rx="42" ry="44" fill="#B76E27" stroke="#4F2C20" strokeWidth={6}/>
      <ellipse cx="-4" cy="-5" rx="38" ry="39" fill="#FFD986" stroke="#FBE9A3" strokeWidth={5}/>
      <ellipse cx="-4" cy="-5" rx="29" ry="29" fill="#ECB65F" stroke="#F7D78E" strokeWidth={3}/>
      <path d="M-15 -18 V14 M15 -18 V14 M-15 -3 H15" stroke="#865020"
        strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M-26 -25 Q-9 -39 10 -30" fill="none" stroke="#FFF2BC" strokeWidth={4} opacity=".66"/>
    </g>
    <path d="M-42 2 Q0 9 42 2" stroke="#FFF5C1" strokeWidth={3}
      fill="none" opacity={1-visible}/>
  </g>;
};

/** Near-side out-of-focus framing, similar to Rewind Sh1. */
const Near:React.FC=()=><Foreground blur={10}>
 <path d="M-250 1420 Q-160 1100 -15 1060 Q250 1010 300 1300
   L330 2300 H-400Z" fill="#130E1B" opacity=".96"/>
 <path d="M1430 1420 Q1620 1060 1780 1020 L2400 1120 V2300 H1400Z"
   fill="#141019" opacity=".75"/>
 <path d="M-40 1090 Q160 1080 290 1250" stroke="#D69D6E"
   opacity=".22" fill="none" strokeWidth={8}/>
 </Foreground>;

/** A real coin remains in Pip's right hand until the toss. */
const A:React.FC<ShotProps>=({t})=>{
 const keys=[
  {f:0,p:{x:970,y:725,scale:1.25,yaw:.42,
      armR:{a:97,b:-32},armL:{a:22,b:-8},headTilt:-8,look:.5}},
  {f:13,p:{armR:{a:130,b:-15},headTilt:-4,tilt:-2}},
  {f:26,p:{armR:{a:157,b:-22},headTilt:10,tilt:-7,sway:7},ease:easeOut},
  {f:42,p:{armR:{a:133,b:-9},headTilt:-13,tilt:3}},
  {f:54,p:{armR:{a:102,b:-11},headTilt:-15}}
 ];
 const pose=poseAt(t,keys,basePose);
 const armPose=poseAt(26,keys,basePose);
 const joint=joints(pose).armR.end;
 const hand=toWorld(pose,joint);
 const origin=toWorld(armPose,joints(armPose).armR.end);
 const release=t>=26;
 const dt=t-26;
 const cx=release?origin.x+2.8*dt:hand.x;
 const cy=release?origin.y-11*dt+dt*dt*.20:hand.y;
 const turn=release?dt*.29:0;
 const camera=camT(960+kf(t,[[0,24],[54,56]]),582+kf(t,[[0,10],[54,-36]]),
   kf(t,[[0,1.37],[54,1.52]]),540,960);
 return <g>
  <g transform={camera}>
    <Study t={t} id="coinStudyWide" veil={.26}/>
    <Hero look={LOOKS.pipHood}
      pose={{...pose,...faceAt(t,[[0,'neutral'],[12,'smug'],[34,'shock']])}}
      rimId="rimR" shadow={.4}/>
    <Coin x={cx} y={cy} flip={turn} scale={.69}/>
    <Desk x0={560} x1={1360} y={700}/>
    <Near/>
  </g>
  <g opacity={cut(t,4,12)}>
    {copy('WHAT IF YOU COULD',94,179,49,T.soft,'start')}
    {copy('CONTROL THE ODDS?',94,262,63,T.gold,'start')}
    <path d="M94 286 H760" stroke={T.orange} strokeWidth={5} opacity=".68"/>
  </g>
 </g>;
};

/**
 * A direct, deliberate adaptation of Rewind Sh2's high-angle desk cut.
 * The coin is tracked as one coherent prop: tossed above the desk, rotates,
 * lands, bounces, then settles. Light and contact shadow stay attached.
 */
const B:React.FC<ShotProps>=({t})=>{
 const EDGE=645;
 const land=26;
 const x=kf(t,[[0,1100],[land,1109],[52,1092]]);
 const y=t<land?340+185*easeIn(t/land):
   t<40?525-46*Math.sin(Math.PI*(t-land)/14)*Math.exp(-(t-land)/19):525;
 const spin=t<40?t*.29:0;
 const squash=t>=26? 1-.13*Math.exp(-(t-26)/7)*Math.cos((t-26)*.9):1;
 const camera=camT(kf(t,[[0,1020],[52,1070]]),
   kf(t,[[0,426],[52,468]]),kf(t,[[0,1.36],[52,1.48]]),540,960);
 return <g>
 <g transform={camera}>
  {/* Far floor, with practical cast shadow and original Rewind floor perspective. */}
  <g filter="url(#blur3)">
   <rect x={-450} y={EDGE} width={2800} height={1400} fill="#33252D"/>
   {Array.from({length:32},(_,i)=>{
      const xx=-470+i*95;
      return <path key={i} d={'M'+xx+' '+EDGE+' L'+(960+(xx-960)*1.65)+' 1800'}
       stroke="#241A23" strokeWidth={4} opacity=".55"/>;
   })}
   <rect x="1250" y={EDGE+18} width={350} height={260} fill="#4A3431"/>
   {[0,1,2].map(i=><rect key={i} x="1260" y={EDGE+32+i*72}
     width="325" height="64" rx={6} fill="#5C423A"/>)}
  </g>
  {/* Tabletop — wood grain converges toward the same vanishing point. */}
  <rect x={-450} y={-500} width={2800} height={EDGE+500} fill="#69493F"/>
  {Array.from({length:34},(_,i)=>{
    const xx=-600+i*105,top=960+(xx-960)*.67;
    return <path key={i} d={'M'+xx+' '+EDGE+' L'+top+' -450'}
      stroke="#523931" strokeWidth={i%3?2.5:4} opacity=".67"/>;
  })}
  <Glow x={1120} y={380} r={610} o={.30}/>
  {/* Laptop, paper, pen, sticky note and lamp: spatially fixed scene props. */}
  <g transform="rotate(-6 550 200)">
    <rect x={295} y={40} width={465} height={295} rx={18} fill="#24212E"/>
    <rect x={305} y={52} width={446} height={13} fill="#9FC0FF" opacity=".58"/>
    {Array.from({length:6},(_,i)=>Array.from({length:12},(_,j)=>
      <rect key={i+'-'+j} x={323+j*33} y={96+i*33}
       width={26} height={24} rx={4} fill="#34313C"/>))}
    <rect x={450} y={267} width={160} height={56} rx={8} fill="#302C37"/>
  </g>
  <Glow x={540} y={90} r={250} kind="cool" o={.22}/>
  <g transform="rotate(8 1430 260)">
    <rect x="1270" y={150} width={360} height={300} rx={8} fill="#E8DFC9"/>
    {[0,1,2,3,4,5].map(i=><path key={i} d={'M1300 '+(195+i*37)+' H1600'}
      stroke="#BAC6CE" strokeWidth={3}/>)}
    <path d="M1390 410 L1584 388" stroke="#384966" strokeWidth={11} strokeLinecap="round"/>
  </g>
  <rect x={780} y={545} width={95} height={91} fill="#E9BF71" transform="rotate(-9 826 590)"/>
  <path d="M1525 -300 L1660 100" stroke="#1A1824" strokeWidth={18}/>
  <circle cx={1660} cy={100} r={65} fill="#1E1A28"/>
  {/* Layered contact shadow gets sharper as the coin approaches the desk. */}
  <ellipse cx={x+17} cy={y+17} rx={90} ry={27} fill="#2D1A16"
    opacity={.11+.31*cut(t,10,28)}/>
  <ellipse cx={x+9} cy={y+27} rx={57} ry={13} fill="#120A0B"
    opacity={.0+.27*cut(t,18,27)}/>
  <g transform={'scale(1 '+squash+')'}>
   <Coin x={x} y={y/squash} flip={spin} scale={1.5}/>
  </g>
  <g opacity={cut(t,27,34)}>
    <FocusRings x={x} y={525} t={t-26} r0={100} color={T.gold}/>
    <Sparkle x={x+134} y={y-40} t={t-30} s={1.1}/>
  </g>
  <path d={'M-450 '+EDGE+' H2350'} stroke="#A17B64" strokeWidth={18}/>
  <path d={'M-450 '+(EDGE+16)+' H2350'} stroke="#281C20" strokeWidth={36}/>
 </g>
 <g opacity={cut(t,37,44)}>
   <rect x="133" y="250" width="812" height="125" rx={22}
     fill="#1F1B2C" stroke={T.gold} strokeWidth={4}/>
   {copy('HEADS · 100%',540,337,76,T.gold)}
 </g>
 </g>;
};

/** Rewind-style reaction: expressive face, follow-through, linked rim light. */
const C:React.FC<ShotProps>=({t})=>{
 const pose=poseAt(t,[
  {f:0,p:{x:952,y:727,scale:1.38,yaw:.42,
    headTilt:5,armR:{a:70,b:-5},armL:{a:22,b:-10}}},
  {f:12,p:{armR:{a:140,b:-35},armL:{a:130,b:14},
    headTilt:-8,tilt:-6,sway:14},ease:easeOut},
  {f:30,p:{armR:{a:128,b:-16},armL:{a:132,b:7},
    headTilt:6,tilt:2,sway:-4}},
  {f:43,p:{armR:{a:112,b:-12},armL:{a:109,b:12},sway:0}},
 ]);
 return <g>
 <g transform={camT(kf(t,[[0,980],[44,962]]),kf(t,[[0,560],[44,537]]),
   kf(t,[[0,1.65],[44,1.85]]),540,960)}>
  <Study t={t+110} id="coinStudyReaction" veil={.31}/>
  <Hero look={LOOKS.pipHood}
    pose={{...pose,...faceAt(t,[[0,'shock'],[7,'happy']]),glint:.22,glintColor:T.gold}}
    rimId="rimR" shadow={.18}/>
  <Desk x0={560} x1={1360} y={700}/>
  <Coin x={1155} y={681} scale={.80} shadow/>
  <Glow x={1155} y={666} r={145} o={.3}/>
  <Near/>
 </g>
 <g opacity={cut(t,3,11)}>
  {copy('100%',540,285,135,T.gold)}
  {copy('EVERY SINGLE TIME.',540,366,39,T.cream)}
  <path d="M190 407 H890" stroke={T.gold} strokeWidth={4} opacity=".43"/>
 </g>
 </g>;
};

/** A fully isolated proof: no reference to old ProbabilityControl scenes. */
const cuts=[
 {shot:'TOSS',a:0,b:55,t0:0,t1:55},
 {shot:'LANDING',a:55,b:108,t0:0,t1:53},
 {shot:'RESULT',a:108,b:150,t0:0,t1:42}
];
const tl:Timeline={
 slug:'probability-rewind-grade',
 title:'What If Probability — Rewind Grade 5s Scene Proof',
 fps:30,total:150,segments:cuts,
 shots:[
  {id:'TOSS',size:'medium hero and desk',key:31,len:55,first:0,line:'He can control the odds.',note:'Original study / hero / desk, wrist-anchored coin'},
  {id:'LANDING',size:'overhead extreme close',key:47,len:53,first:55,line:'A coin toss. Guaranteed heads.',note:'Original Rewind high-angle desk technique and physical bounce'},
  {id:'RESULT',size:'medium close reaction',key:23,len:42,first:108,line:'Every single time.',note:'Character follow-through, motivated push-in'}
 ],
 fx:[{f:83,kind:'shake',len:5,amp:2},{f:110,kind:'flash',color:'#FFF2C7',o:.2}],
 audio:{}
};
const shots:ShotMap={TOSS:A,LANDING:B,RESULT:C};
export const rewindGradeCoin=defineEpisode('RewindGradeCoin',{timeline:tl,
 shots,width:1080,height:1920,grain:true,vignette:true,bg:'#211B28'});
