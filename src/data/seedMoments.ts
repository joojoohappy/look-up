/**
 * Demo seed for WORLD. Person B owns this file.
 *
 * Real photographs supplied for the demo, inlined from seedImages.ts. WORLD
 * badges every one of them as a demo example and always lists them behind live
 * moments. They exist only so WORLD is not an empty grid during the demo; they
 * must never stand in for a real submission.
 */

import { Moment } from '../types/moment';
import { SEED_IMAGE_CLOUD, SEED_IMAGE_CONTRAILS, SEED_IMAGE_HARBOUR } from './seedImages';

export const SEED_ID_PREFIX = 'seed-';

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

/**
 * Kept small on purpose, newest first. The ages roughly match the light in
 * each photo, so a midday shot does not claim to be from before dawn.
 */
export const SEED_MOMENTS: Moment[] = [
  {
    id: `${SEED_ID_PREFIX}cloud`,
    imageUri: SEED_IMAGE_CLOUD,
    note: 'Demo example — one cloud, all afternoon.',
    visibility: 'public',
    createdAt: hoursAgo(2),
    location: 'Taipei',
  },
  {
    id: `${SEED_ID_PREFIX}contrails`,
    imageUri: SEED_IMAGE_CONTRAILS,
    note: 'Demo example — contrails over the road.',
    visibility: 'public',
    createdAt: hoursAgo(19),
    location: 'Taipei',
  },
  {
    id: `${SEED_ID_PREFIX}harbour`,
    imageUri: SEED_IMAGE_HARBOUR,
    note: 'Demo example — the harbour before dark.',
    visibility: 'public',
    createdAt: hoursAgo(20),
    location: 'Taipei',
  },
];

export function isSeedMoment(moment: Moment): boolean {
  return moment.id.startsWith(SEED_ID_PREFIX);
}
