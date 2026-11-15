# 使用教學總覽

先在[訂閱產生器](./Sub.md)選好工具和方案，複製連結，再依照下面對應的教學匯入。

## 依用戶端選擇

- [AdGuard](./AdGuard.md)：Android 應用程式內訂閱，以及 Windows / macOS / iOS 的入口。
- [AdGuard Home](./AdGuardHome.md)：路由器、NAS 或伺服器上的 DNS 過濾。內建清單裡的 **AWAvenue Ads Rule** 就是秋風廣告規則，可以直接勾選。
- [Android 共存](./Coexist.md)：AdGuard 和代理用戶端同時使用。
- [Clash / Mihomo](./Mihomo.md)：[YAML](./Mihomo.md#yaml)、[MRS](./Mihomo.md#mrs)、[Classical](./Mihomo.md#classical) 三種規則集。
- [sing-box](./SingBox.md)：1.14 起的遠端規則集寫法。
- [Quantumult X](./QuantumultX.md)：遠端分流資源。
- [Shadowrocket](./ShadowRocket.md)：模組。
- [Loon](./Loon.md)：外掛。
- [Surge / Surfboard](./Surge.md)：RULE-SET、DOMAIN-SET 或模組。
- [MosDNS v5](./MosDNS.md)：`domain_set`。

託管版 AdGuard DNS 和自架的 AdGuard Home 是兩回事，前者在[官方面板](https://adguard-dns.io/kb/private-dns/setting-up-filtering/blocklists/)中新增自訂清單。

## 其他格式

產生器裡還有以下格式，用法簡單說明如下。

### hosts / AdAway {#hosts}

`AWAvenue-Ads-Rule-hosts*.txt`，`IP 網域` 格式，填入 [AdAway](https://github.com/AdAway/AdAway) 等支援 hosts 來源的工具。hosts 沒有萬用字元，子網域只會攔截清單裡寫到的那些。

### Dnsmasq {#dnsmasq}

`AWAvenue-Ads-Rule-Dnsmasq*.conf`，內容是 `address=/網域/#`。放進 dnsmasq 的 `conf-dir`，或用 `conf-file=` 引入，重新啟動 dnsmasq 即可。參閱 [Dnsmasq 手冊](https://thekelleys.org.uk/dnsmasq/docs/dnsmasq-man.html)。

### SmartDNS {#smartdns}

`AWAvenue-Ads-Rule-SmartDNS*.conf`，內容是 `address /網域/#`，用 `conf-file` 引入。它是設定片段，不能當成 `domain-set` 的純網域清單。參閱 [SmartDNS 設定說明](https://pymumu.github.io/smartdns/config/)。

### RouterOS AdList {#routeros-adlist}

`AWAvenue-Ads-Rule-RouterOS-Adlist*.txt`，供 RouterOS 7.15 起的 DNS Adlist 功能使用：`/ip dns adlist add url=連結`。參閱 [MikroTik DNS 文件](https://help.mikrotik.com/docs/spaces/ROS/pages/37748767/DNS)。

### RouterOS Script {#routeros-script}

`AWAvenue-Ads-Rule-RouterOS*.txt`，是一連串 `ip dns static add` 指令，適合不支援 Adlist 的舊版 RouterOS。重複匯入會產生重複項目，更新前先刪除上次新增的靜態項目。能用 Adlist 就用 Adlist。

### AdClose {#adclose}

`AWAvenue-Ads-Rule-AdClose*.rule`，[AdClose](https://github.com/Xposed-Modules-Repo/com.close.hook.ads) 專用格式，在模組內匯入。

### Geosite 原始文字 {#geosite}

`AWAvenue-Ads-Rule-Geosite*.txt`，是 [domain-list-community](https://github.com/v2fly/domain-list-community) 的原始文字格式（純網域與 `full:`），需要自行編譯成 `geosite.dat` 才能被 Xray / V2Ray 載入。

### AdGuard Replenish 補充規則 {#adguard-replenish}

`AWAvenue-Ads-Rule-Replenish.txt` 是給 AdGuard 用的激進補充清單，只有一個版本。它含有 URL 路徑規則，要放進 AdGuard 的[自訂過濾器](./AdGuard.md#android-custom)；放進 AdGuard Home 只有網域部分會生效。

## 常見問題

### 為什麼有些廣告還在？

秋風廣告規則依網域攔截。廣告和內文使用同一個網域時，網域規則拿它沒辦法；應用程式自帶加密 DNS 繞過過濾時也攔不到。看一下工具的紀錄，確認請求有沒有經過它。

### 正常功能被誤擋怎麼辦？

先暫時停用秋風廣告規則，確認問題消失，再從紀錄中找到被攔的網域，只放行這一個。然後[提交 issue](https://github.com/TG-Twilight/AWAvenue-Ads-Rule/issues)，附上網域和出問題的操作，我們確認後會移除。

### 加了模組後斷網？

先停用最近修改的模組或設定，恢復到能上網的狀態，再看對應工具的紀錄。Android 上 AdGuard 和代理一起使用的情況請見[共存說明](./Coexist.md)。
