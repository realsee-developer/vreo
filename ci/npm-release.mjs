import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const registry = 'https://registry.npmjs.org/';
const hash = (data, algorithm = 'sha256') => createHash(algorithm).update(data).digest('hex');

export function npmTag(version) {
  assert.match(version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/, 'invalid package version');
  const prerelease = version.split('-').slice(1).join('-');
  if (!prerelease) return 'latest';
  if (/(^|[.-])webgpu([.-]|$)/.test(prerelease)) return 'webgpu';
  for (const tag of ['alpha', 'beta', 'rc']) {
    if (prerelease.startsWith(`${tag}.`)) return tag;
  }
  throw new Error(`unrecognized prerelease must not publish to latest: ${version}`);
}

export function verifyCandidate(root, manifest) {
  assert.equal(manifest.packageName, '@realsee/vreo');
  assert.equal(manifest.tag, 'webgpu');
  assert.equal(npmTag(manifest.version), 'webgpu');
  const artifact = resolve(root, manifest.tarball);
  const bytes = readFileSync(artifact);
  assert.equal(hash(bytes), manifest.sha256, 'candidate tarball SHA256 mismatch');
  for (const [path, expected] of Object.entries(manifest.sourceFiles)) {
    assert.equal(hash(readFileSync(resolve(root, manifest.sourceRoot, path))), expected, `source differs: ${path}`);
  }
  const unpacked = spawnSync('tar', ['-xOf', artifact, 'package/package.json'], { encoding: 'utf8' });
  assert.equal(unpacked.status, 0, unpacked.stderr);
  const packed = JSON.parse(unpacked.stdout);
  const source = JSON.parse(readFileSync(resolve(root, manifest.sourceRoot, 'package.json'), 'utf8'));
  assert.deepEqual(packed, source, 'packed package metadata differs from source');
  assert.equal(packed.name, manifest.packageName);
  assert.equal(packed.version, manifest.version);
  assert.equal(packed.private, false);
  return { artifact, integrity: `sha512-${createHash('sha512').update(bytes).digest('base64')}` };
}

async function metadata(name, version) {
  const url = `${registry}${encodeURIComponent(name)}${version ? `/${encodeURIComponent(version)}` : ''}`;
  const response = await fetch(url);
  if (response.status === 404 && version) return null;
  assert.equal(response.status, 200, `registry returned ${response.status}: ${url}`);
  return response.json();
}

function npm(args) {
  const result = spawnSync('npm', args, { stdio: 'inherit' });
  assert.equal(result.status, 0, `npm ${args[0]} failed`);
}

export async function publishCandidate(root, manifest, {
  readMetadata = metadata,
  runNpm = npm,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  log = console.log,
} = {}) {
  const { artifact, integrity } = verifyCandidate(root, manifest);
  const before = await readMetadata(manifest.packageName);
  assert.equal(before['dist-tags'].latest, manifest.baselineLatest, 'latest changed; review before publishing');
  const existing = await readMetadata(manifest.packageName, manifest.version);
  if (existing) {
    assert.equal(existing.dist.integrity, integrity, 'published version differs from tested artifact');
    if (before['dist-tags'].webgpu !== manifest.version) {
      runNpm(['dist-tag', 'add', `${manifest.packageName}@${manifest.version}`, 'webgpu', `--registry=${registry}`]);
    }
  } else {
    runNpm(['publish', artifact, '--tag=webgpu', '--access=public', '--ignore-scripts', `--registry=${registry}`]);
  }
  // npm may accept the upload before its version and dist-tag become public.
  // Wait up to five minutes without repeating the publish operation.
  let after;
  for (let attempt = 0; attempt <= 60; attempt += 1) {
    after = await readMetadata(manifest.packageName);
    assert.equal(after['dist-tags'].latest, before['dist-tags'].latest, 'latest must remain unchanged');
    const published = after.versions?.[manifest.version];
    if (published) {
      assert.equal(published.dist.integrity, integrity, 'published artifact integrity differs');
    }
    if (after['dist-tags'].webgpu === manifest.version && published) break;
    if (attempt < 60) {
      log(`Waiting for npm to expose ${manifest.packageName}@${manifest.version} and webgpu tag (${attempt * 5}/300 seconds).`);
      await sleep(5000);
    }
  }
  assert.equal(after['dist-tags'].webgpu, manifest.version, 'webgpu tag was not applied within five minutes');
  assert.equal(after.versions?.[manifest.version]?.dist.integrity, integrity, 'published artifact integrity differs');
  log(JSON.stringify({ name: manifest.packageName, version: manifest.version, tag: 'webgpu', latest: after['dist-tags'].latest, integrity }));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, argument] = process.argv.slice(2);
  if (command === 'tag') {
    console.log(`tag=${npmTag(argument)}`);
    console.log(`version=v${argument}`);
  } else if (command === 'verify-candidate' || command === 'publish-candidate') {
    const manifest = JSON.parse(readFileSync(argument, 'utf8'));
    if (command === 'publish-candidate') await publishCandidate(process.cwd(), manifest);
    else console.log(JSON.stringify(verifyCandidate(process.cwd(), manifest)));
  } else {
    throw new Error('expected tag, verify-candidate or publish-candidate');
  }
}
