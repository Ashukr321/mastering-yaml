# 15 · Production Docker Compose Stack

**Level:** ⭐⭐⭐ · **Type:** Full-stack · **Time:** ~45 min

## Scenario

A small online shop runs everything on one virtual machine: nginx in front, a Node API, PostgreSQL and Redis. After a reboot the API started before the database and crashed, and a runaway log filled the disk. You will write a production Compose file that starts services in the right order, limits resources, rotates logs and keeps the database password out of the file.

## What you'll practice

- Extension fields (`x-common`) with YAML anchors (`&common`) and merge keys (`<<: *common`)
- `healthcheck:` and `depends_on:` with `condition: service_healthy`
- `deploy.resources.limits` for CPU and memory
- File-based `secrets:` and `*_FILE` environment variables
- Public vs `internal: true` networks, and named volumes
- Flow sequences like `["CMD", "redis-cli", "ping"]`

## Files

| File | Purpose |
| --- | --- |
| `practice/docker-compose.prod.yml` | The Compose file with blanks for you to fill |
| `solution/docker-compose.prod.yml` | The finished Compose file |

## Your tasks

1. Set the restart policy to `unless-stopped`.
2. Rotate logs at `"10m"`.
3. Use the `nginx:1.27-alpine` image.
4. Publish port `"443:443"`.
5. Wait for the API with `service_healthy`.
6. Build the API from `./api`.
7. Limit the API to `512M` of memory.
8. Add a `pg_isready` healthcheck to the database.
9. Make the `internal` network private.
10. Point the secret at `./secrets/db_password.txt`.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

To check the Compose schema too, run `docker compose -f solution/docker-compose.prod.yml config -q`
(no output means it is valid).

## Bonus challenge

Add a `backup` service that runs `pg_dump` against `db` every night and writes to a named volume.
