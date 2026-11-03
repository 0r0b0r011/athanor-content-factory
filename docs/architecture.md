# Architecture

## Overview

The Athanor Content Factory is a multi-agent production lattice that transforms raw educational intent into polished, multi-format media assets. Every artifact is versioned, inspectable, and independently regeneratable.

## The 14-Worker Pipeline

Each worker accepts a typed input, produces a typed output, and may be run independently or assembled into a DAG.

```
  Worker 1:  Intent Clarifier
  Worker 2:  Research Stack Builder
  Worker 3:  Developmental Fit Analyst
  Worker 4:  Genome Builder
  Worker 5:  Resonance Strategist
  Worker 6:  Worldbuilder
  Worker 7:  Character Developer
  Worker 8:  Story Engineer
  Worker 9:  Format Adapter
  Worker 10: Asset Planner
  Worker 11: Video Production Worker
  Worker 12: QA / Safety / Pedagogy Reviewer
  Worker 13: Publisher
  Worker 14: Feedback Analyst
```

## DAG

```
intent_spec
  ↓
research_pack
  ↓
developmental_fit
  ↓
content_genome
  ↓
resonance_spec
  ↓
world_bible + character_bible
  ↓
episode_timeline
  ↓
format_outputs
  ↓
asset_manifest
  ↓
render_manifest
  ↓
video/audio/print generation
  ↓
qa_report
  ↓
publish_manifest
  ↓
feedback_update
  ↓
genome_patch (loop)
```

## The Content Genome (central invariant)

The genome is the canonical blueprint that everything orbits. It encodes:

- **Learner DNA**: cognitive profile, emotional drivers, identity needs, pacing
- **Knowledge DNA**: learning objective, misconceptions, accurate model, retrieval prompts
- **Resonance DNA**: emotional promise, hooks, ritual, symbolic objects, replay reasons
- **Narrative DNA**: world law, setting, protagonist need, conflict, concept reveal, aha moment
- **Format DNA**: per-format length, style, aspect ratios, supporting artifacts

## Greenlight Gates

| Gate | Required to pass |
|------|-----------------|
| Concept | Clear learning objective, age band, misconception, real-world relevance, emotional hook |
| Genome | Knowledge causal to story, developmental fit explicit, symbolic object exists |
| Story | Removing concept breaks plot, protagonist changes through learning, conflict is safe |
| Production | Scene list matches learning beats, visuals not overstimulating, subtitles fit reading level |
| Release | QA score threshold, adult trust threshold, ethics threshold, concept accuracy verified |

## Worker Architecture (non-negotiable)

1. No worker may skip its input validation
2. Every output must be parseable and schema-validatable (`athanor validate`)
3. Every output carries an `artifact` header pinning its inputs by hash (see [versioning.md](versioning.md))
4. Workers may be LLM-driven, rule-based, or hybrid — the interface is the contract
5. A worker's output is reused until an input's hash changes; then it is stale
6. No content reaches the next stage without passing its greenlight gate

## Manual-to-Autonomous Progression

See [roadmap.md](roadmap.md) for the five-phase (0–4) progression from manual pilots to autonomous factory.

### Phase 0: Manual White-Glove
Three pilot concepts produced entirely by hand to discover the real workflow.

### Phase 1: Structured Generation
Automated structured document generation with human approval at each stage.

### Phase 2: Semi-Automated Production
Automated draft outputs (scripts, prompts, worksheets) with human approval before rendering.

### Phase 3: Automated Asset Generation
Connected media generation backends (image/video/TTS/assembly) with human approval on final render.

### Phase 4: Autonomous Content Factory
Full cron/queue-based weekly production cycle with feedback-driven genome improvement.
