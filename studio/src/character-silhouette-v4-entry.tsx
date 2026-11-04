import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {CharacterSilhouetteV4Sheet} from './episodes/probability-control/character-silhouette-v4-sheet';
registerRoot(()=> <Composition id="CharacterSilhouetteV4Sheet" component={CharacterSilhouetteV4Sheet} durationInFrames={1} fps={30} width={1920} height={1230}/>);
