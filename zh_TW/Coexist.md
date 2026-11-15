# Android：AdGuard 與代理用戶端共存

## 為什麼會衝突 {#vpn}

Android 同一時間只允許一個應用程式使用 VPN。AdGuard 和代理用戶端（Clash、sing-box 等）都想占用 VPN，開了一個另一個就斷線，重複授權也沒用。

解決辦法是讓 AdGuard 占用 VPN，代理用戶端只在本機開一個代理連接埠，再由 AdGuard 把流量轉過去：

```text
應用程式 → AdGuard（過濾） → 127.0.0.1 本機代理 → 代理出口
```

前提是你的代理用戶端能**不開 VPN / TUN 單獨執行**。不支援的話，換個方式：直接在代理用戶端中使用秋風廣告規則（[Mihomo](./Mihomo.md)、[sing-box](./SingBox.md)），不用 AdGuard。

## 1. 讓代理用戶端只開本機連接埠 {#local-proxy}

先備份可用的設定。然後關閉代理用戶端的 VPN / TUN，記下它監聽的連接埠。

- **Mihomo / Clash 系**：在用戶端中關閉 VPN / TUN（各用戶端名稱不同，例如「僅代理」）。連接埠看設定中的 `mixed-port` 或 `socks-port`；`port` 是 HTTP 連接埠，不能當 SOCKS5 使用。
- **官方 sing-box（SFA）**：移除 `tun` 入站，加一個本機 SOCKS 入站，sing-box 就會以前景服務執行而不占用 VPN：

```json
{
  "type": "socks",
  "tag": "adguard-local",
  "listen": "127.0.0.1",
  "listen_port": 10808
}
```

把它放進既有設定的 `inbounds` 陣列，出站和路由維持不變。

連接埠只監聽 `127.0.0.1`，別為了省事改成 `0.0.0.0`，那等於把代理開放給整個區域網路。

## 2. 在 AdGuard 中接上本機代理 {#exclude}

1. 在「應用程式管理」找到**代理用戶端本身**，關閉「透過 AdGuard 路由流量」。不關的話，代理出去的流量又會繞回 AdGuard，形成迴圈。
2. 在「設定 → 過濾 → 網路 → 代理 → 代理伺服器」新增一個代理：

| 欄位 | 填寫 |
| --- | --- |
| 類型 | SOCKS5 |
| 主機 | `127.0.0.1` |
| 連接埠 | 代理用戶端實際監聽的連接埠，例如 `10808` |
| 驗證 | 入站有設帳號密碼的話就填一樣的 |

3. 選取這個代理，開啟代理總開關。

參考：[AdGuard 出站代理設定](https://adguard.com/kb/adguard-for-android/solving-problems/outbound-proxy/)。

## 3. DNS 交給誰 {#dns}

先依照 [AdGuard 教學](./AdGuard.md#android-dns)把秋風廣告規則加入 DNS 過濾器，單獨用一段時間確認沒問題，再接上代理。

代理設定中的 DNS 保持原樣，不要為了「讓 AdGuard 管 DNS」就關閉 `dns.enable`——代理核心自己也要解析節點網域。

## 4. 檢查與還原 {#verify}

1. 用瀏覽器開幾個網站，正常。
2. 代理用戶端的連線紀錄中能看到流量，出口是你的節點。
3. AdGuard「最近活動」中能看到被秋風廣告規則攔截的請求。
4. 鎖定螢幕一會兒、切換一下 Wi-Fi 和行動網路，再檢查一次。系統要求的話，替兩個應用程式都開啟背景執行權限。

斷線時，**先在 AdGuard 中關閉出站代理**，再停止代理用戶端；順序反了，AdGuard 會一直把流量送往一個已經不存在的連接埠。還是不行就還原第 1 步備份的設定，從頭再來。
