#!/usr/bin/env bash
# Seeds the workspace with a local issue tracker holding a spec and five published tickets.
set -euo pipefail
cp -R "$(dirname "$0")"/fixture/. .
