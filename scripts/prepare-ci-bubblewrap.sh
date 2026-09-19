#!/usr/bin/env bash
set -euo pipefail

# Ubuntu's package transaction scans the hosted image's full dpkg database and
# runs post-install hooks. CI needs only the signed-archive payload, so pin and
# verify that payload before extracting it into the ephemeral runner directory.
readonly BUBBLEWRAP_VERSION='0.9.0-1ubuntu0.3'
readonly BUBBLEWRAP_SHA256='2461f1beee9cb04c8942739fe1a2b37e7b7c2a3d518f0779dc75f9245baa3094'
readonly BUBBLEWRAP_URL="https://archive.ubuntu.com/ubuntu/pool/main/b/bubblewrap/bubblewrap_${BUBBLEWRAP_VERSION}_amd64.deb"

: "${RUNNER_TEMP:?prepare-ci-bubblewrap requires RUNNER_TEMP}"
: "${GITHUB_PATH:?prepare-ci-bubblewrap requires GITHUB_PATH}"

if [[ "$(uname -s)" != 'Linux' || "$(uname -m)" != 'x86_64' ]]; then
  echo 'prepare-ci-bubblewrap supports only Linux x86_64 hosted runners' >&2
  exit 1
fi

archive="${RUNNER_TEMP}/bubblewrap_${BUBBLEWRAP_VERSION}_amd64.deb"
root="${RUNNER_TEMP}/dsh-bubblewrap"
mkdir -p "$root"

if curl --fail --silent --show-error --location --retry 3 --retry-all-errors --output "$archive" "$BUBBLEWRAP_URL" 2>/dev/null && \
   printf '%s  %s\n' "$BUBBLEWRAP_SHA256" "$archive" | sha256sum --check --status 2>/dev/null; then
  dpkg-deb --extract "$archive" "$root"
else
  echo 'Pinned bubblewrap deb unavailable or checksum mismatch; falling back to apt' >&2
  if ! command -v bwrap >/dev/null 2>&1; then
    sudo apt-get update -q || true
    sudo apt-get install -yq --no-install-recommends bubblewrap
  fi
fi

if [[ -f "$root/usr/bin/bwrap" ]]; then
  printf '%s\n' "$root/usr/bin" >> "$GITHUB_PATH"
  bwrap_bin="$root/usr/bin/bwrap"
elif command -v bwrap >/dev/null 2>&1; then
  bwrap_bin="$(command -v bwrap)"
else
  echo 'bwrap executable not found after preparation' >&2
  exit 1
fi

sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0 \
  || echo 'apparmor userns knob absent — the functional probe decides'
"$bwrap_bin" --version
"$bwrap_bin" --ro-bind / / --dev /dev --unshare-pid --proc /proc --die-with-parent -- true
echo 'bubblewrap functional probe passed'
