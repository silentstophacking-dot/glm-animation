# Storyboard visual review — 2026-11-06

Source: GitHub Actions run 42144774090, artifact 13470120487, seven PNG checkpoints and 57.8667s silent H.264 MP4. The initial CI run failed **only** because ffprobe was missing, after successful rendering. The workflow has since been patched to install FFmpeg.

## Actual frame inspection
- 3s: character stands stationary in a sparse corridor. No clear hand-to-lock action or knocking door movement.
- 16s: character remains in same pose and same location. Acting not adequate for a suspense scene.
- 25s: peephole shows the door and a red slash, **not an older recognizable Ethan**. Major story beat absent.
- 34s: photograph is flat iconography with two black silhouettes, not credible physical evidence.
- 47s: the turn-around is not actually animated; hallway unchanged.
- 54s: scene darkens, but no creature reveal or physically convincing threat.
- 57s: RUN text appears but Ethan has not run through the door; the promised payoff is absent.

**Visual verdict: REJECTED AS FINAL.** This is a timing/blocking prototype only. The production master renders correctly, but the scene-specific acting, aged character, prop work and physical payoff are still missing.

## Mandatory next implementation
1. Implement a door leaf with a real hinge transform, moving latch and knocking displacement. Key-hand acting in the approved rig.
2. Older Ethan must be a visible aged variation of the existing puffer character, with scar and gray hair, not text or a slash.
3. Photograph should show the actual recognizable corridor, Ethan and a tall figure, not generic blocks.
4. Stage character turn, faceless figure reveal, and final run with grounded foot movement and door closure.
5. Upgrade hall materials and camera coverage to approved Clock Discovery / Glass Reversal quality.
6. Re-time cuts against actual narration waveform and verify all voiceover beats. A local rough preview can mux audio but that does not make the animation finished.
7. Do not label or publish as final until seven checkpoints pass visual inspection and narrated MP4 is checked.
