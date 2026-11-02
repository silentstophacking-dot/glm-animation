import React from 'react';
import {
  ShotProps, Hero, LOOKS, basePose, poseAt, faceAt, camT, kf, clamp, easeOut,
  FocusRings, Sparkle, HudChip, Schematic, CountUp, DrawOn, Foreground,
  NightSky, PC, ProbabilityStreet, ProbabilityCoin, ProbabilityLottery,
  ChancePanel, ProbabilityTruck, RockBurst, ProbabilityCave,
  ChanceRoom, ChanceDesk, ChanceKiosk, ChanceOverlook, ChanceStreet, ChanceCave
} from '../../engine';

/** Original rig, original pose interpolation, same character in every shot. */
const pip=(t:number, keys:Parameters<typeof poseAt>[1], expressions:Parameters<typeof faceAt>[1]=[[0,'neutral']],
 rim='rimBlue')=>{
 const pose=poseAt(t,keys,{...basePose,x:550,y:1280,scale:1.4});
 const face=faceAt(t,expressions);
 return <Hero pose={{...pose,...face,glint:0.13,glintColor:PC.mint}}
   look={LOOKS.pipHood} rimId={rim} shadow={0.55}/>;
};
const copy=(text:string,y:number,size=68,color=PC.text)=>
 <text x="540" y={y} fill={color} textAnchor="middle" fontFamily="Arial, sans-serif"
  fontWeight={800} fontSize={size} letterSpacing={1}>{text}</text>;
const portraitCamera=(cx:number,cy:number,zoom:number)=>
 camT(cx,cy,zoom,540,960);
const BG=({t}:{t:number})=><g>
 <NightSky id="pc-sky-bg" x0={-300} y0={-250} w={1650} h={2450} horizonY={1470}/>
 <rect x="0" y="1530" width="1080" height="440" fill="#182840"/>
 {Array.from({length:12},(_,i)=><circle key={i}
   cx={70+(i*177)%950} cy={360+(i*149)%950} r={i%3===0?4:2}
   fill={PC.gold} opacity={.15+.20*Math.abs(Math.sin(t*.03+i))}/>)}
 </g>;
const Title=({title,sub}:{title:string;sub?:string})=><g>
 {copy(title,310,77)}
 {sub&&copy(sub,385,37,PC.dim)}
 </g>;
const Shift=({t,cx=540,cy=1050,z=1,children}:{t:number;cx?:number;cy?:number;z?:number;children:React.ReactNode})=>
 <g transform={portraitCamera(cx+kf(t,[[0,9],[60,0]]),cy,z+.035*clamp(t/60))}>{children}</g>;
const FlashOverlay=({t}:{t:number})=><g opacity={clamp((t-5)/8)}>
 <circle cx="540" cy="1060" r={80+Math.min(170,t*10)} fill="none" stroke={PC.mint} strokeWidth={8} opacity={clamp((26-t)/25)}/>
 </g>;

/** S1 – the promise of immortality is the instant hook, shown as a macro UI insert. */
export const S1:React.FC<ShotProps>=({t})=><g>
 <BG t={t}/><Schematic t={t} id="pc-s1"/>
 {copy('CHANCE OF DYING',485,73,PC.text)}
 <ChancePanel label="PROBABILITY" value={String(Math.round(100*(1-easeOut(t/48))))+'%'}
   color={PC.red} y={710} t={t}/>
 <g opacity={clamp((t-40)/12)}>{copy('0% — LOCKED',1270,82,PC.red)}</g>
 <FocusRings t={t-43} x={530} y={865} color={PC.red} r0={150}/>
</g>;

/** S2 – hero believes he has won. */
export const S2:React.FC<ShotProps>=({t})=><g>
 <ChanceRoom t={t}/><Shift t={t} cy={1150} z={1.22}>
  {pip(t,[{f:0,p:{x:540,y:1270,scale:1.45,yaw:.30,armR:{a:18,b:0},expr:'smug'}},
   {f:30,p:{armR:{a:124,b:-22},tilt:-8,headTilt:6}},
   {f:58,p:{armR:{a:102,b:0},tilt:0}}],[[0,'smug'],[39,'happy']],'rimR')}
 </Shift>
 {copy('BIG MISTAKE.',480,103,PC.red)}
 <HudChip f={t} label="0% DEATH" x={115} y={170} icon="dot"/>
