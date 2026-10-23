# 13 · Build and Push a Docker Image to GHCR

**Level:** ⭐⭐⭐ · **Type:** Backend · **Time:** ~45 min

## Scenario

The payments team releases its API by pushing a git tag such as `v1.4.0`. Today someone builds and pushes the image from their laptop, and sometimes forgets. You will automate it: every version tag builds a Docker image and publishes it to GitHub Container Registry (`ghcr.io`) with proper version tags.

## What you'll practice

- Triggering on tags with a quoted glob (`"v*.*.*"`)
- `permissions:` for the `GITHUB_TOKEN` (least privilege)
- Workflow-level `env:` and `${{ env.NAME }}`
- Step `id:` and reading step outputs (`steps.meta.outputs.tags`)
- The Docker actions: `setup-buildx`, `login`, `metadata`, `build-push`
- Literal block scalars (`|`) for multi-line inputs

## Files

| File | Purpose |
| --- | --- |
| `practice/.github/workflows/docker-publish.yml` | The workflow with blanks for you to fill |
| `solution/.github/workflows/docker-publish.yml` | The finished workflow |

## Your tasks

1. Trigger on tags matching `"v*.*.*"`.
2. Give the token `packages: write`.
3. Set the registry to `ghcr.io`.
4. Use `docker/setup-buildx-action@v3`.
5. Log in with `secrets.GITHUB_TOKEN`.
6. Give the metadata step the id `meta`.
7. Set the full image name.
8. Turn on `push`.
9. Use the tags from the `meta` step.
10. Add the GitHub Actions build cache (`cache-from` / `cache-to`).

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

`yamllint` skips hidden folders like `.github/` when given a folder, so you can also pass the file directly:
`yamllint --strict practice/.github/workflows/docker-publish.yml`. To check the GitHub Actions schema too, run
[`actionlint`](https://github.com/rhysd/actionlint) on the file.

## Bonus challenge

Build for both `linux/amd64` and `linux/arm64` by adding `docker/setup-qemu-action@v3` and the `platforms:` input.
