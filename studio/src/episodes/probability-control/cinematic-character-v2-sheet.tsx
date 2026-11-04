import React from 'react';
import {SlenderCharacter} from './slender-character';
import {CinematicCharacterV2} from './cinematic-character-v2';
import {SlenderMotionScene} from './slender-motion-board';
import {camT} from '../../engine/anim';
export const CinematicCharacterV2Sheet:React.FC=()=> <svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <defs><linearGradient id="v2-sheet-bg" x2="0" y2="1"><stop stopColor="#342C38"/><stop offset="1" stopColor="#191E2C"/></linearGradient><clipPath id="face-study"><rect x="1390" y="300" width="460" height="585" rx="10"/></clipPath></defs>
 <rect width="1920" height="1080" fill="url(#v2-sheet-bg)"/>
 <path d="M0 889H1920" stroke="#7C6771" strokeWidth="2"/>
 <g fontFamily="Arial,sans-serif" fill="#F5E7D4">
  <text x="90" y="101" fontSize="42">CHARACTER V2 — SILHOUETTE, CLOTHING &amp; ACTING</text>
  <text x="90" y="152" fontSize="26" fill="#BDB1B8">Shaped hoodie · clearer shoulders · substantial shoes · directional face · restrained shading</text>
  {[['PREVIOUS',270],['NEW / RELAXED',710],['NEW / GESTURE',1130],['NEW / FACE STUDY',1610]].map(([t,x])=><text key={t} x={x} y="274" textAnchor="middle" fontSize="28">{t}</text>)}
  <text x="270" y="960" textAnchor="middle" fontSize="24">Balanced baseline</text>
  <text x="710" y="960" textAnchor="middle" fontSize="24">Natural arm fall &amp; proper footwear</text>
  <text x="1130" y="960" textAnchor="middle" fontSize="24">Curved sleeve &amp; expressive hand</text>
  <text x="1610" y="960" textAnchor="middle" fontSize="24">Two-eye face &amp; directed expressions</text>
 </g>
 <SlenderCharacter x={270} y={884} scale={1.5} build="balanced"/>
 <CinematicCharacterV2 id="v2-rest" x={710} y={884} scale={1.5} mood="calm"/>
 <CinematicCharacterV2 id="v2-explain" x={1130} y={884} scale={1.5} action="explain" mood="confident"/>
 <g clipPath="url(#face-study)"><CinematicCharacterV2 id="v2-face" x={1610} y={1710} scale={3.55} facing="front" mood="curious"/></g>
</svg>;
export const CinematicCharacterV2Board:React.FC=()=> <svg viewBox="0 0 1920 1230" width="100%" height="100%">
 <rect width="1920" height="1230" fill="#111522"/>
 {[
  {f:12,label:'01  DIRECTIONAL GAZE',cam:camT(960,540,1)},
  {f:72,label:'02  GROUNDED STRIDE',cam:camT(960,540,1)},
  {f:166,label:'03  PALM / PROP CONTACT',cam:camT(810,500,1.8)},
  {f:214,label:'04  EXPRESSIVE REACTION',cam:camT(770,395,2.05)},
 ].map((s,i)=><g key={s.f} transform={`translate(${i%2*960} ${Math.floor(i/2)*615})`}>
  <text x="40" y="45" fontFamily="Arial,sans-serif" fontSize="29" fill="#FFF0DB">{s.label}</text>
  <svg x="12" y="65" width="936" height="526.5" viewBox="0 0 1920 1080"><SlenderMotionScene frame={s.f} id={'v2-board'+i} camera={s.cam} build="balanced" character="cinematic-v2"/></svg>
 </g>)}
</svg>;
