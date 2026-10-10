"""Check publication gates with stub Android tools; no real key or APK needed."""

import base64
import hashlib
import os
from pathlib import Path
import subprocess
import tempfile
import textwrap
import unittest


SCRIPT = Path(__file__).with_name("sign-personal-apk.sh").resolve()
CERTIFICATE = "ab" * 32


class SignPersonalApkTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory(prefix="liftlog signing tests ")
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name)
        for directory in ("app", "artifacts", "runner"):
            (self.root / directory).mkdir()
        (self.root / "app/personal-version.txt").write_text("1.2.3\n")
        self.artifacts = self.root / "artifacts"
        (self.artifacts / "liftlog-sync-preview.apk").write_bytes(b"preview-data")
        self.provenance = (
            "Repository: seblum/LiftLog\n"
            f"Commit: {'1' * 40}\n"
            "Version: 1.2.3\n"
            "Version code: 108\n"
            "Run: https://example.test/run/8\n"
            "Signing: development certificate; personal preview only\n"
        )
        (self.artifacts / "BUILD.txt").write_text(self.provenance)
        signer = self.write_tool("apksigner", """
            import os, pathlib, stat, sys
            if sys.argv[1] == 'sign':
                args = sys.argv
                assert args[args.index('--ks-pass') + 1] == 'env:ANDROID_KEYSTORE_PASSWORD'
                assert args[args.index('--key-pass') + 1] == 'env:ANDROID_KEY_PASSWORD'
                assert os.environ['ANDROID_KEYSTORE_PASSWORD'] not in args
                assert os.environ['ANDROID_KEY_PASSWORD'] not in args
                keystore = pathlib.Path(args[args.index('--ks') + 1])
                assert keystore.read_bytes() == b'fixture-private-key'
                assert stat.S_IMODE(keystore.stat().st_mode) & 0o077 == 0
                if os.environ.get('STUB_SIGN_FAILURE'):
                    sys.exit(1)
                pathlib.Path(args[args.index('--out') + 1]).write_bytes(b'signed-data')
            else:
                assert sys.argv[1:4] == ['verify', '--verbose', '--print-certs']
                if os.environ.get('STUB_VERIFY_FAILURE'):
                    sys.exit(1)
                print('Signer #1 certificate SHA-256 digest: ' + os.environ.get('STUB_CERT', 'ab' * 32))
                if os.environ.get('STUB_EXTRA_SIGNER'):
                    print('Signer #2 certificate SHA-256 digest: ' + 'ab' * 32)
        """)
        aapt = self.write_tool("aapt2", """
            import os, sys
            assert sys.argv[1:3] == ['dump', 'badging']
            print("package: name='" + os.environ.get('STUB_PACKAGE', 'com.seblum.liftlog')
                  + "' versionCode='" + os.environ.get('STUB_CODE', '108')
                  + "' versionName='" + os.environ.get('STUB_VERSION', '1.2.3') + "'")
        """)
        self.env = dict(
            os.environ,
            ANDROID_KEYSTORE_BASE64=base64.b64encode(b"fixture-private-key").decode(),
            ANDROID_KEYSTORE_PASSWORD="fixture-store-password",
            ANDROID_KEY_PASSWORD="fixture-key-password",
            ANDROID_KEY_ALIAS="personal",
            ANDROID_CERT_SHA256=":".join(["AB"] * 32),
            APKSIGNER=str(signer),
            AAPT2=str(aapt),
            RUNNER_TEMP=str(self.root / "runner"),
            GITHUB_SHA="1" * 40,
            GITHUB_RUN_NUMBER="8",
        )

    def write_tool(self, name, source):
        path = self.root / name
        path.write_text("#!/usr/bin/env python3\n" + textwrap.dedent(source))
        path.chmod(0o700)
        return path

    def run_script(self, **overrides):
        result = subprocess.run(
            ["bash", str(SCRIPT)],
            cwd=self.root,
            env=dict(self.env, **overrides),
            capture_output=True,
            text=True,
            timeout=30,
        )
        self.assertEqual(list((self.root / "runner").iterdir()), [], "Signing key was not removed")
        self.assertEqual((self.artifacts / "liftlog-sync-preview.apk").read_bytes(), b"preview-data")
        for secret in ("fixture-private-key", self.env["ANDROID_KEYSTORE_BASE64"],
                       self.env["ANDROID_KEYSTORE_PASSWORD"], self.env["ANDROID_KEY_PASSWORD"]):
            self.assertNotIn(secret, result.stdout + result.stderr)
        return result

    def test_signs_verified_release_and_preserves_provenance(self):
        result = self.run_script()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual((self.artifacts / "liftlog-sync.apk").read_bytes(), b"signed-data")
        expected_digest = hashlib.sha256(b"signed-data").hexdigest()
        self.assertEqual(
            (self.artifacts / "SHA256SUMS.txt").read_text(),
            f"{expected_digest}  liftlog-sync.apk\n",
        )
        expected_provenance = self.provenance.replace(
            "Signing: development certificate; personal preview only\n",
            "Signing: persistent personal release certificate\n"
            f"Signing certificate SHA-256: {CERTIFICATE}\n",
        )
        self.assertEqual((self.artifacts / "BUILD.txt").read_text(), expected_provenance)

    def test_rejects_invalid_signing_identity_version_and_provenance(self):
        cases = {
            "wrong certificate": {"STUB_CERT": "cd" * 32},
            "multiple signers": {"STUB_EXTRA_SIGNER": "1"},
            "wrong package": {"STUB_PACKAGE": "com.limajuice.liftlog"},
            "wrong version name": {"STUB_VERSION": "9.0.0"},
            "wrong version code": {"STUB_CODE": "9"},
            "wrong source commit": {"GITHUB_SHA": "2" * 40},
            "invalid base64": {"ANDROID_KEYSTORE_BASE64": "!!invalid!!"},
            "missing password": {"ANDROID_KEYSTORE_PASSWORD": ""},
            "signing failure": {"STUB_SIGN_FAILURE": "1"},
            "signature verification failure": {"STUB_VERIFY_FAILURE": "1"},
        }
        for name, overrides in cases.items():
            with self.subTest(name=name):
                result = self.run_script(**overrides)
                self.assertNotEqual(result.returncode, 0)
                self.assertFalse((self.artifacts / "liftlog-sync.apk").exists())
                self.assertFalse((self.artifacts / "SHA256SUMS.txt").exists())
                self.assertEqual((self.artifacts / "BUILD.txt").read_text(), self.provenance)


if __name__ == "__main__":
    unittest.main()
