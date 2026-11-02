import React from 'react';
import {
  defineEpisode, Timeline, ShotProps, DepthLayer, DepthCamera,
  PerspectiveFloor, ExtrudedBox, Glow, Haze, Dust, rnd,
  basePose, poseAt, faceAt, easeOut, kf, FONT
} from '../../engine';
import {ReferenceHero} from './reference-hero';

/**
 * Locked-subject 6.5-second 2.5D proof, entirely SVG and code rendered.
 * The protagonist, chair, coin, tabletop and floor share ONE static world plane.
 * A virtual camera translates only the world BEHIND the seated hero, like
 * a gentle subject-tracking camera. They no longer slide apart on screen.
 * This is NOT a 3D scene or textured asset: the foreground, character,
 * tabletop, architecture, and skyline respond to different camera motions.
 * 
 * User reference aesthetic: minimalist circular-head stick characters,
 * warm dusk cafe / lab sets, dark outlines and soft foreground framing.
 */
const COLOR={
 night:'#221725',violet:'#4A3049',wall:'#3A2A3A',wallTrim:'#241C2D',
 coral:'#E9533D',pink:'#C07C81',warm:'#FFC98D',gold:'#FFDB8A',
 floor:'#322434',white:'#FFF5D7',blue:'#798B9A'
};
const smooth=(x:number)=>{const t=Math.min(1,Math.max(0,x));return t*t*(3-2*t)};
const title=(t:string,y:number,size:number,fill=COLOR.white)=>
  <text x="540" y={y} textAnchor="middle" fill={fill}
    fontFamily={FONT.title} fontWeight={850} fontSize={size}
    letterSpacing={2}>{t}</text>;

/** Distant rooftops: moving at roughly 10%-20% of the foreground speed. */
const Skyline:React.FC<{t:number;near?:boolean}>=({t,near=false})=>{
  const base=near?930:860;
  return <g>
   {Array.from({length:17},(_,i)=>{
      const x=-145+i*86+rnd(37,i)*33;
      const w=62+rnd(38,i)*49;
      const h=(near?160:95)+rnd(39,i)*(near?280:210);
      const top=base-h;
      const shade=near?(i%2?'#634557':'#4B364E'):(i%2?'#9C707B':'#8A627C');
      return <g key={i} opacity={near?.86:.64}>
        <rect x={x} y={top} width={w} height={h+200} fill={shade}/>
        {Array.from({length:5},(_,j)=>{
          const y=top+22+j*32;
          return y<base-12?<rect key={j} x={x+13+(j%2)*17} y={y}
             width={9} height={14} fill="#FAD49D"
             opacity={j%3===0?.65:.26}/>:null;
        })}
        {i%4===0&&<path d={'M'+(x+w*.5)+' '+top+' v-52'} stroke="#514051" strokeWidth={5}/>}
      </g>;
   })}
  </g>;
};

const BackgroundSky:React.FC<{t:number}>=({t})=><g>
   <defs>
      <linearGradient id="cafe25Sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#473149"/>
        <stop offset="47%" stopColor="#AB7480"/>
        <stop offset="78%" stopColor="#E3A179"/>
        <stop offset="100%" stopColor="#8B5E70"/>
      </linearGradient>
      <radialGradient id="cafe25Sun">
        <stop offset="0%" stopColor="#FFF0B7" stopOpacity=".75"/>
        <stop offset="38%" stopColor="#FFCA95" stopOpacity=".23"/>
        <stop offset="100%" stopColor="#FFCA95" stopOpacity="0"/>
      </radialGradient>
   </defs>
   <rect x="-800" y="-900" width="3000" height="3000" fill="url(#cafe25Sky)"/>
   <circle cx={840} cy={560} r={610} fill="url(#cafe25Sun)"/>
   <circle cx={840} cy={560} r={90} fill="#FFE9B4" opacity=".89"/>
   {[0,1,2,3,4].map((i)=>{
     const cx=130+i*295+t*.11*(i%2?1:-1);
     const y=420+i%3*95;
     return <g key={i} filter="url(#blur16)">
        <ellipse cx={cx} cy={y} rx={155+i%2*65} ry={20} fill="#9E718D" opacity=".25"/>
        <ellipse cx={cx+30} cy={y+13} rx={160} ry={12} fill="#FFD3A0" opacity=".18"/>
     </g>
   })}
   <Skyline t={t}/>
 </g>;

