import React from 'react';
import {
  ShotProps, ShotMap, Pose, Expr, basePose, poseAt, faceAt, joints, toWorld,
  camT, kf, clamp, easeOut, RockBurst, ProbabilityTruck, Glow, rnd,
  FONT
} from '../../engine';
import {ReferenceHero} from '../probability-control/reference-hero';
import {
  StudioWorld, MacroDesk, LotteryWorld, OverlookWorld, StreetWorld,
  CaveWorld, CaveForeground
} from './worlds';
import {LONGFORM_SHOTS,LongformShotId} from './shotplan';

/**
 * 27 directed shots. Every physical scene is under ONE camT transform.
 * The same transform moves the actor, floor, sky, buildings and props.
 * We NEVER fake camera travel by sliding just a background plate.
 *
 * This is production source, not an exported or approved MP4.
 */
const C={ink:'#111421',paper:'#F7EBDD',gold:'#FFD37D',mint:'#72F0D1',
  red:'#FF6776',blue:'#AAC9E5',dark:'#10182A',muted:'#A6B6C9'};
const smooth=(v:number)=>{const x=clamp(v);return x*x*(3-2*x)};

const copy=(value:string,x:number,y:number,size:number,color=C.paper,
  anchor:'start'|'middle'='middle')=><text x={x} y={y}
    fontFamily={FONT.title} fontSize={size} fontWeight={830}
    textAnchor={anchor} fill={color} letterSpacing={1.3}>{value}</text>;

type CameraSetup={a:[number,number,number];b:[number,number,number]};
/** Deliberate per-shot framing. These are moves of the WHOLE WORLD. */
const CAMERA:Record<LongformShotId,CameraSetup>={
  COLD_OPEN:{a:[970,570,1.14],b:[960,630,1.47]},
  BURIED_PROMISE:{a:[965,650,1.55],b:[985,637,1.77]},
  FLASHBACK:{a:[985,528,.88],b:[1045,505,1.06]},
  FIRST_CONSOLE:{a:[970,580,.96],b:[985,545,1.15]},
  COIN_TOSS:{a:[1060,574,1.10],b:[1085,530,1.29]},
  HEADS_RESULT:{a:[970,545,1.14],b:[1010,537,1.37]},
  TEN_HEADS:{a:[990,555,1.10],b:[975,570,1.40]},
  LOTTERY_TEST:{a:[965,535,.88],b:[1005,530,1.05]},
  LOTTERY_WIN:{a:[960,465,1.18],b:[975,463,1.45]},
  EUPHORIA:{a:[975,540,.88],b:[1010,514,1.10]},
  ONE_ACTIVE_RULE:{a:[960,555,.96],b:[960,530,1.06]},
  DEATH_ZERO:{a:[990,525,.96],b:[985,520,1.20]},
  NEAR_MISS:{a:[1040,600,.99],b:[1050,610,1.14]},
  WALK_HOME:{a:[770,555,.88],b:[1210,553,.98]},
  SITE_WARNING:{a:[1110,570,.96],b:[1215,566,1.08]},
  CRACK:{a:[960,665,1.16],b:[975,758,1.36]},
  FALL:{a:[975,690,.88],b:[980,1380,1.08]},
  TRAPPED:{a:[920,680,1.05],b:[947,666,1.24]},
  THE_LIMIT:{a:[955,667,1.23],b:[960,665,1.42]},
  NO_RESCUE:{a:[954,675,1.22],b:[974,670,1.36]},
  ONE_PERCENT:{a:[960,540,1],b:[960,540,1]},
  BAD_CHOICE:{a:[975,650,1.21],b:[956,640,1.46]},
  OVERRIDE_DECISION:{a:[960,540,1],b:[960,540,1]},
  RUBBLE_MOVES:{a:[970,680,1.12],b:[980,620,1.31]},
  LAUNCHED:{a:[975,615,.86],b:[982,406,1.08]},
  HEADLIGHTS:{a:[940,580,.91],b:[1085,595,1.11]},
  PRE_IMPACT:{a:[1030,590,1.0],b:[1030,590,1.0]}
};

