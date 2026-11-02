// The registry: add each new episode here (one import, one entry).
import { rewind } from './rewind';
import { copyPaste } from './copy-paste';
import { probabilityControl } from './probability-control/index';
import { probabilityQualityTest } from './probability-control/quality-test';

export const EPISODES = [rewind, copyPaste, probabilityControl, probabilityQualityTest];
