# CINEMATIC 2.5D STORYTELLING — STYLE BIBLE V1

**Project:** Original code-generated, character-led “What If?” stories (Remotion + SVG)
**Status:** Production specification, **not** proof of rendered quality
**Established from:** Four user-supplied Ifverse/IfverseTales reference videos studied through sampled frames; adapted into original artwork and animation rules. Measurements and timings below are **our production targets**, not measurements claimed to be used by the reference channel.

## 0. North star

Make each shot understandable with the sound off: one clear action, one clear character emotion, and one intended camera viewpoint. The style is *illustrated 2.5D cinema*: minimal black-headed figures, expressive limited animation, environments with physical depth, and diagram/map inserts that actually advance the narrative. **Do not trace, reuse, or replicate the reference channel's exact characters, scenes, or proprietary assets.**

## 1. Reference allocation

| Reference video | What we borrow as a technique (not copy as content) |
|---|---|
| *What If Your Reaction Time Was 10x Faster?* (7:13) | Readable silhouettes, clear limb poses, foreground staging, a balance of athletic physical action and quiet reactions |
| *What If You Used 500 IQ to Disappear?* (8:36) | Clean informative map/network shots, diagram-to-scene transitions, surveillance viewpoints, close-up object interactions |
| *What If You Woke Up in Kindergarten With All Your Memories?* (5:48) | Simple emotional faces, purposeful color contrast, recognizable everyday spaces, large clear explanatory graphic inserts |
| *What If One Second Felt Like Ten?* (6:47) | Restrained theatrical lighting, temporal diagrams, spotlight staging, quiet suspense and deliberate held frames |

Reference videos are approximately 1280×720 at 24fps. Our existing Remotion production remains **1920×1080 at 30fps** until a deliberate, full-timeline retiming decision. Use purposeful held drawings for limited animation instead of introducing inconsistent frame rates.

## 2. Character geometry and identity

**Normalized actor model: 100 units tall from head top to ground.** These target ratios are for the next rig, not a description of exact reference measurements.

- Head diameter: **24–27u**, near-black circular silhouette (slightly deformable on head yaw), center above shoulders.
- Neck: **2–4u**, partly hidden under clothing. Torso shoulder-to-hip length: **29–33u**.
- Legs: **38–44u** from hips through knees to ground; shoes: **5–7u** long along the ground plane.
- Arms: two linked segments (upper/lower) with visible elbow; wrist and small mitten-like hand; arm length should reach just below hip when relaxed.
- Shoulder width: **17–21u**. Distinct clothing silhouette from the head (hoodie collar and hem) without photorealistic anatomy.
- Character outlines at final 1280×720 image: approximately **2–4 px** at medium-shot scale, reduced for distant shots; avoid fuzzy or lumpy edges.
- Primary hero: near-black head, original muted ember/coral jacket, charcoal trousers, cream micro-face. Assign secondary cast **distinct silhouette + garment color + one accessory** (cap, lab coat, bag); never recolor the exact same silhouette to represent every role.
- All characters share a floor contact point at the feet. Never fake actor travel by shifting the room beneath stationary feet.

**Rig requirements:** head, torso, pelvis, near/far shoulders, elbows, wrists, knees, ankles, foot direction, eye direction and mouth state. Screen-facing 3/4 pose is preferred for interactions. A true turn must change head width, far-eye visibility, arm ordering, and clothing silhouette—not just slide the eyes across a circle. IK or explicit contact constraints must keep hands on carried props and feet on floors.

## 3. Expressive acting library

Expressions are minimal but deliberate. Use 2 eyes, up to 2 eyebrows, and 1 mouth mark; avoid busy facial drawings.

| Emotion | Head / shoulders | Face | Action cue |
|---|---|---|---|
| Curious | Head tilts **5–12°**, chest leans | Eyes widen/track object | Short lean or glance before interaction |
| Thinking | Head slightly down, near hand raised | Narrow eyes, closed mouth | Pause and then focus on a specific prop |
| Confident | Chest rises, grounded stance | Calm eyes, small smile | Decisive arm action, little unnecessary bounce |
| Shock | Head jerks back and holds | Wide eyes, small open mouth | Hands separate/stop; immediate freeze after recoil |
| Fear | Shoulders compress, asymmetric feet | Eyes track hazard, worried mouth | Protective arm, stagger, visible weight transfer |
| Relief | Shoulders fall, arms release | Soft smile, blink | Exhale / settle, not a generic waving loop |

