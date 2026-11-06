import React from 'react';
import {RoomCuboid as Box,RoomFace,RoomLine,W} from './episodes/probability-control/lab-room-geometry';
import {planeTransform,WorldCamera} from './episodes/probability-control/pseudo-depth-camera';
export const HallwayPracticalDetails:React.FC<{camera:WorldCamera;id:string}>=({camera:c,id})=><g>
 <defs><radialGradient id={id+'bounce'}><stop stopColor="#CFA789" stopOpacity=".16"/><stop offset="1" stopColor="#CFA789" stopOpacity="0"/></radialGradient></defs>
 {/* Mailbox bank: bevels, doors, label holders and individual latches. */}
 <Box box={{x0:-1250,x1:-920,y0:200,y1:625,z0:310,z1:410}} camera={c} front="#464758" side="#272D3C" top="#8C7C78"/>
 {Array.from({length:12},(_,i)=>{
 const x=-1222+(i%3)*96,y=265+Math.floor(i/3)*91;
 return <g key={'mail'+i} transform={planeTransform(W(x,y,305),c)}><rect width="87" height="82" rx="3" fill={i%2?'#3C4354':'#4B4A59'} stroke="#A18E84" strokeWidth="3"/><rect x="19" y="13" width="50" height="20" fill="#182A3A" stroke="#8A959A"/><path d="M33 55h20" stroke="#D8BC9B" strokeWidth="5" strokeLinecap="round"/><circle cx="72" cy="57" r="4" fill="#C8B1A1"/></g>;
 })}
 {/* Carpet runner, inset borders, subtle reflected sconces. */}
 <RoomFace points={[W(-210,2,-600),W(215,2,-600),W(215,2,890),W(-210,2,890)]} camera={c} fill="#3A3444" opacity={.5}/>
 {[-212,212].map(x=><RoomLine key={x} a={W(x,3,-600)} b={W(x,3,890)} camera={c} stroke="#B49B8A" width={4} opacity={.35}/>)}
 <RoomFace points={[W(-340,3,825),W(350,3,825),W(350,3,955),W(-340,3,955)]} camera={c} fill="#5B4548"/>
 <RoomLine a={W(-275,4,860)} b={W(280,4,860)} camera={c} stroke="#B79A8C" width={4} opacity={.4}/>
 {/* Foreground radiator and narrow service piping. */}
 <Box box={{x0:850,x1:1180,y0:0,y1:230,z0:-300,z1:-235}} camera={c} front="#3B4956" top="#92949A" side="#242B3C"/>
 {Array.from({length:8},(_,i)=><Box key={'fin'+i} box={{x0:871+i*38,x1:883+i*38,y0:28,y1:213,z0:-310,z1:-235}} camera={c} front="#596574" top="#9FA9AB" side="#303D4C"/>)}
 <RoomLine a={W(1200,235,-320)} b={W(1200,235,500)} camera={c} stroke="#788391" width={8} opacity={.65}/>
 <RoomLine a={W(1200,220,500)} b={W(1200,625,500)} camera={c} stroke="#788391" width={8} opacity={.65}/>
 {/* Ceiling fixtures stay world-anchored and create a repeated depth rhythm. */}
 {[100,610].map((z,i)=><g key={'ceiling'+i}>
 <Box box={{x0:-175,x1:175,y0:847,y1:869,z0:z,z1:z+90}} camera={c} front="#57515D" top="#A18C87" side="#303644"/>
 <g transform={planeTransform(W(0,842,z+45),c)}><rect x="-145" y="-12" width="290" height="25" rx="6" fill="#E5C2A5" opacity=".75"/><ellipse cy="0" rx="245" ry="95" fill={`url(#${id}bounce)`}/></g>
 </g>)}
 <g transform={planeTransform(W(930,510,1010),c)}><rect x="-125" y="-55" width="250" height="100" rx="5" fill="#224C49" stroke="#92B6A5" strokeWidth="8"/><text textAnchor="middle" y="15" fontSize="45" fontFamily="Arial" fontWeight="bold" fill="#BFE3CF">EXIT</text></g>
 </g>;
