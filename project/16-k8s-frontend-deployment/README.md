# 16 · Kubernetes Frontend Deployment

**Level:** ⭐⭐⭐⭐ · **Type:** Frontend · **Time:** ~60 min

## Scenario

The web team at an online shop builds its React storefront into static files and serves them with an `nginx:1.27-alpine` image. Until now one server ran it, and every release meant a few seconds of downtime. You will move it onto Kubernetes: three copies, health checks, and rolling updates that never drop a request.

## What you'll practice

- The four top-level keys of every Kubernetes object: `apiVersion`, `kind`, `metadata`, `spec`
- Labels and selectors, and why they must match
- A `RollingUpdate` strategy with `maxSurge` / `maxUnavailable`
- Container ports, named ports, and resource requests/limits
- Readiness vs liveness probes
- A `ClusterIP` Service that finds pods by label

## Files

| File | Purpose |
| --- | --- |
| `practice/k8s/deployment.yaml` | The Deployment with blanks for you to fill |
| `practice/k8s/service.yaml` | The Service with blanks for you to fill |
| `solution/k8s/deployment.yaml` | The finished Deployment |
| `solution/k8s/service.yaml` | The finished Service |

## Your tasks

**`k8s/deployment.yaml`**

1. Run `3` replicas.
2. Make the selector match the pod label `shop-frontend`.
3. Use the `RollingUpdate` strategy.
4. Set `maxUnavailable` to `0`.
5. Use the pinned image `ghcr.io/acme/shop-frontend:1.4.2`.
6. Add a `resources:` block with requests and limits.
7. Point the readiness probe at the path `/`.
8. Add a `livenessProbe`.

**`k8s/service.yaml`**

1. Use the `ClusterIP` type.
2. Select the pods labelled `app: shop-frontend`.
3. Forward to the named container port `http`.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

To check the files against the Kubernetes schema, run `kubectl apply --dry-run=client -f practice/k8s/`
(you need `kubectl` installed; a cluster is not required for a client dry run).

## Bonus challenge

Add a `PodDisruptionBudget` with `minAvailable: 2` so node maintenance never takes down more than one pod.
