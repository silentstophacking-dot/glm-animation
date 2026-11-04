#!/usr/bin/env python3
"""Deterministic ORIGINAL sound design for the 17s glass-reversal motion proof.
No third-party clips, voice recordings, or music. Python standard library only.
Generated only inside GitHub Actions; existing approved soundtracks are untouched.
"""
from array import array
import json
import math
import pathlib
import random
import struct
import wave

SAMPLE_RATE = 24000
DURATION = 17.0
COUNT = int(SAMPLE_RATE * DURATION)
TWO_PI = 2 * math.pi
samples = array("f", [0.0]) * COUNT
rng = random.Random(42017)
cues = [
    {"name": "quiet laboratory electrical bed", "at": 0.0},
    {"name": "bench impact / fractured glass", "at": 3.48},
    {"name": "glass fragments returning", "at": 6.12},
    {"name": "reverse suction and liquid return", "at": 9.85},
    {"name": "sealed rim ping", "at": 12.36},
    {"name": "coat breath / concerned reaction", "at": 13.48},
    {"name": "clock mechanism under wide reveal", "at": 15.58},
]

def add_ping(at: float, length: float, pitch: float, level: float, reverse: bool = False):
    """Inharmonic original glass cue with soft attack and decaying or growing envelope."""
    a = int(at * SAMPLE_RATE)
    n = int(length * SAMPLE_RATE)
    for j in range(n):
        i = a + j
        if not 0 <= i < COUNT:
            continue
        t = j / SAMPLE_RATE
        p = j / max(1, n - 1)
        envelope = (p ** 2.1) if reverse else (1 - p) ** 3.2
        envelope *= min(1, p * 90 + .01) if not reverse else min(1, (1 - p) * 55 + .01)
        partials = (
            math.sin(TWO_PI * pitch * t)
            + .41 * math.sin(TWO_PI * pitch * 1.607 * t)
            + .19 * math.sin(TWO_PI * pitch * 2.374 * t)
        )
        samples[i] += level * envelope * partials

def add_breath(at: float, length: float, strength: float, rising: bool = False):
    a = int(at * SAMPLE_RATE)
    n = int(length * SAMPLE_RATE)
    filtered = 0.0
    for j in range(n):
        i = a + j
        if not 0 <= i < COUNT:
            continue
        p = j / max(1, n - 1)
        swell = (math.sin(math.pi * p) ** 1.4)
        if rising:
            swell *= .45 + .55 * p
        filtered = .90 * filtered + .10 * (rng.random() * 2 - 1)
        v = .65 * filtered + .35 * math.sin(TWO_PI * (118 + 105 * p) * j / SAMPLE_RATE)
        samples[i] += strength * swell * v

# Low-level room / power hum. This is an atmosphere, not music.
for i in range(COUNT):
    t = i / SAMPLE_RATE
    edge = min(1.0, t / .2, (DURATION - t) / .35)
    samples[i] += edge * (.011 * math.sin(TWO_PI * 71.4 * t)
                        + .006 * math.sin(TWO_PI * 142.8 * t)
                        + .003 * math.sin(TWO_PI * 228.0 * t))

# A physical accident is heard before the reverse movement is understood.
add_ping(3.48, .82, 1273, .24)
add_ping(3.54, 1.08, 2045, .18)
add_breath(3.44, .55, .27)
# Distinct pieces, staggered as they seem to snap backward into glass.
for k, at in enumerate((6.12, 6.53, 7.04, 7.51, 8.14, 8.61, 9.02)):
    add_ping(at, .52, 1070 + 193 * k, .13, reverse=True)
add_breath(5.96, 3.62, .18, rising=True)
# Liquid draws back into the neck over the physical restoration.
add_breath(9.83, 2.8, .33, rising=True)
add_ping(12.28, .80, 1443, .12)
add_ping(12.33, 1.06, 2287, .09)
# Modulated, non-musical time pressure tied to the visible reconstruction.
for i in range(int(5.92*SAMPLE_RATE), int(12.65*SAMPLE_RATE)):
    t=i/SAMPLE_RATE-5.92
    p=min(1.0,t/1.0,(6.73-t)/.65)
    if p>0:
        phase=2*math.pi*(66*t+5*t*t)
        samples[i]+= .034*p*(math.sin(phase)+.23*math.sin(2.4*phase))
# Restrained motion cues after recognition (no unmotivated scare sting).
add_breath(13.46, .54, .08)
for at in (15.64, 16.18, 16.72):
    add_ping(at, .24, 733, .035)

# Preserve headroom and provide a short fade at both ends.
peak = max(abs(v) for v in samples)
gain = min(1.0, .72 / peak) if peak > 0 else 1.0
out = pathlib.Path("public/reversal-evidence")
out.mkdir(parents=True, exist_ok=True)
wav_path = out / "soundtrack.wav"
with wave.open(str(wav_path), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SAMPLE_RATE)
    pcm = bytearray(COUNT * 4)
    for i, v in enumerate(samples):
        val = int(max(-32767, min(32767, round(32767 * v * gain))))
        struct.pack_into("<hh", pcm, i * 4, val, val)
    w.writeframes(pcm)
manifest = {
    "duration_seconds": DURATION,
    "sample_rate": SAMPLE_RATE,
    "channels": 2,
    "peak_dbfs_estimate": round(20 * math.log10(max(1e-8, peak * gain)), 2),
    "original_synthesized": True,
    "music": False,
    "cues": cues,
}
(out / "soundtrack.json").write_text(json.dumps(manifest, indent=2) + "\n")
print(json.dumps({"file": str(wav_path), **manifest}, indent=2))
