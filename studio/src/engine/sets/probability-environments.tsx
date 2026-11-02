import React from 'react';
import { clamp, easeOut, rnd } from '../anim';
import { Bokeh, Foreground, NightSky } from '../kit';

/**
 * Probability Episode background library.
 * Code-drawn, deterministic, phone-first 1080x1920 SVG scenery.
 * Shared, physically located light sources and three depth planes replace
 * empty purple gradients. The original engine / rig stays untouched.
 */
const K = {
  dark:'#090F20', ink:'#101A2D', blue:'#8ABFFF', orange:'#FFCA82',
  teal:'#65DBCD', cream:'#F3E9D8', pavement:'#2B384C', shadow:'#111B2C',
};
const rr=(s:number,i:number)=>rnd(s,i);
const lightWindow=(x:number,y:number,w:number,h:number)=><g>
  <rect x={x-14} y={y-14} width={w+28} height={h+28} rx={13} fill="#0C1425" stroke="#61738B" strokeWidth={9}/>
  <rect x={x} y={y} width={w} height={h} fill="#142A43"/>
  <rect x={x} y={y+h*.56} width={w} height={h*.44} fill="#2C4967" opacity=".5"/>
  <circle cx={x+w*.72} cy={y+h*.22} r={34} fill="#E7E9DD"/>
  <circle cx={x+w*.72} cy={y+h*.22} r={78} fill="#D8E5FF" opacity=".1"/>
  {Array.from({length:8},(_,i)=>{
    const bx=x+i*w/8, bh=75+rr(8,i)*150;
    return <g key={i}>
      <rect x={bx} y={y+h-bh} width={w/8-3} height={bh} fill={i%2?'#0A182C':'#142339'}/>
      <rect x={bx+7} y={y+h-bh+24} width="6" height="10" fill="#FFC986" opacity={.2+rr(i,3)*.55}/>
    </g>;
  })}
  <path d={'M'+(x+w/2)+' '+y+' V'+(y+h)+' M'+x+' '+(y+h*.56)+' H'+(x+w)}
    stroke="#A1AEC6" strokeWidth={11} opacity=".72"/>
  <path d={'M'+(x+5)+' '+(y+8)+' L'+(x+35)+' '+(y+8)+' L'+(x+35)+' '+(y+h-10)}
    stroke="#D7E9FF" strokeWidth={5} opacity=".16" fill="none"/>
</g>;

