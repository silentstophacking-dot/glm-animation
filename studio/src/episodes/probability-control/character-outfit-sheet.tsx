import React from 'react';
import {CharacterTurnV5} from './character-turn-v5';
import {CharacterOutfit} from './character-outfits';
import {SunsetCharacterScene} from './character-lighting-proof';
const looks:{outfit:CharacterOutfit;title:string;desc:string;note:string}[]=[
 {outfit:'hoodie',title:'CURRENT / ARCHIVE',desc:'Orange hoodie · long hem · dark shoes',note:'Existing look preserved for comparison'},
 {outfit:'teal-overshirt',title:'A / TEAL OVERSHIRT',desc:'Open collar · cream tee · off-white shoes',note:'Recommended: casual, readable, distinct'},
 {outfit:'ochre-jacket',title:'B / UTILITY JACKET',desc:'Short jacket · stand collar · patch pockets',note:'A practical, more adventurous direction'},
 {outfit:'navy-waistcoat',title:'C / NAVY WAISTCOAT',desc:'Cream sleeves · V-front · pointed vest hem',note:'A more formal inventor / storyteller look'},
];
export const CharacterOutfitSheet:React.FC=()=> <svg viewBox="0 0 1440 1700" width="100%" height="100%">
 <defs><linearGradient id="outfit-sheet-bg" x2="0" y2="1"><stop stopColor="#38313E"/><stop offset="1" stopColor="#191E2C"/></linearGradient></defs>
 <rect width="1440" height="1700" fill="url(#outfit-sheet-bg)"/>
 <g fontFamily="Arial,sans-serif" fill="#F5E7D4"><text x="48" y="65" fontSize="38">FINDING OUR CHARACTER'S OWN LOOK</text><text x="48" y="108" fontSize="23" fill="#C8BAC2">Same height, pose and sunset light. Compare the clothing shapes as well as the colours.</text></g>
 {looks.map((look,i)=><g key={look.outfit} transform={`translate(${i%2*720} ${150+Math.floor(i/2)*770})`}>
  <rect x="18" y="8" width="684" height="748" rx="16" fill={i===1?'#2B3B42':'#242733'} fillOpacity={i===1?.65:.3} stroke={i===1?'#73A89A':'#695B69'} strokeOpacity={i===1?.85:.3} strokeWidth="2"/>
  <g fontFamily="Arial,sans-serif" fill="#F5E7D4"><text x="42" y="52" fontSize="28">{look.title}</text><text x="42" y="89" fontSize="20" fill="#C8BAC2">{look.desc}</text></g>
  <path d="M60 650H660" stroke="#83717A" strokeWidth="1.6"/>
  <CharacterTurnV5 id={'outfit-full'+i} x={290} y={650} scale={1.45} yaw={.28} lighting="sunset" outfit={look.outfit}/>
  <CharacterTurnV5 id={'outfit-solid'+i} x={555} y={650} scale={.65} yaw={.28} solid outfit={look.outfit} shadow={false}/>
  <g fontFamily="Arial,sans-serif" textAnchor="middle" fill="#C8BAC2"><text x="555" y="691" fontSize="19">Silhouette</text><text x="360" y="730" fontSize="21" fill={i===1?'#C5E1D5':'#D8CAD0'}>{look.note}</text></g>
 </g>)}
</svg>;
export const TealOutfitLabStudy:React.FC=()=> <svg viewBox="0 0 1920 1080" width="100%" height="100%"><SunsetCharacterScene id="teal-outfit-lab" frame={60} outfit="teal-overshirt"/></svg>;
