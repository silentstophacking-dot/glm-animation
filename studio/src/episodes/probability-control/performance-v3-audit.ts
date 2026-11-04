import {auditPerformanceV3,performanceV3At,performanceCamera,PERFORMANCE_FRAMES} from './performance-v3-motion';
import {CinematicCharacterV2} from './cinematic-character-v2';
import {projectWorld} from './pseudo-depth-camera';
import {BUTTON} from './slender-mechanics';
export function auditPerformanceRig(){
 const result=auditPerformanceV3();let maxProjectedContact=0;
 for(let f=0;f<PERFORMANCE_FRAMES;f++){
  const s=performanceV3At(f),pose={...s.pose,hand:{...s.pose.hand,y:s.pose.hand.y+3.5/1.5}};
  try{CinematicCharacterV2({id:'performance-audit',x:s.x,y:886.5,scale:1.5,pose,bodyYaw:pose.torsoYaw,headYaw:pose.yaw,mood:s.mood,shadow:false});}
  catch(e){throw new Error('Rendered rig frame '+f+': '+String(e));}
  if(f>=180&&f<=221){
   const c=performanceCamera(f);
   const a=projectWorld({x:BUTTON.x+.7*s.press-960,y:885-BUTTON.y-1.4*s.press,z:0},c);
   const b=projectWorld({x:s.x+pose.hand.x*1.5-960,y:885-(886.5+pose.hand.y*1.5),z:0},c);
   maxProjectedContact=Math.max(maxProjectedContact,Math.hypot(a.x-b.x,a.y-b.y));
  }
 }
 if(maxProjectedContact>.001)throw new Error('Projected press contact drift');
 return {...result,maxProjectedContact,renderedRigFramesChecked:PERFORMANCE_FRAMES};
}
