import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {LabTimeAnomaly,LabTimeAnomalyBoard} from './episodes/probability-control/lab-time-anomaly-proof';
registerRoot(()=> <>
 <Composition id="LabTimeAnomaly" component={LabTimeAnomaly} durationInFrames={720} fps={30} width={1920} height={1080}/>
 <Composition id="LabTimeAnomalyBoard" component={LabTimeAnomalyBoard} durationInFrames={1} fps={30} width={1920} height={1848}/>
</>);
