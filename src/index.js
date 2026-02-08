/**
 * Entry point: loads config, gets essay topic from CLI (argv or prompt), runs the pipeline
 * (writer draft → reviewer feedback → writer revision) and saves draft.txt, review.txt, final.txt
 * into output/<topic>_<timestamp>/.
 */

import { loadConfig } from "./config.js";
import { writeDraft, reviseFromReview } from "./writer.js";
import { reviewEssay } from "./reviewer.js";
import { createRunDir, writeRunFiles } from "./output.js";

async function main() {
  let config;
  try {
    config = await loadConfig();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const topicFromArgv = process.argv[2]?.trim();
  const topic = topicFromArgv || (await prompt("Essay topic: "))?.trim() || "";
  if (!topic) {
    console.error("Usage: bun run start -- <topic>");
    console.error("Example: bun run start -- \"Climate change and renewable energy\"");
    process.exit(1);
  }

  const { openrouter_api_key, model_writer, model_reviewer } = config;
  const apiKey = openrouter_api_key;

  console.log("Writing draft...");
  const draft = await writeDraft({ apiKey, model: model_writer, topic });

  const runDir = await createRunDir(topic);
  console.log("Getting review...");
  const review = await reviewEssay({ apiKey, model: model_reviewer, essay: draft });

  console.log("Revising essay...");
  const final = await reviseFromReview({ apiKey, model: model_writer, draft, review });

  await writeRunFiles(runDir, { draft, review, final });
  console.log("Done. Results saved to:", runDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