const WorldCamera:React.FC<{
 id:LongformShotId;t:number;len:number;children:React.ReactNode
}>=({id,t,len,children})=>{
  const {a,b}=CAMERA[id];
  const p=smooth(t/Math.max(1,len-1));
  const x=a[0]+(b[0]-a[0])*p;
  const y=a[1]+(b[1]-a[1])*p;
  const zoom=a[2]+(b[2]-a[2])*p;
  return <g transform={camT(x,y,zoom,960,540)}>{children}</g>;
};

type Behavior='thinking'|'toss'|'joy'|'warn'|'shield'|'miss'|'walk'|
  'stumble'|'fall'|'buried'|'push'|'fear'|'switch'|'launch'|'frozen';
type Location='study'|'lottery'|'overlook'|'street'|'cave';

const actorBase=(stage:Location,x?:number,y?:number,scale?:number):Pose=>{
 const defaults:Record<Location,[number,number,number]>={
   study:[1010,737,1.04],lottery:[1190,715,.92],
   overlook:[980,766,1.16],street:[890,753,1.04],
   cave:[960,808,1.12]
 };
 const d=defaults[stage];
 return {...basePose,x:x??d[0],y:y??d[1],scale:scale??d[2],
   yaw:.24,armL:{a:14,b:-8},armR:{a:18,b:-10}};
};

const actorPose=(t:number,stage:Location,mode:Behavior,
  x?:number,y?:number,s?:number):Pose=>{
 const from=actorBase(stage,x,y,s);
 const last=Math.max(52,t+1);
 if(mode==='walk'){
   const step=Math.sin(t*.18),shift=t*2.4;
   return {...from,x:from.x+shift,y:from.y+2.5*Math.abs(step),
     yaw:.8,headTilt:2*Math.sin(t*.09),
     legL:{a:24*step,b:-18*Math.max(0,step)},
     legR:{a:-24*step,b:18*Math.min(0,step)},
     armL:{a:20*step,b:-8},armR:{a:-20*step,b:-10},sway:8*step};
 }
 if(mode==='fall'){
   const p=smooth(t/Math.max(1,220));
   return {...from,y:from.y+880*p,x:from.x+70*p,
     scale:from.scale*(1-.28*p),spin:48*p,tilt:25,
     headTilt:-14,armL:{a:147,b:-15},armR:{a:138,b:24},
     legL:{a:49,b:-33},legR:{a:-42,b:24}};
 }
 if(mode==='launch'){
   const p=smooth(t/Math.max(1,205));
   return {...from,y:from.y-850*p,x:from.x+135*p,
     spin:-25+98*p,tilt:20,sway:18,
     armL:{a:155,b:-20},armR:{a:144,b:10},
     legL:{a:48,b:-20},legR:{a:-34,b:17}};
 }
 let keys:{f:number;p:Partial<Pose>}[]=[];
 switch(mode){
   case 'toss': keys=[
     {f:0,p:{armR:{a:78,b:-25},headTilt:10}},
     {f:48,p:{armR:{a:137,b:-17},headTilt:-8,tilt:-5}},
     {f:76,p:{armR:{a:159,b:-8},headTilt:-14,tilt:-9}},
     {f:123,p:{armR:{a:107,b:0},headTilt:5,tilt:3}},
     {f:215,p:{armR:{a:35,b:-12},tilt:0}}];break;
   case 'joy':keys=[
     {f:0,p:{armL:{a:22,b:-10},armR:{a:36,b:-9},headTilt:-2}},
     {f:57,p:{armL:{a:142,b:-18},armR:{a:146,b:14},headTilt:12,tilt:-10}},
     {f:142,p:{armL:{a:138,b:0},armR:{a:120,b:0},tilt:3}},
     {f:210,p:{armL:{a:30,b:-6},armR:{a:38,b:-10}}}];break;
   case 'shield':keys=[
     {f:0,p:{armR:{a:27,b:-12},headTilt:-8}},
     {f:110,p:{armR:{a:122,b:-14},headTilt:4,tilt:-5}},
     {f:250,p:{armR:{a:112,b:-18},headTilt:7}}];break;
   case 'miss':keys=[
     {f:0,p:{yaw:.8,tilt:0}},
     {f:82,p:{tilt:27,headTilt:-14,armL:{a:128,b:-20}}},
     {f:170,p:{tilt:-4,armR:{a:92,b:0}}}];break;
   case 'stumble':keys=[
     {f:0,p:{yaw:.3}},
     {f:84,p:{tilt:22,headTilt:-21,armL:{a:140,b:-25},armR:{a:150,b:10}}},
     {f:185,p:{tilt:35,armL:{a:160,b:-12},legR:{a:43,b:13}}}];break;
   case 'buried':keys=[
     {f:0,p:{tilt:37,spin:10,headTilt:-18,armR:{a:122,b:-28}}},
     {f:110,p:{headTilt:14,armL:{a:94,b:-24},tilt:29}},
     {f:260,p:{headTilt:-7,armR:{a:146,b:8}}}];break;
   case 'push':keys=[
     {f:0,p:{tilt:29,armR:{a:155,b:-14},armL:{a:135,b:-17}}},
     {f:48,p:{tilt:-9,armR:{a:161,b:-5},armL:{a:160,b:11},squash:.07}},
     {f:117,p:{tilt:34,armR:{a:132,b:-10},armL:{a:140,b:-7}}},
     {f:205,p:{tilt:10,armR:{a:128,b:-8},armL:{a:135,b:0}}}];break;
   case 'fear':keys=[
     {f:0,p:{tilt:34,headTilt:-17,armL:{a:115,b:-20},
       armR:{a:52,b:-22},legL:{a:37,b:-24}}},
     {f:85,p:{tilt:17,headTilt:14,armR:{a:156,b:-20},
       armL:{a:106,b:-14}}},
     {f:215,p:{tilt:29,headTilt:-11,armR:{a:120,b:-18}}}];break;
   case 'switch':keys=[
     {f:0,p:{tilt:24,armR:{a:64,b:-18}}},
     {f:72,p:{tilt:-4,armR:{a:146,b:-12},headTilt:13}},
     {f:165,p:{armR:{a:153,b:-10},headTilt:-6}}];break;
   case 'warn':keys=[
     {f:0,p:{tilt:-8,armR:{a:39,b:-10}}},
     {f:100,p:{headTilt:-15,armR:{a:142,b:-24},tilt:5}},
     {f:190,p:{armR:{a:110,b:0}}}];break;
   case 'frozen':keys=[{f:0,p:{tilt:-12,armL:{a:135,b:-13},armR:{a:126,b:18}}}];break;
   default: keys=[
     {f:0,p:{armR:{a:21,b:-9},headTilt:3}},
     {f:100,p:{armR:{a:77,b:-20},headTilt:-8,tilt:3}},
     {f:210,p:{armR:{a:35,b:-10},headTilt:4,tilt:0}}];
 }
 return poseAt(t,keys,from);
};

