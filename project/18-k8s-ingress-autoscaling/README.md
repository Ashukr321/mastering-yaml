# 18 · Kubernetes Ingress & Autoscaling

**Level:** ⭐⭐⭐⭐ · **Type:** Full-stack · **Time:** ~60 min

## Scenario

The shop launches publicly next week at `shop.example.com`. Marketing expects a traffic spike, and nobody wants to be awake at 2 a.m. adding pods by hand. You will put the frontend and the API behind one HTTPS domain and let Kubernetes scale the API by itself.

## What you'll practice

- Multi-document YAML files (`---` between objects)
- An `Ingress` with `ingressClassName`, TLS, host rules and `pathType: Prefix`
- Annotations (always strings) for cert-manager and ingress-nginx
- A `HorizontalPodAutoscaler` (`autoscaling/v2`) with CPU and memory metrics
- `behavior.scaleDown` stabilization so the pod count doesn't flap

## Files

| File | Purpose |
| --- | --- |
| `practice/k8s/ingress-hpa.yaml` | Ingress + HPA in one file, with blanks |
| `solution/k8s/ingress-hpa.yaml` | The finished file |

## Your tasks

**`k8s/ingress-hpa.yaml`** (Ingress)

1. Set the cert-manager ClusterIssuer to `letsencrypt-prod`.
2. Turn on the SSL redirect with the string `"true"`.
3. Use the `nginx` Ingress class.
4. Name the TLS Secret `shop-example-com-tls`.
5. Add the `/` path that routes to `shop-frontend` on port 80.
6. Use `pathType: Prefix` for `/api`.

**`k8s/ingress-hpa.yaml`** (HorizontalPodAutoscaler)

7. Use the `autoscaling/v2` API.
8. Scale the `shop-api` Deployment.
9. Cap it at `10` replicas.
10. Add the CPU metric (70% average utilization).
11. Wait `300` seconds before scaling down.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

To check the file against the Kubernetes schema, run `kubectl apply --dry-run=client -f practice/k8s/ingress-hpa.yaml`.

## Bonus challenge

Add a third document: an HPA for `shop-frontend` that scales on CPU only, between 3 and 6 replicas.
