# 使用教程总览

先在[订阅生成器](./Sub.md)选好工具和方案，复制链接，再按下面对应的教程导入。

## 按客户端选择

- [AdGuard](./AdGuard.md)：Android 应用内订阅，以及 Windows / macOS / iOS 的入口。
- [AdGuard Home](./AdGuardHome.md)：路由器、NAS 或服务器上的 DNS 过滤。内置列表里的 **AWAvenue Ads Rule** 就是秋风广告规则，可以直接勾选。
- [Android 共存](./Coexist.md)：AdGuard 和代理客户端同时使用。
- [Clash / Mihomo](./Mihomo.md)：[YAML](./Mihomo.md#yaml)、[MRS](./Mihomo.md#mrs)、[Classical](./Mihomo.md#classical) 三种规则集。
- [sing-box](./SingBox.md)：1.14 起的远程规则集写法。
- [Quantumult X](./QuantumultX.md)：远程分流资源。
- [Shadowrocket](./ShadowRocket.md)：模块。
- [Loon](./Loon.md)：插件。
- [Surge / Surfboard](./Surge.md)：RULE-SET、DOMAIN-SET 或模块。
- [MosDNS v5](./MosDNS.md)：`domain_set`。

托管版 AdGuard DNS 和自建的 AdGuard Home 是两回事，前者在[官方面板](https://adguard-dns.io/kb/private-dns/setting-up-filtering/blocklists/)里添加自定义列表。

## 其他格式

生成器里还有下面这些格式，用法简单说明如下。

### hosts / AdAway {#hosts}

`AWAvenue-Ads-Rule-hosts*.txt`，`IP 域名` 格式，填进 [AdAway](https://github.com/AdAway/AdAway) 等支持 hosts 源的工具。hosts 没有通配，子域名只会拦列表里写到的那些。

### Dnsmasq {#dnsmasq}

`AWAvenue-Ads-Rule-Dnsmasq*.conf`，内容是 `address=/域名/#`。放进 dnsmasq 的 `conf-dir` 或用 `conf-file=` 引入，重启 dnsmasq 即可。参阅 [Dnsmasq 手册](https://thekelleys.org.uk/dnsmasq/docs/dnsmasq-man.html)。

### SmartDNS {#smartdns}

`AWAvenue-Ads-Rule-SmartDNS*.conf`，内容是 `address /域名/#`，用 `conf-file` 引入。它是配置片段，不能当 `domain-set` 的纯域名列表用。参阅 [SmartDNS 配置说明](https://pymumu.github.io/smartdns/config/)。

### RouterOS AdList {#routeros-adlist}

`AWAvenue-Ads-Rule-RouterOS-Adlist*.txt`，给 RouterOS 7.15 起的 DNS Adlist 功能用：`/ip dns adlist add url=链接`。参阅 [MikroTik DNS 文档](https://help.mikrotik.com/docs/spaces/ROS/pages/37748767/DNS)。

### RouterOS Script {#routeros-script}

`AWAvenue-Ads-Rule-RouterOS*.txt`，是一串 `ip dns static add` 命令，适合不支持 Adlist 的旧版 RouterOS。重复导入会产生重复条目，更新前先删掉上次加的静态项。能用 Adlist 就用 Adlist。

### AdClose {#adclose}

`AWAvenue-Ads-Rule-AdClose*.rule`，[AdClose](https://github.com/Xposed-Modules-Repo/com.close.hook.ads) 专用格式，在模块里导入。

### Geosite 源文本 {#geosite}

`AWAvenue-Ads-Rule-Geosite*.txt`，是 [domain-list-community](https://github.com/v2fly/domain-list-community) 的源文本格式（裸域名与 `full:`），需要自己编译成 `geosite.dat` 才能被 Xray / V2Ray 加载。

### AdGuard Replenish 补充规则 {#adguard-replenish}

`AWAvenue-Ads-Rule-Replenish.txt` 是给 AdGuard 用的激进补充列表，只有一个版本。它含有 URL 路径规则，要放进 AdGuard 的[自定义过滤器](./AdGuard.md#android-custom)；放进 AdGuard Home 只有域名部分会生效。

## 常见问题

### 为什么有些广告还在？

秋风广告规则按域名拦截。广告和正文用同一个域名时，域名规则拿它没办法；App 自带加密 DNS 绕过过滤时也拦不到。看一下工具的日志，确认请求有没有经过它。

### 正常功能被误拦了怎么办？

先临时停用秋风广告规则，确认问题消失，再从日志里找到被拦的域名，只放行这一个。然后[提交 issue](https://github.com/TG-Twilight/AWAvenue-Ads-Rule/issues)，附上域名和出问题的操作，我们会核实后移除。

### 用模块后断网了？

先停用最近改动的模块或配置，恢复到能上网的状态，再看对应工具的日志。Android 上 AdGuard 和代理一起用的情况见[共存说明](./Coexist.md)。
