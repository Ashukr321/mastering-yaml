# 01 · Portfolio Site Config

**Level:** ⭐ · **Type:** Frontend · **Time:** ~20 min

## Scenario

Priya is a frontend developer who wants a personal portfolio site. She uses Jekyll, a static site
generator that GitHub Pages supports out of the box. Jekyll reads `_config.yml` to get the site title,
the menu, her social links and the theme colours. Your job is to finish that file.

## What you'll practice

- Plain strings vs quoted strings (URLs, `#` colours, text with `: `)
- Empty strings (`""`)
- Booleans (`true` / `false`)
- Nested mappings (`author`, `theme`)
- Lists of maps (`nav_links`, `socials`)

## Files

| File                   | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `practice/_config.yml` | The Jekyll config with blanks for you to fill |
| `solution/_config.yml` | The finished config, to compare with          |

## Your tasks

1. Set `url` to the live site address (quoted).
2. Mark Priya as available for hire with a boolean.
3. Give the Contact menu entry its URL.
4. Add a `socials` list with GitHub and LinkedIn entries.
5. Set the accent colour (remember the quotes).
6. Turn dark mode on.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

## Bonus challenge

Add an `X` (Twitter) entry to `socials` and a `secondary_color`, then run yamllint again.
