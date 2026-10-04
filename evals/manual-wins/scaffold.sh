#!/usr/bin/env bash
# Seeds the workspace with an approved brand manual: the HTML export and one PNG per slide. The slides
# were rendered from the export for the case; nothing in them is third-party material.
set -euo pipefail
cp -R "$(dirname "$0")"/fixture/. .
