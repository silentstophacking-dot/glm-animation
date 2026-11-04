import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {ClockDiscoveryPerformance,ClockDiscoveryBoard} from './episodes/probability-control/clock-discovery-proof';
registerRoot(()=> <>
 <Composition id="ClockDiscoveryPerformance" component={ClockDiscoveryPerformance} durationInFrames={720} fps={30} width={1920} height={1080}/>
 <Composition id="ClockDiscoveryBoard" component={ClockDiscoveryBoard} durationInFrames={1} fps={30} width={1920} height={1848}/>
</>);
