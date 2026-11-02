#!/usr/bin/env python3
"""Original, deterministic audio-only soundscape for Probability Control.

This file uses no downloaded effects, third-party music, paid TTS, or 3D tools.
The film remains exactly 230 seconds; sound is generated from physical event
cues in our approved screenplay. The narrator is the approved original Piper
MP3 already staged at studio/public/probability-longform/voice.mp3.

Produces:
  Probability_Story_Sound_Mix.mp3 (full 3:50 audio-only review)
  Probability_Opening_40s.mp3
  Probability_Ending_45s.mp3
  effects.wav, ambient_music.wav, sound-cues.json

No video generation; no Remotion commands. Intended to be REVIEWED and revised
before the stems are connected to the animated episode.
"""
from __future__ import annotations
import argparse
import json
import math
import subprocess
import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfilt, chirp

ROOT = Path(__file__).resolve().parents[1]
SR = 24000
DURATION = 230
N = SR * DURATION
RNG = np.random.default_rng(1267)
TAU = 2 * np.pi


def shaped_noise(n: int, low: float = 0, high: float = 0) -> np.ndarray:
    x = RNG.standard_normal(n).astype(np.float32)
    if low and high:
        sos = butter(2, [low, high], btype="bandpass", fs=SR, output="sos")
    elif high:
        sos = butter(2, high, btype="lowpass", fs=SR, output="sos")
    elif low:
        sos = butter(2, low, btype="highpass", fs=SR, output="sos")
    else:
        return x
    return sosfilt(sos, x).astype(np.float32)


