# Roadmap

This replaces the original 30-day plan. That plan asked for a complete pilot, including render and QA, in week 1, before the render pipeline existed in week 4.

This version is ordered by dependency, not by calendar week. Each milestone is a tagged release with exit criteria that `athanor validate` or a test can check. How artifacts, schemas and releases are versioned is in [versioning.md](versioning.md).

Sizes are rough effort for one person: **S** about a day, **M** about a week, **L** two to three weeks.

## Principles

1. **Contracts before workers.** No worker gets built for a stage until that stage's schema exists and a hand-written example passes `athanor validate`.
2. **Gates are code.** A gate that exists only in prose is treated as not existing.
3. **Deterministic before generative.** Rule-based checks and ffmpeg-class rendering come before LLM scoring and GPU video models.
4. **Every milestone ends with a pilot running through it.** Moon (6–8) first, then Beastarium (9–12), then House of Patterns (13–15).
5. **Humans approve every gate until the metrics say otherwise.** Autonomy is earned per stage, not switched on globally.

## Where things stand: v0.2.0

Done:

- Shared vocabularies in `packages/schemas/common.schema.json`: formats, age bands, hooks, drivers, beat types, states and gates.
- Strict schemas: unknown fields are rejected and list items have required fields.
- An `artifact` versioning header with sha256 pins. Stale artifacts are detected.
- `packages/schemas/registry.json` is the canonical project layout. The no-skip order is enforced.
- `athanor validate` and `athanor hash`. Every other command exits 2.
- Unit and CLI tests, and a CI workflow running tests plus validation on every PR.
- The moon research pack is corrected and sourced, with versioned front matter.

Not done (from the review): QA thresholds as data, privacy policy, missing schemas, removing duplication in the genome, real workers, renderers.

---

## v0.3: Contracts complete + manual Moon pilot (Phase 0)

**Goal:** every stage has a contract, and one pilot exists end to end on paper (00–11), written by hand.

| # | Work | Size |
|---|------|------|
| 3.1 | Add schemas for stages that have none: `format-plan`, `production-manifest`, `publish-manifest`, a `character-bible` YAML schema (switch `06` to `.yaml`; the prompt already asks for YAML), and a required-sections check for markdown artifacts (`01`, `05`). Schema **1.1.0** (additive). | M |
| 3.2 | Remove duplicated sources of truth in the genome. `learner_dna` copies developmental-fit fields; replace them with a pinned reference to `02`. Decide whether `resonance_dna` or `04_resonance_spec` owns resonance and delete the other. Schema **2.0.0** with the first migration script, `migrations/1-to-2.mjs`, proving the migration path. | M |
| 3.3 | Add the Developmental Fit Analyst prompt (the missing safety-critical one). Also prompts for Intent Clarifier, Asset Planner, Publisher, Feedback Analyst. Prompts take file **contents** plus the schema text, not paths. | M |
| 3.4 | Decide the open questions in the moon research pack: mechanism vs. pattern goal for ages 6–8, and whether timekeeping gets a success criterion. Check citations [6] and [7] against the full texts. Update `00_intent.yaml`; downstream pins go stale as designed. | S |
| 3.5 | Hand-write Moon artifacts 02–09 and 11 with correct pins. Have a human run the concept, genome and story gates and record the results by hand in `state.yaml`. | L |
| 3.6 | Add a children's privacy and consent section to the ethics policy: no child PII, aggregate-only metrics, consent and retention rules for classroom recordings and voice, an AI-disclosure checklist (EU AI Act transparency, COPPA, UK Age Appropriate Design Code, YouTube "made for kids"). Add a LICENSE file. | S |
| 3.7 | Add `CHANGELOG.md`, start tagging releases, add a PR template with a "schema change? migration?" checkbox. | S |

**Exit criteria:**

- `athanor validate` is green on Moon with files 00–09 and 11 present.
- A test asserts every registry stage has a schema or a declared markdown section list.
- The 1→2 migration runs in CI against a fixture.

---

## v0.4: Gates as code

**Goal:** nothing can reach `qa_passed` or `published` except through recorded, checkable gates.