/** A consistent, populated room for character, coin-result and protection beats. */
export const ChanceRoom:React.FC<{t:number;dim?:boolean}>=({t,dim=false})=><g>
  <defs>
    <linearGradient id="pcRoomWall" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#2B3150"/><stop offset=".62" stopColor="#31364C"/><stop offset="1" stopColor="#151D30"/>
    </linearGradient>
    <linearGradient id="pcRoomFloor" x1="0" y1="0" x2=".9" y2="1">
      <stop offset="0" stopColor="#3D3541"/><stop offset="1" stopColor="#151D2B"/>
    </linearGradient>
    <radialGradient id="pcRoomWarm">
      <stop offset="0" stopColor="#FFD08D" stopOpacity=".43"/><stop offset="1" stopColor="#FFD08D" stopOpacity="0"/>
    </radialGradient>
    <linearGradient id="pcRoomBeam" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#B7DEFF" stopOpacity=".24"/><stop offset="1" stopColor="#B7DEFF" stopOpacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#pcRoomWall)"/>
  <path d="M0 1350 H1080 V1920 H0Z" fill="url(#pcRoomFloor)"/>
  <path d="M0 0 H1080 V103 H0Z" fill="#181D33"/>
  <path d="M0 1310 H1080 V1356 H0Z" fill="#151C2E"/>
  <path d="M0 200 H1080 M0 800 H1080" stroke="#BDB0B4" strokeWidth={2} opacity=".09"/>
  {Array.from({length:13},(_,i)=><g key={i}>
    <path d={'M'+(i*104-90)+' 1350 L'+(540+(i-5)*190)+' 1920'} stroke="#826E78" strokeWidth={2.5} opacity=".21"/>
    <path d={'M0 '+(1415+i*48)+' H1080'} stroke="#997D78" strokeWidth={2} opacity=".12"/>
  </g>)}
  {/* Actual cold light source: the moon through a mullioned window. */}
  <path d="M455 615 L700 1880 L0 1880 L0 615Z" fill="url(#pcRoomBeam)" opacity=".45"/>
  {lightWindow(85,535,338,510)}
  <path d="M75 512 Q110 536 105 750 L108 1100 L52 1110 L50 509Z" fill="#4C4964"/>
  <path d="M435 512 Q403 556 422 730 L453 1110 L492 1106 L489 508Z" fill="#444159"/>
  {[88,110,435,451].map((x,i)=><path key={i} d={'M'+x+' 556 V1080'} stroke="#76708B" strokeWidth={5} opacity=".32"/>)}
  <rect x="63" y="510" width="434" height="15" rx={6} fill="#BFB0A8"/>
  {/* Warm light: practical pendant and a grounded reading lamp. */}
  <path d="M786 0 V290" stroke="#141827" strokeWidth={11}/>
  <path d="M722 287 Q788 238 851 287 L880 350 H691Z" fill="#8F6671" stroke="#292638" strokeWidth={9}/>
  <ellipse cx="786" cy="352" rx={79} ry={25} fill="#FFE5AD"/>
  <ellipse cx="786" cy="665" rx={410} ry={430} fill="url(#pcRoomWarm)"/>
  <path d="M711 367 L420 1350 L1050 1350 L860 367Z" fill="#FFDF9F" opacity=".047"/>
  {/* Bookcase and objects at an independent depth. */}
  <rect x="797" y="613" width="238" height="650" rx={8} fill="#242840" stroke="#6B5360" strokeWidth={15}/>
  {[770,927,1080].map((y,i)=><g key={i}>
    <rect x="800" y={y} width="231" height={20} fill="#74575C"/>
    {Array.from({length:7},(_,j)=>{
      const bx=810+j*30,w=15+(j%3)*5,h=65+((j*17+i*13)%41);
      return <rect key={j} x={bx} y={y-h} width={w} height={h}
        fill={['#8A646B','#526C82','#A08373','#3E6D69','#5A557B'][(j+i)%5]}
        stroke="#151F32" strokeWidth={2}/>;
    })}
  </g>)}
  <rect x="875" y="525" width="90" height="73" fill="#1C2136" stroke="#947F80" strokeWidth={6}/>
  <path d="M895 580 L917 555 L940 575 L956 551" fill="none" stroke="#D1B58F" strokeWidth={5}/>
  {/* Small side cabinet and mug: physical grounding, no objects floating. */}
  <rect x="757" y="1427" width="304" height="150" rx={14} fill="#342F41"/>
  <rect x="747" y="1413" width="323" height="25" rx={6} fill="#A18B82"/>
  <rect x="792" y="1572" width={15} height={115} fill="#2A2635"/>
  <rect x="1035" y="1572" width={14} height={115} fill="#2A2635"/>
  <ellipse cx="875" cy="1415" rx={48} ry={9} fill="#0C1928" opacity=".3"/>
  <path d="M847 1354 H892 L885 1407 H856Z" fill="#B9A6A0"/>
  <path d="M889 1363 Q929 1354 919 1384 Q913 1395 889 1390" fill="none" stroke="#B9A6A0" strokeWidth={8}/>
  {Array.from({length:14},(_,i)=><circle key={i}
    cx={435+rr(34,i)*440} cy={495+rr(35,i)*710+t*.16%35}
    r={1.5+rr(36,i)*2} fill="#FFDFB6" opacity={.18+rr(38,i)*.23}/>)}
  {/* Foreground silhouette creates depth but stays away from hero's central lane. */}
  <Foreground blur={6}><path d="M-20 1880 Q10 1590 80 1580 L147 1920 H-20Z" fill="#0A111E" opacity=".44"/></Foreground>
  {dim&&<rect width="1080" height="1920" fill="#08101E" opacity=".32"/>}
</g>;

