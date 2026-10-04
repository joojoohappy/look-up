/**
 * Demo seed for WORLD. Person B owns this file.
 *
 * These are deliberately not photographs — each image is a six-pixel gradient
 * scaled up, so it reads as an abstract wash — and WORLD badges every one of
 * them as a demo example. They exist only so WORLD is not an empty grid during
 * the demo. They must never stand in for a real submission.
 */

import { Moment } from '../types/moment';

export const SEED_ID_PREFIX = 'seed-';

/** Tiny inline gradients: no network, no bundled assets, obviously not photos. */
const SKY = {
  dawn:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAGCAIAAABrW6giAAAAK0lEQVR42mP4v70Ojhj+H5wARwz/Ti+EI4Z/VzbDEcPfe0fgiOHvi2twBACuNDs1mp/BRgAAAABJRU5ErkJggg==',
  noon:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAGCAIAAABrW6giAAAAK0lEQVR42mOo2PAajhh6976DI4aFpz7CEcO2a1/hiOHU4x9wxHD/w284AgBcMDpdVwPIhwAAAABJRU5ErkJggg==',
  dusk:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAGCAIAAABrW6giAAAAKklEQVR42mOIC5sHRwyVafPhiGFq+QI4YtjQvgiOGM7MWAxHDM9XLIEjAM9PKj0VqHcwAAAAAElFTkSuQmCC',
};

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

/** Kept small on purpose. WORLD lists these after every live moment. */
export const SEED_MOMENTS: Moment[] = [
  {
    id: `${SEED_ID_PREFIX}dawn`,
    imageUri: SKY.dawn,
    note: 'Demo example — orange over the rooftops.',
    visibility: 'public',
    createdAt: hoursAgo(5),
    location: 'Taipei',
  },
  {
    id: `${SEED_ID_PREFIX}noon`,
    imageUri: SKY.noon,
    note: 'Demo example — nothing but blue today.',
    visibility: 'public',
    createdAt: hoursAgo(9),
    location: 'Lisbon',
  },
  {
    id: `${SEED_ID_PREFIX}dusk`,
    imageUri: SKY.dusk,
    note: 'Demo example — looked up on the way home.',
    visibility: 'public',
    createdAt: hoursAgo(14),
    location: 'Taipei',
  },
];

export function isSeedMoment(moment: Moment): boolean {
  return moment.id.startsWith(SEED_ID_PREFIX);
}
