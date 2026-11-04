import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {UntouchedPressProof,UntouchedPressBoard,UNTOUCHED_FRAMES} from './episodes/probability-control/untouched-press-proof';
registerRoot(()=> <>
 <Composition id="UntouchedPressProof" component={UntouchedPressProof} durationInFrames={UNTOUCHED_FRAMES} fps={30} width={1920} height={1080}/>
 <Composition id="UntouchedPressBoard" component={UntouchedPressBoard} durationInFrames={1} fps={30} width={1920} height={1848}/>
</>);
