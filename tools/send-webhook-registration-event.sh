#!/bin/bash

event_type="stream.online"
broadcaster="154006508"
secret=""
subscription_id=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --event-type)
      event_type="$2"
      shift 2
      ;;
    --secret)
      secret="$2"
      shift 2
      ;;
    --subscription-id)
      subscription_id="$2"
      shift 2
      ;;
    --broadcaster)
      broadcaster="$2"
      shift 2
      ;;
    *)
      echo "❌ Unknown parameter: $1"
      exit 1
      ;;
  esac
done

if [ -z "$event_type" ]; then
  echo "❌ Error: --event-type parameter is required!"
  exit 1
fi

if [ -z "$secret" ]; then
  echo "❌ Error: --secret parameter is required!"
  exit 1
fi

if [ -z "$subscription_id" ]; then
  echo "❌ Error: --subscription-id parameter is required!"
  exit 1
fi

if [ -z "$broadcaster" ]; then
  echo "❌ Error: --broadcaster parameter is required!"
  exit 1
fi

exec twitch event verify-subscription "$event_type" -F http://localhost:8787/online --secret "$secret" --subscription-id "$subscription_id" --broadcaster "$broadcaster"
