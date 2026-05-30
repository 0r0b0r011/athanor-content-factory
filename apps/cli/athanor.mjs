/**
 * athanor - alchemical content factory CLI
 * Usage: node athanor.mjs <command> [project-path]
 */

"use strict";

const commands = {
  create: "Create new content project",
  research: "Build research pack for a project",
  genome: "Build content genome",
  resonance: "Score resonance",
  worldbuild: "Generate world bible",
  characters: "Generate character bible",
  timeline: "Build episode timeline",
  format: "Adapt genome to format outputs",
  assets: "Build asset manifest",
  render: "Render media",
  validate: "Run QA pipeline",
  publish: "Publish to channels",
  feedback: "Log feedback and patch genome",
  status: "Show project state",
  gate: "Check a greenlight gate"
};

const cmd = process.argv[2];
const project = process.argv[3];

if (!cmd || !commands[cmd]) {
  console.log("Athanor Content Factory - alchemical content pipeline");
  console.log("");
  console.log("Usage: node athanor.mjs <command> <project-path> [options]");
  console.log("");
  console.log("Commands:");
  for (const name of Object.keys(commands)) {
    const desc = commands[name];
    console.log("  " + name.padEnd(14) + " " + desc);
  }
  process.exit(1);
}

console.log("athanor:" + cmd + " " + (project || ""));
console.log("  " + commands[cmd]);
console.log("  (worker not yet implemented - see packages/ for engine specs)");
