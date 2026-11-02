import React from 'react';
import {
  defineEpisode, Timeline, ShotMap, ShotProps, Hero, LOOKS, basePose, faceAt,
  camT, kf, clamp, easeOut, ChanceStreet, ChanceCave, ChancePanel,
  ProbabilityTruck, RockBurst, FocusRings, Sparkle, FONT
} from '../../engine';
import {S1 as COIN, S2 as REACTION, S3 as PROTECTION, S4 as WALK, S5 as CRACK, S6 as FALL} from './quality-test';

/**
 * 25-second story-first cut, composed around the six tested shots.
 * Original rig, original Episode engine, original camera/lighting kit.
 * The earlier 39-second cut and 13-second quality test are left intact.
 * Silent previsualization only; script lines are editorial, NOT aligned speech.
 */
const C={cream:'#F7EDE2',mint:'#69E5C4',gold:'#FFD17C',red:'#FF6176',
  muted:'#BCD2E1',night:'#0C1325'};
const ease=(x:number)=>{const a=clamp(x);return a*a*(3-2*a);};
const word=(t:string,y:number,size=67,color=C.cream)=><text x="540" y={y}
  fontFamily={FONT.title} fontWeight={800} fontSize={size} letterSpacing={1}
  fill={color} textAnchor="middle">{t}</text>;
const Camera:React.FC<{x?:number;y?:number;z?:number;children:React.ReactNode}>=
  ({x=540,y=960,z=1,children})=><g transform={camT(x,y,z,540,960)}>{children}</g>;
const Person:React.FC<{
  x:number;y:number;s:number;t:number;state:'buried'|'terrified'|'launched'|'stunned';
}>=({x,y,s,t,state})=>{
 const p={
   ...basePose,x,y,scale:s,
   tilt:state==='buried'?47:state==='stunned'?12:state==='launched'?-28:25,
   spin:state==='launched'?kf(t,[[0,23],[59,100]]):state==='buried'?70:0,
   headTilt:state==='buried'?-21:state==='terrified'?13:-7,
   armL:state==='launched'?{a:144,b:-20}:state==='stunned'?{a:110,b:-7}:{a:154,b:-26},
   armR:state==='launched'?{a:142,b:15}:state==='stunned'?{a:137,b:10}:{a:138,b:21},
   legL:state==='launched'?{a:64,b:-25}:state==='buried'?{a:44,b:-38}:{a:22,b:-10},
   legR:state==='launched'?{a:-49,b:33}:state==='buried'?{a:-52,b:34}:{a:-29,b:17},
   expr:(state==='buried'?'worried':'shock') as typeof basePose.expr,
   blink:0,look:state==='terrified'?.5:-.4,sway:state==='launched'?35:4,
   glint:0
 };
 return <Hero look={LOOKS.pipHood} pose={{...p,...faceAt(t,[[0,p.expr]])}}
   rimId={state==='terrified'||state==='stunned'?'rimRed':'rimBlueL'} shadow={0}/>;
};

const BURIED:React.FC<ShotProps>=({t})=><g>
  <Camera x={540+kf(t,[[0,-27],[59,24]])} y={1090} z={1.07+.08*ease(t/59)}>
    <ChanceCave t={t}/>
    <path d="M0 215 L255 310 L510 115 L720 480 L1080 160"
      fill="none" stroke="#BCCCDD" strokeWidth={4} opacity=".16"/>
    <ellipse cx={530} cy={1650} rx={255} ry={51} fill="#06101F" opacity=".38"/>
    <path d="M180 1550 L570 1405 L830 1630 L795 1710 L310 1780 Z"
      fill="#596A80" stroke="#8D9BAD" strokeWidth={10}/>
    <path d="M580 1396 L690 1260 L830 1400 L802 1580 L686 1625"
      fill="#78879B" stroke="#A3B0C1" strokeWidth={8}/>
    {/* Keep his face legible, while surrounding the feet with foreground debris. */}
    <Person x={520} y={1515} s={1.63} t={t} state="buried"/>
    <path d="M100 1750 L440 1660 L720 1800 L865 1960 H0Z" fill="#46546A" opacity={.66}/>
    {Array.from({length:20},(_,i)=>{
      const x=(i*73+t*.55)%1030,y=800+(i*179+t*1.5)%860;
      return <circle key={i} cx={x} cy={y} r={1.8+(i%3)}
        fill="#DDE6ED" opacity={.14+.05*(i%3)}/>;
    })}
  </Camera>
  <ChancePanel y={400} label="DEATH PROBABILITY" value="0%" color={C.mint} t={t}/>
  <rect x="190" y="755" width="700" height="74" rx="14" fill="#091F32" opacity=".92"/>
  {word("CAN'T DIE.",810,53,C.cream)}
