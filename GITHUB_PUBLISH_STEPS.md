# Publishing This Project to GitHub with `gh` CLI

Step-by-step guide: authorize, create the repo, use a feature branch, open a PR, and merge.

---

## Prerequisites

- **Git** and **GitHub CLI (`gh`)** installed. Check: `gh --version`
- A **GitHub account**

---

## Step 1: Authorize the GitHub CLI

In a terminal, run:

```bash
gh auth login
```

Then follow the prompts:

1. **What account do you want to log into?** → `GitHub.com`
2. **What is your preferred protocol?** → `HTTPS` (or SSH if you use SSH keys)
3. **Authenticate Git with your GitHub credentials?** → `Yes`
4. **How would you like to authenticate?** → `Login with a web browser` (easiest)

You’ll get a one-time code and a URL. Open the URL in a browser, enter the code, and approve. When you see “Logged in as …”, you’re done.

**Verify:**

```bash
gh auth status
```

---

## Step 2: Initialize Git and Create the Local Repo

From your project root (this folder):

```bash
cd "/Users/Das/Work/sandbox/bun cursor review"

# Initialize git
git init

# Create initial commit on default branch (Git may name it main or master)
git add .
git commit -m "Initial commit: bun cursor review project"
```

---

## Step 3: Create the Repository on GitHub (Remote “Master” Repo)

Create the GitHub repo and add it as `origin`:

```bash
gh repo create bun-cursor-review --public --source=. --remote=origin --push
```

- `bun-cursor-review` → repo name (change if you want).
- `--public` → public repo (use `--private` for private).
- `--source=.` → use current directory.
- `--remote=origin` → remote name `origin`.
- `--push` → push your current branch to GitHub.

If your default branch is `main`, GitHub will have `main`. If it’s `master`, you’ll have `master`. The next steps use `main`; if you use `master`, replace `main` with `master` in the commands below.

---

## Step 4: Create a Feature Branch

Create and switch to a feature branch:

```bash
git checkout -b feature/initial-setup
```

Make any changes you want for this “feature” (or leave as-is for a first PR). If you change files:

```bash
git add .
git commit -m "Your descriptive commit message"
```

Push the feature branch:

```bash
git push -u origin feature/initial-setup
```

---

## Step 5: Create a Pull Request with Description

Open a PR from the feature branch into the default branch (`main` or `master`):

```bash
gh pr create --base main --head feature/initial-setup --title "Initial project setup" --body "Initial commit: bun cursor review project with reviewer, writer, and output modules."
```

- `--base main` → target branch (use `master` if your default is `master`).
- `--head feature/initial-setup` → branch to merge.
- `--title` → PR title.
- `--body` → PR description (can be multiple lines; use your editor with `--body-file` if you prefer).

To use a file for the body:

```bash
gh pr create --base main --head feature/initial-setup --title "Initial project setup" --body-file PR_DESCRIPTION.md
```

---

## Step 6: Merge the Pull Request

Merge the PR (e.g. with a merge commit):

```bash
gh pr merge --merge
```

Other options:

- `--squash` — squash all commits into one.
- `--rebase` — rebase and merge.

Then update your local default branch and delete the feature branch:

```bash
git checkout main
git pull origin main
git branch -d feature/initial-setup
```

---

## Quick Reference (After Auth and First Push)

| Step              | Command |
|-------------------|--------|
| Auth              | `gh auth login` |
| Init + first push | `git init` → `git add .` → `git commit -m "..."` → `gh repo create ... --push` |
| Feature branch    | `git checkout -b feature/xxx` → edit → `git add .` → `git commit -m "..."` → `git push -u origin feature/xxx` |
| Open PR           | `gh pr create --base main --head feature/xxx --title "..." --body "..."` |
| Merge PR          | `gh pr merge --merge` |
| Clean up local    | `git checkout main` → `git pull` → `git branch -d feature/xxx` |

---

## If Your Default Branch Is `master`

If you see `master` instead of `main`:

- Use `--base master` in `gh pr create`.
- Use `git checkout master`, `git pull origin master`, and `git branch -d feature/initial-setup` in Step 6.

---

## Troubleshooting

- **“Repository already exists”**  
  Create the repo on GitHub first in the browser or use:  
  `gh repo create YOUR_USERNAME/bun-cursor-review --public`  
  Then: `git remote add origin https://github.com/YOUR_USERNAME/bun-cursor-review.git` and `git push -u origin main` (or `master`).

- **Branch name**  
  Replace `feature/initial-setup` with any branch name you prefer (e.g. `docs/readme`, `feature/add-tests`).

- **Auth issues**  
  Run `gh auth login` again and choose the same account and protocol.
