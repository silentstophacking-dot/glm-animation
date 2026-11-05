# Production pipeline acceptance checklist

## Implemented and reusable
- Original approved lab performance, Glass Reversal acting rig, world camera and materials remain unmodified on the base branch.
- Default character in the starter and environment presets wears the **puffer-black** garment from the existing `character-outfits.tsx`.
- Scene contracts and film timeline are data-driven, with runtime validation for durations, IDs, camera keyframes and world-box dimensions.
- Environment presets: nighttime street, apartment, industrial interior. They use fixed-world projection; their geometry is a **starter library**, not an automatically approved final art design.
- GitHub Actions renders an approved-reference comparison, a short starter film, and three environment checkpoints. TypeScript and video decoding are checked.
- A new film should branch from `feature/reusable-cinematic-production-pipeline` and add story-specific scenes, without editing original approved technical-test files.

## Still requires human visual approval
- The three environment presets are foundations; their lighting, architectural detail and shot-specific props must be visually compared with the approved 24-second Clock Discovery and 17-second Glass Reversal before release.
- New acting beats need performance choreography; static pose alone is insufficient.
- Voiceover must be included and checked in each film's final deliverable. The starter deliberately has no narration.
- No automation can guarantee creative quality or eliminate all future revisions.

## Acceptance criteria
1. `npx tsc --noEmit` succeeds.
2. Approved test frame and all three environment checkpoint stills render.
3. The starter film renders, ffprobe reports H.264 and ffmpeg decodes it.
4. World-camera parallax and default outfit are checked in source and visual review.
5. User approves the look of reusable environment presets before calling the library artistically finished.

## Visual audit — 2026-11-05 (actual GitHub render)

GitHub Actions run 42012907490 completed successfully. Artifact 13407517784 was downloaded and its approved reference, street, apartment and industrial checkpoints inspected.

**Result: TECHNICALLY VERIFIED; ARTISTICALLY REJECTED.** The three presets are simplistic geometric blockouts, not the approved detailed cinematic 2.5D environments. Buildings use repetitive windows, the apartment has rudimentary furniture, and the industrial room lacks material and lighting complexity. Do not promote these presets as production-ready or use them as the final backgrounds for a new film.

The puffer-clad character and world-camera code are retained. Upgrade the environment material/geometry layer against the approved `lab-room-depth.tsx` before visual approval. The next acceptance checkpoint must compare the same camera-scale, character size, material richness and environment density, not just a successful render.
