# What If animation integration and next motion proof

User approved the slender character design; animation quality is not yet approved.

## Requested source
https://github.com/kelano86/what-if-animation
Inspected main tree 8092fb5e825e55456d1d47fec0ebf595cb93cc0d. The current project's SKILL.md, references/look.md, engine/anim.ts and core engine/rig.tsx have matching blob hashes to that upstream. This repository already contains its foundational engine; no replacement project or redundant engine import is needed. The existing MIT license is preserved.

Applied the linked skill's storyboard-first review, pure frame-derived motion, anticipation/hold/reaction beats, shared camera, visible lighting source, supported furniture and contact continuity. Reused the existing upstream kf, clamp and camT helpers directly. Read references/traps.md for disappearing limbs, unsupported props, unique SVG IDs and hand attachment pitfalls. Existing motiongrid.py remains available for the video review after the board is seen.

## Prepared sequence
Nine seconds / 270 planned frames: notice, load weight, three short steps, stop, reach, hold a console button, respond to its light, release and settle. SlenderCharacter now supports an optional physical pose; its previously approved static proportions and default drawings are preserved. Fixed-length leg and near-arm chains reject unreachable targets. World foot positions stay constant outside swing windows. Button and hand share an exact anchor during contact. All physical set objects share a camera transform. Four board panels use unique gradient IDs and show the wide notice, walking pose, closer contact and closer response.

## Validation
Typecheck, diff checks, per-frame reachability and hand-contact audit, plus actual rendered board review. The initial board showed excessive resting knee bend; leg lengths and weight-loading were corrected before the revised board. This is still a pose/motion prototype, not proof that the final gait looks natural at speed. World contacts and arm/leg reach are necessary but not sufficient visual checks.

## Review gate
SKILL.md says: “Storyboard before animation. No video render until the stills pass the self-check (step 5) and, when the person is in the loop, they've seen the board.” Step 5 also says to show the board and take notes before animating. Therefore this branch renders and uploads the storyboard only. Review these poses before the MP4 motion proof; no full film or new animation video is rendered in this change.

The source skill's episode-generation voice/script/sound stages are outside this isolated character-mechanics proof. No paid generation services invoked; ElevenLabs credits used: 0. No claim is made about how the source Ifverse videos were produced.

## Cinematic environment revision after board feedback
Compared the rendered board against the supplied Reaction Time 00:40 full-resolution frame. The reference uses luminous warm windows against a dark ceiling, a furnished bench, perspective, soft foreground glassware and selective focus. The first board was evenly shaded, nearly empty and uniformly sharp; it showed mechanics but did not establish the intended production look.

Replaced that board environment with an original layered SVG lab: recessed window and blinds, layered city silhouettes, softly blooming sunset, feathered light shafts, floor bounce, cabinet recess, supported workbench and glass apparatus, wall clock/chart, fine character rim light and defocused foreground bottles. Contact/reaction panels use tighter framing and selectively softer backgrounds. The physical console, table, character, shadows and foreground remain under one shared world camera; no independent background animation was introduced. Gradient/filter IDs remain unique per panel.

Approved character proportions and mechanics are unchanged. Typecheck passed and actual 1920×1230 board was rendered and inspected. This improves lighting, spatial hierarchy and scene dressing; it does not claim parity with the source footage's shot-specific illustration and motion performance. No video render or episode rebuild is included.
