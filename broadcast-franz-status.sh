#!/usr/bin/env bash

set -euo pipefail

SUPABASE_URL="https://csaoavtczwsutosatooq.supabase.co"
SUPABASE_KEY="sb_publishable_tqvuDCzSGt9FIHs43atsRQ_3lDzWqdi"
CHANNEL="froshdeals-ops-board-monitor"
EVENT="monitor:update"

usage() {
  cat <<'EOF'
Usage:
  ./broadcast-franz-status.sh <state> <task> [detail]

Examples:
  ./broadcast-franz-status.sh seen "Saw Exile's message" "Message received and queued"
  ./broadcast-franz-status.sh working "Making the tracker live" "Editing the ops board now"
  ./broadcast-franz-status.sh waiting "Need Kurt to review copy" "Paused until feedback arrives"

States:
  idle | seen | working | waiting | blocked
EOF
}

json_escape() {
  printf '%s' "$1" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))'
}

if [[ "${1:-}" == "" || "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi

STATE="$1"
TASK="${2:-}"
DETAIL="${3:-}"

case "$STATE" in
  idle|seen|working|waiting|blocked) ;;
  *)
    echo "Invalid state: $STATE" >&2
    usage >&2
    exit 1
    ;;
esac

if [[ -z "$TASK" ]]; then
  echo "Task is required." >&2
  usage >&2
  exit 1
fi

STAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
DETAIL_VALUE="${DETAIL:-Heartbeat: pushed from CLI}"

STATE_JSON="$(json_escape "$STATE")"
TASK_JSON="$(json_escape "$TASK")"
DETAIL_JSON="$(json_escape "$DETAIL_VALUE")"
STAMP_JSON="$(json_escape "$STAMP")"

PAYLOAD="{\"state\":${STATE_JSON},\"task\":${TASK_JSON},\"detail\":${DETAIL_JSON},\"updatedAt\":${STAMP_JSON},\"source\":\"cli\"}"

curl --fail --silent --show-error \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  --data-raw "${PAYLOAD}" \
  "${SUPABASE_URL}/realtime/v1/api/broadcast/${CHANNEL}/events/${EVENT}"

echo
echo "Broadcast sent: ${STATE} | ${TASK}"
