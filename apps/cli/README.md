# athanor — Athanor Content Factory CLI

```bash
pnpm athanor <command> [args]      # or: node apps/cli/athanor.mjs <command> [args]
```

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Validation failed, unknown command, or bad arguments |
| 2 | Command exists but is not implemented yet. Never treat as success. |

## Implemented

### `validate [project ...]`

Validates each project directory (default: every directory under `projects/`). A project name or a path both work.

Checks:

- Every file name is a canonical artifact from `packages/schemas/registry.json`.
- YAML artifacts validate against their schema. Unknown fields are errors.
- Markdown artifacts have YAML front matter with `project_id` and an `artifact` header.
- `project_id` matches the directory name.
- `artifact.schema_version` has the same major version as the repository schemas and is not newer.
- Every `artifact.derived_from` pin exists and its sha256 matches the current file. A mismatch is reported as **STALE**.
- No stage is skipped: if `07_…` exists, `00_…` to `06_…` must exist.
- Cross-file checks:
  - Beat ids and asset ids are unique.
  - `video_assets[].scene_id` points at a real beat.
  - A QA report cannot be `passed` while `blocked` or while a `blocker` fix is open.

### `hash <file ...>`

Prints the sha256 pin for each file. Line endings are normalised to LF first.

## Planned (exit 2 today)

| Command | Description |
|---------|-------------|
| `create` | Scaffold a new project directory with an intent |
| `research` | Generate research pack from intent |
| `genome` | Build content genome from intent + research + developmental fit |
| `resonance` | Build resonance spec |
| `worldbuild` | Generate world bible |
| `characters` | Generate character bible |
| `timeline` | Build episode timeline |
| `format` | Adapt genome to each format |
| `assets` | Generate asset manifest |
| `render` | Render media via a backend adapter |
| `score` | Run QA scoring and write `11_qa_report.yaml` |
| `gate` | Check a greenlight gate and record it in `state.yaml` |
| `status` | Show current state machine position |
| `publish` | Push to distribution channels |
| `feedback` | Log feedback and apply the genome patch |
