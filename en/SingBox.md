# sing-box guide

The syntax below is for sing-box **1.14** and later. GUI clients: check the bundled core version first.

## Get the rule link

Choose sing-box and a profile in the [subscription builder](./Sub.html?tool=singbox) and copy the `.json` link. It's a source-format rule set, not a full config.

## Merge into your config

The example uses the full-profile link; swap in yours. Merge each part into the matching place in your config without overwriting your existing DNS, inbounds, or outbounds.

```json
{
  "http_clients": [
    {
      "tag": "awa-download",
      "domain_resolver": "awa-bootstrap"
    }
  ],
  "dns": {
    "servers": [
      {
        "type": "local",
        "tag": "awa-bootstrap"
      }
    ],
    "rules": [
      {
        "rule_set": "awa-ads",
        "action": "reject",
        "no_drop": true
      }
    ]
  },
  "route": {
    "rule_set": [
      {
        "type": "remote",
        "tag": "awa-ads",
        "format": "source",
        "url": "https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Singbox.json",
        "http_client": "awa-download",
        "update_interval": "1d"
      }
    ]
  }
}
```

- Put this DNS reject rule above broader DNS rules.
- `awa-bootstrap` resolves the download URL with system DNS, so sing-box doesn't depend on itself before it has started.
- To block at the connection level too, add `{"rule_set":"awa-ads","action":"reject"}` to `route.rules`.
- If you switch to an `.srs` link, change `format` to `binary`.

## Check and verify

1. Run `sing-box check -c config.json` on the merged config.
2. After starting, check the log for a successful rule set download. If you already have `experimental.cache_file`, set `enabled` so the rule set is cached locally and not re-downloaded on every start.
3. A DNS query for a domain from the list should return **REFUSED**; normal domains resolve as usual.

References: [DNS rule actions](https://sing-box.sagernet.org/configuration/dns/rule_action/), [rule sets](https://sing-box.sagernet.org/configuration/rule-set/), [HTTP clients](https://sing-box.sagernet.org/configuration/shared/http-client/), [1.14 migration](https://sing-box.sagernet.org/deprecated/#legacy-dns-server-formats).

## Undo

Remove this reject rule from `dns.rules` (and the one you added to `route.rules`). Before also removing `awa-ads` from `route.rule_set`, make sure nothing else references it.
