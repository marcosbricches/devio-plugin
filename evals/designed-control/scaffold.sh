#!/usr/bin/env bash
# Seeds the workspace with the reference screen the designer chose.
set -euo pipefail
cp -R "$(dirname "$0")"/fixture/. .
