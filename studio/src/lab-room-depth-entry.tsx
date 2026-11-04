import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {LabRoomDepthProof,LabRoomDepthBoard} from './episodes/probability-control/lab-room-depth';
registerRoot(()=> <>
 <Composition id="LabRoomDepthProof" component={LabRoomDepthProof} durationInFrames={210} fps={30} width={1920} height={1080}/>
 <Composition id="LabRoomDepthBoard" component={LabRoomDepthBoard} durationInFrames={1} fps={30} width={1920} height={1230}/>
</>);
