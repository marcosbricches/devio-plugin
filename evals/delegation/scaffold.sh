#!/usr/bin/env bash
# Seeds the workspace with two reference screens the designer chose.
set -euo pipefail
cp -R "$(dirname "$0")"/fixture/. .
