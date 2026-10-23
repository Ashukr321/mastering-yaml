# 10 · Docker Compose for a MERN App

**Level:** ⭐⭐ · **Type:** Full-stack · **Time:** ~30 min

## Scenario

A small e-commerce team builds its shop with MongoDB, Express, React and Node (MERN). New developers used to
spend a whole day installing MongoDB and wiring up ports. Now one `docker-compose.yml` starts the frontend, the
API, the database and the mongo-express admin UI with a single `docker compose up`.

## What you'll practice

- Maps of services, each with nested `build`, `environment` and `healthcheck` maps
- Quoting port mappings (`"5173:5173"`) so YAML keeps them as text
- Short (`- api`) and long (`mongo: {condition: ...}`) forms of `depends_on`
- Named volumes vs bind mounts
- Networks, restart policies, `env_file` and `${VAR:-default}` values
- Why modern Compose files no longer start with `version:`

## Files

| File | Purpose |
|------|---------|
| `practice/docker-compose.yml` | The Compose file with blanks for you to fill |
| `solution/docker-compose.yml` | The finished Compose file to compare with |

## Your tasks

1. Set the frontend build context to `./frontend`.
2. Publish the frontend port `"5173:5173"`.
3. Add `env_file` to the API as a list.
4. Make the API wait until mongo is `service_healthy`.
5. Mount the named volume `mongo-data` at `/data/db`.
6. Give mongo the `always` restart policy.
7. Publish the mongo-express port `"8081:8081"`.
8. Declare the `mongo-data` volume at the top level.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

## Bonus challenge

Add a `redis:7` service on the `db` network and make the API wait for it with `depends_on`.
