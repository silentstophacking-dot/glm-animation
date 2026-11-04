Latest: branch `feature/clock-discovery-acting`, PR #41, composition `ClockDiscoveryPerformance` (720 frames / 24s) and `ClockDiscoveryBoard`; dedicated entry `studio/src/clock-discovery-entry.tsx`. Motion audit: clock-discovery-motion.ts / auditClockDiscovery. New audio manifest: studio/public/lab-discovery-v3/soundtrack.json; pass that as the second argument to scripts/verify-anomaly-audio.py.

Latest continuation: branch `feature/lab-time-anomaly`, draft PR #39. The owner liked the 11-second puffer proof; the new 24-second LabTimeAnomaly mini-scene adds six shots, the backward-clock story and synchronized original synthesized sound. Read CONTINUE_HERE.md and production/style/LAB_TIME_ANOMALY.md; this new scene still awaits owner review. Earlier notes below preserve prior stages.

Latest integration branch: `feature/puffer-lab-performance`. Render composition `PufferRoomPerformance` (330 frames / 11 seconds) or its `PufferRoomPerformanceBoard`. Dedicated entry: `studio/src/puffer-room-performance-entry.tsx`. Draft PR #38 is based on `feature/project-handoff`. See production/style/PUFFER_ROOM_PERFORMANCE.md for scope and checks.

# Technical continuation runbook

## Environment

Use Node 22 for consistency with GitHub Actions. Install from `studio/package-lock.json` with `npm ci` in `studio/`. The project pins Remotion 4.0.530, React 19 and TypeScript 5.8.2. Chromium and ffmpeg/ffprobe are needed for local rendering/verification. Workspace paths, installed node_modules, browser paths and cached reference downloads from the old session are not portable.

Commands below are for the coding agent, not for the iPhone owner to run. Follow the new environment's networking/credential policy; do not copy old tokens or assume the old browser path exists.

## Important code

Under `studio/src/episodes/probability-control/`:

- `character-turn-v5.tsx`: current view-aware rig, optional pose/mood, wardrobe and sunset lighting. Static turn remains default.
- `character-outfits.tsx`, `puffer-garment.tsx`: garment/palette options. Puffer is an opt-in design and its resting sleeve stitching is not yet a posed seam system.
- `combined-performance-motion.ts`: world-space step/hand adapter and 330-frame contact audit.
- `performance-v3-motion.ts`: established timing and four-shot camera choices.
- `pseudo-depth-camera.ts`: shared pinhole projection and plane transforms.
- `lab-room-geometry.tsx`: room camera, cuboid projection/face visibility, support anchors and room audit.
- `lab-room-depth.tsx`: latest depth-surfaced lab proof with stationary black-puffer character.
- `cinematic-lab.tsx`: preserved original background plus reusable window/glassware art. Default sun position remains original; the new room uses a shot-specific position.
- `pseudo-depth-proof.tsx`: earlier layered scene and the existing combined-performance option. This is different from the new cuboid room.

Episode registry: `studio/src/episodes/index.ts`. Composition registry: `studio/src/Root.tsx`. The separate preview entry files keep short tests quick to bundle.

## Local checks and review renders

From `studio/`:

```bash
npm ci
npm run typecheck
npx remotion still src/lab-room-depth-entry.tsx LabRoomDepthBoard out/room-board.png --frame=0
npx remotion render src/lab-room-depth-entry.tsx LabRoomDepthProof out/room-preview.mp4 --codec=h264 --pixel-format=yuv420p --image-format=png --color-space=bt709 --scale=0.6666666666666666 --concurrency=2 --crf=20
```

Choose the actual Chromium executable for the new environment if Remotion cannot locate one. The exact scale above produces 1280×720; shorter decimals previously caused invalid non-integer dimensions. The bare CLI command is not a substitute for faststart/metadata/full-decode verification. Use the production script or remux with ffmpeg and validate the resulting file.

Relevant audits, bundled with the pinned esbuild binary available in dependencies:

```bash
npx --no-install esbuild src/episodes/probability-control/lab-room-geometry.tsx --bundle --platform=node --outfile=out/room-audit.cjs
node -e "console.log(require('./out/room-audit.cjs').auditLabRoom())"
npx --no-install esbuild src/episodes/probability-control/combined-performance-motion.ts --bundle --platform=node --outfile=out/combined-audit.cjs
node -e "console.log(require('./out/combined-audit.cjs').auditCombinedPerformance())"
```

Render a pose/key-view sheet first and inspect it. For motion changes, inspect actual extracted movie frames spanning foot support, occlusion, press/release and reaction, not only first/middle/last or TypeScript output. Use narrow checks appropriate to the change; don't run all old films.

## GitHub rendering

`.github/workflows/production-render.yml` supports workflow_dispatch with an exact composition ID and automatic rendering on listed production/proof branches. Select the correct branch/ref in GitHub's Actions UI. Its branch version knows the new composition; do not accidentally dispatch an old default-branch workflow.

The renderer `scripts/render-production.mjs` selects an entry point, records composition metadata and review frames, renders full-length H.264/yuv420p/BT.709 with PNG source frames and faststart, and logs progress. `scripts/verify-render.py` checks dimensions/fps/duration/decoded count and full decode before the successful-movie artifact upload. Long-form timeout and exact composition selection remain available. Diagnostics upload even on failure.

Design-only wardrobe branches use separate still workflows. A new development branch needs to be designated intentionally for automatic movie rendering, or use manual dispatch. Do not trigger a long-form render merely because a new draft PR exists. Actions artifacts currently retain 14 days; the small review files in handoff are tracked Git files instead.

Latest verified production compositions:

| Composition | Frames / duration | Successful run |
|---|---|---|
| LabRoomDepthProof | 210 / 7s | https://github.com/silentstophacking-dot/glm-animation/actions/runs/41824949708 |
| CombinedCharacterPerformance | 330 / 11s | https://github.com/silentstophacking-dot/glm-animation/actions/runs/41816462090 |
| CharacterSunsetLightingProof | 180 / 6s | https://github.com/silentstophacking-dot/glm-animation/actions/runs/41808807325 |
| CharacterTurnV5Proof | 180 / 6s | https://github.com/silentstophacking-dot/glm-animation/actions/runs/41807743709 |
| PerformanceV3Proof | 330 / 11s | https://github.com/silentstophacking-dot/glm-animation/actions/runs/41796129632 |

## Git and history

Create a feature branch from `feature/project-handoff` (or its updated successor). Draft PRs are stacked; the handover's base is `feature/lab-room-depth`. See PR_SNAPSHOT.json and BRANCH_SNAPSHOT.json for the historical heads/bases. There are earlier sibling branches, including sound work; preserve them rather than deleting them as redundant.

No credentials are included in this handover. Rendering the existing short proofs uses the normal GitHub/Remotion setup. Voice-generation services or other connectors may require reauthorization/configuration separately. Do not regenerate narration or spend service credits just to resume the repository.
