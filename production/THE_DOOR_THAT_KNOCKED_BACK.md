# THE DOOR THAT KNOCKED BACK — PRODUCTION HANDOFF

## Approved technical foundation
Base branch: `feature/reusable-cinematic-production-pipeline`.
Use `CharacterTurnV5`, black puffer outfit, `pseudo-depth-camera.ts`, fixed-world scene construction, and approved Clock Discovery / Glass Reversal reference tests.
Do not use generic placeholder SVG scenes as finished artwork.

## Actual supplied narration
User supplied `Generated Audio November 05, 2026 - 8_50PM.wav` on 2026-11-05.
Original audio duration measured by ffprobe: **61.880 s**.
To meet under-60s, apply ffmpeg `atempo=1.07`, yielding **57.8445 s** while preserving pitch.
The narration file is in the conversation sandbox, **not yet committed to GitHub**. Do not claim a final narrated GitHub render without uploading this audio.

## Story and timed edit (57.845s / 1736 frames at 30fps)
- 0.0–5.5: Exterior apartment door 213; three knocks from inside; Ethan reaches for key
- 5.5–13.0: He has not unlocked door; voice whispers 'Don't open it'; physical reaction
- 13.0–20.0: Recognizes his own voice; peephole push-in
- 20.0–29.0: Aged Ethan visible inside; same recognizable face, scar across eye
- 29.0–38.0: Photograph shows Ethan in hallway with faceless figure behind him
- 38.0–44.5: Older Ethan: 'I opened the door. That's how it got in.'
- 44.5–50.0: Ethan turns; empty hall; lights fail
- 50.0–55.5: Three knocks behind him; figure revealed close
- 55.5–57.845: Older Ethan shouts 'RUN!' and opens door; Ethan rushes in; door slams

These are preliminary visual edit ranges; refine against the WAV's spoken phrase timing during editing, rather than assuming line-by-line alignment.

## Visual acceptance
1. Detailed materials and lighting at least equal to approved Clock Discovery 24s and Glass Reversal 17s tests.
2. World-space door, corridor, picture frame, character and camera; no sliding props.
3. Puffer outfit; aged version of same rig with scar and graying hair.
4. Peephole lens and photograph are story-specific effects; maintain visual coherence.
5. Satisfying action payoff: Ethan escapes through door as creature reaches.
6. Review stills at 3, 16, 25, 34, 47, 54, 57 seconds before final render.
7. Verify H.264 MP4 and AAC audio, full decode, narration sync, duration under 60 seconds.

## Audio
Master narration: 61.880s. Target pitch-preserved speed-up 1.07x: 57.8445s.
No generated background music in voice track. Add original atmospheric sound and knocks separately during editing.
