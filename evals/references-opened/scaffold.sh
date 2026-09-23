#!/usr/bin/env bash
# Puts the two reference images in the run's workspace, where the session can open them.
set -euo pipefail
mkdir -p references
cp "$(dirname "$0")"/references/*.png references/
