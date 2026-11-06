import React from 'react';
import {CharacterTurnV5} from './episodes/probability-control/character-turn-v5';
import {olderEthanPerformance} from './door-acting-performance';
/** Reusable age extension of the approved puffer rig. The cap, temples and scar
 * share the same moving head pivot; they are not free-floating screen overlays.
 */
export const CinematicOlderEthan:React.FC<{id:string;frame:number;scale?:number;action?:'warning'|'open'}>=({id,frame:f,scale=1.8,action='warning'})=>{
 const pose=olderEthanPerformance(action==='open'?5:3,action==='open'?f+35:f);
 const sf=scale/1.8; // Original overlay positions were authored at approved 1.8 scale.
 return <g>
 <CharacterTurnV5 id={id+'rig'} x={0} y={0} scale={scale} yaw={-.24} headYaw={-.3} outfit="puffer-black" lighting="sunset" mood="concerned" pose={pose}/>
 <g transform={`scale(${sf}) translate(3 -587) rotate(${pose.headTilt??0})`}>
  <path d="M-62 -6Q-71 -45 -40 -66Q-12 -89 24 -76Q52 -66 61 -23L53 -18Q34 -36 18 -43Q-4 -51 -24 -43Q-40 -35 -55 -17Z" fill="#66717E" stroke="#B2B8BE" strokeWidth="3.5"/>
  <path d="M-51 -36Q-24 -66 4 -63M12 -66Q34 -57 45 -39" stroke="#D1D3D0" strokeWidth="3" fill="none" opacity=".64"/>
  <path d="M-62 -8Q-66 14 -49 26M59 -8Q64 15 49 29" stroke="#97A2AE" strokeWidth="7" strokeLinecap="round" fill="none"/>
  <path d="M21 -27L6 20" stroke="#C07B7D" strokeWidth="5.4" strokeLinecap="round"/>
  <path d="M23 -27L8 18" stroke="#E6A8A1" strokeWidth="1.8" strokeLinecap="round"/>
  <path d="M-45 12l10 5m30 12l10 4m28-13l11-5" stroke="#9FA5AF" strokeWidth="2" opacity=".35" fill="none"/>
 </g>
 </g>;
};
