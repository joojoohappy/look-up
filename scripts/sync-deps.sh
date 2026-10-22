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
tooling=(jest-expo jest @testing-library/react-native @types/jest eslint eslint-config-expo)

missing=()
for name in "${runtime[@]}"; do has "$name" || missing+=("$name"); done
if [ "${#missing[@]}" -gt 0 ]; then
  echo "Adding: ${missing[*]}"
  npx expo install "${missing[@]}"
fi

missing=()
for name in "${tooling[@]}"; do has "$name" || missing+=("$name"); done
if [ "${#missing[@]}" -gt 0 ]; then
  # Pin the renderer to the installed React so npm does not pull a newer
  # react-test-renderer whose peer range rejects this React.
  react_version="$(node -p "require('react/package.json').version")"
  echo "Adding dev: ${missing[*]} react-test-renderer@$react_version"
  npx expo install "${missing[@]}" "react-test-renderer@$react_version" -- --save-dev
fi

# Align every Expo-managed package with the SDK.
npx expo install --fix
npx expo install --check
