# 🛠️ YAML Practice Projects

21 hands-on projects based on real-world frontend, backend and DevOps work. They start with simple config files and end with a full CI/CD pipeline.

## How each project works

```text
NN-project-name/
├── README.md     ← the scenario and your task list
├── practice/     ← YAML with blanks (___) and TODO(n) comments to complete
└── solution/     ← the same files, answered (DONE(n))
```

1. Read the project's `README.md`.
2. Open the file(s) in `practice/`. Every line has a comment explaining what it does.
3. Replace every `___` and complete every `TODO(n)`.
4. Check your work:

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

> 💡 Try each project on your own before you open `solution/`.

## Projects

### ⭐ Level 1: Beginner (config & data files)

| # | Project | Type | You'll write |
|:-:|---------|------|--------------|
| 01 | [Portfolio site config](01-portfolio-site-config) | Frontend | `_config.yml` |
| 02 | [Todo API config](02-todo-api-config) | Backend | `config/default.yaml` |
| 03 | [i18n translations](03-i18n-translations) | Frontend | `locales/en.yaml`, `locales/hi.yaml` |
| 04 | [Restaurant menu data](04-restaurant-menu-data) | Frontend | `data/menu.yaml` |
| 05 | [Feature flags](05-feature-flags) | Backend | `config/feature-flags.yaml` |

### ⭐⭐ Level 2: Intermediate (tooling, specs, Compose)

| # | Project | Type | You'll write |
|:-:|---------|------|--------------|
| 06 | [Multi-env config with anchors](06-multi-env-config-anchors) | Backend | `config/app.yaml` |
| 07 | [Frontend lint config](07-frontend-lint-config) | Frontend | `.eslintrc.yml`, `.prettierrc.yml` |
| 08 | [REST API OpenAPI spec](08-rest-api-openapi-spec) | Backend | `openapi.yaml` |
| 09 | [Dependabot updates](09-dependabot-updates) | Full-stack | `.github/dependabot.yml` |
| 10 | [Docker Compose: MERN stack](10-docker-compose-mern) | Full-stack | `docker-compose.yml` |

### ⭐⭐⭐ Level 3: CI/CD & Containers

| # | Project | Type | You'll write |
|:-:|---------|------|--------------|
| 11 | [React CI with GitHub Actions](11-react-ci-github-actions) | Frontend | `.github/workflows/ci.yml` |
| 12 | [Node API CI with Postgres](12-node-api-ci-with-postgres) | Backend | `.github/workflows/ci.yml` |
| 13 | [Docker build & push to GHCR](13-docker-build-push-ghcr) | Backend | `.github/workflows/docker-publish.yml` |
| 14 | [GitLab CI for a full-stack app](14-gitlab-ci-fullstack) | Full-stack | `.gitlab-ci.yml` |
| 15 | [Production Docker Compose](15-docker-compose-production) | Full-stack | `docker-compose.prod.yml` |

### ⭐⭐⭐⭐ Level 4: Kubernetes & Advanced

| # | Project | Type | You'll write |
|:-:|---------|------|--------------|
| 16 | [K8s frontend deployment](16-k8s-frontend-deployment) | Frontend | `k8s/deployment.yaml`, `k8s/service.yaml` |
| 17 | [K8s backend config & secrets](17-k8s-backend-config-secrets) | Backend | `k8s/namespace.yaml`, `configmap.yaml`, `secret.yaml`, `deployment.yaml` |
| 18 | [K8s ingress & autoscaling](18-k8s-ingress-autoscaling) | Full-stack | `k8s/ingress-hpa.yaml` |
| 19 | [Helm chart values](19-helm-chart-values) | DevOps | `Chart.yaml`, `values.yaml` |
| 20 | [Ansible server setup](20-ansible-server-setup) | DevOps | `ansible/inventory.yaml`, `ansible/playbook.yaml` |

### ⭐⭐⭐⭐⭐ Capstone

| # | Project | Type | You'll write |
|:-:|---------|------|--------------|
| 21 | [Full CI/CD pipeline](21-capstone-full-pipeline) | Full-stack | `.github/workflows/pipeline.yml`, `docker-compose.yml` |

## Notes

- `.github/` folders inside these projects are examples only. GitHub only runs workflows from the repo's root `.github/workflows/`.
- Secrets in these files are fake placeholders. Never commit real passwords, tokens or keys.
