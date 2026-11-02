import React from 'react';
import { Bokeh, NightSky, Foreground } from '../kit';
import { FONT } from '../fonts';
import { clamp, easeOut, rnd } from '../anim';

export const PC = {
  dark:'#0A1020', wall:'#263550', text:'#F6EFE3',
  gold:'#FFC66A', mint:'#6BE3C4', red:'#FF6170', dim:'#8CA7BF',
  blue:'#9FC6FF', asphalt:'#303D55'
};

/** Reusable night exterior: layered skyline, road, lamp-light and optional rain. */
export const ProbabilityStreet:React.FC<{t:number;rain?:boolean;crack?:number;pit?:number;id?:string}>=
({t,rain=false,crack=0,pit=0,id='pc'})=><g>
  <NightSky id={id+'sky'} x0={-100} y0={-100} w={1280} h={2200} horizonY={1370}/>
  {Array.from({length:11},(_,i)=>{
    const x=i*120-70,h=250+rnd(9,i)*500;
    return <g key={i}>
      <rect x={x} y={1450-h} width={100} height={h} fill={i%2?'#15223B':'#1B2943'}/>
      {Array.from({length:7},(_,j)=>
        <rect key={j} x={x+19+(j%2)*45}
          y={1450-h+50+Math.floor(j/2)*110} width={15} height={24}
          fill={PC.gold} opacity={.13+rnd(i,j)*.33}/>)}
    </g>;
  })}
  <circle cx={820} cy={720} r={245} fill="#FFD691" opacity={.08}/>
  <path d="M820 700 L525 1470 L1080 1470" fill="#FFE2A0" opacity={.07}/>
  <path d="M820 520 L820 1450" stroke="#42506A" strokeWidth={16}/>
  <path d="M758 522 Q820 452 872 525" fill="none" stroke="#42506A" strokeWidth={16}/>
  <circle cx={820} cy={533} r={48} fill={PC.gold}/>
  <circle cx={820} cy={533} r={105} fill={PC.gold} opacity={.12}/>
  <Bokeh seed={17} n={14} x0={100} y0={420} w={960} h={950} t={t} o={.13}/>
  <rect x="0" y="1450" width="1080" height="500" fill={PC.asphalt}/>
  <path d="M0 1450 H1080" stroke="#8D98AA" strokeWidth={13}/>
  {Array.from({length:4},(_,i)=><path key={i} d={'M'+(i*330+65)+' 1730 h145'}
    stroke="#D8C7A4" strokeWidth={12} strokeLinecap="round"/>)}
  {crack>0&&<g>
     <path d="M530 1440 L480 1500 L550 1530 L480 1600 L560 1660 L520 1750"
       stroke="#090E19" strokeWidth={20+55*clamp(crack)} fill="none"/>
     <path d="M530 1440 L480 1500 L550 1530 L480 1600"
       stroke={PC.gold} strokeWidth={4} fill="none" opacity={.65}/>
     {pit>0&&<g>
       <rect x={530-260*pit} y="1490" width={520*pit} height="480" fill="#05070D"/>
       <path d={'M'+(530-260*pit)+' 1470 L'+(530-200*pit)+' 1570 M'+(530+260*pit)+' 1470 L'+(530+170*pit)+' 1590'}
         stroke="#838EA0" strokeWidth={11} fill="none"/>
     </g>}
  </g>}
  {rain&&<g>
    {Array.from({length:55},(_,i)=>{
      const x=(i*187+70)%1130,y=(i*231+t*19)%2030-80;
      return <path key={i} d={'M'+x+' '+y+' l-14 56'} stroke={PC.blue} strokeWidth={2}
        opacity={.2+rnd(i,4)*.26}/>;
    })}
  </g>}
  <Foreground blur={10}>
   <path d="M-40 1600 Q55 1360 145 1490 L80 1940 H-40 Z" fill="#0B1020" opacity={.6}/>
  </Foreground>
</g>;

export const ProbabilityCoin:React.FC<{x:number;y:number;t:number;s?:number}>=({x,y,t,s=1})=>{
 const turn=Math.max(.08,Math.abs(Math.cos(t*.19)));
 return <g transform={'translate('+x+' '+y+') scale('+s+')'}>
    <ellipse rx={115*turn} ry={124} fill={PC.gold} stroke="#FFE9B1" strokeWidth={13}/>
    {turn>.55&&<text x={0} y={30} fontFamily={FONT.title} fontSize={90}
      fontWeight={900} fill="#755123" textAnchor="middle">H</text>}
   </g>;
};

