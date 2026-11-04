"""Original deterministic synthesis for the silent-story proof; no paid/generated assets.
Run from repository root after bundling/running the motion audit:
 python3 scripts/build-lab-anomaly-audio.py studio/out/time-anomaly-audit.json
The cue positions come from the same retimed animation used in Remotion.
"""
import json, sys, wave, subprocess, argparse
from pathlib import Path
import numpy as np
parser=argparse.ArgumentParser();parser.add_argument('audit');parser.add_argument('--output-dir',default='studio/public/lab-time-anomaly');args=parser.parse_args()
cues=json.loads(Path(args.audit).read_text())
rate=48000; duration=cues['frames']/30
rng=np.random.default_rng(4701)
t=np.arange(round(rate*duration))/rate
mix=np.zeros((len(t),2),dtype=np.float64)
activation=cues['activationFrame']/30
# Low mechanical room tone. A small dip before the click makes the action readable.
bed=.009*np.sin(2*np.pi*55*t)+.003*np.sin(2*np.pi*110*t)
duck=1-.68*np.exp(-((t-(cues['buttonFrame']/30-.15))/.5)**2)
mix[:,0]+=bed*duck; mix[:,1]+=bed*duck*.9

def add(at,signal,gain=1,pan=0):
 start=round(at*rate); n=min(len(signal),len(t)-start)
 if start<0 or n<=0:return
 mix[start:start+n,0]+=signal[:n]*gain*np.sqrt((1-pan)/2)
 mix[start:start+n,1]+=signal[:n]*gain*np.sqrt((1+pan)/2)

def noise(length,cut=14):
 n=rng.normal(0,1,round(length*rate));return np.convolve(n,np.ones(cut)/cut,mode='same')

for f in cues['stepFrames']:
 u=np.arange(round(.24*rate))/rate
 heel=np.sin(2*np.pi*(80*u-35*u*u))*np.exp(-u*29)
 add(f/30,heel+noise(.24,20)*np.exp(-u*23)*1.5,.17,-.15)
 add(f/30-.13,noise(.22,45)*np.sin(np.linspace(0,np.pi,round(.22*rate)))**2,.025,-.15)
# Quiet inquisitive notes stop before the decision; leave the turn space.
for at,hz in [(0.8,293.66),(2.5,440),(6.9,349.23)]:
 u=np.arange(round(1.1*rate))/rate
 add(at,np.sin(2*np.pi*hz*u)*np.exp(-u*4)*np.minimum(u*60,1),.022,.25)
# Clothing rustle follows the reach and sudden recoil.
cloth=cues.get('clothSeconds',[9.1,12,18.6])
for i,at in enumerate(cloth):
 gain=.06 if i==1 else (.035 if i==2 and 'clothSeconds' not in cues else .03)
 u=np.linspace(0,np.pi,round(.55*rate));add(at,noise(.55,55)*np.sin(u)**2,gain,-.15)
u=np.arange(round(.09*rate))/rate
add(cues['buttonFrame']/30,(noise(.09,3)+.35*np.sin(2*np.pi*170*u))*np.exp(-u*85),.22,.1)
u=np.arange(round(.5*rate))/rate
add(activation,np.sin(2*np.pi*(580*u-340*u*u))*np.exp(-u*10),.065,.1)
# Same audible clock source changes from forward ticks to a quicker reversed double-tick.
clock_events=[]
for at in np.arange(.5,activation,1):
 u=np.arange(round(.045*rate))/rate
 add(float(at),noise(.045,2)*np.exp(-u*130),.045,-.7);clock_events.append(float(at))
for at in np.arange(activation+.3,duration-.6,.4):
 u=np.arange(round(.08*rate))/rate
 sig=noise(.08,3)*np.exp(-u*65)
 # Brief suction-like pre-attack then tick; original synthesized effect, not sampled foley.
 add(float(at)-.08,sig[::-1],.055,-.7)
 add(float(at),sig,.07 if 15<=at<18 else .045,-.7);clock_events.append(float(at))
# Restrained low impact marks the discovery rather than a loud horror sting.
u=np.arange(round(1.7*rate))/rate
add(12,np.sin(2*np.pi*(48*u-5*u*u))*np.exp(-u*3)*np.minimum(u*45,1),.08)
fade=np.minimum(t/.25,1)*np.minimum((duration-t)/.65,1)
mix*=fade[:,None]
peak=float(np.max(np.abs(mix)))
assert np.isfinite(mix).all() and peak<.9
path=Path(args.output_dir)/'soundtrack.m4a';path.parent.mkdir(parents=True,exist_ok=True);tmp=path.with_suffix('.wav')
with wave.open(str(tmp),'wb') as w:
 w.setnchannels(2);w.setsampwidth(2);w.setframerate(rate);w.writeframes((mix*32767).astype('<i2').tobytes())
subprocess.run(['ffmpeg','-y','-v','error','-i',str(tmp),'-af','loudnorm=I=-22:TP=-1.5:LRA=8','-ar',str(rate),'-c:a','aac','-b:a','192k','-movflags','+faststart',str(path)],check=True)
tmp.unlink()
path.with_suffix('.json').write_text(json.dumps({'duration':duration,'sampleRate':rate,'peakBeforeMaster':peak,'masterTargetLUFS':-22,'truePeakTargetDBTP':-1.5,'buttonFrame':cues['buttonFrame'],'activationFrame':cues['activationFrame'],'stepFrames':cues['stepFrames'],'clothSeconds':cloth,'clockTickSeconds':clock_events,'source':'original seeded procedural synthesis; no voice or external recordings'},indent=2)+'\n')
print('Built',path,'duration',duration,'peak',peak)
