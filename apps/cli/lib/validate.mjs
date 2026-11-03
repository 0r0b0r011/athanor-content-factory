import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { parse as parseYaml } from "yaml";
import { hashFile } from "./hash.mjs";

const here = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(here, "../../..");
export const SCHEMAS_DIR = join(REPO_ROOT, "packages/schemas");
const SCHEMA_BASE = "https://athanor-content-factory.local/schemas/";

/** Load and compile every schema. Throws if any schema is invalid or a $ref does not resolve. */
export function loadSchemas(schemasDir = SCHEMAS_DIR) {
  const registry = JSON.parse(readFileSync(join(schemasDir, "registry.json"), "utf8"));
  const ajv = new Ajv({ allErrors: true, strict: true, strictRequired: false, allowUnionTypes: true });
  addFormats(ajv);

  const files = readdirSync(schemasDir).filter((f) => f.endsWith(".schema.json"));
  for (const file of files) {
    const schema = JSON.parse(readFileSync(join(schemasDir, file), "utf8"));
    if (schema.$id !== SCHEMA_BASE + file) {
      throw new Error(`${file}: $id must be ${SCHEMA_BASE + file}`);
    }
    ajv.addSchema(schema);
  }

  const validators = {};
  for (const file of files) {
    const name = file.replace(/\.schema\.json$/, "");
    if (name === "common") continue;
    validators[name] = ajv.getSchema(SCHEMA_BASE + file); // compiles; throws on bad schema or ref
  }

  const referenced = [...registry.artifacts, ...registry.other_files].map((a) => a.schema).filter(Boolean);
  for (const name of referenced) {
    if (!validators[name]) throw new Error(`registry.json references unknown schema "${name}"`);
  }
  const artifactMeta = ajv.getSchema(SCHEMA_BASE + "common.schema.json#/definitions/artifact_meta");
  return { registry, validators, artifactMeta };
}

function parseArtifact(path) {
  const text = readFileSync(path, "utf8");
  if (path.endsWith(".md")) {
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    return { data: m ? parseYaml(m[1]) ?? {} : null, isMarkdown: true };
  }
  if (path.endsWith(".json")) return { data: JSON.parse(text), isMarkdown: false };
  return { data: parseYaml(text), isMarkdown: false };
}

function formatAjvErrors(errors) {
  return errors.map((e) => {
    const where = e.instancePath || "(root)";
    const extra = e.params?.additionalProperty ? ` "${e.params.additionalProperty}"` : "";
    const allowed = e.params?.allowedValues ? ` (allowed: ${e.params.allowedValues.join(", ")})` : "";
    return `${where} ${e.message}${extra}${allowed}`;
  });
}

function majorMinor(v) {
  const [major, minor] = v.split(".").map(Number);
  return { major, minor };
}

/**
 * Validate one project directory.
 * Returns { errors: string[], warnings: string[] }. Messages are prefixed with the file they concern.
 */
