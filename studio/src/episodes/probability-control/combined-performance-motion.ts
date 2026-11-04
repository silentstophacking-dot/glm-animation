import {performanceV3At,performanceCamera,PERFORMANCE_FRAMES,auditPerformanceV3} from './performance-v3-motion';
import {CharacterTurnV5,turnV5Geometry} from './character-turn-v5';
import {CharacterV2Pose,v2HandLocal} from './character-v2-motion';
import {BUTTON,limb} from './slender-mechanics';
import {projectWorld} from './pseudo-depth-camera';
export function combinedPerformanceAt(f:number){
 const s=performanceV3At(f),g=turnV5Geometry(s.pose.torsoYaw??0);
 const feet=s.pose.feet.map(p=>({...p,y:p.y+3})) as CharacterV2Pose['feet'];
 let oldReach=0,newReach=0;
 s.pose.feet.forEach((p,i)=>oldReach=Math.max(oldReach,p.y+146-Math.sqrt(143**2-(p.x-(i?8:-8))**2)));
 feet.forEach((p,i)=>newReach=Math.max(newReach,p.y-4+147.4-Math.sqrt(143**2-(p.x-g.hips[i])**2)));
 const drop=newReach+s.pose.drop-oldReach;
 const pose:CharacterV2Pose={...s.pose,yaw:Math.min(.78,s.pose.yaw??0),feet,drop,hand:{...s.pose.hand,y:s.pose.hand.y+3.5/1.5}};
 return {...s,pose};
}
export function auditCombinedPerformance(){
 auditPerformanceV3();let maxPalmContact=0,maxProjectedContact=0,maxSoleDrift=0;
 for(let f=0;f<PERFORMANCE_FRAMES;f++){
  const s=combinedPerformanceAt(f),p=s.pose,g=turnV5Geometry(p.torsoYaw??0);
  try{CharacterTurnV5({id:'combined-audit',x:s.x,y:886.5,scale:1.5,yaw:p.torsoYaw??0,headYaw:p.yaw,pose:p,mood:s.mood,lighting:'sunset',shadow:false});}
  catch(e){throw new Error('Combined rig frame '+f+': '+String(e));}
  p.feet.forEach((foot,i)=>{
   limb({x:g.hips[i],y:-147.4+p.drop},{x:foot.x,y:foot.y-4},72);
   const source=i?s.near:s.far;
   maxSoleDrift=Math.max(maxSoleDrift,Math.abs(886.5+foot.y*1.5-(source.y+1)));
  });
  if(f>=180&&f<=221){
   const local=v2HandLocal(p),a=(p.lean??0)*Math.PI/180,c=Math.cos(a),sn=Math.sin(a);
   const palm={x:s.x+(local.x*c-(local.y+146)*sn)*1.5,y:886.5+(local.x*sn+(local.y+146)*c-146+p.drop)*1.5};
   const target={x:BUTTON.x+.7*s.press,y:BUTTON.y+1.4*s.press};
   maxPalmContact=Math.max(maxPalmContact,Math.hypot(palm.x-target.x,palm.y-target.y));
   const camera=performanceCamera(f),pa=projectWorld({x:palm.x-960,y:885-palm.y,z:0},camera),pb=projectWorld({x:target.x-960,y:885-target.y,z:0},camera);
   maxProjectedContact=Math.max(maxProjectedContact,Math.hypot(pa.x-pb.x,pa.y-pb.y));
  }
 }
 if(Math.max(maxPalmContact,maxProjectedContact,maxSoleDrift)>.001)throw new Error('Combined contacts drift');
 return {frames:PERFORMANCE_FRAMES,maxPalmContact,maxProjectedContact,maxSoleDrift,support:'at least one planted foot on every frame; inherited world-space step timing'};
}