| # | Work | Size |
|---|------|------|
| 4.1 | Move QA thresholds from the qa-engine README into `packages/qa-engine/thresholds.yaml`, versioned and schema-checked. Define the grey zone: any score between the block line and the pass line requires a human decision. | S |
| 4.2 | Make `passed` and `blocked` **computed** from scores, thresholds and fixes by `athanor score --check`, not written by a reviewer. A model can propose scores; it cannot declare a pass. | M |
| 4.3 | Map each gate to the state transition it guards, in the registry. `athanor gate <project> <gate>` evaluates the gate, writes to `state.yaml` with hash-pinned artifacts and actor, and fails on stale inputs. | M |
| 4.4 | `athanor status`: the current state, the next gate, and stale artifacts with the reason (which upstream changed). | S |
| 4.5 | `athanor stamp <file>`: after review, refresh the file's pins, bump `version`, and set `approved_by` and `updated_at`. This removes the manual `hash`-and-paste step. | S |
| 4.6 | `athanor stale <file>`: list every downstream artifact affected by a change, from the `derived_from` graph. | S |
| 4.7 | Only the CLI may write `state.yaml`. CI fails if `state.yaml` contradicts the artifacts, for example `qa_passed` with a stale QA report. | S |

**Exit criteria:**

- Tests show that a project can't reach `qa_passed` with a stale input, a missing score, a score below a threshold, or an open blocker.
- The Moon pilot passes its gates through the CLI instead of by hand.

---

## v0.5: Structured generation (Phase 1)

**Goal:** workers generate the document stages (01–07) and humans approve each one.

| # | Work | Size |
|---|------|------|
| 5.1 | **Language decision:** TypeScript/Node for the CLI, workers and validation, since that's what exists. Python only inside render adapters, called as subprocesses through the render-job contract. Rewrite the Python interface sketches in the package READMEs to match. | S |
| 5.2 | Turn the directories into a pnpm workspace with real packages: `@athanor/schemas`, `@athanor/worker-runtime`, one package per engine. `@athanor/schemas` versions together with `registry.json`. | M |
| 5.3 | Worker runtime: <ul><li>render a prompt with input file contents and the schema;</li><li>call the model with structured output against the stage schema;</li><li>validate, and retry with the errors on failure;</li><li>write the file with `generated_by` (worker, model id, prompt-template hash) and pins.</li></ul> Reuse the output while input hashes are unchanged. | L |
| 5.4 | Commands `create`, `research`, `genome`, `resonance`, `worldbuild`, `characters`, `timeline` on the runtime. Each ends at "awaiting approval"; `athanor approve <file>` signs it. | L |
| 5.5 | Prompt regression suite, using promptfoo or plain node tests. Golden inputs per pilot, schema-valid rate, and rule checks (for example "the research pack must not say Earth's shadow causes phases"). Runs in CI on prompt changes. | M |
| 5.6 | Prompt-injection hygiene for research ingestion: fetched text goes in a clearly fenced data block, and every source is recorded in the research pack. | S |

**Exit criteria:**

- Over at least 10 runs per stage on Moon and Beastarium, at least 9/10 outputs pass `validate` with no hand edits (the original Phase 0→1 trigger, now measured).
- Beastarium (9–12) reaches `timeline_complete`.

---

## v0.6: Formats, assets, QA scoring (Phase 2)

**Goal:** one genome produces three formats and an asset plan, and QA scoring is real.

| # | Work | Size |
|---|------|------|
| 6.1 | Format adapters for `storybook`, `animated-short` and `classroom-kit`. Word and length limits come from `02_developmental_fit`, not the prompt (removes the hard-coded "900–1200 words"). | L |
| 6.2 | `format` and `assets` commands. Asset ids are stable across regenerations so renders can be reused. | M |
| 6.3 | Rule-based QA checks that run before any model scoring: <ul><li>reading level against the language ceiling;</li><li>word counts;</li><li>beat coverage;</li><li>banned-pattern lists from the research pack's safety constraints;</li><li>the misconception never stated as fact.</li></ul> | M |
| 6.4 | Model-based QA scoring for the judgement dimensions, using a different model or prompt lineage from the generator. A human reviewer is required at the release gate. | M |
| 6.5 | Pilot 3, House of Patterns (13–15), to stress the age-band vocabulary at the other end. | L |

**Exit criteria:**

- All three pilots reach `assets_planned`, and Moon reaches `qa_passed` on paper formats.
- The Phase 1→2 trigger (drafts production-ready with minor edits) is tracked as the human-edit rate per stage.

---

## v0.7: Deterministic rendering (Phase 3a)

**Goal:** the first Moon short video, rendered reproducibly.

