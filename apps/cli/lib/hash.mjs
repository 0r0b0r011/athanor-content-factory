import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

/**
 * Content hash used to pin artifacts in `derived_from`.
 * Line endings are normalised to LF so a Windows checkout produces the same hash.
 */
export function hashContent(text) {
  return createHash("sha256").update(text.replace(/\r\n/g, "\n"), "utf8").digest("hex");
}

export function hashFile(path) {
  return hashContent(readFileSync(path, "utf8"));
}
