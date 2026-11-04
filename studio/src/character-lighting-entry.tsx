import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {CharacterSunsetLightingProof,CharacterSunsetLightingBoard} from './episodes/probability-control/character-lighting-proof';
registerRoot(()=> <>
 <Composition id="CharacterSunsetLightingProof" component={CharacterSunsetLightingProof} durationInFrames={180} fps={30} width={1920} height={1080}/>
 <Composition id="CharacterSunsetLightingBoard" component={CharacterSunsetLightingBoard} durationInFrames={1} fps={30} width={1920} height={1230}/>
</>);
