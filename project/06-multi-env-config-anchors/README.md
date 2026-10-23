# 06 · Multi-Env Config with Anchors

**Level:** ⭐⭐ · **Type:** Backend · **Time:** ~30 min

## Scenario

PayFlow runs a payments microservice in three places: a developer laptop, a staging server and production.
The settings are almost the same everywhere, and copying them three times led to a bug where prod still had
an old timeout. The team now writes the shared settings once and reuses them with YAML anchors.

## What you'll practice

- Anchors (`&base`) to bookmark a block you want to reuse
- Aliases (`*db`) to reuse a block exactly as it is
- The merge key (`<<: *base`) to copy a block and then override some keys
- Why nested maps need their own anchor (a merge only copies the top level)
- Literal (`|`) block text for SQL and log formats, folded (`>`) text for descriptions

## Files

| File | Purpose |
|------|---------|
| `practice/config/app.yaml` | The config with blanks for you to fill |
| `solution/config/app.yaml` | The finished config to compare with |

## Your tasks

1. Merge the base settings into `staging` with the merge key.
2. Set staging `retries` to 5.
3. Set the staging database host.
4. Merge the base settings into `prod`.
5. Set prod `timeout_seconds` to 15.
6. Set the prod database `pool_size` to 20.
7. Add `alert_message` as folded (`>`) text over two lines.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

## Bonus challenge

Load the file in Python (`yaml.safe_load`) and print `environments.prod.database` to see the merged result.
