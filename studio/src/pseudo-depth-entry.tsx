import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {DepthCameraProof,DepthCharacterStudy,DepthContactBoard} from './episodes/probability-control/pseudo-depth-proof';
registerRoot(()=> <>
 <Composition id="DepthCameraProof" component={DepthCameraProof} durationInFrames={180} fps={30} width={1920} height={1080}/>
 <Composition id="DepthCharacterStudy" component={DepthCharacterStudy} durationInFrames={1} fps={30} width={1920} height={1080}/>
 <Composition id="DepthContactBoard" component={DepthContactBoard} durationInFrames={1} fps={30} width={1920} height={1230}/>
</>);
