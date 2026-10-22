// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

const jestGlobals = {
  jest: 'readonly',
  describe: 'readonly',
  test: 'readonly',
  it: 'readonly',
  expect: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
};

module.exports = defineConfig([
  expoConfig,
  { ignores: ['dist/*', '.expo/*', '.test-build/*', '.bundle-check/*'] },
  {
    // Node's test runner (tests/) — plain CommonJS.
    files: ['tests/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { require: 'readonly', module: 'writable', __dirname: 'readonly', process: 'readonly' },
    },
  },
  {
    files: ['__tests__/**/*', 'jest.setup.js'],
    languageOptions: { globals: { ...jestGlobals, require: 'readonly' } },
  },
]);
