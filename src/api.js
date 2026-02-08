/**
 * Single place for calling OpenRouter (and thus any supported model).
 * Messages follow the OpenAI chat format: [{ role: "system"|"user"|"assistant", content: string }].
 * Keeping API calls in one module makes it easy to switch providers or add retries later.
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Calls OpenRouter chat completions API.
 * @param {Object} options
 * @param {string} options.apiKey - OpenRouter API key (Bearer token).
 * @param {string} options.model - Model ID, e.g. "openai/gpt-4o-mini".
 * @param {{ role: string, content: string }[]} options.messages - Chat messages (system/user/assistant).
 * @returns {Promise<string>} The assistant reply text (single message).
 * @throws {Error} If the API returns an error or the response shape is unexpected.
 */
export async function callModel({ apiKey, model, messages }) {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  const choice = data.choices?.[0];
  if (!choice?.message?.content) {
    throw new Error("OpenRouter returned no content in choices[0].message.content");
  }

  return String(choice.message.content).trim();
}
