# sing-box 使用教學

以下寫法適用於 sing-box **1.14** 及之後的版本。圖形用戶端請先確認內建核心的版本。

## 取得規則連結

在[訂閱產生器](./Sub.html?tool=singbox)選擇 sing-box 和方案，複製 `.json` 連結。它是 source 格式的規則集，不是完整設定。

## 合併設定

範例用的是完整版連結，換成你複製的即可。把各部分合併到既有設定的對應位置，不要覆蓋原有的 DNS、入站和出站。

```json
{
  "http_clients": [
    {
      "tag": "awa-download",
      "domain_resolver": "awa-bootstrap"
    }
  ],
  "dns": {
    "servers": [
      {
        "type": "local",
        "tag": "awa-bootstrap"
      }
    ],
    "rules": [
      {
        "rule_set": "awa-ads",
        "action": "reject",
        "no_drop": true
      }
    ]
  },
  "route": {
    "rule_set": [
      {
        "type": "remote",
        "tag": "awa-ads",
        "format": "source",
        "url": "https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Singbox.json",
        "http_client": "awa-download",
        "update_interval": "1d"
      }
    ]
  }
}
```

- 這條 DNS 拒絕規則放在其他較寬鬆的 DNS 規則前面。
- `awa-bootstrap` 用系統 DNS 解析規則下載位址，避免 sing-box 還沒啟動就要靠自己解析的迴圈。
- 想在連線層也攔一道，在 `route.rules` 加入 `{"rule_set":"awa-ads","action":"reject"}`。
- 自行換成 `.srs` 連結的話，`format` 要改成 `binary`。

## 檢查並確認生效

1. 用 `sing-box check -c config.json` 檢查合併後的設定。
2. 啟動後查看紀錄，確認規則集下載成功。已有 `experimental.cache_file` 的話開啟 `enabled`，規則集會快取在本機，下次啟動不必重新下載。
3. 用清單中的一個網域做 DNS 查詢，應回傳 **REFUSED**；正常網域照常解析。

參考：[DNS 規則動作](https://sing-box.sagernet.org/configuration/dns/rule_action/)、[遠端規則集](https://sing-box.sagernet.org/configuration/rule-set/)、[HTTP 用戶端](https://sing-box.sagernet.org/configuration/shared/http-client/)、[1.14 遷移說明](https://sing-box.sagernet.org/deprecated/#legacy-dns-server-formats)。

## 還原

刪除 `dns.rules` 中這條拒絕規則（以及你在 `route.rules` 加的那條）就停用了。還要刪除 `route.rule_set` 中的 `awa-ads` 的話，先確認沒有其他規則引用它。
