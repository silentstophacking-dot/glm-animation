# WHAT IF YOU COULD CONTROL PROBABILITY?
**Episode 01 — Storyboard & production brief**  
**Approved ending:** Dark twist (freeze before the truck hits)  
**Visual style:** original, cinematic 2D SVG stick-figure animation, dark indigo, teal probability HUD, gold successes, red warning  
**Master composition:** `ProbabilityControl` | **1080 × 1920** | **30 fps** | **39 seconds** (1,170 frames)  
**Storyboard composition:** `ProbabilityControlBoard` | 10 key frames  

## The one rule
The character may set the probability of **one specific event** at a time. Choosing a new event immediately overwrites the old setting. Guaranteeing escape is **not** the same as guaranteeing survival. The final truck shot ends *before* impact: no gore and no implied confirmed outcome beyond the danger.

## Locked scene list

| Time | Frames | Shot | Story and composition | Intended voiceover |
|---|---:|---|---|---|
| 00:00–00:03 | 0–89 | Hook | Huge death-chance meter counts down to zero. Red BIG MISTAKE warning, character below. | “He made his chance of dying zero. Big mistake.” |
| 00:03–00:06 | 90–179 | Coin | Gold coin rotates and bounces. 100% HEADS HUD. | “Imagine controlling probability. A coin flip? Always heads.” |
| 00:06–00:09 | 180–269 | Lottery | Digits spin until all four are sevens. The character celebrates. | “Winning the lottery? Guaranteed.” |
| 00:09–00:13 | 270–389 | Rule | Two probability cards: the second replaces the first. Red rule panel. | “But there’s a rule. Only one probability at a time.” |
| 00:13–00:16 | 390–479 | Protection | Character inside a shield, death meter descends to 0%. | “So he sets his chance of dying to zero.” |
| 00:16–00:22 | 480–659 | Collapse | Night city, rain, pavement splits, camera holds as character drops underground. | “That night, the street suddenly collapses beneath him.” |
| 00:22–00:27 | 660–809 | Buried | Cramped underground frame with concrete slabs. Death chance still 0%. | “He’s buried under concrete. But somehow, he’s alive.” |
| 00:27–00:32 | 810–959 | Choice | Escape chance rises from 1% to 100%. Old 0% protection visibly crossed out. | “His escape chance is one percent. He makes it one hundred. And loses his protection.” |
| 00:32–00:35 | 960–1049 | Escape | Concrete scatters. Figure launched out. “HE’S FREE!” reads clearly. | “The rubble blasts him out. He’s free!” |
| 00:35–00:39 | 1050–1169 | Payoff | Truck approaches on road; freeze before collision. Final three-line caption. | “Straight into a truck’s path. He guaranteed escape. Not survival.” |

**Narration status:** script locked; **voice track not yet recorded or timed**. The current render is a **silent motion previsualization**, not a finished narrated episode. Adjust the clip timings only after recording/reviewing the voice.  
**Sound design plan:** simple original tick on edits, gold coin impact, lottery hit, rain and rumble, blast, truck approach, abrupt silence on freeze. No paid audio services required for visual preview.  
**Story principle:** fun use → clear limitation → attempt to cheat → consequence.  

## Production / review checklist
- [x] Preserve Rewind and CopyPaste original source files and landscape compositions
- [x] Independent vertical component with a consistent 2D character and color palette
- [x] Ten shot keyframes available as a Remotion storyboard composition
- [ ] TypeScript / Remotion compilation verified in GitHub Actions
- [ ] Ten keyframe stills visually reviewed for readability and continuity
- [ ] Low-resolution silent motion preview reviewed for cuts and pace
- [ ] Revisions to character action, truck staging and visual detail
- [ ] Record/sync narration, add audio, inspect final vertical export
- [ ] Full-resolution 1080 × 1920 mastered MP4

## Rendering
From `studio/`:
```bash
npm ci
npx tsc --noEmit
npx remotion render src/index.ts ProbabilityControl out/probability-preview.mp4 --codec=h264 --scale=0.5 --concurrency=2
npx remotion still src/index.ts ProbabilityControlBoard out/storyboard-01.png --frame=0 --scale=0.35
```
Run the GitHub workflow `Probability Animation Preview` for automated compilation, contact stills, silent video and downloadable artifacts. It is intentionally separate from the existing `Test Animation Render` workflow.

## Notes
This is fictional probability manipulation, not a claim about real-world physics. No image/video generation or ElevenLabs key is required for this draft. The preview exports at **540 × 960** for faster iteration; the registered composition is still **1080 × 1920** for the final master.
