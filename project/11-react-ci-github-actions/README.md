# 11 · React CI with GitHub Actions

**Level:** ⭐⭐⭐ · **Type:** Frontend · **Time:** ~45 min

## Scenario

Your frontend team builds a React dashboard with Vite. Last week a broken build was merged to `main` because nobody ran it locally. You will add a CI workflow that lints, tests and builds every push and pull request, and keeps the built `dist` folder for reviewers.

## What you'll practice

- `on:` triggers for `push` and `pull_request` with `branches:` and `paths:` filters
- `concurrency:` to cancel outdated runs
- `${{ }}` GitHub expressions
- `actions/checkout@v4`, `actions/setup-node@v4` with npm cache, `actions/upload-artifact@v4`
- Quoting versions like `"20"` so YAML keeps them as text

## Files

| File | Purpose |
| --- | --- |
| `practice/.github/workflows/ci.yml` | The workflow with blanks for you to fill |
| `solution/.github/workflows/ci.yml` | The finished workflow |

## Your tasks

1. Run the workflow on pushes to `main`.
2. Add the same `paths:` filter to `pull_request`.
3. Set the concurrency `group` to workflow name + branch ref.
4. Turn on `cancel-in-progress`.
5. Pick the runner (`ubuntu-latest`).
6. Set Node to `"20"` (quoted).
7. Turn on the npm cache.
8. Install dependencies with `npm ci`.
9. Add a "Run tests" step.
10. Upload the `dist/` folder.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

`yamllint` skips hidden folders like `.github/` when given a folder, so you can also pass the file directly:
`yamllint --strict practice/.github/workflows/ci.yml`. To check the GitHub Actions schema too, run
[`actionlint`](https://github.com/rhysd/actionlint) on the file.

## Bonus challenge

Add a second job `preview` with `needs: build` that downloads the `dist` artifact with `actions/download-artifact@v4`.
