import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

// Independent vertical composition. Do not change the studio's landscape settings.
export const FPS = 30;
export const SHOTS = [
  {id:'hook',start:0,end:90,key:70,caption:'Death set to zero'},
  {id:'coin',start:90,end:180,key:143,caption:'Heads every time'},
  {id:'lottery',start:180,end:270,key:245,caption:'Lottery guaranteed'},
  {id:'rule',start:270,end:390,key:350,caption:'Only one active probability'},
  {id:'protection',start:390,end:480,key:455,caption:'Zero chance of dying'},
  {id:'collapse',start:480,end:660,key:590,caption:'Road collapses'},
  {id:'buried',start:660,end:810,key:750,caption:'Buried but alive'},
  {id:'choice',start:810,end:960,key:926,caption:'Escape replaces protection'},
  {id:'escape',start:960,end:1050,key:1023,caption:'The escape'},
  {id:'truck',start:1050,end:1170,key:1140,caption:'Not survival'}
] as const;
export const TOTAL_FRAMES = 1170;
const P={bg:'#080E1C',panel:'#15233D',mid:'#263C5E',white:'#F3F7FF',muted:'#A0B7D2',
 mint:'#6CF0BC',gold:'#FFD675',red:'#FF6C80',blue:'#5BCEE9',floor:'#33445E'};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{const t=clamp(n);return t*t*(3-2*t);};
const words=(t:string,y:number,size=62,color=P.white,weight=800)=>(
 <text x="540" y={y} textAnchor="middle" fill={color} fontFamily="Arial, sans-serif"
   fontSize={size} fontWeight={weight} letterSpacing={1.4}>{t}</text>);
const Header:React.FC<{mini:string;title:string;accent?:string}>=({mini,title,accent=P.mint})=><>
 {words(mini.toUpperCase(),190,34,accent,700)}{words(title,294,74)}
</>;
const Human:React.FC<{x:number;y:number;s?:number;rot?:number;pose?:'up'|'fall'|'stand'|'trap'}>=
 ({x,y,s=1,rot=0,pose='stand'})=><g transform={'translate('+x+' '+y+') rotate('+rot+') scale('+s+')'}>
   <path d={pose==='fall'?'M-30 34 L-76 91 M28 34 L83 90':'M-27 34 L-46 113 M27 34 L46 113'}
     fill="none" stroke="#070B17" strokeWidth="23" strokeLinecap="round"/>
   <path d="M-44 -50 Q0 -72 44 -50 L39 29 Q0 45 -39 29 Z" fill={P.blue} stroke="#090F20" strokeWidth="10"/>
   <path d={pose==='up'||pose==='fall'?'M-40 -25 L-100 -95 M40 -25 L100 -95':
    pose==='trap'?'M-40 -25 L-80 24 M40 -25 L74 15':'M-40 -25 L-81 44 M40 -25 L81 44'}
      fill="none" stroke="#090F20" strokeWidth="21" strokeLinecap="round"/>
   <circle cx="0" cy="-112" r="47" fill="#F2C5A0" stroke="#090F20" strokeWidth="9"/>
   <path d="M-43 -121 Q-35 -168 28 -162 L43 -124 L10 -144 L-26 -145 Z" fill="#111827"/>
   <circle cx="-14" cy="-111" r="4" fill="#13172A"/><circle cx="16" cy="-111" r="4" fill="#13172A"/>
  </g>;
const Meter:React.FC<{label:string;value:string;color?:string;y?:number;active?:boolean}>=
 ({label,value,color=P.mint,y=500,active=true})=><g opacity={active?1:.32}>
 <rect x="105" y={y} width="870" height="245" rx="30" fill={P.panel} stroke={color} strokeWidth={active?5:3}/>
 <circle cx="157" cy={y+64} r="9" fill={color}/>
 <text x="187" y={y+78} fill={P.muted} fontSize="35" fontFamily="Arial" letterSpacing={2}>{label}</text>
 <text x="160" y={y+198} fill={color} fontWeight="900" fontSize="116" fontFamily="Arial">{value}</text>
 </g>;
const Rain:React.FC<{frame:number}>=({frame})=><g opacity=".31">{
 Array.from({length:45},(_,i)=>{
 const x=(i*187+71)%1120,y=(i*239+frame*17)%2050-80;
 return <path key={i} d={'M'+x+' '+y+' l-13 48'} stroke="#B7E6FF" strokeWidth="3"/>;
 })}</g>;
