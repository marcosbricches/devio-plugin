#!/usr/bin/env bash
# Seeds the workspace with the built screen and the reference it was built from. The screen has two
# controls that do nothing: Continuar has no handler, and the next-month button sits under an
# invisible layer that takes the click. Every other control works.
set -euo pipefail
cp -R "$(dirname "$0")"/fixture/. .
