import React from 'react';
import {planeTransform,WorldCamera} from './pseudo-depth-camera';
import {W} from './lab-room-geometry';

/** OPT-IN cinematic world art: previous approved movies keep their old view. */
type Layer='far'|'mid'|'near';
const LOOK={
 far:{wall:'#86778C',side:'#665F79',edge:'#D9AD97',glass:'#F9D7B0',base:595,h:95,step:45,count:17},
 mid:{wall:'#62566D',side:'#333D56',edge:'#BF9B91',glass:'#F4CB9D',base:675,h:167,step:63,count:12},
 near:{wall:'#394055',side:'#1A2A41',edge:'#9C8992',glass:'#F0BC91',base:747,h:199,step:79,count:10}
};
const Roof:React.FC<{x:number;y:number;w:number;i:number;layer:Layer}>=({x,y,w,i,layer})=>{
 const palette=LOOK[layer];
 return <g>
  <path d={'M'+(x-4)+' '+(y+2)+'H'+(x+w+6)}
   stroke={palette.edge} strokeWidth="2" opacity=".65"/>
  {i%4===0?<path d={'M'+(x+5)+' '+y+'v-18h'+(w-10)+'v18Z'}
      fill={palette.side} stroke={palette.edge} strokeWidth="1"/>:null}
  {i%4===1?<path d={'M'+(x-3)+' '+y+'L'+(x+w/2)+' '+(y-18)+'L'+(x+w+3)+' '+y+'Z'}
      fill={palette.wall} stroke={palette.edge} strokeWidth="1"/>:null}
  {i%4===2?<path d={'M'+(x+w*.4)+' '+y+'v-25h'+(w*.2)+'v25'}
      fill={palette.side} stroke={palette.edge} strokeWidth="1"/>:null}
  {i%4===3?<path d={'M'+(x+9)+' '+y+'v-9h'+(w*.6)+'v9'}
      fill={palette.side} stroke={palette.edge} strokeWidth="1"/>:null}
  <path d={'M'+(x+w*.35)+' '+(y-3)+'v-21'}
      stroke={palette.edge} strokeWidth="1.3" opacity=".68"/>
  <circle cx={x+w*.35} cy={y-24} r="1.8" fill="#E5C8B0"/>
  <rect x={x+w*.7} y={y-12} width="10" height="12"
    fill={palette.side} stroke={palette.edge} strokeWidth=".8"/>
 </g>;
};
const Building:React.FC<{id:string;layer:Layer;i:number}>=({id,layer,i})=>{
 const p=LOOK[layer],x=200+i*p.step+(i%2)*5,w=p.step*.76+(i%3)*4;
 const height=p.h+((i*37+layer.length*15)%93)+(i%5===1?22:0);
 const y=p.base-height,depth=layer==='near'?12:layer==='mid'?8:4;
 const columns=w>57?4:3, floors=Math.floor(height/22);
 return <g opacity={layer==='far'?.47:layer==='mid'?.77:1}>
  <path d={'M'+x+' '+y+'h'+w+'v'+height+'h-'+w+'Z'} fill={p.wall}/>
  <path d={'M'+(x+w)+' '+y+'l'+depth+' -'+depth+'v'+(height-8)+'l-'+depth+' 8Z'}
    fill={p.side}/>
  <path d={'M'+(x+2)+' '+(y+5)+'v'+(height-5)}
    stroke={p.edge} strokeWidth="1.4" opacity=".5"/>
  <path d={'M'+(x+w-3)+' '+(y+5)+'v'+(height-5)}
    stroke="#152A40" strokeWidth="2.3" opacity=".8"/>
  <Roof x={x} y={y} w={w} i={i} layer={layer}/>
  {[1,2,3].map(n=><path key={n}
    d={'M'+x+' '+(y+height*n/4)+'h'+w}
    stroke={p.edge} strokeWidth={n===2?1.7:.9} opacity=".3"/>)}
  {Array.from({length:floors},(_,r)=>Array.from({length:columns},(_,c)=>{
    const wx=x+5+(w-16)*c/Math.max(1,columns-1),wy=y+12+r*22;
    const warm=(i*7+r*3+c*11)%11<4;
    return <g key={id+'-'+i+'-'+r+'-'+c}>
     <rect x={wx-1} y={wy-1} width="8.6" height="11.5"
       fill={p.side} opacity=".85"/>
     <rect x={wx} y={wy} width="6.8" height="9"
       fill={warm?p.glass:'#7D9DA5'} opacity={warm?.85:.42}/>
     <path d={'M'+(wx+3.4)+' '+wy+'v9M'+wx+' '+(wy+4.5)+'h6.8'}
       stroke={p.side} strokeWidth=".7"/>
    </g>;
  }))}
  {layer==='near'&&i%2===0?<g>
   {[0,1].map(n=><path key={n}
     d={'M'+(x+4)+' '+(p.base-48-n*17)+'h'+(w-8)}
     stroke={p.edge} strokeWidth="2" opacity=".35"/>)}
   {[0,1,2,3].map(n=><path key={n}
     d={'M'+(x+12+n*10)+' '+(p.base-64)+'v16'}
     stroke={p.edge} strokeWidth=".8" opacity=".28"/>)}
  </g>:null}
 </g>;
};
export const RichLabWindowScenery:React.FC<{id:string;sunX?:number}>=({id,sunX=400})=>{
 const u=(n:string)=>'url(#'+id+n+')';
 return <g>
  <defs>
   <linearGradient id={id+'sky'} x2="0" y2="1">
    <stop stopColor="#A27686"/><stop offset=".43" stopColor="#E5AB8E"/>
    <stop offset=".73" stopColor="#F5C098"/><stop offset="1" stopColor="#746478"/>
   </linearGradient>
   <radialGradient id={id+'sun'}>
    <stop stopColor="#FFF5CC"/><stop offset=".18" stopColor="#F9D9A9" stopOpacity=".85"/>
    <stop offset=".56" stopColor="#E9AD88" stopOpacity=".22"/>
    <stop offset="1" stopColor="#E9AD88" stopOpacity="0"/>
   </radialGradient>
  </defs>
  <rect x="200" y="155" width="725" height="575" fill={u('sky')}/>
  <path d="M205 390Q400 376 600 389T915 380" fill="none"
    stroke="#FCE1BB" strokeWidth="2" opacity=".28"/>
  <circle cx={sunX} cy="381" r="238" fill={u('sun')}/>
  <circle cx={sunX} cy="381" r="41" fill="#FFE8B9" opacity=".86"/>
  {(['far','mid','near'] as Layer[]).map((layer,k)=><g key={layer}>
   {Array.from({length:LOOK[layer].count},(_,i)=>
     <Building key={i} id={id+layer} layer={layer} i={i}/>)}
   {k<2?<path d={'M205 '+(LOOK[layer].base-18)+'H920v50H205Z'}
     fill={k===0?'#F1C9BA':'#C49DA6'} opacity={k===0?.13:.09}/>:null}
  </g>)}
  <path d="M205 606Q450 588 920 620" stroke="#B1A4A3" strokeWidth="1.5"
    fill="none" opacity=".42"/>
  <path d="M205 612Q450 602 920 631" stroke="#293449" strokeWidth="2"
    fill="none" opacity=".53"/>
  {[259,421,615,825].map((x,i)=><g key={i}>
   <path d={'M'+x+' 600v-41l-6 -10 6 -9 6 9 -6 10'}
     stroke="#555469" strokeWidth="1.4" fill="none"/>
   <circle cx={x} cy="540" r="1.8" fill="#EAC4AD"/>
  </g>)}
 </g>;
};

