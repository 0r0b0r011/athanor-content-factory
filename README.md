# ⚗️ Athanor Content Factory

*Developmental Resonance Engine + Educational Story Genome*

A structured **intent-to-content pipeline** that transforms educational concepts into multi-format media assets — books, videos, classroom kits, games — through a chain of verifiable, regeneratable stages.

Each piece of content passes through 14 project artifacts (00–13), from raw intent through research, genome construction, worldbuilding, production, QA, publishing, and feedback-driven improvement. The output is not "content slop" — it's learning-optimized, developmentally appropriate, emotionally resonant media.

## Core concept

```
Intent
  → Research Pack
  → Developmental Fit Pass
  → Content Genome
  → Resonance Spec
  → World/Character Bible
  → Beat Timeline
  → Format Plan
  → Asset Plan
  → Production
  → QA
  → Publish
  → Feedback
  → Genome Update (loop)
```

The engine does not optimise for views. It optimises for:

- **Learning**: concept recall, misconception correction, near transfer, teach-back
- **Resonance**: voluntary replay, quote recall, reenactment, child-generated extension
- **Trust**: parent approval, teacher usability, developmental fit fidelity
- **Franchise**: symbolic object recall, character attachment, ritual adoption, format portability

## Repository structure

```
athanor-factory/
├── apps/
│   ├── studio/          # Web UI / slider interface
│   ├── worker/          # Background job runner
│   └── cli/             # athanor CLI (validate, hash; other commands planned)
├── packages/
│   ├── schemas/         # JSON/YAML schemas for every artifact
│   ├── genome-engine/   # DNA builder logic (Educational Story Genome)
│   ├── resonance-engine/# Hook scoring + resonance rules (Developmental Resonance Engine)
│   ├── pedagogy-engine/ # Developmental fit + learning science
│   ├── story-engine/    # Beat/timeline/world/character generation
│   ├── format-adapters/ # Book/video/classroom/game output converters
│   ├── render-adapters/ # MoneyPrinterTurbo / Higgsfield / ffmpeg / etc
│   └── qa-engine/       # Scoring + release gates
├── projects/            # Canonical project folders
├── prompts/             # Structured LLM prompt templates by stage
├── docs/                # Architecture, doctrine, ethics, runbook
```

## Quickstart

```bash
pnpm install

# Check every project against the schemas, version pins and stage order
pnpm athanor:validate

# Check one project
pnpm athanor:validate moon-as-timekeeper

# Get the sha256 pin for an upstream file (for artifact.derived_from)
pnpm athanor:hash projects/moon-as-timekeeper/00_intent.yaml

pnpm test
```

Only `validate` and `hash` are implemented today. Every other command (`create`, `research`, `genome`, `render`, `score`, `gate`, …) exits with code 2 ("not implemented") so scripts and CI never mistake a stub for a pass. Planned usage:

```bash
pnpm athanor:create moon-as-timekeeper \
  --concept "moon phases as timekeeping" \
  --age-band 6-8 \
  --formats storybook,animated-short,classroom-kit
pnpm athanor:genome moon-as-timekeeper
pnpm athanor:render moon-as-timekeeper --backend=ffmpeg
```

Format slugs, age bands, hooks and other shared vocabularies are defined once in `packages/schemas/common.schema.json`. See [docs/versioning.md](docs/versioning.md) for how artifacts are versioned and pinned.

## Production state machine

Each project moves through immutable states:

```
intent_defined → research_complete → developmental_fit_complete → genome_complete
→ resonance_approved
→ world_bible_complete → characters_complete → timeline_complete
→ format_outputs_ready → assets_planned → draft_rendered
→ qa_passed → published → feedback_collected → genome_updated
```

No state may be skipped. `athanor validate` already rejects projects whose artifacts skip a stage; gate enforcement on transitions is planned.

## License

MIT
