/**
 * The shared submit/query interface. Person B owns this file.
 *
 * P0 keeps every moment in memory for one app session only: nothing survives a
 * reload, and nothing is shared across devices. See docs/ARCHITECTURE.md.
 */

import { CreateMomentInput, Moment, NOTE_MAX_LENGTH } from '../types/moment';

/** Newest first. */
const moments: Moment[] = [];

/** The prototype does not ask for a location yet. */
const DEFAULT_LOCATION = 'Taipei';

let submissionCount = 0;

function nextId(): string {
  submissionCount += 1;
  return `moment-${Date.now().toString(36)}-${submissionCount}`;
}

/**
 * Store one submission and return the stored record. Rejects when the input
 * breaks the contract, so the caller can show the message and stay on the form.
 */
export async function submitMoment(input: CreateMomentInput): Promise<Moment> {
  if (!input.imageUri) {
    throw new Error('A photo is required.');
  }
  if (input.note.length > NOTE_MAX_LENGTH) {
    throw new Error(`Keep the note to ${NOTE_MAX_LENGTH} characters or fewer.`);
  }

  const moment: Moment = {
    // Kept exactly as picked so WORLD renders the same photo that was submitted.
    imageUri: input.imageUri,
    note: input.note,
    visibility: input.visibility,
    id: nextId(),
    createdAt: new Date().toISOString(),
    location: DEFAULT_LOCATION,
  };

  moments.unshift(moment);
  return moment;
}

/** Public moments only, newest first. Private records never appear here. */
export async function listPublicMoments(): Promise<Moment[]> {
  return moments.filter((moment) => moment.visibility === 'public');
}
