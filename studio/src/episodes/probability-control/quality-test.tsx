import React from 'react';
import {
  defineEpisode, Timeline, ShotMap, ShotProps, Hero, LOOKS, basePose, faceAt,
  camT, clamp, easeOut, kf, FocusRings, Sparkle, ChanceDesk, ChanceRoom,
  ChanceStreet, ChanceCave, ChancePanel, ProbabilityCoin, RockBurst,
  FONT, LEG_LEN
} from '../../engine';

/**
 * Original-architecture quality test, not the final episode.
 * Six hand-staged shots, using the real hero rig and scene kit.
 * Story beats: physical coin -> human reaction -> one active power -> walk
 * -> pavement cracks -> fall and survival. 13 seconds, 30 fps, portrait.
 *
 * This composition has no paid dependencies, no prerecorded sample footage,
 * and does not replace the existing 39-second ProbabilityControl episode.
 */
const P={paper:'#F7EFE3',gold:'#FFCB78',mint:'#6BF0C5',red:'#FF6977',ink:'#101726',steel:'#ADC9DC'};
const smooth=(v:number)=>{const x=clamp(v);return x*x*(3-2*x);};
const word=(text:string,x:number,y:number,size:number,color=P.paper,anchor:'middle'|'start'='middle')=>
  <text x={x} y={y} fontFamily={FONT.title} fontSize={size} fontWeight={850}
    textAnchor={anchor} fill={color} letterSpacing={1}>{text}</text>;
const View:React.FC<{cx?:number;cy?:number;z?:number;children:React.ReactNode}>=
  ({cx=540,cy=960,z=1,children})=><g transform={camT(cx,cy,z,540,960)}>{children}</g>;

const Actor:React.FC<{t:number;x:number;y:number;s:number;mode?:'smug'|'happy'|'walk'|'stumble'|'fall'|'trapped';light?:string}>=
  ({t,x,y,s,mode='smug',light='rimR'})=>{
  const step=Math.sin(t*.25);
  const walking=mode==='walk';
  const falling=mode==='fall';
  const stumble=mode==='stumble';
  const happy=mode==='happy';
  const trapped=mode==='trapped';
  const p={
    ...basePose,x,y,scale:s,
    yaw:mode==='smug'?.25:walking?.64:falling?-.2:0,
    tilt:falling?29+t*.42:stumble?17*smooth((t-14)/25):happy?-6*Math.sin(t*.1):0,
    spin:falling?45*smooth((t-18)/45):0,
    headTilt:falling?-10:stumble?-17*smooth((t-13)/26):happy?8*Math.sin(t*.15):0,
    squash:happy?-.06*Math.sin(t*.12):0,
    sway:walking?9*step:falling?23:0,
    armL:falling?{a:145,b:-30}:stumble?{a:146,b:-22}:happy?{a:148,b:-12}:walking?{a:18+31*step,b:-22}:{a:16,b:-12},
    armR:falling?{a:141,b:28}:stumble?{a:133,b:25}:happy?{a:158,b:15}:walking?{a:18-31*step,b:-15}:{a:42,b:-15},
    legL:falling?{a:48,b:-50}:stumble?{a:55,b:-46}:walking?{a:22*step,b:10*Math.max(0,-step)}:{a:7,b:0},
    legR:falling?{a:-45,b:45}:stumble?{a:-27,b:18}:walking?{a:-22*step,b:-10*Math.max(0,step)}:{a:-7,b:0},
    expr:(falling?'shock':stumble?'shock':trapped?'worried':happy?'happy':'smug') as typeof basePose.expr,
    glint:(mode==='smug'||happy) ? .11 : 0,
    glintColor:P.gold
  };
  return <Hero pose={{...p,...faceAt(t,[[0,p.expr],[23,stumble?'shock':p.expr]])}}
    look={LOOKS.pipHood} rimId={light} shadow={falling?0:.28}/>;
};

