# AdGuard：先选产品，再导入规则

## 你用的是哪一种 AdGuard？ {#choose-product}

| 产品 | 在哪里添加秋风广告规则 |
| --- | --- |
| AdGuard for Android | 本页的 DNS 过滤器，或自定义过滤器，二选一 |
| AdGuard Home（路由器、NAS、服务器） | [AdGuard Home 教程](./AdGuardHome.md) |
| AdGuard for Windows / Mac / iOS | 本页末尾的[其他平台](#other-platforms) |
| 公共 AdGuard DNS | 只能用它自带的过滤，加不了秋风广告规则 |

个人版 AdGuard DNS 可以在面板里添加自定义列表，数量受套餐限制，见[官方说明](https://adguard-dns.io/kb/private-dns/setting-up-filtering/blocklists/)。

## 准备订阅链接 {#subscription}

打开[订阅生成器](./Sub.md)，选 AdGuard 和想要的方案，复制**官方源（GitHub Raw）**链接。连不上 GitHub 时再换备用来源。

## Android：DNS 过滤器 {#android-dns}

推荐用这个入口，不需要开 HTTPS 过滤。

1. 打开 AdGuard 保护，按提示授权 VPN。手机上另有代理 App 的话，先看[共存教程](./Coexist.md)。
2. 进入「防护 → DNS 保护」，打开 DNS 保护。
3. 进入「DNS 过滤器」，添加自定义过滤器，粘贴刚才的链接，保存并启用。

订阅链接要填在 DNS 过滤器里，不是 DNS 服务器地址栏。

## Android：自定义过滤器 {#android-custom}

如果你已经在用 AdGuard 的内容过滤，也可以放在这里：「设置 → 过滤 → 过滤器 → 自定义过滤器」，添加同一条链接并启用。

两个入口选一个就够了，同一份列表放两处不会多拦什么。

生成器里的 **AdGuard 补充规则（Replenish）** 是另一份更激进的列表，含 URL 路径规则，只能放在自定义过滤器里，和上面的订阅一起用。

## 确认生效 {#verify}

1. 在过滤器列表里看到秋风广告规则已启用，规则数不为零。
2. 打开「统计 → 最近活动」，随便打开几个 App，能看到被拦截的请求，点开详情会显示命中的是秋风广告规则。
3. 「常规 → 应用和过滤器更新」里打开自动更新。

## 误拦截与撤回 {#rollback}

功能异常时，先只停用秋风广告规则，重试同一个操作。确认是它拦的，在「最近活动」里点开那条请求，直接添加到允许列表，只放行那一个域名。

要彻底撤回，删掉这条订阅即可。

## Windows、macOS 与 iOS {#other-platforms}

找到对应产品的 DNS 过滤器，添加同一条链接：

- **Windows**：设置 → DNS 保护 → DNS 过滤器，见[官方说明](https://adguard.com/kb/adguard-for-windows/protection/dns-protection/)。
- **macOS**：设置 → DNS → 过滤器，见[官方说明](https://adguard.com/kb/adguard-for-mac/features/dns/)。注意别加到 Safari 扩展那边。
- **iOS / iPadOS**：DNS 保护 → DNS 过滤 → DNS 过滤器，见[官方说明](https://adguard.com/kb/adguard-for-ios/features/dns-protection/)。别加到「Safari 保护」那边，那是网页内容拦截。

历史原稿：[天命](https://t.me/tmbyml)。
