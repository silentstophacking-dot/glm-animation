import {validateFilm} from './film-template';
import {environmentPreset} from './environment-presets';
import {cameraAt,W} from './scene-system';
import {projectWorld} from '../episodes/probability-control/pseudo-depth-camera';
export function validateProductionPresets(){
 const names=['night-street','apartment','industrial-interior'] as const;
 const results=names.map(name=>{
  const spec=environmentPreset(name,'test-'+name,180);
  validateFilm({id:'audit-'+name,fps:30,width:1920,height:1080,scenes:[spec]});
  const a=projectWorld(W(-140,0,230),cameraAt(spec.camera,0));
  const b=projectWorld(W(-140,0,230),cameraAt(spec.camera,179));
  const movement=Math.hypot(a.x-b.x,a.y-b.y);
  if(movement<4)throw Error('Camera parallax insufficient: '+name);
  if(spec.actors[0].outfit!=='puffer-black')throw Error('Approved puffer outfit missing: '+name);
  if(new Set(spec.boxes.map(x=>x.id)).size!==spec.boxes.length)throw Error('Duplicate geometry IDs: '+name);
  return {name,objects:spec.boxes.length,parallax:movement};
 });
 return results;
}
