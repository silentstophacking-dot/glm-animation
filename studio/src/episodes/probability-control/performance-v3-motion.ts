import {kf,clamp} from '../../engine/anim';
import {limb,XY,BUTTON} from './slender-mechanics';
import {CharacterV2Pose,v2HandLocal} from './character-v2-motion';
import type {CharacterMood} from './cinematic-character-v2';
export const PERFORMANCE_FRAMES=330;
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const phase=(f:number,a:number,b:number)=>clamp((f-a)/(b-a));
const ease=(f:number,a:number,b:number)=>kf(f,[[a,0],[b,1]]);
const windows={nearA:[38,62],far:[66,92],nearB:[96,118]} as const;
function foot(from:number,to:number,f:number,a:number,b:number):XY{
 const t=phase(f,a,b);return {x:mix(from,to,ease(f,a,b)),y:884-24*Math.sin(Math.PI*t)};
}
export function performanceV3At(f:number){
 const far=foot(502,702,f,...windows.far);
 const near=f<80?foot(539.5,627.5,f,...windows.nearA):foot(627.5,739.5,f,...windows.nearB);
 let x=(far.x+near.x)/2-.75;
 let support:XY|undefined,q=0;
 for(const [a,b,other] of [[38,62,far],[66,92,near],[96,118,far]] as [number,number,XY][]){
  if(f>a&&f<b){support=other;q=phase(f,a,b);}
 }
 if(support)x+=(support.x-x)*.18*Math.sin(Math.PI*q);
 const feet:[XY,XY]=[{x:(far.x-x)/1.5,y:(far.y-890)/1.5},{x:(near.x-x)/1.5,y:(near.y-890)/1.5}];
 let drop=0;
 feet.forEach((p,i)=>{const dx=p.x-(i?8:-8);drop=Math.max(drop,p.y+146-Math.sqrt(143*143-dx*dx));});
 drop+=kf(f,[[0,0],[24,0],[32,2.5],[39,0],[126,0],[132,.8],[140,0]]);
 const walk=ease(f,31,38)*(1-ease(f,118,128));
 const swing=(near.x-far.x-37.5)/100*walk;
 const rest={x:26-15*swing,y:-142+drop-Math.abs(swing)*2.5};
 const pull=ease(f,140,149),reach=ease(f,155,180),release=ease(f,221,248);
 const press=ease(f,180,186)*(1-ease(f,214,221));
 const contact={x:(BUTTON.x+.7*press-x)/1.5,y:(BUTTON.y+1.4*press-890)/1.5};
 const anticipation={x:rest.x-5*pull,y:rest.y-7*pull};
 let hand={x:mix(anticipation.x,contact.x,reach),y:mix(anticipation.y,contact.y,reach)};
 hand={x:mix(hand.x,rest.x,release),y:mix(hand.y,rest.y,release)};
 const brace=ease(f,191,201)*(1-ease(f,224,263));
 const blink=Math.max(...[21,134,189,269].map(b=>Math.max(0,1-Math.abs(f-b)/2)));
 const shoeAngle=(a:number,b:number)=>f>a&&f<b?9*Math.sin(2*Math.PI*phase(f,a,b)):0;
 const mood:CharacterMood=f<18?'calm':f<38?'curious':f<130?'calm':f<191?'focused':f<242?'surprised':f<280?'concerned':'relieved';
 const pose:CharacterV2Pose={drop,feet,hand,headTilt:kf(f,[[0,0],[12,-4],[30,-2],[120,0],[141,-7],[155,-7],[190,-5],[200,9],[214,9],[249,2],[284,-2],[310,0]]),
  surprised:f>=191&&f<242,
  lean:kf(f,[[0,0],[28,0],[38,3],[113,3],[123,-2],[136,0],[160,5],[191,5],[202,-4],[216,-4],[252,0],[280,1],[306,0]]),
  yaw:kf(f,[[0,.25],[8,.25],[16,.95],[130,.95],[183,.95],[195,.3],[229,.3],[260,.55]]),
  torsoYaw:kf(f,[[0,.3],[23,.3],[36,.8],[182,.8],[204,.45],[260,.5]]),
  farSwing:15*swing,farHand:{x:mix(-23+15*swing,-40,brace),y:mix(-153,-210,brace)},
  blink,gaze:kf(f,[[0,0],[8,0],[12,1],[182,1],[194,-.3],[230,-.3],[260,.4]]),
  shoeAngles:[shoeAngle(...windows.far),f<80?shoeAngle(...windows.nearA):shoeAngle(...windows.nearB)]};
 return {x,pose,far,near,press,mood,active:f>=187};
}
export function auditPerformanceV3(){
 let maxContact=0,maxDrop=0;
 for(let f=0;f<PERFORMANCE_FRAMES;f++){
  const s=performanceV3At(f),p=s.pose;maxDrop=Math.max(maxDrop,p.drop);
  if(s.far.y<883.99&&s.near.y<883.99)throw new Error('Both feet airborne at '+f);
  if(f>0){
   const before=performanceV3At(f-1),d=(a:XY,b:XY)=>Math.hypot(a.x-b.x,a.y-b.y);
   if((f<66||f>92)&&d(s.far,before.far)>.001)throw new Error('Far foot drift '+f);
   if((f<38||(f>62&&f<96)||f>118)&&d(s.near,before.near)>.001)throw new Error('Near foot drift '+f);
  }
  p.feet.forEach((foot,i)=>limb({x:i?8:-8,y:-146+p.drop},foot,72));
  const tip=v2HandLocal(p),shoulder={x:17-(p.torsoYaw??0)*4.2,y:-271};
  const dx=tip.x-shoulder.x,dy=tip.y-shoulder.y,d=Math.hypot(dx,dy);
  limb(shoulder,{x:tip.x-dx/d*11,y:tip.y-dy/d*11},61,-1);
  limb({x:-15+6*(p.torsoYaw??0),y:-269},p.farHand!,60,-1);
  if(f>=180&&f<=221)maxContact=Math.max(maxContact,Math.hypot(s.x+p.hand.x*1.5-BUTTON.x-.7*s.press,890+p.hand.y*1.5-BUTTON.y-1.4*s.press));
 }
 if(maxContact>.001)throw new Error('Performance hand/button contact lost');
 return {frames:PERFORMANCE_FRAMES,maxContact,maxDrop,groundedSupport:'at least one foot planted on every frame'};
}

export function performanceCamera(f:number){
 if(f<139)return {x:0,y:350,z:0,focal:1200};
 if(f<188)return {x:-160,y:365,z:380,focal:1200};
 if(f<248)return {x:-220,y:405,z:480,focal:1200};
 return {x:-90,y:350,z:140,focal:1200};
}
