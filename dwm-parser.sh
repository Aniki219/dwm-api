#!/bin/bash

FAMILY="${1:-Slime}"
FILE="data\AmbiosGuide.txt"

awk '
  NR >= 199 && /^[ivxIVX]+\. '.*' Family/ {
    found=1
    next
  }
  found && /^[ivxIVX]+\. [A-Z].* Family/ {
    exit
  }
  found {
    print
  }
' "$FILE"