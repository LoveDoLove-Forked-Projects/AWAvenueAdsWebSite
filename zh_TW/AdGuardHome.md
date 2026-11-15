# AdGuard Home：訂閱、更新與驗證

本頁假設 AdGuard Home 已經安裝好、能開啟管理介面。還沒安裝的話，先看[官方入門文件](https://adguard-dns.io/kb/adguard-home/getting-started/)。

## 準備 {#prepare}

記下原本的 DNS 設定（路由器 DHCP、上游 DNS、既有的允許規則），出問題時才改得回去。建議先拿一台裝置試用，沒問題再套用到全家。

## 新增訂閱 {#import}

兩種方式選一種。建議用第一種：可以選四種方案，而且直接跟隨規則儲存庫的發布。

### 方式一：訂閱專案儲存庫（建議） {#custom-list}

1. 在[訂閱產生器](./Sub.md)選擇 **AdGuard** 和想要的方案，複製**官方來源（GitHub Raw）**連結。連不上 GitHub 再換備用來源。
2. 開啟「過濾器 → DNS 封鎖清單」，點「新增封鎖清單 → 新增自訂清單」。
3. 填一個認得出的名稱，貼上連結，儲存。

<figure class="tutorial-screenshot">
  <a href="/tutorials/adguard-home/zh-TW-custom.png" target="_blank" rel="noopener">
    <img src="/tutorials/adguard-home/zh-TW-custom.png" width="561" height="444" loading="lazy" alt="AdGuard Home 自訂清單表單中填入了秋風廣告規則僅廣告版的名稱與訂閱連結。">
  </a>
  <figcaption>以僅廣告版為例。點選圖片可檢視原圖。</figcaption>
</figure>

之前勾過內建的 AWAvenue Ads Rule 的話，記得停用它，不然換成僅廣告版也還是完整版的效果。

### 方式二：直接勾選內建清單 {#built-in}

1. 開啟「過濾器 → DNS 封鎖清單」。
2. 點「新增封鎖清單 → 從該清單中選擇」。
3. 在「一般」分類勾選 **AWAvenue Ads Rule**，儲存。**這就是秋風廣告規則**，不用貼上連結。

<details>
<summary>檢視內建清單截圖</summary>

<figure class="tutorial-screenshot">
  <a href="/tutorials/adguard-home/zh-TW-catalog.png" target="_blank" rel="noopener">
    <img src="/tutorials/adguard-home/zh-TW-catalog.png" width="561" height="152" loading="lazy" alt="AdGuard Home 內建清單中的 AWAvenue Ads Rule 已勾選。">
  </a>
  <figcaption>內建清單中的 AWAvenue Ads Rule。點選圖片可檢視原圖。</figcaption>
</figure>

</details>

內建清單是 AdGuard 轉發的完整版，只有這一個方案，更新也會比儲存庫晚一點。

### 新增後檢查

清單顯示已啟用、規則數不為零。再到「設定 → 一般設定」確認「使用過濾器和 hosts 檔案封鎖網域」已開啟。

## 更新 {#update}

在 DNS 封鎖清單頁點「檢查更新」就會重新下載。自動更新間隔在「設定 → 一般設定」中調整。

下載失敗時，先確認執行 AdGuard Home 的那台機器能開啟這條連結；不行就從產生器複製同一方案的備用來源，**編輯原本的項目**換掉連結，別另外新增一條。

## 讓裝置使用 AdGuard Home {#client-dns}

把裝置的 DNS 改成 AdGuard Home 的區域網路位址，或在路由器 DHCP 中統一派送。IPv6 的 DNS 也要一起改，而且別再填一個公共 DNS 當「備用」——裝置常常會直接用備用的。

瀏覽器的「安全 DNS」、Android 的「私人 DNS」會繞過 AdGuard Home，測試時先關閉。

在電腦上可以這樣測試（`192.168.1.2` 換成你的 AdGuard Home 位址）：

```sh
nslookup example.org 192.168.1.2
nslookup example.org
```

兩筆都應該出現在「查詢紀錄」中。第二筆沒出現，表示這台裝置的 DNS 還沒指過來。

## 確認攔截生效 {#verify}

查詢一個清單中的廣告網域，再查一個正常網域對照：

```sh
nslookup ad.doubleclick.net 192.168.1.2
nslookup example.org 192.168.1.2
```

查詢紀錄中第一筆應顯示「已封鎖」。滑鼠移到「回應」欄的問號上，可以看到命中的規則和清單名稱。

<figure class="tutorial-screenshot">
  <a href="/tutorials/adguard-home/zh-TW-hit.png" target="_blank" rel="noopener">
    <img src="/tutorials/adguard-home/zh-TW-hit.png" width="452" height="408" loading="lazy" alt="AdGuard Home 回應細節顯示已封鎖，命中規則為 ||ad.doubleclick.net^，所屬清單是自訂的秋風廣告規則僅廣告版，回覆 0.0.0.0。">
  </a>
  <figcaption>回應細節中可以看到命中規則和清單名稱。點選圖片可檢視原圖。</figcaption>
</figure>

修改規則後結果沒變，多半是快取：清除 AdGuard Home 和裝置的 DNS 快取再試。

## 誤擋與移除 {#rollback}

先停用秋風廣告規則，重試出問題的操作。確認是它攔的，在查詢紀錄中點那筆紀錄的「解除封鎖」，AdGuard Home 會自動在「自訂過濾規則」中加入一條例外。也可以自己寫，例如 `@@||needed.example^`（換成實際的網域）。只放行確認有問題的那個網域。

要完全移除：刪除這條訂閱和為它加的例外，把裝置或路由器的 DNS 改回原本的設定。

DNS 過濾攔不掉和內文同網域的廣告，也去不掉網頁上留下的空白。Android 手機上直接安裝 AdGuard 的話，請看[這篇](./AdGuard.md)。
