import {balancedAt,auditBalanced,limb,SlenderPose,BUTTON,XY} from './slender-mechanics';
import {kf} from '../../engine/anim';
export type CharacterV2Pose=SlenderPose & {lean?:number;yaw?:number;farSwing?:number;shoeAngles?:[number,number];torsoYaw?:number;farHand?:XY;blink?:number;gaze?:number};
export function characterV2At(f:number){
 const state=balancedAt(f),feet=state.pose.feet;
 // Lift the pelvis over the support leg instead of holding a crouch for the walk.
 let drop=0;
 feet.forEach((foot,i)=>{const dx=foot.x-(i?8:-8);drop=Math.max(drop,foot.y+146-Math.sqrt(142*142-dx*dx));});
 drop+=kf(f,[[0,0],[20,0],[26,3],[34,0],[269,0]]);
 const swing=(state.near.x-state.far.x-37.5)/100*kf(f,[[20,0],[28,1],[116,1],[124,0]]);
 const angle=(a:number,b:number)=>f>a&&f<b?10*Math.sin(2*Math.PI*(f-a)/(b-a)):0;
 const reach=kf(f,[[132,0],[162,1]])*(1-kf(f,[[202,0],[228,1]]));
 const pose:CharacterV2Pose={...state.pose,drop,hand:{x:state.pose.hand.x+6*(1-reach),y:state.pose.hand.y+(drop-state.pose.drop+10)*(1-reach)},
  lean:kf(f,[[0,0],[20,1],[30,3],[110,3],[124,0],[145,4],[166,4],[184,-3],[202,-3],[234,0]]),
  yaw:kf(f,[[0,.3],[24,.8],[132,.85],[174,.85],[184,.2],[230,.25],[250,.65]]),
  farSwing:10*swing,shoeAngles:[angle(56,90),f<80?angle(28,62):angle(88,116)]};
 return {...state,pose};
}
export function v2HandLocal(pose:CharacterV2Pose):XY{
 const a=-(pose.lean??0)*Math.PI/180,c=Math.cos(a),s=Math.sin(a);
 const x=pose.hand.x,y=pose.hand.y-pose.drop+146;
 return {x:x*c-y*s,y:x*s+y*c-146};
}
export function auditCharacterV2(){
 auditBalanced();
 let contactError=0,maxDrop=0;
 for(let f=0;f<270;f++){
  const {x,pose}=characterV2At(f);maxDrop=Math.max(maxDrop,pose.drop);
  pose.feet.forEach((foot,i)=>limb({x:i?8:-8,y:-146+pose.drop},foot,72));
  const tip=v2HandLocal(pose),dx=tip.x-17,dy=tip.y+271,d=Math.hypot(dx,dy);
  limb({x:17,y:-271},{x:tip.x-dx/d*11,y:tip.y-dy/d*11},61,-1);
  limb({x:-15,y:-269},{x:-23+(pose.farSwing??0),y:-153},60,-1);
  if(f>=162&&f<=202){
   const a=(pose.lean??0)*Math.PI/180,c=Math.cos(a),s=Math.sin(a);
   const world={x:x+(tip.x*c-(tip.y+146)*s)*1.5,y:890+(tip.x*s+(tip.y+146)*c-146+pose.drop)*1.5};
   contactError=Math.max(contactError,Math.hypot(world.x-BUTTON.x,world.y-BUTTON.y));
  }
 }
 if(contactError>.001)throw new Error('V2 palm contact drift '+contactError);
 return {frames:270,contactError,maxDrop};
}
