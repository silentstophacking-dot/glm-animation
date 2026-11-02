# EPISODE 01 — WHAT IF YOU COULD CONTROL PROBABILITY?

**Long-form production start • 3:50 (230s) • 6900 frames • 30 FPS • 1920×1080 landscape.**

**Current gate:** screenplay, shot map, engine integration and typechecks only. **DO NOT RENDER** until separately requested. The earlier short render and the minimalist coral-hoodie character are approved references; the old probability draft is not the new foundation.

## Premise and causal rule

One active probability setting at a time. Replacing `DEATH = 0%` with `ESCAPE = 100%` cancels protection. A guaranteed escape is not a guarantee of survival. The final shot freezes **before** any truck impact.

## Cinematography rule: prevent the drift issue

**Characters, furniture, architecture, road, and sky must live in coherent fixed world-space.** Each shot has ONE parent world-camera transform. Actor motion changes `Pose` as an action; camera movement changes the *one parent transform* (e.g., original `camT(cx,cy,z,960,540)`). No separate sliding of a static background to fake camera travel. Foreground occlusion and lighting provide depth; physically independent animation (rain, traffic, falling rubble) can move on its own when story-motivated. Distinct shot cuts create variety.

## 27-shot edit and provisional narration

| # | Timecode | Shot ID | Stage | Cinematography | Essential action | Narration |
|---|---|---|---|---|---|---|
| 1 | 00:00–00:08 | COLD_OPEN | cave | extreme close | Crushed under slab, eyes open, HUD: 0% death | He changed his chance of dying to zero. And then the ground swallowed him. |
| 2 | 00:08–00:15 | BURIED_PROMISE | cave | tight side | Fingers scrabble under debris; impossible contradiction | Pinned beneath concrete, he could still breathe. He just couldn't move. |
| 3 | 00:15–00:23 | FLASHBACK | study | wide establishing | Cut from dark cave to warmly lit perspective room | A few hours earlier, he had discovered the strangest ability imaginable. |
| 4 | 00:23–00:30 | FIRST_CONSOLE | interface | insert close | Single probability dial appears above desk | He could select any event and set its probability anywhere from zero to one hundred percent. |
| 5 | 00:30–00:38 | COIN_TOSS | study | medium to close | Hand follows coin from toss into the air; no detached props | So he tried something harmless. A coin toss. He chose heads: one hundred percent. |
| 6 | 00:38–00:45 | HEADS_RESULT | desk | high-angle macro | Coin lands on actual tabletop, two deliberate bounces | Heads. He flipped it again. Heads. |
| 7 | 00:45–00:53 | TEN_HEADS | desk | insert montage | Rapid earned repeat cutaways; tracker increments to ten | Ten flips, ten heads. Not luck. A guarantee. |
| 8 | 00:53–01:03 | LOTTERY_TEST | kiosk | over-shoulder | Ticket hands onto counter, mechanical numbers rotate | Then he tried a lottery ticket. Not because he needed the money. Because he wanted to know if there was a limit. |
| 9 | 01:03–01:11 | LOTTERY_WIN | kiosk | macro reveal | Ticket digits lock in; gold reflection touches face | The numbers matched. Every single one. |
| 10 | 01:11–01:19 | EUPHORIA | overlook | medium orbit cut | Person celebrates; subtle warning on lower HUD | It felt like he had found a cheat code for real life. But he missed the tiny warning on the screen. |
| 11 | 01:19–01:27 | ONE_ACTIVE_RULE | interface | clean schematic | Lottery guarantee crossed out when another selected | Only one probability can be controlled at a time. Change the target, and the old guarantee disappears. |
| 12 | 01:27–01:36 | DEATH_ZERO | study | medium low | UI target DYING counts to 0; ring forms around actor | He decided there was one setting more valuable than money: the chance of dying. Zero percent. |
| 13 | 01:36–01:44 | NEAR_MISS | city | side-medium | Street sign swings past physically; actor recoils then smirks | With that active, a falling sign missed his head by inches. He laughed instead of running. |
| 14 | 01:44–01:52 | WALK_HOME | street | wide tracking | Hero walks under lamps; rain catches moon glow | He was still celebrating as he headed home. |
| 15 | 01:52–02:01 | SITE_WARNING | street | wide to shoe insert | Heavy vehicle passes; warning barrier rattles; fissure begins | Rain soaked the street. A truck rolled past a construction site, and the pavement trembled under his shoes. |
| 16 | 02:01–02:10 | CRACK | street | low-angle insert | Cracks spread from shoe; hero tries to balance | He heard one sharp crack. Then another. The road began breaking apart beneath him. |
| 17 | 02:10–02:19 | FALL | sinkhole | high overhead to low | Ground opens; hero drops from visible surface below street | Before he could jump, the asphalt vanished. He fell into the darkness. |
| 18 | 02:19–02:29 | TRAPPED | cave | tight medium | Impact WITHOUT death or gore; slab pins legs; face clear | Rubble slammed down around him. Dust filled the air. When everything stopped, he realized the impossible: he was alive. |
| 19 | 02:29–02:39 | THE_LIMIT | cave | close and HUD cut | Death 0% stays illuminated while he struggles | His protection had worked. But it only prevented death. It didn't promise comfort, rescue, or freedom. |
| 20 | 02:39–02:47 | NO_RESCUE | cave | extreme tight | Three escalating efforts; boulder won't budge | He pushed against the concrete. Nothing moved. And nobody on the street could hear him. |
| 21 | 02:47–02:57 | ONE_PERCENT | interface | graphic macro | 100-square board, exactly one square lit | The interface gave him a number: the chance of escaping by himself. One percent. One outcome in a hundred. |
| 22 | 02:57–03:08 | BAD_CHOICE | cave | face close | Character studies old and new values, visibly hesitates | He could change it to one hundred. But he'd have to overwrite the protection keeping him alive. |
| 23 | 03:08–03:17 | OVERRIDE_DECISION | interface | controlled insert | One active slot; 0% death crossing out while escape rises | He stared at the choice. Stay buried and guaranteed alive? Or escape, with no guarantee of what happens next? |
| 24 | 03:17–03:25 | RUBBLE_MOVES | cave | low moving | Hand selects escape, rubble begins separating | He chose escape. One hundred percent. The zero-percent death protection vanished immediately. |
| 25 | 03:25–03:33 | LAUNCHED | sinkhole | wide physical | Lift, rotation, burst and coherent debris trajectory | The concrete shifted. A slab lifted. Something beneath him gave way, and he was thrown upward through the broken street. |
| 26 | 03:33–03:41 | HEADLIGHTS | street | truck POV cut | Hero lands into lane; truck approaches in fixed world geography | For one perfect second, it worked. He was free. Then he saw the headlights coming straight toward him. |
| 27 | 03:41–03:50 | PRE_IMPACT | street | freeze close | Freeze before impact, high contrast dark statement, no collision | His escape was guaranteed. His survival wasn't. Controlling one probability doesn't mean controlling what happens next. |