Create original pose clips: `idle_attentive`, `walk_start`, `walk_cycle`, `walk_stop`, `reach_and_grasp`, `place_object`, `look_over_shoulder`, `explain_point`, `sit_and_listen`, `startle_and_recover`, `struggle_under_weight`, `stumble`, `fall`, `recover`, `freeze_before_impact`. Every named behavior requires a **start pose, middle/key action pose, and ending pose**, plus an explicit body weight/ground-contact rule.

### Motion timing targets (at 30 fps)

- Eye snap: **3–6 frames**; natural blink: **3–5 frames**.
- Anticipation before a hand or body action: **4–8 frames**.
- Main reach/point/turn: **9–18 frames**, with nonlinear easing.
- Contact/reaction: **1–3 sharp frames** followed by **7–15 frames** of settling/hold.
- Big fear/recoil: **5–12 frames**, then a visible pause before next decision.
- Normal walking: **22–28 frames per full gait cycle**, with alternating planted feet; avoid sliding.
- Idle breath moves torso by no more than **1–1.5% of height** and should not make feet/head float.
- Do **not** make every limb oscillate continuously on a sine wave. Animate only the body parts involved in the beat.

## 4. Camera grammar (camera must have a reason)

The current project has 27 shots with many automatic slow zooms. Replace generic zooms with directed shot types:

| Shot | Subject scale / visual use | Camera rule |
|---|---|---|
| Establishing wide | Show where the character is and what is dangerous | Static or a single 2–4s dolly; never pan for decoration |
| Medium action | Whole torso + relevant hands/prop | Locked or gentle follow maintaining hand-to-object continuity |
| Reaction close-up | Face/shoulders dominate, readable emotion | Locked or **1.0→1.08** motivated push on realization |
| Over-shoulder | Two people/one shared physical objective | Foreground silhouette and consistent eye line, no arbitrary layer slide |
| Object insert | Coins, phone, door handle, wheel, map | Hard cut to legible contact; follow the object, not the background |
| Low angle / threat | Weight, falling concrete, truck | Perspective from floor, strong overlap, deliberate pause |
| Diagram / map | Explain a choice, route, comparison or countdown | Camera locked on graphic; animate meaningful data, not decoration |

**Movement budget:** In most dialogue/reaction shots, camera translation is at most **0–8% of image width** over a shot and zoom at most **1.00–1.12×**. Stronger moves are reserved for falls, vehicle approach, reveals, or viewpoint changes. A static camera is not a failure.

**World anchoring is non-negotiable.** All physical objects have world coordinates. The camera moves through a single camera state (x, y, zoom). Parallax for distant/near layers is derived *only* from that same camera state and each layer’s assigned depth. Buildings, furniture and character-contact props never have independent decorative scrolling. If the camera is locked, every static layer is locked. A hand touching a desk and its shadow must stay physically connected under any allowed camera move.

## 5. 2.5D environment and lighting

Build scenes in depth groups from back to front:

1. **Far:** sky, horizon, distant buildings — camera translation influence ~**0.2–0.35**.
2. **Back:** walls, distant furniture — ~**0.45–0.7**.
3. **Interaction plane:** floors, table, door, near furniture, hero and props — **1.0**; use the exact same camera transform and shared anchor when touching.
4. **Front:** door frame, out-of-focus silhouette, railing — **1.15–1.35** relative movement when camera shifts.
5. **HUD:** screen-space overlays are intentionally **not** world objects and do not parallax.

Those factors are **starting presets**, not universal physical laws. Never use depth movement that causes objects on the same surface to separate. For camera rotations/perspective turns, draw distinct perspective-aware SVG layers; 2D translation alone is not a real 3D orbit.

**Light sources:** Establish one dominant real-world source (window, lamp, overhead cone, screen, streetlight). Warm inside rooms; cooler street/exterior fill. Use one soft contact shadow under planted feet and contacting objects. Use soft-edge glows very sparingly; faces and important props remain readable at mobile size. Keep backgrounds less contrasted than the action. Foreground blur is selective and should frame subjects rather than obscure plot information.

### Original palette (suggested targets)

| Role | Hex |
|---|---|
| Ink / black head | `#100E18` |
| Deep night navy | `#101725` |
| Plum interiors | `#282030` |
| Warm coral jacket | `#E35A45` |
| Warm spotlight gold | `#F2BF70` |
| Cool teal / active data | `#6DDBCC` |
| Cold background blue | `#749DBB` |
| Warm face/text | `#FFF2DE` |
| Risk / contradiction | `#E66B6A` |

Reserve bright gold/teal/red for the one active plot concept in the shot. Do not render every HUD, object, and edge glowing simultaneously.

## 6. Original storytelling and graphic language

