import React from 'react';
import {SlenderCharacter} from './slender-character';
export const CharacterBuildComparison:React.FC=()=> <svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <defs><linearGradient id="build-bg" x2="0" y2="1"><stop stopColor="#302A36"/><stop offset="1" stopColor="#191C29"/></linearGradient></defs>
 <rect width="1920" height="1080" fill="url(#build-bg)"/>
 <path d="M0 885H1920" stroke="#71616B" strokeWidth="2"/>
 <rect x="510" y="217" width="420" height="786" rx="18" fill="#F2BE85" opacity=".035" stroke="#9F8270" strokeWidth="2"/>
 <g fontFamily="Arial,sans-serif" fill="#F5E7D4">
  <text x="90" y="100" fontSize="42">BODY BUILD — FINDING THE BALANCE</text>
  <text x="90" y="151" fontSize="26" fill="#B8ADB5">Same head, height, neck and leg length. Only body and limb thickness change.</text>
  <text x="260" y="278" fontSize="29" textAnchor="middle">CURRENT / THIN</text>
  <text x="720" y="278" fontSize="29" textAnchor="middle">BALANCED</text>
  <text x="1170" y="278" fontSize="29" textAnchor="middle">FULLER</text>
  <text x="1610" y="278" fontSize="29" textAnchor="middle">BALANCED / REACH</text>
  <text x="260" y="950" fontSize="24" textAnchor="middle">Existing silhouette</text>
  <text x="720" y="950" fontSize="24" textAnchor="middle">Recommended middle ground</text>
  <text x="1170" y="950" fontSize="24" textAnchor="middle">Stronger clothing volume</text>
  <text x="1610" y="950" fontSize="24" textAnchor="middle">Arm and shoulder check</text>
 </g>
 <SlenderCharacter x={260} y={882} scale={1.52}/>
 <SlenderCharacter x={720} y={882} scale={1.52} build="balanced"/>
 <SlenderCharacter x={1170} y={882} scale={1.52} build="fuller"/>
 <SlenderCharacter x={1610} y={882} scale={1.52} build="balanced" gesture="point"/>
</svg>;
