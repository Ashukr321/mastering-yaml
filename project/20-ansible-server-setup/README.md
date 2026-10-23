# 20 · Ansible Server Setup

**Level:** ⭐⭐⭐⭐ · **Type:** DevOps · **Time:** ~60 min

## Scenario

A small shop runs its Node.js app on two Ubuntu VMs plus a database VM. Every new server is set up by hand from a wiki page, and no two are quite the same. You will write an Ansible inventory and playbook so a fresh VM becomes a ready app server with one command, and running it again changes nothing.

## What you'll practice

- A YAML inventory: `all`, `children`, groups, hosts, host vars and group vars
- A play with `hosts`, `become: true` and `vars`
- Fully-qualified module names (`ansible.builtin.apt`, `community.general.ufw`, ...)
- Quoting every Jinja value: `"{{ app_dir }}"`
- `loop:`, `when:` conditions, and `notify:` + `handlers`
- Why file modes must be quoted (`"0600"`)

## Files

| File | Purpose |
| --- | --- |
| `practice/ansible/inventory.yaml` | The server list with blanks |
| `practice/ansible/playbook.yaml` | The setup playbook with blanks |
| `solution/ansible/inventory.yaml` | The finished inventory |
| `solution/ansible/playbook.yaml` | The finished playbook |

## Your tasks

**`ansible/inventory.yaml`**

1. Log in as `deploy`.
2. Add the `db` group with `db1.shop.example.com` and `postgres_version: "16"`.
3. Give `web2` the IP `10.0.1.12`.
4. Set `app_port` to `3000`.

**`ansible/playbook.yaml`**

1. Run the play on the `web` group.
2. Turn on `become`.
3. Name the user with the quoted Jinja value `"{{ app_user }}"`.
4. Set the `.env` file mode to `"0600"`.
5. Notify the `Restart shop` handler.
6. Only touch the firewall when `enable_firewall | bool` is true.
7. Add the `Reload systemd` handler.

## Check your work

```bash
yamllint --strict practice/
```

```bash
diff -r practice solution
```

To check with Ansible itself (install the collection first with `ansible-galaxy collection install community.general`):

```bash
ansible-playbook -i solution/ansible/inventory.yaml solution/ansible/playbook.yaml --syntax-check
```

## Bonus challenge

Add a second play for the `db` group that installs `postgresql-{{ postgres_version }}` with `ansible.builtin.apt`.