/** Top-down tabletop insert instead of a free-floating coin on empty gradient. */
export const ChanceDesk:React.FC<{t:number}>=({t})=><g>
  <defs>
    <linearGradient id="pcDesk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#72515C"/><stop offset=".48" stopColor="#3C3749"/><stop offset="1" stopColor="#1C293D"/>
    </linearGradient>
    <radialGradient id="pcDeskPool">
      <stop offset="0" stopColor="#FFD6A4" stopOpacity=".22"/><stop offset="1" stopColor="#FFD6A4" stopOpacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1920" fill="#0E1728"/>
  <rect y="480" width="1080" height="1170" rx={13} fill="url(#pcDesk)" stroke="#B08C7D" strokeWidth={15}/>
  {[600,780,980,1220,1460].map((y,i)=><path key={i} d={'M0 '+y+' Q540 '+(y+20)+' 1080 '+(y-20)}
    fill="none" stroke="#CBA18D" strokeWidth={3} opacity=".16"/>)}
  <circle cx="610" cy="1010" r={610} fill="url(#pcDeskPool)"/>
  <g transform="rotate(-8 175 790)">
    <rect x="-55" y="625" width={265} height={370} rx={14} fill="#E3D6B9"/>
    {Array.from({length:9},(_,i)=><path key={i} d={'M18 '+(680+i*30)+' H186'} stroke="#879FB6" strokeWidth={3} opacity=".68"/>)}
    <path d="M166 800 L217 841" stroke="#36455A" strokeWidth={9}/>
  </g>
  <g transform="rotate(11 945 1130)">
    <rect x="868" y="1065" width={260} height={302} rx={18} fill="#142238" stroke="#7F8190" strokeWidth={8}/>
    {Array.from({length:9},(_,i)=><path key={i} d={'M887 '+(1096+i*28)+' H1042'}
      stroke="#3C536A" strokeWidth={3}/>)}
  </g>
  <ellipse cx="895" cy="610" rx={99} ry={27} fill="#000" opacity=".15"/>
  <circle cx="890" cy="610" r={73} fill="#DAD0C7" stroke="#D5A98E" strokeWidth={10}/>
  <ellipse cx="889" cy="608" rx={51} ry={50} fill="#413D42"/>
  <path d="M954 580 Q1034 562 1028 620 Q1012 646 960 639" stroke="#D9D1C4" strokeWidth={17} fill="none"/>
  <path d="M0 1610 H1080" stroke="#C7BDB1" strokeWidth={13}/>
  <path d="M0 1660 H1080" stroke="#0F1B2B" strokeWidth={24}/>
</g>;

/** Original world, but now a proper environment for the lottery machine / win. */
export const ChanceKiosk:React.FC<{t:number}>=({t})=><g>
  <defs>
    <linearGradient id="pcKioskSky" x1="0" y1="0" x2=".5" y2="1">
      <stop offset="0" stopColor="#081124"/><stop offset="1" stopColor="#263850"/>
    </linearGradient>
    <radialGradient id="pcKioskGlow"><stop offset="0" stopColor="#FFC36E" stopOpacity=".27"/><stop offset="1" stopColor="#FFC36E" stopOpacity="0"/></radialGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#pcKioskSky)"/>
  {Array.from({length:8},(_,i)=>{
    const x=i*157-30,h=370+rr(32,i)*430;
    return <g key={i}><rect x={x} y={1390-h} width={136} height={h} fill={i%2?'#16253A':'#1E2D44'}/>
    {Array.from({length:10},(_,j)=><rect key={j} x={x+19+(j%2)*51} y={1390-h+70+Math.floor(j/2)*72}
      width={16} height={29} fill="#E6A56D" opacity={.12+rr(i,j)*.28}/>)}</g>;
  })}
  <circle cx="510" cy="720" r={700} fill="url(#pcKioskGlow)"/>
  <rect x="111" y="469" width="858" height="1075" rx={29} fill="#23334A" stroke="#B49C88" strokeWidth={15}/>
  <rect x="138" y="515" width="805" height="141" rx={20} fill="#462A42" stroke="#F0C181" strokeWidth={8}/>
  <text x="540" y="603" textAnchor="middle" fontSize={54} fontWeight={800}
    fontFamily="Arial, sans-serif" fill="#FFE6B2" letterSpacing={7}>LUCKY NIGHT</text>
  <rect x="155" y="684" width="768" height="571" fill="#101F35" stroke="#62768C" strokeWidth={9}/>
  {Array.from({length:6},(_,i)=><g key={i}>
    <rect x={188+i*115} y="719" width={83} height={126} rx={7} fill="#203650"/>
    <rect x={194+i*115} y="725" width={70} height={113} rx={4} fill="#12253D"/>
    <circle cx={230+i*115} cy="781" r={24} fill="#FFCA79" opacity={.12+.15*Math.sin(t*.04+i)*Math.sin(t*.04+i)}/>
  </g>)}
  <rect x="154" y="1234" width="768" height="76" fill="#8A6671"/>
  <rect x="125" y="1300" width="838" height="45" rx={12} fill="#D2AA89"/>
  <rect x="177" y="1342" width="746" height="190" fill="#35405A"/>
  <rect x="730" y="1370" width="142" height="119" rx={8} fill="#1A233A"/>
  <rect x="747" y="1390" width="110" height="40" rx={5} fill="#3A817E"/>
  <rect x="181" y="1372" width="200" height="116" rx={8} fill="#22324A"/>
  <path d="M220 1425 H344 M220 1458 H313" stroke="#F1CBA7" strokeWidth={9} opacity=".5"/>
  <path d="M110 1547 L970 1547 L1080 1920 H0Z" fill="#222D43"/>
  {Array.from({length:12},(_,i)=><path key={i} d={'M0 '+(1620+i*29)+' H1080'} stroke="#BBAA98" strokeWidth={2} opacity=".09"/>)}
  <ellipse cx="540" cy="1650" rx={340} ry={88} fill="#FFC379" opacity=".055"/>
  <path d="M151 668 L151 1255 M933 668 L933 1255" stroke="#A1B8D2" strokeWidth={14} opacity=".15"/>
