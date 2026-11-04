# Reversal Evidence — 17-second motion proof

**Status:** motion/sound review candidate, **not an approved long-form episode**.

Built on `feature/reversal-evidence-storyboard` (PR #42), which in turn descends from the owner-approved 24-second ClockDiscoveryPerformance. The original 720-frame composition, character rig, earlier soundtrack and established visual references are unchanged. This branch contains only an isolated render composition, deterministic synthetic foley, and its dedicated review workflow.

## Timeline and sound design
| Seconds | On-screen action | Original synthetic audio |
| --- | --- | --- |
| 0.00–3.33 | Established dimensional lab, actor notices sound | restrained electrical room hum |
| 3.33–5.80 | Broken vial on rear bench | fractured-glass ping / impact |
| 5.80–9.53 | Individual shards travel back toward vial | staggered rising glass cues |
| 9.53–12.53 | Cracks close, water returns and pool shrinks | reverse suction, quiet reseal |
| 12.53–15.27 | Concerned recognition | very light clothing/breath cue |
| 15.27–17.00 | Room and backward clock reveal | faint clock mechanism cues |

At 30 fps, render all 510 frames. No spoken narration or background music. The audio is an original **synthesized first pass**, not a claim of studio-recorded natural foley. Visual approval and cinematic sound refinement remain future gates.

## Review workflow
`.github/workflows/reversal-evidence-motion.yml` renders **only** `ReversalEvidenceMotionProof` from `studio/src/reversal-evidence-entry.tsx` at 1280×720 for an iPhone-sized inspection copy. The underlying source remains 1920×1080. All visual assets are code-authored in Remotion and share the world-space lab projection. This workflow intentionally creates **one full 17-second motion proof** and a 9-frame contact sheet; it does not render or replace the 24-second approved movie or the long Probability Control episode.

Foley generation: `studio/scripts/generate-reversal-audio.py` writes its original stereo WAV and cue JSON inside the Actions runner, so no binary or outside music assets are needed. CI checks type safety, scene geometry, WAV/cue metadata, final 30fps H.264 1280×720/AAC MP4, complete decoding, and frame thumbnails. It uploads one mobile MP4 and a review board.

## Acceptance requirements after render
1. Watch the full frame-to-frame motion, not just key stills; reject teleported pieces, detached shadows and unsupported glass fragments.
2. Confirm every drop returns to the vial before the restored state and no liquid remains suspended.
3. Check the actor's eyeline, planted feet, puffer seams and world-space projection at every cut.
4. Listen to glass, liquid, room and fabric cues in headphones; synthetic foley may need improvement.
5. Only after review, consider an approved 1080p pass and integration into the next long-form sequence.

Do not merge into the approved clock branch or overwrite earlier work merely because this workflow passes.
