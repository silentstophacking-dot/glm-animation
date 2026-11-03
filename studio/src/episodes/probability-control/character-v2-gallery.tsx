import React from 'react';
import {useCurrentFrame} from 'remotion';
import {basePose,camT,Pose} from '../../engine';
import {CharacterRigV2,Point,rigV2Joints,rigLocalToWorld,distance} from './character-rig-v2';

/**
 * Isolated gallery and 5-second interaction proof. No existing long-form
 * composition changes. Every physical layer is inside ONE camera transform.
 * The HUD is the only screen-space element.
 */
const INK='#100E18',CREAM='#FFF2DE',GOLD='#F2BF70',TEAL='#6DDBCC',CORAL='#E35A45';
const between=(x:number,a:number,b:number)=>Math.max(0,Math.min(1,(x-a)/Math.max(.0001,b-a)));
const smooth=(x:number)=>x*x*(3-2*x);
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
const pulse=(t:number,start:number)=>t<start?0:Math.sin((t-start)*.35)*Math.exp(-(t-start)/16);
const WIDTH=1920,HEIGHT=1080;

export const Defs:React.FC=()=><defs>
  <linearGradient id="v2Wall" x1="0" y1="0" x2=".9" y2="1">
    <stop stopColor="#302438"/><stop offset=".65" stopColor="#241D2E"/>
    <stop offset="1" stopColor="#101523"/>
  </linearGradient>
  <linearGradient id="v2Floor" x1="0" y1="0" x2="0" y2="1">
    <stop stopColor="#3B3341"/><stop offset="1" stopColor="#151825"/>
  </linearGradient>
  <linearGradient id="v2Window" x1="0" y1="0" x2="0" y2="1">
    <stop stopColor="#678AA2"/><stop offset=".55" stopColor="#24354A"/>
    <stop offset="1" stopColor="#19283B"/>
  </linearGradient>
  <radialGradient id="v2Lamp">
    <stop stopColor="#FFD898" stopOpacity=".4"/>
    <stop offset="1" stopColor="#FFD898" stopOpacity="0"/>
  </radialGradient>
  <radialGradient id="v2Monitor">
    <stop stopColor="#6DDBCC" stopOpacity=".4"/>
    <stop offset="1" stopColor="#6DDBCC" stopOpacity="0"/>
  </radialGradient>