| # | Work | Size |
|---|------|------|
| 7.1 | Render router: reads the asset manifest, writes one `render-job` file per scene, dispatches to a provider, records seed, model, cost and output hash. | M |
| 7.2 | ffmpeg/Hyperframes provider with subtitles and timing from beat `duration_seconds`. Outputs are content-addressed: `renders/<provider>/<scene_id>@<hash>.mp4`. | L |
| 7.3 | TTS provider, with weights licence verified and recorded in `render-provider.license`. CI fails on `commercial_use: unverified` for any provider marked production. | M |
| 7.4 | Media QA checks: <ul><li>flash and luminance limits (WCAG 2.3.1, "three flashes" threshold);</li><li>cut rate per age band;</li><li>loudness normalisation (LUFS);</li><li>subtitle reading speed.</li></ul> | M |

**Exit criteria:**

- The Moon `animated-short` renders twice from the same inputs with identical output hashes.
- Media QA passes and a human approves the release gate.

---

## v0.8: Publish, editions, feedback loop

**Goal:** close the loop once. Genome v1 goes out, feedback comes back, genome v2 is produced, and the stale downstream artifacts are regenerated.

| # | Work | Size |
|---|------|------|
| 8.1 | `publish`: writes `12_publish_manifest.yaml` pinning every artifact and render hash (an **edition**), plus AI-disclosure metadata per asset. | M |
| 8.2 | Withdrawal: `athanor publish --withdraw <edition>` marks the edition pulled and records the reason. This is the takedown path the ethics policy requires. | S |
| 8.3 | `feedback apply`: applies the JSON Patch only if the genome hash still matches the feedback log's pin, bumps the genome version, and reports the downstream impact via `athanor stale`. | M |
| 8.4 | Feedback intake follows the privacy policy from 3.6. Aggregate metrics only; no raw child audio stored by default. | M |

**Exit criteria:**

- Moon edition 1 published (even if only privately).
- One feedback patch applied, and edition 2 rebuilt with every changed artifact traced to the patch.

---

## v0.9: Generative backends (Phase 3b)

| # | Work | Size |
|---|------|------|
| 9.1 | LongCat-Video adapter: dry-run that emits commands from render jobs, then a GPU path behind a capability check and a single-GPU queue lock. | L |
| 9.2 | Image generation provider for storybook spreads and classroom cards. | M |
| 9.3 | Per-age-band safety presets (negative prompts, style limits) stored as versioned data, referenced from render jobs by `safety_profile`. | S |
| 9.4 | A licence register for every provider (code and weights), reviewed before a provider is marked production. | S |

**Exit criteria:** a generated scene replaces a deterministic one in a Moon edition and passes the same media QA and human review.

---

## v1.0: Stable contracts + studio

| # | Work | Size |
|---|------|------|
| 10.1 | Freeze the schema major. Document the deprecation policy. | S |
| 10.2 | `apps/studio` read-only control room: project DAG with stale highlighting, artifact viewer and diff between revisions, gate status, render queue. | L |
| 10.3 | `apps/worker` queue runner that enforces WIP = 1 from the operating doctrine. | M |
| 10.4 | Operator docs: runbook updated with lessons from the three pilots. | S |

**Exit criteria:**

- Three pilots with at least one published edition each.
- At least one schema migration performed on real data.
- All gates enforced by code.
- No `commercial_use: unverified` providers in production.

---

## After 1.0: earning autonomy (Phase 4)

Autonomy is granted **per stage**, using the metrics the earlier milestones record:

| Stage gets automatic approval when | Measured from |
|---|---|
| ≥ 9/10 generated revisions pass validation with no human edit, over the last 20 runs | `generated_by` + `approved_by` + diffs |
| Human-edit rate < 10% of lines for the stage | revision diffs |
| Zero release-blocking QA findings traced to the stage in the last 3 editions | QA reports linked by pins |

The release gate and anything safety-related (developmental fit, ethics, adult trust) keep human approval permanently. The weekly cycle in the operating doctrine starts only once every non-safety stage qualifies.

## Version map

| Release | Schema version | Main contract change |
|---|---|---|
| 0.2.0 | 1.0.0 | Shared vocabularies, strict schemas, artifact header, registry |
| 0.3.0 | 1.1.0 → 2.0.0 | New stage schemas (minor), then genome deduplication (major, first migration) |
| 0.4.0 | 2.1.0 | QA thresholds file, gate map in registry |
| 0.5.0 | 2.x | `generated_by` structure for workers (model id, prompt hash) |
| 0.8.0 | 2.x | Publish manifest editions, withdrawal |
| 1.0.0 | frozen major | Deprecation policy in force |
