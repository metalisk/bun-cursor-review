/**
 * Writer role: (1) produce a draft essay from a topic, (2) revise the draft using reviewer feedback.
 * Uses a system prompt to set the role; the user message carries the topic or the draft+review.
 */

import { callModel } from "./api.js";

const SYSTEM_PROMPT = `You are a clear, thoughtful essay writer. Write in well-structured paragraphs. Use the language requested by the user (or English if not specified).`;

/**
 * Asks the writer model to produce a draft essay on the given topic.
 * @param {Object} options - apiKey, model (writer model id), topic string.
 * @returns {Promise<string>} The draft essay text.
 */
export async function writeDraft({ apiKey, model, topic }) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Write an essay on the following topic. Output only the essay, no preamble.\n\nTopic: ${topic}` },
  ];
  return callModel({ apiKey, model, messages });
}

/**
 * Asks the writer model to revise the draft using the reviewer's feedback.
 * We pass both the original draft and the review so the model has full context.
 * @param {Object} options - apiKey, model, draft (essay text), review (feedback text).
 * @returns {Promise<string>} The revised essay text.
 */
export async function reviseFromReview({ apiKey, model, draft, review }) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Below is your draft essay and then feedback from a reviewer. Revise the essay to address the feedback. Output only the revised essay, no preamble.\n\n--- Draft ---\n${draft}\n\n--- Reviewer feedback ---\n${review}`,
    },
  ];
  return callModel({ apiKey, model, messages });
}
