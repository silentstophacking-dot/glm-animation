import React from 'react';

/**
 * Pure-SVG 2.5D camera utilities. NO Three.js, canvas/WebGL or Blender.
 * Draw far layers first, then midground actors, then foreground.
 * Every asset remains an ordinary SVG path or shape.
 */
export type DepthCamera = {
  panX: number;
  panY: number;
  push: number;
  anchorX?: number;
  anchorY?: number;
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/** Negative depth = skyline, 0 = architecture, 1 = actors, 2 = near foreground. */
export const depthProjection = (depth: number, camera: DepthCamera) => {
  const d = clamp(depth, -1.5, 2.5);
  const parallaxFactor = clamp(0.18 + (d + 1) * 0.52, 0.08, 2.05);
  const scaleFactor = clamp(1 + camera.push * (0.22 + (d + 1) * 0.24), 0.65, 2.35);
  return {
    translateX: -camera.panX * parallaxFactor,
    translateY: -camera.panY * parallaxFactor,
    scale: scaleFactor,
    parallaxFactor,
  };
};

export const DepthLayer: React.FC<{
  camera: DepthCamera;
  depth: number;
  children: React.ReactNode;
  opacity?: number;
  blur?: number;
}> = ({ camera, depth, children, opacity = 1, blur = 0 }) => {
  const { translateX, translateY, scale } = depthProjection(depth, camera);
  const px = camera.anchorX ?? 540;
  const py = camera.anchorY ?? 960;
  const transform = 'translate(' + translateX + ' ' + translateY + ') translate(' + px + ' ' + py +
    ') scale(' + scale + ') translate(' + (-px) + ' ' + (-py) + ')';
  return <g opacity={opacity} transform={transform}
    filter={blur > 0 ? 'url(#blur' + blur + ')' : undefined}>
    {children}
  </g>;
};

/** All geometry is flat SVG. Grout lines converge at a vanishing point. */
export const PerspectiveFloor: React.FC<{
  x?: number;
  horizon?: number;
  bottom?: number;
  nearWidth?: number;
  tilesAcross?: number;
  rows?: number;
  fill?: string;
  stroke?: string;
}> = ({
  x = 540, horizon = 855, bottom = 2050, nearWidth = 2500,
  tilesAcross = 12, rows = 14, fill = '#312331', stroke = '#937A77',
}) => {
  const floorPath = 'M ' + x + ' ' + horizon + ' L ' + (x - nearWidth / 2) + ' ' + bottom +
    ' L ' + (x + nearWidth / 2) + ' ' + bottom + ' Z';
  return <g>
    <path d={floorPath} fill={fill}/>
    {Array.from({length: tilesAcross + 1},(_,i)=>{
      const a = -nearWidth / 2 + i * nearWidth / tilesAcross;
      return <path key={'vertical-' + i}
        d={'M '+x+' '+horizon+' L '+(x+a)+' '+bottom}
        fill="none" stroke={stroke} strokeWidth={i%3===0?3:1.8}
        opacity={i%3===0?.23:.14}/>;
    })}
    {Array.from({length:rows},(_,i)=>{
      const p=(i+1)/rows;
      const y=horizon+(bottom-horizon)*p*p;
      const half=(nearWidth/2)*p*p;
      return <path key={'horizontal-' + i}
        d={'M '+(x-half)+' '+y+' L '+(x+half)+' '+y}
        fill="none" stroke={stroke} strokeWidth={2 + p * 2}
        opacity={.1 + p*.17}/>;
    })}
    <path d={'M '+x+' '+horizon+' L '+(x-nearWidth/2)+' '+bottom}
      stroke="#E9C09B" strokeWidth={4} opacity=".1"/>
  </g>;
};

/** A flat object with visible top and side faces, made from SVG polygons. */
export const ExtrudedBox: React.FC<{
  x: number; y: number; w: number; h: number;
  depthX?: number; depthY?: number;
  front: string; top: string; side: string;
  stroke?: string;
}> = ({x,y,w,h,depthX=34,depthY=-27,front,top,side,stroke='#201727'}) =>
  <g>
    <path d={'M'+x+' '+y+' l'+depthX+' '+depthY+' h'+w+' l'+(-depthX)+' '+(-depthY)+' Z'}
      fill={top} stroke={stroke} strokeWidth={3} strokeLinejoin="round"/>
    <path d={'M'+(x+w)+' '+y+' l'+depthX+' '+depthY+' v'+h+' l'+(-depthX)+' '+(-depthY)+' Z'}
      fill={side} stroke={stroke} strokeWidth={3} strokeLinejoin="round"/>
    <rect x={x} y={y} width={w} height={h} fill={front}
      stroke={stroke} strokeWidth={3}/>
  </g>;
