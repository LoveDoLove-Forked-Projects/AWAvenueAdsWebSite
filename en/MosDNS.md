# MosDNS v5 guide

This is the YAML syntax for upstream MosDNS v5. Router plugin builds usually generate their own config; use the plugin's custom rule entry so updates don't overwrite your changes.

## Download the domain list

Choose **MosDNS v5** and a profile in the [subscription builder](./Sub.html?tool=mosdns) and copy the `.txt` link. Download it in your MosDNS config directory (the example uses the full-profile link):

```sh
mkdir -p rules
curl -fL --retry 2 'https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Mosdns_v5.txt' -o rules/awa-ads.txt.new && mv rules/awa-ads.txt.new rules/awa-ads.txt
```

Downloading to `.new` first keeps the old file if the download fails.

## Add it to the config

Below is a minimal `config.yaml` that runs as-is, listening on `127.0.0.1:5353`. With an existing config, just merge `awa_domains` and the `matches` / `exec` step. Replace the upstream with your own DNS.

```yaml
log:
  level: info
plugins:
  - tag: awa_domains
    type: domain_set
    args:
      files:
        - ./rules/awa-ads.txt
  - tag: upstream
    type: forward
    args:
      upstreams:
        - addr: 223.5.5.5
  - tag: main
    type: sequence
    args:
      - matches: qname $awa_domains
        exec: reject 3
      - exec: $upstream
  - tag: udp_listener
    type: udp_server
    args:
      entry: main
      listen: 127.0.0.1:5353
  - tag: tcp_listener
    type: tcp_server
    args:
      entry: main
      listen: 127.0.0.1:5353
```

- Define `domain_set` before the `sequence` that references it.
- Put the blocking step **before** cache and upstream forwarding.
- `reject 3` returns NXDOMAIN.

## Start and verify

```sh
mosdns start -c config.yaml
dig @127.0.0.1 -p 5353 ad.doubleclick.net A
dig @127.0.0.1 -p 5353 example.com A
```

The first should return **NXDOMAIN**; the second resolves normally.

## Scheduled updates

MosDNS reads the list only at startup, so restart it (or reload however your deployment does) after downloading a new file. A scheduled job can do download → rename → restart.

References: [v5 data plugins](https://irine-sistiana.gitbook.io/mosdns-wiki/mosdns-v5/ru-he-pei-zhi-mosdns/shu-ju-cha-jian), [sequence and reject](https://irine-sistiana.gitbook.io/mosdns-wiki/mosdns-v5/ru-he-pei-zhi-mosdns/sequence-cha-jian).

## Undo

Remove the `matches: qname $awa_domains` / `exec: reject 3` step from the sequence and restart.
