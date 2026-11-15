# Clash / Mihomo guide

For clients running the Mihomo core. Older Clash cores don't support MRS; use YAML there.

## Choose a format

Pick a format and profile in the [subscription builder](./Sub.html?tool=clash) and copy the link. Any one of the three works:

| Builder format | behavior | format | Guide |
| --- | --- | --- | --- |
| [Clash / Mihomo YAML](./Sub.html?tool=clash) | `domain` | `yaml` | [Domain YAML](#yaml) |
| [Clash / Mihomo MRS](./Sub.html?tool=clashMrs) | `domain` | `mrs` | [MRS](#mrs) |
| [Clash / Mihomo Classical](./Sub.html?tool=clashClassical) | `classical` | `yaml` | [Classical YAML](#classical) |

- **Classical** adds a few `DOMAIN-KEYWORD` rules and has the widest coverage. Pick it if unsure.
- **MRS** is the smallest and loads fastest, but only the Mihomo core can read it.

These are rule providers, not proxy subscriptions, so don't import them as subscriptions. The examples use the full-profile link; swap in the one you copied and keep `behavior` / `format` matched to the format.

## Domain YAML {#yaml}

```yaml
rule-providers:
  awa_ads:
    type: http
    behavior: domain
    format: yaml
    path: ./rule_providers/AWAvenue-Ads-Rule-Clash.yaml
    url: "https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Clash.yaml"
    interval: 86400
rules:
  - RULE-SET,awa_ads,REJECT
```

## MRS binary rule set {#mrs}

MRS is a binary file; it looks like gibberish in a browser, which is normal.

```yaml
rule-providers:
  awa_ads:
    type: http
    behavior: domain
    format: mrs
    path: ./rule_providers/AWAvenue-Ads-Rule-Clash.mrs
    url: "https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Clash.mrs"
    interval: 86400
rules:
  - RULE-SET,awa_ads,REJECT
```

## Classical YAML {#classical}

```yaml
rule-providers:
  awa_ads:
    type: http
    behavior: classical
    format: yaml
    path: ./rule_providers/AWAvenue-Ads-Rule-Clash-Classical.yaml
    url: "https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Clash-Classical.yaml"
    interval: 86400
rules:
  - RULE-SET,awa_ads,REJECT
```

## Merge into your config

1. Back up your working config.
2. Add the snippet through your client's override, merge, or extension feature. Editing the downloaded subscription file directly gets overwritten on the next update.
3. Merge `awa_ads` into the existing `rule-providers` and `RULE-SET,awa_ads,REJECT` into the existing `rules`, **above `MATCH` and any broad `DIRECT` rules**. Don't add a second `rules:` key; it would replace your existing rules.
4. Use Rule mode, save, and reload.

With a command-line core you can test the merged config first:

```sh
mihomo -t -d ./mihomo-check -f ./merged.yaml
```

## Check that it works

Find `awa_ads` in the client's or dashboard's rule provider list; a non-zero entry count means the download worked. Connection logs then show requests matched by `awa_ads` and rejected.

If nothing matches, check that you're in Rule mode, that the snippet was actually merged, and that the `RULE-SET` line isn't below a rule that matches first.

## Update and undo

`interval: 86400` updates once a day; you can also update `awa_ads` manually in the dashboard. Updating your proxy subscription doesn't update rule providers.

For a false positive, find the domain in the connection log and add an allow rule above the `RULE-SET` line, e.g. `DOMAIN,needed.example,DIRECT`. To disable entirely, remove the `RULE-SET,awa_ads,REJECT` line and reload.

References: [rule-providers](https://wiki.metacubex.one/config/rule-providers/), [rules and matching order](https://wiki.metacubex.one/config/rules/).
