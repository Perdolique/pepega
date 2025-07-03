#!/bin/bash

broadcaster="154006508"
secret=""
# TODO: list of environments
env="local"
subscription_id=""

get_callback_url() {
  case "$1" in
    local)
      echo "http://localhost:8787/online"
      ;;
    staging)
      echo "https://pooque-staging.pepega.app/online"
      ;;
    production)
      echo "https://pooque.pepega.app/online"
      ;;
    *)
      return 1
      ;;
  esac
}

validate_env() {
  case "$1" in
    local|staging|production)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

while [[ $# -gt 0 ]]; do
  case $1 in
    --secret)
      secret="$2"
      shift 2
      ;;
    --env)
      env="$2"
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

if [ -z "$secret" ]; then
  echo "❌ Error: --secret parameter is required!"
  exit 1
fi

if [ -z "$env" ]; then
  echo "❌ Error: --env parameter is required!"
  exit 1
fi

if ! validate_env "$env"; then
  echo "❌ Error: --env must be one of: local, staging, production"
  echo "   Got: $env"
  exit 1
fi

if [ -z "$broadcaster" ]; then
  echo "❌ Error: --broadcaster parameter is required!"
  exit 1
fi

callback_url=$(get_callback_url "$env")

exec twitch event trigger stream.online \
  --to-user "$broadcaster" \
  --transport "webhook" \
  --forward-address "$callback_url" \
  --secret "$secret" \
  --subscription-id "$subscription_id"