def env(n: int, attack: float = .02, release: float = .30) -> np.ndarray:
    a = max(1, min(n // 2, int(SR * attack)))
    r = max(1, min(n // 2, int(SR * release)))
    e = np.ones(n, dtype=np.float32)
    e[:a] = np.sin(np.linspace(0, np.pi / 2, a)) ** 2
    e[-r:] = np.cos(np.linspace(0, np.pi / 2, r)) ** 2
    return e


sfx = np.zeros(N, dtype=np.float32)
amb = np.zeros(N, dtype=np.float32)
events: list[dict] = []


def add(buf: np.ndarray, at: float, wave_data: np.ndarray,
        gain: float, label: str = ""):
    start = int(round(at * SR))
    if start < 0:
        wave_data = wave_data[-start:]
        start = 0
    end = min(len(buf), start + len(wave_data))
    if end > start:
        buf[start:end] += wave_data[:end - start] * gain
    if label:
        events.append({"sec": round(at, 2), "event": label, "gain": gain})


def tex(at: float, duration: float, low: float, high: float,
        gain: float, into: np.ndarray = sfx, label: str = ""):
    n = max(2, round(duration * SR))
    x = shaped_noise(n, low, high)
    x *= env(n, .4, .5)
    add(into, at, x, gain, label)


def impact(at: float, strength: float = 1, label: str = "impact"):
    n = int(.95 * SR)
    sec = np.arange(n) / SR
    f = 62 * np.exp(-4.3 * sec) + 35
    phase = TAU * np.cumsum(f) / SR
    boom = np.sin(phase) * np.exp(-5.4 * sec)
    grit = shaped_noise(n, 80, 2300) * np.exp(-7.2 * sec)
    x = (boom * .58 + grit * .20) * env(n, .006, .04)
    add(sfx, at, x.astype(np.float32), strength, label)


def crack(at: float, strength: float = 1, label: str = "concrete snap"):
    n = round(.66 * SR)
    sec = np.arange(n) / SR
    snap = shaped_noise(n, 420, 8500) * np.exp(-18 * sec)
    chips = shaped_noise(n, 190, 1700) * np.exp(-6.3 * sec)
    for d in (.05, .12, .24, .33):
        j = int(d * SR)
        amt = .15 + RNG.random() * .16
        snap[j:] += shaped_noise(n-j, 650, 6500) * np.exp(-22 * sec[:n-j]) * amt
    add(sfx, at, (snap * .53 + chips * .16).astype(np.float32),
        .8 * strength, label)


def beep(at: float, f: float = 710, length: float = .28,
         intensity: float = .9, label: str = "probability UI"):
    n = round(length * SR)
    t = np.arange(n) / SR
    sweep = f * (1 + .15 * (1-t/length))
    phase = TAU * np.cumsum(sweep) / SR
    a = np.sin(phase) + .17 * np.sin(2*phase) + .06 * np.sin(3*phase)
    a *= env(n, .008, length*.65)
    add(sfx, at, a.astype(np.float32), .11*intensity, label)


def coin(at: float, pitch: float = 1, strength: float = 1):
    n = round(.71 * SR)
    t = np.arange(n) / SR
    partials = (
        np.sin(TAU*1015*pitch*t)*np.exp(-14*t)
        + .35*np.sin(TAU*1633*pitch*t)*np.exp(-22*t)
        + .25*np.sin(TAU*2210*pitch*t)*np.exp(-28*t)
    )
    scratch = shaped_noise(n, 650, 7000) * np.exp(-44*t)
    x = (partials*.55 + scratch*.22)*env(n, .002, .09)
    add(sfx, at, x.astype(np.float32), .18*strength, "coin landing")


def sweep(at: float, duration: float = .85, strength: float = 1,
          label: str = "fast air"):
    n = round(duration*SR)
    t = np.arange(n)/SR
    nse = shaped_noise(n, 100, 6000)
    e = np.sin(np.pi*np.clip(t/duration,0,1))**2
    a = (nse*.12)*e
    add(sfx, at, a.astype(np.float32), strength, label)


def engine(at: float, duration: float, strength: float = 1,
           label: str = "approaching truck"):
    n = round(duration * SR)
    t = np.arange(n)/SR
    rise = .35 + .65 * (t / max(duration, .01))**1.6
    rpm = 42 + 28*np.sin(t*1.25) + 24*t/max(duration,.01)
    phase=TAU*np.cumsum(rpm)/SR
    x = (.62*np.sin(phase)+.38*np.sin(2*phase)+
         .11*np.sin(3*phase) + .05*shaped_noise(n, 85, 1250)) * rise
    x *= env(n, .48, .28)
    add(sfx, at, x.astype(np.float32), strength*.14, label)


def bass(at: float, duration: float, f0: float=73,
         strength: float=1, label: str="suspense"):
    n=round(duration*SR)
    t=np.arange(n)/SR
    tri=np.sin(TAU*f0*t) + .25*np.sin(TAU*(f0*1.5)*t)
    noise=shaped_noise(n, 26, 290)
    pulse=(.78+.22*np.cos(TAU*1.6*t))
    x=(tri*.14+noise*.13)*pulse*env(n,.35,.65)
    add(amb,at,x.astype(np.float32),strength,label)


def music_section(at:float, duration:float, root:float,
                  strength:float=.8):
    n=round(duration*SR)
    t=np.arange(n)/SR
    phases=[TAU*f*t for f in (root, root*1.5, root*2.0)]
    layer=sum(np.sin(p+0.05*np.sin(t*1.5+i))*k for i,(p,k) in
              enumerate(zip(phases,[.6,.27,.15])))
    airy=shaped_noise(n, 420, 1700) * .09
    e=env(n,1.5,2.0)
    wav=(layer*.035 + airy*.017)*e
    add(amb,at,wav.astype(np.float32),strength)


def world_bed(at:float, duration:float, name:str):
    n=round(duration*SR)
    if name=="rain":
        a=shaped_noise(n, 430, 7800)*.07
        b=shaped_noise(n, 80, 570)*.025
        wav=(a+b)*env(n,.25,.4)
        add(sfx,at,wav.astype(np.float32),.55,"rain and distant traffic")
    elif name=="cave":
        a=shaped_noise(n, 28, 330)*.032
        b=shaped_noise(n, 650, 4200)*.013
        add(sfx,at,(a+b).astype(np.float32)*env(n,.30,.35),
            .48,"muffled cave air")
    elif name=="room":
        a=shaped_noise(n, 45, 480)*.018
        add(sfx,at,a.astype(np.float32)*env(n,.4,.5),
            .35,"interior room tone")
    elif name=="city":
        a=shaped_noise(n, 150, 2400)*.024
        add(sfx,at,a.astype(np.float32)*env(n,.4,.5),
            .28,"city night air")


def voice_decode(path:Path) -> np.ndarray:
    data=subprocess.run([
      "ffmpeg","-v","error","-i",str(path),"-ac","1","-ar",str(SR),
      "-f","f32le","pipe:1"
    ],check=True,capture_output=True).stdout
    pcm=np.frombuffer(data,dtype="<f4").copy()
    if len(pcm)>N: pcm=pcm[:N]
    return np.pad(pcm,(0,N-len(pcm))).astype(np.float32)


def wav_write(path:Path, samples:np.ndarray):
    x=(np.clip(samples,-.99,.99)*32767).astype("<i2")
    with wave.open(str(path),"wb") as out:
        out.setnchannels(1)
        out.setsampwidth(2)
        out.setframerate(SR)
        out.writeframes(x.tobytes())


def encode(wav:Path,mp3:Path,ss:float|None=None,d:float|None=None):
    cmd=["ffmpeg","-hide_banner","-loglevel","error","-y"]
    if ss is not None:cmd += ["-ss",str(ss)]
    cmd += ["-i",str(wav)]
    if d is not None:cmd += ["-t",str(d)]
    cmd += ["-af","alimiter=limit=0.86:level=0",
            "-codec:a","libmp3lame","-b:a","144k",str(mp3)]
    subprocess.run(cmd,check=True)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--manifest",type=Path,
        default=ROOT/"production/probability-longform/episode-manifest.json")
    parser.add_argument("--voice",type=Path,
        default=ROOT/"studio/public/probability-longform/voice.mp3")
    parser.add_argument("--output",type=Path,
        default=ROOT/"out/probability-soundscape")
    args=parser.parse_args()
    manifest=json.loads(args.manifest.read_text())
    assert manifest["totalSeconds"]==230 and len(manifest["shots"])==27
    args.output.mkdir(parents=True,exist_ok=True)

    # Scene ambience always corresponds to an actual story space.
    for shot in manifest["shots"]:
        # The last image freezes before impact. No ambient sound restarts
        # over the final spoken line; that silence is the actual payoff.
        if shot["id"] == "PRE_IMPACT":
            continue
        start=shot["startSec"]
        duration=shot["endSec"]-start
        stage=shot["stage"]
        if stage in ("study","desk","interface"):
            world_bed(start,duration,"room")
        elif stage in ("street","city","sinkhole"):
            world_bed(start,duration,"rain")
        elif stage=="cave":
            world_bed(start,duration,"cave")
        else:
            world_bed(start,duration,"city")

    # Deliberate music beds: restraint in the cave, energy in discovery.
    for at,length,root,gain in [
        (0,23,55,.46), (15,68,82.4,.48),(77,57,65.4,.42),
        (132,59,55,.42),(181,35,58.3,.45),(213,8,41.2,.72)
    ]:music_section(at,length,root,gain)

    # Story-motivated, sub-second cues.
    impact(.3,.8,"opening underground collapse")
    tex(1.8,1.8,70,350,.27,label="falling dust")
    crack(8.4,.35,"rock shifting by pinned hand")
    beep(23.4,610,.44,.85,"probability interface appears")
    beep(29.2,930,.17,.45,"setting selected")
    sweep(32.6,.45,.46,"first coin flick")
    coin(38.7,1.0,1.0)
    coin(42.0,1.02,.85)
    for i in range(10):
        coin(45.5+i*.72, 1+.025*((i*3)%5), .42)
    sweep(55.1,.6,.24,"lottery ticket slides")
    beep(64.2,530,.24,.48,"lottery numbers start")
    for k in range(4):
        beep(65.4+k*.33,800+k*120,.22,.65,"lottery digit locks")
    beep(70.8,1080,.65,.95,"lottery win confirmation")
    beep(79.4,330,.61,.77,"one active setting warning")
    beep(88.1,570,.28,.65,"protection setting")
    bass(89.1,4.7,75,.67,"0% protection activation")
    beep(95.1,1090,.65,1.0,"survival protection locks")
    sweep(98.1,.68,.68,"falling sign passes his head")
    crack(99.3,.48,"sign hits street")
    engine(113.0,7.0,.78,"heavy truck past construction")
    crack(121.7,.78,"first street fissure")
    crack(125.5,1.12,"second street fissure")
    bass(126,8,49,.75,"road begins giving way")
    sweep(131.2,2.1,.9,"character falls into sinkhole")
    impact(136,1.0,"underground rock impact")
    crack(139.7,.92,"slab lands")
    tex(140,4,70,2200,.25,label="concrete debris settling")
    crack(160.1,.40,"first failed rubble push")
    crack(163.7,.38,"second failed rubble push")
    beep(167.9,670,.52,.82,"escape probability interface")
    beep(177.3,330,.59,.5,"warning of unsafe override")
    bass(183,11,47,.71,"consequences build")
    beep(190.0,650,.28,.62,"choice cursor")
    beep(195.2,1000,.58,.86,"escape set to 100 percent")
    beep(197.2,220,.90,1.10,"protection removed")
    bass(198,12,48,1.0,"rubble pressure rises")
    crack(203.2,.72,"slab splits upward")
    impact(206.0,1.0,"explosive release")
    sweep(208.1,1.7,.86,"character propelled upward")
    engine(213.1,8.2,1.28,"truck approaching character")
    sweep(219.2,1.1,.78,"truck air and brakes")
    # No collision impact; only the narrator is heard after the freeze.
    assert not [e for e in events if e["sec"]>=221]

    voice=voice_decode(args.voice)
    # Normalize stem RMS against spoken narration (not the silent pads).
    voiced=voice[np.abs(voice)>.008]
    vrms=float(np.sqrt(np.mean(voiced*voiced))) if len(voiced) else .10
    sxrms=float(np.sqrt(np.mean(sfx*sfx)))
    amrms=float(np.sqrt(np.mean(amb*amb)))
    scale_s=.42*vrms/max(sxrms,1e-9)
    scale_m=.23*vrms/max(amrms,1e-9)
    # Safety ceiling: strongly accented sfx remain audible but not louder than VO.
    scaled_s=sfx*min(scale_s,1.3)
    scaled_m=amb*min(scale_m,1.5)
    # No music or effects during the last 9s twist: finish on the words.
    ending=min(220*SR,N)
    fade=int(.9*SR)
    for stem in (scaled_s,scaled_m):
        stem[ending:ending+fade]*=np.linspace(1,0,fade,dtype=np.float32)
        stem[ending+fade:]=0

    mix=voice+scaled_s+scaled_m
    peak=float(np.max(np.abs(mix)))
    if peak>.83:mix*=.83/peak
    wav_write(args.output/"effects.wav",scaled_s)
    wav_write(args.output/"ambient_music.wav",scaled_m)
    wav_write(args.output/"story-mix.wav",mix)
    encode(args.output/"story-mix.wav",
        args.output/"Probability_Story_Sound_Mix.mp3")
    encode(args.output/"story-mix.wav",
        args.output/"Probability_Opening_40s.mp3",0,40)
    encode(args.output/"story-mix.wav",
        args.output/"Probability_Ending_45s.mp3",185,45)
    report={
        "type":"original procedural sound design, AUDIO ONLY",
        "clip_seconds":DURATION,"event_count":len(events),
        "sound_effects_rms":round(sxrms,5),
        "narrator_rms":round(vrms,5),
        "finished_max_absolute_peak":round(float(np.max(np.abs(mix))),4),
        "copyright":"All sound effects and ambient music synthesized here from noise, sine waves and procedural envelopes.",
        "video_generated":False,
        "all_cues":[*events]
    }
    (args.output/"sound-cues.json").write_text(json.dumps(report,indent=2)+"\n")
    print(json.dumps({k:v for k,v in report.items() if k!="all_cues"},indent=2),flush=True)


if __name__=="__main__":
    main()