export const S1:React.FC<ShotProps>=({t})=>{
  const airtime=clamp(t/45),land=clamp((t-39)/17);
  const x=430+kf(t,[[0,-40],[20,80],[43,165],[65,175]]);
  const y=t<=43?1190-570*Math.sin(Math.PI*clamp(t/87))-t*2:865+12*Math.sin((t-43)*.55)*Math.exp(-(t-43)/10);
  const rz=Math.max(.1,Math.abs(Math.cos(t*.24)));
  return <g>
    <View cx={540} cy={990+12*smooth(t/65)} z={1.035+kf(t,[[0,0],[65,.065]])}>
      <ChanceDesk t={t}/>
      {/* A real reaching hand, attached to a sleeve instead of a floating prop. */}
      <g opacity={clamp((30-t)/12)} transform={'translate('+(-110+7*t)+' '+(-45+4*t)+') rotate(12 240 760)'}>
        <path d="M-100 500 Q92 520 260 785" fill="none" stroke="#10121E" strokeWidth={87} strokeLinecap="round"/>
        <path d="M-100 500 Q92 520 260 785" fill="none" stroke="#2E2B3D" strokeWidth={70} strokeLinecap="round"/>
        <ellipse cx={270} cy={787} rx={53} ry={36} fill={P.paper} stroke="#1B1B28" strokeWidth={9}/>
        <path d="M284 770 Q314 733 325 766" fill="none" stroke={P.paper} strokeWidth={19} strokeLinecap="round"/>
      </g>
      <ellipse cx={x+14} cy={1020} rx={85-45*land} ry={17-5*land}
        fill="#101322" opacity={.10+.24*land}/>
      <g transform={'translate('+x+' '+y+') scale(1 '+rz+')'}>
        <ProbabilityCoin x={0} y={0} t={t} s={1.05}/>
      </g>
      <g opacity={smooth((t-48)/9)}>
        <FocusRings t={t-50} x={x} y={880} color={P.gold} r0={70}/>
        <Sparkle t={t-49} x={x+105} y={860} s={1.8}/>
      </g>
    </View>
    <g opacity={smooth((t-48)/7)}>
      <rect x={170} y={320} width={740} height={126} rx={24} fill="#102037"
        stroke={P.gold} strokeWidth={5}/>
      {word('HEADS · 100%',540,409,72,P.gold)}
    </g>
    <g opacity={.67}>{word('01 / THE COIN',100,175,28,P.steel,'start')}</g>
  </g>;
};

export const S2:React.FC<ShotProps>=({t})=><g>
  <View cx={610+kf(t,[[0,55],[56,0]])} cy={1090} z={1.04+kf(t,[[0,0],[56,.13]])}>
    <ChanceRoom t={t}/>
    <ellipse cx={600} cy={1710} rx={188} ry={28} fill="#101320" opacity=".34"/>
    <Actor t={t} x={595} y={1410+3*Math.sin(t*.18)} s={2.1} mode="happy"/>
    <ellipse cx={900} cy={1415} rx={80} ry={11} fill="#0A0C16" opacity=".25"/>
    <g transform="translate(900 1350)">
      <ProbabilityCoin x={0} y={0} t={2} s={.45}/>
    </g>
  </View>
  <rect x={74} y={215} width={560} height={103} rx={18}
    fill="#101F36" stroke="#FFD68B" strokeWidth={4} opacity={.95}/>
  {word('EVERY TIME.',355,284,57,P.gold)}
  <g opacity={smooth((t-22)/12)}>
    <Sparkle t={t-22} x={780} y={830} s={1.8}/>
  </g>
</g>;

