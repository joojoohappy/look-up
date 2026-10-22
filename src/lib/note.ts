/**
 * How LOOK UP counts the 50-character note. Shared by the store (validation)
 * and CaptureScreen (counter and input), so both always agree.
 *
 * Counts Unicode code points, not UTF-16 units: 天 counts as 1 (as before),
 * and 🌤 now also counts as 1 instead of 2. Truncation never splits a surrogate
 * pair, so a note can no longer end in half an emoji. Multi-part emoji joined
 * with ZWJ (👨‍👩‍👧) still count as several; Hermes has no Intl.Segmenter to do better.
 */
import { NOTE_MAX_LENGTH } from '../types/moment';

export function noteLength(note: string): number {
  return Array.from(note).length;
}

export function clampNote(note: string, max: number = NOTE_MAX_LENGTH): string {
  const chars = Array.from(note);
  return chars.length <= max ? note : chars.slice(0, max).join('');
}
