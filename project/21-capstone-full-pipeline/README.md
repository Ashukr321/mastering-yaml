# 21 · Capstone: Full CI/CD Pipeline

**Level:** ⭐⭐⭐⭐⭐ · **Type:** Full-stack · **Time:** ~90 min

## Scenario

The shop team has a React frontend, a Node.js backend and a Postgres database. Today they test by hand, build images on a laptop, and deploy with whoever remembers the `kubectl` commands. You will build the whole path: every PR gets tested, every merge to `main` builds both images, ships them to staging, and waits for a human to approve production. A Compose file lets developers run the same app locally.

## What you'll practice

- Triggers for `push` and `pull_request`
- Least-privilege `permissions`, `concurrency` and workflow `env`
- A `matrix` job that tests two apps
- Job `needs`, `if` conditions and job `outputs`
- Building and pushing two images to `ghcr.io`
- GitHub Environments: secrets per environment and manual approval for production
- `kubectl set image` with `azure/setup-kubectl@v4`
- Docker Compose with `depends_on` + `condition: service_healthy`

Note: this pipeline repeats steps instead of using YAML anchors (`&` / `*`). GitHub Actions rejected anchors for years, and writing steps out keeps every job readable on its own.

## Files

| File | Purpose |
| --- | --- |
| `practice/.github/workflows/pipeline.yml` | The CI/CD pipeline with blanks |
| `practice/docker-compose.yml` | The local dev stack with blanks |
| `solution/.github/workflows/pipeline.yml` | The finished pipeline |
| `solution/docker-compose.yml` | The finished Compose file |

## Your tasks

**`.github/workflows/pipeline.yml`**

1. Give the token `contents: read`.
2. Set the concurrency group to `${{ github.workflow }}-${{ github.ref }}`.
3. Add `backend` to the test matrix.
4. Make `build-and-push` wait for `test`.
5. Run `build-and-push` only on a push to `main`.
6. Allow `packages: write` for the build job.
7. Expose the image tag as a job output.
8. Make `deploy-production` need both `build-and-push` and `deploy-staging`.
9. Show the production URL `https://shop.example.com`.

**`docker-compose.yml`**

1. Make the backend wait for a healthy database (`service_healthy`).
2. Use the `postgres:16` image.
3. Add a `pg_isready` healthcheck.

Before production can be approved, create two Environments in **Settings → Environments** (`staging` and `production`), give each one a `KUBECONFIG` secret, and add yourself as a required reviewer on `production`.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

`yamllint` skips hidden folders like `.github/` when given a folder, so also pass the file directly:
`yamllint --strict practice/.github/workflows/pipeline.yml`. Then check the Actions schema with
[`actionlint`](https://github.com/rhysd/actionlint) and the Compose file with `docker compose -f solution/docker-compose.yml config`.

## Bonus challenge

Add a smoke-test step after the staging deploy that runs `curl --fail https://staging.shop.example.com/healthz`.
