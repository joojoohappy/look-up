// Contract tests for src/data/moments.ts — the rules in docs/DATA-MODEL.md.
const test = require('node:test');
const assert = require('node:assert/strict');
const { freshStore } = require('./helpers');

const PHOTO = 'file:///data/user/0/host.exp.exponent/cache/ImagePicker/photo.jpg';

test('a public submission is returned as stored and appears first in WORLD', async () => {
  const { moments, seed } = freshStore();
  const before = Date.now();
  const saved = await moments.submitMoment({ imageUri: PHOTO, note: 'clouds over the bridge', visibility: 'public' });

  assert.equal(saved.imageUri, PHOTO, 'imageUri must be stored verbatim so WORLD shows the same photo');
  assert.equal(saved.note, 'clouds over the bridge');
  assert.equal(saved.visibility, 'public');
  assert.equal(saved.location, 'Taipei');
  assert.ok(saved.id && !seed.isSeedMoment(saved), 'a live moment must not look like a seed');
  const created = Date.parse(saved.createdAt);
  assert.ok(created >= before && created <= Date.now(), 'createdAt is the submission time (ISO)');

  const world = await moments.listPublicMoments();
  assert.equal(world[0].id, saved.id, 'newest live moment is first');
});

test('a private submission never appears in the public query', async () => {
  const { moments } = freshStore();
  const priv = await moments.submitMoment({ imageUri: PHOTO, note: 'just for me', visibility: 'private' });
  await moments.submitMoment({ imageUri: PHOTO, note: 'for everyone', visibility: 'public' });

  const world = await moments.listPublicMoments();
  assert.ok(world.every((m) => m.visibility === 'public'));
  assert.ok(!world.some((m) => m.id === priv.id), 'private moment leaked into WORLD');
});

test('an unknown visibility value fails closed (treated as not public)', async () => {
  const { moments } = freshStore();
  const odd = await moments.submitMoment({ imageUri: PHOTO, note: '', visibility: 'friends' });
  const world = await moments.listPublicMoments();
  assert.ok(!world.some((m) => m.id === odd.id));
});

test('live moments are newest-first and always ahead of every demo seed', async () => {
  const { moments, seed } = freshStore();
  const a = await moments.submitMoment({ imageUri: PHOTO, note: 'a', visibility: 'public' });
  const b = await moments.submitMoment({ imageUri: PHOTO, note: 'b', visibility: 'public' });

  const world = await moments.listPublicMoments();
  assert.deepEqual(world.slice(0, 2).map((m) => m.id), [b.id, a.id]);
  const firstSeed = world.findIndex((m) => seed.isSeedMoment(m));
  const lastLive = world.map((m) => seed.isSeedMoment(m)).lastIndexOf(false);
  assert.ok(firstSeed > lastLive, 'a seed was listed ahead of a live moment');
});

test('ids are unique across rapid submissions', async () => {
  const { moments } = freshStore();
  const ids = new Set();
  for (let i = 0; i < 200; i += 1) {
    ids.add((await moments.submitMoment({ imageUri: PHOTO, note: '', visibility: 'public' })).id);
  }
  assert.equal(ids.size, 200);
});

test('note may be empty and may be exactly NOTE_MAX_LENGTH characters', async () => {
  const { moments, contract } = freshStore();
  assert.equal(contract.NOTE_MAX_LENGTH, 50);
  await moments.submitMoment({ imageUri: PHOTO, note: '', visibility: 'public' });
  const full = 'x'.repeat(contract.NOTE_MAX_LENGTH);
  assert.equal((await moments.submitMoment({ imageUri: PHOTO, note: full, visibility: 'public' })).note, full);
});

test('rejects a note longer than NOTE_MAX_LENGTH and stores nothing', async () => {
  const { moments, contract } = freshStore();
  const before = (await moments.listPublicMoments()).length;
  await assert.rejects(
    moments.submitMoment({ imageUri: PHOTO, note: 'x'.repeat(contract.NOTE_MAX_LENGTH + 1), visibility: 'public' }),
    (error) => error instanceof Error && /50/.test(error.message),
  );
  assert.equal((await moments.listPublicMoments()).length, before);
});

test('rejects a missing photo and stores nothing', async () => {
  const { moments } = freshStore();
  const before = (await moments.listPublicMoments()).length;
  await assert.rejects(moments.submitMoment({ imageUri: '', note: 'no photo', visibility: 'public' }), Error);
  assert.equal((await moments.listPublicMoments()).length, before);
});

test('a 50-character Chinese note is accepted (one CJK character counts as one)', async () => {
  const { moments } = freshStore();
  const note = '天'.repeat(50);
  assert.equal((await moments.submitMoment({ imageUri: PHOTO, note, visibility: 'public' })).note, note);
});
