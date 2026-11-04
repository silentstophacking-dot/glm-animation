import React from 'react';
import {useCurrentFrame} from 'remotion';
import {camT} from '../../engine/anim';
import {SlenderMotionScene} from './slender-motion-board';
import {auditBalanced} from './slender-mechanics';
auditBalanced();
export const BalancedMotionProof:React.FC=()=>{
 const f=useCurrentFrame();
 // Deliberate cuts retain physical world coordinates and contact continuity.
 const camera=f<132?camT(960,540,1):f<174?camT(810,500,1.8):f<240?camT(770,395,2.05):camT(960,540,1);
 return <svg viewBox="0 0 1920 1080" width="100%" height="100%">
  <SlenderMotionScene frame={f} id="balanced-proof" camera={camera} build="balanced"/>
 </svg>;
};
