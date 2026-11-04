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
