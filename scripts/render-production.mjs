import {createRequire} from 'node:module';
import {resolve} from 'node:path';
const require = createRequire(resolve('package.json'));
const {bundle} = require('@remotion/bundler');
const {selectComposition, renderMedia, renderStill} = require('@remotion/renderer');
import {writeFileSync} from 'node:fs';

// Run from studio so Remotion can resolve the locked project dependencies.
const id = process.env.COMPOSITION || 'IfverseCharacterMotion';
if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new Error('Invalid composition ID');
const dir = 'out/production';
const revision = (process.env.GITHUB_SHA || 'local').slice(0, 12);
const name = id + '-' + revision + '-' + (process.env.GITHUB_RUN_ID || 'local');
const previewEntries = {
  PufferJacketStudy: 'src/puffer-jacket-entry.tsx',
  PufferLabStudy: 'src/puffer-jacket-entry.tsx',
  LeadCharacterStudy: 'src/lead-character-entry.tsx',
  LeadCharacterLabStudy: 'src/lead-character-entry.tsx',
  CharacterOutfitSheet: 'src/character-outfit-entry.tsx',
  TealOutfitLabStudy: 'src/character-outfit-entry.tsx',
  CombinedCharacterPerformance: 'src/combined-performance-entry.tsx',
  CombinedCharacterBoard: 'src/combined-performance-entry.tsx',
  CharacterSunsetLightingProof: 'src/character-lighting-entry.tsx',
  CharacterSunsetLightingBoard: 'src/character-lighting-entry.tsx',
  CharacterTurnV5Proof: 'src/character-turn-v5-entry.tsx',
  CharacterTurnV5Board: 'src/character-turn-v5-entry.tsx',
  CharacterSilhouetteV4Sheet: 'src/character-silhouette-v4-entry.tsx',
  PerformanceV3Proof: 'src/performance-v3-entry.tsx',
  PerformanceV3Board: 'src/performance-v3-entry.tsx',
  IfverseContactPreview: 'src/ifverse-preview.tsx',
  SlenderDesignSheet: 'src/slender-design-sheet.tsx',
  SlenderMotionBoard: 'src/slender-motion-board-entry.tsx',
  CharacterBuildComparison: 'src/character-build-entry.tsx',
  BalancedMotionProof: 'src/balanced-motion-entry.tsx',
  CinematicCharacterV2Sheet: 'src/cinematic-character-v2-entry.tsx',
  CinematicCharacterV2Board: 'src/cinematic-character-v2-entry.tsx',
  DepthCameraProof: 'src/pseudo-depth-entry.tsx',
  DepthCharacterStudy: 'src/pseudo-depth-entry.tsx',
  DepthContactBoard: 'src/pseudo-depth-entry.tsx',
};
const serveUrl = await bundle({entryPoint: previewEntries[id] || 'src/index.ts'});
const composition = await selectComposition({serveUrl, id});
writeFileSync(dir + '/composition.json', JSON.stringify(composition, null, 2));
const options = {serveUrl, composition};
for (const frame of [...new Set([0, Math.floor((composition.durationInFrames-1)/2), composition.durationInFrames-1])]) {
  await renderStill({...options, frame, output: dir + '/frame-' + frame + '.png'});
}
await renderMedia({...options, codec: 'h264', pixelFormat: 'yuv420p', imageFormat: 'png', colorSpace: 'bt709',
  outputLocation: dir + '/' + name + '.mp4', crf: 20, concurrency: 2,
  onProgress: ({progress}) => {
    const percent = Math.floor(progress * 100);
    if (percent > (globalThis.lastPercent ?? -1)) {
      globalThis.lastPercent = percent;
      console.log('Render ' + percent + '%');
    }
  },
  ffmpegOverride: ({args}) => [...args.slice(0,-1), '-movflags', '+faststart', args.at(-1)],
});
