import React from 'react';
import {AbsoluteFill,Composition,registerRoot,useCurrentFrame,interpolate} from 'remotion';
import {SceneRenderer,WorldSceneSpec,WorldBox} from './production/scene-system';
import {CinematicHallway} from './door-cinematic-hallway';
import {CharacterTurnV5} from './episodes/probability-control/character-turn-v5';

const fps=30;
const cuts=[0,165,390,600,870,1140,1335,1500,1665,1736] as const;
const box=(id:string,x:number,y:number,z:number,width:number,height:number,depth:number,material:WorldBox['material']):WorldBox=>({id,x,y,z,width,height,depth,material});
const corridor:WorldBox[]=[
 box('wall-left',-1100,0,150,90,830,1250,'wall'),
 box('wall-right',980,0,150,90,830,1250,'wall'),
 box('far-wall',-1050,0,1370,2100,830,65,'wall'),
 box('door-frame-left',-410,0,1280,55,740,80,'wood'),
 box('door-frame-right',350,0,1280,55,740,80,'wood'),
 box('door',-355,0,1275,705,720,42,'wood'),
 box('threshold',-390,0,1200,780,26,140,'metal'),
 box('light-left',-750,610,700,75,22,75,'metal'),
 box('light-right',710,610,700,75,22,75,'metal'),
 box('picture-frame',610,245,1270,235,320,25,'wood'),
];
const scene=(id:string,duration:number,actor:boolean,camX:number,camZ:number):WorldSceneSpec=>({
 kind:'world',id,duration,background:'#101B2B',
 camera:[{frame:0,x:camX,y:410,z:camZ,focal:1240},{frame:duration-1,x:camX+65,y:408,z:camZ+55,focal:1290}],
 boxes:corridor,actors:actor?[{id:'ethan',x:-240,y:0,z:350,scale:1.3,yaw:.25,headYaw:.15,outfit:'puffer-black',lighting:'baseline'}]:[]
});
const shots=[
 scene('knock',165,true,-150,-350),
 scene('warning',225,true,-100,-340),
 scene('recognition',210,true,-190,-240),
 scene('older-double',270,false,0,-170),
 scene('photograph',270,false,-100,-220),
 scene('old-warning',195,false,-90,-250),
 scene('turn-empty',165,true,-150,-380),
 scene('blackout',165,true,-50,-320),
 scene('escape',71,true,50,-200),
];
const smooth=(v:number,a:number,b:number)=>interpolate(v,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const textStyle:React.CSSProperties={position:'absolute',fontFamily:'Arial,sans-serif',fontWeight:800,color:'#F5E9D8',textShadow:'0 4px 18px #000',letterSpacing:3,textAlign:'center'};
const Peephole:React.FC<{frame:number}>=({frame})=><AbsoluteFill style={{background:'radial-gradient(ellipse at center, transparent 17%, #0B0D16 56%, #03050A 85%)',opacity:smooth(frame,0,32),pointerEvents:'none'}}><div style={{position:'absolute',left:'35%',top:'20%',width:'30%',height:'60%',border:'15px solid #6F665B',borderRadius:'50%',boxShadow:'0 0 60px #000 inset'}}/></AbsoluteFill>;
const Photo:React.FC<{frame:number}>=({frame})=><AbsoluteFill style={{justifyContent:'center',alignItems:'center'}}>
 <svg width="100%" height="100%" viewBox="0 0 1920 1080">
 <defs>
 <clipPath id="door-photo-mask"><rect x="0" y="0" width="770" height="810" rx="5"/></clipPath>
 <linearGradient id="door-photo-paper" x2="1" y2="1"><stop stopColor="#EEE0C9"/><stop offset="1" stopColor="#9D8C7E"/></linearGradient>
 </defs>
 <g transform={`translate(585 65) rotate(-2 390 460) scale(${1+smooth(frame,0,240)*.08})`}>
 <rect x="-27" y="-27" width="824" height="934" rx="8" fill="url(#door-photo-paper)" stroke="#DBCCB4" strokeWidth="11"/>
 <g clipPath="url(#door-photo-mask)">
 <svg x="0" y="0" width="770" height="810" viewBox="270 110 1350 880" preserveAspectRatio="xMidYMid slice">
 <CinematicHallway id="photo-world" shot={7} frame={130}/>
 </svg>
 {/* An actual approved-rig Ethan, in front of the shadow inside this evidence photograph. */}
 <ellipse cx="518" cy="711" rx="83" ry="15" fill="#0B1420" opacity=".5"/>
 <g transform="translate(520 716) scale(.91)">
 <CharacterTurnV5 id="photo-young-ethan" x={0} y={0} scale={1} yaw={-.53} headYaw={-.76} outfit="puffer-black" lighting="sunset" mood="concerned"/>
 </g>
 <rect x="0" y="0" width="770" height="810" fill="#C1A991" opacity=".22"/>
 </g>
 <text x="385" y="863" fontFamily="monospace" fontWeight="bold" fontSize="30" fill="#4C403D" textAnchor="middle">HALLWAY 213 — 02:13 AM</text>
 </g>
 </svg>
 </AbsoluteFill>;
const Film:React.FC=()=>{
 const frame=useCurrentFrame();let index=cuts.findIndex((v,i)=>i<cuts.length-1&&frame>=v&&frame<cuts[i+1]);if(index<0)index=8;
 const local=frame-cuts[index],spec=shots[index];
 return <AbsoluteFill style={{background:'#090F19'}}>
 <CinematicHallway id={spec.id} shot={index} frame={local}/>
 {index===0&&<div style={{...textStyle,top:85,width:'100%',fontSize:46}}>APARTMENT 213</div>}

 {index===4&&<Photo frame={local}/>}
 </AbsoluteFill>;
};
const Root=()=> <><Composition id="DoorKnockedBackPreview" component={Film} durationInFrames={1736} fps={fps} width={1920} height={1080}/></>;
registerRoot(Root);
