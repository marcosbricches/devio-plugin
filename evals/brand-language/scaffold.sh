#!/usr/bin/env bash
# Seeds the workspace with the client's site, the layout reference the designer chose and six closed
# brand references. The images were drawn for the cases; nothing in them is third-party material.
set -euo pipefail
cp -R "$(dirname "$0")"/fixture/. .
