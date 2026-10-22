#!/usr/bin/env bash
# Usage: bash scripts/ci-run.sh "<title>" <command> [args...]
#
# Runs one CI command. If it fails, the last 80 lines of its output are also
# published as a GitHub annotation, so the failure can be read on the PR page or
# through the API (check-runs/<job>/annotations) without opening the raw log.
set -uo pipefail

title="$1"
shift
log="$(mktemp)"

"$@" 2>&1 | tee "$log"
status=${PIPESTATUS[0]}

if [ "$status" -ne 0 ]; then
  body="$(tail -n 80 "$log" | sed 's/\x1b\[[0-9;]*[A-Za-z]//g')"
  body="${body//'%'/'%25'}"
  body="${body//$'\r'/'%0D'}"
  body="${body//$'\n'/'%0A'}"
  echo "::error title=${title} failed (exit ${status})::${body}"
fi
exit "$status"
