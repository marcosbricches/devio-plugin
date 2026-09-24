#!/usr/bin/env bash
# Seeds the workspace with a project whose issue tracker is GitHub Issues: no `.scratch/` folder.
set -euo pipefail
cp -R "$(dirname "$0")"/fixture/. .
