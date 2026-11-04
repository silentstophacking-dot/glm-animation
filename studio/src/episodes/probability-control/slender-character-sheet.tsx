import React from 'react';
import {RefCharacter} from './ifverse-contact-rig';
import {SlenderCharacter} from './slender-character';

export const SlenderDesignSheet:React.FC=()=> <svg viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs><linearGradient id="sheet-wall" x2="0" y2="1">
    <stop stopColor="#302A36"/><stop offset="1" stopColor="#191C29"/>
  </linearGradient></defs>
  <rect width="1920" height="1080" fill="url(#sheet-wall)"/>
  <path d="M0 887H1920" stroke="#71616B" strokeWidth="2"/>
  <g fontFamily="Arial,sans-serif" fill="#F5E7D4">
    <text x="100" y="105" fontSize="42">CHARACTER PROPORTIONS — REVISED DESIGN</text>
    <text x="100" y="153" fontSize="26" fill="#B8ADB5">Equal standing height · smaller head · longer legs · narrow clothing · visible neck</text>
    <text x="300" y="277" fontSize="28" textAnchor="middle">PREVIOUS</text>
    <text x="780" y="277" fontSize="28" textAnchor="middle">SLIM PROFILE</text>
    <text x="1190" y="277" fontSize="28" textAnchor="middle">SLIM FRONT</text>
    <text x="1600" y="277" fontSize="28" textAnchor="middle">SLIM CAP</text>
    <text x="300" y="960" fontSize="25" textAnchor="middle">Head: ~29% of height</text>
    <text x="780" y="960" fontSize="25" textAnchor="middle">Head: 19% · legs: 39%</text>
    <text x="1190" y="960" fontSize="25" textAnchor="middle">Same skeleton</text>
    <text x="1600" y="960" fontSize="25" textAnchor="middle">Same proportions</text>
  </g>
  <RefCharacter x={300} y={884} scale={2.15} emotion="neutral"/>
  <SlenderCharacter x={780} y={884} scale={1.52}/>
  <SlenderCharacter x={1190} y={884} scale={1.52} facing="front"/>
  <SlenderCharacter x={1600} y={884} scale={1.52} role="cap" facing="left"/>
</svg>;
