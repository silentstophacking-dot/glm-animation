import {characterV2At} from './episodes/probability-control/character-v2-motion';
import type {CharacterV2Pose} from './episodes/probability-control/character-v2-motion';
const ease=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t)};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
/** Story-specific acting based on the approved CharacterV2 joint/foot solver.
 * Feet remain grounded while the right glove moves toward the actual door lock.
 */
export function doorEthanPerformance(shot:number,frame:number):CharacterV2Pose{
 const f=Math.max(0,frame),base=characterV2At(135).pose;
 if(shot===0){
  const reach=ease(f/26)*(1-ease((f-48)/18));
  return {...base,hand:{x:mix(25,91,reach),y:mix(-155,-258,reach)},
   headTilt:mix(0,-8,ease((f-22)/35)),
   gaze:mix(0,1,ease(f/42)),gazeY:-1.4*reach,blink:Math.max(0,1-Math.abs(f-49)/3),
   lean:mix(0,-2.5,ease((f-49)/24))};
 }
 if(shot===1){
  const stop=ease(f/34);
  return {...base,hand:{x:mix(75,29,stop),y:mix(-225,-159,stop)},
   headTilt:mix(-8,9,stop),lean:mix(0,-5,stop),
   blink:Math.max(0,1-Math.abs(f-27)/3),gaze:1,gazeY:-2};
 }
 if(shot===2){
  const look=ease(f/75);
  return {...base,hand:{x:28,y:-159},headTilt:mix(7,-12,look),lean:mix(-2,3,look),
   gaze:-1,gazeY:-3.5,blink:Math.max(0,1-Math.abs(f-93)/3)};
 }
 if(shot===6){
  const turn=ease(f/95);
  return {...base,hand:{x:mix(32,60,turn),y:mix(-165,-184,turn)},
    headTilt:mix(-2,12,turn),lean:mix(0,-7,turn),
    gaze:mix(1,-1,turn),gazeY:mix(-1,-4,turn),
    blink:Math.max(0,1-Math.abs(f-105)/3)};
 }
 if(shot===7){
  const fear=ease(f/42);
  return {...base,hand:{x:mix(32,70,fear),y:mix(-160,-215,fear)},
   headTilt:mix(0,13,fear),lean:mix(0,-7,fear),surprised:true,
   gaze:-1,gazeY:-4};
 }
 return base;
}

/** The double is the same approved actor rig, with a restrained fearful gesture.
 * Its left hand lifts toward the eye-line during the photograph/warning beats.
 */
export function olderEthanPerformance(shot:number,frame:number):CharacterV2Pose{
 const base=characterV2At(135).pose;
 const t=ease((frame-(shot===3?28:7))/(shot===3?86:65));
 const nearHand={x:mix(29,65,t),y:mix(-153,-234,t)};
 const farHand={x:mix(-37,-60,t),y:mix(-155,-195,t)};
 return {...base,hand:nearHand,farHand,
   gaze:mix(.35,-.8,t),gazeY:mix(0,-2.7,t),
   headTilt:mix(-2,8,t),lean:mix(0,-3.5,t),
   blink:Math.max(0,1-Math.abs(frame-(shot===3?62:38))/3),
   surprised:false};
}

/** Two urgent grounded strides and a forward lean as Ethan crosses the door threshold. */
export function doorEscapePerformance(frame:number):CharacterV2Pose{
 const f=Math.max(0,frame),stride=characterV2At(Math.min(140,30+f*1.65)).pose;
 const forward=ease((f-3)/10)*(1-ease((f-49)/12));
 const swing=Math.sin(f*.23);
 return {...stride,
  lean:16*forward,headTilt:-8*forward,
  // Both wrists remain within the approved 60/61-unit two-bone arm reach.
  hand:{x:22+24*swing*forward,y:-175-16*forward+8*swing*forward},
  farHand:{x:-24-21*swing*forward,y:-184+8*swing*forward},
  farSwing:24*forward,shoeAngles:[12*forward,-11*forward],
  gaze:1,gazeY:-2*forward,surprised:f<32};
}
