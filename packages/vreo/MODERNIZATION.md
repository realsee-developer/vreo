# Vreo 3 WebGPU modernization

## Candidate dependency contract

Vreo 3 pins the public runtime contract exactly: `@realsee/five-webgpu@1.0.0-alpha.6`, `three@0.183.2`, and `@realsee/dnalogel@4.0.0-webgpu.0`. Its package manifest contains no local `file:` dependencies. The local integration candidate was built against these archives:

| Package | SHA-256 |
| --- | --- |
| Five alpha.6 | `ce25d1c794483e480db673a943a3c6a212b477e8ecac9c1fd9c63c9b905ab837` |
| Dnalogel webgpu.0 | `5bf4744fa936773c42046a0369ec6c0d71d6809dbe844de854d9e7e6f13c4199` |
| Vreo webgpu.0 | `7954792ebffc3ebb4951a924199a80ca85ed2acd099e90e923083940c0cae7eb` |

Vreo archive: `/private/tmp/vreo-candidate-20260923/artifacts-release/realsee-vreo-3.0.0-webgpu.0.tgz`.

## Source migration

- Five imports use `@realsee/five-webgpu` and its public `/react` export.
- Dnalogel plugins use declared `/plugins/*` exports.
- CSS3D uses `three/addons/renderers/CSS3DRenderer.js`.
- Five-scene render objects use `three/webgpu`, node materials, and public WebGPU line addons.
- VideoAgent uses `WebGPURenderer` and a TSL chroma-key `MeshBasicNodeMaterial`; initialization stops if the actual backend is not WebGPU.
- VideoAgent visibility reacts to video loading, textures use sRGB, and React root cleanup no longer synchronously unmounts during a host commit.
- Package entrypoints can be imported by a Node 24 host before browser globals exist.
- Removed `Geometry.vertices` access now reads `BufferGeometry` attributes.

## Candidate gates

**Local candidate: PASS.** In an isolated workspace with the above SDK archives, Vreo and test-app typecheck and production build passed; all 23 Vreo tests passed. A separate consumer completed a fresh `pnpm install --frozen-lockfile`, strict TypeScript check with `skipLibCheck: false`, and Node 24 import of all eight public JavaScript entrypoints. Chrome played a video fixture with both Five and VideoAgent reporting WebGPU backends; the video overlay was visible, and two CSS3D overlays released without retained containers. No browser console errors or warnings remained.

**Public clean install: pending publication.** The exact Five and Dnalogel candidate versions are not yet available from the public registry. A local tarball consumer proves the package contract but is not a published-registry acceptance result. The Vreo package manifest and repository lockfile must be regenerated from published URLs only after release.
