import type {WorldSceneSpec,WorldBox,CameraKey,ActorCue} from './scene-system';
export type EnvironmentName='night-street'|'apartment'|'industrial-interior';
const box=(id:string,x:number,y:number,z:number,width:number,height:number,depth:number,material:WorldBox['material'],windows=false):WorldBox=>({id,x,y,z,width,height,depth,material,windows});
const actor:ActorCue={id:'lead',x:-140,y:0,z:230,scale:1.25,yaw:.2,headYaw:.35,outfit:'puffer-black',lighting:'baseline'};
export function environmentPreset(name:EnvironmentName,id:string,duration=180):WorldSceneSpec{
 let boxes:WorldBox[],camera:CameraKey[],background:string;
 if(name==='night-street'){
  background='#0A1727';camera=[{frame:0,x:-180,y:400,z:-280,focal:1200},{frame:duration-1,x:60,y:390,z:-200,focal:1200}];
  boxes=[
   box('left-near',-1020,0,160,400,650,300,'wall',true),
   box('left-far',-1130,0,850,430,920,280,'wall',true),
   box('right-near',620,0,260,480,720,270,'wall',true),
   box('right-far',730,0,1000,400,850,240,'wall',true),
   box('streetlamp',260,0,500,22,480,22,'metal')
  ];
 }else if(name==='apartment'){
  background='#172334';camera=[{frame:0,x:-220,y:380,z:-300,focal:1200},{frame:duration-1,x:-60,y:385,z:-235,focal:1200}];
  boxes=[
   box('back-wall',-900,0,1050,1800,760,65,'wall'),
   box('left-wall',-1000,0,120,75,760,980,'wall'),
   box('window-left',250,200,985,60,450,45,'metal'),
   box('window-right',690,200,985,60,450,45,'metal'),
   box('desk',-600,0,510,440,135,190,'wood'),
   box('monitor',-470,140,550,210,155,24,'glass'),
   box('shelf',-830,0,850,230,450,75,'wood')
  ];
 }else{
  background='#1A2432';camera=[{frame:0,x:-240,y:430,z:-330,focal:1200},{frame:duration-1,x:10,y:425,z:-280,focal:1200}];
  boxes=[
   box('factory-back',-1000,0,1200,2100,950,80,'wall'),
   box('support-left',-680,0,420,90,800,90,'metal'),
   box('support-right',720,0,420,90,800,90,'metal'),
   box('workbench',-450,0,520,900,170,230,'metal'),
   box('cabinet',-900,0,890,330,560,130,'metal'),
   box('control-panel',480,180,850,340,280,60,'glass')
  ];
 }
 return {kind:'world',id,duration,background,camera,boxes,actors:[{...actor}]};
}
