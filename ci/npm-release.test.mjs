import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { npmTag, verifyCandidate } from './npm-release.mjs';

for (const [version, tag] of [
  ['2.6.4', 'latest'],
  ['2.6.5-alpha.1', 'alpha'],
  ['2.6.5-beta.1', 'beta'],
  ['2.6.5-rc.1', 'rc'],
  ['3.0.0-webgpu-react18.8', 'webgpu'],
  ['3.0.0-webgpu.2', 'webgpu'],
]) {
  test(`${version} publishes under ${tag}`, () => assert.equal(npmTag(version), tag));
}

test('unknown prereleases cannot overwrite latest', () => {
  assert.throws(() => npmTag('3.0.0-dev.1'), /must not publish to latest/);
});

const manifest = JSON.parse(readFileSync(new URL('./release/webgpu.json', import.meta.url), 'utf8'));

test('frozen candidate matches tested bytes and all source files', () => {
  assert.equal(Object.keys(manifest.sourceFiles).length, 89);
  assert.match(verifyCandidate(process.cwd(), manifest).integrity, /^sha512-/);
});

test('a changed artifact is rejected before publication', () => {
  assert.throws(() => verifyCandidate(process.cwd(), { ...manifest, sha256: '0'.repeat(64) }), /tarball SHA256 mismatch/);
});

test('a changed source file is rejected before publication', () => {
  assert.throws(() => verifyCandidate(process.cwd(), { ...manifest, sourceFiles: { 'package.json': '0'.repeat(64) } }), /source differs: package.json/);
});