const Expressions:Record<Behavior,[number,Expr][]>={
 thinking:[[0,'neutral'],[72,'smug']],
 toss:[[0,'smug'],[82,'shock'],[150,'happy']],
 joy:[[0,'shock'],[36,'happy']],
 warn:[[0,'smug'],[105,'worried']],
 shield:[[0,'neutral'],[110,'smug']],
 miss:[[0,'neutral'],[70,'shock'],[174,'happy']],
 walk:[[0,'smug']],
 stumble:[[0,'neutral'],[45,'shock']],
 fall:[[0,'shock']],
 buried:[[0,'shock'],[90,'worried']],
 push:[[0,'worried'],[70,'shock'],[135,'worried']],
 fear:[[0,'worried'],[80,'shock']],
 switch:[[0,'worried'],[100,'shock']],
 launch:[[0,'shock']],
 frozen:[[0,'shock']]
};

const Person:React.FC<{t:number;stage:Location;mode:Behavior;
  x?:number;y?:number;s?:number}>=({t,stage,mode,x,y,s})=>{
  const pose=actorPose(t,stage,mode,x,y,s);
  return <ReferenceHero variant="coral"
    pose={{...pose,...faceAt(t,Expressions[mode])}}
    rimId={stage==='cave'||stage==='street'?'rimBlue':'rimR'}
    shadow={mode==='fall'||mode==='launch'?0:.27}/>;
};

const Coin:React.FC<{x:number;y:number;flip?:number;s?:number;shadow?:boolean}>=
({x,y,flip=0,s=1,shadow=true})=>{
 const w=Math.max(.06,Math.abs(Math.cos(flip)));
 return <g transform={'translate('+x+' '+y+') scale('+s+')'}>
  {shadow&&<ellipse cy={46} rx={42} ry={12} fill="#0D0E17" opacity=".27"/>}
  <g transform={'scale('+w+' 1)'}>
   <circle r={37} fill="#FFCC72" stroke="#B77A36" strokeWidth={7}/>
   <circle r={28} fill="none" stroke="#FFE6A4" strokeWidth={3}/>
   <path d="M-11 -16 V16 M11 -16 V16 M-11 0 H11"
     stroke="#865025" strokeWidth={6} strokeLinecap="round"/>
  </g>
 </g>;
};

