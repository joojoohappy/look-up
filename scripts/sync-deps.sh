#!/usr/bin/env bash
# Brings package.json and package-lock.json to the Expo SDK named in
# .github/expo-sdk-target and makes sure the project's tooling is installed.
#
# Runs in GitHub Actions (.github/workflows/sync-deps.yml), where the npm
# registry is reachable. Safe to run locally too. Idempotent: on an
# up-to-date project it changes nothing.
set -euo pipefail

target="$(tr -d '[:space:]' < .github/expo-sdk-target)"
current="$(node -p "require('expo/package.json').version.split('.')[0]")"

if [ "$current" != "$target" ]; then
  echo "Upgrading Expo SDK $current -> $target"
  # The official upgrade command: https://expo.dev/changelog/sdk-58
  npx expo install "expo@^${target}.0.0" --fix
else
  echo "Expo SDK $current already matches target"
fi

has() {
  node -e "const p=require('./package.json');process.exit(({...p.dependencies,...p.devDependencies})[process.argv[1]]?0:1)" "$1"
}

runtime=(react-native-safe-area-context)
tooling=(jest-expo jest @jest/globals @testing-library/react-native eslint eslint-config-expo)
# No longer used: TypeScript 6 stopped auto-loading @types/*, so tests import
# their globals from @jest/globals instead.
retired=(@types/jest)

missing=()
for name in "${runtime[@]}"; do has "$name" || missing+=("$name"); done
if [ "${#missing[@]}" -gt 0 ]; then
  echo "Adding: ${missing[*]}"
  npx expo install "${missing[@]}"
fi

missing=()
for name in "${tooling[@]}"; do
  if has "$name"; then continue; fi
  # Jest packages are released in lockstep; match the installed jest.
  if [ "$name" = "@jest/globals" ] && [ -f node_modules/jest/package.json ]; then
    name="@jest/globals@$(node -p "require('jest/package.json').version")"
  fi
  missing+=("$name")
done
if [ "${#missing[@]}" -gt 0 ]; then
  # Pin the renderer to the installed React so npm does not pull a newer
  # react-test-renderer whose peer range rejects this React.
  react_version="$(node -p "require('react/package.json').version")"
  echo "Adding dev: ${missing[*]} react-test-renderer@$react_version"
  npx expo install "${missing[@]}" "react-test-renderer@$react_version" -- --save-dev
fi

for name in "${retired[@]}"; do
  if has "$name"; then npm uninstall --no-audit --no-fund "$name"; fi
done

# Align every Expo-managed package with the SDK.
npx expo install --fix

# `expo install` ignores --save-dev for packages it knows (jest-expo, jest,
# eslint-config-expo, react-test-renderer), so move all tooling into
# devDependencies, keep both maps sorted, and let npm rewrite the lockfile.
node -e '
const fs = require("fs");
const p = JSON.parse(fs.readFileSync("package.json", "utf8"));
p.devDependencies = p.devDependencies || {};
for (const name of process.argv.slice(1)) {
  if (p.dependencies && p.dependencies[name]) {
    p.devDependencies[name] = p.dependencies[name];
    delete p.dependencies[name];
  }
}
const sorted = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
p.dependencies = sorted(p.dependencies);
p.devDependencies = sorted(p.devDependencies);
fs.writeFileSync("package.json", JSON.stringify(p, null, 2) + "\n");
' "${tooling[@]}" react-test-renderer
npm install --no-audit --no-fund

npx expo install --check
