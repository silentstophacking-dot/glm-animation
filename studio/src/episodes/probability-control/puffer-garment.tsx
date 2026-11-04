import React from 'react';
export type PufferOutfit='puffer-black'|'puffer-cobalt'|'puffer-teal';
export const PufferGarment:React.FC<{id:string;w:number;c:number;s:number;seam:number;colors:string[]}>=({id,w,c,s,seam,colors})=>{
 const p=w+4,ink='#120F17';
 const shell=`M${-p+2} -274Q${-p-4} -266 ${-p} -251Q${-p-3} -239 ${-p} -228Q${-p-3} -215 ${-p} -204Q${-p-3} -190 ${-p+2} -176Q0 -168 ${p-2} -176Q${p+3} -190 ${p} -204Q${p+3} -215 ${p} -228Q${p+3} -240 ${p} -251Q${p+4} -266 ${p-2} -274Q0 -283 ${-p+2} -274Z`;
 return <g>
  <defs>
   <clipPath id={id+'clip'}><path d={shell}/></clipPath>
   <linearGradient id={id+'band'} x2=".2" y2="1"><stop stopColor={colors[0]}/><stop offset=".3" stopColor={colors[1]}/><stop offset=".78" stopColor={colors[1]}/><stop offset="1" stopColor={colors[2]}/></linearGradient>
  </defs>
  <path d={shell} fill={colors[1]} stroke={ink} strokeWidth="1.6" strokeLinejoin="round"/>
  <g clipPath={`url(#${id}clip)`}>
   {[-276,-251,-227,-203,-179].slice(0,4).map((y,i)=><g key={y}>
    <path d={`M${-p-5} ${y}Q${seam} ${y+5} ${p+5} ${y}V${y+26}Q${seam} ${y+31} ${-p-5} ${y+26}Z`} fill={`url(#${id}band)`}/>
    <path d={`M${-p+1} ${y+24}Q${seam} ${y+30} ${p-1} ${y+24}`} stroke="#101C29" strokeWidth="1.1" opacity=".7" fill="none"/>
    <path d={`M${-p+2} ${y+3}Q${seam-6*c} ${y+7} ${p-2} ${y+3}`} stroke="#DCE5DE" strokeWidth=".9" opacity={i?.13:.2} fill="none"/>
   </g>)}
   <path d={`M${seam+3*c} -278Q${p*.85} -264 ${p} -246V-173H${seam+3*c}Z`} fill="#071523" opacity={.08+.24*s}/>
  </g>
  {/* Padded stand collar leaves the black neck visible at the centre. */}
  <path d={`M${-p+4} -274Q${-p+1} -284 ${-p+9} -289L${seam-7*c} -285L${seam-6*c} -267Q${-p+8} -265 ${-p+4} -274Z`} fill={colors[0]} stroke={ink} strokeWidth="1.3"/>
  <path d={`M${seam+7*c} -285L${p-9} -289Q${p-1} -284 ${p-4} -274Q${p-8} -265 ${seam+6*c} -267Z`} fill={colors[1]} stroke={ink} strokeWidth="1.3"/>
  <path d={`M${seam-5*c} -281Q${seam} -273 ${seam+5*c} -281L${seam+4*c} -261H${seam-4*c}Z`} fill="#D8C6A3"/>
  <path d={`M${seam} -268V-176`} stroke="#111C29" strokeWidth="2.2"/>
  <path d={`M${seam+1.2} -267V-177`} stroke="#9DA6A5" strokeWidth=".6" opacity=".7"/>
  <path d={`M${seam} -257v7`} stroke="#D4A65A" strokeWidth="2.2" strokeLinecap="round"/>
  <path d={`M${-p*.72} -213l${9*c} -5M${seam+8*c} -218l${8*c} 5`} stroke="#132334" strokeWidth="2.1" strokeLinecap="round"/>
  <path d={`M${-p+3} -179Q0 -172 ${p-3} -179`} fill="none" stroke={colors[2]} strokeWidth="3"/>
 </g>;
};
