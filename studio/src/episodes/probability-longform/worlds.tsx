import React from 'react';
import {Study, Desk, rnd, Glow} from '../../engine';

/**
 * Long-form landscape SVG stage library (1920x1080).
 *
 * All scenery is stationary in one WORLD coordinate system. A shot's ONE
 * camera may transform the entire World + actor + props together.
 * Rain, traffic and falling debris are the only independently animated items.
 */
const P={
  ink:'#0B101E',night:'#151B30',moon:'#AFCBE9',cream:'#F4E2C8',
  gold:'#FFCF8C',lamp:'#F4BE87',window:'#E7AB77',road:'#2D374A',
  teal:'#6AE8D0',red:'#FF6278'
};

const Windows:React.FC<{x:number;y:number;w:number;h:number;seed:number}>=({x,y,w,h,seed})=><g>
  {Array.from({length:5},(_,i)=>{
    const xx=x+16+(i%3)*27, yy=y+22+Math.floor(i/3)*37;
    return <rect key={i} x={xx} y={yy} width={12} height={16}
      fill={i%2===0?P.window:'#A6C8E5'} opacity={.18+.38*rnd(seed,i)}/>;
  })}
</g>;

export const StudioWorld:React.FC<{t:number;night?:boolean;desk?:boolean}>=
({t,night=false,desk=true})=><g>
  <rect width="1920" height="1080" fill="#1F1729"/>
  <Study id={night?'longformStudyNight':'longformStudyDay'} t={t} veil={.26}
    night={night}/>
  {desk&&<Desk x0={555} x1={1370} y={700}/>}
</g>;

export const MacroDesk:React.FC<{t:number}>=({t})=><g>
  <defs>
    <linearGradient id="longDesk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#745043"/>
      <stop offset="55%" stopColor="#5B3C3A"/>
      <stop offset="100%" stopColor="#281F2B"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="#261E2A"/>
  <path d="M-250 150 L2050 150 L2050 1150 L-250 1150Z"
    fill="url(#longDesk)" stroke="#A07861" strokeWidth={19}/>
  {Array.from({length:30},(_,i)=><path key={i}
    d={'M'+(-180+i*90)+' 1150 L'+(540+(-180+i*90-540)*.62)+' 125'}
    fill="none" stroke="#341F2B" strokeWidth={i%3===0?5:2.5}
    opacity=".39"/>)}
  {/* Props stay at fixed points on the table. */}
  <g transform="rotate(-8 355 400)">
    <rect x="180" y="205" width="345" height="405" rx={12}
      fill="#E9DEC9" stroke="#C4AD9A" strokeWidth={5}/>
    {[0,1,2,3,4,5].map(i=><path key={i}
      d={'M220 '+(292+i*45)+' H480'} stroke="#AAB1B9" strokeWidth={4}/>)}
  </g>
  <rect x="1450" y="205" width="440" height="320" rx={24}
    fill="#191F2F" stroke="#8894A2" strokeWidth={6}/>
  {[0,1,2,3,4].map(i=><path key={i}
    d={'M1490 '+(270+i*47)+' H1830'} stroke="#3D5269" strokeWidth={6}/>)}
  <circle cx={1120} cy={620} r={510} fill="#FFD7A6" opacity=".038"/>
  <Glow x={1120} y={560} r={440} o={.33}/>
</g>;

export const LotteryWorld:React.FC<{t:number}>=({t})=><g>
  <defs>
    <linearGradient id="longLotteryWall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1A2135"/>
      <stop offset="70%" stopColor="#384354"/>
      <stop offset="100%" stopColor="#1F2736"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#longLotteryWall)"/>
  <rect x={0} y={800} width={1920} height={280} fill="#242939"/>
  <path d="M0 825 H1920" stroke="#776B6C" strokeWidth={8}/>
  <rect x={405} y={120} width={1100} height={665} rx={27}
    fill="#1A273C" stroke="#AC8B77" strokeWidth={13}/>
  <rect x={445} y={151} width={1025} height={145} rx={14}
    fill="#5F3545" stroke="#E2AD84" strokeWidth={6}/>
  <text x={958} y={239} fill="#FBE1B0" textAnchor="middle"
    fontFamily="Arial, sans-serif" fontWeight={900}
    fontSize={70} letterSpacing={6}>LUCKY NIGHT</text>
  <rect x={465} y={330} width={985} height={350} rx={13}
    fill="#091827" stroke="#7A90A0" strokeWidth={8}/>
  <rect x={110} y={730} width={1700} height={70} fill="#6E5357"
    stroke="#B68C80" strokeWidth={10}/>
  <rect x={140} y={804} width={1640} height={220} fill="#322B38"/>
  {Array.from({length:7},(_,i)=><g key={i}>
    <rect x={520+i*125} y={405} width={92} height={142}
      fill="#20384C" stroke="#5D7085" strokeWidth={4}/>
    <circle cx={566+i*125} cy={466} r={17} fill="#FFD49C"
      opacity={.1+.15*Math.abs(Math.sin(t*.07+i))}/>
  </g>)}
  <Glow x={960} y={390} r={560} o={.36}/>
  {/* Grounded ticket shelf, contrast and physical receipt slot. */}
  <rect x={1330} y={696} width={295} height={38} rx={7}
    fill="#222031" stroke="#B89478" strokeWidth={4}/>
  <rect x={1390} y={706} width={154} height={9} rx={3} fill="#0A111C"/>
