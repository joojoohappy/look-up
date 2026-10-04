/**
 * The single Moment contract for LOOK UP. See docs/DATA-MODEL.md.
 *
 * Person B owns this file. Person A imports from it and must not declare a
 * competing Moment type. Any change here needs both developers to agree first.
 */

export type Visibility = 'public' | 'private';

/** Notes may be empty, but never longer than this. */
export const NOTE_MAX_LENGTH = 50;

export type CreateMomentInput = {
  /** Local image URI from expo-image-picker, stored verbatim. */
  imageUri: string;
  /** Empty is allowed; at most NOTE_MAX_LENGTH characters. */
  note: string;
  visibility: Visibility;
};

export type Moment = CreateMomentInput & {
  id: string;
  /** ISO timestamp of the submission. */
  createdAt: string;
  /** The prototype uses 'Taipei'. */
  location: string;
};
