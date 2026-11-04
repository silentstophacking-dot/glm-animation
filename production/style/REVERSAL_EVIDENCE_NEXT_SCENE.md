# Reversal Evidence — storyboard review candidate (not yet approved)

**Source baseline:** the owner-approved 24-second `ClockDiscoveryPerformance` on `feature/clock-discovery-acting` (PR #41), reviewed as “Looks great.” **Never alter that 720-frame scene.**

## Narrative purpose

The clock has already reversed. This next 17-second beat **proves the reversal is physical, not just the clock's hands**. A broken lab ampoule on the existing bench reconstructs itself, including separate edge-lit shards and water that returns upward. The character watches, understands the implication and remains worried.

This is a candidate next scene, not an authorized full-film rebuild. The final visual review determines whether the sequence proceeds to a movie render.

## Storyboard

| Frames | Beat | Required visual evidence |
|---|---|---|
| 0–99 | Attention catches another movement | Full projected sunset lab and black-puffer figure |
| 100–173 | Broken glass | Transparent glass, real bench support/clamp, material highlights |
| 174–285 | Reverse shards | Individual pieces move in a world-anchored camera plane |
| 286–375 | Cracks heal / liquid returns | Recessed thickness, transmitted blue liquid, copper/steel trim |
| 376–457 | Recognition | Eye-led gaze and held feet, same costume and lighting |
| 458–509 | Uneasy wide | Detailed clock and lab still present, no new art style |

## Non-negotiable visual continuity

- Reuse the exact `LabRoomDepthScene`, `CinematicLabClock` and `ClockWallDetail` from the approved scene.
- Reuse `discoveryActorAt(719)` as the actor performance baseline; new reaction motion is opt-in and must not modify previous source.
- The new glass prop is anchored in a shared `WorldPoint`, `(-860,278,535)`, on the existing rear workbench. Camera and glass use the same `WorldCamera` projection.
- Material treatment: volumetric rear glass/rim, translucent wall with shaded thickness, realistic transmitted blue liquid, shadow on the bench, metal neck/fitting, sunset glint and cool fill. **Reject a flat silhouette on a gradient wall.**
- All six storyboard panels are actual code-rendered scene frames. Verify wide and inserts at phone size and in 1080p. No detached UI elements, prop teleports or sliding shadows.
- New optical crops are shot-specific views of the same world; **not separately animated backgrounds**.
- For animation, verify stable vial contact, timed shard reversal, coherent bench occlusion and head/hand continuity before full GitHub render.
- Keep the 17-second MP4 render disabled until storyboard approval. New branch workflow builds and audits stills only.

## Source and rendering paths

- `studio/src/episodes/probability-control/reversal-evidence-storyboard.tsx`
- `studio/src/reversal-evidence-entry.tsx`
- `.github/workflows/reversal-evidence-board.yml`
- Compose `ReversalEvidenceStoryBoard` (1 frame, 1920×1848) for six-panel review.
- Compose `ReversalEvidenceFrame` (510 frames, 1920×1080) for selected stills only before approval.

**Feedback gate:** Show the six-panel storyboard and close-ups to the owner, compare against `ClockDiscoveryPerformance`, and request explicit visual approval before adding new full-render triggers.

## Revised material and continuity verification — 5 November 2026

The first rebuilt stills were rendered successfully by GitHub Actions run `41923175382`, after replacing the misleading fully intact ghost bottle with a fractured lower bowl, bench-resting shards, thicker tinted faces, a fixed support bracket, a shrinking spilled pool, and deterministic droplets returning through the same vial opening. The actor, camera projection, and approved 24-second scene were not changed.

Second pass: fade glass fragments out as the material seals instead of leaving heavy overlapping interior outlines; lighten the transparent shell's edge; capture the moving-shards panel at frame 254 (rather than the prematurely static 222), and inspect a nearly complete frame 374 instead of labeling the still-incomplete frame 350 as restored. Frame 254 is exported separately to inspect the lifted shard trajectories.

**Visual acceptance is still pending.** Typecheck and source audits are necessary but not proof of credible frame-by-frame physical motion. The 17-second video remains intentionally unrendered until storyboard review.
