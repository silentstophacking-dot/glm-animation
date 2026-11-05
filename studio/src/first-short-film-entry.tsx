import React from 'react';
import {AbsoluteFill,Audio,Composition,Sequence,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import {ClockDiscoveryPerformance} from './episodes/probability-control/clock-discovery-proof';
import {EvidenceScene} from './episodes/probability-control/reversal-evidence-storyboard';
import {LabWindowScenery} from './episodes/probability-control/cinematic-lab';

// FIRST FILM: 49 seconds, 30 fps, 1470 frames. All assets native SVG.
const City:React.FC=()=>{
 const f=useCurrentFrame();
 const t=Math.min(1,Math.max(0,(f-40)/120));
 const ease=t*t*(3-2*t);
 return <svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <defs>
 <linearGradient id="sky" x2="0" y2="1"><stop stopColor="#4E526E"/><stop offset=".55" stopColor="#D99C83"/><stop offset="1" stopColor="#343F59"/></linearGradient>
 <radialGradient id="sun"><stop stopColor="#FFE5B5" stopOpacity=".9"/><stop offset="1" stopColor="#F6BA94" stopOpacity="0"/></radialGradient>
 <linearGradient id="metal" x2="1" y2=".2"><stop stopColor="#29374A"/><stop offset=".3" stopColor="#6A7180"/><stop offset="1" stopColor="#1C2A3D"/></linearGradient>
 <radialGradient id="vig"><stop offset=".45" stopColor="#0A1320" stopOpacity="0"/><stop offset="1" stopColor="#0A1320" stopOpacity=".6"/></radialGradient>
 </defs>
 <rect width="1920" height="1080" fill="url(#sky)"/>
 <circle cx="1350" cy="350" r="360" fill="url(#sun)"/>
 <circle cx="1350" cy="350" r="49" fill="#F9DEB3"/>
 {Array.from({length:35},(_,i)=>{
  const x=i*61-55,h=130+(i*73%250),w=43+i%4*6,y=890-h;
  return <g key={i}>
   <path d={`M${x} ${y}h${w}v${h+150}h-${w}Z`} fill="url(#metal)" stroke="#7C8491" strokeWidth=".8"/>
   <path d={`M${x-3} ${y}h${w+6}l-5 -8h-${w-1}Z`} fill="#897C83"/>
   {i%3===0&&<path d={`M${x+w/2} ${y-8}v-28`} stroke="#A99D98" strokeWidth="2"/>}
   {i%4===0&&<path d={`M${x+5} ${y-8}v-15h${w-10}v15`} fill="none" stroke="#38495A" strokeWidth="4"/>}
   {Array.from({length:Math.floor((h-25)/20)},(_,r)=>
    Array.from({length:Math.max(2,Math.floor((w-10)/11))},(_,c)=>{
     const lit=(i*7+r*11+c*3)%9<5;
     return <g key={r+'-'+c}>
      <rect x={x+5+c*11} y={y+16+r*20} width="6" height="10" fill="#15283B" stroke="#8C9498" strokeWidth=".45"/>
      <rect x={x+6+c*11} y={y+17+r*20} width="4" height="8" fill={lit?'#E9BC96':'#74909C'} opacity={lit?(1-ease*.86):.28}/>
     </g>;
    }))}
   <path d={`M${x+3} ${y+40}v${h-45}`} stroke="#D6B49A" opacity=".24"/>
  </g>;
 })}
 <path d="M0 895L1920 852V888L0 937Z" fill="#293B4E" stroke="#B4A29A" strokeWidth="3"/>
 {Array.from({length:13},(_,i)=><path key={i} d={`M${i*160} ${894-i*3}v186`} stroke="#263648" strokeWidth="16"/>)}
 <path d="M0 902L1920 858" stroke="#DAB39B" opacity=".45" strokeWidth="3"/>
 {Array.from({length:14},(_,i)=><g key={i} transform={`translate(${70+i*140} ${790-i%3*17})`} opacity={ease*.7}>
  <circle r={5+ease*15} fill="none" stroke="#F3D6B7" strokeWidth="2"/>
  <path d="M-21 0H21M0 -21V21" stroke="#F3D6B7" opacity=".35"/>
 </g>)}
 <rect width="1920" height="1080" fill="url(#vig)"/>
 <g opacity={Math.min(1,Math.max(0,(f-174)/20))}>
 <rect width="1920" height="1080" fill="#0E1725" opacity=".3"/>
 <text x="960" y="190" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="54" fontWeight="700" letterSpacing="7" fill="#F6DFC6">IT WASN'T JUST THE GLASS.</text>
 <text x="960" y="260" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="37" fontWeight="700" letterSpacing="6" fill="#E5C7AF">THE CITY WAS REWINDING.</text>
 </g>
 </svg>;
};
const Reversal:React.FC=()=>{
 const f=useCurrentFrame();
 return <AbsoluteFill style={{backgroundColor:'#101622'}}>
 <EvidenceScene frame={f} id="first-film-reversal"/>
 <Audio src={staticFile('reversal-evidence/soundtrack.wav')}/>
 </AbsoluteFill>;
};
const Film:React.FC=()=> <AbsoluteFill style={{backgroundColor:'#101622'}}>
 <Sequence from={0} durationInFrames={720}><ClockDiscoveryPerformance/></Sequence>
 <Sequence from={720} durationInFrames={510}><Reversal/></Sequence>
 <Sequence from={1230} durationInFrames={240}><City/></Sequence>
 </AbsoluteFill>;
registerRoot(()=><>
 <Composition id="FirstShortFilm" component={Film} durationInFrames={1470} fps={30} width={1920} height={1080}/>
 <Composition id="FirstShortFilmCity" component={City} durationInFrames={240} fps={30} width={1920} height={1080}/>
 </>);
