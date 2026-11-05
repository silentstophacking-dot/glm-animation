import React from 'react';
import {useCurrentFrame} from 'remotion';
import {LabWindowScenery,LabBenchGlassware} from './cinematic-lab';
import {RichLabWindowScenery,RichLabWorldDetails,RichLabSecondaryDetails} from './lab-rich-world';
import {CinematicLabClock,ClockWallDetail} from './cinematic-lab-clock';
import {LabClock} from './lab-clock';
import {LabConsole} from './lab-console';
import {CharacterTurnV5} from './character-turn-v5';
import {planeTransform,floorPolygon,WorldCamera} from './pseudo-depth-camera';
import {RoomCuboid as Box,RoomFace,RoomLine,floorEllipse,roomCameraAt,W,ROOM_ACTOR,FOREGROUND_BENCHES,RoomActorPerformance} from './lab-room-geometry';

const Glass:React.FC<{id:string;x:number;y:number;z:number;camera:WorldCamera}>=({id,x,y,z,camera})=><g transform={planeTransform(W(x,y,z),camera)}>
 <defs><linearGradient id={id+'glass'} x2="1"><stop stopColor="#C7B491" stopOpacity=".12"/><stop offset=".3" stopColor="#CABCA1" stopOpacity=".3"/><stop offset="1" stopColor="#497782" stopOpacity=".22"/></linearGradient></defs>
 <path d="M-13 -190H13V-112L58 -24Q68 -3 46 0H-46Q-68 -3 -58 -24L-13 -112Z" fill={`url(#${id}glass)`} stroke="#7E9799" strokeWidth="1.6"/>
 <path d="M-45 -31Q0 -23 45 -31L50 -10Q0 0 -50 -10Z" fill="#927B4F" opacity=".4"/>
 <path d="M-8 -181V-112L-40 -33" fill="none" stroke="#CEC5AB" strokeWidth="3" opacity=".35"/>
 <ellipse cy="-190" rx="15" ry="4" fill="#213A46" stroke="#AEAAA0" strokeWidth="1.5"/>
</g>;

