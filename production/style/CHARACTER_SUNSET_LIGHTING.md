# Character sunset lighting proof

The owner requested lighting like the supplied Ifverse references. Reviewed the actual Reaction Time 50s frame: a narrow golden edge, a nearly black head, legible cream facial features and warm clothing against a darker room. This proof adapts those observed relationships, without claiming identical rendering or knowledge of the source production tools.

Adds an opt-in `lighting="sunset"` to CharacterTurnV5. Baseline is still the default, preserving the previous turn proof. Cloth and trousers use warmer source-facing tones and cooler shadow tones; the head remains dark with very restrained fill. A fixed top-left directional alpha-edge filter adds a thin inward rim to the character silhouette. It does not add an omnidirectional glow or alter visible-eye opacity. This is stylized compositing, not a physical renderer or normal-mapped lighting system.

Reuses the existing sunset LabBackground with the character on its foreground floor. The visible window/sun sits above and left of the actor. Added a soft floor cast shadow extending down/right, sole contact shade, reflected warm floor light, restrained haze and vignette. Camera, background, light and shadow direction remain fixed throughout the six-second turn. The light does not rotate with the face.

The comparison board puts baseline and lit characters in the same room at the same pose, plus lit front and profile views. Character proportions, timing, heel anchors and existing acting/episode compositions are preserved. The isolated light option can be reused later, but the current performance and Probability Control are not rebuilt.

Checks: inspect the full-resolution board before rendering one short movie; review extracted intermediate turn frames for rim stability, readable eyes and grounded shadows. Run TypeScript and the 180-frame turn audit with sunset lighting, then verify actual MP4 dimensions/fps/duration, decoded frame count, H.264/yuv420p/BT.709 and faststart. The production workflow renders once on this feature branch, with the comparison PNG and diagnostic artifacts; manual long-form selection remains available.

Limitations: one fixed window-light setup, screen-space directional rim, approximate floor cast shadow, no self-shadowing between articulated limbs, no dynamic light movement. A moving camera/light would require consistent world-to-screen light projection and shadow geometry before reuse. Reference parity and episode-wide visual approval remain unclaimed.
