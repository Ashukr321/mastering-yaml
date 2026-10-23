# 03 · i18n Translations

**Level:** ⭐ · **Type:** Frontend · **Time:** ~20 min

## Scenario

ShopKart is a React e-commerce app that is launching in India, so every screen must work in English
and Hindi. The team uses react-i18next: components call `t("cart.title")` and the library looks up the
nested key in `locales/en.yaml` or `locales/hi.yaml`. A translator sent the Hindi text; you need to
finish both files without breaking the YAML.

## What you'll practice

- Nested keys (`cart.title`, `errors.network`)
- Quoting values that start with `{` or contain `: ` or ` #`
- Quoting `"Yes"` / `"No"` so they stay text
- Plural keys (`item_one`, `item_other`)
- Lists (`checkout.steps`) and UTF-8 text (Devanagari)

## Files

| File | Purpose |
| --- | --- |
| `practice/locales/en.yaml` | English strings with blanks (TODO 1-3) |
| `practice/locales/hi.yaml` | Hindi strings with blanks (TODO 4-6) |
| `solution/locales/en.yaml` | Finished English file |
| `solution/locales/hi.yaml` | Finished Hindi file |

## Your tasks

1. `en.yaml`: set `common.no_label` to a quoted `"No"`.
2. `en.yaml`: fill the plural `cart.item_other`.
3. `en.yaml`: add the `network` and `out_of_stock` error keys.
4. `hi.yaml`: fill the plural `cart.item_other`.
5. `hi.yaml`: add the three checkout `steps` in Hindi.
6. `hi.yaml`: fill the `out_of_stock` error (quoted).

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

## Bonus challenge

Add a `cart.checkout_button` key to both files (English: "Proceed to checkout", Hindi: "चेकआउट करें").
