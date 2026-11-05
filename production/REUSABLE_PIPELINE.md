# Cinematic 2.5D production master

This branch is based on the **approved** `feature/reversal-coherent-left-facing-rig`, not the rejected Last Signal prototype.

## Reuse, don't redraw
- `studio/src/production/scene-system.tsx`: scene contract, camera keyframes, fixed-world projection, reusable world geometry and approved `CharacterTurnV5` acting rig.
- `studio/src/production/film-template.tsx`: arbitrary sequence assembly, 30 fps, 1920×1080 master, optional voiceover path, validation.
- `studio/src/production/starter-spec.ts`: replace **only the story specification** to start a film; never edit the approved technical-test implementations.
- `studio/src/production/quality-audit.ts`: geometry, camera, rig and timing checks.
- `.github/workflows/cinematic-production-master.yml`: renders reference and new scene checkpoint, then full sample MP4, checks video integrity and publishes downloadable artifacts.

## Reference standards
- Approved 24s Clock Discovery: `clock-discovery-proof.tsx`, `clock-discovery-motion.ts`, `lab-room-depth.tsx`.
- Approved 17s Glass Reversal: `reversal-evidence-storyboard.tsx`, `character-turn-v5.tsx`.
- Fixed-world camera: `pseudo-depth-camera.ts`.

## Production process
1. Create new film branch from this **pipeline branch**.
2. Add a story-specific spec and scene components using existing world projection and character rigs.
3. Run typecheck and automated geometry/rig audits.
4. Render and visually compare new scene checkpoints to the approved reference frames. Automated tests cannot judge artwork quality.
5. Render final film with user-supplied narration; confirm audio stream and actual timing.
6. Obtain user approval before declaring visual completion.

The starter render is a **technical demonstration**, not a finished film or an automatically approved art style. New story environments still require original design and shot-specific acting.