/** Café wall sits between far skyline and the performer. */
const CafeArchitecture:React.FC<{t:number}>=({t})=><g>
  {/* The windows are ACTUAL CUTOUTS. The far sky and skyline are visible
      through them, so the moving background parallax isn't just painted on. */}
  <defs>
    <mask id="cafeCutoutsV2" maskUnits="userSpaceOnUse" x="-500" y="0"
      width="2400" height="1600">
      <rect x="-500" y="0" width="2400" height="1600" fill="white"/>
      {[0,1,2,3,4,5].map(i=><rect key={i}
        x={41+i*206} y={347} width={151} height={528} fill="black"/>)}
    </mask>
    <linearGradient id="cafeWall25V2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#302335"/>
      <stop offset=".53" stopColor="#45303E"/>
      <stop offset="1" stopColor="#2B2030"/>
    </linearGradient>
  </defs>
  <rect x="-340" y={165} width={1800} height={950}
    fill="url(#cafeWall25V2)" mask="url(#cafeCutoutsV2)"/>
  <rect x="-360" y={165} width={1850} height={18} fill="#271C31"/>
  <rect x="-350" y={255} width={1830} height={16} fill="#4E3A49"/>
  <rect x="-350" y={928} width={1850} height={176} fill="#211A2B"/>
  <path d="M-350 925 H1480" stroke="#EDAC87" strokeWidth={7} opacity=".33"/>
  {/* Recessed illuminated windows and inset frames. */}
  {[0,1,2,3,4,5].map((i)=>{
    const x=30+i*206;
    return <g key={i}>
      <rect x={x} y={335} width={173} height={556} fill="none"
        stroke="#241A2B" strokeWidth={18}/>
      <rect x={x+11} y={347} width={151} height={528}
        fill="#FFBF8B" fillOpacity={.085}/>
      <rect x={x+11} y={347} width={151} height={528}
        fill="url(#cafe25Sun)" opacity=".18"/>
      <rect x={x+11} y={347} width={151} height={528} fill="none"
        stroke="#B17B70" strokeWidth={3} opacity=".46"/>
      <path d={'M'+(x+82)+' 350 V875 M'+(x+11)+' 606 H'+(x+161)}
        stroke="#4D3340" strokeWidth={10}/>
      <path d={'M'+(x+94)+' 350 V873'} stroke="#FFE0AB"
        strokeWidth={3} opacity=".22"/>
      <path d={'M'+(x+21)+' 363 L'+(x+63)+' 363 L'+(x+26)+' 860 Z'}
        fill="#FFE3BA" opacity=".055"/>
      <rect x={x-15} y={318} width={204} height={22} fill="#211729"/>
      <rect x={x-17} y={876} width={210} height={15} fill="#281D29"/>
      <path d={'M'+(x+20)+' 355 L'+(x+20)+' 844'}
        stroke="#FFE2B3" strokeWidth={6} opacity=".07"/>
      {/* Small lamps on the back wall give a reason for the warm spill. */}
      <path d={'M'+(x+86)+' 307 v-51'} stroke="#201827" strokeWidth={5}/>
      <path d={'M'+(x+64)+' 307 Q'+(x+86)+' 279 '+(x+108)+' 307 Z'}
        fill="#E8A77B" opacity=".78"/>
    </g>;
  })}
  {/* Red striped café awning, sharp silhouette: exterior from supplied refs. */}
  <path d="M-150 264 L1260 264 L1340 358 H-220Z" fill="#D7AC9C"/>
  {Array.from({length:8},(_,i)=><path key={i} 
     d={'M'+(-170+i*185)+' 264 L'+(-170+i*185+90)+' 264 L'+(-200+i*190+110)+' 358 L'+(-200+i*190+20)+' 358Z'}
     fill="#8F4D57" opacity=".83"/>)}
  <path d="M-220 358 H1340" stroke="#6B3C45" strokeWidth={14}/>
  <rect x="-170" y={1116} width={1600} height={24} fill="#544150"/>
  {/* Shop wall columns are flat rectangles with bright and dark faces. */}
  {[ -30,1250 ].map((x)=><g key={x}>
     <rect x={x-22} y={270} width={54} height={735} fill="#3A2939"/>
     <path d={'M'+(x+24)+' 270 V1005'} stroke="#A87570" strokeWidth={5} opacity=".32"/>
  </g>)}
  <Glow x={760} y={480} r={550} o={.34}/>
 </g>;

