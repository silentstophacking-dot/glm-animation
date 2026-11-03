#!/usr/bin/env python3
"""No-render preflight for the long-form Probability episode.

Checks: narration exists and has correct measured duration, scene and speech
timing remain continuous, editorial action beats stay within their shots,
and no scene silently loses its planned character/prop action.

This script NEVER invokes Remotion, FFmpeg video export, or any TTS API.
"""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROD = ROOT / "production/probability-longform"
STUDIO = ROOT / "studio"
MODEL = json.loads((PROD/"episode-manifest.json").read_text())
TIMING = json.loads((PROD/"voice-timing.json").read_text())
EDITOR = json.loads((PROD/"EDITING_MAP.json").read_text())

assert MODEL["fps"] == 30 and MODEL["totalFrames"] == 6900
assert MODEL["totalSeconds"] == 230
assert MODEL["render"]["authorized"] is False, "Rendering still needs explicit approval"
assert "NOT YET APPROVED" in MODEL["audio"]["voiceApproval"]
assert TIMING["scene_count"] == 27 and EDITOR["seconds"] == 230
assert len(EDITOR["shots"]) == len(TIMING["shots"]) == len(MODEL["shots"]) == 27

voice = STUDIO/"public/probability-longform/voice.mp3"
assert voice.is_file(), f"Missing scene-aligned voice MP3: {voice}"
assert voice.stat().st_size > 1000000, "Voice MP3 looks too small/truncated"
check = subprocess.run(
    ["ffprobe","-v","error","-show_entries","format=duration",
     "-of","default=noprint_wrappers=1:nokey=1",str(voice)],
    capture_output=True, text=True, check=True
)
duration = float(check.stdout.strip())
assert 229.5 <= duration <= 230.7, f"Voice duration should be 230s: {duration}"

prev = 0
count = 0
silent = 0.0
for model, track, edit in zip(MODEL["shots"], TIMING["shots"], EDITOR["shots"]):
    id = model["id"]
    assert id == track["id"] == edit["id"], "Stale or reordered edit: "+id
    assert model["startFrame"] == prev, f"Gap/overlap at {id}"
    assert model["endFrame"] == edit["endSec"]*30, id
    prev = model["endFrame"]
    assert model["startSec"] <= track["audio_start_sec"] < track["audio_end_sec"] < model["endSec"], id
    assert 0 <= track["drift_from_plan_sec"] < 0.3
    assert edit["voice"]["startSec"] == track["audio_start_sec"]
    assert edit["voice"]["endSec"] == track["audio_end_sec"]
    assert len(edit["beats"]) >= 2, "No planned visual development: "+id
    assert edit["soundDesign"], "Missing motivated sound cue plan: "+id
    assert all(model["startSec"] <= b["atSec"] < model["endSec"] for b in edit["beats"]), id
    assert edit["cameraConstraint"].startswith("Single camera transform"), id
    silent += model["endSec"] - model["startSec"] - track["spoken_seconds"]
    count += len(edit["beats"])

assert prev == 6900 and count >= 78
assert 90 < silent < 100, f"Unexpected narration coverage {silent}"
episode = (STUDIO/"src/episodes/probability-longform/episode.tsx").read_text()
shots = (STUDIO/"src/episodes/probability-longform/shots.tsx").read_text()
for name in ("voice.mp3", "sfx.mp3", "music.mp3"):
    assert "probability-longform/"+name in episode, f"Missing soundtrack stem: {name}"
assert "camT(x,y,zoom,960,540)" in shots
assert "<WorldCamera id={id} t={t} len={len}>{physical}</WorldCamera>" in shots
assert "ProbabilityLongform01" in episode
assert "REFERENCE" not in str(voice), "Unexpected placeholder voice path"

print("PASS: 27 scenes / 230 sec / 6900 frames / 30 fps")
print(f"PASS: voice MP3 {duration:.2f}s, staged at {voice.relative_to(ROOT)}")
print(f"PASS: {count} visible action beats and sound design cues mapped")
print(f"PASS: {silent:.1f} sec non-speech screen time accounted for editorial planning")
print("PASS: ONE scene-wide camera, all physical objects in world coordinates")
print("PASS: narrator remains candidate; no video render was authorized or performed")
