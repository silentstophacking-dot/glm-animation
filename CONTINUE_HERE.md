# Continue this animation project

**Cross-account handover, 4 November 2026.** Read this before relying on the default branch or older chat summaries.

## Latest development after handover

**Active branch: `feature/clock-discovery-acting`**, based on `feature/cinematic-clock-insert`. The owner liked the 11-second puffer/lab result and authorized the next 20–30-second mini-scene. `LabTimeAnomaly` is the new 24-second candidate: approach, hesitation, press, recoil, backward-clock insert and uncertain reaction, with an original synthesized soundtrack. See [mini-scene notes](production/style/LAB_TIME_ANOMALY.md). The owner liked the scene but rejected its overly simple clock insert. ClockInsertV2Proof is the detailed replacement shot; LabTimeAnomalyV2 applies it in the full scene. Read production/style/CINEMATIC_CLOCK_INSERT.md. The owner liked the clock correction and required the same visual standard for every new scene. ClockDiscoveryPerformance is the next full-scene candidate: eyes/head/chest lead toward the clock, recognition hold, hesitant second reach and withdrawal. See production/style/CLOCK_DISCOVERY_ACTING.md; this acting revision awaits owner review. Earlier compositions, films and branches remain preserved.

## Open the right version

Repository: https://github.com/silentstophacking-dot/glm-animation

**Handover branch: `feature/project-handoff`.** It includes the current development chain through `feature/lab-room-depth` (`548367a`) plus this handover and review media. `main` is not the latest development state. Preserve the feature branches and draft PRs; do not merge the entire stack as an account-transfer step.

Read [the continuation prompt](handoff/NEW_CHAT_PROMPT.md), [technical runbook](handoff/RUNBOOK.md), [review gallery](handoff/REVIEW.md), [AGENTS.md](AGENTS.md) and the [project rig skill](.agents/skills/remotion-25d-character-rig/SKILL.md). All files are in the repository, not dependent on ChatGPT memory or a globally installed skill.

## Goal and working rules

Make cinematic 2D/2.5D storytelling in the visual language of the supplied Ifverse references, with an increasingly distinct original character outfit. The owner is iPhone-only. Develop/test/debug with Codex, push feature branches and draft PRs, and use GitHub Actions for full-resolution rendering. Deliver direct PNG/MP4 review links; ZIPs must not be the only way to review results. No Blender.

Preserve Probability Control, earlier films, rigs and experiments. Inspect real rendered frames, not just TypeScript. Keep feet grounded, hands attached, prop contact stable and scenery tied to a shared camera. Avoid unnecessary movie renders. **Do not rebuild the full Probability Control episode until the final character and integrated motion have been visually approved.**

## Current direction and approval boundaries

- The owner liked the sunset lab, material detail and thin warm rim/cool fill lighting. Keep the small round black head, visible neck, readable cream expressions and controlled slender body proportions with fuller clothing/limbs. Earlier versions were first too bulky, then too skinny; avoid swinging between those extremes.
- Front-view arms must be genuinely frontal. This was corrected after owner feedback. Visible eyes must not be faded to imply depth; use placement, foreshortening and occlusion. Both corrections are in the current rig.
- The orange-red hoodie was an experiment. The owner wants a character that feels less like the reference channel. Outfit comparisons include teal/utility/waistcoat, a cobalt-and-gold lead jacket and most recently **a puffer jacket**.
- The owner said they loved the puffer direction. Black was recommended and is used in the latest room proof; **final colour was not explicitly selected**. Black, cobalt and teal remain available. The owner liked the integrated puffer animation and asked to continue into a mini-scene.
- The revised character turn and sunset lighting were liked. The 11-second combined acting proof was reviewed; the assistant recommended more walk/hand/recovery polish. This is not blanket approval to rebuild the episode.
- **Latest owner reaction to the seven-second room camera proof: “I love it.”** Keep this background direction: projected furniture faces, city behind window frame, grounded puffer figure and physically linked foreground parallax.
- Latest proposed next step: one cohesive scene with the puffer character walking through the depth-surfaced lab and interacting with the console. The owner then asked to preserve the project for another ChatGPT account. This handover does not itself approve a full film rebuild.

## What is implemented

