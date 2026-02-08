# Essay Writer → Reviewer → Revision (Bun + OpenRouter)

A small CLI pipeline: you give a topic; one model writes an essay, another reviews it, and the first revises the essay from the review. All results are saved to files under `output/`.

## Requirements

- [Bun](https://bun.sh) installed.
- An [OpenRouter](https://openrouter.ai) API key (one key gives access to many models).

## Setup

1. Clone or copy the project, then from the project root:

   ```bash
   bun install
   ```

2. Create your config from the example (do not commit `config.json` — it contains your API key):

   ```bash
   cp config.example.json config.json
   ```

3. Edit `config.json` and set:

   - **openrouter_api_key** — your OpenRouter API key.
   - **model_writer** — model used to write and revise the essay (e.g. `openai/gpt-4o-mini`).
   - **model_reviewer** — model used to review the essay (can be the same or different).

   Example:

   ```json
   {
     "openrouter_api_key": "sk-or-...",
     "model_writer": "openai/gpt-4o-mini",
     "model_reviewer": "openai/gpt-4o-mini"
   }
   ```

   OpenRouter model IDs are listed at [openrouter.ai/docs#models](https://openrouter.ai/docs#models).

## Run

Pass the essay topic as an argument:

```bash
bun run start -- "Climate change and renewable energy"
```

Or run and type the topic when prompted:

```bash
bun run start
# then enter the topic when asked
```

Results are written to `output/<topic>_<timestamp>/`:

- **draft.txt** — first draft.
- **review.txt** — reviewer feedback.
- **final.txt** — revised essay after applying the review.

## Why keep the API key out of the repo?

`config.json` is in `.gitignore` so you never commit secrets. Use `config.example.json` (without a real key) as a template and document what keys are needed.

## Project layout

- `src/index.js` — entry point: config, topic, run pipeline, save files.
- `src/config.js` — loads and validates `config.json`.
- `src/api.js` — single OpenRouter API call helper.
- `src/writer.js` — draft from topic, revise from review.
- `src/reviewer.js` — structured feedback from essay text.
- `src/output.js` — creates `output/` run folder and writes draft, review, final.
