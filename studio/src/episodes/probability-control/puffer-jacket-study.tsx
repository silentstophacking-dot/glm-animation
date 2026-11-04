import React from 'react';
import {CharacterTurnV5} from './character-turn-v5';
import {SunsetCharacterScene} from './character-lighting-proof';
const looks=[{outfit:'puffer-black' as const,title:'A / MATTE BLACK',desc:'Graphite highlights · warm lining · light shoes',note:'Quiet, confident and understated'},{outfit:'puffer-cobalt' as const,title:'B / COBALT BLUE',desc:'Stronger colour separation in darker scenes',note:'The clearest lead-character colour'},{outfit:'puffer-teal' as const,title:'C / DEEP TEAL',desc:'Cool colour with a softer, warmer highlight',note:'Distinctive without being loud'}];
export const PufferJacketStudy:React.FC=()=> <svg viewBox="0 0 1440 1700" width="100%" height="100%">
 <defs><linearGradient id="puffer-study-bg" x2="0" y2="1"><stop stopColor="#35333F"/><stop offset="1" stopColor="#182333"/></linearGradient><clipPath id="puffer-detail-clip"><rect x="55" y="140" width="610" height="530" rx="12"/></clipPath></defs>
 <rect width="1440" height="1700" fill="url(#puffer-study-bg)"/>
 <g fontFamily="Arial,sans-serif" fill="#F5E7D4"><text x="48" y="65" fontSize="38">PUFFER JACKET — THREE COLOUR DIRECTIONS</text><text x="48" y="108" fontSize="23" fill="#C8BAC2">Padded collar, rounded quilted sections and a controlled increase in volume. Same pose and light.</text></g>
 {looks.map((look,i)=><g key={look.outfit} transform={`translate(${i%2*720} ${150+Math.floor(i/2)*770})`}>
  <rect x="18" y="8" width="684" height="748" rx="16" fill="#26303E" fillOpacity=".5" stroke="#817785" strokeOpacity=".4" strokeWidth="2"/>
  <g fontFamily="Arial,sans-serif" fill="#F5E7D4"><text x="42" y="52" fontSize="28">{look.title}</text><text x="42" y="89" fontSize="20" fill="#C8BAC2">{look.desc}</text></g>
  <path d="M60 650H660" stroke="#837781" strokeWidth="1.6"/>
  <CharacterTurnV5 id={'puffer-look'+i} x={290} y={650} scale={1.45} yaw={.28} lighting="sunset" outfit={look.outfit}/>
  <CharacterTurnV5 id={'puffer-solid'+i} x={555} y={650} scale={.65} yaw={.28} solid outfit={look.outfit} shadow={false}/>
  <g fontFamily="Arial,sans-serif" textAnchor="middle" fill="#C8BAC2"><text x="555" y="691" fontSize="19">Silhouette</text><text x="360" y="730" fontSize="22">{look.note}</text></g>
 </g>)}
 <g transform="translate(720 920)">
  <rect x="18" y="8" width="684" height="748" rx="16" fill="#26303E" fillOpacity=".5" stroke="#817785" strokeOpacity=".4" strokeWidth="2"/>
  <g fontFamily="Arial,sans-serif" fill="#F5E7D4"><text x="42" y="52" fontSize="28">PADDED COLLAR &amp; QUILTING</text><text x="42" y="89" fontSize="20" fill="#C8BAC2">Black option / close-up construction study</text></g>
  <g clipPath="url(#puffer-detail-clip)"><CharacterTurnV5 id="puffer-detail" x={360} y={1090} scale={2.5} yaw={.28} lighting="sunset" outfit="puffer-black" shadow={false}/></g>
  <text x="360" y="730" textAnchor="middle" fill="#C8BAC2" fontFamily="Arial,sans-serif" fontSize="22">Soft highlight above each recessed seam</text>
 </g>
</svg>;
export const PufferLabStudy:React.FC=()=> <svg viewBox="0 0 1920 1080" width="100%" height="100%"><SunsetCharacterScene id="puffer-lab" frame={60} outfit="puffer-black"/></svg>;
