# Tutorial overview

Pick your tool and profile in the [subscription builder](./Sub.md), copy the link, then follow the matching guide below.

## Guides by client

- [AdGuard](./AdGuard.md): in-app subscription on Android, plus where to add it on Windows, macOS, and iOS.
- [AdGuard Home](./AdGuardHome.md): DNS filtering on a router, NAS, or server. **AWAvenue Ads Rule** in the built-in catalog is this project, so you can simply tick it.
- [Android coexistence](./Coexist.md): run AdGuard and a proxy client at the same time.
- [Clash / Mihomo](./Mihomo.md): [YAML](./Mihomo.md#yaml), [MRS](./Mihomo.md#mrs), or [Classical](./Mihomo.md#classical) rule providers.
- [sing-box](./SingBox.md): remote rule sets for 1.14 and later.
- [Quantumult X](./QuantumultX.md): remote filter resource.
- [Shadowrocket](./ShadowRocket.md): module.
- [Loon](./Loon.md): plugin.
- [Surge / Surfboard](./Surge.md): RULE-SET, DOMAIN-SET, or module.
- [MosDNS v5](./MosDNS.md): `domain_set`.

Hosted AdGuard DNS is a different product from self-hosted AdGuard Home; add custom lists from its [dashboard](https://adguard-dns.io/kb/private-dns/setting-up-filtering/blocklists/).

## Other formats

The builder also offers these formats.

### hosts / AdAway {#hosts}

`AWAvenue-Ads-Rule-hosts*.txt` uses `IP domain` lines. Add it to [AdAway](https://github.com/AdAway/AdAway) or any tool that accepts hosts sources. hosts files have no wildcards, so only the listed subdomains are blocked.

### Dnsmasq {#dnsmasq}

`AWAvenue-Ads-Rule-Dnsmasq*.conf` contains `address=/domain/#` lines. Drop it into dnsmasq's `conf-dir` or include it with `conf-file=`, then restart dnsmasq. See the [Dnsmasq manual](https://thekelleys.org.uk/dnsmasq/docs/dnsmasq-man.html).

### SmartDNS {#smartdns}

`AWAvenue-Ads-Rule-SmartDNS*.conf` contains `address /domain/#` lines; include it with `conf-file`. It is a config fragment, not a plain domain list for `domain-set`. See the [SmartDNS configuration](https://pymumu.github.io/smartdns/config/).

### RouterOS AdList {#routeros-adlist}

`AWAvenue-Ads-Rule-RouterOS-Adlist*.txt` is for the DNS Adlist feature in RouterOS 7.15 and later: `/ip dns adlist add url=<link>`. See the [MikroTik DNS documentation](https://help.mikrotik.com/docs/spaces/ROS/pages/37748767/DNS).

### RouterOS Script {#routeros-script}

`AWAvenue-Ads-Rule-RouterOS*.txt` is a series of `ip dns static add` commands for older RouterOS without Adlist. Importing it twice creates duplicates, so remove the previous static entries before updating. Prefer Adlist when available.

### AdClose {#adclose}

`AWAvenue-Ads-Rule-AdClose*.rule` is the format for [AdClose](https://github.com/Xposed-Modules-Repo/com.close.hook.ads); import it inside the module.

### Geosite source text {#geosite}

`AWAvenue-Ads-Rule-Geosite*.txt` is source text for [domain-list-community](https://github.com/v2fly/domain-list-community) (bare domains and `full:`). Compile it into `geosite.dat` before Xray or V2Ray can load it.

### AdGuard Replenish {#adguard-replenish}

`AWAvenue-Ads-Rule-Replenish.txt` is an aggressive supplementary list for AdGuard, with a single version. It contains URL path rules, so add it as an AdGuard [custom filter](./AdGuard.md#android-custom); in AdGuard Home only its domain rules take effect.

## FAQ

### Why do some ads still show?

AWAvenue Ads Rule blocks by domain. When ads share a domain with the content, a domain rule can't separate them, and apps that use their own encrypted DNS bypass the filter. Check your tool's log to see whether the request went through it.

### Something legitimate is blocked. What now?

Disable AWAvenue Ads Rule temporarily and confirm the problem goes away. Then find the blocked domain in the log and allow only that one. Please [open an issue](https://github.com/TG-Twilight/AWAvenue-Ads-Rule/issues) with the domain and what broke, and we'll remove it after checking.

### No connection after adding a module?

Disable the module or config you changed most recently to get back online, then read the tool's log. For AdGuard plus a proxy on Android, see [coexistence](./Coexist.md).
