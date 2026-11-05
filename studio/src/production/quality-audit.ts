import {validateFilm} from './film-template';
import {STARTER_FILM} from './starter-spec';
import {cameraAt,W} from './scene-system';
import {projectWorld} from '../episodes/probability-control/pseudo-depth-camera';
import {auditDepth} from '../episodes/probability-control/pseudo-depth-camera';
import {auditTurnV5} from '../episodes/probability-control/character-turn-v5';
export function auditProduction(){
 const duration=validateFilm(STARTER_FILM),scene=STARTER_FILM.scenes[1];
 if(scene.kind!=='world')throw Error('Expected world scene');
 const worldPoint=W(-130,0,250),cameraStart=cameraAt(scene.camera,0),cameraEnd=cameraAt(scene.camera,149);
 const start=projectWorld(worldPoint,cameraStart),end=projectWorld(worldPoint,cameraEnd);
 if(!Number.isFinite(start.x+end.x+start.y+end.y))throw Error('Invalid projection');
 if(Math.abs(start.x-end.x)<5)throw Error('Camera did not produce visible parallax');
 const depth=auditDepth(),actor=auditTurnV5();
 return {passed:true,durationFrames:duration,parallaxPixels:Math.abs(start.x-end.x),depth,actor};
}
