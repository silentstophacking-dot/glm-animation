export type WorldPoint={x:number;y:number;z:number};
export type WorldCamera={x:number;y:number;z:number;focal:number};
export const depthCameraAt=(t:number):WorldCamera=>{
 const q=Math.max(0,Math.min(1,t));const e=q*q*(3-2*q);
 return {x:-70+140*e,y:350,z:40*e,focal:1200};
};
// Pinhole projection. y is altitude; z is distance into the room.
export function projectWorld(p:WorldPoint,c:WorldCamera){
 const denominator=c.focal+p.z-c.z;
 if(denominator<=0)throw new Error('World point behind camera');
 const scale=c.focal/denominator;
 return {x:960+(p.x-c.x)*scale,y:540+(c.y-p.y)*scale,scale};
}
export function planeTransform(p:WorldPoint,c:WorldCamera){
 const q=projectWorld(p,c);return `translate(${q.x} ${q.y}) scale(${q.scale})`;
}
export function floorPolygon(points:WorldPoint[],c:WorldCamera){
 return points.map((p,i)=>{const q=projectWorld(p,c);return `${i?'L':'M'}${q.x} ${q.y}`;}).join('')+'Z';
}
export function auditDepth(){
 let maxContactError=0;
 for(let f=0;f<180;f++){
  const c=depthCameraAt(f/179);
  // Hand and console share one physical interaction plane and anchor.
  const button={x:862.5-960,y:885-537.5,z:0};
  const hand={x:720-960+95*1.5,y:885-(886.5+(-235+3.5/1.5)*1.5),z:0};
  const a=projectWorld(button,c),b=projectWorld(hand,c);
  maxContactError=Math.max(maxContactError,Math.hypot(a.x-b.x,a.y-b.y));
  const foot=projectWorld({x:-240,y:0,z:0},c);
  if(!Number.isFinite(foot.y))throw new Error('Invalid floor projection');
 }
 if(maxContactError>.001)throw new Error('Depth hand contact drift');
 const start=depthCameraAt(0),end=depthCameraAt(1);
 const movement=(z:number)=>Math.abs(projectWorld({x:0,y:0,z},end).x-projectWorld({x:0,y:0,z},start).x);
 if(!(movement(-300)>movement(0)&&movement(0)>movement(650)))throw new Error('Incorrect depth ordering');
 return {frames:180,maxContactError,foregroundTravel:movement(-300),interactionTravel:movement(0),backgroundTravel:movement(650)};
}
