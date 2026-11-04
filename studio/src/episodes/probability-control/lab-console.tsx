import React from 'react';
import {BUTTON} from './slender-mechanics';

/** A supported steel trolley and enamel control unit, on the actor's contact plane. */
export const LabConsole:React.FC<{id:string;active:boolean;shadowY?:number;shadow?:boolean}>=({id,active,shadowY=890,shadow=true})=>{
 const u=(s:string)=>`url(#${id+s})`;
 return <g>
 <defs>
  <linearGradient id={id+'enamel'} x2=".8" y2="1"><stop stopColor="#535565"/><stop offset=".17" stopColor="#363B4A"/><stop offset="1" stopColor="#202735"/></linearGradient>
  <linearGradient id={id+'steel'} x2="1" y2=".2"><stop stopColor="#8E7972"/><stop offset=".22" stopColor="#565767"/><stop offset=".65" stopColor="#292D3C"/><stop offset="1" stopColor="#616374"/></linearGradient>
  <linearGradient id={id+'top'} x2=".3" y2="1"><stop stopColor="#79717A"/><stop offset="1" stopColor="#4A4859"/></linearGradient>
  <linearGradient id={id+'glass'} x2=".6" y2="1"><stop stopColor="#496568"/><stop offset=".22" stopColor="#192B35"/><stop offset="1" stopColor="#101B27"/></linearGradient>
  <radialGradient id={id+'button'} cx=".35" cy=".25"><stop stopColor={active?'#CEF8D7':'#F4D3A0'}/><stop offset="1" stopColor={active?'#579E91':'#A67051'}/></radialGradient>
 </defs>
 {shadow?<ellipse cx="960" cy={shadowY} rx="145" ry="12" fill="#0E121C" opacity=".5"/>:null}
 {/* Rear legs, brace and lower tray precede the front legs. */}
 <path d="M871 573V874M1080 573V874" stroke="#181E2C" strokeWidth="11"/>
 <path d="M863 817H1084L1072 835H851Z" fill="#373544" stroke="#222433" strokeWidth="3"/>
 <path d="M859 834H1072V842H859Z" fill="#202534"/>
 <path d="M852 586L1070 851M1070 586L852 851" stroke="#303443" strokeWidth="4"/>
 {/* Box-section legs catch the sunset along their left edge. */}
 {[850,1070].map(x=><g key={x}>
  <path d={`M${x-6} 580H${x+6}V878L${x+2} 884H${x-7}Z`} fill={u('steel')} stroke="#1A1E2C" strokeWidth="2"/>
  <path d={`M${x-5} 590V872`} stroke="#A88B79" strokeWidth="1.4" opacity=".5"/>
  <ellipse cx={x-1} cy="885" rx="13" ry="4" fill="#121824"/>
  <path d={`M${x-7} 878h13v7h-13Z`} fill="#252938"/>
 </g>)}
 <path d="M838 574L853 562H1100L1086 574Z" fill={u('top')} stroke="#252837" strokeWidth="2"/>
 <path d="M838 574H1086V585H838Z" fill={u('steel')} stroke="#252735" strokeWidth="2"/>
 <path d="M1086 574L1100 562V574L1086 585Z" fill="#252B3B"/>
 <path d="M843 573H1083" stroke="#BFA28C" strokeWidth="2" opacity=".7"/>
 <path d="M860 586H1058V609H860Z" fill="#363846" stroke="#202534" strokeWidth="2"/>
 <path d="M939 597h34" stroke="#9A8B87" strokeWidth="3" strokeLinecap="round"/>
 <path d="M938 600h36" stroke="#161D2A" strokeWidth="2"/>
 <path d="M924 565C926 590 989 589 989 610V773Q989 795 962 798" stroke="#131B26" strokeWidth="5" fill="none"/>
 <path d="M925 566C927 589 989 588 990 611" stroke="#756967" strokeWidth="1" fill="none" opacity=".55"/>
 {/* The button center is unchanged, so the hand constraint still holds. */}
 <path d="M831 506L841 496H946L952 503L943 512Z" fill="#65606A" stroke="#242837" strokeWidth="2"/>
 <path d="M946 502L956 509V563L946 569Z" fill="#1A2231" stroke="#131A27" strokeWidth="2"/>
 <rect x="830" y="504" width="118" height="66" rx="6" fill={u('enamel')} stroke="#171F2E" strokeWidth="3"/>
 <path d="M837 507H941" stroke="#AC9587" strokeWidth="1.4" opacity=".7"/>
 <path d="M833 512V560" stroke="#AD8B77" strokeWidth="1.2" opacity=".55"/>
 <rect x="842" y="516" width="40" height="42" rx="4" fill="#2A303F" stroke="#1A2230" strokeWidth="1.5"/>
 <circle cx={BUTTON.x} cy={BUTTON.y} r="13" fill="#151D2A" stroke="#7B7778" strokeWidth="2"/>
 <circle cx={BUTTON.x} cy={BUTTON.y} r="10" fill={u('button')} stroke="#E4C69E" strokeWidth="1.5"/>
 <path d="M857 532Q862 529 867 532" stroke="#F8E0B8" opacity=".65" strokeWidth="1.5" fill="none"/>
 <rect x="892" y="515" width="44" height="19" rx="2" fill="#101B27" stroke="#667072" strokeWidth="1.3"/>
 <rect x="895" y="518" width="38" height="13" rx="1" fill={u('glass')}/>
 <path d={active?'M898 525h6l2 -4l3 7l3 -5h17':'M898 526h31'} stroke={active?'#A2DBC6':'#859386'} strokeWidth="1.2" fill="none"/>
 <path d="M896 518L909 518L921 531H910Z" fill="#A4C1BD" opacity=".08"/>
 <circle cx="902" cy="548" r="5" fill="#171F2B" stroke="#697179" strokeWidth="1.2"/>
 <path d="M902 548l2 -3" stroke="#C5B19C" strokeWidth="1"/>
 {[0,1,2,3].map(i=><path key={i} d={`M916 ${542+i*4}h16`} stroke="#111B29" strokeWidth="1.5" strokeLinecap="round"/>)}
 {[[837,511],[941,511],[837,563],[941,563]].map(([x,y])=><g key={x+':'+y}>
  <circle cx={x} cy={y} r="1.7" fill="#91908C"/><path d={`M${x-1} ${y}h2`} stroke="#323747" strokeWidth=".7"/>
 </g>)}
 <path d="M1000 570L1010 552L1068 553L1057 571Z" fill="#837164" stroke="#363342" strokeWidth="1.2"/>
 <path d="M1016 558l39 1m-42 4h32" stroke="#C0A48A" strokeWidth="1.3" opacity=".6"/>
 </g>;
};
