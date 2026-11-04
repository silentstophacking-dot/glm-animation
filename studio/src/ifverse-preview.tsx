import React from 'react';
import {registerRoot,Composition} from 'remotion';
import {IfverseContactPreview} from './episodes/probability-control/ifverse-contact-preview';
// Preview entry avoids loading unrelated episode audio and remote fonts.
registerRoot(()=> <Composition id="IfverseContactPreview" component={IfverseContactPreview}
  durationInFrames={240} fps={30} width={1920} height={1080}/>);
