# IFVERSE REFERENCE STUDY — PRODUCTION VISUAL STANDARD

Studied 2026-11-06 from four user-provided full-length reference videos (approximately 5:48–8:36 each). This document describes observed visual grammar, not permission to copy source footage. **Do not upload third-party reference frames, clips or audio into the public repository.**

## Reference videos inspected
1. **What If One Second Felt Like Ten?** — 6:46, 1280x720, 24 fps. Dark experimental rooms, red-jacketed protagonist, strong rim light, science data overlays, distinct close/medium/wide compositions, deliberate action against a fixed background.
2. **What If You Used 500 IQ to Disappear?** — 8:36, 1280x720, 24 fps. Surveillance framing, green tracking markers, evidence boards, route maps, security rooms, paper inserts, color-coded narrative information.
3. **What If You Woke Up in Kindergarten With All Your Memories?** — 5:48, 1280x720, 24 fps. Simplified round-head characters, high-contrast white facial expressions, warm institutional spaces, extreme eye/face close-ups, family/school/career montage, readable visual metaphors.
4. **What If Your Reaction Time Was 10x Faster? 2** — 7:13, 1280x720, 24 fps. Amber-purple sunset palettes, café interior/exterior views, shallow foreground framing where motivated, hand/object close-ups, stopwatch, measurements, stadium wide shots.

## The actual style (corrects earlier misunderstanding)
This is not realism or Blender-like 3D. It is **graphic 2D characters composited into carefully layered cinematic 2D/2.5D spaces**:
- Black circular heads with clean expressive white eyes/mouth, simple silhouette, slender articulated limbs.
- Signature clothing shapes (approved project's puffer jacket must be retained), strong contour/rim edge with restrained material highlights.
- Environments have a restrained graphic language: clean architecture, selective ornament, clear perspective, shadows, gradients, cutout silhouettes, practical lighting.
- Depth comes from foreground/midground/background separation, consistent floor attachment, overlaps, parallax and scene-to-scene framing; not from excessive bevels or hyperreal texture.
- Facial emotion drives acting: surprise, dread, hesitation, glance, resolve, along with small believable hand/torso/foot actions.
- Shot scale changes frequently: establishing wide -> medium character performance -> tight eye/hand/prop insert -> relevant new space. Do not render 40 seconds with nearly identical hallway framing.
- Visual evidence and information graphics must tell story: labels, evidence, maps, timers, alerts; no meaningless decorative HUD.
- Color grading often sets blue/purple shadow against amber practical lights; warmer settings can still share same character style.
- 24-fps source cadence observed. Keep 30 fps if existing pipeline requires it; matching composition and pose timing is more important than copying frame rate.

## Motion findings from sampled 0.5s sequences
- The scene holds a coherent static world while characters articulate locally (head, shoulder, forearm, walk cycle); camera changes are deliberate and separate from character coordinates.
- A recognizable acting beat is staged across multiple frames rather than represented by a text caption.
- A hard cut is used to switch perspective/setting; slow pushes are reserved for focused attention.
- Expression changes and point-of-view inserts are visual punctuation and can carry a moment without large character motion.
- Animated labels/timers appear where they clarify causality; avoid overlays as a substitute for an action that must be shown.

## Hard rejection conditions
- A character remains in the same pose through several dramatic beats despite narration claiming movement.
- A close-up label says a reveal occurred, but the reveal is not visually depicted.
- The door/vehicle/prop does not maintain perspective or floor attachment through a move.
- Every shot uses the same environment crop and character scale.
- Darkening the frame is treated as equivalent to a creature reveal, and text is treated as equivalent to a run.
- A scene uses generic rectangle wallpaper instead of designed composition and meaningful props.
- A 'visual QA passed' claim is made solely because TypeScript compiled and an MP4 decoded.

## The Door That Knocked Back: required shot language
A. 0–6s: wide-to-tight hallway setup, recognizable room 213, puffer Ethan reaching with key; three visible door knock pulses.
B. 6–13s: medium reaction; sleeve/hand retracts and eyes shift toward the door while voice warns him.
C. 13–20s: eye/ear close-up, then subjective peephole move, no arbitrary text overlay covering reveal.
D. 20–29s: aged double visibly recognizable, face scar, gray features, matching clothing; distinct viewpoint.
E. 29–38s: hand-held photo insert clearly depicts same hallway, a *recognizable* Ethan, threatening faceless figure.
F. 38–45s: older man's gesture and clear verbal warning, not just motionless posing.
G. 45–50s: physical turn/reverse angle to empty hallway, then practical light failure.
H. 50–55s: threatening figure appears with depth and scale, clear cause/effect.
I. 55–58s: rapid physical retreat through a door that moves about a world hinge; door slam prevents figure entering. Narration finishes on RUN, visual action supplies the payoff.

## QA workflow for every future film
1. Name target compositions and acting beats; check against the four reference *principles*, not just this document.
2. Reuse `CharacterTurnV5`, approved movement components and the scene depth camera. Customize only story-specific rigs/props/poses.
3. Pre-render a reference frame from **ClockDiscoveryPerformance** and **Glass Reversal** plus three candidate frames (hook, acting close-up, payoff).
4. Compare silhouette readability, face/gesture expressiveness, environment depth, layer separation, lighting hierarchy and camera variation.
5. Re-render when quality fails. Render success never counts as artistic approval.
6. Deliver a narrated, iPhone-compatible MP4 only after physical action is readable **without text overlays**.

## Rights/source handling
These four videos are study references provided for critique and production learning. Recreate general techniques and visual vocabulary with original code and artwork, not exact shots, sequences, characters or source assets.
