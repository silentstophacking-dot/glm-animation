# Shared-camera 2.5D proof

Owner requested continuing the depth upgrade after identifying that the previous figure behaved like a flat cutout. This change builds on CinematicCharacterV2 and the accepted lab/trolley; previous designs, proofs and the film are preserved.

## What changes
- Optional body view parameter changes garment width, front/side surface split, hood silhouette, shoulder/arm overlap and far-eye visibility together. Feet stay planted; the upper body turns between front and profile-like views while the palm keeps contact. This is an illustrated view system, not a complete free-orbit body mesh or a rear-view character library.
- One pinhole camera projects world x/y/z positions. y is altitude; z is depth. The rear lab artwork is a plane at z=650, interaction artwork at z=0 and foreground glass at z=-300. Camera translation/dolly creates depth-dependent movement; there is no independent decorative background scrolling.
- Floor tiles and actor/trolley shadows are projected from the ground plane. The actor's outsole and trolley feet share the floor baseline. Character, button and trolley use one exact interaction transform and matching contact anchor.
- Existing authored lab and trolley artwork remain illustrated planes with drawn side surfaces. Small camera translations/dollies are supported; this is not a geometrically correct room orbit. Further viewpoint changes need additional illustrated views or geometry.

## Review outputs
DepthCharacterStudy: front, three-quarter and profile-like illustration comparison.
DepthContactBoard: four snapshots across the same camera/torso study.
DepthCameraProof: six-second, 180-frame silent technical depth/turn study. It demonstrates camera projection and anchored contact, not a new story episode or approved final acting.

## Checks
Checks every camera frame for hand/button projection agreement and verifies foreground travel > interaction travel > background travel. Camera path measures about 191/142/92 screen pixels respectively. Character construction checks all 180 view states for reachable limbs. Existing 270-frame physical-pose audits remain available. Render stills are inspected before the technical video, and the local movie is inspected by frame grid and full MP4 decoding. GitHub exports the 1080p master and a diagnostic board; phone preview is a direct 720p MP4.

The user saw the prior character and contextual board, identified the depth gap and explicitly requested continuing this technical depth preview. The full Probability Control episode remains unchanged, pending character/motion review. No Blender or paid asset/audio generation is used; zero ElevenLabs credits.
