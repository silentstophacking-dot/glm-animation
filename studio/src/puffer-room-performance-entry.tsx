import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {PufferRoomPerformance,PufferRoomPerformanceBoard} from './episodes/probability-control/puffer-room-performance-proof';
registerRoot(()=> <>
 <Composition id="PufferRoomPerformance" component={PufferRoomPerformance} durationInFrames={330} fps={30} width={1920} height={1080}/>
 <Composition id="PufferRoomPerformanceBoard" component={PufferRoomPerformanceBoard} durationInFrames={1} fps={30} width={1920} height={1230}/>
</>);
