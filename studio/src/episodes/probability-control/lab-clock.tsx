import React from 'react';
import {planeTransform,WorldCamera} from './pseudo-depth-camera';
/** The same wall-mounted clock is used in the wide room and the insert. */
export const LabClock:React.FC<{camera:WorldCamera;seconds?:number}>=({camera,seconds})=><g transform={planeTransform({x:-1320,y:800,z:775},camera)}>
 <circle r="42" fill="#2E2E3D" stroke="#7B6A70" strokeWidth="4"/>
 {seconds===undefined?<path d="M0 -26V0L20 12" fill="none" stroke="#C0A99B" strokeWidth="3"/>:<>
 <circle r="36" fill="#222838" stroke="#998071" strokeWidth=".7"/>
 {Array.from({length:60},(_,i)=><path key={i} transform={`rotate(${i*6})`} d={i%5?'M0 -32V-34':'M0 -29V-35'} stroke="#C0A99B" strokeWidth={i%5?.6:1.6} opacity={i%5?.5:.9}/>)}
 {[['12',0,-21],['3',24,3],['6',0,28],['9',-24,3]].map(([n,x,y])=><text key={n} x={x} y={y} textAnchor="middle" fill="#D8C4AB" fontFamily="Arial,sans-serif" fontSize="7">{n}</text>)}
 <path d="M0 5V-19" transform={`rotate(${seconds*.5-20})`} stroke="#CAB49A" strokeWidth="3" strokeLinecap="round"/>
 <path d="M0 6V-28" transform={`rotate(${seconds*6})`} stroke="#E2CDB1" strokeWidth="1.8" strokeLinecap="round"/>
 <path d="M0 8V-31" transform={`rotate(${seconds*36+80})`} stroke="#D99872" strokeWidth=".8"/>
 <circle r="2.5" fill="#E3C5A1"/>
 </>}
</g>;
