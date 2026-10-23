# 17 · Kubernetes Backend Config & Secrets

**Level:** ⭐⭐⭐⭐ · **Type:** Backend · **Time:** ~60 min

## Scenario

The backend team is moving its Node.js shop API onto the company cluster. Right now the database password sits in a `.env` file inside the Docker image, and changing a feature flag means a rebuild. You will split the settings out: plain values in a ConfigMap, passwords in a Secret, and one image that runs everywhere.

## What you'll practice

- A `Namespace` to keep the team's objects together
- ConfigMap values must be strings (quote numbers and booleans)
- Multi-line files inside YAML with the literal block scalar `|`
- A `Secret` of type `Opaque` with `stringData`, and why real secrets never go in git
- `envFrom` (load everything) vs `env` + `valueFrom.secretKeyRef` (load one key)
- Mounting a ConfigMap as a file with `volumes` + `volumeMounts`

## Files

| File | Purpose |
| --- | --- |
| `practice/k8s/namespace.yaml` | The Namespace with a blank |
| `practice/k8s/configmap.yaml` | Env settings and `app.json`, with blanks |
| `practice/k8s/secret.yaml` | Placeholder secrets, with blanks |
| `practice/k8s/deployment.yaml` | The API Deployment that uses all of the above, with blanks |
| `solution/k8s/*.yaml` | The finished files |

## Your tasks

**`k8s/namespace.yaml`**

1. Name the namespace `shop`.

**`k8s/configmap.yaml`**

1. Set `PORT` to the string `"3000"`.
2. Set `FEATURE_NEW_CHECKOUT` to the string `"true"`.
3. Add an `app.json` key holding a JSON document, written with `|`.

**`k8s/secret.yaml`**

1. Use the `Opaque` type.
2. Set a quoted placeholder for `DB_PASSWORD`.

**`k8s/deployment.yaml`**

1. Load every key of `shop-api-config` with `envFrom`.
2. Add the `DB_PASSWORD` env var from the Secret.
3. Read `JWT_SECRET` from the right Secret key.
4. Mount the config at `/app/config`.
5. Give the volume the same name the mount uses.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

To check the files against the Kubernetes schema, run `kubectl apply --dry-run=client -f practice/k8s/`.

## Bonus challenge

Pods don't notice when env values in a ConfigMap change. Find out how to roll them after an edit (hint: `kubectl rollout restart`, or a `checksum/config` pod annotation that Helm computes for you).
