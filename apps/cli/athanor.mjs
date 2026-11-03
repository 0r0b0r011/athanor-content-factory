#!/usr/bin/env node
/**
 * athanor — Athanor Content Factory CLI
 * Usage: athanor <command> [args] [options]
 *
 * Exit codes:
 *   0  success
 *   1  validation failed / usage error
 *   2  command exists but is not implemented yet (never treat as success)
 */

import { relative } from "node:path";
import { hashFile } from "./lib/hash.mjs";
import { REPO_ROOT, loadSchemas, resolveProjects, validateProject } from "./lib/validate.mjs";

const EXIT = { OK: 0, FAIL: 1, NOT_IMPLEMENTED: 2 };

const commands = {
  validate: {
    desc: "Validate project artifacts: schemas, versions, hash pins, no-skip order",
    usage: "validate [project ...]   (no project = all of projects/)",
    run: runValidate,
  },
  hash: {
    desc: "Print the sha256 pin for files (for artifact.derived_from)",
    usage: "hash <file ...>",
    run: runHash,
  },
  create: { desc: "Create new content project" },
  research: { desc: "Build research pack for a project" },
  genome: { desc: "Build content genome" },
  resonance: { desc: "Build resonance spec" },
  worldbuild: { desc: "Generate world bible" },
  characters: { desc: "Generate character bible" },
  timeline: { desc: "Build episode timeline" },
  format: { desc: "Adapt genome to format outputs" },
  assets: { desc: "Build asset manifest" },
  render: { desc: "Render media" },
  score: { desc: "Run QA scoring and write the QA report" },
  publish: { desc: "Publish to channels" },
  feedback: { desc: "Log feedback and patch genome" },
  status: { desc: "Show project state" },
  gate: { desc: "Check a greenlight gate" },
};

function printUsage(stream = process.stdout) {
  stream.write("Athanor Content Factory\n\nUsage: athanor <command> [args]\n\nCommands:\n");
  for (const [name, c] of Object.entries(commands)) {
    const tag = c.run ? "" : "  (not implemented)";
    stream.write("  " + name.padEnd(12) + " " + c.desc + tag + "\n");
  }
}

function runValidate(args) {
  let schemas;
  try {
    schemas = loadSchemas();
  } catch (e) {
    console.error("schema error: " + e.message);
    return EXIT.FAIL;
  }
  const projects = resolveProjects(args.filter((a) => !a.startsWith("-")));
  if (projects.length === 0) {
    console.error("no projects found");
    return EXIT.FAIL;
  }
  let failed = 0;
  for (const dir of projects) {
    const { errors, warnings } = validateProject(dir, schemas);
    const label = relative(REPO_ROOT, dir) || dir;
    console.log(`${errors.length ? "FAIL" : "ok  "} ${label}`);
    for (const e of errors) console.log("  error   " + e);
    for (const w of warnings) console.log("  warning " + w);
    if (errors.length) failed++;
  }
  console.log(`\n${projects.length - failed}/${projects.length} project(s) valid (schemas ${schemas.registry.schema_version})`);
  return failed ? EXIT.FAIL : EXIT.OK;
}

function runHash(args) {
  if (args.length === 0) {
    console.error("usage: athanor " + commands.hash.usage);
    return EXIT.FAIL;
  }
  let code = EXIT.OK;
  for (const file of args) {
    try {
      console.log(`${hashFile(file)}  ${file}`);
    } catch (e) {
      console.error(`${file}: ${e.message}`);
      code = EXIT.FAIL;
    }
  }
  return code;
}

function main(argv) {
  const [cmd, ...args] = argv;
  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
    printUsage();
    return cmd ? EXIT.OK : EXIT.FAIL;
  }
  if (!Object.hasOwn(commands, cmd)) {
    console.error(`unknown command: ${cmd}\n`);
    printUsage(process.stderr);
    return EXIT.FAIL;
  }
  const command = commands[cmd];
  if (!command.run) {
    console.error(`athanor ${cmd}: not implemented yet (${command.desc}). See docs/roadmap.md.`);
    return EXIT.NOT_IMPLEMENTED;
  }
  return command.run(args);
}

process.exitCode = main(process.argv.slice(2));
