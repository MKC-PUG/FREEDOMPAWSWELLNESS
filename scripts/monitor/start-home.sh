#!/usr/bin/env bash
# Start go2rtc for Freedom Paws Monitor (home Wi‑Fi beta).
set -euo pipefail

DIR="${HOME}/freedompaws-monitor"
BIN="${DIR}/go2rtc"
CFG="${DIR}/go2rtc.yaml"

if [[ ! -x "${BIN}" ]]; then
  echo "go2rtc not found at ${BIN}"
  echo "Download from https://github.com/AlexxIT/go2rtc/releases"
  exit 1
fi

if [[ ! -f "${CFG}" ]]; then
  echo "Missing ${CFG} — copy scripts/monitor/go2rtc-wyze.example.yaml and add your Wyze RTSP URL."
  exit 1
fi

IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"
echo "Starting go2rtc…"
echo "  go2rtc UI:  http://localhost:1984/"
if [[ -n "${IP}" ]]; then
  echo "  iPhone:     http://${IP}:1984/  → wyze → links → stream.html"
  echo "  Monitor:    http://${IP}:3000/monitor  (run npm run start:mobile in another terminal)"
fi
echo "Press Ctrl+C to stop."
cd "${DIR}"
exec ./go2rtc
