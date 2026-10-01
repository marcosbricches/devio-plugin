#!/usr/bin/env bash
# Seeds the workspace with two reference screens that show the vehicle queue in opposite ways.
set -euo pipefail
cp -R "$(dirname "$0")"/fixture/. .
