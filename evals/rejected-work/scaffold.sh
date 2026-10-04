#!/usr/bin/env bash
# Seeds a project that holds a rejected round's comp, the round's brief and the ticket that tracks it.
set -euo pipefail
cp -R "$(dirname "$0")"/fixture/. .
