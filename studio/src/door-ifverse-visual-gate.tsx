import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {AnomalyScene} from './episodes/probability-control/lab-time-anomaly-proof';
import {discoveryActorAt} from './episodes/probability-control/clock-discovery-motion';
import {EvidenceScene} from './episodes/probability-control/reversal-evidence-storyboard';
import {CinematicHallway} from './door-cinematic-hallway';

/**
 * Mandatory visual comparison: render real approved source scenes next to
 * current candidate scenes at similar display sizes. No screenshots,
 * third-party clips, or detached placeholder artwork are substituted.
 * Rendering this board does NOT mean artistic approval.
 */
const Panel:React.FC<{title:string;subtitle:string;x:number;y:number;children:React.ReactNode}>=({title,subtitle,x,y,children})=><g transform={`translate(${x} ${y})`}>
 <rect width="922" height="490" fill="#101828" stroke="#758495" strokeWidth="2" rx="7"/>
 <svg x="8" y="8" width="906" height="454" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">{children}</svg>
 <rect x="8" y="462" width="906" height="24" fill="#111827"/>
 <text x="16" y="479" fontSize="19" fontFamily="Arial,sans-serif" fill="#F4E7D7">{title} — {subtitle}</text>
</g>;
const Board:React.FC=()=> <svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <rect width="1920" height="1080" fill="#101622"/>
 <text x="30" y="48" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="34" fill="#F7EBDC">APPROVED VS. CANDIDATE — ART DIRECTION GATE</text>
 <text x="30" y="83" fontFamily="Arial,sans-serif" fontSize="20" fill="#A9B8C9">Match graphic character expressiveness, depth, purposeful action, lighting and readable shot design. A render passing is not approval.</text>
 <Panel title="APPROVED • CLOCK DISCOVERY" subtitle="physical acting and laboratory depth" x={30} y={110}>
  <AnomalyScene id="quality-approved-clock" frame={552} refinedClock performance={discoveryActorAt(552)}/>
 </Panel>
 <Panel title="APPROVED • GLASS REVERSAL" subtitle="coherent character and prop performance" x={968} y={110}>
  <EvidenceScene id="quality-approved-evidence" frame={419}/>
 </Panel>
 <Panel title="CANDIDATE • DOOR HOOK" subtitle="key reach + practical light + threshold" x={30} y={615}>
  <CinematicHallway id="quality-door-hook" shot={0} frame={95}/>
 </Panel>
 <Panel title="CANDIDATE • OLDER DOUBLE" subtitle="recognizable face, convincing physical reveal" x={968} y={615}>
  <CinematicHallway id="quality-door-older" shot={3} frame={100}/>
 </Panel>
 </svg>;
const Root=()=> <Composition id="DoorIfverseVisualGate" component={Board} durationInFrames={1} fps={30} width={1920} height={1080}/>;
registerRoot(Root);
