# Clock discovery — acting refinement

The owner liked the detailed clock correction and explicitly required that visual standard for every new scene. This revision keeps that clock, puffer, material detail and lab lighting throughout the full 24-second scene, and clarifies the discovery performance. It is not a long-form episode rebuild.

`ClockDiscoveryPerformance` (720 frames / 30fps) and `ClockDiscoveryBoard` use `clock-discovery-entry.tsx`. The complete film is newly renderable, rather than another clock-only review edit.

The V5 face now accepts signed head yaw for a leftward look and optional vertical eye direction. Existing nonnegative yaw/default gaze retain their original output. Eyes remain opaque; head-surface occlusion, not eye fading, communicates depth. Eyebrows/eyes move together while the mouth stays attached to the face.

The eyes lead at frame 412, head at 420 and chest at 427, establishing the upward/left clock eyeline before the insert. Returning from the clock, the actor holds that eyeline through recognition, then looks back toward the console before moving the hand. A second reach holds at 650–678, stops over 40 world units short of the button, then withdraws. The ending remains concerned rather than switching to an unrelated smile. Hip reach is recomputed for the slight chest turn while sole anchors remain fixed.

Original walk/press/release action through frame 411 is unchanged. Clock shot design/timing is unchanged. Clothing cues are retimed to the new second reach and withdrawal; button, activation and all three footfall cues remain synchronized. The new original synthesized soundtrack is a separate asset; earlier soundtracks and proofs are preserved.

TypeScript and the 720-frame audit pass, including earlier contact tests, construction of the actual posed rig on each frame, planted support, zero planted drift, leftward eyeline, preserved early action, no second press and a minimum 40.19-unit second-reach gap. The rendered six-pose board was inspected for face direction, neck attachment, sleeve/cuff continuity, torso shape and stop pose. Full movie review and owner feedback remain necessary.

One local phone movie and one GitHub full-resolution render are used. No other film is automatically re-rendered. Manual composition choice and long-form support remain preserved.

A transition review caught the free arm returning to rest abruptly at frame 412. The corrected version interpolates its release and starts the head turn from the actual preceding pose. The audit explicitly checks that boundary (free-arm local displacement about 0.006 units). The superseded draft Actions run was canceled automatically before the corrected run.

The older six-shot storyboard was rendered after the shared face changes and compared in RGB: pixel-identical. This confirms prior nonnegative-yaw/default-gaze output is preserved for those poses.

The local full-scene phone movie passed complete 720-frame decode, 1280×720 / 30fps / 24-second video, H.264/yuv420p/faststart and AAC stereo/cue verification. Audio is 24.043 seconds including encoder padding; decoded peak is −1.1 dBFS. Fifteen extracted movie frames around the glance, cuts, recognition and stopped reach were inspected, plus consecutive transition frames 410–415. Owner visual/sound feedback remains pending.
