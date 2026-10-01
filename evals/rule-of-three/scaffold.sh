#!/usr/bin/env bash
# Seeds a React back office whose two screens each carry their own copy of the same stat card markup.
set -euo pipefail
cp -R "$(dirname "$0")"/fixture/. .