/** Camera-projected material, joinery and working equipment on rear bench. */
export const RichLabWorldDetails:React.FC<{id:string;camera:WorldCamera}>=({id,camera:c})=>{
 const u=(n:string)=>'url(#'+id+n+')';
 return <g>
  <defs>
   <linearGradient id={id+'steel'} x2="1" y2=".45">
    <stop stopColor="#736B77"/><stop offset=".38" stopColor="#4C5162"/>
    <stop offset=".81" stopColor="#26364A"/><stop offset="1" stopColor="#152438"/>
   </linearGradient>
   <linearGradient id={id+'glass'} x2="1" y2=".3">
    <stop stopColor="#C3DBD1" stopOpacity=".45"/>
    <stop offset=".35" stopColor="#EDCDB0" stopOpacity=".13"/>
    <stop offset="1" stopColor="#355E75" stopOpacity=".65"/>
   </linearGradient>
  </defs>
  <g transform={planeTransform(W(-1020,279,492),c)}>
   <ellipse cx="0" cy="0" rx="98" ry="12" fill="#0B1727" opacity=".49"/>
   <path d="M-88 -23h166l7 17h-180Z" fill={u('steel')}
     stroke="#B4A097" strokeWidth="2"/>
   <path d="M-70 -24v-12h50v12M-15 -24v-12h50v12" fill="none"
     stroke="#D6B599" strokeWidth="2"/>
   {[-66,-36,-6,24,54].map(x=><g key={x}>
    <circle cx={x} cy="-11" r="3" fill="#233246" stroke="#D4B49D"/>
    <path d={'M'+(x-1.5)+' -11h3'} stroke="#EED1B2" strokeWidth=".8"/>
   </g>)}
  </g>
  <g transform={planeTransform(W(-425,278,493),c)}>
   <ellipse cy="2" rx="65" ry="10" fill="#101B2A" opacity=".46"/>
   <path d="M-52 -8l6 -47h92l6 47Z" fill={u('steel')}
     stroke="#C2A79A" strokeWidth="2"/>
   <rect x="-37" y="-44" width="74" height="23" rx="3" fill="#142A3B"
     stroke="#99B5B2" strokeWidth="1.2"/>
   {Array.from({length:9},(_,i)=><path key={i}
     d={'M'+(-29+i*7)+' -41v15'} stroke="#9DC4BE"
     strokeWidth="2.2" opacity={i%3===0?.72:.32}/>)}
   <circle cx="-29" cy="-13" r="3.2" fill="#E1B48F"/>
   <circle cx="29" cy="-13" r="3.2" fill="#8FCAC2"/>
   <path d="M-48 -5h96" stroke="#E8C7AD" strokeWidth="1.5" opacity=".5"/>
  </g>
  <g transform={planeTransform(W(-180,278,527),c)}>
   <ellipse cy="2" rx="51" ry="10" fill="#121D2C" opacity=".56"/>
   <path d="M-26 -8v-82h52v82q-25 20 -52 0Z" fill={u('glass')}
     stroke="#BCD4CB" strokeWidth="1.9"/>
   <ellipse cy="-90" rx="26" ry="5" fill="#24495B"
     stroke="#E9CDAF" strokeWidth="1.8"/>
   <path d="M-21 -27h42v21h-42Z" fill="#467A88" opacity=".55"/>
   {[0,1,2,3].map(i=><path key={i}
     d={'M-22 '+(-32-i*13)+'h8'} stroke="#E9CCAB" strokeWidth="1.3"/>)}
   <path d="M-17 -82v62" stroke="#FFE5CD" strokeWidth="2.5" opacity=".35"/>
  </g>
  <g transform={planeTransform(W(-250,460,783),c)}>
   <path d="M-103 -189v132q0 10 12 10h147q12 0 12 13v50"
     fill="none" stroke="#101E30" strokeWidth="9"/>
   <path d="M-103 -189v132q0 10 12 10h147q12 0 12 13v50"
     fill="none" stroke="#6E6D77" strokeWidth="5.5"/>
   <path d="M-104 -189v132q0 10 12 10h147q12 0 12 13v50"
     fill="none" stroke="#D7B99D" strokeWidth="1.2" opacity=".59"/>
   {[-156,-99,-39].map(y=><g key={y}>
    <rect x="-112" y={y} width="19" height="8" rx="2"
      fill={u('steel')} stroke="#B8A7A1" strokeWidth="1.1"/>
    <circle cx="-108" cy={y+4} r="1.4" fill="#E2C8A5"/>
    <circle cx="-97" cy={y+4} r="1.4" fill="#E2C8A5"/>
   </g>)}
  </g>
  {[-1050,-812,-574,-336,-98,140].map((x,i)=><g key={i}
    transform={planeTransform(W(x,246,444),c)}>
    <path d="M-94 -37h190v35h-190Z" fill="#17293B" opacity=".25"
      stroke="#AB8D83" strokeWidth="1.6"/>
    <path d="M-88 -32h178M-84 -5h170" stroke="#D3B5A5"
      strokeWidth="1.1" opacity=".48"/>
    <path d="M-18 -22h40m-35 3h30" stroke="#C7B0A1"
      strokeWidth="2.1" strokeLinecap="round"/>
    <circle cx="-84" cy="-17" r="2" fill="#DBC1A5"/>
    <circle cx="88" cy="-17" r="2" fill="#DBC1A5"/>
  </g>)}
  {[W(-1100,960,779),W(-100,960,779)].map((p,i)=><g key={i}
    transform={planeTransform(p,c)}>
    <path d="M-7 0h14v-24h-14Z" fill={u('steel')}
      stroke="#C7AFA3" strokeWidth="1.1"/>
    {[-18,-6].map(y=><circle key={y} cy={y} r="2.4"
      fill="#24344A" stroke="#E2C7B1" strokeWidth=".8"/>)}
  </g>)}
 </g>;
};


