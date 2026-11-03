#!/usr/bin/env python3
"""Generate a deterministic ORIGINAL Foley/SFX bed for Probability Control.

No stock audio, no third-party samples and no internet requests. Synthesize
noise, tones, transients and short mechanical sounds at measured story beats.
This is an AUDIO-ONLY operation; never launch Remotion or make a video.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
FPS = 24000
DURATION = 230
rng = np.random.default_rng(51515)


def env(n: int, attack: float = .02, decay: float = .13) -> np.ndarray:
    n = max(1, n)
    rise = max(1, min(n, int(FPS * attack)))
    fall = max(1, min(n, int(FPS * decay)))
    out = np.ones(n, dtype=np.float32)
    out[:rise] *= np.linspace(0, 1, rise, dtype=np.float32)
    out[-fall:] *= np.linspace(1, 0, fall, dtype=np.float32)
    return out


def noise(n: int, smooth: int = 1) -> np.ndarray:
    a = rng.standard_normal(n).astype(np.float32)
    if smooth > 1:
        # Moving average makes filtered grating, wind, and low stone rumble.
        kernel = np.ones(smooth, dtype=np.float32) / smooth
        a = np.convolve(a, kernel, mode="same")
        a *= np.sqrt(smooth)
    return a


def sine(n: int, hz: float, start: float = 0) -> np.ndarray:
    x = np.arange(n, dtype=np.float32) / FPS
    return np.sin(2 * np.pi * hz * x + start)


def clip_sound(kind: str) -> np.ndarray:
    """All signals are mono and peak-attenuated; separate from narration."""
    k = kind.lower()
    if any(w in k for w in ("coin", "metal-contact", "mechanical", "numbers-lock",
                             "grid-ticks", "short-celebration", "single-ui",
                             "slot-dismiss", "warning", "power-switch",
                             "probability-slider", "shield-engage", "airy-chime")):
        duration = .42 if "coin" in k or "contact" in k else .74
        n = int(FPS * duration)
        t = np.arange(n, dtype=np.float32) / FPS
        base = 880.0 if "coin" in k or "contact" in k else 425.0
        pitch = base * (1.0 + (.11 if "warning" not in k else -.12) * (t / duration))
        phase = 2 * np.pi * np.cumsum(pitch) / FPS
        bell = (.72 * np.sin(phase) + .18 * np.sin(phase * 2.06) +
                .06 * np.sin(phase * 3.14))
        strike = noise(n) * np.exp(-t * 35) * .17
        body = (bell * np.exp(-t * (7.5 if "coin" in k else 3.5)) + strike)
        return (body * env(n, .004, .08) * .22).astype(np.float32)

    if any(w in k for w in ("rumble", "earth", "ground", "stone",
                            "rock", "slab", "asphalt", "fracture",
                            "collapse", "dust", "grit", "pebble", "barrier")):
        duration = 1.7 if any(w in k for w in ("rumble","earth","collapse","slab")) else .74
        n = int(FPS * duration)
        t = np.arange(n, dtype=np.float32) / FPS
        grit = noise(n, 9)
        harmonic = .45 * sine(n, 46) + .20 * sine(n, 75)
        crack = noise(n, 2) * np.exp(-t * 13) * .4
        pulse = (grit*.52 + harmonic*.55 + crack) * np.exp(-t*.9)
        return (pulse * env(n, .018, .36) * .21).astype(np.float32)

    if any(w in k for w in ("engine", "truck", "brake", "walking", "steps",
                            "footstep", "metal-swing", "whoosh", "open-air")):
        duration = 1.9 if any(w in k for w in ("engine","truck")) else .8
        n=int(FPS*duration)
        t=np.arange(n,dtype=np.float32)/FPS
        gust=noise(n,11)*.34
        engine=(sine(n,62+8*(k.startswith("brake"))) *.38 +
                sine(n,112)*.14)
        out=gust+engine if "engine" in k or "truck" in k else gust
        if any(w in k for w in ("step","walking")):
            out=noise(n,4)*np.exp(-t*14)
        return (out*env(n,.05,.24)*.18).astype(np.float32)

    if "rain" in k:
        duration=3.1
        n=int(FPS*duration)
        t=np.arange(n,dtype=np.float32)/FPS
        # Soft filtered droplets with a very low amplitude floor.
        return ((noise(n,6)*.065+noise(n,2)*.018)*env(n,.28,.3)).astype(np.float32)

    if any(w in k for w in ("breath","air-tone","drone","pressure")):
        duration = 2.3
        n=int(FPS*duration)
        t=np.arange(n,dtype=np.float32)/FPS
        exhale=noise(n,18)*(.4+.6*np.sin(np.pi*t/duration)**2)
        if "drone" in k:
            exhale+=sine(n,55)*.30
        return (exhale*env(n,.32,.4)*.07).astype(np.float32)

    duration=.72
    n=int(FPS*duration)
    t=np.arange(n,dtype=np.float32)/FPS
    return ((noise(n,8)*.7+sine(n,220)*.10)*env(n,.01,.12)*.09).astype(np.float32)


def mix_in(track: np.ndarray, sound: np.ndarray, when: float, gain: float = 1):
    start = max(0, round(when * FPS))
    stop = min(len(track), start + len(sound))
    if stop > start:
        track[start:stop] += sound[:stop-start] * gain


def main():
    p=argparse.ArgumentParser()
    p.add_argument("--map",type=Path,
      default=ROOT/"production/probability-longform/EDITING_MAP.json")
    p.add_argument("--output",type=Path,
      default=ROOT/"out/probability-sfx")
    opts=p.parse_args()
    edit=json.loads(opts.map.read_text())
    assert edit["seconds"]==DURATION and len(edit["shots"])==27
    opts.output.mkdir(exist_ok=True,parents=True)
    track=np.zeros(DURATION*FPS,dtype=np.float32)
    events=[]

    # Long beds must be tied to a physical environment. Do not blanket
    # the narrator with an uninterrupted dramatic music-like drone.
    beds=[
        ("rain",104,139,.48),
        ("rain",205,221,.52),
        ("deep-stone-rumble",0,15,.22),
        ("deep-stone-rumble",139,150,.20),
        ("strained-breath",149,166,.20),
        ("low-drone",177,197,.18),
    ]
    for kind,start,end,volume in beds:
        pulse=clip_sound(kind)
        span=max(.1,len(pulse)/FPS-.2)
        pos=start
        while pos < end:
            # Trim beds hard at the END of the physical environment.
            allowed=int(min(len(pulse),(end-pos)*FPS))
            mix_in(track,pulse[:allowed],pos,volume)
            pos+=span
        events.append({"sound":kind,"at_sec":start,"duration_sec":end-start,"ambience":True})

    # Three physical action beats per shot; plan cues around those beats.
    # Avoid loading every repeated sound at the same start.
    for shot in edit["shots"]:
        cues=shot["soundDesign"]
        beats=shot["beats"]
        if shot["id"]=="PRE_IMPACT":
            # The world freezes: absolute silence BEFORE collision.
            continue
        for i,kind in enumerate(cues):
            when=beats[min(i,len(beats)-1)]["atSec"]
            volume=.55 if shot["id"] in ("COLD_OPEN","BURIED_PROMISE") else .78
            if "brake" in kind or "engine" in kind:
                volume=.53
            s=clip_sound(kind)
            mix_in(track,s,when,volume)
            events.append({"shot":shot["id"],"sound":kind,
                           "at_sec":round(when,3),"gain":volume})

    # Clamp and smooth the last sound so all SFX are silent at the 221s
    # pre-impact freeze. The narrator can speak over that silence.
    fade_begin=220.55
    fade_end=221.0
    a=int(FPS*fade_begin);b=int(FPS*fade_end)
    track[a:b]*=np.linspace(1,0,b-a,dtype=np.float32)
    track[b:]=0.0

    peak=float(np.max(np.abs(track)))
    # Independent master headroom (voice is separately mounted).
    if peak > .22:
        track*=.22/peak
    track=np.tanh(track*1.05).astype(np.float32)
    outwav=opts.output/"Probability_Original_Foley_230s.wav"
    with wave.open(str(outwav),"wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(FPS)
        wav.writeframes(np.round(np.clip(track,-.95,.95)*32767).astype("<i2").tobytes())

    mp3=opts.output/"Probability_Original_Foley_230s.mp3"
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y",
        "-i",str(outwav),"-codec:a","libmp3lame","-b:a","160k",
        str(mp3)],check=True)
    report={
        "source":"Synthesized purely from code; no copyrighted or stock audio used",
        "duration_sec":DURATION,"sample_rate":FPS,
        "events":events,"event_count":len(events),
        "peak":round(float(np.max(np.abs(track))),4),
        "silence_from_sec":221.0,
        "notes":"This is an optional SFX bed; it is not music and never replaces voice"
    }
    (opts.output/"sfx-cue-report.json").write_text(json.dumps(report,indent=2)+"\n")
    print(f"PASS: original {DURATION}s Foley track, {len(events)} events,"
          f" peak={report['peak']} and pre-impact silence after 221s.")


if __name__=="__main__":
    main()
