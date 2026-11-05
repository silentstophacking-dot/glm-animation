import React from 'react';
import {AbsoluteFill,Audio,Composition,Sequence,registerRoot,staticFile} from 'remotion';
import {ProductionScene,SceneSpec} from './scene-system';
import {STARTER_FILM} from './starter-spec';
export type FilmPlan={id:string;fps:30;width:1920;height:1080;scenes:SceneSpec[];voiceover?:string};
export function validateFilm(plan:FilmPlan){
 if(!plan.id||!plan.scenes.length)throw Error('Film must have ID and scenes');
 const ids=new Set<string>();
 for(const s of plan.scenes){
  if(ids.has(s.id))throw Error('Duplicate scene id '+s.id);ids.add(s.id);
  if(!Number.isInteger(s.duration)||s.duration<1)throw Error('Invalid duration: '+s.id);
  if(s.kind==='world'){
   if(!s.camera.length||s.camera[0].frame!==0)throw Error('Camera must start at frame zero: '+s.id);
   if(s.camera.some((k,i)=>k.focal<=0||!Number.isFinite(k.x+k.y+k.z+k.focal)||(i>0&&k.frame<=s.camera[i-1].frame)))throw Error('Invalid camera: '+s.id);
   if(s.boxes.some(b=>b.width<=0||b.height<=0||b.depth<=0))throw Error('Invalid box: '+s.id);
  }
 }
 return plan.scenes.reduce((n,s)=>n+s.duration,0);
}
export const ProductionFilm:React.FC<{plan:FilmPlan}>=({plan})=>{
 let offset=0;return <AbsoluteFill style={{backgroundColor:'#101B2A'}}>{plan.scenes.map(s=>{const start=offset;offset+=s.duration;return <Sequence key={s.id} from={start} durationInFrames={s.duration}><ProductionScene spec={s}/></Sequence>})}{plan.voiceover&&<Audio src={staticFile(plan.voiceover)}/>}</AbsoluteFill>;
};
const frames=validateFilm(STARTER_FILM);
const Root=()=> <><Composition id="CinematicProductionStarter" component={ProductionFilm} defaultProps={{plan:STARTER_FILM}} durationInFrames={frames} fps={30} width={1920} height={1080}/><Composition id="CinematicProductionCheckpoint" component={ProductionScene} defaultProps={{spec:STARTER_FILM.scenes[1]}} durationInFrames={STARTER_FILM.scenes[1].duration} fps={30} width={1920} height={1080}/></>;
registerRoot(Root);