</g>;

export const OverlookWorld:React.FC<{t:number}>=({t})=><g>
  <defs><linearGradient id="longOverlook" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="#1E233D"/>
    <stop offset=".66" stopColor="#5E4760"/>
    <stop offset="1" stopColor="#C98A78"/>
  </linearGradient></defs>
  <rect width={1920} height={1080} fill="url(#longOverlook)"/>
  <circle cx={1450} cy={360} r={145} fill="#FFE1AF" opacity=".86"/>
  <circle cx={1450} cy={360} r={390} fill="#FFCB8B" opacity=".06"/>
  {Array.from({length:21},(_,i)=>{
    const x=i*104-85,h=100+390*rnd(31,i),y=820-h;
    return <g key={i}>
      <rect x={x} y={y} width={110} height={h} fill={i%2?'#41354F':'#544058'}/>
      <Windows x={x} y={y} w={90} h={h} seed={i+1}/>
    </g>;
  })}
  <rect x={0} y={814} width={1920} height={266} fill="#302C3D"/>
  {Array.from({length:13},(_,i)=><path key={i}
    d={'M'+(i*156-25)+' 820 L'+(960+(i-6)*225)+' 1080'}
    stroke="#8A6B77" strokeWidth={3} opacity=".23"/>)}
  <path d="M0 795 H1920 M0 824 H1920" stroke="#A28A83" strokeWidth={12}/>
  {[0,260,520,780,1040,1300,1560,1820].map(x=>
    <rect key={x} x={x} y={670} width={13} height={162} fill="#3A3246"/>)}
  <path d="M0 687 H1920" stroke="#817E89" strokeWidth={12}/>
</g>;

export const StreetWorld:React.FC<{
  t:number;rain?:boolean;crack?:number;pit?:number;construction?:boolean;
}>=({t,rain=true,crack=0,pit=0,construction=true})=><g>
  <defs>
    <linearGradient id="longStreetNight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#0A1125"/>
      <stop offset=".6" stopColor="#202F49"/>
      <stop offset="1" stopColor="#3E4859"/>
    </linearGradient>
    <linearGradient id="longStreetRoad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#374458"/>
      <stop offset="1" stopColor="#141B2E"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#longStreetNight)"/>
  <circle cx={370} cy={180} r={66} fill="#E1E6F0" opacity=".7"/>
  <circle cx={370} cy={180} r={195} fill="#A7CAE9" opacity=".05"/>
  {Array.from({length:24},(_,i)=>{
    const x=i*95-30,h=170+260*rnd(61,i),y=605-h;
    return <g key={i}>
      <rect x={x} y={y} width={104} height={h+30}
        fill={i%2?'#192840':'#142239'}/>
      <Windows x={x} y={y} w={104} h={h} seed={i*3}/>
    </g>;
  })}
  {/* Static perspective road. The actor and signage share this world. */}
  <path d="M0 1080 L665 578 H1250 L1920 1080Z" fill="url(#longStreetRoad)"/>
  <path d="M-200 1080 L634 579 L665 579 L100 1080Z" fill="#526078"/>
  <path d="M1820 1080 L1250 579 L1280 579 L2100 1080Z" fill="#435369"/>
  <path d="M960 590 V1090" stroke="#BBAE9E" strokeWidth={4} opacity=".18"
    strokeDasharray="25 70"/>
  {Array.from({length:12},(_,i)=>{
    const q=(i+1)/13,y=587+(1080-587)*q*q;
    return <path key={i} d={'M'+(960-1350*q*q)+' '+y+' H'+(960+1350*q*q)}
      stroke="#8091A4" strokeWidth={2+3*q} opacity={.07+.11*q}/>;
  })}
  {/* Stationary light poles, with their own practical glow. */}
  {[310,1690].map((x,i)=><g key={i}>
    <path d={'M'+x+' 205 V828'} stroke="#1C2435" strokeWidth={16}/>
    <path d={'M'+x+' 207 q0 -70 '+(i? -90:90)+' -70'}
      stroke="#1C2435" strokeWidth={12} fill="none"/>
    <ellipse cx={x+(i?-100:100)} cy={141} rx={29} ry={13}
      fill="#FFE8B5"/>
    <circle cx={x+(i?-100:100)} cy={240} r={195}
      fill="#FFD19B" opacity=".035"/>
  </g>)}
  {construction&&<g>
    <rect x={1245} y={555} width={410} height={185} rx={8}
      fill="#2E3040" stroke="#AF795F" strokeWidth={6}/>
    {[0,1,2,3].map(i=><path key={i}
      d={'M'+(1282+i*90)+' 570 l-95 151'} stroke="#D88A5A" strokeWidth={24}/>)}
    <text x={1450} y={616} fill="#EBC5AA" fontFamily="Arial" fontSize={30}
      fontWeight={800} textAnchor="middle">ROAD WORK</text>
  </g>}
  {/* Animated crack is a physical event, not a camera effect. */}
  {crack>0&&<g opacity={crack}>
    <path d={'M960 612 L'+(900-200*crack)+' '+(770+60*crack)+' L'+(1010+110*crack)+' '+(830+130*crack)+' L'+(850-160*crack)+' 1100'}
      stroke="#0A0F1A" strokeWidth={11+20*crack} fill="none"
      strokeLinejoin="round"/>
    <path d="M960 790 L1155 930 L1390 1015" stroke="#131826"
      strokeWidth={15*crack} fill="none"/>
  </g>}
  {pit>0&&<g opacity={pit}>
    <ellipse cx={960} cy={848} rx={340*pit} ry={134*pit}
      fill="#040710" stroke="#8796A9" strokeWidth={13}/>
    <ellipse cx={960} cy={852} rx={260*pit} ry={90*pit} fill="#09111D"/>
  </g>}
  {rain&&<g opacity=".5">
    {Array.from({length:95},(_,i)=>{
      const x=((i*207+Math.floor(t*13)*(2+i%3))%2420)-240;
      const y=((i*317+t*(9+i%5))%1390)-155;
      return <path key={i} d={'M'+x+' '+y+' l-11 44'}
        stroke="#B8CFE6" strokeWidth={i%5===0?2.5:1.5}
        opacity={.18+.20*rnd(8,i)}/>;
    })}
  </g>}
