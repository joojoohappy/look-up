/**
 * Relative time for WORLD cards. Kept free of React Native so it can be unit
 * tested (tests/time.test.js).
 *
 * Returns null when createdAt cannot be parsed, so the card can drop the label
 * instead of printing "NaN d ago".
 */
export function timeAgo(createdAt: string, now: number = Date.now()): string | null {
  const created = Date.parse(createdAt);
  if (Number.isNaN(created)) return null;

  // Clock skew can put a fresh moment slightly in the future; treat it as new.
  const minutes = Math.max(0, Math.floor((now - created) / 60_000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} d ago`;
}
