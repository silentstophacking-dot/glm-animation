import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {WorldCamera,WorldPoint,planeTransform,floorPolygon,projectWorld} from '../episodes/probability-control/pseudo-depth-camera';
import {CharacterTurnV5} from '../episodes/probability-control/character-turn-v5';
import type {CharacterOutfit} from '../episodes/probability-control/character-outfits';
import {AnomalyScene} from '../episodes/probability-control/lab-time-anomaly-proof';
import {discoveryActorAt} from '../episodes/probability-control/clock-discovery-motion';
export type CameraKey={frame:number;x:number;y:number;z:number;focal:number};
export type WorldBox={id:string;x:number;y:number;z:number;width:number;height:number;depth:number;material:'wall'|'metal'|'wood'|'glass';windows?:boolean};
export type ActorCue={id:string;x:number;y:number;z:number;scale?:number;yaw?:number;headYaw?:number;outfit?:CharacterOutfit;lighting?:'baseline'|'sunset'};
export type WorldSceneSpec={kind:'world';id:string;duration:number;camera:CameraKey[];boxes:WorldBox[];actors:ActorCue[];background?:string};
export type ApprovedSceneSpec={kind:'approved-clock';id:string;duration:number;sourceFrame:number};
export type SceneSpec=WorldSceneSpec|ApprovedSceneSpec;
export const W=(x:number,y:number,z:number):WorldPoint=>({x,y,z});
const ease=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t)};
export function cameraAt(keys:CameraKey[],frame:number):WorldCamera{
 if(keys.length===0)throw Error('A world scene requires a camera key');
 if(frame<=keys[0].frame)return keys[0];
 for(let i=1;i<keys.length;i++){const b=keys[i],a=keys[i-1];if(frame<=b.frame){const t=ease((frame-a.frame)/(b.frame-a.frame));return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t,focal:a.focal+(b.focal-a.focal)*t};}}
 return keys[keys.length-1];
}
const palette={wall:['#2A3548','#162438','#526277'],metal:['#586372','#283649','#9AA4AA'],wood:['#6A5154','#302E3C','#A68A7F'],glass:['#3B6374','#162A40','#93B6BC']} as const;
const Surface:React.FC<{points:WorldPoint[];camera:WorldCamera;fill:string;stroke:string}>=({points,camera,fill,stroke})=><path d={floorPolygon(points,camera)} fill={fill} stroke={stroke} strokeWidth="2"/>;
const Building:React.FC<{box:WorldBox;camera:WorldCamera}>=({box:b,camera:c})=>{
 const [front,side,edge]=palette[b.material],x=b.x,y=b.y,z=b.z,w=b.width,h=b.height,d=b.depth;
 return <g><Surface points={[W(x+w,y,z),W(x+w,y,z+d),W(x+w,y+h,z+d),W(x+w,y+h,z)]} camera={c} fill={side} stroke={edge}/>
 <Surface points={[W(x,y,z),W(x+w,y,z),W(x+w,y+h,z),W(x,y+h,z)]} camera={c} fill={front} stroke={edge}/>
 <Surface points={[W(x,y+h,z),W(x+w,y+h,z),W(x+w,y+h,z+d),W(x,y+h,z+d)]} camera={c} fill={side} stroke={edge}/>
 {b.windows&&Array.from({length:Math.floor(h/100)},(_,r)=>Array.from({length:Math.floor(w/90)},(_,col)=>{const p=projectWorld(W(x+28+col*90,y+60+r*100,z-2),c);return <g key={r+'-'+col} transform={`translate(${p.x} ${p.y}) scale(${p.scale})`}><rect x="0" y="-35" width="42" height="53" fill={(r+col)%7===0?'#D2A982':'#182A3B'} stroke="#82929E" strokeWidth="3"/><path d="M21 -35V18M0 -8H42" stroke="#82929E" strokeWidth="2"/></g>}))}</g>;
};
export const SceneRenderer:React.FC<{spec:SceneSpec;frame:number}>=({spec,frame})=>{
 if(spec.kind==='approved-clock')return <AbsoluteFill style={{background:'#161C2A'}}><svg viewBox="0 0 1920 1080" width="100%" height="100%"><AnomalyScene frame={spec.sourceFrame+frame} id={spec.id} refinedClock performance={discoveryActorAt(spec.sourceFrame+frame)}/></svg></AbsoluteFill>;
 const c=cameraAt(spec.camera,frame);
 return <AbsoluteFill style={{background:spec.background??'#101B2A'}}><svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <defs><radialGradient id={spec.id+'vignette'}><stop offset=".45" stopColor="#050B16" stopOpacity="0"/><stop offset="1" stopColor="#050B16" stopOpacity=".65"/></radialGradient></defs>
 <Surface points={[W(-3000,0,-200),W(3000,0,-200),W(3000,0,2400),W(-3000,0,2400)]} camera={c} fill="#263241" stroke="#536071"/>
 {spec.boxes.map(b=><Building key={b.id} box={b} camera={c}/>)}
 {spec.actors.map(a=><g key={a.id} transform={planeTransform(W(a.x,a.y,a.z),c)}><CharacterTurnV5 id={spec.id+'-'+a.id} x={0} y={0} scale={a.scale??1} yaw={a.yaw??0} headYaw={a.headYaw??a.yaw??0} outfit={a.outfit??'hoodie'} lighting={a.lighting??'baseline'}/></g>)}
 <rect width="1920" height="1080" fill={`url(#${spec.id}vignette)`}/>
 </svg></AbsoluteFill>;
};
export const ProductionScene:React.FC<{spec:SceneSpec}>=({spec})=><SceneRenderer spec={spec} frame={useCurrentFrame()}/>;
