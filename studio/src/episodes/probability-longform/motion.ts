/**
 * Deterministic 2D physical timing for the long-form episode.
 * Every position is a WORLD coordinate; the parent camera moves all
 * scenery, actor, props, and contact shadows together.
 */
export type Point = {x:number;y:number};
const clamp01=(v:number)=>Math.min(1,Math.max(0,v));
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
const smooth=(t:number)=>{const v=clamp01(t);return v*v*(3-2*v)};

export const COIN_RELEASE_FRAME=72;
export const COIN_LANDING_FRAME=154;
export const COIN_SETTLED_FRAME=174;
/** A tossed coin travels from the actual animated hand to a fixed desk point.
 * Position and face angle are smooth at release and remain fixed after landing.
 */
export function coinTrajectory(frame:number,release:Point,land:Point){
  if(frame<=COIN_RELEASE_FRAME)
    return {x:release.x,y:release.y,flip:0,airborne:false,landed:false};
  const u=clamp01((frame-COIN_RELEASE_FRAME)/(COIN_LANDING_FRAME-COIN_RELEASE_FRAME));
  const x=lerp(release.x,land.x,smooth(u));
  const arc=230*4*u*(1-u);
  const y=lerp(release.y,land.y,u)-arc;
  if(frame<=COIN_LANDING_FRAME){
    return {x,y,flip:4*Math.PI*smooth(u),airborne:true,landed:false};
  }
  const b=clamp01((frame-COIN_LANDING_FRAME)/(COIN_SETTLED_FRAME-COIN_LANDING_FRAME));
  const bounce=32*Math.sin(Math.PI*b)*(1-b);
  return {x:land.x,y:land.y-bounce,flip:4*Math.PI,airborne:b<1,landed:b>=1};
}

/** Two complete coin results in the seven-second macro insert. */
export function repeatedCoinAt(frame:number){
 const f=Math.max(0,frame);
 if(f<45)return {y:608,flip:0,count:1,airborne:false};
 const p=clamp01((f-45)/105);
 const air=185*Math.sin(Math.PI*p);
 return {y:608-air,flip:4*Math.PI*smooth(p),count:f<150?1:2,
   airborne:f>=45&&f<150};
}

/** Exactly TEN physical flips, 22 frames each, then hold 20 frames. */
export const MONTAGE_FRAMES_PER_FLIP=22;
export const MONTAGE_TOTAL_FLIPS=10;
export function montageCoinAt(frame:number){
 const f=Math.max(0,frame);
 const active=f<MONTAGE_FRAMES_PER_FLIP*MONTAGE_TOTAL_FLIPS;
 const u=active?(f%MONTAGE_FRAMES_PER_FLIP)/MONTAGE_FRAMES_PER_FLIP:1;
 const completed=Math.min(MONTAGE_TOTAL_FLIPS,Math.floor(f/MONTAGE_FRAMES_PER_FLIP));
 return {y:608-140*Math.sin(Math.PI*u),flip:4*Math.PI*smooth(u),
   completed,airborne:active,remaining:Math.max(0,MONTAGE_TOTAL_FLIPS-completed)};
}

/** Winning numbers are sticky across a CUT: shot-local frame resets
 * but LOTTERY_WIN must begin with the ticket already in its winning state.
 */
export function lotteryDigit(frame:number,index:number,winner=false){
 if(winner||frame>=150+index*18)return 7;
 return (Math.floor(frame/7)+index*3)%10;
}
