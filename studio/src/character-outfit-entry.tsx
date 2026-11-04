import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {CharacterOutfitSheet,TealOutfitLabStudy} from './episodes/probability-control/character-outfit-sheet';
registerRoot(()=> <>
 <Composition id="CharacterOutfitSheet" component={CharacterOutfitSheet} durationInFrames={1} fps={30} width={1440} height={1700}/>
 <Composition id="TealOutfitLabStudy" component={TealOutfitLabStudy} durationInFrames={1} fps={30} width={1920} height={1080}/>
</>);
