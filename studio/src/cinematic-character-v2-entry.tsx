import React from 'react';
import {registerRoot,Composition} from 'remotion';
import {CinematicCharacterV2Sheet,CinematicCharacterV2Board} from './episodes/probability-control/cinematic-character-v2-sheet';
registerRoot(()=> <>
 <Composition id="CinematicCharacterV2Sheet" component={CinematicCharacterV2Sheet} durationInFrames={1} fps={30} width={1920} height={1080}/>
 <Composition id="CinematicCharacterV2Board" component={CinematicCharacterV2Board} durationInFrames={1} fps={30} width={1920} height={1230}/>
</>);
