import {defineEpisode, Timeline, ShotInfo} from '../../engine';
import {LONGFORM_SHOTS,LONGFORM_FPS,LONGFORM_TOTAL_FRAMES} from './shotplan';
import {longformShotMap} from './shots';

/**
 * A 3:50 landscape (16:9) What If? animated film.
 * All 27 visual sequences exist in code. The staged, still-to-be-reviewed Piper narrator
 * voice is mounted at studio/public/probability-longform/voice.mp3.
 * Source checkout includes the staged voice asset; narration approval is still pending.
 *
 * IMPORTANT: Registering a composition does not render/export a video.
 * Do not add a video render workflow until the owner explicitly approves it.
 */
const segments=LONGFORM_SHOTS.map(s=>({
  shot:s.id,a:s.start,b:s.end,t0:0,t1:s.end-s.start,line:s.voice
}));
const sceneInfos:ShotInfo[]=LONGFORM_SHOTS.map(s=>({
  id:s.id,
  size:s.stage==='interface'?'graphic insert':
    s.stage==='desk'?'macro':
    s.stage==='cave'?'tight and confined':
    s.stage==='street'?'cinematic roadway':'wide/medium',
  key:Math.max(0,Math.floor((s.end-s.start)*.62)),
  len:s.end-s.start,
  first:s.start,
  line:s.voice,
  note:'One coherent world-space parent camera. Distinct scene staging.'
}));

export const longformTimeline:Timeline={
  slug:'what-if-probability-longform-01',
  title:'WHAT IF YOU COULD CONTROL PROBABILITY? — 3:50 LONG FORM',
  fps:LONGFORM_FPS,
  total:LONGFORM_TOTAL_FRAMES,
  segments,
  shots:sceneInfos,
  fx:[
    {f:121*30+68,kind:'shake',amp:5,len:20},
    {f:130*30+41,kind:'shake',amp:15,len:22},
    {f:139*30+18,kind:'flash',color:'#D9E4F2',o:.25},
    {f:197*30+88,kind:'shake',amp:9,len:17},
    {f:205*30+65,kind:'shake',amp:16,len:26},
    {f:221*30,kind:'flash',color:'#F2E4D0',o:.2}
  ],
  // Candidate English Piper voice. The 230s bed is timed to the 27 scene starts
  // from measured PCM and contains intentional quiet gaps for visual acting.
  // Render uses ONE finished, loudness-balanced audio track. Keeping
  // voice.mp3, sfx.mp3 and music.mp3 separately in studio/public preserves
  // individual edit control without DOUBLE-MIXING them during rendering.
  // All three stems are original/candidate, not final user-approved sound.
  audio:{
    voice:'probability-longform/master.mp3',voiceVol:1
  }
};

export const probabilityLongform01=defineEpisode('ProbabilityLongform01',{
  timeline:longformTimeline,
  shots:longformShotMap,
  width:1920,height:1080,
  grain:true,vignette:true,bg:'#0D1020'
});
