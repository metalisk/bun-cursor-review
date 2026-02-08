/**
 * Loads and validates config.json. We use a config file instead of hardcoding
 * so you can change the API key and model IDs without touching the code.
 * OpenRouter model IDs look like "openai/gpt-4o-mini" or "anthropic/claude-3-haiku".
 */

import { existsSync } from "fs";
import { join } from "path";

const CONFIG_PATH = join(import.meta.dir, "..", "config.json");

/**
 * Loads config from config.json and checks that required fields are present.
 * @returns {{ openrouter_api_key: string, model_writer: string, model_reviewer: string }}
 * @throws {Error} If config file is missing or a required field is missing (with a clear message).
 */
export async function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    throw new Error(
      "config.json not found. Copy config.example.json to config.json and set openrouter_api_key, model_writer, model_reviewer."
    );
  }

  const file = Bun.file(CONFIG_PATH);
  const config = await file.json();

  const required = ["openrouter_api_key", "model_writer", "model_reviewer"];
  for (const key of required) {
    if (!config[key] || typeof config[key] !== "string") {
      throw new Error(
        `config.json must contain a non-empty string "${key}". Check config.example.json for the expected format.`
      );
    }
  }

  return {
    openrouter_api_key: config.openrouter_api_key.trim(),
    model_writer: config.model_writer.trim(),
    model_reviewer: config.model_reviewer.trim(),
  };
}
