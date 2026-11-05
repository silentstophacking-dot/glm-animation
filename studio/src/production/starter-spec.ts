import type {FilmPlan} from './film-template';
export const STARTER_FILM:FilmPlan={
 id:'cinematic-starter',fps:30,width:1920,height:1080,
 scenes:[
 {kind:'approved-clock',id:'approved-reference',duration:90,sourceFrame:480},
 {kind:'world',id:'new-world-scene',duration:150,background:'#111D30',
 camera:[{frame:0,x:-170,y:390,z:-180,focal:1200},{frame:149,x:20,y:385,z:-135,focal:1200}],
 boxes:[
 {id:'left-wall',x:-950,y:0,z:550,width:580,height:680,depth:210,material:'wall',windows:true},
 {id:'right-building',x:570,y:0,z:780,width:420,height:800,depth:220,material:'wall',windows:true},
 {id:'street-prop',x:250,y:0,z:120,width:80,height:310,depth:80,material:'metal'}],
 actors:[{id:'protagonist',x:-130,y:0,z:250,scale:1.35,yaw:.25,headYaw:.5,outfit:'hoodie',lighting:'baseline'}]}
 ]};