- **One beat per shot:** what the viewer must notice, what changes, and how it changes the next shot.
- Every **2–5 seconds** there should generally be a new purposeful action, framing, reveal, or illustration. This is a pacing target, not a compulsory jump cut.
- First **3 seconds:** show a tangible strange consequence before explaining the power. Ask the question visually first.
- Consequence scenes must show character/object causality: **reach → touch → react → result**. No prop teleportation.
- Maps only appear when location, travel, pursuit, or reach matters. Animate route selection, node deletion, risk spread, or arrival, with a visible legend.
- Probability interface uses **one active guarantee**: prior guarantee dims/disappears when a new one is set. Show this explicitly in the physical scene, not only with text.
- Text and UI: short labels, **max two main text lines** on character footage; keep key text inside a **7% safe margin** on the 1920×1080 frame. Minimum critical text size **36–48 px** at 1920-wide export; test at 360–390px phone display.
- Maintain visual continuity for direction, lighting, garment, prop hand, location, and spatial scale across cuts.
- No fake action through repeated generic arm waves; animate a definite intention and an outcome.

## 7. Technical component architecture for SVG + Remotion

Build a library; do not hand-author a new rig for every shot:

- `CharacterRigV2`: normalized geometry, near/far limbs, consistent costume and face, stable foot anchor.
- `PoseTimeline`: key pose beats using state data, explicit start/key/end and deterministic frame interpolation.
- `ContactConstraint`: foot planting, prop hand attachment, chair-seat alignment, desk contact.
- `WorldCameraV2`: one physical camera state; all stationary geometry world-anchored; optional **camera-derived** depth factor.
- `DepthScene`: background/midground/interaction/foreground elements; each declared once in world space.
- `ShotGrammar`: wide, medium, close, OTS, POV, object insert, diagram shot.
- `ExplainerGraphic`: animated data decisions grounded in what happens in the story.
- `VisualContinuityQA`: automated source tests + contact-frame/keyframe screenshots + human motion inspection.

Keep the current Rewind sample, first Probability Control full render, audio stems, and older branches intact. Make redesigns on a new feature branch. The visual target is **original work inspired by techniques**, not a frame-for-frame clone.

## 8. Change list for the current Probability Control episode

**Critical:**

1. Upgrade `reference-hero.tsx` so head turns alter the silhouette and limbs articulate through intentional, planted poses, not just parametric tilts.
2. In `shots.tsx`, replace repetitive start→end camera pushes with specific locked/track/close/insert shots and enforce object hand contacts.
3. Split flat `worlds.tsx` stages into truly intentional near/mid/far groups while keeping the shared floor, furniture and body physically stationary.
4. Re-stage cave shots: concrete must visibly press on specific body parts, actor reacts against it, dust and debris fall according to cause; character must not look free-standing between rocks.
5. Give coin and lottery events close-ups plus character responses; a correct animation algorithm is not a sufficient emotional beat.
6. For the closing truck moment, make the threat readable through perspective/scale, character eye direction, and grounded road geometry, and freeze **before impact**.

**Secondary:** Improve the temporary English voice once visual staging is proved, redesign cluttered HUDs, and selectively replace scenes with clearer diagrams rather than adding more camera motion.

## 9. Acceptance gates — before another full episode

**Still images first:** Review five representative still frames: hero medium, hero face close-up, two-character interaction, hand/prop contact, and a high-depth wide scene. Check silhouette and readability on a phone.

**Motion checks on an actual sequence (once the stills are approved):**

- No foot drift while the actor is standing or braced (target **≤3 screen px** at 1280×720).
- A carried item remains attached to the hand (target **≤4 screen px** relative slip during intended contact).
- Fixed wall, chair and table have no independent screen drift except motion attributable to the camera/depth model.
- Every visible action has anticipation, clear impact/contact, and a hold/settle phase.
- Emotion is legible with the dialogue muted.
- No unmotivated camera zoom; no background moving under a camera explicitly marked locked.
- No abrupt pop-in of key props or body anatomy, no accidental limb layer swaps, no clipping off the intended frame.
- Essential story graphics remain legible on an iPhone-sized screen.

**Do not start another complete 3:50 render** until the above checkpoints pass human review. Technical tests are necessary, never proof that the animation looks good.

## 10. Working production brief (one paragraph)

> Build an original, cinematic, illustrated 2.5D world for code-generated “What If?” stories. Prioritize an expressive, readable black-headed character with original warm coral clothing, grounded body mechanics, purposeful shot choices, layered night/day locations, and sparse meaningful HUD/map visuals. The camera is driven by story intention; static objects remain anchored in world coordinates. Each action must show cause, contact, reaction, and consequence. Preserve simple shapes and cinematic atmosphere; avoid generic loops, busy overlays, automatic zooms, and full-film rendering before visual QA.