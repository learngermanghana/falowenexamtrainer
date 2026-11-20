#!/bin/sh
# Install Falowen's existing official artwork as the iOS home-screen icon.
# This runs AFTER 'npx cap add ios' because the iOS directory is generated in CI.
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
REPO_ROOT="$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)"
ICON_SOURCE="$REPO_ROOT/web/public/falo.png"
ICON_SET="$REPO_ROOT/mobile/ios/App/App/Assets.xcassets/AppIcon.appiconset"
ICON_OUTPUT="$ICON_SET/AppIcon-512@2x.png"

if [ ! -f "$ICON_SOURCE" ]; then
  echo "Falowen icon source missing: $ICON_SOURCE" >&2
  exit 1
fi
if [ ! -d "$ICON_SET" ]; then
  echo "Capacitor iOS icon catalog missing: $ICON_SET" >&2
  exit 1
fi

# App Store icons need 1024x1024 px and no transparency. macOS sips is built
# in: a JPEG round-trip strips the alpha channel without an npm dependency.
# The current Falowen falo.png is our temporary approved-site artwork.
TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT
sips -s format jpeg "$ICON_SOURCE" --out "$TEMP_DIR/falowen.jpg" >/dev/null
sips -s format png "$TEMP_DIR/falowen.jpg" --out "$TEMP_DIR/falowen.png" >/dev/null
sips -z 1024 1024 "$TEMP_DIR/falowen.png" --out "$ICON_OUTPUT" >/dev/null

if ! sips -g pixelWidth -g pixelHeight "$ICON_OUTPUT" | grep -q 'pixelWidth: 1024'; then
  echo "Generated Falowen app icon is not 1024 pixels wide" >&2
  exit 1
fi
if ! sips -g pixelWidth -g pixelHeight "$ICON_OUTPUT" | grep -q 'pixelHeight: 1024'; then
  echo "Generated Falowen app icon is not 1024 pixels tall" >&2
  exit 1
fi
if ! sips -g hasAlpha "$ICON_OUTPUT" | grep -q 'hasAlpha: no'; then
  echo "Generated Falowen app icon unexpectedly contains transparency" >&2
  exit 1
fi
echo "Prepared Falowen 1024x1024 opaque iOS app icon."
