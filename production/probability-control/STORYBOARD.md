# Episode 01: WHAT IF YOU COULD CONTROL PROBABILITY?
**Approved:** dark, pre-impact truck freeze ending  
**Status:** stage 4-5, original-skill storyboard awaiting render and visual review  
**Composition:** `ProbabilityControl` / `ProbabilityControlBoard`  
**39 seconds | 1170 frames | 30 fps | portrait 1080 × 1920**  
**Original codebase:** kelano86/what-if-animation, MIT license

## The rule that makes the ending work
The hero can control **exactly one event's probability at a time**. Selecting a new event deletes the previous guarantee. An escape can be certain while being safe is not. This is a fictional power; the only mathematical fact used is 1% = 1/100, which is not proof of actual supernatural probability manipulation.

## Storyboard / 19 shots (about 28 cuts a minute)

| Shot | Frames | Time | Angle | Read / action | Planned spoken line |
|---|---:|---|---|---|---|
| S1 | 0–59 | 0–2s | Extreme macro UI | Death probability falls from 100% to 0 | He made his chance of dying zero. |
| S2 | 60–119 | 2–4s | Medium character | Pip smiles; ominous warning | Big mistake. |
| S3 | 120–179 | 4–6s | High macro | Spinning gold coin | What if you could control probability? |
| S4 | 180–239 | 6–8s | Low medium | Heads again and reaction | A coin flip? Always heads. |
| S5 | 240–299 | 8–10s | Lottery insert | Digits spin | Winning the lottery? |
| S6 | 300–359 | 10–12s | Medium reaction | Big win, Pip celebrates | Every single time. |
| S7 | 360–419 | 12–14s | Wide title | Power title card | But here's the catch. |
| S8 | 420–479 | 14–16s | Schematic insert | New selection erases old | Only one probability can change at once. |
| S9 | 480–539 | 16–18s | Low medium | Shielded character, 0% | So he makes dying impossible. |
| S10 | 540–599 | 18–20s | Rainy city wide | Quiet walk past streetlights | That night, he walks home. |
| S11 | 600–674 | 20–22.5s | Low wide | Road fractures | Suddenly, the street gives way. |
| S12 | 675–734 | 22.5–24.5s | High moving | Character falls into hole | He drops straight into darkness. |
| S13 | 735–809 | 24.5–27s | Trapped close | Rubble encloses Pip; death = 0 | Buried under concrete. Still alive. |
| S14 | 810–869 | 27–29s | Top-down schematic | Exactly 1 of 100 squares lit | His chance of escaping? One percent. |
| S15 | 870–929 | 29–31s | UI insert | Escape 100%, protection crossed out | He changes it to one hundred. His protection disappears. |
| S16 | 930–989 | 31–33s | Low medium | Rubble levitates | The rubble begins to move. |
| S17 | 990–1049 | 33–35s | Wide high-angle | Debris launches Pip onto street | It launches him into the street. |
| S18 | 1050–1109 | 35–37s | Tracking low | Oncoming headlights rush closer | Right into an oncoming truck. |
| S19 | 1110–1169 | 37–39s | Freeze | **No impact shown.** Clear warning conclusion. | He guaranteed his escape. Not his survival. |

## Genuine skill integration
- **Formula:** premise, escalating wins, consequence, and dark final turn from `references/formula.md`
- **One rig:** the real `Hero` component with `LOOKS.pipHood`, `poseAt`, `faceAt`, original lighting filters
- **Shared engine:** `defineEpisode`, `Episode`, `Board`, time segments, `LookDef`, `fx`, film grain/vignette
- **Shot vocabulary:** alternating wide, macro, insert, low, high, and close, with camera motion via `camT` and `kf`
- **Reusable kit:** `NightSky`, `Bokeh`, `Schematic`, `CountUp`-style HUD, `HudChip`, `FocusRings`, `DrawOn`; new sets/props in `engine/sets/probability.tsx`
- **Script metadata:** `episode.json` and provisional `words.json` for the native planner
- **Plan:** `scripts/plan.py` creates shot list and `timeline.json`
- **Storyboard:** `scripts/stills.mjs` and `scripts/board.py`, patched to preserve aspect ratio for portrait
- **Animation / sound / master:** pending storyboard review, narration and sound. Existing `motiongrid.py`, `mixcheck.py`, `master.py` are preserved for subsequent stages.

## Audio truthfulness and the remaining gates
The current `words.json` contains **editorially estimated timestamps**, NOT timestamps from synthesized speech. These are used solely to make the first storyboard and to list provisional lines. The original `voice.py` will overwrite them when actual permitted voice audio and an ElevenLabs API key are supplied, or we can align manually to an original narration track. No ElevenLabs key is stored in the repo or supplied to Actions, and there is no invented cost report.

The `sound` section describes events for the original `sfx.py` but sound is **not generated yet**. Do not run `sfx.py` without authorisation for a connected service. Do not master until a legitimate voice and sound mix exists; `master.py` expects real audio for the -14 LUFS pass.

## Board gate (required before a video master)
1. Trigger the `Probability Skill Storyboard` GitHub workflow on this feature branch.
2. Run `scripts/plan.py`, TypeScript check, `scripts/stills.mjs`, then `scripts/board.py`.
3. Download the 19 individual stills and a contact sheet from the artifact. Check every panel using `references/look.md` 11-point checklist: legibility on phone, camera variation, light sources, pose, continuity, crowding.
4. Re-render failed stills before authorising the video render.
5. After visual approval, render a low-res motion preview, inspect it with `motiongrid.py`, then arrange narration, audio events and mastering.

## Preserved
- `Rewind` and `CopyPaste` assets, scripts and their original compositions
- Original `studio/src/studio.config.ts` landscape dimensions for both sample episodes
- Original `test-render.yml` workflow on the main branch
- The previous standalone prototype `studio/src/episodes/probability-control.tsx` remains available as a rollback reference but is no longer the registered composition
