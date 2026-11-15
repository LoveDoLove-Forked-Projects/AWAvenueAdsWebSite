# AdGuard: choose the product and import the list

## Which AdGuard do you use? {#choose-product}

| Product | Where to add AWAvenue Ads Rule |
| --- | --- |
| AdGuard for Android | DNS filters or custom filters on this page — pick one |
| AdGuard Home (router, NAS, server) | [AdGuard Home guide](./AdGuardHome.md) |
| AdGuard for Windows / Mac / iOS | [Other platforms](#other-platforms) at the end of this page |
| Public AdGuard DNS | Only its own filtering; you can't add AWAvenue Ads Rule |

Private AdGuard DNS lets you add custom blocklists in its dashboard, limited by plan. See the [official docs](https://adguard-dns.io/kb/private-dns/setting-up-filtering/blocklists/).

## Get the subscription link {#subscription}

Open the [subscription builder](./Sub.md), choose AdGuard and a profile, and copy the **official source (GitHub Raw)** link. Use a fallback source only if GitHub is unreachable.

## Android: DNS filters {#android-dns}

The recommended entry. HTTPS filtering isn't needed.

1. Turn on AdGuard protection and grant the VPN permission. If you also run a proxy app, read the [coexistence guide](./Coexist.md) first.
2. Go to **Protection → DNS protection** and turn it on.
3. Open **DNS filters**, add a custom filter, paste the link, then save and enable it.

The link belongs in DNS filters, not in the DNS server field.

## Android: custom filters {#android-custom}

If you already use AdGuard content filtering, you can add it here instead: **Settings → Filtering → Filters → Custom filters**, add the same link and enable it.

One entry is enough. Adding the same list in both places blocks nothing extra.

**AdGuard Replenish** in the builder is a separate, more aggressive list with URL path rules. It only works as a custom filter, alongside your main subscription.

## Check that it works {#verify}

1. The filter list shows AWAvenue Ads Rule enabled with a non-zero rule count.
2. Open **Statistics → Recent activity** and use a few apps. Blocked requests appear; tap one to see that AWAvenue Ads Rule matched.
3. Turn on automatic updates under **General → App and filter updates**.

## False positives and removal {#rollback}

If something breaks, disable only AWAvenue Ads Rule and retry the same action. Once confirmed, open that request in **Recent activity** and add it to the allowlist, unblocking just that domain.

To remove it entirely, delete the subscription.

## Windows, macOS, and iOS {#other-platforms}

Add the same link to the product's DNS filters:

- **Windows**: Settings → DNS protection → DNS filters. See the [official docs](https://adguard.com/kb/adguard-for-windows/protection/dns-protection/).
- **macOS**: Settings → DNS → Filters. See the [official docs](https://adguard.com/kb/adguard-for-mac/features/dns/). Don't add it to the Safari extension filters.
- **iOS / iPadOS**: DNS protection → DNS filtering → DNS filters. See the [official docs](https://adguard.com/kb/adguard-for-ios/features/dns-protection/). Don't add it under Safari protection; that's web content blocking.

Original draft: [天命](https://t.me/tmbyml).