</g>;

/** Rooftop skyline title shot: deeper than a flat gradient and calmer for typography. */
export const ChanceOverlook:React.FC<{t:number}>=({t})=><g>
  <defs><linearGradient id="pcRooftopSky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="#10182B"/><stop offset=".67" stopColor="#49354F"/><stop offset="1" stopColor="#B76565"/>
  </linearGradient></defs>
  <rect width="1080" height="1920" fill="url(#pcRooftopSky)"/>
  <circle cx="817" cy="1048" r={185} fill="#FFD09B" opacity=".23"/>
  {Array.from({length:26},(_,i)=><circle key={i} cx={rr(44,i)*1080} cy={rr(45,i)*1100}
   r={rr(46,i)*2+1} fill="#FFF1C6" opacity={.2+.15*Math.sin(t*.025+i)*Math.sin(t*.025+i)}/>)}
  {Array.from({length:13},(_,i)=>{
   const x=i*100-70,h=150+rr(47,i)*430;
   return <g key={i}><rect x={x} y={1380-h} width={110} height={h} fill={i%2?'#252640':'#302941'}/>
    {Array.from({length:7},(_,j)=><rect key={j} x={x+14+(j%2)*47}
     y={1380-h+45+Math.floor(j/2)*76} width={12} height={17} fill="#F3C17B" opacity={.3+rr(i,j)*.25}/>)}
   </g>;
  })}
  <path d="M0 1400 H1080 V1920 H0Z" fill="#26293C"/>
  {Array.from({length:9},(_,i)=><path key={i} d={'M'+(i*150-90)+' 1410 L'+(540+(i-4)*200)+' 1920'}
   stroke="#736671" strokeWidth={2} opacity=".27"/>)}
  <path d="M0 1380 H1080 M0 1422 H1080" stroke="#9A8794" strokeWidth={15}/>
  {Array.from({length:10},(_,i)=><rect key={i} x={i*120} y={1268} width={12} height={176} fill="#302F46"/>)}
  <path d="M0 1285 H1080" stroke="#8D7D8F" strokeWidth={11}/>
  <path d="M0 1180 Q270 1135 540 1180 Q815 1225 1080 1162" fill="none" stroke="#33283C" strokeWidth={8}/>
  {Array.from({length:9},(_,i)=><g key={i}>
    <path d={'M'+(60+i*120)+' '+(1175+Math.sin(i*.7)*21)+' V'+(1240+Math.sin(i*.7)*21)}
      stroke="#E7C39C" strokeWidth={3}/>
    <circle cx={60+i*120} cy={1245+Math.sin(i*.7)*21} r={13} fill="#FFE0A8"/>
    <circle cx={60+i*120} cy={1245+Math.sin(i*.7)*21} r={28} fill="#FFD79A" opacity=".1"/>
  </g>)}
