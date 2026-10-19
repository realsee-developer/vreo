import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { npmTag, publishCandidate, verifyCandidate } from './npm-release.mjs';

for (const [version, tag] of [
  ['2.6.4', 'latest'],
  ['2.6.5-alpha.1', 'alpha'],
  ['2.6.5-beta.1', 'beta'],
  ['2.6.5-rc.1', 'rc'],
  ['3.0.0-webgpu-react18.8', 'webgpu'],
  ['3.0.0-webgpu.9', 'webgpu'],
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

test('delayed npm visibility waits beyond the old window and publishes only once', async () => {
  const { integrity } = verifyCandidate(process.cwd(), manifest);
  const stale = { 'dist-tags': { latest: manifest.baselineLatest }, versions: {} };
  const ready = {
    'dist-tags': { latest: manifest.baselineLatest, webgpu: manifest.version },
    versions: { [manifest.version]: { dist: { integrity } } },
  };
  const commands = [];
  const waits = [];
  let reads = 0;
  await publishCandidate(process.cwd(), manifest, {
    readMetadata: async (_name, version) => {
      if (version) return null;
      reads += 1;
      return reads < 8 ? stale : ready;
    },
    runNpm: (args) => commands.push(args),
    sleep: async (ms) => waits.push(ms),
    log: () => {},
  });
  assert.equal(commands.length, 1);
  assert.equal(commands[0][0], 'publish');
  assert.ok(commands[0].includes('--tag=webgpu'));
  assert.deepEqual(waits, Array(6).fill(5000));
});

test('npm visibility timeout is bounded and never repeats publication', async () => {
  const commands = [];
  const waits = [];
  await assert.rejects(publishCandidate(process.cwd(), manifest, {
    readMetadata: async (_name, version) => version ? null : {
      'dist-tags': { latest: manifest.baselineLatest }, versions: {},
    },
    runNpm: (args) => commands.push(args),
    sleep: async (ms) => waits.push(ms),
    log: () => {},
  }), /webgpu tag was not applied within five minutes/);
  assert.equal(commands.length, 1);
  assert.equal(commands[0][0], 'publish');
  assert.deepEqual(waits, Array(60).fill(5000));
});

test('an already published matching candidate only verifies without republishing', async () => {
  const { integrity } = verifyCandidate(process.cwd(), manifest);
  const published = { dist: { integrity } };
  const ready = {
    'dist-tags': { latest: manifest.baselineLatest, webgpu: manifest.version },
    versions: { [manifest.version]: published },
  };
  const commands = [];
  await publishCandidate(process.cwd(), manifest, {
    readMetadata: async (_name, version) => version ? published : ready,
    runNpm: (args) => commands.push(args),
    sleep: async () => assert.fail('matching published candidate must not wait'),
    log: () => {},
  });
  assert.deepEqual(commands, []);
});
