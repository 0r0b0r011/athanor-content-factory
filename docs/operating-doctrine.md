# Operating Doctrine

## How the Factory Runs

### Weekly production cycle (Phase 4+)

| Day | Activity |
|-----|----------|
| Monday | Research + genome construction |
| Tuesday | World/character/story development |
| Wednesday | Scripts + asset manifests |
| Thursday | Video/print/audio production |
| Friday | QA + revisions |
| Saturday | Publish |
| Sunday | Feedback analysis + genome patch |

### Work-in-progress limit

**Exactly 1.** One project in the pipeline at a time until Phase 3+ throughput is validated. WIP > 1 is how quality collapses.

### No-skip rule

No project state may be skipped. Every artifact in the chain must exist and be valid before the next stage begins. The state machine enforces this.

### System of record

Every project lives in a canonical directory:

```
projects/{project-name}/
  00_intent.yaml
  01_research_pack.md
  02_developmental_fit.yaml
  03_content_genome.yaml
  04_resonance_spec.yaml
  05_world_bible.md
  06_character_bible.md
  07_episode_timeline.yaml
  08_format_plan.yaml
  09_asset_manifest.yaml
  10_production_manifest.yaml
  11_qa_report.md
  12_publish_manifest.yaml
  13_feedback_log.md
```

The project directory IS the source of truth. Chat history is not.

### Content genome is the invariant

The `03_content_genome.yaml` file is the canonical blueprint. All downstream stages read from it. If the genome changes, downstream artifacts are invalidated and must be regenerated.

### Render architecture

Media production backends are swappable adapters:

- **MoneyPrinterTurbo** (forked) — short-video assembly
- **Higgsfield** — premium cinematic/video generation
- **ffmpeg/MoviePy** — deterministic assembly fallback
- **TTS providers** — voiceover generation
- **Image generation** — visual asset creation
- **Premiere/After Effects plugin** — manual high-quality editing

All adapters share a common render manifest schema.

### Greenlight gates

No content passes a gate without explicit verification. Gates are:

1. **Concept gate** — does the idea have learning substance?
2. **Genome gate** — is the genome complete and internally consistent?
3. **Story gate** — is the educational concept essential to the narrative?
4. **Production gate** — is the scene plan age-appropriate?
5. **Release gate** — do all QA scores meet thresholds?

A gate failure blocks the pipeline. The output is either fixed or rejected.

### Feedback loop

Published content generates a feedback log that patches the genome:

```yaml
feedback_update:
  what_worked: [...]
  what_failed: [...]
  resonance_delta: [...]
  learning_delta: [...]
  format_delta: [...]
  genome_patch: [...]
  next_experiment: [...]
```

The patched genome seeds the next iteration or the next project.

### Optimization target

The factory optimises for, in order:

1. Learning outcomes (concept recall, misconception correction, transfer)
2. Resonance (voluntary replay, reenactment, quote recall)
3. Trust (parent approval, teacher usability, safety)
4. Franchise value (symbol recall, character attachment, format portability)

Views and revenue are downstream consequences, not optimization targets.