</g>;

/** S3 – coin, high-angle insert. */
export const S3:React.FC<ShotProps>=({t})=><g>
 <ChanceDesk t={t}/><Title title="A COIN FLIP" sub="Can you change the odds?"/>
 <g transform={portraitCamera(540,945,kf(t,[[0,1.35],[50,1.6]]))}>
  <ProbabilityCoin x={540} y={900-155*Math.abs(Math.sin(t*.115))} t={t} s={1.8}/>
 </g>
 <ChancePanel y={1460} label="HEADS" value="100%" color={PC.gold} t={t}/>
</g>;

/** S4 – result and human reaction. */
export const S4:React.FC<ShotProps>=({t})=><g>
 <ChanceRoom t={t}/>{copy('HEADS.',405,104,PC.gold)}
 <Shift t={t} cx={530} cy={1180} z={1.12}>
  {pip(t,[{f:0,p:{x:480,y:1240,yaw:.6,scale:1.55,armR:{a:30,b:20}}},
   {f:14,p:{armR:{a:162,b:-20},tilt:-8}},{f:32,p:{armR:{a:145,b:-22},tilt:3}}],
   [[0,'neutral'],[10,'happy']])}
 </Shift>
 <ProbabilityCoin x={785} y={770} t={t+2} s={.62}/>
 <Sparkle x={800} y={740} t={t-17} s={1.5}/>
</g>;

/** S5 – lottery from a sharp macro angle. */
export const S5:React.FC<ShotProps>=({t})=><g>
 <ChanceKiosk t={t}/><Title title="THE LOTTERY" sub="Even the impossible feels easy."/>
 <g transform={portraitCamera(540,915,kf(t,[[0,1.03],[58,1.28]]))}>
  <ProbabilityLottery t={t}/>
 </g>
</g>;

/** S6 – the second satisfying win. */
export const S6:React.FC<ShotProps>=({t})=><g>
 <ChanceKiosk t={t}/>
 <g opacity={.32}>{copy('7 7 7 7',570,182,PC.gold)}</g>
 {pip(t,[{f:0,p:{x:535,y:1390,scale:1.8,yaw:-.25,armL:{a:70,b:0}}},
 {f:18,p:{armL:{a:150,b:0},armR:{a:148,b:0},tilt:-11}},
 {f:35,p:{tilt:0}}],[[0,'shock'],[12,'happy']],'rimR')}
 {copy('WINNER',370,113,PC.gold)}
 <FocusRings x={540} y={930} t={t-5} color={PC.gold} r0={230}/>
 <Sparkle x={790} y={780} t={t-12} s={1.8}/>
</g>;

/** S7 – the title and rule turn, original title-card grammar. */
export const S7:React.FC<ShotProps>=({t})=><g>
 <ChanceOverlook t={t}/>
 <g transform={portraitCamera(540,1040,kf(t,[[0,1],[60,1.12]]))}>
  {pip(t,[{f:0,p:{x:530,y:1330,scale:1.5,yaw:.3}},
  {f:50,p:{look:1,armR:{a:62,b:10}}}],[[0,'smug'],[38,'worried']])}
 </g>
 {copy('WHAT IF YOU COULD',490,67,PC.text)}
 {copy('CONTROL',590,115,PC.mint)}
 {copy('PROBABILITY?',700,92,PC.text)}
</g>;

/** S8 – the single-slot rule, via original schematic kit. */
export const S8:React.FC<ShotProps>=({t})=><g>
 <rect width={1080} height={1920} fill="#0D1726"/>
 <g transform="translate(-450 250)"><Schematic t={t} id="pc-rule-grid"/></g>
 <Title title="ONE ACTIVE CHANCE" sub="New odds replace the old."/>
 <ChancePanel y={560} label="COIN" value="100%" color={PC.gold} active={t<30} t={t}/>
 <ChancePanel y={925} label="LOTTERY" value="100%" active={t>=30} t={t}/>
 <g opacity={clamp((t-29)/8)}>
  <DrawOn d="M90 750 L970 750" t={t-30} dur={10} color={PC.red} width={13}/>
  {copy('OLD SETTING ERASED',1495,54,PC.red)}
 </g>
</g>;

