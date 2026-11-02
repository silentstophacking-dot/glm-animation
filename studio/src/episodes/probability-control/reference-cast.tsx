import React from 'react';
import { defineEpisode, Timeline, ShotProps, basePose, faceAt, Glow, FONT } from '../../engine';
import { ReferenceHero } from './reference-hero';

const CastFrame:React.FC<ShotProps>=({t})=><g>
  <defs>
    <linearGradient id="refBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#271E2F"/>
      <stop offset="0.65" stopColor="#302536"/>
      <stop offset="1" stopColor="#191520"/>
    </linearGradient>
    <linearGradient id="refSun" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#F0BE8C" stopOpacity=".12"/>
      <stop offset="1" stopColor="#C4A1D0" stopOpacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#refBg)"/>
  <rect x="0" y="0" width="1920" height="1080" fill="url(#refSun)"/>
  <circle cx="1440" cy="275" r="235" fill="#E6AB84" opacity=".08"/>
  <path d="M0 855 H1920" stroke="#A87874" strokeWidth={4} opacity=".55"/>
  <rect x="0" y="857" width="1920" height="230" fill="#201A29"/>
  <g stroke="#A77877" strokeWidth="2" opacity=".18">
    {Array.from({length:20},(_,i)=><path key={i} d={'M'+(i*113)+' 860 L'+(i*121-200)+' 1080'}/>)}
  </g>
  <path d="M960 140 V950" stroke="#D8B3A9" strokeWidth={3} strokeDasharray="12 21" opacity=".23"/>
  <Glow x={485} y={550} r={480} o={.36}/>
  <Glow x={1405} y={510} r={470} o={.31}/>

  <ReferenceHero
    variant="coral"
    pose={{...basePose,x:480,y:605,scale:1.52,yaw:.17,
      armL:{a:27,b:-5},armR:{a:135,b:-25},
      legL:{a:12,b:0},legR:{a:-12,b:0},
      ...faceAt(t,[[0,'happy']])}}
    rimId="rimR" shadow={.55}/>
  <ReferenceHero
    variant="gold-cap"
    pose={{...basePose,x:1400,y:605,scale:1.53,yaw:-.10,
      armL:{a:136,b:-18},armR:{a:20,b:-4},
      legL:{a:14,b:0},legR:{a:-11,b:0},
      ...faceAt(t,[[0,'smug']])}}
    rimId="rimR" shadow={.55}/>
  <g fill="#FFF4E5" fontFamily={FONT.title} textAnchor="middle" fontWeight={800}>
    <text x="480" y="172" fontSize="73">CORAL HOODIE</text>
    <text x="1400" y="172" fontSize="73">GOLD CAP</text>
  </g>
  <g fill="#C7ABB2" fontFamily={FONT.ui} textAnchor="middle" fontSize="31" letterSpacing="2">
    <text x="480" y="232">PROTAGONIST • FLAT VECTOR</text>
    <text x="1400" y="232">SUPPORTING CHARACTER</text>
  </g>
  <g fontFamily={FONT.ui} fill="#EBDACC" fontSize="34" letterSpacing=".7">
    <text x="90" y="1016">SAME POSE ENGINE • SVG SHAPES ONLY • NO RASTER TEXTURES</text>
  </g>
</g>;

const timeline:Timeline={
  slug:'reference-character-cast',title:'Reference 2D Character Options',
  fps:30,total:1,
  segments:[{shot:'CAST',a:0,b:1,t0:0,t1:1}],
  shots:[{id:'CAST',size:'2D design sheet',key:0,len:1,first:0,line:'Coral Hoodie / Gold Cap'}],
  fx:[],audio:{}
};
export const referenceCharacterCast=defineEpisode('ReferenceCharacterCast',{
  timeline,shots:{CAST:CastFrame},width:1920,height:1080,grain:true,vignette:true,bg:'#251C2D'
});
