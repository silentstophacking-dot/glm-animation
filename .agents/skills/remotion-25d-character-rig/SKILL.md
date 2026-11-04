---
name: remotion-25d-character-rig
description: Build and review frame-driven SVG character turns, poses and acting in this existing Remotion project, using layered 2.5D construction and supplied video references. Use for character proportions, front/three-quarter/profile consistency, pseudo-3D turns, limb overlap, foreshortening, grounded movement and camera/contact continuity. Does not require Blender.
---

# Remotion 2.5D Character Rig

This is a project-specific authored skill, not an installed third-party rig, renderer or model. It documents a construction and review method; it does not establish reference parity or visual approval.

## Start with the existing project

Read `production/style/LONGFORM_ART_DIRECTION.md`, `production/style/CHARACTER_SILHOUETTE_V4.md` and `production/style/PERFORMANCE_V3.md` from the repository root. Read the relevant existing components before editing:

- `studio/src/episodes/probability-control/cinematic-character-v2.tsx`
- `studio/src/episodes/probability-control/character-v2-motion.ts`
- `studio/src/episodes/probability-control/performance-v3-motion.ts`
- `studio/src/episodes/probability-control/pseudo-depth-camera.ts`
- `studio/src/episodes/probability-control/pseudo-depth-proof.tsx`

Preserve previous compositions, proofs and Probability Control. Work on feature branches and PRs. Do not rebuild the episode until the owner has visually approved the design and motion. Positive feedback on one view does not approve every turn or pose.

Read [construction](references/construction.md) before implementing a rig change and [review](references/review.md) before rendering or reporting results.

## Reference evidence

Use the owner's actual supplied Ifverse videos or extracted frames. Compare matching view, pose and camera scale. Separate observation from inference; do not claim knowledge of the source creator's tools. Locate available references rather than assuming local attachment paths persist. Do not claim to inspect unavailable footage.

Normalize standing height and floor baseline when comparing proportions. Record head diameter, visible neck, shoulder span, torso/hem position, limb thickness and hand/shoe size as ratios. Perspective and poses can distort ratios: document estimates and uncertainty rather than treating a single frame as a blueprint.

## First benchmark

Build a short, controlled front → three-quarter → profile turn on a fixed floor and camera. Show the key-view still sheet first, then validate transitions in a short motion proof within the user's authorized scope. Keep each foot planted during an in-place turn unless a deliberate pivot/lift is authored. Test front/three-quarter/profile as complete body orientations, not just facial positions.

Only after the turn works should this candidate replace the character in the existing performance proof. Retune shoulder and hand targets, run contact/reachability checks and inspect sleeve/torso overlaps before proposing episode-wide use.

## Remotion rules

Every animated value must derive deterministically from the current frame and composition fps. Use Remotion interpolation/springs or existing deterministic helpers. Avoid CSS transitions, browser-time animation, timers, requestAnimationFrame and unseeded randomness in rendered scenes. Adapt timing principles from UI animation selectively; character anticipation, holds and impacts need story-specific timing.

Reuse the existing projection, rig and animation helpers. Do not install a motion or 3D dependency when SVG geometry suffices. CSS perspective can help planar props, but rotating one flat character plane is insufficient for a volumetric turn.

## Delivery

Inspect actual rendered stills and frames extracted from the movie. Report what passed, what remains awkward and what has not been reviewed. TypeScript success is not visual approval.

Keep GitHub Actions as the primary rendering platform. Use a still-only review workflow for design-only changes and one short movie for a motion revision. Preserve manual composition selection and long-form rendering. Movies must be verified H.264/yuv420p/faststart with the expected dimensions, fps, duration and decoded frame count. Supply direct images or MP4 links suitable for iPhone; artifact ZIPs are a secondary archive.
