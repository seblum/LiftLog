import hashlib
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
from types import SimpleNamespace
from unittest.mock import patch


spec = importlib.util.spec_from_file_location("publisher", Path(__file__).with_name("publish-personal-release.py"))
publisher = importlib.util.module_from_spec(spec)
spec.loader.exec_module(publisher)
SHA = "a" * 40
OTHER_SHA = "b" * 40
TAG = "liftlog-sync-v0.1.0"


class GitHubCommandTests(unittest.TestCase):
    def test_only_explicit_not_found_is_skipped(self):
        with patch.object(publisher.subprocess, "run") as command:
            command.return_value = SimpleNamespace(returncode=1, stdout="", stderr="gh: Not Found (HTTP 404)")
            self.assertIsNone(publisher.gh("api", "repos/owner/repo/releases/tags/v1", missing_ok=True))
            command.return_value.stderr = "gh: API rate limit exceeded (HTTP 403)"
            with self.assertRaisesRegex(publisher.ReleaseError, "rate limit"):
                publisher.gh("api", "repos/owner/repo/releases/tags/v1", missing_ok=True)


class PublicationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.directory = Path(self.temp.name)
        self.version = self.directory / "version.txt"
        self.version.write_text("0.1.0\n")
        self.outputs = self.directory / "outputs"
        self.env = patch.dict(os.environ, {"GH_REPO": "owner/repo", "GITHUB_SHA": SHA, "GITHUB_OUTPUT": str(self.outputs)})
        self.env.start()
        self.addCleanup(self.env.stop)
        self.release = {"id": 123, "tag_name": TAG, "draft": True, "prerelease": False, "assets": [], "html_url": "https://example.test/release"}
        self.tag_sha = SHA
        self.annotated = False
        self.release_missing = False
        self.newer = False
        self.corrupt_upload = False
        self.fail_upload_once = False
        self.calls = []
        self.mock = patch.object(publisher, "gh", side_effect=self.gh)
        self.mock.start()
        self.addCleanup(self.mock.stop)

    def gh(self, *args, **kwargs):
        self.calls.append((args, kwargs))
        if args[:2] == ("release", "upload"):
            self.release["assets"] = [
                {"name": name, "state": "uploaded", "digest": "sha256:" + publisher.checksum(self.directory / name)}
                for name in publisher.ASSETS
            ]
            if self.fail_upload_once:
                self.fail_upload_once = False
                self.release["assets"] = self.release["assets"][:1]
                raise publisher.ReleaseError("Interrupted asset upload")
            if self.corrupt_upload:
                self.release["assets"][0]["digest"] = "sha256:" + "0" * 64
            return None
        endpoint = args[1]
        if "/git/ref/tags/" in endpoint:
            return {"object": {"type": "tag" if self.annotated else "commit", "sha": OTHER_SHA if self.annotated else self.tag_sha}}
        if "/git/tags/" in endpoint:
            return {"object": {"type": "commit", "sha": self.tag_sha}}
        if "/releases/tags/" in endpoint:
            return None if self.release_missing or self.release["draft"] else json.loads(json.dumps(self.release))
        if endpoint.endswith("releases?per_page=100"):
            releases = [{"tag_name": "liftlog-sync-v0.2.0" if self.newer else "liftlog-sync-v0.0.9", "draft": False, "prerelease": False}]
            if not self.release_missing:
                releases.append(json.loads(json.dumps(self.release)))
            return [releases]
        if endpoint.endswith("releases/123"):
            if "payload" in kwargs:
                self.release["draft"] = kwargs["payload"]["draft"]
            return json.loads(json.dumps(self.release))
        self.fail(f"Unexpected gh call: {args}")

    def artifacts(self, apk="liftlog-sync-preview.apk"):
        (self.directory / apk).write_bytes(b"apk fixture")
        digest = hashlib.sha256(b"apk fixture").hexdigest()
        (self.directory / "SHA256SUMS.txt").write_text(f"{digest}  ../artifacts/{apk}\n")
        (self.directory / "BUILD.txt").write_text(f"Commit: {SHA}\nSigning certificate SHA-256: test\n")

    def run_mode(self, mode):
        publisher.run(mode, self.version, self.directory)

    def mutation_calls(self):
        return [call for call in self.calls if call[0][0] == "release" or "--method" in call[0]]

    def test_missing_release_and_unrelated_commit_skip_without_reading_artifacts(self):
        self.release_missing = True
        self.run_mode("prepare")
        self.release_missing = False
        self.tag_sha = OTHER_SHA
        self.run_mode("publish")
        self.assertNotIn("ready=true", self.outputs.read_text())
        self.assertEqual([], self.mutation_calls())

    def test_prepare_resolves_annotated_tag_and_accepts_matching_artifacts(self):
        self.artifacts()
        self.annotated = True
        self.run_mode("prepare")
        self.assertIn(f"tag={TAG}\nready=true", self.outputs.read_text())
        self.assertEqual([], self.mutation_calls())
        self.assertTrue(any(call[0][1].endswith("releases?per_page=100") for call in self.calls))

    def test_corrupt_hash_or_provenance_never_marks_ready(self):
        for corrupted in ("apk", "commit"):
            with self.subTest(corrupted=corrupted):
                self.artifacts()
                if corrupted == "apk":
                    (self.directory / "liftlog-sync-preview.apk").write_bytes(b"corrupt")
                else:
                    (self.directory / "BUILD.txt").write_text(f"Commit: {OTHER_SHA}\n")
                with self.assertRaises(publisher.ReleaseError):
                    self.run_mode("prepare")
        self.assertNotIn("ready=true", self.outputs.read_text())
        self.assertEqual([], self.mutation_calls())

    def test_published_release_is_not_overwritten(self):
        self.release["draft"] = False
        self.release["assets"] = [{"name": name, "state": "uploaded"} for name in publisher.ASSETS]
        self.run_mode("publish")
        self.assertEqual([], self.mutation_calls())
        self.release["assets"].pop()
        with self.assertRaisesRegex(publisher.ReleaseError, "missing a completed"):
            self.run_mode("prepare")
        self.assertEqual([], self.mutation_calls())

    def test_draft_uploads_are_verified_then_published(self):
        self.artifacts("liftlog-sync.apk")
        self.run_mode("publish")
        self.assertFalse(self.release["draft"])
        self.assertEqual("true", self.mutation_calls()[-1][1]["payload"]["make_latest"])
        mutations = len(self.mutation_calls())
        self.run_mode("publish")
        self.assertEqual(mutations, len(self.mutation_calls()))

    def test_partial_upload_retry_and_older_release_does_not_become_latest(self):
        self.artifacts("liftlog-sync.apk")
        self.fail_upload_once = True
        self.newer = True
        with self.assertRaisesRegex(publisher.ReleaseError, "Interrupted"):
            self.run_mode("publish")
        self.assertTrue(self.release["draft"])
        self.run_mode("publish")
        self.assertFalse(self.release["draft"])
        self.assertEqual("false", self.mutation_calls()[-1][1]["payload"]["make_latest"])
        self.assertIn("--clobber", self.mutation_calls()[0][0])

    def test_bad_uploaded_digest_keeps_release_draft(self):
        self.artifacts("liftlog-sync.apk")
        self.corrupt_upload = True
        with self.assertRaisesRegex(publisher.ReleaseError, "digest does not match"):
            self.run_mode("publish")
        self.assertTrue(self.release["draft"])
        self.assertFalse(any("--method" in call[0] for call in self.calls))


if __name__ == "__main__":
    unittest.main()
