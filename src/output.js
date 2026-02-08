/**
 * Writes pipeline results to the output/ directory. Saving all three artifacts (draft, review, final)
 * lets you compare versions and learn from the feedback without re-running the pipeline.
 */

import { join } from "path";
import { mkdir } from "fs/promises";

const OUTPUT_DIR = join(import.meta.dir, "..", "output");

/**
 * Sanitizes a string for use in a folder name (alphanumeric, spaces → underscores, limit length).
 * @param {string} topic
 * @returns {string}
 */
function sanitizeTopic(topic) {
  return topic
    .replace(/[^a-zA-Z0-9\u0400-\u04FF\s-]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 50)
    .trim() || "essay";
}

/**
 * Ensures output/ exists and creates a run subfolder: output/<topic>_<timestamp>/.
 * @param {string} topic - Essay topic (used for folder name).
 * @returns {Promise<string>} Path to the run directory (e.g. .../output/climate_change_1707123456/).
 */
export async function createRunDir(topic) {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const timestamp = Math.floor(Date.now() / 1000);
  const safe = sanitizeTopic(topic);
  const runDir = join(OUTPUT_DIR, `${safe}_${timestamp}`);
  await mkdir(runDir, { recursive: true });
  return runDir;
}

/**
 * Writes draft, review, and final essay into the run directory as draft.txt, review.txt, final.txt.
 * @param {string} runDir - Path from createRunDir().
 * @param {{ draft: string, review: string, final: string }} files - Content for each file.
 */
export async function writeRunFiles(runDir, { draft, review, final }) {
  await Bun.write(join(runDir, "draft.txt"), draft);
  await Bun.write(join(runDir, "review.txt"), review);
  await Bun.write(join(runDir, "final.txt"), final);
}
