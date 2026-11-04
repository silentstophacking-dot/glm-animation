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

GitHub Actions [41861478629](https://github.com/silentstophacking-dot/glm-animation/actions/runs/41861478629) completed every listed step successfully, including rendering, video/audio verification, both artifact uploads and Complete job. The API still reported overall in_progress at the last check, so only the successful step results and available artifacts are asserted here. Rendered source commit: cea02fb; subsequent changes save media/docs.


## Owner approval after handover — 5 November 2026

The owner reviewed the latest **full 24-second ClockDiscoveryPerformance** and explicitly said **“Looks great.”** This newer feedback supersedes the pending-review statements above and in the 4 November handover. Treat the current scene as the **approved visual/acting baseline** for subsequent animation work, not as authorization to overwrite previous episodes or to rebuild the complete Probability Control film.

Approval covers the actual rendered black-puffer performance, eye-led clock discovery, recognition hold, look-back, second reach that stops short, withdrawal, and existing sound cue timing. Preserve the approved source and 24-second rendered video as immutable comparison material while developing new scenes.

**Mandatory visual bar for each new scene and insert:** match the physically constructed 2.5D material treatment of the cinematic clock V2 and lab: projected front/side/top planes when relevant, case thickness, recessed/enamel/metal/glass surfaces, coherent warm window rim and cool fill, grounded feet with support shadows, continuous shoulder-to-wrist puffer sewing and prop contact, and a single camera/projection space. Flat icon close-ups, bare gradient walls, sliding scenery, simplified cartoon objects, or changed character proportions do not pass. Inspect actual stills and movie frames at phone size as well as 1080p; typecheck is not visual acceptance.

**Next safe stage:** develop and review the following story beat on a new feature branch descending from `feature/clock-discovery-acting`, keeping the approved composition intact. Create a detailed visual storyboard and key poses before running one designated GitHub Actions movie render. Do not assume that approval of this scene approves a whole long-form episode.
