#!/usr/bin/env python3
"""Generate original English narration using offline Piper ONNX voices.

This script synthesizes AUDIO ONLY and never runs Remotion or renders video.
Uses an independently downloaded voice model (default en_US-joe-medium,
dataset CC0 per the model card). No ElevenLabs credentials or API calls.

Inputs:  production/probability-longform/episode-manifest.json (27 lines)
Outputs: artifacts/full-narration.mp3 + WAV rough stem + clip WAVs and report.

The rough-aligned stem is an editorial DRAFT. It does not claim word timings
or complete synchronization until the recorded/synthesized words are timed.
"""
from __future__ import annotations

import argparse
import json
import math
import subprocess
import wave
from pathlib import Path

import numpy as np
from piper.voice import PiperVoice

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "production/probability-longform/episode-manifest.json"


def sample_wav(path: Path) -> tuple[np.ndarray, int]:
    with wave.open(str(path), "rb") as wav:
        assert wav.getnchannels() == 1, f"Expected mono PCM in {path}"
        assert wav.getsampwidth() == 2, f"Expected 16-bit PCM in {path}"
        rate = wav.getframerate()
        pcm = np.frombuffer(wav.readframes(wav.getnframes()), dtype="<i2")
    return pcm.astype(np.float32) / 32768.0, rate


def write_wav(path: Path, samples: np.ndarray, rate: int):
    path.parent.mkdir(parents=True, exist_ok=True)
    pcm = np.round(np.clip(samples, -0.98, 0.98) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(pcm.tobytes())


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    p.add_argument("--voice-model", type=Path, required=True)
    p.add_argument("--output", type=Path, default=ROOT / "out/probability-voice")
    args = p.parse_args()

    manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    shots = manifest["shots"]
    assert len(shots) == 27 and manifest["totalSeconds"] == 230
    assert not manifest["render"]["authorized"], "This stage must not render video."

    args.output.mkdir(parents=True, exist_ok=True)
    clips_dir = args.output / "per-shot"
    clips_dir.mkdir(exist_ok=True)
    voice = PiperVoice.load(str(args.voice_model))
    rate = None
    clip_data = []
    for i, shot in enumerate(shots):
        line = shot["voice"].strip()
        assert line, f"Missing narration for {shot['id']}"
        audio_path = clips_dir / f"{i+1:02}_{shot['id']}.wav"
        with wave.open(str(audio_path), "wb") as audio_file:
            voice.synthesize_wav(line, audio_file)
        data, sample_rate = sample_wav(audio_path)
        if rate is None:
            rate = sample_rate
        if sample_rate != rate:
            raise ValueError("Piper returned mismatched WAV sample rates")
        clip_data.append(data)
        print(f"{i+1:02}/27 {shot['id']} {len(data)/rate:.2f}s"
              f" (scene allowance {shot['endSec']-shot['startSec']}s)", flush=True)

    assert rate is not None
    # This complete spoken version has natural pauses between lines,
    # independent of the preplanned shot durations.
    silence_ms = 250
    silence = np.zeros(round(rate * silence_ms / 1000), dtype=np.float32)
    continuous = np.concatenate(
        [item for i, clip in enumerate(clip_data)
         for item in ([clip, silence] if i < len(clip_data)-1 else [clip])]
    )
    write_wav(args.output / "narration-continuous.wav", continuous, rate)

    # The scene-aligned rough voice stem prioritizes intelligibility:
    # if a line exceeds its shot duration, let the NEXT narration wait,
    # never overlap the voices or speed them up invisibly.
    intended_frames = round(manifest["totalSeconds"]*rate)
    rough = np.zeros(intended_frames+round(100*rate), dtype=np.float32)
    timing = []
    tail = 0
    pad = round(.18*rate)
    for shot, clip in zip(shots, clip_data):
        intended = round(shot["startSec"]*rate)+pad
        start = max(intended, tail + round(.12*rate))
        end = start + len(clip)
        if end > len(rough):
            rough = np.pad(rough, (0, end-len(rough)+rate))
        # Tiny 8 ms fade for clean, click-free junctions.
        samples = clip.copy()
        fade = min(len(samples)//4, round(rate*.008))
        if fade:
            samples[:fade] *= np.linspace(0,1,fade)
            samples[-fade:] *= np.linspace(1,0,fade)
        rough[start:end] += samples
        timing.append({
            "id":shot["id"],
            "planned_start_sec":shot["startSec"],
            "planned_end_sec":shot["endSec"],
            "audio_start_sec":round(start/rate,3),
            "audio_end_sec":round(end/rate,3),
            "spoken_seconds":round(len(clip)/rate,3),
            "drift_from_plan_sec":round(start/rate-shot["startSec"],3),
            "crosses_cut":end/rate > shot["endSec"]
        })
        tail = end

    length=max(intended_frames,tail+round(.5*rate))
    write_wav(args.output / "narration-rough-aligned.wav",rough[:length],rate)

    # Compact iPhone-friendly audio-only exports, no video.
    exports=[
        ("narration-continuous.wav","Probability_Narration_Full.mp3",False),
        ("narration-rough-aligned.wav","Probability_Narration_230s_Rough_Aligned.mp3",False),
        ("narration-rough-aligned.wav","Probability_Narration_Intro_30s.mp3",True)
    ]
    for input_name,output_name,clip in exports:
        cmd=[
            "ffmpeg","-hide_banner","-loglevel","error","-y",
            "-i",str(args.output/input_name)
        ]
        if clip:
            cmd.extend(["-t","30"])
        cmd.extend(["-codec:a","libmp3lame","-b:a","128k",
                    "-ar","44100",str(args.output/output_name)])
        subprocess.run(cmd,check=True)

    report={
        "engine":"Piper local CPU TTS",
        "model":args.voice_model.name,
        "voice_language":"en_US",
        "note":"Not ElevenLabs and not the same voice as the pre-existing Rewind file",
        "video_generated":False,
        "original_voice_render_seconds":round(len(continuous)/rate,3),
        "rough_aligned_seconds":round(length/rate,3),
        "scene_count":len(shots),
        "scenes_crossing_next_cut":sum(x["crosses_cut"] for x in timing),
        "max_start_drift_seconds":max(round(x["drift_from_plan_sec"],3) for x in timing),
        "timestamp_truth":"Scene timings measured from generated PCM; no word-level timings claimed",
        "shots":timing
    }
    (args.output/"timing-report.json").write_text(
        json.dumps(report,indent=2)+"\n",encoding="utf-8"
    )
    print(json.dumps({k:v for k,v in report.items() if k!="shots"},indent=2),flush=True)


if __name__ == "__main__":
    main()
