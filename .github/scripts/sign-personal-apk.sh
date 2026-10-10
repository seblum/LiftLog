#!/usr/bin/env bash
set -euo pipefail
umask 077

artifact_dir="${1:-artifacts}"
: "${ANDROID_KEYSTORE_BASE64:?ANDROID_KEYSTORE_BASE64 is required}"
: "${ANDROID_KEYSTORE_PASSWORD:?ANDROID_KEYSTORE_PASSWORD is required}"
: "${ANDROID_KEY_ALIAS:?ANDROID_KEY_ALIAS is required}"
: "${ANDROID_KEY_PASSWORD:?ANDROID_KEY_PASSWORD is required}"
: "${ANDROID_CERT_SHA256:?ANDROID_CERT_SHA256 is required}"
: "${APKSIGNER:?APKSIGNER is required}"
: "${AAPT2:?AAPT2 is required}"
: "${RUNNER_TEMP:?RUNNER_TEMP is required}"
: "${GITHUB_SHA:?GITHUB_SHA is required}"
: "${GITHUB_RUN_NUMBER:?GITHUB_RUN_NUMBER is required}"

signing_dir="$(mktemp -d "$RUNNER_TEMP/liftlog-signing.XXXXXXXX")"
trap 'rm -rf "$signing_dir"' EXIT
trap 'exit 1' HUP INT TERM

python3 - "$signing_dir/personal.keystore" <<'PY'
import base64
import os
import pathlib
import sys

try:
    encoded = "".join(os.environ["ANDROID_KEYSTORE_BASE64"].split())
    decoded = base64.b64decode(encoded, validate=True)
    if not decoded:
        raise ValueError("empty keystore")
except ValueError:
    sys.exit("Invalid base64 signing keystore")
pathlib.Path(sys.argv[1]).write_bytes(decoded)
PY

# Passwords remain in the environment, never in command arguments or build logs.
"$APKSIGNER" sign \
  --ks "$signing_dir/personal.keystore" \
  --ks-key-alias "$ANDROID_KEY_ALIAS" \
  --ks-pass env:ANDROID_KEYSTORE_PASSWORD \
  --key-pass env:ANDROID_KEY_PASSWORD \
  --out "$signing_dir/liftlog-sync.apk" \
  "$artifact_dir/liftlog-sync-preview.apk"
"$APKSIGNER" verify --verbose --print-certs "$signing_dir/liftlog-sync.apk" \
  > "$signing_dir/signature.txt"
"$AAPT2" dump badging "$signing_dir/liftlog-sync.apk" > "$signing_dir/badging.txt"

python3 - "$signing_dir" "$artifact_dir" <<'PY'
import hashlib
import os
import pathlib
import re
import shutil
import sys

signing_dir, artifact_dir = map(pathlib.Path, sys.argv[1:])

def require(condition, message):
    if not condition:
        sys.exit(message)

expected_cert = re.sub(r"[\s:]", "", os.environ["ANDROID_CERT_SHA256"]).lower()
require(re.fullmatch(r"[0-9a-f]{64}", expected_cert), "Invalid expected signing certificate fingerprint")
certificates = re.findall(
    r"^Signer #\d+ certificate SHA-256 digest: ([0-9a-fA-F]+)$",
    (signing_dir / "signature.txt").read_text(),
    re.MULTILINE,
)
require([cert.lower() for cert in certificates] == [expected_cert], "APK signing certificate does not match the personal release certificate")

run_number = os.environ["GITHUB_RUN_NUMBER"]
require(re.fullmatch(r"[1-9][0-9]{0,9}", run_number), "Invalid workflow run number")
version_code = int(run_number) + 100
require(version_code <= 2100000000, "Android version code exceeds its maximum")
version = pathlib.Path("app/personal-version.txt").read_text().strip()
require(version, "Personal release version is empty")
package_lines = [line for line in (signing_dir / "badging.txt").read_text().splitlines() if line.startswith("package: ")]
require(len(package_lines) == 1, "APK package metadata is missing or ambiguous")
package = dict(re.findall(r"(\w+)='([^']*)'", package_lines[0]))
require(package.get("name") == "com.seblum.liftlog", "APK package is not com.seblum.liftlog")
require(package.get("versionName") == version, "APK version name does not match the release version")
require(package.get("versionCode") == str(version_code), "APK version code does not match this workflow run")

provenance = (artifact_dir / "BUILD.txt").read_text().splitlines()
require([line for line in provenance if line.startswith("Commit: ")] == [f"Commit: {os.environ['GITHUB_SHA']}"], "APK build provenance does not match this source commit")
require([line for line in provenance if line.startswith("Version code: ")] == [f"Version code: {version_code}"], "APK build provenance has an unexpected version code")
provenance = [line for line in provenance if not line.startswith(("Signing: ", "Signing certificate SHA-256: "))]
provenance += ["Signing: persistent personal release certificate", f"Signing certificate SHA-256: {expected_cert}"]

signed_apk = artifact_dir / "liftlog-sync.apk"
shutil.move(str(signing_dir / signed_apk.name), signed_apk)
with signed_apk.open("rb") as apk_file:
    digest = hashlib.file_digest(apk_file, "sha256").hexdigest()
(artifact_dir / "SHA256SUMS.txt").write_text(f"{digest}  {signed_apk.name}\n")
(artifact_dir / "BUILD.txt").write_text("\n".join(provenance) + "\n")
print(f"Verified personal release APK: {signed_apk} (version {version}, code {version_code})")
PY
