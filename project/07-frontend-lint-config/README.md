# 07 · Frontend Lint Config

**Level:** ⭐⭐ · **Type:** Frontend · **Time:** ~30 min

## Scenario

A small team builds an online store with React and TypeScript. Every pull request turned into a debate about
quotes and semicolons, so the tech lead added one shared ESLint config for bugs and one Prettier config for
formatting. Both are written in YAML so they can carry comments.

## What you'll practice

- Nested maps (`env`, `parserOptions`, `settings`)
- Block lists (`extends`, `plugins`) and flow lists (`[error, {...}]`)
- Lists that mix a string and a map (rule severity + options)
- Quoting values that start with `@` or `*`
- Quoting `"off"` so YAML does not turn it into the boolean `false`

## Files

| File | Purpose |
|------|---------|
| `practice/.eslintrc.yml` | ESLint config with blanks (TODO 1-6) |
| `practice/.prettierrc.yml` | Prettier config with blanks (TODO 7-8) |
| `solution/.eslintrc.yml` | Finished ESLint config |
| `solution/.prettierrc.yml` | Finished Prettier config |

## Your tasks

1. Set the TypeScript parser (quoted, it starts with `@`).
2. Turn on JSX in `ecmaFeatures`.
3. Add `prettier` as the last item in `extends`.
4. Turn off `react/react-in-jsx-scope` with a quoted `"off"`.
5. Add the `eqeqeq` rule as a block list.
6. Add the `**/*.test.tsx` pattern to the test override.
7. Turn on `singleQuote` in Prettier.
8. Add a Prettier override for YAML files.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

Both files start with a dot, so `ls` hides them. Use `ls -a practice` to see them.

## Bonus challenge

Add a second override that turns `no-console` off for files in `scripts/**`.
