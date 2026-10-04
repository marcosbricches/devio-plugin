#!/usr/bin/env bash
# Seeds the workspace with three reference boards. The images were drawn for this case from invented
# products; nothing in them is third-party material.
set -euo pipefail
cp -R "$(dirname "$0")"/fixture/. .