/** Details for the previously bare graph, archive, trolley and visible wall.
 * Uses the same three world-depth planes as the original equipment.
 */
export const RichLabSecondaryDetails:React.FC<{id:string;camera:WorldCamera}>=({id,camera:c})=>{
 const u=(n:string)=>'url(#'+id+n+')';
 return <g>
  <defs>
   <linearGradient id={id+'panel'} x1="0" y1="0" x2="1" y2=".7">
    <stop stopColor="#566176"/><stop offset=".5" stopColor="#29394D"/>
    <stop offset="1" stopColor="#142336"/>
   </linearGradient>
   <linearGradient id={id+'brass'} x2="1" y2="1">
    <stop stopColor="#F4D3AB"/><stop offset=".4" stopColor="#B29988"/>
    <stop offset="1" stopColor="#526374"/>
   </linearGradient>
  </defs>
  {/* Precision instrumentation: recessed graph plate, illuminated trend,
      calibration marks, brass fasteners, etched legend and status ports. */}
  <g transform={planeTransform(W(205,678,762),c)}>
   <rect x="10" y="13" width="280" height="192" rx="5"
     fill="#122438" stroke="#8294A1" strokeWidth="1.7"/>
   <rect x="20" y="24" width="258" height="166" rx="2"
     fill="#16293D" stroke="#536F80" strokeWidth="1"/>
   {[0,1,2,3,4,5].map(i=><g key={i}>
    <path d={'M34 '+(34+i*24)+'h223'} stroke="#91ADB5"
      strokeWidth=".7" opacity=".2"/>
    <path d={'M'+(37+i*43)+' 30v142'} stroke="#A1AFB4"
      strokeWidth=".7" opacity=".14"/>
   </g>)}
   <path d="M35 155L83 114L137 131L188 62L245 83"
     stroke="#C4DEDA" strokeWidth="3.2" strokeLinecap="round"
     strokeLinejoin="round" fill="none"/>
   <path d="M35 155L83 114L137 131L188 62L245 83"
     stroke="#76BEBD" strokeWidth="6" opacity=".12" fill="none"/>
   {[{x:35,y:155},{x:83,y:114},{x:137,y:131},{x:188,y:62},{x:245,y:83}].map((p,i)=>
    <g key={i}>
     <circle cx={p.x} cy={p.y} r="4" fill="#203C50"
       stroke="#D7C1A6" strokeWidth="1.4"/>
     <circle cx={p.x} cy={p.y} r="1.8" fill="#B5DBD6"/>
    </g>)}
   <path d="M40 179h51m14 0h36m14 0h52" stroke="#CDBAA6"
     strokeWidth="2" opacity=".63"/>
   {[0,1,2,3].map(i=><g key={i}>
    <circle cx={18+i%2*267} cy={20+Math.floor(i/2)*178} r="3.5"
      fill="#253747" stroke="#C6B5AA" strokeWidth="1.1"/>
    <path d={'M'+(16+i%2*267)+' '+(20+Math.floor(i/2)*178)+'h4'}
      stroke="#F0D3B2" strokeWidth=".7"/>
   </g>)}
  </g>
  {/* Finished archive framework: separate metal edge strips, spine bands,
      numbered enameled brackets, rivets and support rails. */}
  {[0,1,2].map((row)=><g key={row}
    transform={planeTransform(W(613,699-row*185,436),c)}>
    <path d="M0 2h338" stroke="#151F30" strokeWidth="11"/>
    <path d="M0 -3h338" stroke={u('brass')} strokeWidth="2" opacity=".58"/>
    {[0,1,2,3,4,5,6,7].map(i=><g key={i}>
     <path d={'M'+(12+i*41)+' -2v14'}
       stroke="#778695" strokeWidth="4" opacity=".65"/>
     <rect x={19+i*41} y="2" width="21" height="7" rx="1"
       fill="#1F3448" stroke="#B4A69C" strokeWidth=".8"/>
     <path d={'M'+(22+i*41)+' 5h14'} stroke="#C8D6CF"
       strokeWidth=".7" opacity=".55"/>
    </g>)}
    <circle cx="7" cy="2" r="2" fill="#E5C6A7"/>
    <circle cx="331" cy="2" r="2" fill="#E5C6A7"/>
  </g>)}
  {/* World-mounted trolley joinery and machined control fittings. */}
  <g transform={planeTransform(W(-119,312,-43),c)}>
   <path d="M3 -4h253M5 6h248" stroke={u('brass')}
     strokeWidth="2" opacity=".65"/>
   {[12,70,135,200,249].map(x=><g key={x}>
    <circle cx={x} cy="-2" r="3.5" fill="#233246"
      stroke="#D6BBA5" strokeWidth="1.2"/>
    <path d={'M'+(x-1.3)+' -2h2.6'} stroke="#EED1B4" strokeWidth=".8"/>
   </g>)}
   <path d="M23 22h65m20 0h72m-139 7h104" stroke="#95A4A6"
     strokeWidth="1.6" opacity=".35"/>
   <rect x="169" y="17" width="51" height="18" rx="3"
     fill={u('panel')} stroke="#B8AB9F" strokeWidth="1.4"/>
   {Array.from({length:6},(_,i)=><path key={i}
     d={'M'+(175+i*7)+' 23v6'} stroke="#9CC7C3"
     opacity={i%2?.42:.72} strokeWidth="2.2"/>)}
  </g>
  {/* Structural rail cable trunk and actual joint fixtures on back wall. */}
  <g transform={planeTransform(W(105,798,780),c)}>
   <path d="M-34 0h455" stroke="#162638" strokeWidth="13"/>
   <path d="M-34 -3h455" stroke="#8D8A91" strokeWidth="5"/>
   <path d="M-34 -5h455" stroke="#E8C7AA" strokeWidth="1.2" opacity=".58"/>
   {[0,100,210,330,418].map(x=><g key={x}>
    <rect x={x-7} y="-11" width="17" height="13" rx="2"
      fill={u('panel')} stroke="#C6ACA2" strokeWidth="1"/>
    <circle cx={x-2} cy="-5" r="1.5" fill="#E2C1A4"/>
    <circle cx={x+6} cy="-5" r="1.5" fill="#E2C1A4"/>
   </g>)}
  </g>
 </g>;
};
