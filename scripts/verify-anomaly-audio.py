"""Verify this proof has the intended AAC soundtrack, safe levels and aligned cue metadata."""
import json, pathlib, subprocess, sys, re
root=pathlib.Path(sys.argv[1]);meta=json.loads((root/'composition.json').read_text())
movie=next(root.glob('*.mp4'))
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-of','json',str(movie)],text=True))
audio=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert audio['codec_name']=='aac' and int(audio['channels'])==2
assert abs(float(audio['duration'])-24)<.1
assert abs(float(audio.get('start_time',0)))<.05
assert meta['durationInFrames']==720 and meta['fps']==30
cues=json.loads(pathlib.Path('studio/public/lab-time-anomaly/soundtrack.json').read_text())
audit_path=root/'anomaly-audit.json'
assert audit_path.exists(), 'Run motion audit to verify audio sync'
audit=json.loads(audit_path.read_text())
for key in ['buttonFrame','activationFrame']:
 assert abs(cues[key]-audit[key])<.001, (key,cues[key],audit[key])
assert all(abs(a-b)<.001 for a,b in zip(cues['stepFrames'],audit['stepFrames'],strict=True))
r=subprocess.run(['ffmpeg','-hide_banner','-i',str(movie),'-vn','-af','volumedetect','-f','null','-'],capture_output=True,text=True,check=True)
peak=float(re.search(r'max_volume: ([-\d.]+) dB',r.stderr).group(1))
assert -30<peak<-.1, peak
report={'aacStereo':True,'duration':float(audio['duration']),'peakDBFS':peak,'cueSync':'button, activation and all three footfalls match motion audit'}
(root/'audio-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(report)
