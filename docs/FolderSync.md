# Folder sync with Syncthing

Folder sync lets you edit LiftLog training data as readable JSON on a computer and receive those
changes back in the Android app. LiftLog handles validation, record identities, reconciliation and
conflicts. Syncthing transports the files between your devices. No LiftLog backend is required.

## Connect a folder

1. Create a dedicated folder on your phone, for example `Documents/LiftLog`.
2. Share that folder with your computer using Syncthing in **Send & Receive** mode on both devices.
   Keep Syncthing's conflict copies enabled so concurrent offline edits remain available for review.
   You can include an always-on NAS as another Syncthing device.
3. In LiftLog, open **Settings → Folder sync → Choose folder**. Select that same phone folder in
   Android's system picker and allow access.
4. LiftLog exports existing records and checks incoming ones. Wait for the scan to finish and review
   any issues before editing the files on your computer.

The first scan combines different IDs. When a file and an existing app record have the same ID but
different contents, it asks you to choose; connecting a folder never silently replaces those records.
Use **Sync now** to retry. **Disconnect** stops sync and retains both app data and shared files. A later
connection to the same folder retains its previous comparison baselines.

Android grants access to the selected folder, not the whole device. Use a subfolder in shared storage,
not `Android/data` or a storage root. Moving/deleting the folder or revoking its permission requires
selecting it again. Use a local shared-storage provider that supports document creation and rename.

## What syncs

| File | Contents |
| --- | --- |
| `session--<id>.json` | Logged workouts: dates, weighted/cardio exercises, recorded and planned sets, weights and units, notes, and bodyweight. |
| `program--<id>.json` | Training plans and their workout templates, targets, rests, and progression rules. |
| `exercise--<id>.json` | Saved exercises and user overrides of built-in exercise definitions. |
| `exercise-visibility--<id>.json` | Whether a built-in exercise is hidden. Set `data.hidden` to `false` to restore it. |
| `LiftLog.schema.json` | JSON Schema for editor validation and AI-assisted editing. |
| `LiftLog.README.txt` | Short editing instructions that travel with the folder. |

The schema and README are maintained by LiftLog and refreshed when the app's format changes.

IDs are stable; some built-in records have names instead of UUIDs. Names are URL-encoded in filenames
(for example, a space becomes `%20`). Keep filenames and IDs aligned. Separate files mean edits to
unrelated workouts can sync independently.

The active workout is protected and starts syncing after you finish it. Incoming edits or deletions
of that workout wait until it is finished. Active-plan selection, timers, device settings, service
credentials, and social feed/account data stay local. Sync preserves the currently selected plan
where possible; deleting it selects another remaining plan. Add another plan before deleting the last
one.

## Edit on the computer

Edit the `data` object while retaining `version`, `kind`, and `id`. A session's `data.id` must match its
outer `id`. You do not need to edit revision numbers, timestamps, or hashes: LiftLog compares content
against its last accepted version. Dates describing the workout are ordinary editable data.

For example, a plan file named `program--5e9bc51e-8788-4431-bf45-4eec3c069a1d.json` can contain:

```json
{
  "version": 1,
  "kind": "program",
  "id": "5e9bc51e-8788-4431-bf45-4eec3c069a1d",
  "deleted": false,
  "data": {
    "version": 3,
    "name": "My edited plan",
    "lastEdited": "2026-09-30",
    "sessions": []
  }
}
```

Use the exported files as examples for workout/plan contents. Weights and distances use decimal
**strings** plus explicit units; rep counts use integers, and durations use ISO-8601 duration strings.
The outer sync format and the inner domain models have separate version fields. Preserve all of them.

To create a record, copy a suitable example and give it a new UUID in the filename and ID fields. To
delete a workout, plan, or saved exercise, keep its identity and set `deleted` to `true` and `data` to
`null`. Removing a file is not a deletion request: LiftLog recreates missing files so incomplete
transfers and temporarily missing folders cannot erase training history. Retain deletion records so
an offline device does not restore old data.

