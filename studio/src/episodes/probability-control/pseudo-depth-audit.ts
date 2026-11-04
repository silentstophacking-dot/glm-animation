import {auditDepth} from './pseudo-depth-camera';
import {characterV2At} from './character-v2-motion';
import {CinematicCharacterV2} from './cinematic-character-v2';
export function auditDepthCharacter(){
 const result=auditDepth();
 for(let f=0;f<180;f++){
  const view=.15+.8*f/179,state=characterV2At(166);
  const pose={...state.pose,hand:{...state.pose.hand,y:state.pose.hand.y+3.5/1.5},yaw:view};
  // Pure component construction evaluates the same limb solvers used by the render.
  CinematicCharacterV2({id:'depth-audit',x:720,y:886.5,scale:1.5,pose,bodyYaw:view,shadow:false});
 }
 return {...result,characterViewsChecked:180};
}
