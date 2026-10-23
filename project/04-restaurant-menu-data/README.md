# 04 · Restaurant Menu Data

**Level:** ⭐ · **Type:** Frontend · **Time:** ~20 min

## Scenario

Spice Route Kitchen is a family restaurant in Bengaluru. Their website is a small static site that
reads `data/menu.yaml` and turns it into the menu page, so the owner can change a price or mark a dish
as sold out without asking a developer. The file is half finished; you complete it.

## What you'll practice

- Numbers (`price`, `spicy_level`) vs text
- Booleans (`veg`, `available`) and `null` (a closed day)
- Multi-line text: `>` (folded) and `|` (literal)
- Lists inside lists: categories → items
- Flow lists (`[dairy]`) and empty lists (`[]`)

## Files

| File | Purpose |
| --- | --- |
| `practice/data/menu.yaml` | The menu data with blanks for you to fill |
| `solution/data/menu.yaml` | The finished menu, to compare with |

## Your tasks

1. Add a folded (`>`) `description` for the restaurant.
2. Mark Monday as closed with `null`.
3. Set the Paneer Tikka price to 249.
4. Mark Chicken 65 as not vegetarian.
5. Mark Butter Chicken as sold out today.
6. Add a "Breads" category with Butter Naan.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

## Bonus challenge

Add a "Drinks" category with Masala Chai and Sweet Lassi, using block lists for `allergens`.
