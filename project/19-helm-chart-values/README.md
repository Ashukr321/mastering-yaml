# 19 · Helm Chart & Values

**Level:** ⭐⭐⭐⭐ · **Type:** DevOps · **Time:** ~60 min

## Scenario

The platform team is tired of copy-pasting slightly different Kubernetes files for dev, staging and production. They are packaging the shop API as a Helm chart: templates stay the same, and each environment only overrides a few values. Your job is the chart's metadata and its default values.

## What you'll practice

- `Chart.yaml` with `apiVersion: v2`, `version` and a quoted `appVersion`
- Chart dependencies with a version range, an OCI repository and a `condition`
- A well-organised `values.yaml`: nested maps, lists of maps, empty `{}` and `[]`
- Why version strings and env values must be quoted
- Passing values to a sub-chart (`postgresql:`)

## Files

| File | Purpose |
| --- | --- |
| `practice/charts/shop-api/Chart.yaml` | Chart metadata with blanks |
| `practice/charts/shop-api/values.yaml` | Default values with blanks |
| `solution/charts/shop-api/Chart.yaml` | The finished Chart.yaml |
| `solution/charts/shop-api/values.yaml` | The finished values.yaml |

This project has no `templates/` folder on purpose: it is about the YAML you write, not Go templating.

## Your tasks

**`charts/shop-api/Chart.yaml`**

1. Set the chart version to `"0.3.0"`.
2. Set the app version to `"2.3.0"`.
3. Ask for postgresql chart version `"16.x.x"`.
4. Use the Bitnami OCI repository `oci://registry-1.docker.io/bitnamicharts`.
5. Install it only when `postgresql.enabled` is true.

**`charts/shop-api/values.yaml`**

1. Set `replicaCount` to `2`.
2. Set the image tag to `"2.3.0"`.
3. Add a `resources:` block with requests and limits.
4. Set the `PORT` env value to `"3000"`.
5. Set `nodeSelector` to an empty map.
6. Turn the bundled PostgreSQL on.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

To check the chart with Helm, add an empty `templates/` folder and run `helm lint solution/charts/shop-api`
(run `helm dependency update solution/charts/shop-api` first to download the postgresql chart).

## Bonus challenge

Write a `values-prod.yaml` that only overrides what production needs: 4 replicas, autoscaling on, and a bigger memory limit.
