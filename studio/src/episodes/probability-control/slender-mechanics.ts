import {kf,clamp} from '../../engine/anim';
export type XY={x:number;y:number};
export type SlenderPose={drop:number;feet:[XY,XY];hand:XY;headTilt:number;surprised:boolean};
export function limb(a:XY,b:XY,length:number,bend=1){
 const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
 if(d<.001||d>2*length)throw new Error('Unreachable slender limb: '+d);
 const h=Math.sqrt(length*length-d*d/4);
 const knee={x:a.x+dx/2+bend*dy/d*h,y:a.y+dy/2-bend*dx/d*h};
 return {knee,path:`M${a.x} ${a.y}L${knee.x} ${knee.y}L${b.x} ${b.y}`};
}
const smooth=(f:number,a:number,b:number)=>kf(f,[[a,0],[b,1]]);
const step=(from:number,to:number,f:number,a:number,b:number):XY=>{
 const t=clamp((f-a)/(b-a));return {x:from+(to-from)*smooth(f,a,b),y:884-Math.sin(Math.PI*t)*28};
};
export const BUTTON={x:862.5,y:537.5};
export function slenderAt(f:number){
 const far=step(502,702,f,56,90);
 const near=f<80?step(539.5,639.5,f,28,62):step(639.5,739.5,f,88,116);
 const x=(far.x+near.x)/2-.75;
 const moving=smooth(f,20,28)*(1-smooth(f,116,124));
 const drop=15*moving;
 const reach=smooth(f,132,162)*(1-smooth(f,202,228));
 const localButton={x:(BUTTON.x-x)/1.5,y:(BUTTON.y-890)/1.5};
 const pose:SlenderPose={drop,feet:[{x:(far.x-x)/1.5,y:(far.y-890)/1.5},{x:(near.x-x)/1.5,y:(near.y-890)/1.5}],
 hand:{x:20+(localButton.x-20)*reach,y:-150+drop+(localButton.y+150-drop)*reach},
 headTilt:kf(f,[[0,0],[18,5],[28,0],[130,-5],[162,-5],[178,8],[198,8],[239,0]]),surprised:f>=178&&f<239};
 return {x,pose,far,near};
}
export function auditSlender(){
 let maxContact=0;
 for(let f=0;f<270;f++){
  const {x,pose,far,near}=slenderAt(f);
  if(f>0){
   const before=slenderAt(f-1);
   const stationary=(a:XY,b:XY)=>Math.hypot(a.x-b.x,a.y-b.y)<.001;
   if((f<56||f>90)&&!stationary(far,before.far))throw new Error('Far foot slid outside swing');
   if((f<28||(f>62&&f<88)||f>116)&&!stationary(near,before.near))throw new Error('Near foot slid outside swing');
  }
  for(const [i,foot] of pose.feet.entries())limb({x:i?7:-6,y:-143+pose.drop},foot,70);
  limb({x:10,y:-269},{x:pose.hand.x,y:pose.hand.y-pose.drop},60,-1);
  if(f>=162&&f<=202)maxContact=Math.max(maxContact,Math.hypot(x+pose.hand.x*1.5-BUTTON.x,890+pose.hand.y*1.5-BUTTON.y));
  if(f>116&&(Math.abs(pose.feet[0].y+4)>.001||Math.abs(pose.feet[1].y+4)>.001))throw new Error('Feet lost ground');
 }
 if(maxContact>.001)throw new Error('Button contact drift');
 return {frames:270,maxContact};
}

/** Contact target is the leading edge of the palm; sleeve ends at the wrist. */
export function nearHandRig(pose:SlenderPose){
 const tip={x:pose.hand.x,y:pose.hand.y-pose.drop};
 const dx=tip.x-10,dy=tip.y+269,d=Math.hypot(dx,dy);
 const ux=dx/d,uy=dy/d;
 const wrist={x:tip.x-ux*10,y:tip.y-uy*10};
 const chain=limb({x:10,y:-269},wrist,55,-1);
 return {tip,wrist,chain,angle:Math.atan2(uy,ux)*180/Math.PI};
}
export function balancedAt(f:number){
 const state=slenderAt(f);
 const moving=kf(f,[[20,0],[28,1],[116,1],[124,0]]);
 const swing=10*((state.near.x-state.far.x-37.5)/100)*moving;
 return {...state,pose:{...state.pose,hand:{x:state.pose.hand.x-swing,y:state.pose.hand.y-Math.abs(swing)*.3}}};
}
export function auditBalanced(){
 const result=auditSlender();
 for(let f=0;f<270;f++){
  const {x,pose}=balancedAt(f);nearHandRig(pose);
  if(f>=162&&f<=202&&Math.hypot(x+pose.hand.x*1.5-BUTTON.x,890+pose.hand.y*1.5-BUTTON.y)>.001)throw new Error('Balanced palm lost contact');
 }
 return {...result,hand:'palm tip and sleeve wrist checked on every frame'};
}
