import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {PufferJacketStudy,PufferLabStudy} from './episodes/probability-control/puffer-jacket-study';
registerRoot(()=> <>
 <Composition id="PufferJacketStudy" component={PufferJacketStudy} durationInFrames={1} fps={30} width={1440} height={1700}/>
 <Composition id="PufferLabStudy" component={PufferLabStudy} durationInFrames={1} fps={30} width={1920} height={1080}/>
</>);