/** S9 – apparent invincibility: use the same single rig and a ring of light. */
export const S9:React.FC<ShotProps>=({t})=><g>
 <ChanceRoom t={t}/><Title title="THE ULTIMATE CHEAT" sub="Make death impossible."/>
 <ChancePanel y={450} label="CHANCE OF DYING"
   value={Math.round(100*(1-easeOut(t/47)))+'%'} t={t}/>
 <circle cx={540} cy={1260} r={245+15*Math.sin(t*.07)}
   stroke={PC.mint} strokeWidth={10} fill={PC.mint} fillOpacity={.045}/>
 {pip(t,[{f:0,p:{x:535,y:1390,scale:1.47,yaw:.4,armR:{a:35,b:0}}},
 {f:35,p:{armR:{a:124,b:-20},expr:'smug'}}],[[0,'neutral'],[32,'smug']])}
</g>;

/** S10 – night city establishing. */
export const S10:React.FC<ShotProps>=({t})=><g>
 <ChanceStreet t={t} id="pc-night-01" rain/>
 <g transform={portraitCamera(540,1220,kf(t,[[0,.85],[60,1.03]]))}>
  {pip(t,[{f:0,p:{x:460,y:1325,scale:1,yaw:.7}},
   {f:60,p:{x:540,armR:{a:38,b:-4}}}],[[0,'neutral'],[50,'worried']])}
 </g>
 <HudChip x={100} y={165} f={t} label="0% DEATH"/>
</g>;

/** S11 – low angle pavement cracks while the hero notices. */
export const S11:React.FC<ShotProps>=({t})=><g>
 <ChanceStreet t={t} id="pc-night-02" rain crack={clamp((t-12)/29)} pit={clamp((t-46)/24)}/>
 <g transform={portraitCamera(560,1340,kf(t,[[0,1.2],[70,1.25]]))}>
  {pip(t,[{f:0,p:{x:530,y:1320,scale:1.1,yaw:.3}},
   {f:25,p:{tilt:10,headTilt:-12,armL:{a:115,b:-15},armR:{a:126,b:9}}}],
   [[0,'neutral'],[20,'shock']],'rimRed')}
 </g>
 <FocusRings x={520} y={1490} t={t-23} color={PC.red}/>
</g>;

/** S12 – wide high-angle fall to the gap. */
export const S12:React.FC<ShotProps>=({t})=><g>
 <ChanceStreet t={t} id="pc-night-03" rain crack={1} pit={1}/>
 <g transform={portraitCamera(540,1400,kf(t,[[0,.97],[58,1.12]]))}>
  {pip(t,[{f:0,p:{x:540,y:1180,scale:1.25,spin:0,armL:{a:136,b:-17},armR:{a:145,b:20}}},
  {f:58,p:{y:2030,scale:.87,spin:75,tilt:32}}],[[0,'shock']],'rimRed')}
 </g>
 <RockBurst x={540} y={1480} t={t-16} size={.65}/>
</g>;

/** S13 – buried but alive, claustrophobic close-up. */
export const S13:React.FC<ShotProps>=({t})=><g>
 <ChanceCave t={t}/>
 <g transform={portraitCamera(530,1350,kf(t,[[0,1.15],[80,1.32]]))}>
  {pip(t,[{f:0,p:{x:540,y:1340,scale:1.35,tilt:25,headTilt:-13,armR:{a:100,b:-10}}},
  {f:55,p:{headTilt:12,armL:{a:45,b:-20}}}],[[0,'shock'],[22,'worried']],'rimBlueL')}
 </g>
 <ChancePanel label="CHANCE OF DYING" value="0%" y={425}/>
</g>;

/** S14 – schematic visualizes one percent as one of a hundred; math fact is defined. */
export const S14:React.FC<ShotProps>=({t})=><g>
 <rect width="1080" height="1920" fill="#0D1726"/>
 <g transform="translate(-420 270)"><Schematic t={t} id="pc-odds-grid"/></g>
 {copy('ESCAPE CHANCE',380,79)}
 <ChancePanel label="ESCAPE" value="1%" y={570} color={PC.gold} t={t}/>
 {Array.from({length:100},(_,i)=><rect key={i} x={132+(i%10)*83} y={1005+Math.floor(i/10)*67}
  width={48} height={41} rx={6} fill={i===37?PC.gold:'#26344A'}
  stroke={i===37?PC.gold:'#40506A'} strokeWidth={2}/>)}
 {copy('1 IN 100',1795,67,PC.gold)}
