#!/usr/bin/env bash
# Seeds the workspace with the built screen to audit.
set -euo pipefail
cp -R "$(dirname "$0")"/fixture/. .
