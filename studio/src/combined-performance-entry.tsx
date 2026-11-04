import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {CombinedCharacterPerformance,CombinedCharacterBoard} from './episodes/probability-control/combined-performance-proof';
registerRoot(()=> <>
 <Composition id="CombinedCharacterPerformance" component={CombinedCharacterPerformance} durationInFrames={330} fps={30} width={1920} height={1080}/>
 <Composition id="CombinedCharacterBoard" component={CombinedCharacterBoard} durationInFrames={1} fps={30} width={1920} height={1230}/>
</>);