</defs>;
export const Room:React.FC<{lab?:boolean;active?:boolean;night?:boolean}>=
({lab=false,active=false,night=false})=><g>
  <rect x="-600" y="-400" width="3200" height="2200" fill="url(#v2Wall)"/>
  <path d="M0 0H1920V860H0Z" fill="#2B2334" opacity=".6"/>
  <path d="M0 857H1920V1250H0Z" fill="url(#v2Floor)"/>
  <path d="M0 857H1920" stroke="#8E6F73" strokeWidth="7" opacity=".7"/>
  <g stroke="#A28386" strokeWidth="3" opacity=".17">
    {Array.from({length:16},(_,i)=><path key={i}
      d={'M'+(i*145-300)+' 1100L'+(960+(i*145-1260)*.22)+' 857'}/>)}
    {[920,1000,1100].map(i=><path key={i} d={'M0 '+i+'H1920'}/>)}
  </g>
  <path d="M0 0V860M1920 0V860" stroke="#4B3546" strokeWidth="80"/>
  <g>
    <rect x="135" y="135" width="635" height="555" rx="18"
      fill="#131B2C" stroke="#4F485B" strokeWidth="24"/>
    <rect x="155" y="154" width="594" height="516" fill="url(#v2Window)"/>
    <path d="M450 145V675M155 435H755" stroke="#4A4557" strokeWidth="19"/>
    <path d="M155 570Q410 460 749 610" fill="none" stroke="#91B2C3"
      strokeWidth="9" opacity=".22"/>
    {Array.from({length:8},(_,i)=><rect key={i}
      x={169+i*78} y={523-(i%3)*41} width="49" height={155+(i%3)*41}
      fill="#151E31" opacity=".75"/>)}
  </g>
  <rect x="930" y="138" width="740" height="45" rx="12" fill="#171725"/>
  {lab?<g>
    <rect x="1320" y="240" width="435" height="300" rx="21"
      fill="#171B2C" stroke="#596778" strokeWidth="9"/>
    <rect x="1342" y="262" width="391" height="258" rx="9" fill="#223B48"/>
    <path d="M1375 420L1440 380L1510 391L1590 310L1660 343"
      fill="none" stroke={active?TEAL:'#709D9B'} strokeWidth="9" strokeLinecap="round"/>
    {[0,1,2,3].map(i=><rect key={i}
      x={1380+i*85} y={462} width="65" height="22" rx="5"
      fill={i===2&&active?TEAL:'#42666E'} opacity=".7"/>)}
    <rect x="930" y="440" width="270" height="325" rx="18"
      fill="#29303B" stroke="#6E7078" strokeWidth="8"/>
    <path d="M966 490H1165" stroke="#6D7D8E" strokeWidth="11"/>
    <circle cx="1012" cy="537" r="23" fill={active?TEAL:CORAL}
      stroke="#F3C6AA" strokeWidth="6"/>
    <circle cx="1012" cy="537" r={active?36:29}
      stroke={active?TEAL:CORAL} strokeWidth="3" fill="none"
      opacity={active?.9:.45}/>
    <rect x="973" y="605" width="150" height="24" rx="12" fill="#566574"/>
    <path d="M1050 660V750" stroke="#68788B" strokeWidth="9"/>
    <ellipse cx="1012" cy="537" rx={active?220:95} ry={active?190:90}
      fill="url(#v2Monitor)" opacity={active?1:.2}/>
  </g>:<g>
    <path d="M950 215L1420 215L1490 820H1010Z" fill="#2C2534"/>
    <rect x="990" y="243" width="460" height="470" rx="21"
      fill="#211B2B" stroke="#8D6D65" strokeWidth="9"/>
    {Array.from({length:4},(_,i)=><path key={i} d={'M1025 '+(320+i*85)+'H1403'}
      stroke="#775963" strokeWidth="11"/>)}
    <rect x="1070" y="335" width="110" height="132" rx="7" fill="#9A685E"/>
    <rect x="1230" y="330" width="90" height="132" rx="6" fill="#59736E"/>
  </g>}
  <ellipse cx="1590" cy="316" rx="670" ry="480" fill="url(#v2Lamp)"
    opacity={night?.42:.72}/>
  <path d="M0 845H1920" stroke="#131927" strokeWidth="24"/>
</g>;
const Table:React.FC=()=><g>
  <path d="M100 720L900 720L860 786L140 786Z"
    fill="#6D4C48" stroke="#281F2A" strokeWidth="13"/>
  <path d="M157 790L139 1130M837 790L855 1130"
    stroke="#3D3037" strokeWidth="24"/>
  <path d="M125 728H870" stroke="#B28669" strokeWidth="7" opacity=".6"/>
  <g>
    <ellipse cx="704" cy="717" rx="43" ry="13" fill="#17111D" opacity=".3"/>
    <rect x="663" y="647" width="80" height="70" rx="12"
      fill="#D7B8A1" stroke="#432F34" strokeWidth="6"/>
    <path d="M735 655Q800 646 790 680Q783 710 737 692"
      fill="none" stroke="#D7B8A1" strokeWidth="16" strokeLinecap="round"/>
  </g>
</g>;
const Hud:React.FC<{label:string;sub:string;index:string;active?:boolean}>=
({label,sub,index,active})=><g fontFamily="Arial, sans-serif">
  <rect x="80" y="69" width="1070" height="116" rx="19" fill="#111622" opacity=".76"/>
  <rect x="83" y="73" width="7" height="106" rx="3" fill={active?TEAL:GOLD}/>
  <text x="114" y="121" fontSize="44" fill={CREAM} fontWeight="800"
    letterSpacing="2">{label}</text>
  <text x="114" y="159" fontSize="24" fill="#A8B9C8" letterSpacing="1.5">{sub}</text>
  <text x="1750" y="115" fill={TEAL} fontSize="34" fontWeight="700"
    textAnchor="end">RIG / V2</text>
  <text x="1750" y="157" fill="#9AABB8" fontSize="28"
    textAnchor="end">FRAME {index}</text>
