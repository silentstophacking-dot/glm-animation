import React from 'react';
import {RoomCuboid as Box,RoomFace,RoomLine,W,floorEllipse} from './episodes/probability-control/lab-room-geometry';
import {planeTransform,projectWorld,WorldCamera} from './episodes/probability-control/pseudo-depth-camera';
import {CharacterTurnV5} from './episodes/probability-control/character-turn-v5';
import {discoveryActorAt} from './episodes/probability-control/clock-discovery-motion';
import {characterV2At,v2HandLocal} from './episodes/probability-control/character-v2-motion';
import {doorEthanPerformance,olderEthanPerformance,doorEscapePerformance} from './door-acting-performance';
import {HallwayPracticalDetails} from './door-hall-practicals';
import {CinematicOlderEthan} from './door-aged-ethan';
import {DoorReverseCorridor} from './door-reverse-corridor';
const smooth=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t)};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const CinematicHallway:React.FC<{id:string;shot:number;frame:number}>=({id,shot,frame:f})=>{
 const old=shot===3||shot===5,blackout=shot===7;
 const escape=shot===8;
 const open=shot===8?smooth((f-7)/14)*(1-smooth((f-49)/16)):0;
 const cameras=[[-150,380,245],[-180,370,260],[-150,365,435],[-30,430,520],[-175,370,-290],[-20,435,410],[-180,370,220],[-140,370,120],[-190,370,-120]] as const;
 const [cx,cy,cz]=cameras[shot]??cameras[0];
 const c:WorldCamera={x:cx+25*smooth(f/200),y:cy,z:cz+30*smooth(f/180),focal:1200};
 const url=(s:string)=>`url(#${id+s})`;
 const slab=(x0:number,x1:number,y0:number,y1:number,z0:number,z1:number,front:string,side='#2B303F',top='#9D857B')=><Box box={{x0,x1,y0,y1,z0,z1}} camera={c} front={front} side={side} top={top}/>;
 const width=500,hinge=-260,theta=open*1.45;
 // Three knocks physically displace the same hinged door, not a screen-space caption.
 const knocks=shot===0?[18,34,50].reduce((v,t)=>v+Math.exp(-Math.pow((f-t)/3.8,2)),0):0;
 const z=980-28*knocks;
 const doorPt=(x:number,y:number)=>W(hinge+x*Math.cos(theta),y,z+x*Math.sin(theta));
 const progress=smooth(f/70);
 const actorZ=shot===8?mix(625,1030,smooth(f/60)):shot===0?915:shot===1?815:shot===2?830:shot===6||shot===7?600:95;
 const actorX=shot===8?mix(-90,25,smooth(f/55)):shot===0?10:shot===1?-20:shot===2?-35:-125;
 // Editorial camera coverage: these crops operate on the same projected world,
 // rather than moving backgrounds independently. Establish/medium/insert/reverse/escape.
 // Optical cuts track exact projected character anchors; world-space walls and props never slide.
 // Each crop is a camera decision, not a different world or re-drawn figure.
 const actorAnchor=projectWorld(W(actorX,0,actorZ),c);
 const actorHeadY=actorAnchor.y-326*actorAnchor.scale*1.55;
 const elderAnchor=projectWorld(W(0,0,980),c);
 const elderHeadY=elderAnchor.y-326*elderAnchor.scale*1.8;
 const threatAnchor=projectWorld(W(escape?mix(620,325,smooth(f/65)):220,0,escape?mix(110,515,smooth(f/65)):550),c);
 const threatHeadY=threatAnchor.y-490*threatAnchor.scale;
 const crops:Record<number,[number,number,number]>={
  0:[625,96,1030],     // room, key and visibly knocking door
  1:[650,125,940],     // interrupted reaching arm and face
  2:[actorAnchor.x-155,actorHeadY-63,310], // full facial acting insert
  3:[elderAnchor.x-255,elderHeadY-95,510], // much larger aged double
  4:[0,0,1920],       // diegetic photo
  5:[elderAnchor.x-325,elderHeadY-150,650], // scar, eye movement, warning
  6:[520,115,1020],   // look back into corridor
  7:[threatAnchor.x-565,threatHeadY-135,1130], // keep creature visible
  8:[520,120,1250],   // physical escape and door closure
 };
 // Intentional internal cuts add visual progression without replacing the original world rig.
 let [cropX,cropY,cropW]=crops[shot]??crops[0];
 const knob=projectWorld(doorPt(width-90,405),c),peephole=projectWorld(doorPt(250,510),c);
 const near=(x:number,y:number,w:number)=>{cropX=x-w/2;cropY=y-w*9/32;cropW=w;};
 if(shot===0&&f>=61&&f<113)near(knob.x-48,knob.y-80,495); // key & handle insert
 if(shot===0&&f>=113){cropX=650;cropY=125;cropW=850;} // Ethan hears the knock
 if(shot===1&&f>=105)near(actorAnchor.x,actorHeadY+75,620); // held reaction
 if(shot===2&&f>=112)near(peephole.x,peephole.y,380); // actual spyglass insert
 if(shot===3&&f<80)near(elderAnchor.x,elderHeadY+195,800); // first reveal of matching puffer
 if(shot===3&&f>=188)near(elderAnchor.x,elderHeadY+40,430); // scar/eyeline
 if(shot===5&&f>=93)near(elderAnchor.x,elderHeadY+195,750); // warning hand gesture
 if(shot===8&&f>=47)near(knob.x-115,knob.y-75,950); // final slam
 
 const motionPush=shot===2?.04:shot===3?.06:shot===5?.075:shot===7?.08:.04;
 const zoom=1-motionPush*smooth(f/(shot===8?65:180));
 const viewWidth=cropW*zoom,viewHeight=viewWidth*9/16;
 const viewX=cropX+(cropW-viewWidth)*.5,viewY=cropY+(cropW*9/16-viewHeight)*.5;
 const reaction=doorEthanPerformance(shot,f);
 const walk=doorEscapePerformance(f);
 if(shot===6&&f>=105)return <DoorReverseCorridor id={id+'pov'} frame={f-105}/>;
 if(shot===7)return <DoorReverseCorridor id={id+'threat'} frame={f} danger/>;
 return <svg viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`} width="100%" height="100%">
 <defs>
 <linearGradient id={id+'wall'} x2=".85" y2="1"><stop stopColor="#443544"/><stop offset=".6" stopColor="#302B40"/><stop offset="1" stopColor="#142133"/></linearGradient>
 <linearGradient id={id+'floor'} x2=".2" y2="1"><stop stopColor="#5D4C58"/><stop offset=".45" stopColor="#3E3748"/><stop offset="1" stopColor="#152132"/></linearGradient>
 <linearGradient id={id+'wood'} x2="1" y2=".2"><stop stopColor="#775654"/><stop offset=".33" stopColor="#47313B"/><stop offset="1" stopColor="#231D2C"/></linearGradient>
 <radialGradient id={id+'light'}><stop stopColor="#EAC09B" stopOpacity=".54"/><stop offset="1" stopColor="#EAC09B" stopOpacity="0"/></radialGradient>
 <radialGradient id={id+'threatGlow'}><stop stopColor="#AD8C9A" stopOpacity=".48"/><stop offset=".32" stopColor="#A66574" stopOpacity=".25"/><stop offset="1" stopColor="#221C35" stopOpacity="0"/></radialGradient>
 <radialGradient id={id+'vignette'}><stop offset=".35" stopColor="#090F1C" stopOpacity="0"/><stop offset="1" stopColor="#090F1C" stopOpacity=".72"/></radialGradient>
 <filter id={id+'shadow'}><feGaussianBlur stdDeviation="5"/></filter>
 </defs>
 <rect width="1920" height="1080" fill="#172235"/>
 <RoomFace points={[W(-1450,0,1040),W(1450,0,1040),W(1450,900,1040),W(-1450,900,1040)]} camera={c} fill={url('wall')}/>
 <RoomFace points={[W(-1450,0,-600),W(-1450,0,1040),W(-1450,900,1040),W(-1450,900,-600)]} camera={c} fill="#282637"/>
 <RoomFace points={[W(1450,0,1040),W(1450,0,-600),W(1450,900,-600),W(1450,900,1040)]} camera={c} fill="#1C293A"/>
 <RoomFace points={[W(-1450,900,-600),W(-1450,900,1040),W(1450,900,1040),W(1450,900,-600)]} camera={c} fill="#141D2C"/>
 <RoomFace points={[W(-1450,0,-600),W(1450,0,-600),W(1450,0,1040),W(-1450,0,1040)]} camera={c} fill={url('floor')}/>
 {Array.from({length:17},(_,i)=><RoomLine key={i} a={W(-1450+i*180,1,-600)} b={W(-1450+i*180,1,1040)} camera={c} stroke="#A98F94" opacity={.16}/>)}
 {Array.from({length:13},(_,i)=><RoomLine key={i} a={W(-1450,1,-540+i*128)} b={W(1450,1,-540+i*128)} camera={c} stroke="#B09490" opacity={.16}/>)}
 {[-1450,1400].map((x,i)=><g key={i}>{slab(x,x+50,0,38,-550,1040,'#4B3C47')}{slab(x,x+50,690,715,-550,1040,'#564451')}{slab(x,x+50,830,860,-550,1040,'#383543')}{Array.from({length:7},(_,j)=>slab(x,x+65,38,830,-350+j*215,-330+j*215,'#3D3545','#242A39','#84777A'))}</g>)}
 {[-800,800].map((x,i)=><g key={i}>
 {slab(x-40,x+40,440,590,940,1010,'#574C56')}
 <g transform={planeTransform(W(x,575,930),c)}><circle r="245" fill={url('light')}/><path d="M-35 -10L-48 -95H48L35 -10Z" fill="#D7B897" stroke="#ECD2B5" strokeWidth="6"/><path d="M-25 -65H25" stroke="#FAE2BD" strokeWidth="4"/></g>
 </g>)}
 {(old||escape)&&<g>
 {/* Interior behind the doorway: warm practical light, actual wall recess, books and window. */}
 <RoomFace points={[W(-310,0,1002),W(355,0,1002),W(355,815,1002),W(-310,815,1002)]} camera={c} fill="#433A49" stroke="#8B777C"/>
 <RoomFace points={[W(-305,380,1000),W(-80,380,1000),W(-80,775,1000),W(-305,775,1000)]} camera={c} fill="#7D6570" stroke="#C3A08A"/>
 <RoomFace points={[W(-294,389,998),W(-91,389,998),W(-91,760,998),W(-294,760,998)]} camera={c} fill="#C49A86" stroke="#D9B5A0"/>
 {[-230,-165].map(x=><RoomLine key={'inner-window'+x} a={W(x,400,996)} b={W(x,750,996)} camera={c} stroke="#574653" width={9}/>)}
 {[490,585,680].map(y=><RoomLine key={'interior-blind'+y} a={W(-294,y,994)} b={W(-91,y,994)} camera={c} stroke="#685363" width={7} opacity={.65}/>)}
 {slab(238,336,80,550,982,1000,'#433847','#222A3C','#997F79')}
 {Array.from({length:4},(_,i)=>slab(250+i*18,265+i*18,345,485,970,990,['#7B6671','#4D6876','#A1827C','#5B5168'][i],'#2C3040','#C0A593'))}
 <g transform={planeTransform(W(305,610,974),c)}><ellipse rx="180" ry="260" fill={url('light')} opacity=".55"/><path d="M-25 -30L-37 -115H37L25 -30Z" fill="#E2B98C" stroke="#F6D6AE" strokeWidth="6"/></g>
 </g>}
 {!escape&&slab(-340,350,0,815,1020,1040,'#0C1320')}
 {slab(-365,-318,0,840,920,1060,'#65505A')}
 {slab(350,395,0,840,920,1060,'#62505A')}
 {slab(-365,395,815,845,910,1070,'#67545D')}
 {escape&&f<35&&<g transform={planeTransform(W(205,0,1150),c)} opacity={1-smooth((f-25)/10)}><CinematicOlderEthan id={id+'rescuer'} frame={f} scale={1.55} action="open"/></g>}
 {!old&&!(escape&&f>=43)&&<g> <RoomFace points={[doorPt(0,0),doorPt(width,0),doorPt(width,795),doorPt(0,795)]} camera={c} fill={url('wood')} stroke="#B19686"/>
 {[70,415].map(y=><RoomFace key={y} points={[doorPt(30,y),doorPt(width-30,y),doorPt(width-30,y+282),doorPt(30,y+282)]} camera={c} fill="none" stroke="#9D7E75"/>)}
 <g transform={planeTransform(doorPt(width-90,405),c)}><circle r="19" fill="#B79B74" stroke="#F0D1A4" strokeWidth="5"/><path d="M8 0h26" stroke="#E5CEAE" strokeWidth="8" strokeLinecap="round"/></g>
 <g transform={planeTransform(doorPt(250,690),c)}><rect x="-80" y="-35" width="160" height="65" rx="3" fill="#6E6060" stroke="#BAA189" strokeWidth="4"/><text textAnchor="middle" y="12" fontFamily="Arial" fontWeight="bold" fontSize="38" fill="#F1D5B0">213</text></g>
 <g transform={planeTransform(doorPt(250,510),c)}><circle r="14" fill="#091522" stroke="#E1C19A" strokeWidth="6"/></g>
</g>}
 {slab(590,970,350,635,1000,1040,'#1D2939','#222938','#AB8980')}
 <g transform={planeTransform(W(765,610,993),c)}><rect x="-150" y="0" width="300" height="205" fill="#243241" stroke="#A79887" strokeWidth="3"/><text x="0" y="30" textAnchor="middle" fill="#D8B5A0" fontFamily="Arial" fontWeight="bold" fontSize="29">FIRE EXIT</text><path d="M-115 58h230v112h-230Z M0 58v112M-115 114h230" stroke="#718692" strokeWidth="4" fill="none"/><path d="M-82 149L-28 114L55 114L93 73" stroke="#9CC5B9" strokeWidth="8" fill="none"/><circle cx="-82" cy="149" r="10" fill="#D99B82"/></g>
 {slab(-1180,-760,0,570,920,1030,'#272A3B','#1C2637','#695A65')}
 <g transform={planeTransform(W(-990,390,892),c)}><rect x="-95" y="-260" width="190" height="300" fill="#38424F" stroke="#8E8B8C" strokeWidth="10"/><rect x="-75" y="-240" width="150" height="225" fill="#182A3E" stroke="#A9A29C" strokeWidth="3"/><path d="M-12 -160v86m-52 -44h100" stroke="#B69B88" strokeWidth="10"/><text x="0" y="-222" fontFamily="Arial" textAnchor="middle" fontSize="21" fill="#DAB59E">EMERGENCY</text></g>
 <HallwayPracticalDetails camera={c} id={id+'practical'}/>
 {old?<g transform={planeTransform(W(0,0,980),c)}><CinematicOlderEthan id={id+'old'} frame={f}/></g>:null}
 {!old&&<g>
 <path d={floorEllipse(actorX,actorZ,86,35,c)} fill="#050C17" opacity=".4" filter={url('shadow')}/>
 <g transform={planeTransform(W(actorX,0,actorZ),c)}>
 <CharacterTurnV5 id={id+'actor'} x={0} y={0} scale={1.55} yaw={shot===6?mix(.25,.94,smooth(f/95)):shot===8?.7:.32} headYaw={shot===6?mix(.3,1,smooth(f/80)):.4} outfit="puffer-black" lighting="sunset" mood={shot>=7?'surprised':'concerned'} pose={shot===8?walk:reaction}/>
 </g>
 {shot===0&&<g transform={planeTransform(W(actorX,0,actorZ),c)}>
 {(()=>{const palm=v2HandLocal(reaction);return <g transform={`translate(${palm.x*1.55} ${palm.y*1.55}) rotate(-20)`}>
 <circle r="7" fill="none" stroke="#DCC096" strokeWidth="3"/>
 <path d="M6 0H30v5h-6v8h-5V5H6" fill="#C9AA79" stroke="#E4CFA8" strokeWidth="1.4"/>
 </g>;})()}
 </g>}
 </g>}
  {escape&&f>=43&&<g>
 {/* The door now occludes Ethan after he crosses the threshold. The creature remains outside. */}
 <RoomFace points={[doorPt(0,0),doorPt(width,0),doorPt(width,795),doorPt(0,795)]} camera={c} fill={url('wood')} stroke="#E0BCA1"/>
 {[70,415].map(y=><RoomFace key={y} points={[doorPt(30,y),doorPt(width-30,y),doorPt(width-30,y+282),doorPt(30,y+282)]} camera={c} fill="none" stroke="#9D7E75"/>)}
 <g transform={planeTransform(doorPt(width-90,405),c)}><circle r="19" fill="#B79B74" stroke="#F0D1A4" strokeWidth="5"/></g>
 <g transform={planeTransform(doorPt(250,690),c)}><text y="0" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="35" fill="#F1D5B0">213</text></g>
 </g>}

 {shot>=7&&<g transform={planeTransform(W(escape?mix(620,325,smooth(f/65)):220,0,escape?mix(110,515,smooth(f/65)):550),c)} opacity={shot===7?smooth((f-50)/30):smooth((f-12)/15)}>
 <ellipse cy="-300" rx="325" ry="490" fill={url("threatGlow")} opacity=".96"/><ellipse cy="10" rx="110" ry="30" fill="#050914" opacity=".68"/>
 <ellipse cy="-480" rx="40" ry="65" fill="#050913" stroke="#768194" strokeWidth="4"/>
 <path d="M-55 0L-35 -380Q-85 -420 -55 -480H55Q85 -420 35 -380L55 0H15L0 -300L-15 0Z" fill="#060C17" stroke="#6A6F85" strokeWidth="4"/>
 <path d={shot===8?`M-55 -440Q-110 -340 ${-105-30*smooth(f/44)} ${-140-110*smooth(f/44)}`:"M-55 -440L-105 -140"} stroke="#263042" strokeWidth="27" fill="none" strokeLinecap="round"/><path d="M55 -440L105 -140" stroke="#263042" strokeWidth="27" strokeLinecap="round"/>
 </g>}
 <rect width="1920" height="1080" fill={url('vignette')}/>
 {old&&<path d="M0 0H1920V1080H0Z M960 540m-570 0a570 455 0 1 0 1140 0a570 455 0 1 0 -1140 0" fill="#02050B" fillRule="evenodd" opacity=".85"/>}
 {blackout&&<rect width="1920" height="1080" fill="#030710" opacity={.12+.07*Math.sin(f*.28)}/>}
 </svg>;
};
