# 30-Day Implementation Roadmap

## Week 1: Schema + Manual Pilot

**Goal**: Define the data contracts and run the first manual pilot end-to-end.

Deliverables:
- [ ] `content-genome.schema.json` — canonical schema for the central blueprint
- [ ] All 14 artifact schemas (intent → feedback)
- [ ] `research_pack_template.md`
- [ ] First manual pilot: Moon as Timekeeper (age 6-8)
- [ ] Pilot produces all 13 project artifacts
- [ ] Lessons learned documented in `docs/manual-runbook.md`

Output: `schemas/` populated, `projects/moon-as-timekeeper/` populated, runbook written.

---

## Week 2: Generator Prompts + CLI Skeleton

**Goal**: Automate the structured document generation stage-by-stage.

Deliverables:
- [ ] Research Pack prompt template (`prompts/research/`)
- [ ] Genome Builder prompt template (`prompts/genome/`)
- [ ] Resonance Strategist prompt template (`prompts/resonance/`)
- [ ] World Bible prompt template (`prompts/worldbuilding/`)
- [ ] Character Bible prompt template (`prompts/character/`)
- [ ] Episode Timeline prompt template (`prompts/timeline/`)
- [ ] `cfactory` CLI scaffolding (`apps/cli/`)
  - `cfactory create-project`
  - `cfactory build-genome`
  - `cfactory build-timeline`

Output: `prompts/` populated, CLI skeleton with first 3 commands working.

---

## Week 3: Format Adapters

**Goal**: Convert the same genome into multiple format outputs.

Deliverables:
- [ ] Storybook adapter (900-1200 words, gentle mystery tone)
- [ ] Animation script adapter (scene breakdown, shot list)
- [ ] Classroom kit adapter (worksheet, activity card, teacher guide)
- [ ] Asset manifest adapter (image/audio/video asset spec)
- [ ] QA scoring adapter (pedagogical, developmental, resonance, ethics)
- [ ] `cfactory build-format-plan`
- [ ] `cfactory build-asset-manifest`
- [ ] `cfactory score-artifact`

Output: `packages/format-adapters/` populated, 3 new CLI commands.

---

## Week 4: Video Draft Pipeline

**Goal**: Produce an actual short video from one pilot.

Deliverables:
- [ ] MoneyPrinterTurbo adapter analysis + fork plan (`packages/render-adapters/moneyprinter/`)
- [ ] Higgsfield adapter spec (`packages/render-adapters/higgsfield/`)
- [ ] ffmpeg/MoviePy fallback renderer (`packages/render-adapters/ffmpeg/`)
- [ ] Draft short video from Moon as Timekeeper pilot
- [ ] QA report on the video
- [ ] Feedback log template
- [ ] `cfactory render` and `cfactory validate` commands

Output: Working render pipeline, first rendered artifact, QA report.

---

## Post-30-Day: Phase Transitions

### Phase 0 → Phase 1
Trigger: All 3 pilots produce complete artifact sets. Runbook exists.
Go: Automated structured generation enabled.

### Phase 1 → Phase 2
Trigger: Structured generation produces valid artifacts 9/10 times.
Go: Semi-automated draft outputs enabled.

### Phase 2 → Phase 3
Trigger: Draft outputs are consistently production-ready with minor edits.
Go: Media generation backends connected.

### Phase 3 → Phase 4
Trigger: Rendering pipeline produces publishable content with <10% human revision rate.
Go: Weekly autonomous cycle enabled.
