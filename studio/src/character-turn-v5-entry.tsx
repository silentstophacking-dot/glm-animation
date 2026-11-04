import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {CharacterTurnV5Proof,CharacterTurnV5Board} from './episodes/probability-control/character-turn-v5-proof';
import {TURN_FRAMES} from './episodes/probability-control/character-turn-v5';
registerRoot(()=> <>
 <Composition id="CharacterTurnV5Proof" component={CharacterTurnV5Proof} durationInFrames={TURN_FRAMES} fps={30} width={1920} height={1080}/>
 <Composition id="CharacterTurnV5Board" component={CharacterTurnV5Board} durationInFrames={1} fps={30} width={1920} height={1080}/>
</>);
