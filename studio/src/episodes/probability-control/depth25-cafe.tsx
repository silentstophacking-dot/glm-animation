import React from 'react';
import {
  defineEpisode, Timeline, ShotProps, DepthLayer, DepthCamera,
  PerspectiveFloor, ExtrudedBox, Glow, Haze, Dust, rnd,
  basePose, poseAt, faceAt, easeOut, kf, FONT
} from '../../engine';
import {ReferenceHero} from './reference-hero';

/**
 * 7-second 2.5D café proof. Every visible object is an SVG shape.
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
  <rect x="-340" y={165} width={1800} height={950} fill={COLOR.wall}/>
  <rect x="-360" y={165} width={1850} height={18} fill="#271C31"/>
  <rect x="-350" y={255} width={1830} height={16} fill="#4E3A49"/>
  <rect x="-350" y={928} width={1850} height={176} fill="#211A2B"/>
  <path d="M-350 925 H1480" stroke="#EDAC87" strokeWidth={7} opacity=".33"/>
  {/* Recessed illuminated windows and inset frames. */}
  {[0,1,2,3,4,5].map((i)=>{
    const x=30+i*206;
    return <g key={i}>
      <rect x={x} y={335} width={173} height={556} fill="#251C2E"/>
      <rect x={x+11} y={347} width={151} height={528} fill="#C48B7B"/>
      <rect x={x+11} y={347} width={151} height={528} fill="url(#cafe25Sun)" opacity=".35"/>
      <path d={'M'+(x+82)+' 350 V875 M'+(x+11)+' 606 H'+(x+161)}
        stroke="#4D3340" strokeWidth={10}/>
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
      headTilt:-7,armR:{a:82,b:-20},armL:{a:120,b:17}}},
    {f:44,p:{headTilt:6,armR:{a:135,b:-22},armL:{a:128,b:8},sway:6}},
    {f:102,p:{headTilt:-4,armR:{a:97,b:-26},armL:{a:155,b:10},tilt:3}},
    {f:142,p:{headTilt:8,armR:{a:144,b:-18},tilt:-5,sway:-5}},
    {f:205,p:{headTilt:0,armR:{a:145,b:-6},tilt:0,sway:0}}
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
      pose={{...p,...faceAt(t,[[0,'smug'],[46,'happy'],[118,'shock'],[151,'happy']])}}
      rimId="rimR" shadow={.28}/>
  </g>;
};

const ForegroundCustomer:React.FC<{t:number}>=({t})=><g>
   <ReferenceHero variant="gold-cap"
      pose={{...basePose,x:1180,y:1460,scale:2.24,yaw:-.30,
        armL:{a:35,b:-10},armR:{a:103+7*Math.sin(t/28),b:10},
        headTilt:-2,expr:'neutral'}}
      rimId="rimR" shadow={0}/>
   <rect x="1105" y="1580" width="470" height="350" fill="#1C1723" opacity=".11"/>
 </g>;

/** A 6.5 second continuous scene; parallax is visible during tracking and dolly. */
const TwoPointFiveCafe:React.FC<ShotProps>=({t})=>{
  const travel=smooth(t/195);
  const camera:DepthCamera={
    panX:-185+330*travel,
    panY:-30+50*travel,
    push:.03+.36*smooth((t-45)/140),
    anchorX:550,
    anchorY:1080
  };
  const words=smooth((t-5)/15)*(1-smooth((t-150)/25));
  return <g>
    <DepthLayer camera={camera} depth={-1.25}>
      <BackgroundSky t={t}/>
    </DepthLayer>
    <DepthLayer camera={camera} depth={-.75} opacity={.79}>
      <Skyline t={t} near/>
    </DepthLayer>
    <DepthLayer camera={camera} depth={-.3}>
      <CafeArchitecture t={t}/>
    </DepthLayer>
    <DepthLayer camera={camera} depth={.10}>
      <rect x={-800} y={985} width={3200} height={1700} fill="#2C2130"/>
      <PerspectiveFloor horizon={990} bottom={2450} nearWidth={3000}
        tilesAcross={14} rows={18} fill="#352636" stroke="#B08683"/>
      <ellipse cx={545} cy={1450} rx={700} ry={210} fill="#F7AB79" opacity=".055"/>
    </DepthLayer>
    <DepthLayer camera={camera} depth={.70}>
      <CharacterAndChair t={t}/>
    </DepthLayer>
    <DepthLayer camera={camera} depth={1.00}>
      <CafeTable t={t}/>
    </DepthLayer>
    <DepthLayer camera={camera} depth={1.28}>
      <ExtrudedBox x={-120} y={1670} w={310} h={190} depthX={75}
        depthY={-62} front="#392B3A" side="#221B2A" top="#806274"/>
      <path d="M60 1640 L92 1480" stroke="#2C2630" strokeWidth={22}/>
      <ellipse cx={101} cy={1480} rx={65} ry={16} fill="#514051"/>
    </DepthLayer>
    <DepthLayer camera={camera} depth={1.91} blur={6} opacity={.96}>
      <ForegroundCustomer t={t}/>
    </DepthLayer>
    <DepthLayer camera={camera} depth={2.1}>
      <path d="M-600 -180 H1700 V94 H-600Z" fill="#120D1B"/>
      <path d="M-500 96 H1730" stroke="#C78D77" strokeWidth={8} opacity=".32"/>
      <path d="M 105 95 V260 M935 95 V245" stroke="#2B1E2D" strokeWidth={9}/>
      <ellipse cx="105" cy="262" rx="28" ry="14" fill="#E3AB7A" opacity=".75"/>
      <ellipse cx="935" cy="244" rx="28" ry="14" fill="#E3AB7A" opacity=".75"/>
    </DepthLayer>
    <g opacity={words}>
      <rect x="68" y="110" width="944" height="195" rx={28}
        fill="#1D1425" opacity=".81" stroke="#F0B381" strokeWidth={3}/>
      {title('2.5D • ALL MADE IN CODE',199,56)}
      {title('SVG PARALLAX + PERSPECTIVE',265,33,'#FFD6A4')}
    </g>
    <g opacity={smooth((t-155)/20)}>
      <rect x="112" y="1632" width="856" height="126" rx={20}
        fill="#1E1423" stroke="#E2B48A" strokeWidth={3} opacity=".88"/>
      {title('NO 3D SOFTWARE NEEDED',1718,45)}
    </g>
  </g>;
};
const timeline:Timeline={
  slug:'code-only-2p5d-cafe',
  title:'2.5D Parallax: Perspective Café without any 3D tools',
  fps:30,total:195,
  segments:[{shot:'CAFE',a:0,b:195,t0:0,t1:195}],
  shots:[{id:'CAFE',size:'continuous moving camera / four depth planes',first:0,key:116,
    len:195,line:'A 2.5D world built with only SVG'}],
  fx:[],
  audio:{}
};
export const probability2p5dCafe=defineEpisode('Probability2p5dCafe',{
  timeline,shots:{CAFE:TwoPointFiveCafe},
  width:1080,height:1920,grain:true,vignette:true,bg:COLOR.night
});