const Ticket:React.FC<{x:number;y:number;t:number}>=({x,y,t})=><g
 transform={'translate('+x+' '+y+') rotate(-7)'}>
 <rect x={-185} y={-95} width={370} height={220} rx={10}
   fill="#F1E4C9" stroke="#B8AB93" strokeWidth={7}/>
 {copy('LUCKY NIGHT',0,-44,24,'#45384D')}
 {Array.from({length:4},(_,i)=><text key={i}
   x={-118+i*79} y={50} textAnchor="middle" fontFamily={FONT.title}
   fontSize={55} fontWeight={800} fill="#29364E">
    {t>120?'7':(Math.floor(t/7)+i*3)%10}
   </text>)}
 <path d="M-140 68 H137" stroke="#877F77" strokeWidth={3}/>
 <text x="0" y="104" textAnchor="middle" fontSize={19}
   fill="#726C69" fontFamily="Arial">CHECK YOUR NUMBERS</text>
</g>;

const Card:React.FC<{label:string;value:string;x:number;y:number;
  color?:string;opacity?:number;width?:number}>=
({label,value,x,y,color=C.mint,opacity=1,width=360})=>
 <g opacity={opacity}>
  <rect x={x} y={y} width={width} height={142} rx={19}
    fill="#102338" fillOpacity={.96} stroke={color} strokeWidth={4}/>
  <circle cx={x+32} cy={y+29} r={7} fill={color}/>
  <text x={x+55} y={y+38} fill={C.muted} fontFamily={FONT.ui}
    fontSize={25} fontWeight={600} letterSpacing={2}>{label}</text>
  <text x={x+35} y={y+112} fill={color} fontSize={62}
    fontFamily={FONT.title} fontWeight={850}>{value}</text>
 </g>;

const SmallTitle:React.FC<{title:string;sub?:string;color?:string}>=
({title,sub,color=C.paper})=><g>
 <rect x="64" y="57" width="1050" height={sub?132:83} rx={13}
   fill="#101725" fillOpacity=".83"/>
 {copy(title,91,118,48,color,'start')}
 {sub&&copy(sub,93,168,28,C.muted,'start')}
</g>;

/**
 * One physical studio/street/cave world per shot. All objects share one camera.
 * The only screen-space pieces are clearly editorial HUD/captions.
 */
