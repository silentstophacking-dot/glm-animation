import React from 'react';
import {AbsoluteFill,Composition,Sequence,registerRoot,useCurrentFrame} from 'remotion';
import {LastSignalApartmentCheckpoint} from './last-signal-entry';
import {CharacterTurnV5} from './episodes/probability-control/character-turn-v5';
const ease=(t:number)=>{const v=Math.max(0,Math.min(1,t));return v*v*(3-2*v)};
const City:React.FC<{id:string;frame:number;double?:boolean;closer?:boolean}>=({id,frame,double=false,closer=false})=>{
 const u=(s:string)=>`url(#${id}-${s})`,rain=frame;
 return <svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <defs>
 <linearGradient id={id+'-sky'} x2=".2" y2="1"><stop stopColor="#0A1729"/><stop offset=".58" stopColor="#1B3045"/><stop offset="1" stopColor="#152536"/></linearGradient>
 <linearGradient id={id+'-road'} x2="0" y2="1"><stop stopColor="#293848"/><stop offset="1" stopColor="#0B1626"/></linearGradient>
 <linearGradient id={id+'-facade'} x2="1" y2=".2"><stop stopColor="#233448"/><stop offset=".4" stopColor="#374456"/><stop offset="1" stopColor="#121F32"/></linearGradient>
 <radialGradient id={id+'-light'}><stop stopColor="#F8D8A3" stopOpacity=".45"/><stop offset="1" stopColor="#F5BE80" stopOpacity="0"/></radialGradient>
 <radialGradient id={id+'-fog'}><stop stopColor="#8DA9BA" stopOpacity=".12"/><stop offset="1" stopColor="#8DA9BA" stopOpacity="0"/></radialGradient>
 <radialGradient id={id+'-vig'}><stop offset=".4" stopColor="#050B15" stopOpacity="0"/><stop offset="1" stopColor="#050B15" stopOpacity=".75"/></radialGradient>
 </defs>
 <rect width="1920" height="1080" fill={u('sky')}/>
 <path d="M0 610L1920 600V1080H0Z" fill={u('road')}/>
 {Array.from({length:17},(_,i)=>{const x=i*128-55,h=270+(i*73%260),y=650-h;return <g key={i}><path d={`M${x} ${y}h${105+i%3*14}v${720-y}h-${105+i%3*14}Z`} fill={u('facade')} stroke="#657285" strokeWidth="2"/><path d={`M${x-5} ${y}l12 -18h${96+i%3*14}l9 18Z`} fill="#495064"/>{Array.from({length:Math.floor(h/30)},(_,r)=><g key={r}>{Array.from({length:5},(_,c)=><rect key={c} x={x+10+c*18} y={y+18+r*30} width="9" height="16" fill={(i*5+r*3+c)%9<2?'#E6BD8A':'#172A3D'} stroke="#6A7C89" strokeWidth=".5"/>)}</g>)}</g>})}
 <path d="M0 705L1920 690" stroke="#7E8993" strokeWidth="9" opacity=".5"/>
 <path d="M0 810L1920 780" stroke="#C0A9A0" strokeWidth="2" opacity=".28"/>
 <path d="M300 1080L800 680M1620 1080L1080 680" stroke="#A4A6AC" strokeWidth="5" opacity=".16"/>
 <path d="M880 1080L947 700M1020 1080L985 700" stroke="#B0A8A1" strokeWidth="3" opacity=".22"/>
 {Array.from({length:9},(_,i)=><path key={i} d={`M${910-i*26} ${1070-i*38}l${75+i*7} -3`} stroke="#D8BA9D" strokeWidth="5" opacity=".2"/>)}
 <g><path d="M970 185L969 720" stroke="#586677" strokeWidth="15"/><path d="M970 185h160" stroke="#647283" strokeWidth="11"/><path d="M1127 190v30" stroke="#7A8490" strokeWidth="9"/><ellipse cx="1127" cy="230" rx="75" ry="30" fill="#D8B89B" stroke="#877F7B" strokeWidth="5"/><circle cx="1127" cy="240" r="300" fill={u('light')}/><path d="M1070 240L900 1000L1390 1000L1190 240Z" fill="#EBC79D" opacity=".045"/></g>
 <path d="M0 740L1920 710" stroke="#C7D0D2" opacity=".2" strokeWidth="5"/>
 {Array.from({length:46},(_,i)=>{const x=(i*109+frame*1.2)%2100-90,y=(i*61+frame*4)%1150-40;return <path key={i} d={`M${x} ${y}l-8 31`} stroke="#A6C1CF" strokeWidth={i%3===0?2:1} opacity=".25"/>})}
 <ellipse cx="1127" cy="810" rx="450" ry="100" fill={u('fog')}/>
 {double&&<g opacity={frame>365?1-ease((frame-365)/14):1}><ellipse cx="1115" cy="840" rx="60" ry="14" fill="#040D19" opacity=".8"/><CharacterTurnV5 id={id+'-double'} x={1115} y={830} scale={closer?1.6:1.12} yaw={.15} headYaw={-.3} lighting="baseline" mood="calm" outfit="hoodie"/></g>}
 <rect width="1920" height="1080" fill={u('vig')}/>
 </svg>
};
const Phone:React.FC<{text:string;sub?:string;frame:number}>=({text,sub,frame})=><svg viewBox="0 0 1920 1080" width="100%" height="100%"><defs><radialGradient id="phonebg"><stop stopColor="#34465A"/><stop offset="1" stopColor="#0A1322"/></radialGradient><linearGradient id="bezel" x2="1" y2="1"><stop stopColor="#8B98A5"/><stop offset=".5" stopColor="#202C3C"/><stop offset="1" stopColor="#647181"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#phonebg)"/><g transform={`translate(${960-360*(1+ease(frame/70)*.12)} ${540-490*(1+ease(frame/70)*.12)}) scale(${1+ease(frame/70)*.12})`}><rect x="0" y="0" width="720" height="980" rx="70" fill="url(#bezel)" stroke="#B1B5B8" strokeWidth="8"/><rect x="20" y="20" width="680" height="940" rx="54" fill="#0D1726"/><rect x="265" y="28" width="190" height="30" rx="15" fill="#02060C"/><text x="60" y="115" fill="#F1E7DC" fontFamily="Arial" fontSize="42" fontWeight="bold">2:17</text><text x="60" y="160" fill="#B6C0C9" fontFamily="Arial" fontSize="22">EMERGENCY BROADCAST</text><rect x="50" y="235" width="620" height="270" rx="28" fill="#273447" stroke="#A57D7D" strokeWidth="3"/><text x="82" y="292" fill="#E3AAA0" fontFamily="Arial" fontSize="30" fontWeight="bold">CRITICAL ALERT</text><text x="82" y="363" fill="#F8EEE6" fontFamily="Arial" fontSize={text.length>30?33:41} fontWeight="bold">{text}</text>{sub&&<text x="82" y="420" fill="#C9D0D4" fontFamily="Arial" fontSize="27">{sub}</text>}<path d="M65 820H655" stroke="#596577" strokeWidth="2"/><text x="75" y="864" fill="#8294A4" fontFamily="Arial" fontSize="24">Unknown sender · Delivered now</text></g></svg>;
const Hall:React.FC<{frame:number}>=({frame})=><svg viewBox="0 0 1920 1080" width="100%" height="100%"><defs><linearGradient id="hallwall" x2="1" y2=".7"><stop stopColor="#344151"/><stop offset="1" stopColor="#0B1422"/></linearGradient><radialGradient id="hallglow"><stop stopColor="#E7B58B" stopOpacity=".28"/><stop offset="1" stopColor="#E7B58B" stopOpacity="0"/></radialGradient></defs><rect width="1920" height="1080" fill="#101B2B"/><path d="M0 0H1920L1320 820H600Z" fill="url(#hallwall)"/><path d="M0 1080L600 820H1320L1920 1080Z" fill="#262C38"/><path d="M600 820L600 0M1320 820V0" stroke="#667184" strokeWidth="10"/><path d="M780 200H1140V820H780Z" fill="#111826" stroke="#6D7382" strokeWidth="13"/><path d="M815 235H1105V795H815Z" fill="#172536"/><circle cx="1060" cy="525" r="12" fill="#B9A17F"/><circle cx="960" cy="400" r="320" fill="url(#hallglow)"/><g transform={`translate(${820-ease(frame/100)*45} 930) scale(1.7)`}><CharacterTurnV5 id="hall-daniel" x={0} y={0} yaw={.6} headYaw={.95} lighting="baseline" mood="surprised" outfit="hoodie"/></g>{frame>90&&<g opacity={ease((frame-90)/25)}><ellipse cx="1450" cy="1000" rx="100" ry="24" fill="#020A13"/><CharacterTurnV5 id="hall-double" x={1450} y={995} scale={1.9} yaw={-.65} headYaw={-.8} lighting="baseline" outfit="hoodie"/></g>}<rect width="1920" height="1080" fill="#050A14" opacity={ease((frame-145)/30)*.85}/></svg>;
const Film:React.FC=()=>{const f=useCurrentFrame();return <AbsoluteFill style={{backgroundColor:'#0A1421'}}>
 <Sequence from={0} durationInFrames={110}><Phone text="DO NOT LOOK OUTSIDE." frame={f}/></Sequence>
 <Sequence from={110} durationInFrames={430}><LastSignalApartmentCheckpoint/></Sequence>
 <Sequence from={540} durationInFrames={245}><City id="ls-street" frame={f-540} double/></Sequence>
 <Sequence from={785} durationInFrames={170}><City id="ls-double" frame={f-785} double closer/></Sequence>
 <Sequence from={955} durationInFrames={190}><Phone text="THAT IS YOU." sub="30 SECONDS FROM NOW." frame={f-955}/></Sequence>
 <Sequence from={1145} durationInFrames={135}><City id="ls-disappear" frame={f-1145+310} double/></Sequence>
 <Sequence from={1280} durationInFrames={105}><Phone text="YOU HAVE ALREADY LOOKED." frame={f-1280}/></Sequence>
 <Sequence from={1385} durationInFrames={127}><Hall frame={f-1385}/></Sequence>
 </AbsoluteFill>};
const Root=()=> <><Composition id="LastSignalFullSilent" component={Film} durationInFrames={1512} fps={30} width={1920} height={1080}/><Composition id="LastSignalStreetCheckpoint" component={()=> <City id="ls-check" frame={75} double/>} durationInFrames={1} fps={30} width={1920} height={1080}/><Composition id="LastSignalHallCheckpoint" component={()=> <Hall frame={105}/>} durationInFrames={1} fps={30} width={1920} height={1080}/></>;
registerRoot(Root);
