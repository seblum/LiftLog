# Personal Android preview

The optional personal build is named **LiftLog Sync** and has Android package ID
`com.seblum.liftlog`. It installs alongside the official LiftLog app and has its own app data. The
default build configuration is unchanged. To move existing data into the personal app, export a
backup from the official app and restore it in LiftLog Sync before enabling folder sync.

## Build and inspect locally

Requirements: Node 24, JDK 17, the Android SDK, and an emulator or Android phone with USB debugging
enabled. Set `JAVA_HOME` and `ANDROID_HOME` for your local installation.

From `app/`:

```sh
npm ci
npx expo customize tsconfig.json
npm run typecheck
npm run lint
npx vitest run --maxWorkers=2 --testTimeout=30000
bash scripts/build-personal-apk.sh
```

The result is `artifacts/liftlog-sync-preview.apk` at the repository root. It includes JavaScript and
runs without a development server. By default, the script includes `arm64-v8a` for modern phones and
`x86_64` for Intel emulators. Override `LIFTLOG_ANDROID_ARCHITECTURES` if needed, for example:

```sh
LIFTLOG_ANDROID_ARCHITECTURES=x86_64 bash scripts/build-personal-apk.sh
adb install -r ../artifacts/liftlog-sync-preview.apk
adb shell monkey -p com.seblum.liftlog 1
```

Open **Settings → Folder sync**, choose a dedicated folder, and let LiftLog write the initial files.
Sync that folder using Syncthing, edit a record on the computer, and use **Sync now** in the app to
inspect the result. App resume and foreground scans also pick up incoming changes. See
[FolderSync.md](./FolderSync.md) for the editable format, conflict handling, and deletion rules.

`LIFTLOG_PERSONAL_BUILD=1` selects this app identity during Expo prebuild. To return a generated
Android project to the official identity, rerun `npx expo prebuild --platform android --clean` without
that environment variable. Generated native projects are ignored by Git; keep persistent native
customizations in Expo config plugins or the repository's local native modules.

## Private repository and pull requests

The personal repository is a private standalone copy of LiftLog with its Git history preserved.
GitHub does not allow a public repository's fork to be made private, so this copy is separate from
GitHub's public fork network. Keep the public repository as an `upstream` remote for future updates.

Use pull requests for changes to `main`, and wait for **Validate personal Android** to pass before
merging. This check runs typechecking, lint, and the full Vitest suite for every pull request targeting
`main`; it has no path filters that could leave a required check pending. It also runs after each
push to `main` and on manual workflow runs.

**Main is currently unprotected.** GitHub rejected the protection request for this private repository
with HTTP 403: "Upgrade to GitHub Pro or make this repository public to enable this feature."
The repository remains private. Until the owner's plan supports private-repository protection and
the rule is installed, using pull requests and waiting for validation is a convention: GitHub still
allows direct pushes, force pushes, deletion, and merging without the check. The workflow cannot
prevent those actions. See [GitHub's protection availability](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

After upgrading the personal account to GitHub Pro, an authenticated repository administrator can
apply the intended rule with this command. It requires pull requests and an up-to-date successful
check, applies to administrators, and disallows force pushes and deletion. It does not require a
second person's approval, so the sole maintainer can merge their own pull requests.

```sh
gh api --method PUT repos/seblum/LiftLog/branches/main/protection --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Validate personal Android"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0,
    "require_last_push_approval": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
gh api repos/seblum/LiftLog/branches/main/protection
```

Only a successful API response and the subsequent protection read confirm enforcement. Repository
protection and workflow enablement are GitHub settings, not enforced by this Markdown file.
Only **Personal Android** is intended to run in this private copy; the other 16 inherited workflows
are disabled, including upstream publishing and duplicate native builds.

Actions uses a selected-action allowlist containing these exact references:

- `actions/checkout@v6`
- `actions/setup-node@v6`
- `actions/setup-java@v5`
- `gradle/actions/setup-gradle@v4`
- `android-actions/setup-android@9fc6c4e9069bf8d3d10b2204b1fb8f6ef7065407`
- `actions/upload-artifact@v7`

When updating an action version or adding an action, update the repository's Actions allowlist too;
otherwise GitHub will reject the workflow. Preserve these settings when recreating the repository.

## APK after merging to main

Merging a pull request into `main` automatically runs the **Personal Android** workflow. Once
validation passes, it builds the standalone APK for ARM64 phones and Intel emulators. The build has
a 90-minute timeout, two Gradle workers, and bounded JVM/Node heaps for a private repository's
standard GitHub-hosted runner. New workflow runs use `100 + github.run_number` for Android's
`BUILD_NUMBER`/version code. Retrying the same run reuses its version code.

In GitHub, open **Actions → Personal Android → the successful main run → Artifacts** and download
`liftlog-sync-preview-development-signed-<run number>-<attempt>`. Reruns retain each attempt's artifact.
The artifact contains the APK, its SHA-256
checksum, and `BUILD.txt` identifying the source commit and version code. Artifacts are retained for
30 days and require access to this private repository; download any build you want to keep longer.
After extraction, verify it with `shasum -a 256 liftlog-sync-preview.apk` against `SHA256SUMS.txt`.

For a manual rebuild, choose **Run workflow** with the **main** branch selected. Manual runs on other
branches run validation only; pull requests also run validation only. This avoids building an APK
for an unmerged branch. The workflow never creates a GitHub release or publishes to the Play Store.
It uses the existing release build's fallback development certificate and requires no upstream
signing or store credentials. The app retains the separate **LiftLog Sync** name and
`com.seblum.liftlog` package ID.

## Signing before publication

Preview APKs use a development signing key and are intended for evaluation. Before publishing
installable releases, create and retain your own release keystore, securely back it up, and use it
for every future version. Changing signing keys prevents updating an installed APK in place; export
your data before replacing a preview installation with a differently signed release.

The existing Android signing plugin accepts Gradle properties `ANDROID_UPLOAD_STORE_FILE`,
`ANDROID_UPLOAD_STORE_PASSWORD`, `ANDROID_UPLOAD_KEY_ALIAS`, and `ANDROID_UPLOAD_KEY_PASSWORD`.
Supply passwords through Gradle environment variables or CI secrets, never committed source files.
For local builds, pass a higher version code as
`bash scripts/build-personal-apk.sh -PBUILD_NUMBER=123` to update a previously installed CI build;
use a value greater than the installed build's `BUILD.txt` version code. CI supplies its version code
automatically. The original
**Release Android** workflow is for the upstream Play Store deployment; do not run it for a personal
preview.
