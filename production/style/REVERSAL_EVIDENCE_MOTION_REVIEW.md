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

## Owner feedback — visible effects pass
The initial 17s proof technically rendered but the owner said **“It lacks effects.”** This revision responds with actual time-reversal effects inside the existing projected 2.5D world, not a generic fullscreen filter: localized warm/cool bloom, brief time pulses on the physical counter, physically following fragment trails, small incoming suspended dust, momentary glass-seam glints, a visible returning-liquid filament, and one restrained optical push while the bench remains anchored. The audio mix also raises shatter/reassembly/return cues and adds a nonmusical pressure layer, all synthesized originally.

The 24s approved baseline is not changed. The first 17s video remains an archived comparison; this revision requires fresh CI, full render decode, contact-sheet and owner review before selection. These effects are visible evidence of the physical event, not a change toward neon UI or cartoon embellishment.

## Physical glass and acting improvement — user instruction “Do it”

This follow-on branch deliberately **does not add more glow**. Six irregular bottle-wall pieces begin foreshortened against the bench and converge on six matching locations. Their lifts are staggered and delayed independently; each piece remains until the corresponding shell section has physically rebuilt. The prior large identical rotation/fade and duplicated bright polygon echoes are replaced by single physical pieces and thin directional outlines. Glass close-ups retain restrained warm/cool specular surfaces and established world projection. A new short face close-up during the opening 3.3 seconds adds an eye-led bench glance. The protagonist visibly recoils after the seal (lean/head/hand) with no foot slide and no original 720-frame source edits. The audio adds an early cloth cue, six staggered return cues, and an unnerving half-second sound dip as the glass seals. No copyrighted music.

Before approving a master, compare actual moving frames for shard landings, bench occlusion, glass thickness, reaction strength, lighting and the brief silence. Geometry and codecs are necessary checks but do not alone establish believable cinematography.

## Seam-fusion + staggered acting pass (5 Nov 2026)

The physical-acting review revealed two remaining weaknesses: detached polygon fragments and a rigid instant elbow reaction. This child branch replaces the global `fractureMask` rising independently of shards with six **glass shell mask zones**. Each zone becomes opaque only when its corresponding physical shard is seated; at every frame, `shellOpacity + correspondingShardOpacity = 1`. Small fracture traces exist only during the fusion crossover and then disappear. The original glass, wall, sunset material, camera, room and 24-second approved film remain unchanged.

The body reaction now has eye/head lead, shoulder movement, near-wrist lag and far-wrist lag, each with different smooth-in/smooth-out time windows. IK clamping remains safety-only. Every frame runs through the actual `CharacterTurnV5` renderer during CI audit, including hand-step acceleration and foot drift bounds. No new full-3D or Blender dependencies.

**Required review:** compare 10.2–12.6 seconds of seam repair and 12.45–14.85 seconds of acting at real movie frame cadence; do not judge only a static 9-frame contact sheet. The dedicated CI exports focused moving-frame grids as well as an iPhone-compatible viewing copy after full-frame decode. Do not merge or label master without owner review.
