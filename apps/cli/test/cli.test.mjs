import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { REPO_ROOT } from "../lib/validate.mjs";

const CLI = join(REPO_ROOT, "apps/cli/athanor.mjs");
const run = (...args) => spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8", cwd: REPO_ROOT });

test("unimplemented commands exit 2, never 0", () => {
  for (const cmd of ["create", "render", "score", "gate", "publish", "status"]) {
    const r = run(cmd, "moon-as-timekeeper");
    assert.equal(r.status, 2, `${cmd} should exit 2`);
    assert.match(r.stderr, /not implemented yet/);
  }
});

test("inherited object keys are not commands", () => {
  for (const cmd of ["toString", "constructor", "__proto__", "hasOwnProperty"]) {
    assert.equal(run(cmd).status, 1, cmd);
  }
});

test("no command prints usage and fails; help succeeds", () => {
  assert.equal(run().status, 1);
  assert.equal(run("--help").status, 0);
});

test("validate passes on the repository projects", () => {
  const r = run("validate");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /1\/1 project\(s\) valid/);
});

test("validate fails on a missing project", () => {
  assert.equal(run("validate", "does-not-exist").status, 1);
});

test("hash prints a sha256 pin", () => {
  const r = run("hash", "projects/moon-as-timekeeper/00_intent.yaml");
  assert.equal(r.status, 0);
  assert.match(r.stdout, /^[a-f0-9]{64}  projects\/moon-as-timekeeper\/00_intent\.yaml/);
});
