import React from 'react';
import {AbsoluteFill,Composition,registerRoot,useCurrentFrame,interpolate} from 'remotion';
import {SceneRenderer,WorldSceneSpec,WorldBox} from './production/scene-system';
import {DoorStoryBeat} from './door-story-actors';

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
const Photo:React.FC<{frame:number}>=({frame})=><AbsoluteFill style={{justifyContent:'center',alignItems:'center',transform:`scale(${1+smooth(frame,0,220)*.12})`}}>
 <svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <defs><linearGradient id="photoCorridor" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#66717A"/><stop offset="1" stopColor="#182331"/></linearGradient><linearGradient id="photoPaper" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#E6D7B8"/><stop offset="1" stopColor="#AA947B"/></linearGradient></defs>
 <g transform="translate(620 120) rotate(-3 340 405)">
 <rect x="-25" y="-25" width="730" height="850" rx="7" fill="url(#photoPaper)" stroke="#F0DEC2" strokeWidth="16"/>
 <rect width="680" height="760" fill="url(#photoCorridor)"/>
 <path d="M0 0L230 230V760H0ZM680 0L450 230V760H680Z" fill="#283544" stroke="#7F8992" strokeWidth="6"/>
 <path d="M0 0L230 230H450L680 0" fill="#3E4C58" stroke="#A4A9A7" strokeWidth="5"/>
 <path d="M0 760L230 230H450L680 760" fill="#46505A" stroke="#8B9296" strokeWidth="4"/>
 <rect x="273" y="235" width="136" height="285" fill="#352B31" stroke="#B5A08C" strokeWidth="13"/>
 <rect x="284" y="247" width="114" height="262" fill="#1A1E29"/>
 <text x="340" y="282" textAnchor="middle" fontFamily="Arial" fontSize="20" fill="#D6C6AA">213</text>
 <g transform="translate(260 650)"><ellipse cx="0" cy="-165" rx="34" ry="43" fill="#141A23"/><path d="M-50 -115Q0 -150 50 -115L42 20H-42Z" fill="#3B4652" stroke="#89919B" strokeWidth="6"/><path d="M-24 20L-33 105M24 20L33 105" stroke="#202A37" strokeWidth="22" strokeLinecap="round"/><path d="M-48 -100L-65 5M48 -100L62 5" stroke="#394655" strokeWidth="17" strokeLinecap="round"/></g>
 <g transform="translate(420 670)" opacity={smooth(frame,30,110)}><ellipse cx="0" cy="-270" rx="41" ry="62" fill="#050810"/><path d="M-48 -213Q0 -245 48 -213L75 100H-75Z" fill="#060A12"/><path d="M-55 -200L-95 80M55 -200L95 80" stroke="#080C14" strokeWidth="22" strokeLinecap="round"/><path d="M-20 70L-25 145M20 70L25 145" stroke="#070A12" strokeWidth="25" strokeLinecap="round"/></g>
 <path d="M20 18h640M20 742h640" stroke="#A7AFB3" strokeWidth="2" opacity=".25"/>
 <text x="340" y="801" textAnchor="middle" fontFamily="monospace" fontSize="29" fill="#4B403D">02:13 AM — HALLWAY CAMERA</text>
 </g>
 </svg></AbsoluteFill>;
const Film:React.FC=()=>{
 const frame=useCurrentFrame();let index=cuts.findIndex((v,i)=>i<cuts.length-1&&frame>=v&&frame<cuts[i+1]);if(index<0)index=8;
 const local=frame-cuts[index],spec=shots[index];
 return <AbsoluteFill style={{background:'#090F19'}}>
 <SceneRenderer spec={spec} frame={local}/>
 <DoorStoryBeat shot={index} frame={local}/>
 {index===0&&<div style={{...textStyle,top:85,width:'100%',fontSize:46}}>APARTMENT 213</div>}

 {index===4&&<Photo frame={local}/>}
 {index===6&&<AbsoluteFill style={{background:'#050810',opacity:smooth(local,95,155)*.35}}/>}
 {index===7&&<AbsoluteFill style={{background:'#02040A',opacity:.82+Math.sin(local*.3)*.1}}/>}
 {index===8&&<div style={{...textStyle,bottom:120,width:'100%',fontSize:78,opacity:smooth(local,8,24)}}>RUN!</div>}
 </AbsoluteFill>;
};
const Root=()=> <><Composition id="DoorKnockedBackPreview" component={Film} durationInFrames={1736} fps={fps} width={1920} height={1080}/></>;
registerRoot(Root);
