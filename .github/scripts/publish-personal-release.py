#!/usr/bin/env python3
"""Publish an APK only to the Release Please draft for its exact source commit."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess


ASSETS = ("liftlog-sync.apk", "SHA256SUMS.txt", "BUILD.txt")
VERSION = re.compile(r"(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)")
TAG_PREFIX = "liftlog-sync-v"


class ReleaseError(RuntimeError):
    pass


def gh(*args, payload=None, missing_ok=False):
    command = ["gh", *args]
    if payload is not None:
        command += ["--input", "-"]
    result = subprocess.run(
        command,
        input=json.dumps(payload) if payload is not None else None,
        text=True,
        capture_output=True,
        check=False,
    )
    if result.returncode:
        if missing_ok and "HTTP 404" in result.stderr:
            return None
        raise ReleaseError(f"GitHub command failed: {result.stderr.strip()}")
    if args[0] == "api" and result.stdout.strip():
        return json.loads(result.stdout)
    return None


def output(name, value):
    if path := os.environ.get("GITHUB_OUTPUT"):
        with open(path, "a", encoding="utf-8") as stream:
            stream.write(f"{name}={value}\n")


def checksum(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def verify_files(directory, apk, sha):
    lines = (directory / "SHA256SUMS.txt").read_text().strip().splitlines()
    if len(lines) != 1:
        raise ReleaseError("SHA256SUMS.txt must contain exactly one APK checksum.")
    match = re.fullmatch(r"([0-9a-fA-F]{64})\s+\*?(.+)", lines[0])
    if not match or Path(match[2]).name != apk:
        raise ReleaseError(f"SHA256SUMS.txt does not identify {apk}.")
    if checksum(directory / apk) != match[1].lower():
        raise ReleaseError(f"Checksum mismatch for {apk}; rebuild or restore the correct artifact.")
    commits = re.findall(r"^Commit: (.+)$", (directory / "BUILD.txt").read_text(), re.MULTILINE)
    if commits != [sha]:
        raise ReleaseError("BUILD.txt commit does not match GITHUB_SHA; refusing to publish.")


def tag_commit(repo, tag):
    ref = gh("api", f"repos/{repo}/git/ref/tags/{tag}", missing_ok=True)
    if ref is None:
        raise ReleaseError(f"Release tag {tag} is missing; enable force-tag-creation in Release Please.")
    obj = ref["object"]
    visited = set()
    while obj["type"] == "tag":
        if obj["sha"] in visited or len(visited) >= 10:
            raise ReleaseError(f"Cannot safely resolve annotated tag {tag}.")
        visited.add(obj["sha"])
        obj = gh("api", f"repos/{repo}/git/tags/{obj['sha']}")["object"]
    if obj["type"] != "commit":
        raise ReleaseError(f"Release tag {tag} does not point to a commit.")
    return obj["sha"]


def verify_assets(release, directory=None):
    assets = release.get("assets", [])
    for name in ASSETS:
        matches = [asset for asset in assets if asset["name"] == name]
        if len(matches) != 1 or matches[0].get("state") != "uploaded":
            raise ReleaseError(f"Release {release['tag_name']} is missing a completed {name} asset.")
        if directory is not None:
            expected = f"sha256:{checksum(directory / name)}"
            if matches[0].get("digest") != expected:
                raise ReleaseError(f"Uploaded {name} digest does not match; retry this publication job.")


def releases(repo):
    pages = gh("api", f"repos/{repo}/releases?per_page=100", "--paginate", "--slurp")
    return [release for page in pages for release in page]


def find_release(repo, tag):
    release = gh("api", f"repos/{repo}/releases/tags/{tag}", missing_ok=True)
    if release is not None:
        return release
    # The by-tag REST endpoint only finds published releases. Drafts are listed
    # for callers with push access and must subsequently be addressed by ID.
    matches = [release for release in releases(repo) if release["tag_name"] == tag]
    if len(matches) > 1:
        raise ReleaseError(f"Multiple releases use {tag}; resolve the ambiguous drafts first.")
    return matches[0] if matches else None


def has_newer_release(repo, version):
    current = tuple(map(int, version.split(".")))
    for release in releases(repo):
        if release["draft"] or release["prerelease"]:
            continue
        tag = release["tag_name"]
        if not tag.startswith(TAG_PREFIX):
            continue
        match = VERSION.fullmatch(tag[len(TAG_PREFIX):])
        if match and tuple(map(int, match.groups())) > current:
            return True
    return False


def run(mode, version_file, directory):
    output("ready", "false")
    repo = os.environ["GH_REPO"]
    sha = os.environ["GITHUB_SHA"]
    if not re.fullmatch(r"[0-9a-f]{40}", sha):
        raise ReleaseError("GITHUB_SHA must be a full commit SHA.")
    version = version_file.read_text().strip()
    if not VERSION.fullmatch(version):
        raise ReleaseError("The personal version must be a stable major.minor.patch version.")
    tag = TAG_PREFIX + version
    output("tag", tag)
    release = find_release(repo, tag)
    if release is None:
        print(f"No release for {tag}; this build remains an Actions artifact.")
        return
    endpoint = f"repos/{repo}/releases/{release['id']}"
    if tag_commit(repo, tag) != sha:
        print(f"Skipping {tag}: its tag does not match the built commit {sha}.")
        return
    if not release["draft"]:
        verify_assets(release)
        print(f"{tag} is already published with all release assets; leaving it unchanged.")
        return
    verify_files(directory, "liftlog-sync-preview.apk" if mode == "prepare" else ASSETS[0], sha)
    if mode == "prepare":
        output("ready", "true")
        print(f"Verified draft {tag} and preview APK; ready for release signing.")
        return

    # The workflow serializes publication. Recheck before touching assets on retries.
    release = gh("api", endpoint)
    if not release["draft"]:
        verify_assets(release)
        print(f"{tag} was already published; leaving it unchanged.")
        return
    if tag_commit(repo, tag) != sha:
        raise ReleaseError("Release tag changed before upload; refusing to publish.")
    gh("release", "upload", tag, *(str(directory / name) for name in ASSETS), "--repo", repo, "--clobber")
    release = gh("api", endpoint)
    verify_assets(release, directory)
    if not release["draft"]:
        print(f"{tag} is already published with matching asset digests.")
        return
    if tag_commit(repo, tag) != sha:
        raise ReleaseError("Release tag changed after upload; draft was not published.")
    published = gh(
        "api", endpoint, "--method", "PATCH",
        payload={"draft": False, "make_latest": "false" if has_newer_release(repo, version) else "true"},
    )
    if published["draft"]:
        raise ReleaseError("GitHub did not confirm publication; retry this publication job.")
    print(f"Published {published['html_url']} with verified APK and metadata.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=("prepare", "publish"))
    parser.add_argument("version_file", type=Path)
    parser.add_argument("artifact_directory", type=Path)
    args = parser.parse_args()
    try:
        run(args.mode, args.version_file, args.artifact_directory)
    except (ReleaseError, OSError, KeyError, ValueError) as error:
        parser.exit(1, f"Release publication failed: {error}\n")


if __name__ == "__main__":
    main()
