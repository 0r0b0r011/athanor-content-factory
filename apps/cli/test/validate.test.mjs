import { test } from "node:test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadSchemas, validateProject } from "../lib/validate.mjs";
import { SAMPLE, copySample, meta, readYaml, writeYaml } from "./helpers.mjs";

const schemas = loadSchemas();
const has = (list, re) => list.some((m) => re.test(m));

test("all schemas compile and every registry entry resolves", () => {
  assert.ok(schemas.validators["content-genome"]);
  assert.equal(schemas.registry.schema_version, "1.0.0");
});

test("every project artifact schema requires the artifact versioning block", () => {
  for (const a of schemas.registry.artifacts.filter((x) => x.schema)) {
    const required = schemas.validators[a.schema].schema.required;
    assert.ok(required.includes("artifact"), `${a.schema} must require artifact`);
  }
});

test("the sample project validates cleanly", () => {
  const { errors } = validateProject(SAMPLE, schemas);
  assert.deepEqual(errors, []);
});

test("editing an upstream artifact makes downstream pins stale", () => {
  const dir = copySample();
  const intent = readYaml(join(dir, "00_intent.yaml"));
  intent.concept = "Moon phases as a calendar";
  writeYaml(join(dir, "00_intent.yaml"), intent);
  const { errors } = validateProject(dir, schemas);
  assert.ok(has(errors, /01_research_pack\.md: STALE: derived from 00_intent\.yaml/), errors.join("\n"));
});

test("project_id must match the directory name", () => {
  const dir = copySample("some-other-project");
  const { errors } = validateProject(dir, schemas);
  assert.ok(has(errors, /00_intent\.yaml: project_id "moon-as-timekeeper" does not match directory "some-other-project"/));
});

test("misspelled fields are rejected instead of silently accepted", () => {
  const dir = copySample();
  const intent = readYaml(join(dir, "00_intent.yaml"));
  intent.sucess_criteria = ["typo"];
  writeYaml(join(dir, "00_intent.yaml"), intent);
  const { errors } = validateProject(dir, schemas);
  assert.ok(has(errors, /must NOT have additional properties "sucess_criteria"/), errors.join("\n"));
});

test("formats must use the shared vocabulary", () => {
  const dir = copySample();
  const intent = readYaml(join(dir, "00_intent.yaml"));
  intent.formats = ["short-video"];
  writeYaml(join(dir, "00_intent.yaml"), intent);
  const { errors } = validateProject(dir, schemas);
  assert.ok(has(errors, /\/formats\/0 must be equal to one of the allowed values.*animated-short/), errors.join("\n"));
});

test("stages cannot be skipped", () => {
  const dir = copySample();
  writeYaml(join(dir, "03_content_genome.yaml"), { artifact: meta(dir, "01_research_pack.md") });
  const { errors } = validateProject(dir, schemas);
  assert.ok(has(errors, /02_developmental_fit\.yaml: missing, but a later stage \(03\) exists/));
});

test("markdown artifacts need versioning front matter", () => {
  const dir = copySample();
  writeFileSync(join(dir, "01_research_pack.md"), "# no front matter\n");
  const { errors } = validateProject(dir, schemas);
  assert.ok(has(errors, /01_research_pack\.md: missing YAML front matter/));
});

test("derived_from must not be empty after the intent", () => {
  const dir = copySample();
  writeFileSync(
    join(dir, "01_research_pack.md"),
    "---\nartifact:\n  schema_version: \"1.0.0\"\n  version: 1\n  derived_from: []\nproject_id: moon-as-timekeeper\n---\n# x\n",
  );
  const { errors } = validateProject(dir, schemas);
  assert.ok(has(errors, /01_research_pack\.md: artifact\.derived_from is empty/));
});

test("a different schema major version is rejected", () => {
  const dir = copySample();
  const intent = readYaml(join(dir, "00_intent.yaml"));
  intent.artifact.schema_version = "2.0.0";
  writeYaml(join(dir, "00_intent.yaml"), intent);
  const { errors } = validateProject(dir, schemas);
  assert.ok(has(errors, /major version differs/));
});

const beatTypes = ["opening_ritual", "wonder_trigger", "failed_attempt", "concept_reveal", "aha_moment", "retrieval", "transfer", "closing_ritual"];
const beat = (t, i) => ({ id: `beat-${i}`, beat_type: t, beat: t, function: "f", content: "c", learning_role: "l" });

test("timeline must contain all eight beat types", () => {
  const v = schemas.validators["episode-timeline"];
  const base = { artifact: { schema_version: "1.0.0", version: 1, derived_from: [] }, project_id: "p" };
  assert.ok(v({ ...base, beats: beatTypes.map(beat) }), JSON.stringify(v.errors));
  const missingTransfer = beatTypes.map((t) => (t === "transfer" ? "retrieval" : t)).map(beat);
  assert.equal(v({ ...base, beats: missingTransfer }), false);
});

test("cross-file checks: unknown scene ids and contradictory QA reports", () => {
  const dir = copySample();
  writeYaml(join(dir, "07_episode_timeline.yaml"), {
    artifact: meta(dir, "00_intent.yaml"),
    project_id: "moon-as-timekeeper",
    beats: beatTypes.map(beat),
  });
  writeYaml(join(dir, "09_asset_manifest.yaml"), {
    artifact: meta(dir, "07_episode_timeline.yaml"),
    project_id: "moon-as-timekeeper",
    visual_assets: [],
    audio_assets: [],
    video_assets: [{ id: "clip-1", scene_id: "no-such-beat", shot: "wide", duration_seconds: 4 }],
  });
  const scores = Object.fromEntries(
    ["learning_accuracy", "developmental_fit", "cognitive_load", "resonance", "ethics", "adult_trust", "transmedia_coherence"].map((k) => [k, 95]),
  );
  writeYaml(join(dir, "11_qa_report.yaml"), {
    artifact: meta(dir, "09_asset_manifest.yaml"),
    project_id: "moon-as-timekeeper",
    artifact_id: "09_asset_manifest.yaml",
    reviewer: "test",
    scores,
    required_fixes: [{ severity: "blocker", description: "shadow shown causing phases" }],
    passed: true,
    blocked: false,
  });
  const { errors } = validateProject(dir, schemas);
  assert.ok(has(errors, /scene_id "no-such-beat", which is not a beat id/), errors.join("\n"));
  assert.ok(has(errors, /passed is true but 1 blocker fix\(es\) are open/), errors.join("\n"));
});

test("a QA report missing any score dimension is rejected", () => {
  const v = schemas.validators["qa-report"];
  const ok = v({
    artifact: { schema_version: "1.0.0", version: 1, derived_from: [] },
    project_id: "p", artifact_id: "x", reviewer: "r",
    scores: { resonance: 90 }, required_fixes: [], passed: true, blocked: false,
  });
  assert.equal(ok, false);
});
