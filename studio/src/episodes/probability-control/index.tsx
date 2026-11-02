import React from 'react';
import { defineEpisode, LookDef, Timeline, HudChip, FONT } from '../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

/**
 * Uses the imported repo's real defineEpisode/ShotMap/Timeline engine.
 * The overlay is a power look; the engine applies the shot clock, FX,
 * vignette, grain, and optional audio stems.
 */
const probabilityLook: LookDef = {
  grade:(lv)=>'saturate('+(1-.23*lv)+') contrast('+(1+.15*lv)+')',
  jitter:1.6,
  Overlay:({f,lv})=><g opacity={lv}>
    <HudChip f={f} x={75} y={125} label="PROBABILITY" icon="dot"/>
    <path d="M90 1720 H990" fill="none" stroke="#74DCD1"
      opacity=".23" strokeWidth={4} strokeDasharray="9 15"/>
    <text x="970" y="1760" textAnchor="end" fontFamily={FONT.ui}
      fontSize={26} fill="#AAD2DB">ONE EVENT ONLY</text>
  </g>
};

export const probabilityControl = defineEpisode('ProbabilityControl',{
  timeline:timeline as Timeline,
  shots:{...shots},
  looks:{probability:probabilityLook},
  width:1080,
  height:1920,
  grain:true,
  vignette:true,
  bg:'#0B1020'
});
