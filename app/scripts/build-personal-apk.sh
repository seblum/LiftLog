#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -d node_modules ]]; then
  echo 'Install the locked dependencies with npm ci first.' >&2
  exit 1
fi

export LIFTLOG_PERSONAL_BUILD=1
export CI=1
export NODE_ENV=production

personal_version=$(cat personal-version.txt)
if [[ ! "$personal_version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo 'personal-version.txt must contain a stable semantic version.' >&2
  exit 1
fi

# A release variant embeds JavaScript and runs without a Metro development server.
# Without upload signing properties, the existing signing plugin uses a debug key.
npx expo prebuild --platform android --no-install

(
  cd android
  ./gradlew :app:assembleRelease \
    "-PDISPLAY_VERSION=$personal_version" \
    "-PreactNativeArchitectures=${LIFTLOG_ANDROID_ARCHITECTURES:-arm64-v8a,x86_64}" \
    "--max-workers=${LIFTLOG_GRADLE_WORKERS:-2}" \
    "$@"
)

mkdir -p ../artifacts
cp android/app/build/outputs/apk/release/app-release.apk \
  ../artifacts/liftlog-sync-preview.apk
echo "Preview APK: $(cd ../artifacts && pwd)/liftlog-sync-preview.apk"
echo 'This APK uses a development signing key. Use a persistent personal key before publishing releases.'