</g>;

/** S15 – the fatal edit: protection is visibly overwritten. */
export const S15:React.FC<ShotProps>=({t})=><g>
 <ChanceRoom t={t} dim/><Title title="OVERWRITE?" sub="Only one setting can survive."/>
 <ChancePanel y={510} label="DYING" value="0%" color={PC.mint} active={t<23}/>
 <ChancePanel y={885} label="ESCAPE" value={Math.round(1+99*easeOut((t-18)/36))+'%'}
   color={PC.gold} active={t>=23}/>
 {t>=25&&<g>
  <DrawOn d="M95 660 L988 660" t={t-25} dur={9} color={PC.red} width={15}/>
  {copy('PROTECTION REMOVED',1510,59,PC.red)}
 </g>}
</g>;

/** S16 – the cave reacts. */
export const S16:React.FC<ShotProps>=({t})=><g>
 <ChanceCave t={t}/>
 <g transform={portraitCamera(540,1350,kf(t,[[0,1.1],[60,1.25]]))}>
  {pip(t,[{f:0,p:{x:520,y:1390,scale:1.3,tilt:18}},
    {f:33,p:{armL:{a:145,b:-19},armR:{a:149,b:12},tilt:-11,headTilt:15}}],[[0,'worried'],[29,'shock']],'rimRed')}
 </g>
 <RockBurst t={t-18} x={525} y={1440} size={1}/>
 <ChancePanel label="ESCAPE" value="100%" y={430} color={PC.gold}/>
</g>;

/** S17 – propelled upward, a true release rather than a slide cut. */
export const S17:React.FC<ShotProps>=({t})=><g>
 <ChanceStreet t={t} rain crack={1} pit={1} id="pc-daybreak"/>
 <RockBurst t={t} x={540} y={1500} size={1.3}/>
 <g transform={portraitCamera(540,1300,kf(t,[[0,.95],[58,1.1]]))}>
 {pip(t,[{f:0,p:{x:510,y:1650,scale:1.25,spin:-22,armL:{a:145,b:0},armR:{a:130,b:0}}},
 {f:58,p:{x:740,y:485,spin:60,scale:1.14}}],[[0,'shock']],'rimRed')}
 </g>
 {copy('ESCAPE: 100%',330,81,PC.mint)}
</g>;

/** S18 – oncoming headlights; stage clear geography. */
export const S18:React.FC<ShotProps>=({t})=><g>
 <ChanceStreet t={t} rain id="pc-night-final"/>
 {pip(t,[{f:0,p:{x:300,y:1280,scale:1.2,tilt:45,spin:20}},
  {f:54,p:{x:340,y:1400,tilt:-3,spin:0,armL:{a:130,b:10}}}],[[0,'shock']],'rimRed')}
 <g transform={portraitCamera(710,1450,kf(t,[[0,.75],[59,1.02]]))}>
  <ProbabilityTruck x={1450-kf(t,[[0,0],[59,530]])}
    y={1320+kf(t,[[0,0],[59,280]])} t={t} scale={.78+.56*clamp(t/59)}/>
 </g>
 <HudChip f={t} label="SURVIVAL?" x={95} y={175} icon="dot"/>
</g>;

/** S19 – freeze BEFORE impact, preserves the approved dark ending. */
export const S19:React.FC<ShotProps>=({t})=><g>
 <ChanceStreet t={0} id="pc-stop"/>
 <g opacity={.52}><ProbabilityTruck x={735} y={1150} t={0} scale={1.25}/>
  {pip(0,[{f:0,p:{x:420,y:1280,scale:1.22,tilt:-20,expr:'shock'}}],[[0,'shock']],'rimRed')}
 </g>
 <rect width={1080} height={1920} fill="#090A15" opacity={.68}/>
 <path d="M110 640 H970 M110 1200 H970" stroke={PC.red} strokeWidth={9}/>
 {copy('HE GUARANTEED',825,72)}
 {copy('HIS ESCAPE.',935,92,PC.mint)}
 {copy('NOT HIS SURVIVAL.',1080,75,PC.red)}
 {copy('ONE CHANCE AT A TIME',1490,43,PC.dim)}
</g>;