const City:React.FC<{frame:number;rain?:boolean}>=({frame,rain=false})=><>
 <rect width="1080" height="1920" fill="url(#citysky)"/>
 {Array.from({length:10},(_,i)=>{
 const x=132*i-36,h=460+(i*91)%250;
 return <g key={i}>
 <rect x={x} y={1350-h} width="109" height={h} fill={i%2?'#131F36':'#1B2A45'}/>
 {Array.from({length:6},(_,j)=><rect key={j} x={x+20+(j%2)*48}
   y={1350-h+70+Math.floor(j/2)*130} width="19" height="29" fill="#FFD675" opacity=".22"/>)}
 </g>;
 })}
 <rect y="1350" width="1080" height="570" fill="#242F44"/>
 <path d="M0 1392 H1080" stroke="#8492AA" strokeWidth="15"/>
 {Array.from({length:4},(_,i)=><rect key={i} x={i*310+50} y="1700" width="145" height="14" rx="6" fill="#CCBC9D"/>)}
 {rain&&<Rain frame={frame}/>}
 </>;
const Background:React.FC<{frame:number}>=({frame})=><>
 <rect width="1080" height="1920" fill="url(#dusk)"/>
 {Array.from({length:24},(_,i)=><circle key={i} cx={(i*223+59)%1060}
 cy={(i*317+131)%1340} r={i%5===0?3:1.5} fill={P.white}
 opacity={.22+.25*Math.abs(Math.sin(frame*.025+i))}/>)}
 </>;

