import type {XY} from './slender-mechanics';
/** Stitch rings travel with the actual two-bone chain, away from the elbow fold. */
export function pufferSleeveSeams(shoulder:XY,elbow:XY,wrist:XY){
 const upper=Math.hypot(elbow.x-shoulder.x,elbow.y-shoulder.y),lower=Math.hypot(wrist.x-elbow.x,wrist.y-elbow.y),total=upper+lower;
 return [.17,.36,.66,.86].map(t=>{
  const distance=t*total,first=distance<upper,a=first?shoulder:elbow,b=first?elbow:wrist,len=first?upper:lower,q=(distance-(first?0:upper))/len;
  const center={x:a.x+(b.x-a.x)*q,y:a.y+(b.y-a.y)*q},tangent={x:(b.x-a.x)/len,y:(b.y-a.y)/len},normal={x:-tangent.y,y:tangent.x};
  const point=(across:number,along:number)=>({x:center.x+normal.x*across+tangent.x*along,y:center.y+normal.y*across+tangent.y*along});
  const curve=(offset:number)=>{const l=point(-9,offset),m=point(0,offset+3),r=point(9,offset);return `M${l.x} ${l.y}Q${m.x} ${m.y} ${r.x} ${r.y}`;};
  return {center,tangent,normal,path:curve(0),highlight:curve(-2)};
 });
}
