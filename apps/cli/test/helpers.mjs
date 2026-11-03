import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { stringify, parse } from "yaml";
import { REPO_ROOT } from "../lib/validate.mjs";
import { hashFile } from "../lib/hash.mjs";

export const SAMPLE = join(REPO_ROOT, "projects/moon-as-timekeeper");

/** Copy the sample project into a fresh temp dir under the given directory name. */
export function copySample(name = "moon-as-timekeeper") {
  const dir = join(mkdtempSync(join(tmpdir(), "athanor-test-")), name);
  cpSync(SAMPLE, dir, { recursive: true });
  return dir;
}

export function readYaml(path) {
  return parse(readFileSync(path, "utf8"));
}

export function writeYaml(path, data) {
  writeFileSync(path, stringify(data));
}

/** Artifact header pinning the given upstream files (relative to dir). */
export function meta(dir, ...upstream) {
  return {
    schema_version: "1.0.0",
    version: 1,
    derived_from: upstream.map((p) => ({ path: p, sha256: hashFile(join(dir, p)) })),
  };
}
