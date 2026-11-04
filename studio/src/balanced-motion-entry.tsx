import React from 'react';
import {registerRoot,Composition} from 'remotion';
import {BalancedMotionProof} from './episodes/probability-control/balanced-motion-proof';
registerRoot(()=> <Composition id="BalancedMotionProof" component={BalancedMotionProof} durationInFrames={270} fps={30} width={1920} height={1080}/>);
