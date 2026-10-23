# 09 · Dependabot Updates

**Level:** ⭐⭐ · **Type:** Full-stack · **Time:** ~30 min

## Scenario

ShopSphere keeps its React frontend, Express backend, Dockerfile and GitHub Actions workflows in one repo.
Outdated packages kept causing security alerts, but turning on Dependabot with no config flooded the team with
dozens of tiny PRs. This config groups updates, labels them and limits how many are open at once.

## What you'll practice

- A list of maps (`updates:` with one entry per ecosystem and folder)
- Nested maps inside list items (`schedule`, `groups`)
- Block lists and flow lists (`[minor, patch]`)
- Quoting times (`"06:00"`), version ranges (`">=9.0.0"`) and patterns (`"*"`, `"@types/react*"`)

## Files

| File | Purpose |
|------|---------|
| `practice/.github/dependabot.yml` | The Dependabot config with blanks for you to fill |
| `solution/.github/dependabot.yml` | The finished config to compare with |

## Your tasks

1. Set the config `version` to 2.
2. Point the frontend entry at `/frontend`.
3. Set the check time to `"06:00"` (quoted).
4. Limit the frontend to 5 open PRs.
5. Add a `labels` list to the backend entry.
6. Set the ecosystem for the Dockerfile entry.
7. Check GitHub Actions monthly.
8. Match every action with a quoted `"*"` pattern.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

## Bonus challenge

Add a `pip` entry for a new `/ml-service` folder that runs daily and is limited to 2 open PRs.
