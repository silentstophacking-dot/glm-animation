import React from 'react';
import {AbsoluteFill,Audio,Composition,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import {EvidenceScene,ReversalEvidenceStoryBoard,ReversalEvidenceFrame,REVERSAL_FRAMES} from './episodes/probability-control/reversal-evidence-storyboard';

// New, isolated 510-frame motion proof; never changes the approved ClockDiscoveryPerformance
// or the still-only source composition.
export const ReversalEvidenceMotionProof:React.FC=()=>{
  const frame=useCurrentFrame();
  return <AbsoluteFill style={{backgroundColor:'#101622'}}>
    <EvidenceScene frame={frame} id="reversal-motion-proof"/>
    <Audio src={staticFile('reversal-evidence/soundtrack.wav')}/>
  </AbsoluteFill>;
};

registerRoot(()=> <>
  <Composition id="ReversalEvidenceStoryBoard" component={ReversalEvidenceStoryBoard}
    durationInFrames={1} fps={30} width={1920} height={1848}/>
  <Composition id="ReversalEvidenceFrame" component={ReversalEvidenceFrame}
    durationInFrames={REVERSAL_FRAMES} fps={30} width={1920} height={1080}/>
  <Composition id="ReversalEvidenceMotionProof" component={ReversalEvidenceMotionProof}
    durationInFrames={REVERSAL_FRAMES} fps={30} width={1920} height={1080}/>
</>);
