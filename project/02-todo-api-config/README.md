# 02 · Todo API Config

**Level:** ⭐ · **Type:** Backend · **Time:** ~20 min

## Scenario

A three-person startup is building a todo app. The backend is a Node/Express REST API that uses the
popular `config` npm package, which loads `config/default.yaml` when the server starts. The new
backend developer (you) has to finish the default settings before the first deploy.

## What you'll practice

- Numbers vs quoted text (`4000` vs `"0.0.0.0"`, `"1h"`)
- `null` for values that come from environment variables
- Booleans (`ssl`, `pretty`, `credentials`)
- Nested mappings (`database.pool`)
- Block lists and flow lists (`allowed_origins`, `allowed_methods`)

## Files

| File | Purpose |
| --- | --- |
| `practice/config/default.yaml` | The API config with blanks for you to fill |
| `solution/config/default.yaml` | The finished config, to compare with |

## Your tasks

1. Set the server port to 4000.
2. Name the database `todo_db`.
3. Set the max connection pool size to 10.
4. Set the logging level to `info`.
5. Add the admin panel URL to the CORS origins list.
6. Add a `rate_limit` map with a 15-minute window and 100 max requests.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

## Bonus challenge

Write `config/production.yaml` that only overrides `logging.level` to `warn` and `database.ssl` to `true`.