/** Deliberately flat table with a top, a dark side face and actual contact shadows. */
const CafeTable:React.FC<{t:number}>=({t})=><g>
  <ellipse cx={560} cy={1570} rx={360} ry={68} fill="#120C1A" opacity=".46"/>
  <path d="M255 1350 Q560 1436 870 1350 L820 1660 Q560 1745 298 1654 Z"
    fill="#493449" stroke="#211A2A" strokeWidth={8}/>
  {Array.from({length:7},(_,i)=>
    <path key={i} d={'M'+(280+i*85)+' 1380 L'+(290+i*80)+' 1670'}
      stroke="#251D2D" strokeWidth={4} opacity=".45"/>)}
  <ellipse cx={560} cy={1347} rx={315} ry={67}
    fill="#6F536B" stroke="#D7A080" strokeWidth={9}/>
  <ellipse cx={560} cy={1340} rx={304} ry={54} fill="#796077" opacity=".5"/>
  {/* Flat oval contact mark under the cup. */}
  <ellipse cx={745} cy={1342} rx={75} ry={20} fill="#271D2A" opacity=".32"/>
  {/* Probability-themed coin on the same tabletop plane: a bounce and settle.
      Shadows are grounded to the oval, instead of floating in screen space. */}
  {(() => {
     const u=Math.min(1,Math.max(0,(t-33)/90));
     const air=t<33?0:t<121?Math.abs(Math.sin(u*Math.PI*2))*64*(1-u*.52):0;
     const coinX=442+35*Math.min(1,t/130);
     const coinY=1323-air;
     const squish=t<118?Math.max(.10,Math.abs(Math.cos((t-33)*.23))):1;
     const glow=t>122?Math.min(1,(t-122)/12):0;
     return <g>
       <ellipse cx={coinX} cy="1330" rx={38} ry={12}
         fill="#100B19" opacity={.22+.17*(1-air/64)}/>
       <g transform={'translate('+coinX+' '+coinY+') scale('+squish+' 1)'}>
         <circle cx="0" cy="0" r={27} fill="#FFC961" stroke="#B77535" strokeWidth={5}/>
         <circle cx="0" cy="0" r={19} fill="none" stroke="#FFF0BA" strokeWidth={3}/>
         <path d="M-9 -11 V11 M9 -11 V11 M-9 0 H9"
           stroke="#9D6028" strokeWidth={4} strokeLinecap="round"/>
       </g>
       {glow>0&&<g opacity={glow}>
         <circle cx={coinX} cy={coinY} r={44}
           stroke="#FFE3A9" strokeWidth={3} fill="none"/>
         <circle cx={coinX} cy={coinY} r={75}
           stroke="#FFE3A9" strokeWidth={2} fill="none" opacity=".4"/>
       </g>}
     </g>;
  })()}
  <g transform={'translate(746 '+(1288+1.5*Math.sin(t/18))+')'}>
    <path d="M-30 8 L30 8 L24 55 Q0 65 -24 55Z" fill="#F2E4D8"
      stroke="#B58F83" strokeWidth={3}/>
    <ellipse cx={0} cy={9} rx={30} ry={9} fill="#F9EFE0"/>
    <ellipse cx={0} cy={8} rx={24} ry={5} fill="#674738"/>
    <path d="M28 17 Q51 13 47 35 Q42 49 23 41" fill="none"
      stroke="#EFE2D4" strokeWidth={8}/>
    {[0,1].map((i)=><path key={i}
      d={'M'+(-11+i*18)+' -6 q-12 -22 2 -40 q11 -15 0 -30'}
      fill="none" stroke="#FFE6C9" strokeWidth={5} opacity={.2+.13*Math.sin(t/13+i)}/>)}
  </g>
  {/* Highlight on the table's curved near edge. */}
  <path d="M255 1351 Q560 1440 870 1351"
    stroke="#E8AE88" strokeWidth={5} fill="none" opacity=".48"/>
 </g>;