## Chapters

- **00:00–00:23 — Cold open / flashback.** Consequence first; then reset to discovery.
- **00:23–01:19 — Testing the power.** Coin demonstrations and lottery with physical continuity.
- **01:19–01:44 — The rule and false safety.** One active slot, 0% chance of dying.
- **01:44–02:47 — Disaster and confinement.** Rain, construction fault, sinkhole, failed escape.
- **02:47–03:17 — The choice.** 1% vs 100%; overwrites survival protection.
- **03:17–03:50 — Escape and twist.** Physical exit, oncoming truck, freeze pre-impact.

## Art and production constraints

- Keep the **coral-hoodie minimal SVG actor**: round near-black head, small off-white face, capsule limbs. No anime/photorealistic redesign.
- Reuse the verified original `Study` and stage kit and adapt/create additional landscape SVG streets, cave, lottery office and world-space props.
- Ensure table, coin, character hands and location use the same world coordinates; animate real contacts and shadows, not purely HUDs.
- Where possible add a motivated camera move (push-in on fear, overhead for fall, over-shoulder for ticket), but never slide the static environment separately from physical props.
- Audio is not synthesized and dialogue timings are estimates; actual narration must be recorded and aligned before a final master.
- Do not stretch existing 39-second animation to 3:50; each scene has new blocking/actions and its own shot staging.
- Final delivery should be a real MP4, but **rendering is deferred** by the user's explicit request.

## Quality gates

1. Verify screenplay and shot list (this stage).
2. Typecheck buildable 27-shot Remotion source WITHOUT rendering.
3. After authorization, inspect representative stills, then video motion for physically connected camera/object staging.
4. Record/align narration and SFX; master; final export only after explicit approval.
