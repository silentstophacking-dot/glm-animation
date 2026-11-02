// The registry: add each new episode here (one import, one entry).
import { rewind } from './rewind';
import { copyPaste } from './copy-paste';
import { probabilityControl } from './probability-control/index';
import { probabilityQualityTest } from './probability-control/quality-test';
import { probabilityControlV2 } from './probability-control/full-v2';
import { rewindGradeCoin } from './probability-control/rewind-grade-coin';
import { referenceStyleCoin } from './probability-control/reference-style-coin';
import { referenceCharacterCast } from './probability-control/reference-cast';
import { probability2p5dCafe } from './probability-control/depth25-cafe';

export const EPISODES = [rewind, copyPaste, probabilityControl, probabilityQualityTest, probabilityControlV2, rewindGradeCoin, referenceStyleCoin, referenceCharacterCast, probability2p5dCafe];
