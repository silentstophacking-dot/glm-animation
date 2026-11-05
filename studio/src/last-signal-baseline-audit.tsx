import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {AnomalyScene} from './episodes/probability-control/lab-time-anomaly-proof';
import {discoveryActorAt} from './episodes/probability-control/clock-discovery-motion';
import {LastSignalApartmentCheckpoint} from './last-signal-apartment';
import {CharacterTurnV5} from './episodes/probability-control/character-turn-v5';
// Side-by-side baseline audit. The left is a frame from the approved test,
// rendered from its original source. The right is the proposed Last Signal scene.
// This prevents accepting new scenes merely because they compile.
const Audit:React.FC=()=> <svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <rect width="1920" height="1080" fill="#0C1220"/>
 <svg x="0" y="110" width="960" height="540" viewBox="0 0 1920 1080"><AnomalyScene frame={552} id="approved-audit" refinedClock performance={discoveryActorAt(552)}/></svg>
 <svg x="960" y="110" width="960" height="540" viewBox="0 0 1920 1080"><foreignObject width="1920" height="1080"><div style={{width:1920,height:1080}}><LastSignalApartmentCheckpoint/></div></foreignObject></svg>
 <text x="50" y="75" fontSize="43" fontFamily="Arial" fill="#EDE4D9">APPROVED: CLOCK DISCOVERY</text>
 <text x="1010" y="75" fontSize="43" fontFamily="Arial" fill="#EDE4D9">CANDIDATE: LAST SIGNAL</text>
 <text x="50" y="730" fontSize="34" fontFamily="Arial" fill="#E5B89C">Compare architecture, lighting, physical acting, detail density and perspective.</text>
 <text x="50" y="790" fontSize="28" fontFamily="Arial" fill="#AEB9C4">This comparison is an audit, not an automatic artistic approval.</text>
 </svg>;
const Root=()=> <Composition id="LastSignalBaselineAudit" component={Audit} durationInFrames={1} fps={30} width={1920} height={1080}/>;
registerRoot(Root);
