/**
 * Reviewer role: reads an essay and returns structured feedback (strengths, improvements, concrete edits).
 * A dedicated system prompt keeps the feedback format consistent and useful for the writer step.
 */

import { callModel } from "./api.js";

const SYSTEM_PROMPT = `You are an expert essay reviewer. For the given essay, provide structured feedback in plain text with clear sections:
1. Strengths — what works well.
2. Areas to improve — what could be better (structure, clarity, arguments, evidence).
3. Specific suggestions — concrete edits or rewrites the author could apply.

Be constructive and specific. Write in the same language as the essay.`;

/**
 * Asks the reviewer model to evaluate the essay and return structured feedback.
 * @param {Object} options - apiKey, model (reviewer model id), essay (full essay text).
 * @returns {Promise<string>} The review text (structured feedback).
 */
export async function reviewEssay({ apiKey, model, essay }) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Review the following essay and provide structured feedback as described in your instructions.\n\n--- Essay ---\n${essay}` },
  ];
  return callModel({ apiKey, model, messages });
}
