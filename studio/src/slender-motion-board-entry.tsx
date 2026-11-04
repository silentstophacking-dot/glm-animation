import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {SlenderMotionBoard} from './episodes/probability-control/slender-motion-board';
registerRoot(()=> <Composition id="SlenderMotionBoard" component={SlenderMotionBoard} durationInFrames={1} fps={30} width={1920} height={1230}/>);
