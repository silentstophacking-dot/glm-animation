import React from 'react';
import {CharacterTurnV5} from './character-turn-v5';
import {SunsetCharacterScene} from './character-lighting-proof';
export const LeadCharacterStudy:React.FC=()=> <svg viewBox="0 0 1440 1500" width="100%" height="100%">
 <defs><linearGradient id="lead-sheet-bg" x2="0" y2="1"><stop stopColor="#363342"/><stop offset="1" stopColor="#182333"/></linearGradient></defs>
 <rect width="1440" height="1500" fill="url(#lead-sheet-bg)"/>
 <g fontFamily="Arial,sans-serif" fill="#F5E7D4"><text x="48" y="68" fontSize="38">A STRONGER LEAD-CHARACTER LOOK</text><text x="48" y="111" fontSize="23" fill="#C8BAC2">Same height, expression and light. A bolder colour block and a recognisable jacket shape.</text></g>
 {[{outfit:'teal-overshirt' as const,x:325,label:'PREVIOUS / TEAL',note:'Relaxed, understated everyday clothing'},{outfit:'cobalt-lead' as const,x:1045,label:'NEW / COBALT & GOLD',note:'Cropped jacket · high collar · diagonal front'}].map((look,i)=><g key={look.outfit}>
  <rect x={18+i*720} y="158" width="684" height="1308" rx="18" fill={i?'#27364A':'#282E3A'} fillOpacity=".5" stroke={i?'#9BACC2':'#675D6B'} strokeWidth="2" strokeOpacity=".6"/>
  <text x={360+i*720} y="215" textAnchor="middle" fill="#F5E7D4" fontFamily="Arial,sans-serif" fontSize="28">{look.label}</text>
  <path d={`M${60+i*720} 1050H${660+i*720}`} stroke="#837681" strokeWidth="1.6"/>
  <CharacterTurnV5 id={'lead-look'+i} x={look.x} y={1050} scale={2.1} yaw={.28} lighting="sunset" outfit={look.outfit}/>
  <text x={360+i*720} y="1110" textAnchor="middle" fill="#D8CFD1" fontFamily="Arial,sans-serif" fontSize="22">{look.note}</text>
  <CharacterTurnV5 id={'lead-solid'+i} x={555+i*720} y={1390} scale={.65} yaw={.28} solid outfit={look.outfit} shadow={false}/>
  <g fontFamily="Arial,sans-serif" fill="#C9C3CC" fontSize="23">
   {(i?['Cobalt outer layer','Warm gold mock-neck','One bold cream chest band','Gold cuff detail + light shoes']:['Open overshirt','Soft muted palette','Long, simple front opening','Cream inner layer']).map((t,j)=><text key={t} x={48+i*720} y={1210+j*45}>{t}</text>)}
  </g>
  <text x={555+i*720} y="1430" textAnchor="middle" fill="#BDB8C2" fontFamily="Arial,sans-serif" fontSize="19">Silhouette</text>
 </g>)}
</svg>;
export const LeadCharacterLabStudy:React.FC=()=> <svg viewBox="0 0 1920 1080" width="100%" height="100%"><SunsetCharacterScene id="lead-character-lab" frame={60} outfit="cobalt-lead"/></svg>;
