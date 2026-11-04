import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import { EPISODES } from './episodes';
import {IfverseContactPreview} from './episodes/probability-control/ifverse-contact-preview';
import {SlenderDesignSheet} from './episodes/probability-control/slender-character-sheet';
import {SlenderMotionBoard} from './episodes/probability-control/slender-motion-board';
import {CharacterBuildComparison} from './episodes/probability-control/character-build-comparison';
import {BalancedMotionProof} from './episodes/probability-control/balanced-motion-proof';
import {CinematicCharacterV2Sheet,CinematicCharacterV2Board} from './episodes/probability-control/cinematic-character-v2-sheet';
import { CastSheet } from './CastSheet';
import {CharacterRigV2Gallery,CharacterRigV2Motion} from './episodes/probability-control/character-v2-gallery';
import {CharacterActingV3,ACTING_V3_FRAMES,ACTING_V3_FPS} from './episodes/probability-control/character-acting-v3';
import {CharacterActingV4,ACTING_V4_FRAMES,ACTING_V4_FPS} from './episodes/probability-control/character-acting-v4';
import {CharacterActingV5,V5_TEST_FRAMES,V5_TEST_FPS} from './episodes/probability-control/character-acting-v5';
import {ReferenceCharacterSheet, ReferenceCharacterMotion} from './episodes/probability-control/ifverse-character-match';

// Every episode gets two compositions: <Id> (the film) and <Id>Board (one frame per shot, at its key frame, for the
// storyboard). Cast renders the cast sheet.
//   npx remotion studio src/index.ts --port 3430

export const Root: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      {EPISODES.map((e) => (
        <React.Fragment key={e.id}>
          <Composition id={e.id} component={e.Main} durationInFrames={Math.max(1, e.total)} fps={e.fps} width={e.width} height={e.height} />
          <Composition id={`${e.id}Board`} component={e.Board} durationInFrames={Math.max(1, e.shotCount)} fps={e.fps} width={e.width} height={e.height} />
        </React.Fragment>
      ))}
      <Composition id="CinematicCharacterV2Sheet" component={CinematicCharacterV2Sheet} durationInFrames={1} fps={30} width={1920} height={1080}/>
      <Composition id="CinematicCharacterV2Board" component={CinematicCharacterV2Board} durationInFrames={1} fps={30} width={1920} height={1230}/>
      <Composition id="BalancedMotionProof" component={BalancedMotionProof} durationInFrames={270} fps={30} width={1920} height={1080}/>
      <Composition id="CharacterBuildComparison" component={CharacterBuildComparison} durationInFrames={1} fps={30} width={1920} height={1080}/>
      <Composition id="SlenderMotionBoard" component={SlenderMotionBoard} durationInFrames={1} fps={30} width={1920} height={1230}/>
      <Composition id="SlenderDesignSheet" component={SlenderDesignSheet} durationInFrames={1} fps={30} width={1920} height={1080}/>
      <Composition id="IfverseContactPreview" component={IfverseContactPreview} durationInFrames={240} fps={30} width={1920} height={1080}/>
      <Composition id="IfverseCharacterSheet" component={ReferenceCharacterSheet}
        durationInFrames={1} fps={30} width={1920} height={1080}/>
      <Composition id="IfverseCharacterMotion" component={ReferenceCharacterMotion}
        durationInFrames={180} fps={30} width={1920} height={1080}/>
      <Composition id="CharacterActingV5" component={CharacterActingV5}
        durationInFrames={V5_TEST_FRAMES} fps={V5_TEST_FPS}
        width={1920} height={1080}/>
      <Composition id="CharacterActingV4" component={CharacterActingV4}
        durationInFrames={ACTING_V4_FRAMES} fps={ACTING_V4_FPS}
        width={1920} height={1080}/>
      <Composition id="CharacterActingV3" component={CharacterActingV3}
        durationInFrames={ACTING_V3_FRAMES} fps={ACTING_V3_FPS}
        width={1920} height={1080}/>
      <Composition id="Cast" component={CastSheet} durationInFrames={1} {...common} />
      <Composition id="CharacterRigV2Gallery" component={CharacterRigV2Gallery}
        durationInFrames={5} fps={30} width={1920} height={1080}/>
      <Composition id="CharacterRigV2Motion" component={CharacterRigV2Motion}
        durationInFrames={150} fps={30} width={1920} height={1080}/>
    </>
  );
};
