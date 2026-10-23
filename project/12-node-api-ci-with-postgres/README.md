# 12 · Node API CI with PostgreSQL

**Level:** ⭐⭐⭐ · **Type:** Backend · **Time:** ~45 min

## Scenario

Your backend team runs an Express API on PostgreSQL. Mocked database tests kept passing while real queries broke in production. You will write a CI workflow that starts a real `postgres:16` container, runs migrations, and tests the API on both Node 20 and Node 22.

## What you'll practice

- `strategy.matrix` to run one job on several Node versions
- `services:` containers with `ports:` and health-check `options:`
- Job-level `env:` with a quoted `DATABASE_URL`
- Folded block scalars (`>-`) for long text
- `timeout-minutes:` and step-level `if:`

## Files

| File | Purpose |
| --- | --- |
| `practice/.github/workflows/ci.yml` | The workflow with blanks for you to fill |
| `solution/.github/workflows/ci.yml` | The finished workflow |

## Your tasks

1. Set the job timeout to 20 minutes.
2. Add Node `"22"` to the matrix.
3. Use the `postgres:16` image.
4. Publish port `"5432:5432"`.
5. Write the `pg_isready` health command.
6. Build the `DATABASE_URL` connection string.
7. Use the matrix value for `node-version`.
8. Add a "Run database migrations" step.
9. Run the tests with coverage.

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

Add an `include:` entry to the matrix that also tests Node 24, and let only that run fail with `continue-on-error`.
