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
const Photo:React.FC<{frame:number}>=({frame})=><AbsoluteFill style={{justifyContent:'center',alignItems:'center',transform:`scale(${1+smooth(frame,0,220)*.16})`}}><div style={{width:740,height:650,background:'#BBAA91',border:'20px solid #E1D0AF',boxShadow:'0 24px 100px #000',position:'relative',overflow:'hidden'}}><div style={{position:'absolute',inset:20,background:'linear-gradient(#3C4851,#141D28)'}}/><div style={{position:'absolute',top:70,left:170,width:400,height:500,borderLeft:'40px solid #4D5760',borderRight:'40px solid #4D5760',background:'#26303B'}}/><div style={{position:'absolute',bottom:40,left:320,width:100,height:320,background:'#0D131D',borderRadius:'55% 55% 8% 8%'}}/><div style={{position:'absolute',bottom:40,left:420,width:75,height:460,background:'#02050A',borderRadius:'50% 50% 0 0',opacity:smooth(frame,90,145)}}/><div style={{position:'absolute',bottom:500,left:280,width:170,height:42,...textStyle,fontSize:28}}>2:13 AM</div></div></AbsoluteFill>;
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
