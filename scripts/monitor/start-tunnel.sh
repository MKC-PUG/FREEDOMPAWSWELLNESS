#!/usr/bin/env bash
# Phase 2 beta: HTTPS tunnel to local go2rtc so the Vercel PWA can play stream.html.
# Requires: go2rtc running on :1984, cloudflared installed (brew install cloudflared).
set -euo pipefail

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "Install cloudflared first:"
  echo "  brew install cloudflared"
  echo "Or: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/"
  exit 1
fi

if ! curl -sf "http://127.0.0.1:1984/" >/dev/null 2>&1; then
  echo "go2rtc is not running on port 1984."
  echo "Start it first: scripts/monitor/start-home.sh"
  exit 1
fi

echo "Starting Cloudflare quick tunnel → http://127.0.0.1:1984"
echo ""
echo "When you see a line like:"
echo "  https://something-random.trycloudflare.com"
echo ""
echo "Use this in Freedom Paws Camera setup:"
echo "  https://TUNNEL_HOST/stream.html?src=wyze"
echo ""
echo "That HTTPS URL works in the installed PWA app (away from home)."
echo "Press Ctrl+C to stop the tunnel."
echo ""

exec cloudflared tunnel --url "http://127.0.0.1:1984"