const CharacterAndChair:React.FC<{t:number}>=({t})=>{
  const p=poseAt(t,[
    {f:0,p:{x:570,y:1320,scale:1.66,yaw:.22,
      headTilt:-5,armR:{a:22,b:-15},armL:{a:23,b:10}}},
    {f:40,p:{headTilt:-9,armR:{a:54,b:-19},armL:{a:30,b:11},sway:4}},
    {f:86,p:{headTilt:8,armR:{a:85,b:-27},armL:{a:18,b:15},tilt:3}},
    {f:126,p:{headTilt:-14,armR:{a:132,b:-22},armL:{a:39,b:6},tilt:-4,sway:5}},
    {f:161,p:{headTilt:1,armR:{a:114,b:-13},armL:{a:44,b:5},tilt:2,sway:-3}},
    {f:194,p:{headTilt:5,armR:{a:60,b:-12},armL:{a:29,b:11},tilt:0,sway:0}}
  ]);
  return <g>
    {/* The chair and person move as one mid-distance plane. */}
    <g opacity=".8">
      <path d="M396 1290 Q392 1185 428 1172 H689 Q731 1190 721 1305
        M427 1380 L408 1600 M689 1383 L715 1602"
        fill="none" stroke="#2A1D29" strokeWidth={22} strokeLinecap="round"/>
      <path d="M408 1287 H712" stroke="#AC7870" strokeWidth={9} opacity=".56"/>
    </g>
    <ellipse cx={575} cy={1624} rx={128} ry={25} fill="#100C19" opacity=".43"/>
    <ReferenceHero variant="coral"
      pose={{...p,...faceAt(t,[[0,'smug'],[52,'neutral'],[117,'shock'],[147,'happy']])}}
      rimId="rimR" shadow={.28}/>
  </g>;
};

const ForegroundCustomer:React.FC<{t:number}>=({t})=><g>
   {/* Right-hand passerby stays cropped at the EDGE of the frame. No more
       huge yellow head blocking the protagonist during the final push-in. */}
   <ReferenceHero variant="gold-cap"
      pose={{...basePose,x:1530+45*Math.sin(t/70),y:1450,scale:1.46,yaw:-.38,
        armL:{a:25,b:-10},armR:{a:45+5*Math.sin(t/28),b:10},
        headTilt:-2,expr:'neutral'}}
      rimId="rimR" shadow={0}/>
   <rect x="1440" y="1600" width="330" height="240" fill="#1C1723" opacity=".08"/>
 </g>;