| Piece | Composition / main code | Status |
|---|---|---|
| New room camera move | `LabRoomDepthProof`; `lab-room-depth.tsx`, `lab-room-geometry.tsx` | 7s / 210 frames; reviewed and liked; still actor |
| Puffer wardrobe | `PufferJacketStudy`, `PufferLabStudy`; `puffer-garment.tsx`, `character-outfits.tsx` | Three colours + black context still; design candidate |
| Combined acting | `CombinedCharacterPerformance`; `combined-performance-motion.ts`, `combined-performance-proof.tsx` | 11s / 330 frames; revised rig + lighting + original console timing; **hoodie default, older DepthScene** |
| Turn rig | `CharacterTurnV5Proof`; `character-turn-v5.tsx` | 6s front → three-quarter → profile; optional pose/mood support |
| Lighting | `CharacterSunsetLightingProof`; `character-lighting-proof.tsx` | 6s reference-informed fixed sunset setup |
| Episode archive | `studio/src/episodes/probability-longform/`, `production/probability-longform/`, EPISODES registry | Existing long-form source/experiments preserved; do not rebuild yet |

Code filenames above live under `studio/src/episodes/probability-control/` unless stated otherwise. See `studio/src/Root.tsx` and the [PR snapshot](handoff/PR_SNAPSHOT.json) for the other preserved compositions/branches, including Character Rig V2–V5 and the earlier long-form work. Some historical branches are siblings, so do not assume the latest branch contains every sibling's unique change. They remain in GitHub and the full Git backup.

## The next integration needs real retargeting

1. Read the rig skill and relevant `production/style/` documents. Watch the saved room and combined-acting clips in the gallery before editing.
2. Extend the puffer's quilting and sleeve shape to follow posed shoulder/elbow/wrist chains. **This was the handover limitation; the active puffer-performance branch now adds IK-linked posed stitching.** Do not call the costume animation-ready yet.
3. Combine that costume with the established notice → walk → hesitate → reach → press → recoil → recovery sequence in the **new** room geometry. The existing combined proof is not already in that room.
4. Retarget camera/actor/prop contact in world space. The new standing actor is at `(-260, 0, -40)`, while the console front is at `z=0`; the old 2D hand target cannot simply be pasted across those different planes. Align the interaction or solve the projected target correctly.
5. Review key poses first; then one short local phone proof and one designated GitHub production render. Audit feet/contact and inspect actual frames, especially walking, wrists, sleeve/torso overlap, quilt deformation, press/release and recovery. Keep lighting and floor shadows coherent across the camera move.
6. Ask for visual feedback on the concrete proof. Only after final combined design/motion approval move into the long-form storyboard/shot planning.

## Clock correction verification

ClockInsertV2Proof passed local 90-frame decode/metadata/audio checks and GitHub 1080p rendering: https://github.com/silentstophacking-dot/glm-animation/actions/runs/41858356847 . PR #40 preserves the correction. The 24-second phone review edit replaces only frames 450–539, passed 720-frame/video/audio verification, and is saved in handoff/review. Full LabTimeAnomalyV2 is manually renderable but has not been rendered as a new full master.

## Mini-scene verification

`LabTimeAnomaly` passed its 720-frame support/contact/clock audit, local phone MP4/audio checks and GitHub full-resolution render: https://github.com/silentstophacking-dot/glm-animation/actions/runs/41854780789 . Draft PR #39 and handoff/review preserve the 24-second movie and storyboard. Owner review remains pending.

## Latest verification

The new puffer performance passed local 720p decoding/metadata checks and GitHub’s full-resolution render/verification: https://github.com/silentstophacking-dot/glm-animation/actions/runs/41852035320 . Draft PR #38 and handoff/review preserve that result; the owner subsequently liked it.

## Verified results at handover

The latest room proof passed TypeScript, a 210-frame projection/support/parallax audit, extracted-frame review, full MP4 decode, expected frame count/dimensions/fps/duration, H.264/yuv420p/BT.709 and faststart. GitHub's 1080p run passed: https://github.com/silentstophacking-dot/glm-animation/actions/runs/41824949708

The combined performance passed its 330-frame reachability, world sole-anchor and post-transform/projected palm-contact audit; complete MP4 verification; and GitHub's 1080p run: https://github.com/silentstophacking-dot/glm-animation/actions/runs/41816462090

The archived black-puffer lab still remained pixel-identical after extracting reusable window/glassware artwork. Geometry audits support visual review; they do not prove natural acting or a full physical renderer.

## Transfer limits

A new ChatGPT account does not automatically inherit this conversation, memory, connector authorizations, uploads or execution workspace. Connect the new account to the same GitHub account/repository, or grant its chosen GitHub identity access. Do not share passwords or copy authentication tokens into prompts. Reconnect Google Drive if full reference videos require it.

The review files in `handoff/` are tracked Git files, so they do not depend on expiring Actions artifacts or old `/workspace/` links. Original full reference videos are not included; the [reference guide](handoff/REFERENCES.md) preserves supplied links and a few extracted comparison frames. A complete `.bundle` backup is also provided separately; it contains Git history and branches, not the former account's chat history or credentials.