For an AI editor, give it `LiftLog.schema.json`, the relevant files, and these instructions:

> Edit only the requested training data. Preserve record identities, all version fields, units, and
> unrelated fields. Keep each file valid against LiftLog.schema.json. Use a new UUID only for a new
> workout or plan. For an intentional deletion, set deleted to true and data to null.

`.liftlogplan` files and existing plaintext exports are separate formats. Do not drop them unchanged
into this folder; the sync envelope supplies the record ID and deletion semantics missing from those
exports. Editing is at the whole-workout/whole-plan level; individual sets do not need new IDs.

## Timing, errors, and conflicts

LiftLog scans on startup/resume, after training data changes, every ten seconds while foregrounded,
and when you press **Sync now**. Syncthing must first deliver the changed file. Android can suspend or
stop the app; immediate import while LiftLog is closed is not promised.

If both sides changed the same record since the previous scan, both versions are kept. Open the issue
in **Folder sync**, review the summaries/full JSON, and choose the app or file version. The app rejects
a decision if either version has changed since it was displayed. Syncthing's `.sync-conflict-…` files
are also presented for review, including the canonical file when it contains a third distinct version.

Malformed JSON, unsupported versions, mismatched IDs, invalid values, unreadable files and missing
permissions are shown as errors; the app does not replace them with its own export. Fix the file or
permissions, then sync again. Imported history corrections rebuild progression and statistics. They
do not replay workout-completion events to the social feed or Health Connect.

The folder contains readable personal training data. Share it only with your trusted devices.
Syncthing replication is not a substitute for independent restore points.

## Preserved files

Before replacing an existing document, LiftLog stages the new contents, compares the current file,
and preserves the previous document. `.ll-h-…` files and `.liftlog-archives/` contain preserved versions.
These can be retained for recovery and removed manually once no longer needed; they are not imported.
`.ll-p-…` and `.ll-r-…` are temporary/recovery files. Interrupted replacements are recovered on the next
scan; ambiguous recoveries stop sync rather than choose a version automatically. Leave these files
alone while the app is running.

Android document providers do not offer a cross-process atomic compare-and-swap. LiftLog rechecks
contents around publication, preserves displaced documents, and surfaces detected races as conflicts.
An editor still holding an old document open may write to its preserved version. Prefer saving and
closing desktop edits before resuming work on the same record in the phone app.

## Implementation and verification

- `app/src/models/folder-sync.ts` defines the envelope, canonical identities, parser and semantic checks.
- `app/src/services/folder-sync/reconcile.ts` implements three-way, whole-record reconciliation.
- `app/src/services/folder-sync-service.ts` coordinates scans and conflict reviews.
- `app/src/services/folder-sync/repository.ts` applies records and baselines with serialized persistence.
- `app/modules/native-lib/android/…/LiftLogSyncDirectoryModule.kt` implements persistent SAF access,
  bounded UTF-8 reads, conditional publication and recovery using real document names.
- `app/src/components/smart/folder-sync-manager.tsx` owns foreground scheduling.

Baselines live in the local SQLite database, scoped to the selected folder. Session, plan and saved
exercise writes commit together with their baselines. Hidden-exercise preferences are persisted
before their baseline; failures retain the previous baseline for retry. Queued local writes re-read
current state so an old pending write cannot overwrite an incoming correction. Sync only starts once
settings, plans and history hydrate.

Regenerate the published schema and bundled standalone validator with `npm run json-schema` in
`app/`. Do not edit generated schemas manually. Runtime validation is precompiled and does not rely
on evaluating generated code on the phone.

Tests cover record validation, idempotence, offline edits, deletion/edit conflicts, missing files,
stale reviews, interrupted commits, persistence ordering and derived-state updates. Native storage
must also be verified on an emulator/device through the system folder picker. See
[Android preview and APK](AndroidPreview.md) for the local build workflow.
