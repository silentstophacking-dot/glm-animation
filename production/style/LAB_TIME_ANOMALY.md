# The backward clock — 24-second mini-scene

The owner liked the integrated 11-second puffer proof and authorized the proposed short story scene. This branch retains that costume and room, rather than rebuilding Probability Control.

## Story and shots

| Frames | Story beat | Framing |
| --- | --- | --- |
| 0–209 | Notices an erratic meter and approaches | Fixed wide; room geography and planted steps |
| 210–269 | Reads the console, hesitates | Medium |
| 270–359 | Reaches, presses; the console activates | Hand/control insert |
| 360–449 | Recoils and listens | Face and upper-body reaction |
| 450–539 | Wall clock visibly runs backward | Clock insert |
| 540–719 | Looks toward the clock, starts another reach, stops | Medium reaction; open ending |

`LabTimeAnomaly` is 720 frames at 30fps. `LabTimeAnomalyBoard` is a six-shot storyboard. Dedicated entry: `studio/src/lab-time-anomaly-entry.tsx`.

The existing performance is retimed on a monotonic source clock. The three footsteps and palm/button contact retain their underlying world anchors; no new unconstrained walk is introduced. After release, independent head/gaze timing and a restrained hand gesture extend the acting. An initial folded-arm gesture looked awkward in the rendered board and was replaced before movie rendering.

The room's camera projection remains shared by scenery, actor, trolley, button and shadows. Mediums and inserts use consistent crops of the projected scene, equivalent to optical reframing; they do not independently slide the background. The clock insert reuses the same world-mounted clock and its continuous time value. The clock is the only deliberately changing environmental object. Its face has readable indices and three hands; the familiar sunset light stays fixed.

## Sound

Original deterministic synthesized sound: quiet mechanical room tone, three shoe impacts, restrained clothing rustle, button click, activation chirp, subtle low reaction hit and clock ticks. A few quiet curiosity notes stop before the turn. No voice, licensed music, paid API generation or external recordings are used. This is a first sound-design pass, not recorded naturalistic foley.

Build with `python3 scripts/build-lab-anomaly-audio.py studio/out/time-anomaly-audit.json` after running the motion audit. Cue frames come from that audit, not guessed times. The saved AAC stereo track and cue manifest are committed for reproducible Actions renders.

## Review and verification

TypeScript and the 720-frame actor/contact/clock audit pass. Planted-foot drift is zero; world and cropped-screen hand/contact error is below 0.001. The four original puffer and 330-frame contact checks also run through the integration audit. Rendered storyboard review checks cuff connections, sleeve quilting, facial visibility and shot composition. Story continuity and acting still require owner review in motion.

One local phone movie and one designated GitHub Actions production render are planned. The pipeline verifies H.264/yuv420p/faststart, full decode/frame count, AAC stereo/duration, levels and cue metadata against the motion audit. No full episode render is needed.