export const LabRoomDepthScene:React.FC<{id:string;frame:number;camera?:WorldCamera;performance?:RoomActorPerformance;clockSeconds?:number;signal?:number;clockStyle?:'simple'|'cinematic';richWorld?:boolean}>=({id,frame,camera,performance,clockSeconds,signal,clockStyle='simple',richWorld=false})=>{
 const c=camera??roomCameraAt(frame),origin=performance?.origin??ROOM_ACTOR.origin,actorScale=performance?.scale??ROOM_ACTOR.scale,u=(s:string)=>`url(#${id+s})`;
 const windowPoints=[W(-1100,340,800),W(-100,340,800),W(-100,940,800),W(-1100,940,800)];
 return <g>
  <defs>
   <linearGradient id={id+'wall'} x2="1" y2=".6"><stop stopColor="#3A2C40"/><stop offset="1" stopColor="#1D293A"/></linearGradient>
   <linearGradient id={id+'floor'} x2="0" y2="1"><stop stopColor="#57434E"/><stop offset="1" stopColor="#141F30"/></linearGradient>
   <linearGradient id={id+'wood'} x2="0" y2="1"><stop stopColor="#64505B"/><stop offset="1" stopColor="#292936"/></linearGradient>
   <linearGradient id={id+'haze'} x2=".3" y2="1"><stop stopColor="#F9D2A0" stopOpacity=".065"/><stop offset="1" stopColor="#F9D2A0" stopOpacity="0"/></linearGradient>
   <radialGradient id={id+'pool'}><stop stopColor="#E3AD7C" stopOpacity=".19"/><stop offset="1" stopColor="#E3AD7C" stopOpacity="0"/></radialGradient>
   <radialGradient id={id+'vignette'}><stop offset=".4" stopColor="#070E1A" stopOpacity="0"/><stop offset="1" stopColor="#070E1A" stopOpacity=".55"/></radialGradient>
   <clipPath id={id+'windowClip'}><path d={floorPolygon(windowPoints,c)}/></clipPath>
   <clipPath id={id+'consoleFace'}><rect x="831" y="505" width="115" height="64" rx="4"/></clipPath>
   <filter id={id+'fg'} x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="3"/></filter>
   <filter id={id+'shade'} x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <rect width="1920" height="1080" fill="#192334"/>
  {/* Architecture is fixed world geometry, not a separately moving picture. */}
  <RoomFace points={[W(-1600,0,800),W(1600,0,800),W(1600,1050,800),W(-1600,1050,800)]} camera={c} fill={u('wall')}/>
  <RoomFace points={[W(-1600,0,-600),W(-1600,0,800),W(-1600,1050,800),W(-1600,1050,-600)]} camera={c} fill="#252738"/>
  <RoomFace points={[W(1600,0,800),W(1600,0,-600),W(1600,1050,-600),W(1600,1050,800)]} camera={c} fill="#19283A"/>
  <RoomFace points={[W(-1600,1050,-600),W(-1600,1050,800),W(1600,1050,800),W(1600,1050,-600)]} camera={c} fill="#151D2D"/>
  {[400,650].map(z=><Box key={'ceiling-beam'+z} box={{x0:-1600,x1:1600,y0:1018,y1:1050,z0:z,z1:z+24}} camera={c} front="#212639" side="#303247" top="#3B3545"/>)}
  <RoomFace points={[W(-1600,0,800),W(1600,0,800),W(1600,0,-700),W(-1600,0,-700)]} camera={c} fill={u('floor')}/>
  {Array.from({length:17},(_,i)=><RoomLine key={'floor-x'+i} a={W(-1600+i*200,0,-700)} b={W(-1600+i*200,0,800)} camera={c} stroke="#AB8A82" opacity={.14}/>) }
  {[-600,-400,-200,0,200,400,600,800].map(z=><RoomLine key={'floor-z'+z} a={W(-1600,0,z)} b={W(1600,0,z)} camera={c} stroke="#AB8A82" opacity={.14}/>) }
  <path d={floorEllipse(-400,400,700,320,c)} fill={u('pool')}/>
  {/* The old skyline artwork is behind the aperture, independently of its frame. */}
  <g clipPath={u('windowClip')}><g transform={planeTransform(W(-600,640,1350),c)}><svg x="-750" y="-450" width="1500" height="900" viewBox="210 170 700 510" preserveAspectRatio="none">{richWorld?<RichLabWindowScenery id={id+'cityRich'} sunX={400}/>:<LabWindowScenery id={id+'city'} sunX={400}/>}</svg></g></g>
  {[{x0:-1120,x1:-1100,y0:320,y1:960},{x0:-100,x1:-80,y0:320,y1:960},{x0:-1100,x1:-100,y0:940,y1:960}].map((b,i)=><Box key={'window-frame'+i} box={{...b,z0:775,z1:825}} camera={c} front="#3F3543" side="#211F30" top="#8D7468"/>)}
  {[-770,-435].map(x=><Box key={x} box={{x0:x-7,x1:x+7,y0:340,y1:940,z0:777,z1:815}} camera={c} front="#392E3A" side="#1D2330" top="#AE8A6C"/>)}
  <Box box={{x0:-1100,x1:-100,y0:572,y1:584,z0:777,z1:815}} camera={c} front="#392E3A" top="#A08775"/>
  <Box box={{x0:-1130,x1:-70,y0:320,y1:340,z0:730,z1:830}} camera={c} front="#584652" top="#9B7B68" side="#322D40"/>
  <RoomLine a={W(-1600,22,795)} b={W(1600,22,795)} camera={c} stroke="#151E2E" width={12}/>
  {/* Existing chart and clock motifs now have a wall attachment plane. */}
  <Box box={{x0:200,x1:500,y0:470,y1:680,z0:765,z1:800}} camera={c} front="#202C3D" top="#655365" side="#3E3A4D"/>
  <g transform={planeTransform(W(200,680,764),c)}><path d="M25 165L75 125L132 142L195 70L270 94" fill="none" stroke="#84969D" strokeWidth="3"/>{[40,80,120,160].map(y=><path key={y} d={`M20 ${y}H280`} stroke="#9A9B9E" opacity=".14"/>)}</g>
  {clockStyle==='cinematic'?<><ClockWallDetail id={id+'clockWall'} camera={c}/><CinematicLabClock id={id+'clock'} camera={c} seconds={clockSeconds??0}/></>:<LabClock camera={c} seconds={clockSeconds}/>}
  {/* Recessed open storage: rear board, individual books and depth-bearing shelves. */}
  <Box box={{x0:600,x1:960,y0:0,y1:720,z0:590,z1:610}} camera={c} front="#192536" side="#172333" top="#5F5363"/>
  {[100,285,470].map((y,row)=><g key={y}>
   {Array.from({length:9},(_,j)=>{
    const h=85+(j%3)*18,x=634+j*32;
    return <g key={j}><Box box={{x0:x,x1:x+20,y0:y+12,y1:y+12+h,z0:510-(j%2)*8,z1:555}} camera={c} front={['#67586B','#6A656B','#415F70'][j%3]} top="#A89787" side="#30394B"/><g transform={planeTransform(W(x,y+12+h,509-(j%2)*8),c)}><path d="M4 16h12m-12 7h12" stroke="#C5AF99" strokeWidth="1.2" opacity=".6"/></g></g>;
   })}
   <Box box={{x0:616,x1:944,y0:y,y1:y+12,z0:440,z1:600}} camera={c} front="#474655" top="#777078" side="#272F42"/>
  </g>)}
  {[600,944].map(x=><Box key={x} box={{x0:x,x1:x+16,y0:0,y1:720,z0:435,z1:610}} camera={c} front="#373D4E" top="#8B7A72" side="#202C3E"/>)}
  {[0,704].map(y=><Box key={y} box={{x0:600,x1:960,y0:y,y1:y+16,z0:435,z1:610}} camera={c} front="#3C4050" top="#80717A" side="#202B3D"/>)}
  {/* Rear workbench: cabinet front, top slab, drawers and supported equipment. */}
  <path d={floorEllipse(-430,540,760,130,c)} fill="#0A1422" opacity=".4"/>
  <Box box={{x0:-1150,x1:300,y0:0,y1:260,z0:450,z1:690}} camera={c} front={u('wood')} top="#6D5864" side="#242A3B"/>
  <Box box={{x0:-1165,x1:315,y0:260,y1:278,z0:430,z1:705}} camera={c} front="#574654" top="#8E756F" side="#302D40"/>
  {Array.from({length:6},(_,i)=><g key={i} transform={planeTransform(W(-1132+i*237,245,449),c)}><rect width="220" height="225" rx="3" fill="none" stroke="#6B5663" strokeWidth="2"/><path d="M0 55H220M90 29h40" stroke="#AC9184" strokeWidth="2.5" opacity=".7"/><path d="M110 80V208" stroke="#1D2534" strokeWidth="1.5"/></g>)}
  <g transform={planeTransform(W(-1300,983,550),c)}><LabBenchGlassware/></g>
  <Glass id={id+'rearGlass'} x={-610} y={278} z={550} camera={c}/>
  <Box box={{x0:40,x1:200,y0:278,y1:365,z0:520,z1:630}} camera={c} front="#454351" top="#807472" side="#2B3546"/>
  <g transform={planeTransform(W(40,365,519),c)}><path d="M20 20H140M20 34H100" stroke="#AEA19A" strokeWidth="2"/><circle cx="126" cy="62" r="8" fill="#242F41" stroke="#9A8C83"/></g>
  <RoomFace points={[W(-1100,340,780),W(-100,340,780),W(500,0,-250),W(-700,0,-250)]} camera={c} fill={u('haze')} stroke="none"/>
  {richWorld?<RichLabWorldDetails id={id+'fineWorld'} camera={c}/>:null}
  {/* Interaction trolley: slab, tray, braces and four independent grounded legs. */}
  <path d={floorEllipse(5,30,170,85,c)} fill="#08111D" opacity=".4"/>
  <Box box={{x0:-116,x1:124,y0:38,y1:48,z0:-25,z1:110}} camera={c} front="#303443" top="#4D4C5A" side="#222B3C"/>
  {[-110,100].map(x=><Box key={'rear-leg'+x} box={{x0:x,x1:x+12,y0:0,y1:300,z0:100,z1:112}} camera={c} front="#3B4253" top="#99887D" side="#253045"/>)}
  <RoomLine a={W(-104,290,-26)} b={W(106,48,-26)} camera={c} stroke="#373D4E" width={4}/>
  <RoomLine a={W(106,290,-26)} b={W(-104,48,-26)} camera={c} stroke="#373D4E" width={4}/>
  {[-110,100].map(x=><Box key={'front-leg'+x} box={{x0:x,x1:x+12,y0:0,y1:300,z0:-25,z1:-13}} camera={c} front="#565460" top="#AA9482" side="#30384A"/>)}
  <Box box={{x0:-122,x1:140,y0:300,y1:315,z0:-40,z1:120}} camera={c} front="#62606B" top="#8A7C7C" side="#333D50"/>
  <Box box={{x0:-130,x1:-12,y0:315,y1:381,z0:0,z1:80}} camera={c} front="#353F50" top="#7A737D" side="#243347"/>
  <g transform={planeTransform(W(0,885,0),c)}><g transform="translate(-960 0)" clipPath={u('consoleFace')}><LabConsole id={id+'console'} active={performance?.active??true} press={performance?.press??0} shadow={false} signal={signal}/></g></g>
  <g transform={planeTransform(W(-36,315,-41),c)}><path d="M0 0C0 28 64 22 64 52V195Q64 222 32 224" fill="none" stroke="#0D1926" strokeWidth="4"/><path d="M0 0C0 28 64 22 64 52" fill="none" stroke="#9B8B80" strokeWidth=".8" opacity=".5"/></g>
  {richWorld?<RichLabSecondaryDetails id={id+'fineSecondary'} camera={c}/>:null}
  {/* Actor and sole shadows share physical floor anchors; the original depth proof is still; performance is opt-in. */}
  <path d={floorEllipse(origin.x,origin.z,75,32,c)} fill="#07101D" opacity=".3"/>
  <path d={floorPolygon([W(origin.x-30,0,origin.z),W(origin.x+35,0,origin.z),W(origin.x+260,0,origin.z-160),W(origin.x+185,0,origin.z-180)],c)} fill="#091220" opacity=".28" filter={u('shade')}/>
  {(performance?.soleWorld??[-16,16].map(h=>W(origin.x+h*actorScale,0,origin.z))).map((p,i)=><path key={i} d={floorEllipse(p.x,p.z,19,8,c)} fill="#070F1B" opacity={performance?.supportOpacity[i]??.65}/>)}
  <g transform={planeTransform(origin,c)}><g transform={performance?.mirror?'scale(-1 1)':undefined}><CharacterTurnV5 id={id+'actor'} x={0} y={0} scale={actorScale} yaw={performance?.yaw??.45} headYaw={performance?.headYaw} pose={performance?.pose} mood={performance?.mood} outfit="puffer-black" lighting="sunset" shadow={false}/></g></g>
  {/* Bench surfaces and glass bases stay attached even at the stronger foreground parallax. */}
  <g filter={u('fg')}>
   {FOREGROUND_BENCHES.map((b,i)=><g key={i}>{[b.x0+30,b.x1-48].map(x=><g key={x}>{[b.z0+20,b.z1-38].map(z=><Box key={z} box={{x0:x,x1:x+18,y0:0,y1:b.y0,z0:z,z1:z+18}} camera={c} front="#243141" side="#162435" top="#58606A"/>)}</g>)}<Box box={b} camera={c} front="#1D2937" top="#4B4E57" side="#172537"/><Glass id={id+'fgGlass'+i} x={i?520:-620} y={205} z={-350} camera={c}/></g>)}
  </g>
  <rect width="1920" height="1080" fill={u('vignette')}/>
 </g>;
};
export const LabRoomDepthProof:React.FC=()=> <svg viewBox="0 0 1920 1080" width="100%" height="100%"><LabRoomDepthScene id="room-depth-proof" frame={useCurrentFrame()}/></svg>;
export const LabRoomDepthBoard:React.FC=()=> <svg viewBox="0 0 1920 1230" width="100%" height="100%">
 <rect width="1920" height="1230" fill="#111522"/>
 {[{f:0,label:'01  CAMERA LEFT / WIDE'},{f:70,label:'02  WINDOW & FURNITURE DEPTH'},{f:140,label:'03  FOREGROUND REVEAL'},{f:209,label:'04  CAMERA RIGHT / NEARER'}].map((s,i)=><g key={s.f} transform={`translate(${i%2*960} ${Math.floor(i/2)*615})`}>
  <text x="32" y="43" fill="#F5E7D4" fontFamily="Arial,sans-serif" fontSize="26">{s.label}</text>
  <svg x="12" y="65" width="936" height="526.5" viewBox="0 0 1920 1080"><LabRoomDepthScene id={'room-board'+i} frame={s.f}/></svg>
 </g>)}
</svg>;
