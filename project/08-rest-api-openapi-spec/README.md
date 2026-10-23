# 08 · REST API OpenAPI Spec

**Level:** ⭐⭐ · **Type:** Backend · **Time:** ~30 min

## Scenario

A bookstore startup is building a web shop and a mobile app at the same time. Before anyone writes the API,
the backend team agrees on an OpenAPI contract in YAML. The frontend teams read it in Swagger UI and generate
client code from it, so every endpoint, field and status code must be right.

## What you'll practice

- Deeply nested maps (`paths` > method > `responses` > status code)
- Quoting status codes (`'200'`) and versions (`"3.0.3"`) so they stay text
- Quoting `$ref` values, because `#` would otherwise start a comment
- Flow maps and lists (`{type: string}`, `[books]`)
- Reusing parts with `components` and `$ref`

## Files

| File | Purpose |
|------|---------|
| `practice/openapi.yaml` | The API spec with blanks for you to fill |
| `solution/openapi.yaml` | The finished spec to compare with |

## Your tasks

1. Set the OpenAPI version `"3.0.3"` (quoted).
2. Add the local dev server URL.
3. Say where the `limit` parameter comes from (`query`).
4. Point the request body to the Book schema with a quoted `$ref`.
5. Add a `'400'` response that reuses `BadRequest`.
6. Mark the `id` path parameter as required.
7. Add a `'204'` response to `DELETE /books/{id}`.
8. Set the security scheme to `bearer`.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

## Bonus challenge

Paste your file into <https://editor.swagger.io> and add a `PUT /books/{id}` endpoint that updates a book.
