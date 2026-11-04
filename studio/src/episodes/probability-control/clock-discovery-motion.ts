import {kf,clamp} from '../../engine/anim';
import {anomalyActorAt,auditLabTimeAnomaly,ANOMALY_FRAMES,ACTIVATION_FRAME,BUTTON_FRAME,STEP_FRAMES} from './lab-time-anomaly-motion';
import {CharacterTurnV5,turnV5Geometry} from './character-turn-v5';
import {v2HandLocal} from './character-v2-motion';
import {BUTTON,limb} from './slender-mechanics';
const blend=(a:number,b:number,t:number)=>a+(b-a)*t;
export const DISCOVERY_CLOTH_SECONDS=[9.1,12,20.8,22.8];
export function discoveryActorAt(f:number){
 const s=anomalyActorAt(Math.min(f,449));
 // Preserve the established performance exactly until the first press has released.
 if(f<412)return s;
 const original=anomalyActorAt(f),p={...original.pose};
 const look=kf(f,[[412,0],[424,1],[574,1],[614,0],[682,0],[712,.72]]);
 const head=kf(f,[[420,0],[445,1],[584,1],[620,0],[687,0],[719,.72]]);
 const chest=kf(f,[[427,0],[448,1],[590,1],[625,0],[719,0]]);
 const oldG=turnV5Geometry(original.yaw);
 p.torsoYaw=blend(original.yaw,.14,chest);
 const g=turnV5Geometry(p.torsoYaw);
 const reach=(hips:number[])=>Math.max(...p.feet.map((foot,i)=>foot.y-4+147.4-Math.sqrt(143**2-(foot.x-hips[i])**2)));
 const correction=reach(g.hips)-reach(oldG.hips);p.drop+=correction;
 p.hand={x:p.hand.x,y:p.hand.y+correction};
 p.yaw=blend(kf(f,[[412,anomalyActorAt(412).headYaw],[584,.3],[620,.55]]),-.58,head);p.gaze=blend(original.pose.gaze??0,-1,look);p.gazeY=-1.8*look;
 p.headTilt=kf(f,[[412,anomalyActorAt(412).pose.headTilt],[445,-11],[552,-11],[576,-7],[620,-3],[679,-3],[719,-8]]);
 p.blink=Math.max(...[567,681].map(b=>clamp(1-Math.abs(f-b)/2)));
 p.surprised=false;
 const settle=kf(f,[[412,0],[448,1]]),far=original.pose.farHand!;
 p.farHand={x:blend(far.x,-25,settle),y:blend(far.y,-153,settle)};
 if(f>=540){
  // A deliberate hold, a second intention, a stop short, then withdrawal.
  const intent=kf(f,[[540,0],[618,0],[650,1],[678,1],[714,0]]);
  const rest=anomalyActorAt(540).pose.hand;
  p.hand={x:blend(rest.x,72,intent),y:blend(rest.y+correction,-247+p.drop,intent)};
 }
 return {...original,pose:p,yaw:p.torsoYaw,headYaw:p.yaw,mood:'concerned' as const};
}
export function auditClockDiscovery(){
 const before=discoveryActorAt(411),after=discoveryActorAt(412);
 const freeArmBoundary=Math.hypot(before.pose.farHand!.x-after.pose.farHand!.x,before.pose.farHand!.y-after.pose.farHand!.y);
 if(freeArmBoundary>1.5||Math.abs(before.headYaw-after.headYaw)>.05||Math.abs(before.pose.headTilt-after.pose.headTilt)>1)throw new Error('Discontinuous discovery transition');
 const previous=auditLabTimeAnomaly();let maxPlantedDrift=0,minSecondReachGap=Infinity;
 for(let f=0;f<ANOMALY_FRAMES;f++){
  const a=discoveryActorAt(f),p=a.pose,g=turnV5Geometry(a.yaw);
  CharacterTurnV5({id:'discovery-audit',x:0,y:0,scale:a.scale,yaw:a.yaw,headYaw:a.headYaw,pose:p,mood:a.mood,outfit:'puffer-black',lighting:'sunset',shadow:false});
  p.feet.forEach((foot,i)=>limb({x:g.hips[i],y:-147.4+p.drop},{x:foot.x,y:foot.y-4},72));
  if(!a.soleWorld.some(foot=>Math.abs(foot.y)<.001))throw new Error('No supporting foot '+f);
  if(f){const prev=discoveryActorAt(f-1);a.soleWorld.forEach((foot,i)=>{if(Math.abs(foot.y)<.001&&Math.abs(prev.soleWorld[i].y)<.001)maxPlantedDrift=Math.max(maxPlantedDrift,Math.abs(foot.x-prev.soleWorld[i].x));});}
  if(f<412&&JSON.stringify(a)!==JSON.stringify(anomalyActorAt(f)))throw new Error('Earlier action changed');
  if(f>=540){
   const tip=v2HandLocal(p),angle=(p.lean??0)*Math.PI/180,c=Math.cos(angle),sn=Math.sin(angle);
   const palm={x:a.origin.x+(tip.x*c-(tip.y+146)*sn)*a.scale,y:a.origin.y-(tip.x*sn+(tip.y+146)*c-146+p.drop)*a.scale};
   minSecondReachGap=Math.min(minSecondReachGap,Math.hypot(palm.x-(BUTTON.x-960),palm.y-(885-BUTTON.y)));
   if(a.press!==0)throw new Error('Unintended second button press');
  }
 }
 if(maxPlantedDrift>.001||minSecondReachGap<24)throw new Error('Discovery contact/stop failure');
 if(!(discoveryActorAt(440).headYaw<-.4&&discoveryActorAt(560).headYaw<-.4))throw new Error('Clock eyeline missing');
 return {frames:ANOMALY_FRAMES,freeArmBoundary,shots:previous.shots,maxPlantedDrift,minSecondReachGap,buttonFrame:BUTTON_FRAME,activationFrame:ACTIVATION_FRAME,stepFrames:STEP_FRAMES,clothSeconds:DISCOVERY_CLOTH_SECONDS,acting:'eye lead 412, head 420, chest 427; realization hold; stop short 650–678'};
}
