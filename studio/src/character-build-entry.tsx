import React from 'react';
import {registerRoot,Composition} from 'remotion';
import {CharacterBuildComparison} from './episodes/probability-control/character-build-comparison';
registerRoot(()=> <Composition id="CharacterBuildComparison" component={CharacterBuildComparison} durationInFrames={1} fps={30} width={1920} height={1080}/>);
