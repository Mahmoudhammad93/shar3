#!/bin/sh
set -eu

fail() {
    echo "staging public env rejected: $1" >&2
    exit 1
}

normalize() {
    printf '%s' "$1" | tr -d '[:space:]' | sed 's:/*$::'
}

host_of() {
    printf '%s' "$1" | sed -E 's#^[a-zA-Z][a-zA-Z0-9+.-]*://([^/@]+@)?([^/:]+).*#\2#' | tr '[:upper:]' '[:lower:]'
}

api=$(normalize "${NEXT_PUBLIC_API_URL:-}")
admin=$(normalize "${NEXT_PUBLIC_ADMIN_URL:-}")
site=$(normalize "${NEXT_PUBLIC_SITE_URL:-}")

api_host=$(host_of "$api")
admin_host=$(host_of "$admin")
site_host=$(host_of "$site")

for host in "$api_host" "$admin_host" "$site_host"; do
    case "$host" in
        api.duaat-altawheed.com|www.duaat-altawheed.com|duaat-altawheed.com)
            fail "production host ${host}"
            ;;
    esac
done

[ "$api" = "https://dev-api.duaat-altawheed.com/api/v1" ] || fail "NEXT_PUBLIC_API_URL must be the staging API"
# AC-44A: Admin is consolidated onto the frontend host
[ "$admin" = "https://dev.duaat-altawheed.com/admin" ] || fail "NEXT_PUBLIC_ADMIN_URL must be the staging admin URL"
[ "$site" = "https://dev.duaat-altawheed.com" ] || fail "NEXT_PUBLIC_SITE_URL must be the staging site URL"

[ "$api_host" = "dev-api.duaat-altawheed.com" ] || fail "API host"
[ "$admin_host" = "dev.duaat-altawheed.com" ] || fail "admin host"
[ "$site_host" = "dev.duaat-altawheed.com" ] || fail "site host"
