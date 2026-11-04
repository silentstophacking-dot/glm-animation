import {kf,clamp} from '../../engine/anim';
import {pufferRoomPerformanceAt,auditPufferRoomPerformance} from './puffer-room-performance-motion';
import {RoomActorPerformance} from './lab-room-geometry';
import {CharacterTurnV5,turnV5Geometry} from './character-turn-v5';
import {v2HandLocal} from './character-v2-motion';
import {BUTTON,limb} from './slender-mechanics';
import {projectWorld,WorldCamera} from './pseudo-depth-camera';
export const ANOMALY_FRAMES=720;
// Linear source-clock mapping preserves the original gait/contact curves while allocating story holds.
const keys:[number,number][]=[[0,0],[50,8],[95,32],[210,132],[270,155],[330,180],[348,191],[405,221],[450,248],[500,280],[719,329]];
export const sourceFrameAt=(f:number)=>kf(f,keys,t=>t);
export const frameForSource=(s:number)=>kf(s,keys.map(([f,v])=>[v,f]),t=>t);
export const ACTIVATION_FRAME=frameForSource(187);
export const BUTTON_FRAME=frameForSource(180);
export const STEP_FRAMES=[62,92,118].map(frameForSource);
export const clockSecondsAt=(f:number)=>f<ACTIVATION_FRAME?f/30:ACTIVATION_FRAME/30-(f-ACTIVATION_FRAME)/30*5;
export function anomalyActorAt(f:number):RoomActorPerformance{
 const s=pufferRoomPerformanceAt(sourceFrameAt(f)),p={...s.pose};
 if(f>=450){
  const look=kf(f,[[450,0],[505,1]]),gesture=kf(f,[[548,0],[590,1],[638,1],[690,0]]);
  p.yaw=(p.yaw??0)*(1-look)+.08*look;p.gaze=-look;p.headTilt=kf(f,[[450,p.headTilt],[505,-8],[548,-8],[600,2],[670,-3],[719,-3]]);
  p.blink=Math.max(...[526,667].map(b=>clamp(1-Math.abs(f-b)/2)));
  p.farHand={x:-25,y:-153};
  p.hand={x:p.hand.x*(1-gesture)+65*gesture,y:p.hand.y*(1-gesture)+(-255+p.drop)*gesture};
  p.surprised=false;s.mood=f<620?'concerned':'curious';
 }
 return {...s,pose:p,headYaw:p.yaw??0};
}
export type AnomalyShot={from:number;to:number;name:string;camera:WorldCamera;crop:[number,number,number,number];clock?:boolean};
const interaction={x:-80,y:370,z:250,focal:1200};
export const ANOMALY_SHOTS:AnomalyShot[]=[
 {from:0,to:210,name:'NOTICE / APPROACH',camera:{x:-120,y:350,z:0,focal:1200},crop:[0,0,1920,1080]},
 {from:210,to:270,name:'HESITATE / READ THE SIGNAL',camera:interaction,crop:[480,160,1120,630]},
 {from:270,to:360,name:'REACH / COMMIT',camera:interaction,crop:[685,405,650,365.625]},
 {from:360,to:450,name:'RECOIL / LISTEN',camera:interaction,crop:[550,160,920,517.5]},
 {from:450,to:540,name:'THE CLOCK RUNS BACKWARD',camera:{x:-1320,y:800,z:1300,focal:1200},crop:[760,427.5,400,225],clock:true},
 {from:540,to:720,name:'REALISE / WHAT DID I DO?',camera:interaction,crop:[510,150,1040,585]},
];
export const anomalyShotAt=(f:number)=>ANOMALY_SHOTS.find(s=>f>=s.from&&f<s.to)??ANOMALY_SHOTS.at(-1)!;
export function auditLabTimeAnomaly(){
 auditPufferRoomPerformance();let maxPlantedDrift=0,maxContact=0,maxScreenContact=0;
 for(let f=0;f<ANOMALY_FRAMES;f++){
  const a=anomalyActorAt(f),p=a.pose,g=turnV5Geometry(a.yaw),shot=anomalyShotAt(f);
  CharacterTurnV5({id:'anomaly-audit',x:0,y:0,scale:a.scale,yaw:a.yaw,headYaw:a.headYaw,pose:p,mood:a.mood,outfit:'puffer-black',lighting:'sunset',shadow:false});
  p.feet.forEach((foot,i)=>limb({x:g.hips[i],y:-147.4+p.drop},{x:foot.x,y:foot.y-4},72));
  if(!a.soleWorld.some(foot=>Math.abs(foot.y)<.001))throw new Error('No supporting foot '+f);
  if(f){const prev=anomalyActorAt(f-1);a.soleWorld.forEach((foot,i)=>{if(Math.abs(foot.y)<.001&&Math.abs(prev.soleWorld[i].y)<.001)maxPlantedDrift=Math.max(maxPlantedDrift,Math.abs(foot.x-prev.soleWorld[i].x));});}
  const source=sourceFrameAt(f);
  if(source>=180&&source<=221){
   const tip=v2HandLocal(p),angle=(p.lean??0)*Math.PI/180,c=Math.cos(angle),sn=Math.sin(angle);
   const palm={x:a.origin.x+(tip.x*c-(tip.y+146)*sn)*a.scale,y:a.origin.y-(tip.x*sn+(tip.y+146)*c-146+p.drop)*a.scale,z:0};
   const target={x:BUTTON.x-960+.7*a.press,y:885-BUTTON.y-1.4*a.press,z:0};
   maxContact=Math.max(maxContact,Math.hypot(palm.x-target.x,palm.y-target.y));
   const pa=projectWorld(palm,shot.camera),pb=projectWorld(target,shot.camera);maxScreenContact=Math.max(maxScreenContact,Math.hypot(pa.x-pb.x,pa.y-pb.y)*1920/shot.crop[2]);
  }
  if(f>Math.ceil(ACTIVATION_FRAME)&&clockSecondsAt(f)>=clockSecondsAt(f-1))throw new Error('Clock did not reverse');
 }
 if(Math.max(maxPlantedDrift,maxContact,maxScreenContact)>.001)throw new Error('Contact drift');
 return {frames:ANOMALY_FRAMES,shots:ANOMALY_SHOTS.length,maxPlantedDrift,maxContact,maxScreenContact,activationFrame:ACTIVATION_FRAME,buttonFrame:BUTTON_FRAME,stepFrames:STEP_FRAMES};
}
