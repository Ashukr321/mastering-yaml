# 05 · Feature Flags

**Level:** ⭐ · **Type:** Backend · **Time:** ~20 min

## Scenario

TaskFlow is a project-management SaaS. To ship safely, the backend team hides new features behind
feature flags: a flag can be on for 25% of users, only for admins, or only on the staging server.
All flags live in `config/feature-flags.yaml`, and a typo here once switched a beta feature on for
every customer. Finish the file carefully.

## What you'll practice

- Booleans and percentages (numbers)
- `null` for "no value"
- Quoting versions (`"1.10"`), `@` names, text with `: ` / ` #`, and `"NO"` (the Norway problem)
- Lists of roles (block and flow style, empty `[]`)
- Nested per-environment overrides (dev / staging / prod)

## Files

| File | Purpose |
| --- | --- |
| `practice/config/feature-flags.yaml` | The flag config with blanks for you to fill |
| `solution/config/feature-flags.yaml` | The finished config, to compare with |

## Your tasks

1. Set `schema_version` to `"1.10"` (quoted).
2. Roll `new_dashboard` out to 25% of users.
3. Set the `new_dashboard` owner to `"@growth-team"`.
4. Add a `staging` override with a 50% rollout.
5. Set `bulk_export.kill_switch_reason` to `null`.
6. Add Norway (`"NO"`) to `blocked_countries`.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

## Bonus challenge

Remove the quotes around `"NO"`, run yamllint, and read the `truthy` warning it gives you.
