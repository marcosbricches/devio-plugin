#!/usr/bin/env bash
# Seeds the workspace with an invented product's 66-line request and six closed brand references. The
# images were drawn for this case; nothing in them is third-party material.
set -euo pipefail
cp -R "$(dirname "$0")"/fixture/. .
