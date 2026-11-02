import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import { EPISODES } from './episodes';
import { CastSheet } from './CastSheet';
import { ProbabilityControl, ProbabilityControlBoard, TOTAL_FRAMES, SHOTS } from './episodes/probability-control';

// Every episode gets two compositions: <Id> (the film) and <Id>Board (one frame per shot, at its key frame, for the
// storyboard). Cast renders the cast sheet.
//   npx remotion studio src/index.ts --port 3430

export const Root: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      {EPISODES.map((e) => (
        <React.Fragment key={e.id}>
          <Composition id={e.id} component={e.Main} durationInFrames={Math.max(1, e.total)} {...common} />
          <Composition id={`${e.id}Board`} component={e.Board} durationInFrames={Math.max(1, e.shotCount)} {...common} />
        </React.Fragment>
      ))}
      {/* Independent portrait episode: leave all existing landscape compositions unchanged. */}
      <Composition id="ProbabilityControl" component={ProbabilityControl}
        durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="ProbabilityControlBoard" component={ProbabilityControlBoard}
        durationInFrames={SHOTS.length} fps={30} width={1080} height={1920} />
      <Composition id="Cast" component={CastSheet} durationInFrames={1} {...common} />
    </>
  );
};
