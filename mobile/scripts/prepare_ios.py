#!/usr/bin/env python3
"""Apply Falowen's iOS permission copy to a freshly generated Capacitor project.

Capacitor's ios/ directory is recreated in CI, so these native settings must be
applied on every build. No third-party Python dependencies are needed.
"""
from pathlib import Path
import plistlib

plist_path = Path(__file__).resolve().parents[1] / "ios/App/App/Info.plist"
if not plist_path.is_file():
    raise SystemExit(f"Missing generated iOS Info.plist: {plist_path}")

with plist_path.open("rb") as fp:
    info = plistlib.load(fp)

info["NSMicrophoneUsageDescription"] = (
    "Falowen uses the microphone to record your German speaking exercises "
    "and practice exam answers."
)

with plist_path.open("wb") as fp:
    plistlib.dump(info, fp, sort_keys=False)

print(f"Updated Falowen microphone permission: {plist_path}")
