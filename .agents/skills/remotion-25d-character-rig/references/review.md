# Render review

1. Render equal-height key views on a neutral background with a common floor baseline. Include a solid silhouette and at least one view at phone scale.
2. Inspect neck attachment, shoulder slope, sleeve gaps, hand/cuff orientation, torso width, leg spacing and shoe direction. A front view must read front-facing across the entire body.
3. Render one short turn after key views have been shown, within the owner's authorized scope. Review extracted consecutive frames around occlusions and profile transitions, not just first/middle/last frames.
4. Look for head/torso size pumping, collapsed shoulders, eyes fading without occlusion, floating hands, reversed thumbs, abrupt layer swaps, foot drift and camera-independent scenery.
5. Run TypeScript and relevant existing reachability/contact audits if shared geometry changed. Verify the actual rendered movie's metadata and full decode. Static design tweaks usually need only stills and typecheck.
6. Compare source and candidate at matching scale/view. State remaining gaps candidly. Record selected direction and unresolved issues in production/style without labeling unapproved work approved.

## Current project commands

Run from `studio/`, using pinned dependencies:

- `npm run typecheck`
- `npx remotion still src/character-silhouette-v4-entry.tsx CharacterSilhouetteV4Sheet out/character-review.png --frame=0`
- `npx remotion render src/performance-v3-entry.tsx PerformanceV3Proof out/performance-review.mp4 --codec=h264 --pixel-format=yuv420p --image-format=png --color-space=bt709`

Use the existing `scripts/render-production.mjs` and `scripts/verify-render.py` for production movie rendering/verification; the CLI example above does not by itself establish faststart or validation. Add a dedicated composition for the turn rather than modifying an existing proof's behavior silently.

Local environments may need an explicit Chromium executable. Review existing workflow configuration before changing rendering infrastructure. Do not render the full episode merely to test a character change.
