import React from 'react';
import {CinematicCharacterV2} from './cinematic-character-v2';
export const CharacterSilhouetteV4Sheet:React.FC=()=> <svg viewBox="0 0 1920 1230" width="100%" height="100%">
 <defs>
  <linearGradient id="silhouette-bg" x2="0" y2="1"><stop stopColor="#342C38"/><stop offset="1" stopColor="#191E2C"/></linearGradient>
  <filter id="solid-silhouette" x="-20%" y="-10%" width="140%" height="120%"><feColorMatrix type="matrix" values="0 0 0 0 .04  0 0 0 0 .04  0 0 0 0 .06  0 0 0 1 0"/></filter>
 </defs>
 <rect width="1920" height="1230" fill="url(#silhouette-bg)"/>
 <g fontFamily="Arial,sans-serif" fill="#F5E7D4">
  <text x="70" y="80" fontSize="40">CHARACTER — PROPORTION &amp; SILHOUETTE REVISION</text>
  <text x="70" y="127" fontSize="25" fill="#C4B5BC">Equal standing height and head size. Revised shoulders, garment shape, sleeve weight and leg weight.</text>
  {['CURRENT','REVISED / THREE-QUARTER','REVISED / FRONT','REVISED / SILHOUETTE'].map((t,i)=><text key={t} x={270+i*460} y="221" textAnchor="middle" fontSize="25">{t}</text>)}
  <path d="M75 911H1845" stroke="#7C6771" strokeWidth="2"/>
  <path d="M75 260H1845" stroke="#7C6771" strokeWidth="1" strokeDasharray="6 9" opacity=".35"/>
 </g>
 <CinematicCharacterV2 id="silhouette-old" x={270} y={902} scale={1.78} bodyYaw={.65}/>
 <CinematicCharacterV2 id="silhouette-new" x={730} y={902} scale={1.78} bodyYaw={.65} design="silhouette-v4"/>
 <CinematicCharacterV2 id="silhouette-front" x={1190} y={902} scale={1.78} facing="front" bodyYaw={0} design="silhouette-v4"/>
 <g filter="url(#solid-silhouette)"><CinematicCharacterV2 id="silhouette-solid" x={1650} y={902} scale={1.78} bodyYaw={.65} design="silhouette-v4" shadow={false}/></g>
 <g fontFamily="Arial,sans-serif" textAnchor="middle" fill="#D6C6C6" fontSize="24">
  <text x="270" y="980">Narrow shoulder-to-sleeve join</text><text x="270" y="1019">Thin limbs; inward leg curve</text>
  <text x="730" y="980">Shaped chest and shoulder slope</text><text x="730" y="1019">Fuller sleeves; visible wrist gap</text>
  <text x="1190" y="980">Fuller legs; straighter resting stance</text><text x="1190" y="1019">Head and neck remain readable</text>
  <text x="1650" y="980">Check the whole outline</text><text x="1650" y="1019">without shading or facial detail</text>
  <text x="960" y="1148" fontSize="26" fill="#F5E7D4">Design candidate only — existing performance and episode preserved.</text>
 </g>
</svg>;
