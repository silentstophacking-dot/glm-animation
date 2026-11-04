import React from 'react';
export const LabBenchGlassware:React.FC=()=> <g>
  <g stroke="#91818A" strokeWidth="3" fill="none">
   <path d="M285 707v-87h55v87M284 634h57M298 619v-36h27v36"/>
   <path d="M365 705v-112m-21 2h44m-11 0v70"/>
   <path d="M428 704q-31 -9 -20 -36l17 -24v-35h16v35l15 24q14 28 -13 36Z"/>
  </g>
  <path d="M410 685Q435 672 453 685L444 701H423Z" fill="#A89258" opacity=".8"/>
</g>;
// Existing window artwork, reusable behind a separately projected window frame.
export const LabWindowScenery:React.FC<{id:string;sunX?:number}>=({id,sunX=665})=>{
 const u=(n:string)=>`url(#${id+n})`;
 return <g><defs>
  <linearGradient id={id+'sky'} x2="0" y2="1"><stop stopColor="#A77880"/><stop offset=".5" stopColor="#E6AF85"/><stop offset="1" stopColor="#655773"/></linearGradient>
  <radialGradient id={id+'sun'}><stop stopColor="#FFF1C2"/><stop offset=".14" stopColor="#F9DBA4" stopOpacity=".85"/><stop offset=".5" stopColor="#EDB780" stopOpacity=".23"/><stop offset="1" stopColor="#E8B482" stopOpacity="0"/></radialGradient>
 </defs>
   <rect x="210" y="170" width="700" height="510" fill={u('sky')}/>
   <path d="M210 560L290 538L360 558L430 528L490 549L560 530L635 560L730 525L910 566V690H210Z" fill="#695A70" opacity=".65"/>
   {Array.from({length:15},(_,i)=><g key={i} opacity=".7">
    <rect x={215+i*48} y={480+(i%4)*32} width={32+i%3*8} height="220" fill="#53485F"/>
    {[0,1,2].map(j=><path key={j} d={`M${223+i*48} ${510+(i%4)*32+j*16}h14`} stroke="#BA9290" strokeWidth="3" opacity=".4"/>)}
   </g>)}
   <circle cx={sunX} cy="382" r="240" fill={u('sun')}/>
   <circle cx={sunX} cy="382" r="46" fill="#F9DEAE" opacity=".85"/>
   <path d="M210 293Q500 279 910 286M210 342Q500 328 910 335" stroke="#EFC5AA" strokeWidth="3" opacity=".17"/>
 </g>;
};
// Original SVG environment. Physical props and actors remain in the same world plane.
export const LabBackground:React.FC<{id:string;soft?:boolean}>=({id,soft=false})=>{
 const u=(s:string)=>`url(#${id+s})`;
 return <g>
 <defs>
  <linearGradient id={id+'wall'} x2=".8" y2="1"><stop stopColor="#322536"/><stop offset=".6" stopColor="#252237"/><stop offset="1" stopColor="#101D2A"/></linearGradient>
  <linearGradient id={id+'sky'} x2="0" y2="1"><stop stopColor="#A77880"/><stop offset=".5" stopColor="#E6AF85"/><stop offset="1" stopColor="#655773"/></linearGradient>
  <linearGradient id={id+'floor'} x2="0" y2="1"><stop stopColor="#50404B"/><stop offset="1" stopColor="#191C2A"/></linearGradient>
  <linearGradient id={id+'wood'} x2="0" y2="1"><stop stopColor="#655052"/><stop offset=".1" stopColor="#3E303C"/><stop offset="1" stopColor="#231F2E"/></linearGradient>
  <linearGradient id={id+'cabinet'} x2="1" y2=".3"><stop stopColor="#4A4555"/><stop offset=".2" stopColor="#292F43"/><stop offset="1" stopColor="#161E30"/></linearGradient>
  <linearGradient id={id+'beam'} x2="0" y2="1"><stop stopColor="#F5CCA0" stopOpacity=".16"/><stop offset="1" stopColor="#F5CCA0" stopOpacity="0"/></linearGradient>
  <radialGradient id={id+'sun'}><stop stopColor="#FFF1C2"/><stop offset=".14" stopColor="#F9DBA4" stopOpacity=".85"/><stop offset=".5" stopColor="#EDB780" stopOpacity=".23"/><stop offset="1" stopColor="#E8B482" stopOpacity="0"/></radialGradient>
  <radialGradient id={id+'pool'}><stop stopColor="#D9A376" stopOpacity=".22"/><stop offset="1" stopColor="#D9A376" stopOpacity="0"/></radialGradient>
  <filter id={id+'soft'} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={soft?3:.55}/></filter>
  <filter id={id+'haze'} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id={id+'rim'} x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="-1.3" dy="0" stdDeviation=".6" floodColor="#EAC08A" floodOpacity=".75"/></filter>
  <clipPath id={id+'window'}><rect x="210" y="170" width="700" height="510"/></clipPath>
 </defs>
 <rect x="-1200" y="-800" width="4500" height="2800" fill={u('wall')}/>
 <g filter={u('soft')}>
  <path d="M0 0H1920L1640 115H180Z" fill="#171725"/>
  <path d="M0 98H1920M0 131H1920" stroke="#100F1B" strokeWidth="18"/>
  {[110,520,980,1450].map(x=><g key={x}><path d={`M${x} 42h240l-35 18h-230Z`} fill="#655564" opacity=".38"/><path d={`M${x-40} 59h244`} stroke="#13131F" strokeWidth="8"/></g>)}
  <path d="M0 780H1920" stroke="#141623" strokeWidth="19"/>
  <rect x="192" y="150" width="736" height="548" rx="6" fill="#171823" stroke="#493847" strokeWidth="12"/>
  <g clipPath={u('window')}>
   <LabWindowScenery id={id+'windowView'}/>
  </g>
  <path d="M438 165V688M677 165V688M210 470H910" stroke="#322837" strokeWidth="12"/>
  <path d="M432 171V680M671 171V680" stroke="#B38C77" strokeWidth="2" opacity=".55"/>
  {Array.from({length:7},(_,i)=><path key={i} d={`M205 ${169+i*9}H915`} stroke="#3B2D39" strokeWidth="5" opacity=".8"/>)}
  <path d="M903 182V548" stroke="#9E806F" strokeWidth="1.4"/>
  <rect x="190" y="686" width="750" height="19" rx="3" fill="#62505A"/>
  <path d="M200 686H926" stroke="#D6AB88" strokeWidth="3" opacity=".45"/>
  {/* Recessed side wall and storage give the room a second plane. */}
  <path d="M1710 130L1920 30V780L1710 734Z" fill="#192332"/>
  <path d="M1512 199L1530 182H1704L1689 199Z" fill="#4F4755" stroke="#28283B" strokeWidth="3"/>
  <path d="M1689 198L1704 182V702L1689 721Z" fill="#101A2B"/>
  <rect x="1515" y="199" width="175" height="522" rx="3" fill={u('cabinet')} stroke="#403E51" strokeWidth="7"/>
  <path d="M1518 206V713" stroke="#897169" strokeWidth="2" opacity=".5"/>
  {[0,1,2].map(i=><g key={i}><rect x="1533" y={225+i*150} width="140" height="125" fill="#263044"/>
   {[0,1,2,3,4].map(j=>{
    const x=1540+j*24,y=263+i*150-(j%2)*18,h=70+(j%2)*18;
    return <g key={j}><rect x={x} y={y} width="15" height={h} rx="1" fill={['#615064','#665F65','#3C5365'][j%3]}/>
     <path d={`M${x+2} ${y+2}v${h-4}`} stroke="#A7938C" strokeWidth="1.2" opacity=".45"/>
     <path d={`M${x+4} ${y+12}h7m-7 5h7m-7 ${h-27}h7`} stroke="#C0A99A" strokeWidth="1.5" opacity=".5"/>
    </g>;
   })}
   <path d={`M1530 ${350+i*150}h143v7h-143Z`} fill="#464352"/>
   <path d={`M1532 ${350+i*150}h139`} stroke="#9C8175" strokeWidth="1.4" opacity=".4"/>
   <rect x="1531" y={225+i*150} width="141" height="121" fill="#779398" opacity=".025"/>
   <path d={`M1545 ${226+i*150}l48 121h18l-48 -121Z`} fill="#A4B8B5" opacity=".035"/>
  </g>)}
  <rect x="1100" y="216" width="300" height="206" rx="4" fill="#1C2333" stroke="#554B5A" strokeWidth="7"/>
  {[0,1,2,3,4].map(i=><path key={i} d={`M1120 ${240+i*34}H1382`} stroke="#73747D" strokeWidth="1" opacity=".15"/>)}
  <path d="M1130 370L1180 330L1240 350L1300 290L1360 308" stroke="#75838B" strokeWidth="3" fill="none"/>
  <circle cx="1042" cy="245" r="35" fill="#282A39" stroke="#6B6068" strokeWidth="4"/>
  <path d="M1042 224V245L1059 253" fill="none" stroke="#AC9992" strokeWidth="3"/>
  {/* Supported bench and grounded equipment; no floating decorative shapes. */}
  <rect x="175" y="705" width="1260" height="72" fill="#181A27" opacity=".5"/>
  <rect x="175" y="709" width="1260" height="52" fill={u('wood')}/>
  <path d="M190 760V801M1395 760V801" stroke="#191B28" strokeWidth="18"/>
  <path d="M175 710H1435" stroke="#A17C6D" strokeWidth="4" opacity=".65"/>
  {[0,1,2,3,4].map(i=><g key={i}><path d={`M${196+i*243} 724v28h220v-28`} stroke="#675360" strokeWidth="2" fill="none"/>
   <path d={`M${288+i*243} 737h32`} stroke="#A38D86" strokeWidth="3"/>
  </g>)}
  <LabBenchGlassware/>
  <path d="M1170 705v-60h75v60Z" fill="#393544" stroke="#64515C" strokeWidth="3"/>
  <path d="M1185 665h43m-43 12h31" stroke="#8D7C83" strokeWidth="3"/>
  {[0,1,2,3,4,5].map(i=><g key={i}><rect x={1270+i*20} y="666" width="11" height="35" rx="3" fill="#96816B" opacity=".65"/><rect x={1269+i*20} y="661" width="13" height="7" fill="#43394A"/></g>)}
 </g>
 <path d="M0 802H1920V1400H0Z" fill={u('floor')}/>
 <g stroke="#9B7F7E" opacity=".16" fill="none">
  {Array.from({length:13},(_,i)=><path key={i} d={`M${-800+i*310} 1400L${450+i*80} 802`} strokeWidth="2"/>)}
  {[850,920,1030,1190].map(y=><path key={y} d={`M0 ${y}H1920`} strokeWidth="1.6"/>)}
 </g>
 <ellipse cx="620" cy="870" rx="600" ry="115" fill={u('pool')}/>
 <g filter={u('haze')}>
 <path d="M220 480L900 480L1460 1080H-150Z" fill={u('beam')} opacity=".5"/>
 <path d="M435 470L472 470L760 1080H650Z" fill="#131420" opacity=".16"/>
 <path d="M677 470L710 470L1100 1080H1020Z" fill="#131420" opacity=".16"/>
 </g>
 </g>;
};
export const LabForeground:React.FC<{id:string}>=({id})=><g>
 <defs>
  <filter id={id+'fg'} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
  <radialGradient id={id+'vignette'}><stop offset=".35" stopColor="#080B15" stopOpacity="0"/><stop offset="1" stopColor="#080B15" stopOpacity=".7"/></radialGradient>
 </defs>
 <g filter={`url(#${id}fg)`}>
  <path d="M-120 1110V1030H2060V1110Z" fill="#110F1A"/>
  <path d="M30 1025L95 823V678H132V823L201 1025Z" fill="#8C6C52" opacity=".45"/>
  <path d="M51 1012L100 880H128L177 1012Z" fill="#B68B52" opacity=".45"/>
  <path d="M1710 1030L1780 840V652H1815V840L1880 1030Z" fill="#467078" opacity=".35"/>
  <path d="M1680 800V1030H1652V800Z" fill="#10131F"/>
  <path d="M345 1025V918L371 900L399 918V1025Z" fill="#5D4774" opacity=".5"/>
 </g>
 <rect width="1920" height="1080" fill={`url(#${id}vignette)`} pointerEvents="none"/>
</g>;