</g>;

/** Odds aren't just text: exactly one highlighted square in a 10 x 10 sample space. */
const ODDS:React.FC<ShotProps>=({t})=><g>
 <Camera x={540} y={1040} z={1.02}>
   <ChanceCave t={t}/>
   <rect width={1080} height={1920} fill="#080F1E" opacity=".84"/>
   <Person x={775} y={1680} s={.94} t={t} state="terrified"/>
 </Camera>
 {word("ESCAPE CHANCE",350,73)}
 <rect x="135" y={430} width="810" height="194" rx={28}
  fill="#10273D" stroke={C.gold} strokeWidth={6}/>
 {word("1%",566,139,C.gold)}
 {Array.from({length:100},(_,i)=>{
    const col=i%10,row=Math.floor(i/10);
    const x=175+col*74,y=720+row*70,active=i===37;
    const appear=ease((t-i*.23)/27);
    return <rect key={i} x={x} y={y} width={50} height={47} rx={6}
      fill={active?C.gold:'#30465C'} stroke={active?'#FFF1C1':'#53677C'}
      strokeWidth={active?5:1.7} opacity={appear*.95}/>;
 })}
 {word("JUST 1 IN 100",1565,62,C.gold)}
 <path d="M145 1635 H935" stroke="#7E9AB2" opacity=".37" strokeWidth={3}/>
</g>;

/** The entire point of the ending: the active probability slot overwrites 0% protection. */
const SWITCH:React.FC<ShotProps>=({t})=><g>
 <Camera x={540} y={1055} z={1.045}>
    <ChanceCave t={t}/>
    <rect width="1080" height="1920" fill="#060C1A" opacity=".68"/>
    <Person x={540} y={1680} s={1.06} t={t} state="terrified"/>
 </Camera>
 {word("ONE ACTIVE CHANCE",320,65,C.cream)}
 <ChancePanel label="DYING" value="0%" y={450} color={C.mint} active={t<29} t={t}/>
 <ChancePanel label="ESCAPE" value={Math.round(1+99*ease((t-9)/32))+'%'}
    y={870} color={C.gold} active={t>=29} t={t}/>
 <g opacity={ease((t-25)/10)}>
  <path d="M100 600 L975 665" stroke={C.red} strokeWidth={20} strokeLinecap="round"/>
  {word("PROTECTION LOST",1300,60,C.red)}
  <rect x={255} y={1710} width={575} height={93} rx={18} fill="#8D2A44" opacity=".8"/>
  {word("OVERRIDE",1775,59,C.cream)}
 </g>
</g>;

const BURST:React.FC<ShotProps>=({t})=>{
 const launch=ease((t-7)/49),px=530+125*launch,py=1700-800*launch;
 return <g>
 <Camera x={540+kf(t,[[0,0],[58,-25]])} y={1150-75*launch}
   z={1.0+.06*launch}>
   <ChanceStreet t={t} id="premium-escape" rain crack={1} pit={1}/>
   <path d="M345 1820 L540 1235 L705 1900Z" fill="#E3CA9D" opacity={.09*(1-launch)}/>
   <g opacity={.7}>
     <RockBurst t={t-4} x={545} y={1455} size={1.2}/>
     {Array.from({length:16},(_,i)=>{
       const ang=i*2.39, r=ease((t-i%5*2)/50)*(145+(i%7)*40);
       const x=535+Math.cos(ang)*r,y=1460+Math.sin(ang)*r;
       return <path key={i} d={'M'+(x-17)+' '+(y-19)+' l43 -14 l27 38 l-49 22Z'}
          fill={i%2?'#5A697E':'#8A97A9'} stroke="#1B2639" strokeWidth={4}
          transform={'rotate('+(t*3.6+i*44)+' '+x+' '+y+')'}/>;
     })}
   </g>
   <Person x={px} y={py} s={1.5-.25*launch} t={t} state="launched"/>
   <g opacity={.55*(1-launch)}>
    <path d="M335 1660 Q535 1300 760 1620" stroke="#FFE0B3" strokeWidth={19} fill="none"/>
   </g>
 </Camera>
 {t>42&&<g opacity={ease((t-42)/9)}>
    <rect x={158} y={185} width={764} height={127} rx={25} fill="#10382F" stroke={C.mint} strokeWidth={4}/>
    {word("ESCAPE · 100%",273,67,C.mint)}
 </g>}
</g>;
};

