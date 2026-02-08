# Essay Writer → Reviewer → Revision (Bun + OpenRouter)

A small CLI pipeline: you give a topic; one model writes an essay, another reviews it, and the first revises the essay from the review. All results are saved to files under `output/`.

## Requirements

- [Bun](https://bun.sh) installed
- An [OpenRouter](https://openrouter.ai) API key (one key gives access to many models)

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

   - **openrouter_api_key** — your OpenRouter API key
   - **model_writer** — model used to write and revise the essay (e.g. `openai/gpt-4o-mini`)
   - **model_reviewer** — model used to review the essay (can be the same or different)

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

- **draft.txt** — first draft
- **review.txt** — reviewer feedback
- **final.txt** — revised essay after applying the review

## Why keep the API key out of the repo?

`config.json` is in `.gitignore` so you never commit secrets. Use `config.example.json` (without a real key) as a template and document what keys are needed

## Project layout

- `src/index.js` — entry point: config, topic, run pipeline, save files
- `src/config.js` — loads and validates `config.json`
- `src/api.js` — single OpenRouter API call helper
- `src/writer.js` — draft from topic, revise from review
- `src/reviewer.js` — structured feedback from essay text
- `src/output.js` — creates `output/` run folder and writes draft, review, final

## Modules and How They Work

Below is a description of the main modules and the core functions they provide.

### `src/index.js`

Responsible for orchestrating the workflow: configuring, obtaining the topic, running each pipeline stage, and saving all results.

```js
// main function
async function main() {
  const config = loadConfig()
  const topic = await getTopicFromArgOrPrompt()
  const outDir = await createOutputFolder(topic)
  const draft = await writeDraft(topic, config)
  await writeFile(`${outDir}/draft.txt`, draft)
  const review = await reviewEssay(draft, config)
  await writeFile(`${outDir}/review.txt`, review)
  const final = await reviseEssay(draft, review, config)
  await writeFile(`${outDir}/final.txt`, final)
}
```

### `src/config.js`

Loads and validates the configuration file to make sure all required fields exist.

```js
export function loadConfig() {
  const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'))
  // validation logic here
  return config
}
```

### `src/api.js`

Performs a single OpenRouter API call for both essay generation and review.

```js
export async function callOpenRouter({ prompt, model, apiKey }) {
  // Uses fetch to POST prompt to OpenRouter API & returns response
}
```

### `src/writer.js`

Exposes functions to generate an essay draft from a topic and to revise the draft given a review.

```js
export async function writeDraft(topic, config) {
  // Calls callOpenRouter using model_writer and returns draft
}

export async function reviseEssay(draft, review, config) {
  // Calls callOpenRouter using model_writer and returns revised draft
}
```

### `src/reviewer.js`

Provides a function to generate structured feedback on the essay draft.

```js
export async function reviewEssay(essayText, config) {
  // Calls callOpenRouter using model_reviewer and returns review
}
```

### `src/output.js`

Handles folder creation and file writing in the output hierarchy.

```js
export async function createOutputFolder(topic) {
  // Creates output directory for the given topic and timestamp
}

export async function writeFile(path, content) {
  // Writes content to the given path
}
```