</g>;

export const CaveWorld:React.FC<{t:number;opening?:number}>=({t,opening=0})=><g>
  <defs><linearGradient id="longCave" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stopColor="#202B3C"/>
    <stop offset=".55" stopColor="#0D1728"/>
    <stop offset="1" stopColor="#0A0F1C"/>
  </linearGradient></defs>
  <rect width="1920" height="1080" fill="url(#longCave)"/>
  <path d="M0 0 H1920 L1770 340 L1550 215 L1300 417 L1010 180 L800 425 L520 268 L280 422Z"
    fill="#36475C"/>
  <path d="M0 310 L300 150 L500 510 L550 730 L0 940Z" fill="#233449"/>
  <path d="M1920 235 L1675 330 L1550 770 L1920 970Z" fill="#2B3A51"/>
  <path d="M900 0 L1140 0 L1355 920 L590 925Z"
    fill="#A5D3ED" opacity={.03+opening*.13}/>
  {/* Fixed strata. Foreground rocks should be added AFTER actor in the shot. */}
  {Array.from({length:11},(_,i)=>{
    const x=100+170*i,y=300+130*rnd(91,i);
    return <path key={i} d={'M'+x+' '+y+' l'+(70+i*4)+' '+(18+i*3)+' l55 -16'}
      fill="none" stroke="#7A8DA1" strokeWidth={4} opacity=".16"/>;
  })}
  <path d="M0 900 L170 790 L390 900 L620 850 L840 970 L1030 868
    L1290 990 L1550 835 L1920 950 V1100 H0Z"
    fill="#424C62" stroke="#627187" strokeWidth={9}/>
  <path d="M0 965 L250 920 L505 1010 L860 928 L1160 1020 L1580 935
    L1920 1000 V1100 H0Z" fill="#5A6477"/>
  {Array.from({length:37},(_,i)=>{
    const x=rnd(17,i)*1920,y=60+(rnd(18,i)*890+t*.23)%910;
    return <circle key={i} cx={x} cy={y} r={1.2+rnd(19,i)*2.9}
      fill="#CAD9E2" opacity={.09+.08*Math.sin(t*.09+i)**2}/>;
  })}
</g>;

export const CaveForeground:React.FC<{t:number;opening?:number}>=({t,opening=0})=><g>
  <path d={'M120 985 L440 '+(742-130*opening)+' L680 '+(770-120*opening)+
    ' L890 1010 L650 1110 H90Z'} fill="#566276"
    stroke="#8A96A7" strokeWidth={7}/>
  <path d={'M1170 '+(790-110*opening)+' L1430 '+(715-120*opening)+
    ' L1670 865 L1920 780 V1100 H1130Z'} fill="#48596B"
    stroke="#8797A7" strokeWidth={8}/>
  <path d="M330 784 L520 930 M1380 790 L1290 990" stroke="#997366"
    strokeWidth={12}/>
</g>;
