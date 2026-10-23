// WORLD demo seed must stay clearly labelled and never pass for a live moment (MVP.md P0 #6).
const test = require('node:test');
const assert = require('node:assert/strict');
const { freshStore } = require('./helpers');

test('every seed is public, flagged as a seed, and labelled as a demo example', () => {
  const { seed } = freshStore();
  assert.ok(seed.SEED_MOMENTS.length > 0);
  for (const moment of seed.SEED_MOMENTS) {
    assert.equal(moment.visibility, 'public');
    assert.ok(seed.isSeedMoment(moment), `${moment.id} is not detectable as a seed`);
    assert.match(moment.note, /^Demo example/);
  }
});

test('seed photos are bundled data URIs, so WORLD needs no network', () => {
  const { seed } = freshStore();
  for (const moment of seed.SEED_MOMENTS) {
    assert.match(moment.imageUri, /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/);
  }
});

test('seed ids are unique and seeds are listed newest-first', () => {
  const { seed } = freshStore();
  const ids = seed.SEED_MOMENTS.map((m) => m.id);
  assert.equal(new Set(ids).size, ids.length);
  const times = seed.SEED_MOMENTS.map((m) => Date.parse(m.createdAt));
  assert.deepEqual([...times].sort((a, b) => b - a), times);
});
