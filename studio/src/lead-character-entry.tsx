import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {LeadCharacterStudy,LeadCharacterLabStudy} from './episodes/probability-control/lead-character-study';
registerRoot(()=> <>
 <Composition id="LeadCharacterStudy" component={LeadCharacterStudy} durationInFrames={1} fps={30} width={1440} height={1500}/>
 <Composition id="LeadCharacterLabStudy" component={LeadCharacterLabStudy} durationInFrames={1} fps={30} width={1920} height={1080}/>
</>);
