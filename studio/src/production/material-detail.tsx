import React from 'react';
import {WorldCamera,WorldPoint,projectWorld,planeTransform,floorPolygon} from '../episodes/probability-control/pseudo-depth-camera';
import type {WorldBox,WorldSceneSpec} from './scene-system';
const W=(x:number,y:number,z:number):WorldPoint=>({x,y,z});
const n=(v:number)=>{const s=Math.sin(v*127.1+11.7)*43758.5453;return s-Math.floor(s)};
const Face:React.FC<{points:WorldPoint[];camera:WorldCamera;fill:string;stroke?:string;opacity?:number}>=({points,camera,fill,stroke,opacity})=><path d={floorPolygon(points,camera)} fill={fill} stroke={stroke} strokeWidth="2" opacity={opacity}/>;
const Panel:React.FC<{point:WorldPoint;camera:WorldCamera;width:number;height:number;fill:string;stroke?:string;children?:React.ReactNode}>=({point,camera,width,height,fill,stroke,children})=><g transform={planeTransform(point,camera)}><rect x={-width/2} y={-height} width={width} height={height} rx="3" fill={fill} stroke={stroke??'#758494'} strokeWidth="3"/>{children}</g>;
export const ArchitecturalDetail:React.FC<{box:WorldBox;camera:WorldCamera;sceneId:string}>=({box:b,camera:c,sceneId})=>{
 const {x,y,z,width:w,height:h,depth:d,material,id}=b;
 const glass=material==='glass',wood=material==='wood',metal=material==='metal';
 const seed=id.split('').reduce((v,ch)=>v+ch.charCodeAt(0),0);
 return <g>
 <Face points={[W(x+7,y+8,z-3),W(x+w-7,y+8,z-3),W(x+w-7,y+h-8,z-3),W(x+7,y+h-8,z-3)]} camera={c} fill="none" stroke={wood?'#C2A38D':glass?'#79B3C2':'#83919E'} opacity={.35}/>
 {Array.from({length:Math.max(1,Math.floor(h/115))},(_,r)=>{
 const yy=y+35+r*115;return <Face key={'seam'+r} points={[W(x+5,yy,z-5),W(x+w-5,yy,z-5),W(x+w-5,yy+2,z-5),W(x+5,yy+2,z-5)]} camera={c} fill={wood?'#A38780':'#8997A3'} opacity={.13}/>;
 })}
 {Array.from({length:Math.max(1,Math.floor(w/145))},(_,col)=>{
 const xx=x+40+col*145;return <Face key={'joint'+col} points={[W(xx,y+8,z-6),W(xx+2,y+8,z-6),W(xx+2,y+h-8,z-6),W(xx,y+h-8,z-6)]} camera={c} fill="#8995A1" opacity={.16}/>;
 })}
 {b.windows&&Array.from({length:Math.floor(h/110)},(_,r)=>Array.from({length:Math.floor(w/100)},(_,col)=>{
 const px=x+50+col*100,py=y+55+r*110,lit=n(seed+r*17+col*31)>.77;
 return <Panel key={'window'+r+'-'+col} point={W(px,py,z-11)} camera={c} width={55} height={72} fill={lit?'#987C67':'#12273B'} stroke="#78899A">
 <rect x="-21" y="-64" width="42" height="56" fill={lit?'#D4B28A':'#1D3548'} opacity=".68"/>
 <path d="M0 -67V0M-25 -35H25" stroke="#8DA2B0" strokeWidth="3"/>
 <path d="M-33 6H33" stroke="#A0A7AC" strokeWidth="5"/>
 {lit&&<rect x="-21" y="-64" width="42" height="56" fill="#F3C48D" opacity=".09"/>}
 </Panel>;
 }))}
 {metal&&<g>
 {Array.from({length:Math.max(1,Math.floor(h/120))},(_,i)=><Panel key={'bolt'+i} point={W(x+w/2,y+60+i*120,z-9)} camera={c} width={w*.68} height={12} fill="#6C7886" stroke="#A3A8A9"><circle cx={-w*.25} cy="-6" r="3" fill="#C8BBAA"/><circle cx={w*.25} cy="-6" r="3" fill="#C8BBAA"/></Panel>)}
 </g>}
 {wood&&<g>{Array.from({length:4},(_,i)=><Face key={'grain'+i} points={[W(x+10,y+h*.15+i*16,z-8),W(x+w-10,y+h*.15+i*16,z-8),W(x+w-10,y+h*.15+i*16+1,z-8),W(x+10,y+h*.15+i*16+1,z-8)]} camera={c} fill="#D7B29A" opacity={.23}/>)}</g>}
 {glass&&<Face points={[W(x+8,y+5,z-9),W(x+w*.3,y+5,z-9),W(x+w*.65,y+h-5,z-9),W(x+w*.5,y+h-5,z-9)]} camera={c} fill="#B8E0E9" opacity={.13}/>}
 </g>;
};
export const CinematicAtmosphere:React.FC<{spec:WorldSceneSpec;camera:WorldCamera;frame:number}>=({spec,camera:c,frame})=>{
 const id=spec.id,night=spec.background?.startsWith('#0A')??false;
 return <g>
 <defs><radialGradient id={id+'haze'}><stop stopColor={night?'#7396AC':'#D1A38A'} stopOpacity=".18"/><stop offset="1" stopColor="#26384A" stopOpacity="0"/></radialGradient><linearGradient id={id+'floor'} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#71818D" stopOpacity=".18"/><stop offset="1" stopColor="#0B1828" stopOpacity=".05"/></linearGradient></defs>
 <Face points={[W(-2000,1,0),W(2000,1,0),W(2000,1,2200),W(-2000,1,2200)]} camera={c} fill={`url(#${id}floor)`}/>
 <ellipse cx="1260" cy="550" rx="820" ry="500" fill={`url(#${id}haze)`}/>
 {Array.from({length:24},(_,i)=>{const p=projectWorld(W((n(i*3+5)-.5)*2200,250+n(i*7+2)*700,100+n(i*11+3)*1200),c);return <path key={i} d={`M${p.x} ${p.y}l${-2*p.scale} ${16*p.scale}`} stroke="#B6C7D0" strokeWidth="1" opacity=".12"/>})}
 </g>;
};
