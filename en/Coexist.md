# Android: use AdGuard with a proxy client

## Why they conflict {#vpn}

Android lets only one app use the VPN at a time. AdGuard and proxy clients (Clash, sing-box, and so on) both want it, so starting one knocks the other off. Granting permission again doesn't help.

The fix is to let AdGuard own the VPN while the proxy client only opens a local port, and have AdGuard forward traffic to it:

```text
apps → AdGuard (filtering) → 127.0.0.1 local proxy → proxy outbound
```

This requires a proxy client that can run **without its VPN / TUN**. If yours can't, use AWAvenue Ads Rule directly inside the proxy client instead ([Mihomo](./Mihomo.md), [sing-box](./SingBox.md)) and skip AdGuard.

## 1. Make the proxy client open a local port only {#local-proxy}

Back up your working config. Then turn off the proxy client's VPN / TUN and note the port it listens on.

- **Mihomo / Clash clients**: disable VPN / TUN in the client (names vary, e.g. "proxy only"). The port is `mixed-port` or `socks-port` in the config; `port` is HTTP and can't be used as SOCKS5.
- **Official sing-box (SFA)**: remove the `tun` inbound and add a local SOCKS inbound. sing-box then runs as a foreground service without taking the VPN:

```json
{
  "type": "socks",
  "tag": "adguard-local",
  "listen": "127.0.0.1",
  "listen_port": 10808
}
```

Put it in the existing `inbounds` array and leave outbounds and routes as they are.

Listen on `127.0.0.1` only. Changing it to `0.0.0.0` opens your proxy to the whole LAN.

## 2. Connect AdGuard to the local proxy {#exclude}

1. In **App management**, find **the proxy client itself** and turn off **Route traffic through AdGuard**. Otherwise its outbound traffic loops back into AdGuard.
2. Under **Settings → Filtering → Network → Proxy → Proxy server**, add a proxy:

| Field | Value |
| --- | --- |
| Type | SOCKS5 |
| Host | `127.0.0.1` |
| Port | The port the proxy client actually listens on, e.g. `10808` |
| Authentication | Same username and password as the inbound, if set |

3. Select it and turn on the proxy switch.

Reference: [AdGuard outbound proxy](https://adguard.com/kb/adguard-for-android/solving-problems/outbound-proxy/).

## 3. Who handles DNS {#dns}

First add AWAvenue Ads Rule to DNS filters following the [AdGuard guide](./AdGuard.md#android-dns), use it alone for a while, and only then connect the proxy.

Leave the proxy's DNS settings as they are. Don't turn off `dns.enable` to "let AdGuard handle DNS" — the proxy core still needs to resolve server names.

## 4. Check and undo {#verify}

1. Open a few websites in the browser; they load.
2. The proxy client's connection log shows traffic leaving through your server.
3. AdGuard's **Recent activity** shows requests blocked by AWAvenue Ads Rule.
4. Lock the screen for a while, switch between Wi-Fi and mobile data, and check again. If the system asks, allow both apps to run in the background.

If you lose connection, **turn off the outbound proxy in AdGuard first**, then stop the proxy client. In the reverse order AdGuard keeps sending traffic to a port that no longer exists. If it still fails, restore the backup from step 1 and start over.
