#!/usr/bin/env bash
# Local secret scan — fails if likely secrets or private infrastructure
# details are present in tracked files. Run: npm run secret-scan
set -euo pipefail

PATTERNS=(
  'AKIA[0-9A-Z]{16}'
  'gh[pousr]_[A-Za-z0-9_]{36,}'
  'xox[baprs]-[A-Za-z0-9-]+'
  'BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY'
  'mongodb(\+srv)?://[^ ]+:[^ ]+@'
  'postgres(ql)?://[^ ]+:[^ ]+@'
  'tailwind.*tailscale|tskey-[A-Za-z0-9-]+'
  '-----BEGIN TAILSCALE'
)

FOUND=0
# Only scan tracked text files, excluding lockfiles and this script's own patterns file list
FILES=$(git ls-files 2>/dev/null | grep -v -E 'package-lock.json|pnpm-lock.yaml|secret-scan.sh' || true)

if [ -z "${FILES}" ]; then
  echo "secret-scan: no git-tracked files found (not a git repo yet?) — scanning working tree instead."
  FILES=$(find . -type f \
    -not -path './node_modules/*' \
    -not -path './.next/*' \
    -not -path './.git/*' \
    -not -path './scripts/secret-scan.sh' \
    -not -name 'package-lock.json' | head -500)
fi

for pat in "${PATTERNS[@]}"; do
  if echo "${FILES}" | xargs grep -rInE -- "${pat}" 2>/dev/null; then
    FOUND=1
  fi
done

# .env must never be tracked
if git ls-files 2>/dev/null | grep -qx '\.env'; then
  echo "FINDING: .env is tracked by git. Remove it immediately."
  FOUND=1
fi

if [ "${FOUND}" -eq 1 ]; then
  echo ""
  echo "secret-scan FAILED: potential secrets detected. Remove them before pushing."
  exit 1
fi

echo "secret-scan OK: no known secret patterns found."