export const S3:React.FC<ShotProps>=({t})=>{
  const value=Math.round(80*(1-smooth(t/45)));
  const activate=smooth((t-33)/14);
  return <g>
    <View cx={550} cy={970} z={1.0+.07*smooth(t/52)}>
      <ChanceRoom t={t} dim/>
      <ellipse cx={540} cy={1710} rx={170} ry={22} fill="#101320" opacity=".3"/>
      <Actor t={t} x={535} y={1470} s={1.55} mode="smug" light="rimBlue"/>
      <circle cx={535} cy={1230} r={290+12*Math.sin(t*.1)}
        stroke={P.mint} strokeWidth={7+7*activate} opacity={activate*.76} fill={P.mint} fillOpacity={activate*.055}/>
      <circle cx={535} cy={1230} r={350} stroke={P.mint} strokeWidth={3} opacity={activate*.19} fill="none"/>
    </View>
    <rect x={92} y={390} width={896} height={312} rx={29}
      fill="#0D2036" stroke={activate>.4?P.mint:P.gold} strokeWidth={6}/>
    {word('CHANCE OF DYING',540,477,50,P.steel)}
    {word(value+'%',540,632,145,value===0?P.mint:P.gold)}
    {activate>.7&&<g opacity={activate}>
      <rect x={266} y={746} width={550} height={66} rx={17} fill="#0A352F"/>
      {word('PROTECTION ACTIVE',540,794,37,P.mint)}
    </g>}
  </g>;
};

export const S4:React.FC<ShotProps>=({t})=>{
  const x=320+250*smooth(t/69);
  const wob=Math.sin(t*.23);
  return <g>
    <View cx={540+kf(t,[[0,70],[68,-25]])} cy={960} z={1.02+kf(t,[[0,0],[68,.045]])}>
      <ChanceStreet t={t} id="quality-walk" rain/>
      {/* Strong, legible contact shadow at the consistent wet-road plane. */}
      <ellipse cx={x} cy={1508} rx={90} ry={16} fill="#0A0D19" opacity=".5"/>
      <ellipse cx={x} cy={1514} rx={54} ry={8} fill={P.gold} opacity=".13"/>
      <Actor t={t} x={x} y={1260+2.3*wob} s={1.72} mode="walk"/>
      {/* Light rain in the near foreground, not only behind the hero. */}
      {Array.from({length:11},(_,i)=>{
        const xx=(i*263+t*16)%1120,yy=(i*321+t*23)%1940;
        return <path key={i} d={'M'+xx+' '+yy+' l-14 64'}
          stroke="#C4E3FF" strokeWidth={3} opacity=".13"/>;
      })}
    </View>
    <rect x={100} y={158} width={365} height={78} rx={20} fill="#102A34" stroke={P.mint} strokeWidth={3}/>
    {word('0% DEATH',282,216,47,P.mint)}
  </g>;
};

export const S5:React.FC<ShotProps>=({t})=>{
  const crack=smooth((t-7)/29);
  const pit=smooth((t-34)/31);
  const stumble=smooth((t-22)/35);
  return <g>
    <View cx={540+kf(t,[[0,-28],[62,40]])} cy={960+kf(t,[[0,-30],[62,75]])} z={1.09+kf(t,[[0,0],[62,.15]])}>
      <ChanceStreet t={t} id="quality-crack" rain crack={crack} pit={pit}/>
      <ellipse cx={450} cy={1518} rx={90*(1-stumble)} ry={14} fill="#070A15" opacity={.45*(1-stumble)}/>
      <Actor t={t} x={448+60*stumble} y={1260+80*stumble} s={1.7} mode="stumble" light="rimRed"/>
      <RockBurst t={t-32} x={540} y={1530} size={.33}/>
      <g opacity={smooth((t-11)/14)}>
        <circle cx={500} cy={1530} r={45+60*Math.sin(t*.045)**2} stroke={P.red} strokeWidth={7} fill="none" opacity={.55}/>
      </g>
    </View>
    {t>39&&<g opacity={smooth((t-39)/8)}>
      {word('WAIT—',540,420,91,P.red)}
    </g>}
  </g>;
};

