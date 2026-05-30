# ⚗️ Athanor Content Factory

*Developmental Resonance Engine + Educational Story Genome*

A structured **intent-to-content pipeline** that transforms educational concepts into multi-format media assets — books, videos, classroom kits, games — through a chain of verifiable, regeneratable stages.

Each piece of content passes through 14 defined phases, from raw intent through research, genome construction, worldbuilding, production, QA, publishing, and feedback-driven improvement. The output is not "content slop" — it's learning-optimized, developmentally appropriate, emotionally resonant media.

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
│   └── cli/             # cfactory CLI
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
# Create a new project
pnpm athanor:create moon-as-timekeeper \
  --concept "moon phases as timekeeping" \
  --age-band 6-8 \
  --formats storybook,short-video,classroom-kit

# Build each layer
pnpm athanor:research moon-as-timekeeper
pnpm athanor:genome moon-as-timekeeper
pnpm athanor:worldbuild moon-as-timekeeper
pnpm athanor:timeline moon-as-timekeeper
pnpm athanor:render moon-as-timekeeper --backend=higgsfield
pnpm athanor:validate moon-as-timekeeper
```

## Production state machine

Each project moves through immutable states:

```
intent_defined → research_complete → genome_complete → resonance_approved
→ world_bible_complete → characters_complete → timeline_complete
→ format_outputs_ready → assets_planned → draft_rendered
→ qa_passed → published → feedback_collected → genome_updated
```

No state may be skipped. Each has a greenlight gate.

## License

MIT