</g>;

/**
 * Rainy street: side facades, wet pavement, cast lamplight, world depth,
 * physical road geometry, and a sinkhole that still preserves the original action.
 */
export const ChanceStreet:React.FC<{t:number;rain?:boolean;crack?:number;pit?:number;id?:string}>=
({t,rain=false,crack=0,pit=0,id='street'})=><g>
  <defs>
    <linearGradient id="pcStreetSky" x1="0" y1="0" x2=".35" y2="1">
      <stop offset="0" stopColor="#081023"/><stop offset=".62" stopColor="#152641"/><stop offset="1" stopColor="#32435C"/>
    </linearGradient>
    <linearGradient id="pcStreetRoad" x1="0" y1="0" x2=".6" y2="1">
      <stop offset="0" stopColor="#3D4D62"/><stop offset="1" stopColor="#1A293F"/>
    </linearGradient>
    <radialGradient id="pcStreetLamp">
      <stop offset="0" stopColor="#FFE3AE" stopOpacity=".7"/><stop offset=".26" stopColor="#F6C58C" stopOpacity=".19"/>
      <stop offset="1" stopColor="#FFDA96" stopOpacity="0"/>
    </radialGradient>
    <linearGradient id="pcStreetBeam" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFE7BB" stopOpacity=".15"/><stop offset="1" stopColor="#FFE7BB" stopOpacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#pcStreetSky)"/>
  <circle cx="270" cy="280" r={92} fill="#DBE1F2" opacity=".6"/>
  <circle cx="270" cy="280" r={240} fill="#C3D9F5" opacity=".045"/>
  <path d="M0 1090 Q500 920 1080 1120 V1440 H0Z" fill="#5E5576" opacity=".13"/>
  {/* far silhouette layer + window texture */}
  {Array.from({length:17},(_,i)=>{
    const x=i*78-28,h=290+rr(67,i)*450;
    return <g key={i}>
      <rect x={x} y={1380-h} width={70} height={h} fill={i%2?'#18283F':'#1D2C44'}/>
      {Array.from({length:5},(_,j)=><rect key={j}
        x={x+13+(j%2)*29} y={1380-h+44+Math.floor(j/2)*79}
        width={12} height={20} fill={j%3===0?'#9FBACE':'#F2BF87'} opacity={.13+rr(i,j)*.33}/>)}
    </g>;
  })}
  {/* left block of midground buildings, alley still visible */}
  <path d="M0 375 H255 V1438 H0Z" fill="#1B2B41" stroke="#3C4B62" strokeWidth={9}/>
  <path d="M255 445 L368 535 V1435 H255Z" fill="#19263A"/>
  {[450,656,859,1062].map((y,i)=><g key={i}>
    <rect x={26} y={y} width={169} height={116} rx={4} fill="#0C1C30" stroke="#617184" strokeWidth={7}/>
    <rect x={36} y={y+9} width={149} height={98} fill={i%3===1?'#956A6E':'#4F758D'} opacity=".47"/>
    <path d={'M109 '+(y+10)+' V'+(y+110)} stroke="#A4B2C5" strokeWidth={6}/>
    <rect x={18} y={y+114} width={187} height={12} fill="#777B85"/>
  </g>)}
  <rect x={-5} y={1187} width={300} height={50} fill="#6E5260"/>
  <path d="M0 1238 H299 L360 1293 H0Z" fill="#354057"/>
  <path d="M0 1240 H300" stroke="#E2BD92" strokeWidth={5} opacity=".55"/>
  <rect x={50} y={1315} width={159} height={90} rx={3} fill="#17273D"/>
  <rect x={61} y={1326} width={138} height={69} rx={3} fill="#287E82" opacity=".51"/>
  {/* right-side buildings in perspective with framed storefronts */}
  <path d="M862 567 L1080 390 V1432 H862Z" fill="#263149" stroke="#445269" strokeWidth={10}/>
  {[740,930,1115].map((y,i)=><g key={i}>
   <path d={'M905 '+y+' H1046 V'+(y+119)+' H905Z'} fill="#121F35" stroke="#748399" strokeWidth={7}/>
   <rect x={915} y={y+10} width={120} height={95} fill={i===1?'#B57F79':'#647B93'} opacity=".45"/>
   <path d={'M969 '+(y+10)+' V'+(y+110)} stroke="#C6C3BF" strokeWidth={5}/>
  </g>)}
  <path d="M868 1260 H1080 V1335 H868Z" fill="#5C5462"/>
  <path d="M868 1334 H1080" stroke="#DBAA7C" strokeWidth={8}/>
  {/* curb, sidewalk, and reflective asphalt */}
  <rect x="0" y="1430" width="1080" height="70" fill="#52576A"/>
  <path d="M0 1430 H1080" stroke="#9297A5" strokeWidth={13}/>
  <rect y="1500" width="1080" height="420" fill="url(#pcStreetRoad)"/>
  <path d="M0 1500 H1080" stroke="#1B2939" strokeWidth={16}/>
  {Array.from({length:4},(_,i)=><path key={i} d={'M'+(65+i*300)+' 1765 h148'}
    stroke="#DCCDAA" strokeWidth={13} opacity=".78"/>)}
  {Array.from({length:13},(_,i)=>{
    const x=(i*137)%1100-30,y=1520+rr(81,i)*370,rx=55+rr(83,i)*125;
    return <g key={i}>
      <ellipse cx={x} cy={y} rx={rx} ry={8} fill="#6E8CA6" opacity=".10"/>
      <path d={'M'+(x-rx*.64)+' '+y+' q'+(rx*.64)+' 7 '+(rx*1.28)+' 0'}
        fill="none" stroke="#C6DDF1" strokeWidth={2} opacity=".16"/>
    </g>;
  })}
  {/* Pole, visible light fixture, bloom, beams, and wet-road reflection. */}
  <path d="M818 1460 V476 Q817 400 877 405 H932" stroke="#172335" strokeWidth={26} fill="none"/>
  <path d="M818 1460 V476 Q817 400 877 405 H932" stroke="#6C7486" strokeWidth={8} fill="none"/>
  <path d="M926 397 h58 v30 q-29 30 -58 0Z" fill="#D5C2A0" stroke="#394356" strokeWidth={8}/>
  <circle cx="952" cy="433" r={38} fill="#FFDE9D"/>
  <circle cx="952" cy="433" r={204} fill="url(#pcStreetLamp)"/>
  <path d="M934 468 L670 1510 H1080 L979 468Z" fill="url(#pcStreetBeam)" opacity=".71"/>
  <ellipse cx="865" cy="1550" rx={190} ry={28} fill="#F5D5A3" opacity=".12"/>
  <path d="M948 1485 L1006 1870 L918 1870 L942 1485Z" fill="#E4B77A" opacity=".035"/>
  <Bokeh seed={34} n={10} x0={60} y0={480} w={1020} h={870} t={t} o={.11}/>
  {/* The road crack and hole remain structurally compatible with existing animation. */}
  {crack>0&&<g>
    <path d="M535 1450 L482 1521 L559 1557 L480 1620 L565 1695 L527 1811"
      stroke="#0B0E1A" strokeWidth={14+55*clamp(crack)} fill="none"/>
    <path d="M535 1450 L482 1521 L559 1557" fill="none" stroke="#D4C2B1" strokeWidth={4} opacity=".6"/>
    <path d="M482 1521 L408 1540 M559 1557 L683 1567 M480 1620 L357 1680"
      stroke="#0B0E1A" strokeWidth={5+10*crack} fill="none"/>
    {pit>0&&<g>
      <path d={'M'+(535-270*pit)+' 1497 L'+(535+230*pit)+' 1485 L'+(535+290*pit)+' 1900 L'+(535-260*pit)+' 1920Z'}
        fill="#060A12"/>
      <path d={'M'+(535-270*pit)+' 1497 L'+(535-196*pit)+' 1580 L'+(535-215*pit)+' 1640 M'+(535+230*pit)+' 1485 L'+(535+172*pit)+' 1580 L'+(535+201*pit)+' 1660'}
        stroke="#8591A6" strokeWidth={11} fill="none"/>
      <path d={'M'+(535-210*pit)+' 1610 L'+(535-92*pit)+' 1700 M'+(535+190*pit)+' 1660 L'+(535+103*pit)+' 1715'}
        stroke="#506278" strokeWidth={9}/>
    </g>}
  </g>}
  {/* atmospheric rain and foreground framing */}
  {rain&&<g>
    {Array.from({length:61},(_,i)=>{
      const x=(i*187+73)%1140,y=(i*243+t*23)%2070-85;
      return <path key={i} d={'M'+x+' '+y+' l-15 67'} stroke="#B7D8F1" strokeWidth={i%4===0?3:2}
        opacity={.13+rr(i,5)*.25}/>;
    })}
  </g>}
  <Foreground blur={6}>
    <path d="M-20 1720 Q30 1530 66 1600 L145 1920 H-20Z" fill="#081320" opacity=".64"/>
  </Foreground>
