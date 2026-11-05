# APPROVED TECHNICAL BASELINE — MANDATORY FOR ALL STORIES

## Source of truth
- **ClockDiscoveryPerformance**: `studio/src/episodes/probability-control/clock-discovery-proof.tsx` on `feature/reversal-coherent-left-facing-rig`. Approved 24-second performance.
- **Glass Reversal**: `studio/src/episodes/probability-control/reversal-evidence-storyboard.tsx` and its motion/character dependencies on `feature/reversal-coherent-left-facing-rig`. Approved 17-second physical acting.
- **3D-like fixed-world architecture**: `lab-room-depth.tsx`, `lab-room-geometry.ts`, `pseudo-depth-camera.ts`.
- **Acting**: `character-turn-v5.tsx`, `clock-discovery-motion.ts` and scene-specific performance data.
- **Material/light reference**: `cinematic-lab.tsx`, `cinematic-lab-clock.tsx`, `lab-room-depth.tsx`.

## Non-negotiable scene acceptance
1. Construct architectural geometry and props in shared world coordinates, project with the approved camera, and keep objects fixed as the camera moves.
2. Extend the approved actor rig with coherent head, torso, arms and grounded feet; no static actor pasted on top of a moving scene.
3. Use scene-specific material gradients, bevels/edges, reflections, local lighting and atmospheric separation at the same density as the approved laboratory.
4. Avoid mass-generated identical facade silhouettes, repetitive window grids, and placeholder SVG geometry.
5. Review matched frames against the approved Clock Discovery and Glass Reversal references before full-film rendering.
6. Verify continuity and character scale between shots, and confirm final audio uses the user's supplied WAV.
7. A green GitHub Actions run proves the file rendered; it does not prove artistic acceptance.

## Last Signal rebuild
- Previous `last-signal-film.tsx` is a **timing prototype only**, not the production-quality master.
- Reuse its 50.4-second timeline and the user's narration, but reconstruct apartment, street and reveal on the shared fixed-world camera architecture.
- First three required checkpoints: alert/apartment, double/street, final reveal.
- Do not mark film final until all three match the approved tests and the user has a reviewable MP4.