export function validateProject(projectDir, { registry, validators, artifactMeta }) {
  const errors = [];
  const warnings = [];
  const projectId = basename(resolve(projectDir));
  const err = (file, msg) => errors.push(`${file}: ${msg}`);
  const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

  if (!existsSync(projectDir) || !statSync(projectDir).isDirectory()) {
    return { errors: [`${projectDir}: not a directory`], warnings };
  }

  const known = new Map();
  for (const a of registry.artifacts) known.set(a.file, a);
  for (const a of registry.other_files) known.set(a.file, a);

  const entries = readdirSync(projectDir, { withFileTypes: true });
  const present = new Set();
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!registry.ignored_directories.includes(entry.name)) warn(entry.name + "/", "unexpected directory");
      continue;
    }
    if (entry.name.startsWith(".")) continue;
    if (!known.has(entry.name)) {
      warn(entry.name, "not a canonical artifact name (see packages/schemas/registry.json)");
      continue;
    }
    present.add(entry.name);
  }

  if (!present.has("00_intent.yaml")) err("00_intent.yaml", "missing; every project starts from an intent");

  // No-skip rule: a stage artifact may only exist if all earlier stage artifacts exist.
  const highest = Math.max(-1, ...registry.artifacts.filter((a) => present.has(a.file)).map((a) => a.stage));
  for (const a of registry.artifacts) {
    if (a.stage < highest && !present.has(a.file)) {
      err(a.file, `missing, but a later stage (${String(highest).padStart(2, "0")}) exists; stages cannot be skipped`);
    }
  }

  const { major: schemaMajor, minor: schemaMinor } = majorMinor(registry.schema_version);
  const parsed = {};

  for (const file of present) {
    const spec = known.get(file);
    const path = join(projectDir, file);
    let data;
    let isMarkdown;
    try {
      ({ data, isMarkdown } = parseArtifact(path));
    } catch (e) {
      err(file, `cannot parse: ${e.message}`);
      continue;
    }

    if (isMarkdown) {
      if (!data) {
        err(file, "missing YAML front matter with an `artifact` versioning block");
        continue;
      }
      const allowed = new Set(["artifact", "project_id"]);
      for (const key of Object.keys(data)) if (!allowed.has(key)) err(file, `front matter: unexpected key "${key}"`);
      if (!data.artifact) err(file, "front matter: missing `artifact` block");
      if (data.project_id === undefined) err(file, "front matter: missing `project_id`");
    } else if (spec.schema) {
      const validate = validators[spec.schema];
      if (!validate(data)) {
        for (const m of formatAjvErrors(validate.errors)) err(file, m);
        // Keep going: cross-file checks below still report useful problems.
      }
    } else {
      warn(file, "no schema for this stage yet; only versioning and references are checked");
    }

    if (data == null || typeof data !== "object") {
      err(file, "is empty or not a mapping");
      continue;
    }
    parsed[file] = data;

    // project_id must match the directory name.
    const pid = data.project_id ?? data.metadata?.project_id;
    if (pid !== undefined && pid !== projectId) err(file, `project_id "${pid}" does not match directory "${projectId}"`);

    if (file === "state.yaml") continue;
    const meta = data.artifact;
    if (!meta) {
      if (!spec.schema || isMarkdown) err(file, "missing `artifact` versioning block");
      continue;
    }
    // Schema version compatibility.
    if (typeof meta.schema_version === "string" && /^\d+\.\d+\.\d+$/.test(meta.schema_version)) {
      const { major, minor } = majorMinor(meta.schema_version);
      if (major !== schemaMajor) {
        err(file, `written for schema ${meta.schema_version}, repository schemas are ${registry.schema_version} (major version differs; migrate it)`);
      } else if (minor > schemaMinor) {
        err(file, `claims schema ${meta.schema_version}, newer than repository schemas ${registry.schema_version}`);
      }
    } else {
      err(file, "artifact.schema_version must be a semver string like 1.0.0");
    }

    // Upstream pins: each derived_from entry must exist and match its current hash.
    const refs = Array.isArray(meta.derived_from) ? meta.derived_from : [];
    if (file !== "00_intent.yaml" && refs.length === 0) {
      err(file, "artifact.derived_from is empty; pin the upstream artifacts this was produced from");
    }
    for (const ref of refs) {
      if (!ref || typeof ref.path !== "string") continue; // schema errors already reported
      const upstream = join(projectDir, ref.path);
      if (!resolve(upstream).startsWith(resolve(projectDir))) {
        err(file, `derived_from path "${ref.path}" escapes the project directory`);
        continue;
      }
      if (!existsSync(upstream)) {
        err(file, `derived_from "${ref.path}" does not exist`);
        continue;
      }
      const actual = hashFile(upstream);
      if (actual !== ref.sha256) {
        err(file, `STALE: derived from ${ref.path}@${String(ref.sha256).slice(0, 12)}, which is now ${actual.slice(0, 12)}. Regenerate or re-review, then update the pin (athanor hash ${ref.path}).`);
      }
    }
  }

  // Markdown front matter has no full schema, so validate its artifact block with the shared definition.
  for (const file of present) {
    const data = parsed[file];
    if (!file.endsWith(".md") || !data?.artifact) continue;
    if (!artifactMeta(data.artifact)) {
      for (const m of formatAjvErrors(artifactMeta.errors)) err(file, `front matter artifact ${m}`);
    }
  }

  crossChecks(parsed, err);
  return { errors, warnings };
}

function crossChecks(parsed, err) {
  const timeline = parsed["07_episode_timeline.yaml"];
  const assets = parsed["09_asset_manifest.yaml"];
  const qa = parsed["11_qa_report.yaml"];

  if (Array.isArray(timeline?.beats)) {
    const seen = new Set();
    for (const b of timeline.beats) {
      if (b?.id && seen.has(b.id)) err("07_episode_timeline.yaml", `duplicate beat id "${b.id}"`);
      if (b?.id) seen.add(b.id);
    }
  }

  if (assets) {
    const ids = new Set();
    for (const key of ["visual_assets", "audio_assets", "video_assets"]) {
      for (const a of Array.isArray(assets[key]) ? assets[key] : []) {
        if (!a?.id) continue;
        if (ids.has(a.id)) err("09_asset_manifest.yaml", `duplicate asset id "${a.id}"`);
        ids.add(a.id);
      }
    }
    const beatIds = new Set((timeline?.beats ?? []).map((b) => b?.id).filter(Boolean));
    for (const v of Array.isArray(assets.video_assets) ? assets.video_assets : []) {
      if (v?.scene_id && !beatIds.has(v.scene_id)) {
        err("09_asset_manifest.yaml", `video asset "${v.id}" references scene_id "${v.scene_id}", which is not a beat id in 07_episode_timeline.yaml`);
      }
    }
  }

  if (qa && qa.passed === true) {
    const blockers = (qa.required_fixes ?? []).filter((f) => f?.severity === "blocker");
    if (qa.blocked === true) err("11_qa_report.yaml", "passed is true but blocked is true");
    if (blockers.length) err("11_qa_report.yaml", `passed is true but ${blockers.length} blocker fix(es) are open`);
  }
}

/** Resolve CLI arguments to project directories. No argument means every directory under projects/. */
export function resolveProjects(args, root = REPO_ROOT) {
  const projectsDir = join(root, "projects");
  if (args.length === 0) {
    if (!existsSync(projectsDir)) return [];
    return readdirSync(projectsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => join(projectsDir, e.name));
  }
  return args.map((a) => {
    if (existsSync(a)) return resolve(a);
    const byName = join(projectsDir, a);
    return existsSync(byName) ? byName : resolve(a);
  });
}