const Frame:React.FC<{id:LongformShotId;t:number;len:number}>=({id,t,len})=>{
 const shock=smooth(t/Math.max(1,len*.42));
 const after=smooth((t-len*.36)/Math.max(1,len*.27));
 const end=smooth((t-len*.75)/Math.max(1,len*.2));
 let physical:React.ReactNode=null;
 let overlay:React.ReactNode=null;
 switch(id){
  case 'COLD_OPEN': case 'BURIED_PROMISE':{
   physical=<><CaveWorld t={t}/>
    <Person t={t} stage="cave" mode="buried"/>
    <CaveForeground t={t}/>
    <path d="M730 620 L1000 587 L1070 768 L800 786Z"
      fill="#667184" stroke="#A3AEBC" strokeWidth={9} opacity=".78"/>
   </>;
   overlay=<><Card label="CHANCE OF DYING" value="0%" x={60} y={75}/>
    <g opacity={shock}>{copy(id==='COLD_OPEN'?'THE GROUND SWALLOWED HIM.':'STILL ALIVE. STILL TRAPPED.',
      975,950,id==='COLD_OPEN'?65:54,C.paper)}</g></>;
   break;
  }
  case 'FLASHBACK':case 'FIRST_CONSOLE':case 'COIN_TOSS':
  case 'DEATH_ZERO':{
   const toss=id==='COIN_TOSS';
   const actor=actorPose(t,'study',toss?'toss':id==='DEATH_ZERO'?'shield':'thinking');
   const person=<ReferenceHero variant="coral"
      pose={{...actor,...faceAt(t,toss?Expressions.toss:
        id==='DEATH_ZERO'?Expressions.shield:Expressions.thinking)}}
      rimId="rimR" shadow={.23}/>;
   const held=toWorld(actor,joints(actor).armR.end);
   const release=toWorld(actorPose(72,'study','toss'),
     joints(actorPose(72,'study','toss')).armR.end);
   const dt=Math.max(0,t-72);
   const fly=Math.min(90,dt);
   const coinX=t<72?held.x:release.x+2.7*fly;
   const coinY=t<72?held.y:release.y-10*fly+.11*fly*fly;
   physical=<><StudioWorld t={t} night={id==='DEATH_ZERO'}/>
    {person}
    {(toss||id==='FLASHBACK')&&<Coin
      x={toss?coinX:1190} y={toss?coinY:671}
      flip={toss?dt*.22:0} s={toss?.69:.65}/>}
    {id==='DEATH_ZERO'&&<circle cx={actor.x} cy={actor.y-150}
      r={240+7*Math.sin(t*.052)} stroke={C.mint} strokeWidth={8}
      fill={C.mint} fillOpacity=".035" opacity=".74"/>}
   </>;
   overlay=id==='FIRST_CONSOLE'?<><Card x={1330} y={140} width={520}
     label="EVENT PROBABILITY" value="0—100%" color={C.gold}/>
     <SmallTitle title="HE COULD EDIT CHANCE." sub="One event, one probability." /></>:
     id==='COIN_TOSS'?<SmallTitle title="HEADS. 100%." color={C.gold}/>:
     id==='DEATH_ZERO'?<><Card label="CHANCE OF DYING"
       value={Math.round(70*(1-smooth(t/150)))+'%'} x={1280} y={90} width={550}/>
       <SmallTitle title="THE ULTIMATE GUARANTEE." /></>:
     <SmallTitle title="A FEW HOURS EARLIER..." sub="One ordinary room. One impossible choice."/>;
   break;
  }
  case 'HEADS_RESULT':case 'TEN_HEADS':{
    const flips=id==='TEN_HEADS';
    const period=flips?45:125;
    const phase=flips?t%period:t;
    const air=flips?Math.max(0,145*Math.sin(Math.PI*phase/period)):Math.max(0,180*Math.sin(Math.PI*clamp(phase/85)));
    physical=<><MacroDesk t={t}/>
      <ellipse cx={985} cy={640} rx={95} ry={29} fill="#221721" opacity=".40"/>
      <Coin x={985} y={600-air} flip={t*.26} s={1.58}/>
      {flips&&<g>{copy('HEADS '+Math.min(10,1+Math.floor(t/22)),1280,280,72,C.gold)}</g>}
    </>;
    overlay=<><SmallTitle title={flips?'TEN FLIPS. TEN HEADS.':'HEADS. AGAIN.'}
      color={C.gold}/><g opacity={after}>
      <Card label="P(HEADS)" value="100%" x={1390} y={810} color={C.gold}/>
      </g></>;
    break;
  }
  case 'LOTTERY_TEST':case 'LOTTERY_WIN':{
    physical=<><LotteryWorld t={t}/>
      <Person stage="lottery" mode={id==='LOTTERY_WIN'?'joy':'thinking'}
        t={t} x={1420} y={810} s={.88}/>
      <Ticket x={930} y={706} t={t}/>
    </>;
    overlay=<><SmallTitle title={id==='LOTTERY_TEST'?'THE LOTTERY TEST.':'ALL FOUR NUMBERS MATCH.'}
      color={C.gold}/>
      <g opacity={id==='LOTTERY_WIN'?after:0}>
       <Card label="RESULT" value="WINNER" color={C.gold}
        x={1190} y={93} width={570}/></g></>;
    break;
  }
  case 'EUPHORIA':{
    physical=<><OverlookWorld t={t}/>
      <Person t={t} stage="overlook" mode="joy" x={990} y={777}/>
    </>;
    overlay=<><SmallTitle title="ANYTHING WAS POSSIBLE."/>
     <g opacity={end}><Card label="WARNING" value="ONE ACTIVE" x={1285}
       y={820} width={560} color={C.red}/></g></>;
    break;
  }
  case 'ONE_ACTIVE_RULE':case 'OVERRIDE_DECISION':{
    physical=<><StudioWorld t={t} desk={false} night/>
      <rect width={1920} height={1080} fill="#090E1C" opacity=".73"/>
    </>;
    const override=id==='OVERRIDE_DECISION';
    const p=smooth(t/Math.max(1,len*.7));
    overlay=<><SmallTitle title={override?'THE FINAL OVERRIDE.':'ONLY ONE ACTIVE CHANCE.'}
      sub={override?'One new guarantee removes the old one.':'Selecting a new event erases the previous guarantee.'}/>
      <Card x={350} y={410} width={520} label={override?'DEATH':'LOTTERY'}
        value={override?'0%':'100%'} color={override?C.mint:C.gold} opacity={1-.68*p}/>
      <g opacity={p}>
        <path d="M375 485 L830 500" stroke={C.red} strokeWidth={16}/>
        <Card x={1080} y={410} width={510} label={override?'ESCAPE':'DYING'}
          value={override?Math.round(1+99*p)+'%':'0%'} color={C.mint}/>
      </g>
      {override&&<g opacity={after}>{copy('PROTECTION REMOVED',960,810,56,C.red)}</g>}
    </>;
    break;
  }
  case 'NEAR_MISS':case 'WALK_HOME':case 'SITE_WARNING':
  case 'CRACK':case 'FALL':case 'LAUNCHED':
  case 'HEADLIGHTS':case 'PRE_IMPACT':{
   const walking=id==='WALK_HOME';
   const cracking=id==='CRACK'||id==='FALL'||id==='LAUNCHED';
   const pit=id==='FALL'||id==='LAUNCHED';
   const mode:Behavior=id==='NEAR_MISS'?'miss':walking?'walk':id==='CRACK'?'stumble':
     id==='FALL'?'fall':id==='LAUNCHED'?'launch':
     id==='HEADLIGHTS'||id==='PRE_IMPACT'?'frozen':'thinking';
   const atX=walking?680:id==='NEAR_MISS'?1000:id==='HEADLIGHTS'||id==='PRE_IMPACT'?745:920;
   const atY= id==='LAUNCHED'?1100:id==='FALL'?710:745;
   const person=<Person t={id==='PRE_IMPACT'?0:t} stage="street" mode={mode}
      x={atX} y={atY} s={id==='HEADLIGHTS'||id==='PRE_IMPACT'?1.06:1.1}/>;
   const truck=id==='HEADLIGHTS'||id==='PRE_IMPACT';
   const truckP=truck?(id==='PRE_IMPACT'?.92:smooth(t/Math.max(1,len))):0;
   // Anchor the truck's wheels to the road, instead of its body origin.
   const truckScale=.52+1.00*truckP;
   const truckWheelY=770+175*truckP;
   const truckBodyY=truckWheelY-363*truckScale;
   physical=<><StreetWorld t={id==='PRE_IMPACT'?0:t} rain
       crack={cracking?id==='CRACK'?smooth(t/190):1:0}
       pit={pit?id==='FALL'?smooth((t-45)/120):1:0}/>
     {id==='NEAR_MISS'&&<g>
       <g transform={'rotate('+(14+42*smooth((t-10)/140))+' 1130 330)'}>
         <path d="M1130 330 V555" stroke="#7B7C87" strokeWidth={14}/>
         <rect x={910} y={480} width={405} height={92}
           rx={11} fill="#E8B35D" stroke="#534657" strokeWidth={8}/>
         {copy('KEEP OUT',1115,542,41,'#2F2940')}
       </g>
     </g>}
     {id==='SITE_WARNING'&&<g opacity={.82}>
       <ProbabilityTruck x={1540-480*smooth(t/len)} y={385} t={t} scale={.58}/>
     </g>}
     {person}
     {id==='CRACK'&&<RockBurst x={960} y={900} t={t-140} size={.22}/>}
     {id==='LAUNCHED'&&<RockBurst x={960} y={850} t={t} size={.84}/>}
     {truck&&<g>
       <path d={'M'+(1520-540*truckP)+' '+(500+65*truckP)+
          ' L1000 1070 L1750 1070Z'}
         fill="#FFE6A2" opacity={.06+truckP*.15}/>
       <ProbabilityTruck x={1470-430*truckP} y={truckBodyY}
         t={id==='PRE_IMPACT'?0:t} scale={truckScale}/>
     </g>}
    </>;
    overlay=id==='NEAR_MISS'?<Card x={1380} y={90} width={410}
      label="DEATH CHANCE" value="0%"/>:
      id==='WALK_HOME'?<SmallTitle title="LATER THAT NIGHT..."/>:
      id==='SITE_WARNING'?<SmallTitle title="CONSTRUCTION AHEAD." color={C.gold}/>:
      id==='CRACK'?<g opacity={after}>{copy('CRACK.',970,245,102,C.red)}</g>:
      id==='HEADLIGHTS'?<g opacity={after}><Card x={1330} y={90} width={490}
        label="PROTECTION" value="OFF" color={C.red}/></g>:
      id==='PRE_IMPACT'?<g>
        <rect width={1920} height={1080} fill="#040610" opacity=".69"/>
        <path d="M270 315 H1640 M270 795 H1640"
          stroke={C.red} strokeWidth={10}/>
        {copy('HE GUARANTEED HIS ESCAPE.',960,480,76,C.mint)}
        {copy('NOT HIS SURVIVAL.',960,610,105,C.red)}
        {copy('ONE CHANCE AT A TIME.',960,905,38,C.paper)}
       </g>:null;
    break;
  }
  case 'TRAPPED':case 'THE_LIMIT':case 'NO_RESCUE':
  case 'BAD_CHOICE':case 'RUBBLE_MOVES':{
    const mode:Behavior=id==='NO_RESCUE'?'push':
      id==='BAD_CHOICE'?'fear':id==='RUBBLE_MOVES'?'switch':'buried';
    const opening=id==='RUBBLE_MOVES'?smooth((t-72)/132):0;
    physical=<><CaveWorld t={t} opening={opening}/>
      <Person t={t} stage="cave" mode={mode}/>
      <CaveForeground t={t} opening={opening}/>
      {id==='RUBBLE_MOVES'&&<RockBurst t={t-90} x={1050} y={850} size={.54}/>}
    </>;
    overlay=id==='TRAPPED'?<SmallTitle title="BURIED UNDER CONCRETE." />:
      id==='THE_LIMIT'?<><SmallTitle title="IMMORTAL. NOT FREE."/>
        <Card x={1300} y={125} label="CHANCE OF DYING" value="0%" width={550}/></>:
      id==='NO_RESCUE'?<g opacity={after}>{copy('NO ONE CAN HEAR HIM.',960,155,69,C.paper)}</g>:
      id==='BAD_CHOICE'?<><SmallTitle title="WHICH WOULD YOU CHOOSE?"/>
        <Card x={80} y={770} width={480} label="DEATH" value="0%"/>
        <Card x={1360} y={770} width={480} label="ESCAPE"
          value="1%" color={C.gold}/></>:
      <><SmallTitle title="ESCAPE IS GUARANTEED." color={C.mint}/>
       <Card x={1350} y={105} width={490} label="ESCAPE" value="100%"/></>;
    break;
  }
  case 'ONE_PERCENT':{
    physical=<><CaveWorld t={t}/>
      <rect width={1920} height={1080} fill="#08101E" opacity=".83"/>
    </>;
    overlay=<><SmallTitle title="CHANCE OF ESCAPING: 1%."
      sub="One outcome in one hundred." color={C.gold}/>
     {Array.from({length:100},(_,i)=>{
        const x=460+(i%20)*52,y=270+Math.floor(i/20)*110;
        const show=smooth((t-i*.8)/50);
        return <rect key={i} x={x} y={y} width={33} height={42} rx={4}
          fill={i===37?C.gold:'#394962'}
          stroke={i===37?'#FFF0B5':'#53697B'} strokeWidth={i===37?5:2}
          opacity={show}/>;
     })}
     <g opacity={after}>{copy('ONLY ONE SQUARE.',960,985,48,C.gold)}</g>
    </>;
    break;
  }
 }
 // Canonical camera: all story objects in one group. Interface remains
 // screen-space intentionally, like a real HUD or chapter caption.
 return <g>
   <WorldCamera id={id} t={t} len={len}>{physical}</WorldCamera>
   {overlay}
 </g>;
};

export const longformShotMap:ShotMap=Object.fromEntries(
  LONGFORM_SHOTS.map(({id})=>[
    id,({t,len}:ShotProps)=><Frame id={id} t={t} len={len}/>
  ])
) as ShotMap;
