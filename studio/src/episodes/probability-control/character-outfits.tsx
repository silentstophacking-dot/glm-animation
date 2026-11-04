import React from 'react';
export type CharacterOutfit='hoodie'|'teal-overshirt'|'ochre-jacket'|'navy-waistcoat';
export function outfitPalette(outfit:CharacterOutfit,lit:boolean){
 const base={cloth:lit?['#F28A60','#DC6049','#803D49']:['#E36A50','#D85845','#AA3E38'],far:lit?['#CD7055','#703D4B']:['#D65B47','#A7413B'],pants:lit?['#38303A','#131D2C']:['#302632','#101521'],cuff:'#B94A3E',shoe:'#1D1B26',sole:'#E2B680'};
 if(outfit==='teal-overshirt')return {...base,cloth:lit?['#75B1A4','#43837E','#2A4C5D']:['#639E94','#3D7976','#294D59'],far:['#50847C','#2B4D58'],cuff:'#356760',shoe:'#D4CCBA',sole:'#938A7E'};
 if(outfit==='ochre-jacket')return {...base,cloth:['#D9AA68','#B9894C','#705343'],far:['#B68B58','#6B5244'],cuff:'#6A5142',shoe:'#34303A',sole:'#A59275'};
 if(outfit==='navy-waistcoat')return {...base,cloth:['#F0DEC0','#D2C4AA','#89939A'],far:['#C9BDA7','#838E96'],cuff:'#B7AD99',pants:['#414854','#1C2634'],shoe:'#CFC6B5',sole:'#8F877C'};
 return base;
}
export const OutfitGarment:React.FC<{outfit:Exclude<CharacterOutfit,'hoodie'>;w:number;c:number;s:number;seam:number;cloth:string}>=({outfit,w,c,s,seam,cloth})=>{
 const ink='#120F17',cream='#EADCC2',hem=outfit==='ochre-jacket'?-184:-177;
 const shell=`M${-w} -272Q${-w*.8} -279 ${-w*.42} -280L0 -277L${w*.46} -280Q${w*.83} -277 ${w} -270L${w*.92} -224L${w*.9} ${hem}Q0 ${hem+5} ${-w*.9} ${hem}L${-w*.92} -224Z`;
 if(outfit==='navy-waistcoat')return <g>
  <path d={shell} fill={cream} stroke={ink} strokeWidth="1.5"/>
  <path d={`M${-w*.85} -272L${seam-8*c} -278L${seam} -247L${seam+9*c} -278L${w*.85} -271L${w*.76} -188L${seam} -174L${-w*.78} -186Z`} fill="#354B61" stroke={ink} strokeWidth="1.4"/>
  <path d={`M${seam} -247L${seam} -178L${w*.76} -188L${w*.85} -271Z`} fill="#24394E" opacity={.35+.25*s}/>
  <path d={`M${seam-9*c} -279L${seam} -267L${seam-5*c} -258L${seam-14*c} -275M${seam+9*c} -279L${seam} -267L${seam+5*c} -258L${seam+14*c} -275`} fill="#F3E7D0" stroke="#A79783" strokeWidth=".8"/>
  {[-233,-216,-199].map(y=><circle key={y} cx={seam} cy={y} r="1.3" fill="#BFA77C"/>)}
  <path d={`M${seam-16*c} -205h${9*c}M${seam+7*c} -205h${9*c}`} stroke="#728394" strokeWidth="1.3"/>
 </g>;
 return <g>
  {/* The tee extends slightly below the open overshirt. */}
  {outfit==='teal-overshirt'?<path d={`M${-w*.62} -275H${w*.62}V-166Q0 -161 ${-w*.62} -166Z`} fill={cream} stroke={ink} strokeWidth="1.2"/>:null}
  <path d={shell} fill={cloth} stroke={ink} strokeWidth="1.5" strokeLinejoin="round"/>
  <path d={`M${seam+6*c} -277Q${w*.85} -261 ${w*.88} -225L${w*.9} ${hem}L${seam+6*c} ${hem+2}Z`} fill={outfit==='teal-overshirt'?'#244D59':'#6A4C39'} opacity={.12+.28*s}/>
  {outfit==='teal-overshirt'?<>
   <path d={`M${seam-8*c} -276Q${seam} -268 ${seam+8*c} -276L${seam+7*c} -167H${seam-7*c}Z`} fill={cream} stroke="#203C45" strokeWidth="1"/>
   <path d={`M${seam-8*c} -280L${seam-2*c} -270L${seam-10*c} -254L${seam-17*c} -274ZM${seam+8*c} -280L${seam+2*c} -270L${seam+10*c} -254L${seam+17*c} -274Z`} fill="#60958A" stroke="#233C43" strokeWidth="1.1"/>
   <path d={`M${seam-19*c} -244h${9*c}v14h${-9*c}Z`} fill="#3A756F" stroke="#244D54" strokeWidth="1"/>
   {[-245,-219,-193].map(y=><circle key={y} cx={seam+10*c} cy={y} r="1.15" fill="#D4C49F"/>)}
   <path d={`M${-w*.85} -180L${seam-8*c} -178M${seam+8*c} -178L${w*.85} -180`} stroke="#79A394" strokeWidth="1" opacity=".6"/>
  </>:<>
   <path d={`M${seam-7*c} -277Q${seam} -265 ${seam+7*c} -277L${seam+5*c} -254H${seam-5*c}Z`} fill={cream}/>
   <path d={`M${seam-10*c} -283L${seam} -270L${seam-7*c} -258L${seam-17*c} -277ZM${seam+10*c} -283L${seam} -270L${seam+7*c} -258L${seam+17*c} -277Z`} fill="#BC8D53" stroke="#664B3A" strokeWidth="1.2"/>
   <path d={`M${seam} -269V-187`} stroke="#453B35" strokeWidth="1.8"/>
   <rect x={seam-1} y="-254" width="2" height="5" rx=".5" fill="#CFC0A2"/>
   {[-1,1].map(side=><path key={side} d={`M${seam+side*8*c} -224h${side*11*c}v20h${-side*11*c}Z`} fill="#AC7B43" stroke="#79583C" strokeWidth="1"/>)}
   <path d={`M${-w*.86} -189Q0 -185 ${w*.86} -189`} fill="none" stroke="#705440" strokeWidth="3"/>
  </>}
 </g>;
};
