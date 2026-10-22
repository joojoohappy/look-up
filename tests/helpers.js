// Loads the compiled pure modules from .test-build (see tsconfig.test.json).
const path = require('node:path');

const BUILD = path.join(__dirname, '..', '.test-build', 'src');

/** The store is a module-level singleton; give every test a fresh one. */
function freshStore() {
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(BUILD)) delete require.cache[key];
  }
  return {
    moments: require(path.join(BUILD, 'data', 'moments.js')),
    seed: require(path.join(BUILD, 'data', 'seedMoments.js')),
    contract: require(path.join(BUILD, 'types', 'moment.js')),
  };
}

function load(relative) {
  return require(path.join(BUILD, relative));
}

module.exports = { freshStore, load };