</g>;

/** Rocks with fractures, rebar, and a shaft of exterior light: claustrophobic but readable. */
export const ChanceCave:React.FC<{t:number}>=({t})=><g>
  <defs>
    <linearGradient id="pcCaveBack" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#151D32"/><stop offset="1" stopColor="#080D17"/>
    </linearGradient>
    <linearGradient id="pcCaveLight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#B9DDF9" stopOpacity=".31"/><stop offset="1" stopColor="#B9DDF9" stopOpacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#pcCaveBack)"/>
  <path d="M0 0 H1080 L972 460 L864 578 L744 498 L610 725 L438 590 L286 741 L82 540Z" fill="#39465D"/>
  <path d="M0 300 L120 420 L248 250 L375 525 L455 410 L530 690 L0 1100Z" fill="#26354A"/>
  <path d="M1080 200 L910 350 L865 650 L754 730 L804 1055 L1080 1190Z" fill="#303C53"/>
  <path d="M465 20 L625 40 L799 1690 L380 1560Z" fill="url(#pcCaveLight)"/>
  <path d="M500 0 H601" stroke="#D0DFF0" strokeWidth={17} opacity=".38"/>
  {/* stepped fracture strata, not randomly floating rectangles */}
  {Array.from({length:11},(_,i)=>{
    const x=rr(95,i)*1080,y=140+rr(96,i)*1350;
    return <path key={i} d={'M'+x+' '+y+' l'+(38+rr(97,i)*110)+' '+(26+rr(98,i)*65)+' l'+(30+rr(99,i)*38)+' -'+(10+rr(100,i)*31)}
      fill="none" stroke="#8C98AA" strokeWidth={3.5} opacity=".18"/>;
  })}
  <path d="M0 1390 L150 1130 L330 1215 L430 1000 L610 1340 L770 1080 L965 1180 L1080 1080 V1920 H0Z" fill="#3C495D"/>
  <path d="M0 1515 L210 1390 L398 1610 L550 1410 L740 1645 L1080 1300 V1920 H0Z" fill="#576579"/>
  {/* Rebar exposed in damaged concrete */}
  <path d="M56 1050 L305 1310 M87 1018 L344 1285 M795 1136 L999 990" stroke="#8B5E58" strokeWidth={14}/>
  {Array.from({length:6},(_,i)=><path key={i} d={'M'+(79+i*41)+' '+(1072+i*42)+' l34 32'}
    stroke="#BE8F7A" strokeWidth={5}/>)}
  <path d="M0 1170 L344 1000 L521 1350 L233 1530 L0 1460Z" fill="#79859B" stroke="#A6B2C3" strokeWidth={9}/>
  <path d="M857 950 L1080 1120 V1580 L707 1370Z" fill="#75849B" stroke="#A6B2C3" strokeWidth={10}/>
  <path d="M0 1710 L400 1520 L630 1840 L525 1920 H0Z" fill="#6C7B90"/>
  <path d="M836 1490 L1080 1300 V1920 H810Z" fill="#344056"/>
  {Array.from({length:46},(_,i)=>{
    const x=rr(101,i)*1080,base=rr(102,i)*1860;
    return <circle key={i} cx={x} cy={(base+t*(.2+rr(103,i)*.35))%1920}
      r={1+rr(104,i)*3.3} fill="#D1D8DF" opacity={.13+rr(105,i)*.28}/>;
  })}
  <ellipse cx="535" cy="1430" rx={275} ry={195} fill="#B5CFE2" opacity=".044"/>
</g>;
