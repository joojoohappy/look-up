// WORLD's relative time label (src/lib/time.ts).
const test = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers');

const { timeAgo } = load('lib/time.js');
const NOW = Date.parse('2026-10-22T12:00:00.000Z');
const ago = (ms) => new Date(NOW - ms).toISOString();
const MIN = 60_000;

test('buckets: just now, minutes, hours, days', () => {
  assert.equal(timeAgo(ago(0), NOW), 'just now');
  assert.equal(timeAgo(ago(59_999), NOW), 'just now');
  assert.equal(timeAgo(ago(MIN), NOW), '1 min ago');
  assert.equal(timeAgo(ago(59 * MIN), NOW), '59 min ago');
  assert.equal(timeAgo(ago(60 * MIN), NOW), '1 hr ago');
  assert.equal(timeAgo(ago(23 * 60 * MIN + 59 * MIN), NOW), '23 hr ago');
  assert.equal(timeAgo(ago(24 * 60 * MIN), NOW), '1 d ago');
});

test('a timestamp slightly in the future (clock skew) reads as just now', () => {
  assert.equal(timeAgo(new Date(NOW + 5 * MIN).toISOString(), NOW), 'just now');
});

test('regression: an unparseable timestamp yields null instead of "NaN d ago"', () => {
  assert.equal(timeAgo('not a date', NOW), null);
  assert.equal(timeAgo('', NOW), null);
});
