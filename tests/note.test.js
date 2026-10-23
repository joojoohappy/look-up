// Note length rules (src/lib/note.ts), shared by the store and CaptureScreen.
const test = require('node:test');
const assert = require('node:assert/strict');
const { freshStore, load } = require('./helpers');

const { noteLength, clampNote } = load('lib/note.js');
const PHOTO = 'file:///photo.jpg';

test('CJK and Latin count one per character', () => {
  assert.equal(noteLength(''), 0);
  assert.equal(noteLength('天空'), 2);
  assert.equal(noteLength('look up'), 7);
});

test('regression LU-8: an emoji counts as one, not two', () => {
  assert.equal('🌤'.length, 2, 'precondition: UTF-16 length is 2');
  assert.equal(noteLength('🌤'), 1);
  assert.equal(noteLength('🌤'.repeat(50)), 50);
});

test('clampNote keeps short notes unchanged and cuts long ones to 50', () => {
  assert.equal(clampNote('clouds'), 'clouds');
  assert.equal(clampNote('天'.repeat(60)), '天'.repeat(50));
});

test('regression LU-8: clampNote never leaves half an emoji', () => {
  const clamped = clampNote('x'.repeat(49) + '🌤🌤');
  assert.equal(clamped, 'x'.repeat(49) + '🌤');
  assert.ok(!/[\uD800-\uDBFF]$/.test(clamped), 'ends in a lone high surrogate');
});

test('the store accepts 50 emoji and rejects 51', async () => {
  const { moments } = freshStore();
  const ok = '🌤'.repeat(50);
  assert.equal((await moments.submitMoment({ imageUri: PHOTO, note: ok, visibility: 'public' })).note, ok);
  await assert.rejects(moments.submitMoment({ imageUri: PHOTO, note: ok + '🌤', visibility: 'public' }), Error);
});
