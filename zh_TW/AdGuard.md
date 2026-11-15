# AdGuard：先選產品，再匯入規則

## 你用的是哪一種 AdGuard？ {#choose-product}

| 產品 | 在哪裡新增秋風廣告規則 |
| --- | --- |
| AdGuard for Android | 本頁的 DNS 過濾器或自訂過濾器，二選一 |
| AdGuard Home（路由器、NAS、伺服器） | [AdGuard Home 教學](./AdGuardHome.md) |
| AdGuard for Windows / Mac / iOS | 本頁最後的[其他平台](#other-platforms) |
| 公共 AdGuard DNS | 只能用它內建的過濾，無法加入秋風廣告規則 |

個人版 AdGuard DNS 可以在面板中新增自訂清單，數量依方案而定，見[官方說明](https://adguard-dns.io/kb/private-dns/setting-up-filtering/blocklists/)。

## 準備訂閱連結 {#subscription}

開啟[訂閱產生器](./Sub.md)，選擇 AdGuard 和想要的方案，複製**官方來源（GitHub Raw）**連結。連不上 GitHub 時再換備用來源。

## Android：DNS 過濾器 {#android-dns}

建議使用這個入口，不需要開啟 HTTPS 過濾。

1. 開啟 AdGuard 防護，依提示授權 VPN。手機上另有代理應用程式的話，先看[共存教學](./Coexist.md)。
2. 進入「防護 → DNS 防護」，開啟 DNS 防護。
3. 進入「DNS 過濾器」，新增自訂過濾器，貼上剛才的連結，儲存並啟用。

訂閱連結要填在 DNS 過濾器裡，不是 DNS 伺服器位址欄。

## Android：自訂過濾器 {#android-custom}

如果你已經在用 AdGuard 的內容過濾，也可以放在這裡：「設定 → 過濾 → 過濾器 → 自訂過濾器」，新增同一條連結並啟用。

兩個入口選一個就夠了，同一份清單放兩處不會多攔什麼。

產生器中的 **AdGuard 補充規則（Replenish）** 是另一份更激進的清單，含 URL 路徑規則，只能放在自訂過濾器，和上面的訂閱一起使用。

## 確認生效 {#verify}

1. 過濾器清單中看到秋風廣告規則已啟用，規則數不為零。
2. 開啟「統計 → 最近活動」，隨意開幾個應用程式，就能看到被攔截的請求，點開詳細資料會顯示命中的是秋風廣告規則。
3. 在「一般 → 應用程式和過濾器更新」開啟自動更新。

## 誤擋與移除 {#rollback}

功能異常時，先只停用秋風廣告規則，重試同一個操作。確認是它攔的，在「最近活動」中點開那筆請求，直接加入允許清單，只放行那一個網域。

要完全移除，刪除這條訂閱即可。

## Windows、macOS 與 iOS {#other-platforms}

找到對應產品的 DNS 過濾器，新增同一條連結：

- **Windows**：設定 → DNS 防護 → DNS 過濾器，見[官方說明](https://adguard.com/kb/adguard-for-windows/protection/dns-protection/)。
- **macOS**：設定 → DNS → 過濾器，見[官方說明](https://adguard.com/kb/adguard-for-mac/features/dns/)。注意別加到 Safari 延伸功能那邊。
- **iOS / iPadOS**：DNS 防護 → DNS 過濾 → DNS 過濾器，見[官方說明](https://adguard.com/kb/adguard-for-ios/features/dns-protection/)。別加到「Safari 防護」，那是網頁內容攔截。

歷史原稿：[天命](https://t.me/tmbyml)。
