# Changelog

All notable changes. Versioning rules are in [docs/versioning.md](docs/versioning.md).

## 0.2.0 (schemas 1.0.0)

### Breaking

- Intent: `primary_medium` replaced by `formats`, a list of canonical format slugs.
- Every project artifact now requires an `artifact` header (`schema_version`, `version`, `derived_from`). Markdown artifacts carry it as YAML front matter with `project_id`.
- All schemas reject unknown fields (`additionalProperties: false`).
- Resonance spec: `primary_hook_type` renamed to `primary_hook`, now required.
- Episode timeline:
  - beats need `id` and `beat_type`;
  - all eight beat types must appear;
  - `duration_estimate` became `duration_seconds`.
- Asset manifest:
  - items have required fields;
  - video assets need `id` and `duration_seconds`;
  - voiceovers need `voice` and `line`.
- QA report: all seven scores required; `passed`, `blocked` and `reviewer` required; `block_reasons` required when blocked.
- Feedback log: `genome_patch` is now an RFC 6902 JSON Patch; dates use `format: date`.
- Production state: new `developmental_fit_complete` state; history entries pin artifacts by hash; gate names from a shared list.
- Render provider split into `render-provider` (capabilities, licence) and `render-job` (per-scene input and output). `safety_profile` is an age band (`6-8`).
- QA report and feedback log files are now `.yaml`.

### Added

- `packages/schemas/common.schema.json` (shared vocabularies) and `registry.json` (canonical project layout).
- `athanor validate`: schemas, front matter, project id, schema version, hash pins (staleness), no-skip order, cross-file references, QA consistency.
- `athanor hash`.
- Tests (`pnpm test`) and a CI workflow.
- `docs/versioning.md` and a dependency-ordered `docs/roadmap.md`.

### Fixed

- Unimplemented CLI commands exited 0. They now exit 2.
- Inherited object keys (`toString`, `constructor`) were accepted as commands.
- Moon research pack:
  - orbit vs. phase-cycle period corrected;
  - the "walk around a lamp" analogy replaced with the head-as-Earth model;
  - the Earth's-shadow misconception added;
  - hemisphere caveat, standards fit and sources added.
