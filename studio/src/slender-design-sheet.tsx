import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {SlenderDesignSheet} from './episodes/probability-control/slender-character-sheet';
registerRoot(()=> <Composition id="SlenderDesignSheet" component={SlenderDesignSheet}
  durationInFrames={1} fps={30} width={1920} height={1080}/>);
