# Versioning

Athanor versions four things. Each has one owner and one rule for when it changes.

| Layer | What | Where it lives | Bumped when |
|-------|------|----------------|-------------|
| Tool release | CLI, workers, adapters | `package.json` `version`, git tag `vX.Y.Z`, `CHANGELOG.md` | Any release |
| Schema version | The contracts in `packages/schemas/` | `packages/schemas/registry.json` → `schema_version` | Any schema change (semver rules below) |
| Artifact revision | One file in a project, e.g. `03_content_genome.yaml` | `artifact.version` + `artifact.derived_from` inside the file | Every substantive edit to that file |
| Edition | A published, reproducible set of artifacts | `12_publish_manifest.yaml` (planned) | Every publish |

Git holds the full history of all four. The in-file fields exist so the pipeline can reason about versions without reading git.

## 1. Schema versions

`registry.json` carries one `schema_version` for the whole schema set. The schemas reference each other through `common.schema.json`, so they move together.

| Change | Bump | Examples |
|--------|------|----------|
| Breaking: an old valid artifact may now fail | **major** | Removing or renaming a field, making a field required, narrowing an enum, tightening a pattern |
| Additive: every old valid artifact still passes | **minor** | New optional field, new enum value, new schema for a stage that had none |
| No effect on validation | **patch** | Descriptions, examples, `$comment` |

Rules enforced by `athanor validate`:

- An artifact's `artifact.schema_version` must have the **same major** as the repository.
- An artifact may not claim a **newer minor** than the repository. That would mean it was written against fields this checkout doesn't know.

On a major bump:

1. Add a migration script `packages/schemas/migrations/<from-major>-to-<to-major>.mjs` that rewrites artifacts in place and sets the new `schema_version`.
2. Run it on every project in the same pull request, so `main` never holds artifacts on two majors.
3. Record the change and the migration in `CHANGELOG.md`.

Until 1.0, schema majors will move quickly. That's expected; the migration rule still applies.

## 2. Artifact revisions and pins

Every artifact starts with a header:

```yaml
artifact:
  schema_version: "1.0.0"
  version: 3                      # this file's revision number
  derived_from:                   # upstream inputs, pinned by content hash
    - path: "00_intent.yaml"
      sha256: "28d5d0c3…"
    - path: "01_research_pack.md"
      sha256: "9b41e0aa…"
  generated_by: "genome-builder / <model id>"   # or "human"
  approved_by: "alex"             # set at the gate
  updated_at: "2026-11-03T10:00:00Z"
```

Markdown artifacts carry the same block as YAML front matter between `---` lines, plus `project_id`.

- `sha256` is computed over the file with line endings normalised to LF. Get it with `pnpm athanor:hash <file>`.
- `derived_from` may be empty only for `00_intent.yaml`.
- `version` increments by one on every substantive edit. Fixing a typo may skip it. Changing meaning may not.

### Staleness

If an upstream file changes, its hash no longer matches the pin, and `athanor validate` reports the downstream file as **STALE**. To clear it, do one of these:

- **Regenerate:** rerun the stage, which writes a new revision with fresh pins.
- **Re-review:** a human confirms the upstream change doesn't affect this artifact, updates the pin, and bumps `version`.

Staleness propagates on its own. Updating a stale file changes its hash, which makes *its* dependants stale. That is the "if the genome changes, downstream artifacts are invalidated" rule from the operating doctrine, enforced mechanically.

## 3. Genome patches

Feedback changes the genome through `13_feedback_log.yaml` → `genome_patch`, an [RFC 6902](https://www.rfc-editor.org/rfc/rfc6902) JSON Patch.

- The feedback log's `derived_from` must pin the genome revision the patch was written against.
- The planned `athanor feedback apply` will:
  - refuse to apply the patch if the genome has moved since then,
  - apply the patch and bump the genome's `artifact.version`,
  - leave every downstream artifact stale until it is regenerated or re-reviewed.

## 4. Editions (planned)

A publish manifest will pin the exact hash of every artifact and rendered file that went out. An edition can then be rebuilt, audited, or pulled.

- Pulling an edition means marking its manifest withdrawn. That is the takedown path the ethics policy requires.
- Render outputs will be content-addressed (`renders/<provider>/<scene_id>@<sha256-prefix>.mp4`). Re-rendering never overwrites the file an edition points at.

## 5. Tool releases

- Semver from `0.x`. Breaking CLI or worker behaviour bumps the minor until 1.0.
- Each release gets a git tag and a `CHANGELOG.md` entry that names the schema version it ships.
- At tool 1.0 the schema major in force is frozen. After that, a breaking schema change needs a migration *and* a new tool major. The exit criteria for 1.0 are in [roadmap.md](roadmap.md).