/** Clear geography: head-on truck approaching on the same roadway as Pip. */
const TRUCK:React.FC<ShotProps>=({t})=>{
 const r=ease(t/58),cx=1150-420*r,size=.72+1.03*r,cy=1530-355*size;
 const px=380+45*r,py=1200+130*r;
 return <g>
 <Camera x={540+kf(t,[[0,40],[59,-12]])} y={955+kf(t,[[0,0],[59,15]])}
   z={.96+.15*r}>
   <ChanceStreet t={t} id="premium-truck" rain/>
   <ellipse cx={px} cy={1522} rx={140} ry={29} fill="#071322" opacity=".5"/>
   <Person x={px} y={py} s={1.44} t={t} state="stunned"/>
   <g opacity={.4*r}>
     <path d={'M'+(cx-102*size)+' '+(cy+280*size)+' L-100 1920 L610 1920Z'}
       fill="#FFF1BC" opacity=".32"/>
   </g>
   <ProbabilityTruck x={cx} y={cy} t={t} scale={size}/>
   <circle cx={cx-160*size} cy={cy+240*size} r={180+70*r}
     fill={C.gold} opacity={.045+.06*r}/>
 </Camera>
 <rect x="235" y="169" width={610} height={93} rx={16} fill="#4D1B32" stroke={C.red} strokeWidth={4}/>
 {word("NO SHIELD",234,47,C.red)}
</g>;
};
const END:React.FC<ShotProps>=({t})=><g>
 <ChanceStreet t={0} id="premium-freeze"/>
 <Person x={255} y={1300} s={1.63} t={0} state="stunned"/>
 <g opacity={.82}><ProbabilityTruck x={795} y={935} t={0} scale={1.7}/></g>
 <rect width="1080" height="1920" fill="#070D1B" opacity={.52+.30*ease((t-5)/20)}/>
 <g opacity={ease((t-12)/14)}>
   <path d="M128 670 H952 M128 1230 H952" stroke={C.red} strokeWidth={10}/>
   {word("HE GUARANTEED",815,73)}
   {word("HIS ESCAPE.",940,94,C.mint)}
   {word("NOT HIS SURVIVAL.",1086,74,C.red)}
   {word("ONE CHANCE AT A TIME.",1510,41,C.muted)}
 </g>
</g>;

const list=[
  ['COIN',66,'Coin toss · practical tabletop',58,'A coin flip? Guaranteed.'],
  ['REACTION',126,'Reaction · expressive acting',102,'Every single time.'],
  ['PROTECTION',180,'Single death probability',175,'He makes his chance of dying zero.'],
  ['WALK',249,'Night walk · tracked camera',225,'Now he feels invincible.'],
  ['CRACK',312,'Street fracture · stagger',290,'Then the pavement splits beneath him.'],
  ['FALL',390,'Fall into underground cavity',382,'Buried below the street. Still alive.'],
  ['BURIED',450,'Trapped beneath real debris',433,"He can't die, but he can't escape."],
  ['ODDS',510,'One of 100 escape odds',488,'His chance of escaping? One percent.'],
  ['SWITCH',570,'One active setting gets replaced',561,'He changes it to one hundred. Goodbye protection.'],
  ['BURST',630,'Physical explosive escape',620,'The rubble launches him back out.'],
  ['TRUCK',690,'Oncoming truck and shock',681,'Into the path of a truck.'],
  ['END',750,'Pre-impact freeze and conclusion',740,'He guaranteed his escape. Not his survival.']
] as const;
const map:ShotMap={
  COIN,REACTION,PROTECTION,WALK,CRACK,FALL,
  BURIED,ODDS,SWITCH,BURST,TRUCK,END
};
let a=0;
const segments=list.map(([id,b],i)=>{const x={shot:id,a,b,t0:0,t1:b-a};a=b;return x;});
a=0;
const infos=list.map(([id,b,size,key,line],i)=>{
 const obj={id,size,key:key-a,len:b-a,first:a,line,note:'Original hero rig; distinct shot size, staging and motivated action'};
 a=b;return obj;
});
const timeline:Timeline={
  slug:'probability-v2',title:'What If You Could Control Probability? — Cinematic 25s',
  fps:30,total:750,segments,shots:infos,
  fx:[
    {f:275,kind:'shake',len:18,amp:5},
    {f:303,kind:'shake',len:17,amp:12},
    {f:580,kind:'shake',len:20,amp:9},
    {f:601,kind:'flash',color:'#FFE3B2',o:.52},
    {f:688,kind:'flash',color:'#FFFFFF',o:.19}
  ],audio:{}
};
export const probabilityControlV2=defineEpisode('ProbabilityControlV2',{
  timeline,shots:map,width:1080,height:1920,bg:C.night,
  grain:true,vignette:true
});
