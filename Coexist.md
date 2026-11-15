# Android：AdGuard 与代理客户端共存

## 为什么会冲突 {#vpn}

Android 同一时间只允许一个 App 使用 VPN。AdGuard 和代理客户端（Clash、sing-box 等）都想占 VPN，开一个另一个就掉线，反复授权也没用。

解决办法是让 AdGuard 占 VPN，代理客户端只在本机开一个代理端口，AdGuard 再把流量转过去：

```text
应用 → AdGuard（过滤） → 127.0.0.1 本机代理 → 代理出口
```

前提是你的代理客户端能**不开 VPN / TUN 单独运行**。不支持的话，换个思路：直接在代理客户端里用秋风广告规则（[Mihomo](./Mihomo.md)、[sing-box](./SingBox.md)），不用 AdGuard。

## 1. 让代理客户端只开本机端口 {#local-proxy}

先备份能用的配置。然后关掉代理客户端的 VPN / TUN，记下它监听的端口。

- **Mihomo / Clash 系**：在客户端里关闭 VPN / TUN（不同客户端叫法不同，比如「仅代理」）。端口看配置里的 `mixed-port` 或 `socks-port`；`port` 是 HTTP 端口，不能当 SOCKS5 用。
- **官方 sing-box（SFA）**：去掉 `tun` 入站，加一个本机 SOCKS 入站，sing-box 就会以前台服务运行而不占 VPN：

```json
{
  "type": "socks",
  "tag": "adguard-local",
  "listen": "127.0.0.1",
  "listen_port": 10808
}
```

把它放进现有配置的 `inbounds` 数组，出站和路由保持不变。

端口只监听 `127.0.0.1`，不要为了省事改成 `0.0.0.0`，那等于把代理开放给整个局域网。

## 2. 在 AdGuard 里接上本机代理 {#exclude}

1. 「应用管理」里找到**代理客户端本身**，关闭「通过 AdGuard 路由流量」。不关的话，代理出去的流量又会绕回 AdGuard，形成死循环。
2. 「设置 → 过滤 → 网络 → 代理 → 代理服务器」添加一个代理：

| 字段 | 填写 |
| --- | --- |
| 类型 | SOCKS5 |
| 主机 | `127.0.0.1` |
| 端口 | 代理客户端实际监听的端口，例如 `10808` |
| 认证 | 入站设了账号密码就填一样的 |

3. 选中这个代理，打开代理总开关。

参考：[AdGuard 出站代理设置](https://adguard.com/kb/adguard-for-android/solving-problems/outbound-proxy/)。

## 3. DNS 交给谁 {#dns}

先按 [AdGuard 教程](./AdGuard.md#android-dns)把秋风广告规则加进 DNS 过滤器，单独用一段时间确认没问题，再接代理。

代理配置里的 DNS 设置保持原样，不要为了「让 AdGuard 管 DNS」就把 `dns.enable` 关掉——代理内核自己也要解析节点域名。

## 4. 检查与撤回 {#verify}

1. 浏览器打开几个网站，正常。
2. 代理客户端的连接记录里能看到流量，出口是你的节点。
3. AdGuard「最近活动」里能看到被秋风广告规则拦截的请求。
4. 锁屏一会、切换一下 Wi-Fi 和移动数据，再看一遍。系统要求的话，给两个 App 都开后台运行权限。

断网时，**先在 AdGuard 里关掉出站代理**，再停代理客户端；顺序反了 AdGuard 会一直往一个已经没了的端口发流量。还不行就恢复第 1 步备份的配置，从头再来。