export const S6:React.FC<ShotProps>=({t})=>{
  const gravity=smooth((t-10)/56);
  const fallY=270+1390*gravity;
  const spin=kf(t,[[0,-15],[78,72]]);
  const p={
    ...basePose,x:580+110*Math.sin(t*.03),y:fallY,scale:1.55-.22*gravity,spin,
    tilt:24,headTilt:-9,expr:'shock' as const,armL:{a:143,b:-32},
    armR:{a:145,b:18},legL:{a:47,b:-40},legR:{a:-43,b:20},
    sway:22,blink:0,look:-.4
  };
  return <g>
    <View cx={540+kf(t,[[0,-12],[78,35]])} cy={960+kf(t,[[0,-80],[78,190]])} z={1.01+kf(t,[[0,0],[78,.09]])}>
      <ChanceCave t={t}/>
      <g opacity={.4}><path d="M320 0 L760 0 L660 1520 L430 1520Z" fill="#A2D8F8" opacity=".18"/></g>
      <g opacity={.75}>
        {Array.from({length:31},(_,i)=>{
          const q=smooth((t-(i%5)*3)/65);
          const x=70+(i*137)%950+Math.sin(i*2.4)*q*115;
          const y=110+((i*91+t*(5+(i%4)*2))%1710);
          return <g key={i}>
            <rect x={x} y={y} width={12+(i%4)*10} height={9+(i%3)*10}
              transform={'rotate('+(t*3+i*39)+' '+x+' '+y+')'}
              fill={i%2?'#6E7B90':'#8999AD'}/>
          </g>;
        })}
      </g>
      <Hero pose={{...p,...faceAt(t,[[0,'shock'],[65,'worried']])}}
        look={LOOKS.pipHood} rimId="rimBlueL" shadow={0}/>
      <g opacity={smooth((t-56)/15)}>
        <rect x={-80} y={1730} width={1240} height={360} fill="#141B2C" opacity=".7"/>
        <path d="M-80 1735 L500 1680 L1120 1760" stroke="#7D899E" strokeWidth={24}/>
      </g>
    </View>
    {t>59&&<g opacity={smooth((t-59)/10)}>
      <rect x={120} y={250} width={840} height={168} rx={27} fill="#0F2236"
        stroke={P.mint} strokeWidth={5}/>
      {word('STILL ALIVE.',540,361,83,P.mint)}
    </g>}
  </g>;
};

const ids=[
  {id:'COIN',end:66,label:'Physical coin toss / insert',key:58},
  {id:'REACTION',end:126,label:'Character reaction / motivated move',key:102},
  {id:'POWER',end:180,label:'Zero-death protection / HUD',key:175},
  {id:'WALK',end:249,label:'Lit city walk / tracked camera',key:225},
  {id:'CRACK',end:312,label:'Physical ground crack / stumble',key:290},
  {id:'FALL',end:390,label:'Falling character / depth and dust',key:382}
] as const;
const shots:ShotMap={COIN:S1,REACTION:S2,POWER:S3,WALK:S4,CRACK:S5,FALL:S6};
const segments=ids.map((q,i)=>{
  const a=i===0?0:ids[i-1].end;
  return {shot:q.id,a,b:q.end,t0:0,t1:q.end-a};
});
const timeline:Timeline={
  slug:'probability-quality-test',title:'Probability Control — Quality Benchmark',
  fps:30,total:390,
  segments,
  shots:ids.map((q,i)=>({
    id:q.id,size:q.label,key:q.key-(i===0?0:ids[i-1].end),
    len:q.end-(i===0?0:ids[i-1].end),first:i===0?0:ids[i-1].end,
    line:q.label,note:'Compare physical acting, light direction, camera movement and clarity'
  })),
  fx:[{f:282,kind:'shake',amp:7,len:20},{f:314,kind:'flash',color:'#DDE8FF',o:.25}],
  audio:{}
};
export const probabilityQualityTest=defineEpisode('ProbabilityQualityTest',{
  timeline,shots,width:1080,height:1920,grain:true,vignette:true,bg:'#0C1222'
});
