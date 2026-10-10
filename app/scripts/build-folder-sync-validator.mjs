#!/usr/bin/env node

// Ahead-of-time validation works on Hermes without runtime code generation.
import Ajv, { _ } from 'ajv';
import addFormats from 'ajv-formats';
import standaloneCode from 'ajv/dist/standalone/index.js';
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const outputDir = join(scriptDir, '../src/models/generated');
const schemaPath = join(outputDir, 'folder-sync.schema.json');
const outputPath = join(outputDir, 'validate-folder-sync.js');

function replaceDecimalFormat(node) {
  if (Array.isArray(node)) return node.map(replaceDecimalFormat);
  if (node && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node).map(([key, value]) =>
        key === 'format' && value === 'decimal'
          ? ['pattern', '^-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?$']
          : [key, replaceDecimalFormat(value)],
      ),
    );
  }
  return node;
}

const schema = replaceDecimalFormat(JSON.parse(fs.readFileSync(schemaPath, 'utf8')));
delete schema.$schema;
const ajv = new Ajv({
  discriminator: true,
  allErrors: true,
  code: { source: true, formats: _`require("ajv-formats/dist/formats").fullFormats` },
});
addFormats(ajv);
const validateModule = standaloneCode(ajv, ajv.compile(schema));

const tmpDir = fs.mkdtempSync(join(scriptDir, '.folder-sync-validator-'));
try {
  fs.writeFileSync(join(tmpDir, 'validator.js'), validateModule);
  await esbuild.build({
    absWorkingDir: tmpDir,
    entryPoints: ['validator.js'],
    outfile: outputPath,
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2020',
    banner: {
      js: '// GENERATED FILE - DO NOT EDIT. Regenerate with npm run json-schema.\n// oxlint-disable',
    },
  });
  fs.writeFileSync(
    join(outputDir, 'validate-folder-sync.d.ts'),
    [
      '// GENERATED FILE - DO NOT EDIT. Regenerate with npm run json-schema.',
      "import type { ValidateFunction } from 'ajv';",
      "import type { SyncRecord } from '@/models/folder-sync';",
      'declare const validate: ValidateFunction<SyncRecord>;',
      'export default validate;',
      '',
    ].join('\n'),
  );
  console.log(`Wrote validator to ${outputPath}`);
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
