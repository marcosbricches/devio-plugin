#!/usr/bin/env bash
# Seeds the workspace with the client's site and the structural reference the designer chose.
set -euo pipefail
cp -R "$(dirname "$0")"/fixture/. .
