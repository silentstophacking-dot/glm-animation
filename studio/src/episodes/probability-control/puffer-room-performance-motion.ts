import {combinedPerformanceAt} from './combined-performance-motion';
import {auditPerformanceV3,PERFORMANCE_FRAMES} from './performance-v3-motion';
import {CharacterTurnV5,turnV5Geometry} from './character-turn-v5';
import {v2HandLocal} from './character-v2-motion';
import {pufferSleeveSeams} from './puffer-sleeve-seams';
import {BUTTON,limb} from './slender-mechanics';
import {WorldCamera,projectWorld} from './pseudo-depth-camera';
import {W,RoomActorPerformance} from './lab-room-geometry';
import {kf} from '../../engine/anim';
export const PUFFER_PERFORMANCE_FRAMES=PERFORMANCE_FRAMES;
export function pufferPerformanceCamera(f:number):WorldCamera{
 return {x:kf(f,[[0,-130],[130,-80],[245,-80],[310,-70]]),y:kf(f,[[0,350],[130,355],[177,370],[245,370],[310,350]]),z:kf(f,[[0,-50],[130,60],[177,250],[245,250],[310,90]]),focal:1200};
}
export function pufferRoomPerformanceAt(f:number):RoomActorPerformance{
 const s=combinedPerformanceAt(f),p=s.pose;
 // The original interaction was flat at z=0. Keep actor and button on that physical plane.
 const origin=W(s.x-960,-1.5,0),scale=1.5;
 const soleWorld=p.feet.map(foot=>W(origin.x+foot.x*scale,origin.y-foot.y*scale,origin.z)) as RoomActorPerformance['soleWorld'];
 return {origin,scale,pose:p,yaw:p.torsoYaw??0,headYaw:p.yaw??0,mood:s.mood,press:s.press,active:s.active,soleWorld,supportOpacity:soleWorld.map(p=>p.y>.01?.15:.65) as [number,number]};
}
export function auditPufferRoomPerformance(){
 auditPerformanceV3();let maxContact=0,maxProjectedContact=0,maxPlantedDrift=0,stitchedArms=0;
 for(let f=0;f<PUFFER_PERFORMANCE_FRAMES;f++){
  const s=pufferRoomPerformanceAt(f),p=s.pose,g=turnV5Geometry(s.yaw),camera=pufferPerformanceCamera(f);
  try{CharacterTurnV5({id:'puffer-room-audit',x:0,y:0,scale:s.scale,yaw:s.yaw,headYaw:s.headYaw,pose:p,mood:s.mood,outfit:'puffer-black',lighting:'sunset',shadow:false});}
  catch(e){throw new Error('Puffer frame '+f+': '+String(e));}
  const tip=v2HandLocal(p);
  for(const side of [-1,1]){
   const shoulder={x:side>0?g.nearShoulder:g.farShoulder,y:-270},target=side>0?tip:p.farHand!;
   const dx=target.x-shoulder.x,dy=target.y-shoulder.y,d=Math.hypot(dx,dy),wrist=side>0?{x:target.x-dx/d*11,y:target.y-dy/d*11}:target;
   const ik=limb(shoulder,wrist,side>0?61:60,-1),seams=pufferSleeveSeams(shoulder,ik.knee,wrist);
   if(seams.length!==4)throw new Error('Lost puffer seams');
   seams.forEach(seam=>{if(!Number.isFinite(seam.center.x+seam.center.y)||Math.abs(seam.tangent.x*seam.normal.x+seam.tangent.y*seam.normal.y)>.001)throw new Error('Invalid stitch orientation');});
   stitchedArms++;
  }
  if(!s.soleWorld.some(foot=>Math.abs(foot.y)<.001))throw new Error('Both feet airborne at '+f);
  if(f){const before=pufferRoomPerformanceAt(f-1);s.soleWorld.forEach((foot,i)=>{if(Math.abs(foot.y)<.001&&Math.abs(before.soleWorld[i].y)<.001)maxPlantedDrift=Math.max(maxPlantedDrift,Math.hypot(foot.x-before.soleWorld[i].x,foot.z-before.soleWorld[i].z));});}
  if(f>=180&&f<=221){
   const a=(p.lean??0)*Math.PI/180,c=Math.cos(a),sn=Math.sin(a);
   const palm=W(s.origin.x+(tip.x*c-(tip.y+146)*sn)*s.scale,s.origin.y-(tip.x*sn+(tip.y+146)*c-146+p.drop)*s.scale,s.origin.z);
   const target=W(BUTTON.x-960+.7*s.press,885-BUTTON.y-1.4*s.press,0);
   maxContact=Math.max(maxContact,Math.hypot(palm.x-target.x,palm.y-target.y,palm.z-target.z));
   const pa=projectWorld(palm,camera),pb=projectWorld(target,camera);maxProjectedContact=Math.max(maxProjectedContact,Math.hypot(pa.x-pb.x,pa.y-pb.y));
  }
 }
 if(Math.max(maxContact,maxProjectedContact,maxPlantedDrift)>.001)throw new Error('Puffer room contact drift');
 return {frames:PUFFER_PERFORMANCE_FRAMES,stitchedArms,maxContact,maxProjectedContact,maxPlantedDrift,support:'one planted sole on every frame',interactionPlaneZ:0};
}