</g>;
const line=(x1:number,y1:number,x2:number,y2:number)=>
  'M'+x1+' '+y1+'L'+x2+' '+y2;
const Theater:React.FC<{variant:number;t:number;animated?:boolean}>=
({variant,t,animated=false})=>{
  const isCafe=variant===0;
  const isLab=variant===1||variant===2;
  const isClose=variant===3;
  const isCave=variant===4;
  const reaching=animated;
  const reach=smooth(between(t,19,61));
  const contact=animated&&t>=61&&t<111;
  const release=smooth(between(t,111,137));
  const progress=reach*(1-release);
  const activated=animated&&t>=64;
  const hero:Pose={
    ...basePose,
    x:isCafe?985:isLab?850:960,
    y:isCafe?657:isLab?660:isCave?720:680,
    scale:isCafe?1.42:isLab?1.45:isCave?1.62:1.8,
    yaw:isCafe?-.18:isLab?.18:isCave?-.08:.15,
    tilt:animated?lerp(0,-5,progress):isCave?3:isCafe?-3:0,
    headTilt:animated?lerp(3,-7,progress)+pulse(t,65)*4:
      isCave?-13:isClose?-8:isCafe?4:0,
    armL:isCave?{a:157,b:-4}:isCafe?{a:15,b:-11}:{a:13,b:-8},
    armR:isCave?{a:164,b:-12}:isCafe?{a:28,b:-10}:{a:25,b:-17},
    legL:isCave?{a:28,b:-55}:{a:9,b:-12},
    legR:isCave?{a:-14,b:36}:{a:-8,b:10},
    expr:activated?'shock':isClose?'shock':isCave?'worried':
      variant===2?'worried':isCafe?'happy':'neutral'
  };
  const button:Point={x:112,y:-85};
  const rightEnd=rigV2Joints(hero).armR.end;
  // First key starts exactly at the unconstrained right hand. Then the
  // end effector travels to the fixed console point and STAYS THERE.
  const movingHand:Point={
    x:lerp(rightEnd.x,button.x,progress),
    y:lerp(rightEnd.y,button.y,progress)
  };
  const actorHands=isCave?
    {L:{x:-82,y:-214},R:{x:82,y:-214}}:
    (variant===1||animated)?{R:animated?movingHand:button}:undefined;
  const stageWorld=<g>
    {isCave?<g>
      <rect x="-500" y="-400" width="2900" height="1800" fill="#141A26"/>
      <path d="M-500 0L300 370L770 180L1300 255L2300 -50V1300H-500Z"
        fill="#2C3039"/>
      <path d="M-100 820L490 620L860 755L1340 650L2080 820V1200H-100Z"
        fill="#3A3E45" stroke="#1D2330" strokeWidth="16"/>
      <path d="M0 760H1920" stroke="#6E7276" strokeWidth="7" opacity=".3"/>
    </g>:<Room lab={isLab||animated} active={activated} night={isClose}/>}
    {isCafe?<Table/>:null}
    {variant===2?<g>
      <CharacterRigV2 pose={{...basePose,x:1420,y:662,scale:1.4,
        yaw:-.24,headTilt:-7,expr:'smug',
        armL:{a:115,b:-16},armR:{a:17,b:-8}}}
        variant="gold" shadow={.45}/>
    </g>:null}
    <CharacterRigV2 pose={hero}
      variant="coral" hands={actorHands}
      handStyles={{R:(variant===1||animated)?'grip':'open'}}
      shadow={isCave?0:.45}/>
    {isCave?<g>
      {/* The upper slab and buried rubble are drawn AFTER the rig, so their
          occlusion visibly locks the shoulders and legs in the cave. */}
      <path d="M630 182L1360 185L1290 349L710 363Z"
        fill="#65666B" stroke="#282A30" strokeWidth="17"/>
      <path d="M683 332L1326 319" stroke="#B0AAA2"
        strokeWidth="11" opacity=".55"/>
      <path d="M550 720L740 632L820 710L915 755L1090 706L1240 635L1470 758
       L1620 950H520Z" fill="#45474E" stroke="#1A202C" strokeWidth="20"/>
      <path d="M0 885L560 722L830 810L1250 728L1920 905V1200H0Z"
        fill="#292D39" stroke="#1A1C2A" strokeWidth="18"/>
      <path d="M0 875L530 730M1270 730L1920 880"
        stroke="#89837B" strokeWidth="7" opacity=".34"/>
    </g>:null}
    {isClose?<g>
      <ellipse cx="1540" cy="420" rx="540" ry="500" fill="url(#v2Lamp)" opacity=".27"/>
      <path d="M1650 -100L1700 1210" stroke="#1D1A26" strokeWidth="100"/>
    </g>:null}
    {animated?<g>
      <circle cx="1012" cy="537" r={activated?28+Math.max(0,pulse(t,64))*18:22}
        fill="none" stroke={activated?TEAL:CORAL} strokeWidth="5"
        opacity={activated?.75:.34}/>
      {activated?<g opacity={Math.min(1,between(t,64,82))}>
        <path d="M1205 515L1330 450" stroke={TEAL} strokeWidth="5"/>
        <text x="1342" y="455" fontFamily="Arial,sans-serif" fontSize="35"
          fontWeight="700" fill={TEAL}>ACTIVATED</text>
      </g>:null}
    </g>:null}
  </g>;
  const camera=animated?
    camT(960+25*smooth(between(t,78,130)),540-12*smooth(between(t,78,130)),
      1+.055*smooth(between(t,78,130))):
    isClose?camT(960,460,1.42):camT(960,540,1);
  const labels=[
    ['CAFE — NORMAL STANCE','Recognizable silhouette and grounded feet'],
    ['LAB — EXACT HAND CONTACT','Right palm remains on the fixed console button'],
    ['LAB — TWO CHARACTER CAST','Original coral and gold costume families'],
    ['REACTION CLOSE-UP','Eyes, brows, body language and purposeful framing'],
    ['TRAPPED — PHYSICAL OCCLUSION','Slab above hands; rubble covers legs and waist']
  ];
  return <svg xmlns="http://www.w3.org/2000/svg"
    width="100%" height="100%" viewBox="0 0 1920 1080">
    <Defs/>
    <g transform={camera}>{stageWorld}</g>
    <Hud label={animated?'LAB TEST — REACH / PRESS / REACTION':labels[variant][0]}
      sub={animated?'Fixed world, constrained palm, separate screen-space HUD':
        labels[variant][1]}
      index={animated?String(Math.floor(t)).padStart(3,'0'):String(variant+1).padStart(2,'0')}
      active={animated&&activated}/>
    <text x="92" y="1038" fontFamily="Arial,sans-serif" fontSize="24"
      fill="#C5AFA7" letterSpacing="2">
      ORIGINAL SVG ARTWORK · 1920 × 1080 WORLD · NO BLENDER / RASTER SPRITES
    </text>
  </svg>;
};
export const CharacterRigV2Gallery:React.FC=()=>(
  <Theater variant={Math.min(4,useCurrentFrame())} t={0}/>
);
export const CharacterRigV2Motion:React.FC=()=>(
  <Theater variant={1} t={useCurrentFrame()} animated/>
);
// Engineering self-check for the hand target at press: validate without
// depending on frame captures. Can be invoked from CI using TS tooling.
export const checkRigV2Contact=()=>{
  const pose={...basePose,x:850,y:660,scale:1.45,yaw:.18};
  const target={x:112,y:-85};
  const joints=rigV2Joints(pose,{R:target});
  if(distance(joints.armR.end,target)>.01)throw new Error('V2 IK hand misses target');
  const w=rigLocalToWorld(pose,joints.armR.end);
  if(distance(w,{x:1012.4,y:536.75})>.01)throw new Error('V2 world hand position changed');
  return true;
};
