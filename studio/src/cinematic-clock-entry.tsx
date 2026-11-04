import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {LabTimeAnomalyV2,ClockInsertV2Proof,ClockInsertV2Board,CinematicClockStill} from './episodes/probability-control/cinematic-clock-proof';
registerRoot(()=> <>
 <Composition id="LabTimeAnomalyV2" component={LabTimeAnomalyV2} durationInFrames={720} fps={30} width={1920} height={1080}/>
 <Composition id="ClockInsertV2Proof" component={ClockInsertV2Proof} durationInFrames={90} fps={30} width={1920} height={1080}/>
 <Composition id="ClockInsertV2Board" component={ClockInsertV2Board} durationInFrames={1} fps={30} width={1920} height={616}/>
 <Composition id="CinematicClockStill" component={CinematicClockStill} durationInFrames={1} fps={30} width={1920} height={1080}/>
</>);