export const ProbabilityLottery:React.FC<{t:number;x?:number;y?:number}>=
({t,x=540,y=890})=><g transform={'translate('+x+' '+y+')'}>
  <rect x="-440" y="-245" width="880" height="500" rx="38" fill="#19263C"
    stroke={PC.gold} strokeWidth={10}/>
  <rect x="-383" y="-190" width="765" height="80" rx="15" fill="#102036"/>
  <text x="0" y="-138" fill={PC.gold} fontFamily={FONT.ui} textAnchor="middle"
    fontSize={47} letterSpacing={4}>LUCKY DRAW</text>
  {[0,1,2,3].map(i=><g key={i}>
    <rect x={-386+i*198} y="-58" width="177" height="200" rx="20" fill="#E6EAEF"/>
    <text x={-300+i*198} y="79" textAnchor="middle" fontFamily={FONT.ui}
      fontSize={112} fontWeight={800} fill="#19263A">{t>32?'7':(Math.floor(t/4)+i*3)%10}</text>
  </g>)}
  <rect x="-230" y="186" width="460" height="30" rx="15"
    fill={t>32?PC.mint:'#74849A'}/>
</g>;

export const ChancePanel:React.FC<{label:string;value:string;y?:number;active?:boolean;color?:string;t?:number}>=
({label,value,y=770,active=true,color=PC.mint,t=30})=><g opacity={active?1:.27}
  transform={'translate(0 '+(8*(1-easeOut(clamp(t/10))))+')'}>
  <rect x="90" y={y} width="900" height="235" rx="34"
    fill="#102036" stroke={color} strokeWidth={active?5:3}/>
  <circle cx="144" cy={y+52} r="11" fill={color}/>
  <text x="180" y={y+67} fill={PC.dim} fontFamily={FONT.ui} fontSize={37}
    letterSpacing={3}>{label}</text>
  <text x="165" y={y+188} fill={color} fontFamily={FONT.ui} fontWeight={800}
    fontSize={118}>{value}</text>
</g>;

export const ProbabilityTruck:React.FC<{x:number;y:number;t:number;scale?:number}>=
({x,y,t,scale=1})=><g transform={'translate('+x+' '+y+') scale('+scale+')'}>
  <path d="M-240 135 L-155 -20 H150 L245 135 L270 350 H-265 Z"
    fill="#202B3E" stroke="#BAC7D6" strokeWidth={13}/>
  <path d="M-125 20 H119 L165 140 H-160 Z" fill="#729DB3" stroke="#A2BAC7" strokeWidth={5}/>
  <rect x="-215" y="220" width="105" height="63" rx="12" fill="#FFF4CD"/>
  <rect x="108" y="220" width="105" height="63" rx="12" fill="#FFF4CD"/>
  <rect x="-235" y="324" width="470" height="20" rx="10" fill="#BFCAD7"/>
  <circle cx="-180" cy="363" r="33" fill="#0A0B11"/>
  <circle cx="178" cy="363" r="33" fill="#0A0B11"/>
  <circle cx="-160" cy="244" r="110" fill={PC.gold} opacity={.10+.03*Math.sin(t*.12)}/>
  <circle cx="158" cy="244" r="110" fill={PC.gold} opacity={.10+.03*Math.sin(t*.12)}/>
</g>;

export const RockBurst:React.FC<{t:number;x?:number;y?:number;size?:number}>=
({t,x=540,y=1480,size=1})=><g>
  {Array.from({length:25},(_,i)=>{
   const a=2.399*i,r=(100+13*i)*easeOut(clamp(t/35))*size;
   const xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r;
   return <rect key={i} x={xx} y={yy} width={18+15*(i%4)} height={21+8*(i%5)}
     fill={i%2?'#5A6B81':'#8797AB'}
     transform={'rotate('+(t*4+i*37)+' '+xx+' '+yy+')'}/>;
  })}
</g>;

export const ProbabilityCave:React.FC<{t:number}>=({t})=><g>
 <rect width="1080" height="1920" fill="#0B0F1B"/>
 <path d="M0 0 H1080 L930 690 L830 560 L690 850 L520 690 L270 840 L90 580 Z" fill="#313E56"/>
 <path d="M0 1430 L180 1090 L380 1330 L535 1150 L750 1290 L960 1040 L1080 1200 V1920 H0Z" fill="#435069"/>
 <path d="M150 300 L590 190 L760 1170 L680 1270 Z" fill="#6E8CA9" opacity={.07}/>
 <path d="M0 1680 L355 1530 L610 1810 L500 1920 H0 Z" fill="#6B788D"/>
 <path d="M830 920 L1080 1080 V1540 L710 1280 Z" fill="#6D798F" stroke="#8795AD" strokeWidth={10}/>
 <path d="M0 1180 L380 1030 L550 1390 L240 1530 Z" fill="#65738D" stroke="#8795AD" strokeWidth={10}/>
 {Array.from({length:30},(_,i)=>{const x=rnd(37,i)*1080,y=rnd(38,i)*1920;
 return <circle key={i} cx={x} cy={y} r={1.5+rnd(39,i)*3} fill={PC.blue}
 opacity={.12+.15*Math.abs(Math.sin(t*.018+i))}/>;})}
</g>;
