#!/usr/bin/env bash
# Compile a CV variant twice (lastpage needs the second pass) and report
# page count + overfull boxes. Target: 1 page, 0 overfull.
#
#   ./build.sh may_2026.tex
#   ./build.sh may_2026/d1_insurance.tex
#   ./build.sh --all may_2026
#
# PDFs land next to the source and are gitignored (this repo is public).

set -uo pipefail
cd "$(dirname "$0")"

# Engine depends on the document class:
#   article     -> pdflatex  (april_2026 and earlier)
#   awesome-cv  -> xelatex   (may_2026 onward; the class pulls in fontspec,
#                             which aborts under pdflatex)
engine_for() {
  if grep -q '\\documentclass.*{awesome-cv}' "$1"; then
    echo xelatex
  else
    echo pdflatex
  fi
}

compile() {
  local tex="$1"
  local dir base engine
  dir="$(dirname "$tex")"
  base="$(basename "$tex" .tex)"

  if [[ ! -f "$tex" ]]; then
    echo "  MISSING  $tex"
    return 1
  fi

  engine="$(engine_for "$tex")"

  # Two passes: lastpage needs the second one for the correct page count.
  ( cd "$dir" && \
    "$engine" -interaction=nonstopmode "$base.tex" >/dev/null 2>&1 && \
    "$engine" -interaction=nonstopmode "$base.tex" >/dev/null 2>&1 )

  local log="$dir/$base.log"
  local pdf="$dir/$base.pdf"

  if [[ ! -f "$pdf" ]]; then
    echo "  FAILED   $tex  (see $log)"
    return 1
  fi

  local pages overfull status
  pages="$(grep -oP 'Output written on .* \(\K[0-9]+' "$log" | tail -1)"
  overfull="$(grep -c 'Overfull \\hbox' "$log")"

  status="ok"
  [[ "$pages" != "1" ]] && status="CHECK"
  [[ "$overfull" != "0" ]] && status="CHECK"

  printf '  %-7s %-42s %-9s %s page(s), %s overfull\n' \
    "$status" "$tex" "$engine" "${pages:-?}" "$overfull"
  [[ "$status" == "ok" ]]
}

if [[ "${1:-}" == "--all" ]]; then
  cycle="${2:?usage: ./build.sh --all <cycle-dir>}"
  echo "Building all variants in $cycle/"
  rc=0
  for tex in "$cycle"/*.tex; do
    compile "$tex" || rc=1
  done
  exit $rc
fi

target="${1:?usage: ./build.sh <file.tex> | --all <cycle-dir>}"
compile "$target"