const Frame:React.FC<{frame:number}>=({frame})=>{
 const item=SHOTS.find(s=>frame>=s.start&&frame<s.end)||SHOTS[9];
 const t=frame-item.start,progress=clamp(t/(item.end-item.start));
 const fade=clamp(t/6);
 let scene:React.ReactNode=null;
 switch(item.id){
 case 'hook':{
  const death=Math.round(100*(1-ease(t/44)));
  scene=<><Background frame={frame}/><Header mini="Probability editor" title="CHANCE OF DYING" accent={P.red}/>
  <circle cx="540" cy="825" r="350" fill={P.red} opacity=".12"/>
  {words(death+'%',860,310,P.red)}
  <rect x="160" y="940" width="760" height="20" rx="8" fill={P.mid}/>
  <rect x="160" y="940" width={760*death/100} height="20" rx="8" fill={P.red}/>
  <Human x={540} y={1450} s={2.0}/>
  {t>50&&<g><rect x="150" y="1055" width="780" height="120" rx="18" fill={P.red}/>
   {words('BIG MISTAKE.',1137,76,P.bg)}</g>}</>;break;
 }
 case 'coin':{
  const rx=Math.max(9,Math.abs(Math.cos(t*.18))*132);
  scene=<><Background frame={frame}/><Header mini="Test 01" title="FLIP A COIN"/>
  <Meter label="HEADS" value="100%" color={P.gold} y={470}/>
  <Human x={320} y={1370} s={2} pose="up"/>
  <g transform={'translate(710 '+(980-210*Math.abs(Math.sin(t*.088)))+')'}>
   <ellipse rx={rx} ry="144" fill={P.gold} stroke="#FFF0BC" strokeWidth="14"/>
   {rx>60&&<text y="26" textAnchor="middle" fontSize="80" fontWeight="900" fill="#825B23">H</text>}
  </g>
  {t>70&&words('EVERY SINGLE TIME.',1610,50,P.gold)}</>;break;
 }
 case 'lottery':{
  const win=t>55;
  scene=<><Background frame={frame}/><Header mini="Test 02" title="JACKPOT" accent={P.gold}/>
   <rect x="95" y="520" width="890" height="550" rx="39" fill={P.panel} stroke={P.gold} strokeWidth="6"/>
   {words('LOTTERY DRAW',630,47,P.gold)}
   {[0,1,2,3].map(i=><g key={i}>
   <rect x={148+i*198} y="715" width="179" height="182" rx="18" fill="#E7EEF7"/>
   <text x={236+i*198} y="854" textAnchor="middle" fontWeight="900" fontSize="114"
    fill="#14213B">{win?'7':String((i*3+Math.floor(t/5))%10)}</text></g>)}
   <Human x={540} y={1385} s={2} pose={win?'up':'stand'}/>
   {win&&words('WINNER — 100%',1610,65,P.mint)}
  </>;break;
 }
 case 'rule':{
  scene=<><Background frame={frame}/><Header mini="The catch" title="ONE RULE." accent={P.red}/>
   <Meter label="HEADS" value="100%" color={P.gold} active={t<55} y={480}/>
   <Meter label="JACKPOT" value="100%" color={P.mint} active={t>=55} y={790}/>
   <rect x="118" y="1265" width="844" height="180" rx="24" fill="#3A1E31" stroke={P.red} strokeWidth="5"/>
   {words('ONE ACTIVE CHANCE',1370,55)}
   {words('New odds replace old odds.',1535,42,P.red)}
  </>;break;
 }
 case 'protection':{
  const v=Math.round(100*(1-ease(t/53)));
  scene=<><Background frame={frame}/><Header mini="Ultimate cheat" title="INVINCIBLE?" accent={P.mint}/>
   <Meter label="CHANCE OF DYING" value={v+'%'} y={490}/>
   <circle cx="540" cy="1290" r={290+15*Math.sin(t*.08)} fill="none" stroke={P.mint}
      strokeWidth="15" opacity=".48"/>
   <Human x={540} y={1410} s={2.2} pose="up"/>
   {t>65&&words('PROTECTION ACTIVE',1620,52,P.mint)}
  </>;break;
 }
 case 'collapse':{
  const gap=350*ease((t-45)/78),fall=950*ease((t-58)/111);
  scene=<><City frame={frame} rain/><Header mini="That night" title="THE STREET BREAKS" accent={P.red}/>
   <g transform={'translate('+-gap+' '+(fall*.1)+')'}>
    <rect x="0" y="1350" width="540" height="600" fill={P.floor}/>
    <rect x="0" y="1340" width="540" height="16" fill="#9BA9BC"/></g>
   <g transform={'translate('+gap+' '+(fall*.1)+')'}>
    <rect x="540" y="1350" width="540" height="600" fill={P.floor}/>
    <rect x="540" y="1340" width="540" height="16" fill="#9BA9BC"/></g>
   <g transform={'translate(0 '+fall+')'}><Human x={540} y={1165} s={1.9}
     rot={gap>70?37:0} pose={gap>70?'fall':'stand'}/></g>
   {Array.from({length:17},(_,i)=>{
    const x=540+(i*113)%390-200,y=1375+ease((t-50)/90)*(i*47%520);
    return <rect key={i} x={x} y={y} width={20+(i%4)*13}
      height={18+(i%3)*17} fill="#6C7A92"
      transform={'rotate('+(i*21+t*2)+' '+x+' '+y+')'}/>;
   })}
   {t>100&&words("HE CAN'T DIE.",650,60,P.mint)}
  </>;break;
 }
 case 'buried':{
  scene=<><rect width="1080" height="1920" fill="url(#cave)"/>
   <path d="M0 0 H1080 L930 650 L800 490 L670 780 L490 620 L250 820 L100 590 Z" fill="#303B53"/>
   <path d="M0 1450 L180 1110 L360 1400 L540 1150 L740 1370 L990 1070 L1080 1330 V1920 H0Z" fill="#44516A"/>
   <Header mini="Buried alive" title="STILL BREATHING" accent={P.mint}/>
   <Meter label="CHANCE OF DYING" value="0%" y={465}/>
   <Human x={530} y={1350} s={1.65} rot={-18} pose="trap"/>
   <polygon points="0,1160 350,1040 500,1360 230,1540" fill="#6B7892" stroke="#8996AB" strokeWidth="9"/>
   <polygon points="805,1035 1080,1170 1080,1620 700,1400" fill="#657188" stroke="#8996AB" strokeWidth="9"/>
   <path d="M0 1580 L420 1480 L690 1920 H0Z" fill="#56647B"/>
   {words("BUT HE'S TRAPPED.",1750,53,P.red)}
  </>;break;
 }
 case 'choice':{
  const p=ease((t-38)/65);
  scene=<><Background frame={frame}/><Header mini="Only one chance" title="MAKE A CHOICE" accent={P.red}/>
   <Meter label="DYING" value="0%" y={475} active={p<.6}/>
   <Meter label="ESCAPING" value={Math.round(1+p*99)+'%'} color={P.gold} y={800} active={p>.4}/>
   {p>.52&&<g>
    <path d="M125 630 H955" stroke={P.red} strokeWidth="14"/>
    {words('SURVIVAL GUARANTEE REMOVED',1440,40,P.red)}
    <rect x="220" y="1510" width="640" height="120" rx="20" fill={P.gold}/>
    {words('CONFIRMED',1592,56,P.bg)}
   </g>}
   {words('The first probability is overwritten.',1760,32,P.muted)}
  </>;break;
 }
 case 'escape':{
  const launch=ease(t/65),y=1650-1020*launch;
  scene=<><City frame={frame} rain/><Header mini="Escape: 100%" title="HE'S FREE!" accent={P.mint}/>
   <polygon points="80,1430 450,1230 520,1900 0,1920" fill="#67758B"/>
   <polygon points="990,1300 610,1200 650,1920 1080,1920" fill="#5A687F"/>
   {Array.from({length:24},(_,i)=>{
     const a=i*2.4,r=(125+i*12)*launch;
     const x=540+Math.cos(a)*r,y2=1430+Math.sin(a)*r;
     return <rect key={i} x={x} y={y2} width={16+(i%4)*12} height={20+(i%3)*17}
       fill="#91A0B5" transform={'rotate('+(i*23+t*5)+' '+x+' '+y2+')'}/>;
   })}
   <Human x={540+265*launch} y={y} s={1.9} rot={76*launch} pose="fall"/>
  </>;break;
 }
 case 'truck':
 default:{
  const x=1450-900*ease(t/86),freeze=t>=89;
  scene=<><City frame={frame} rain={!freeze}/>
   <Header mini={freeze?'The consequence':'No protection'} title={freeze?'NOT SURVIVAL.':'INCOMING!'} accent={P.red}/>
   <Human x={540} y={1280} s={1.8} rot={-12} pose="fall"/>
   <g transform={'translate('+x+' 1150)'}>
    <path d="M-210 140 L-110 20 H105 L215 140 L232 288 H-232Z"
      fill="#263146" stroke="#95A4BB" strokeWidth="13"/>
    <rect x="-104" y="55" width="208" height="95" rx="10" fill="#8CACBC"/>
    <rect x="-187" y="185" width="90" height="56" rx="11" fill="#FFF1B0"/>
    <rect x="95" y="185" width="90" height="56" rx="11" fill="#FFF1B0"/>
    <rect x="-205" y="266" width="410" height="17" rx="8" fill="#B1C3D4"/>
    <circle cx="-158" cy="293" r="30" fill="#090E19"/>
    <circle cx="157" cy="293" r="30" fill="#090E19"/>
   </g>
   {freeze&&<g>
    <rect width="1080" height="1920" fill={P.bg} opacity=".86"/>
    <path d="M110 670 H970 M110 1150 H970" stroke={P.red} strokeWidth="8"/>
    {words('HE GUARANTEED',820,72)}
    {words('HIS ESCAPE.',928,86,P.mint)}
    {words('NOT HIS SURVIVAL.',1070,69,P.red)}
    {words('ONE CHANCE AT A TIME',1490,43,P.muted)}
   </g>}
  </>;break;
 }
 }
 return <svg viewBox="0 0 1080 1920" width="100%" height="100%"
  xmlns="http://www.w3.org/2000/svg" style={{display:'block',background:P.bg}}>
  <defs>
   <linearGradient id="dusk" x1="0" y1="0" x2=".7" y2="1">
    <stop offset="0" stopColor="#060C19"/><stop offset="1" stopColor="#263B60"/>
   </linearGradient>
   <linearGradient id="citysky" x1="0" y1="0" x2=".4" y2="1">
    <stop offset="0" stopColor="#081020"/><stop offset="1" stopColor="#354768"/>
   </linearGradient>
   <linearGradient id="cave" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="#17223A"/><stop offset="1" stopColor="#060911"/>
   </linearGradient>
  </defs>
  <g opacity={fade}>{scene}</g>
  <rect x="25" y="25" width="1030" height="1870" rx="24" fill="none"
    stroke="#D5E8FA" strokeOpacity=".13" strokeWidth="3"/>
  <rect x="65" y="1825" width="950" height="5" fill="#D5E8FA" opacity=".2"/>
  <rect x="65" y="1825" width={950*frame/(TOTAL_FRAMES-1)} height="5" fill={P.mint}/>
  <text x="75" y="1880" fontSize="25" fill={P.muted} fontFamily="Arial" letterSpacing={2}>
   WHAT IF? / EPISODE 01
  </text>
  </svg>;
};
export const ProbabilityControl:React.FC=()=>{
 const f=useCurrentFrame();
 return <AbsoluteFill style={{backgroundColor:P.bg}}><Frame frame={f}/></AbsoluteFill>;
};
export const ProbabilityControlBoard:React.FC=()=>{
 const n=useCurrentFrame(), s=SHOTS[Math.min(n,SHOTS.length-1)];
 return <AbsoluteFill style={{backgroundColor:P.bg}}><Frame frame={s.key}/></AbsoluteFill>;
};