/** Locked stage: main subject and table stay perfectly anchored on screen. */
const TwoPointFiveCafe:React.FC<ShotProps>=({t})=>{
  const travel=smooth(t/195);
  // All subjects sharing this camera remain in EXACTLY the same reference
  // coordinate system. Nothing in the hero / table / chair gets pan or zoom.
  const fixed:DepthCamera={
    panX:0, panY:0, push:0,
    anchorX:540, anchorY:1030
  };
  // Only the environment responds to a subtle virtual camera track.
  // A real 2.5D feel comes from independent background rates while the
  // main character is pinned to the screen's composition, like a follow-cam.
  const scenery:DepthCamera={
    panX:-92+184*travel,
    panY:0,
    push:0,
    anchorX:540,
    anchorY:1030
  };
  const words=smooth((t-5)/15)*(1-smooth((t-150)/25));
  return <g>
    <DepthLayer camera={scenery} depth={-1.25}>
      <BackgroundSky t={t}/>
    </DepthLayer>
    <DepthLayer camera={scenery} depth={-.75} opacity={.86}>
      <Skyline t={t} near/>
    </DepthLayer>
    <DepthLayer camera={scenery} depth={-.3}>
      <CafeArchitecture t={t}/>
    </DepthLayer>
    <DepthLayer camera={fixed} depth={.10}>
      <rect x={-800} y={985} width={3200} height={1700} fill="#2C2130"/>
      <PerspectiveFloor horizon={990} bottom={2450} nearWidth={3000}
        tilesAcross={14} rows={18} fill="#352636" stroke="#B08683"/>
      <ellipse cx={545} cy={1450} rx={700} ry={210} fill="#F7AB79" opacity=".055"/>
    </DepthLayer>
    <DepthLayer camera={fixed} depth={.70}>
      <CharacterAndChair t={t}/>
    </DepthLayer>
    <DepthLayer camera={fixed} depth={1.00}>
      <CafeTable t={t}/>
    </DepthLayer>
    <DepthLayer camera={fixed} depth={1.28}>
      <ExtrudedBox x={-120} y={1670} w={310} h={190} depthX={75}
        depthY={-62} front="#392B3A" side="#221B2A" top="#806274"/>
      <path d="M60 1640 L92 1480" stroke="#2C2630" strokeWidth={22}/>
      <ellipse cx={101} cy={1480} rx={65} ry={16} fill="#514051"/>
    </DepthLayer>
    <DepthLayer camera={fixed} depth={1.91} blur={10} opacity={.50}>
      <ForegroundCustomer t={t}/>
    </DepthLayer>
    <DepthLayer camera={fixed} depth={2.1}>
      {/* Close wooden jamb stays fixed in the anchored shot. The wall and
          distant skyline slide modestly behind it, without subject drift. */}
      <rect x="-300" y="-250" width="120" height="2200" fill="#251A29"/>
      <rect x="-205" y="-250" width="20" height="2200" fill="#AE7869" opacity=".44"/>
      <rect x="-184" y="-250" width="13" height="2200" fill="#120D1B"/>
      <path d="M-600 -180 H1700 V94 H-600Z" fill="#120D1B"/>
      <path d="M-500 96 H1730" stroke="#C78D77" strokeWidth={8} opacity=".32"/>
      <path d="M 105 95 V260 M935 95 V245" stroke="#2B1E2D" strokeWidth={9}/>
      <ellipse cx="105" cy="262" rx="28" ry="14" fill="#E3AB7A" opacity=".75"/>
      <ellipse cx="935" cy="244" rx="28" ry="14" fill="#E3AB7A" opacity=".75"/>
    </DepthLayer>
    <g opacity={words}>
      <rect x="68" y="110" width="944" height="195" rx={28}
        fill="#1D1425" opacity=".81" stroke="#F0B381" strokeWidth={3}/>
      {title('2.5D WITH A FIXED SUBJECT',199,51)}
      {title('BACKGROUND DEPTH • STABLE CHARACTER',265,29,'#FFD6A4')}
    </g>
    <g opacity={smooth((t-155)/20)}>
      <rect x="112" y="1632" width="856" height="126" rx={20}
        fill="#1E1423" stroke="#E2B48A" strokeWidth={3} opacity=".88"/>
      {title('SAME SPOT. BETTER DEPTH.',1718,42)}
    </g>
  </g>;
};
const timeline:Timeline={
  slug:'code-only-2p5d-cafe-locked',
  title:'2.5D V3: Locked character and table, subtle scenic parallax',
  fps:30,total:195,
  segments:[{shot:'CAFE',a:0,b:195,t0:0,t1:195}],
  shots:[{id:'CAFE',size:'continuous moving camera / four depth planes',first:0,key:116,
    len:195,line:'A 2.5D world built with only SVG'}],
  fx:[],
  audio:{}
};
export const probability2p5dCafeLocked=defineEpisode('Probability2p5dCafeLocked',{
  timeline,shots:{CAFE:TwoPointFiveCafe},
  width:1080,height:1920,grain:true,vignette:true,bg:COLOR.night
});
