import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {ReversalEvidenceStoryBoard,ReversalEvidenceFrame,REVERSAL_FRAMES} from './episodes/probability-control/reversal-evidence-storyboard';

registerRoot(()=> <>
  <Composition id="ReversalEvidenceStoryBoard" component={ReversalEvidenceStoryBoard}
    durationInFrames={1} fps={30} width={1920} height={1848}/>
  <Composition id="ReversalEvidenceFrame" component={ReversalEvidenceFrame}
    durationInFrames={REVERSAL_FRAMES} fps={30} width={1920} height={1080}/>
</>);
