# 14 · GitLab CI for a Full-stack Monorepo

**Level:** ⭐⭐⭐ · **Type:** Full-stack · **Time:** ~45 min

## Scenario

Your company keeps a React `frontend/` and a Node `backend/` in one GitLab repository. Every commit currently runs every job, so a one-line CSS fix waits for the backend tests. You will write a pipeline that only runs jobs for the folder that changed, reuses settings with a hidden template, and deploys to production only when someone clicks the button.

## What you'll practice

- `stages:`, `default:` and global `variables:`
- Hidden jobs (`.node_template`) reused with `extends:`
- `cache:` keyed on lockfiles with `key: files:`
- `rules:` with `changes:` per folder, and `when: manual`
- `artifacts:` with `expire_in`, and `needs:` between jobs
- `environment:` for deployments

## Files

| File | Purpose |
| --- | --- |
| `practice/.gitlab-ci.yml` | The pipeline with blanks for you to fill |
| `solution/.gitlab-ci.yml` | The finished pipeline |

## Your tasks

1. Add the `build` stage.
2. Set the default image to `node:20-alpine`.
3. Add the backend lockfile to the cache key.
4. Add the `backend/**/*` change rule.
5. Expire install artifacts after `1 hour`.
6. Make `test-frontend` need `install-frontend`.
7. Add `artifacts:` for `frontend/dist/` that expire in `1 week`.
8. Name the environment `production`.
9. Make the deploy job manual.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

`yamllint` skips hidden files like `.gitlab-ci.yml` when given a folder, so you can also pass the file directly:
`yamllint --strict practice/.gitlab-ci.yml`. To check the GitLab schema too, paste the file into your project's
**Build > Pipeline editor** (or the CI Lint page).

## Bonus challenge

Add a `build-backend` job that builds a Docker image of `backend/` only when `backend/Dockerfile` changes.
