import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {PerformanceV3Proof,PerformanceV3Board} from './episodes/probability-control/performance-v3-proof';
registerRoot(()=> <>
 <Composition id="PerformanceV3Proof" component={PerformanceV3Proof} durationInFrames={330} fps={30} width={1920} height={1080}/>
 <Composition id="PerformanceV3Board" component={PerformanceV3Board} durationInFrames={1} fps={30} width={1920} height={1230}/>
</>);
