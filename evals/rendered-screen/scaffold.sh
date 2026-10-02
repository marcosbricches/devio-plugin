#!/usr/bin/env bash
# Seeds the workspace with the built screen and the reference it was built from.
set -euo pipefail
cp -R "$(dirname "$0")"/fixture/. .
