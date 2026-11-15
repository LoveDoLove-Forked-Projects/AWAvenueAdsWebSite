# Quantumult X 使用教學

## 匯入

1. 在[訂閱產生器](./Sub.html?tool=quantumultX)選好方案，複製 **Quantumult X `.list`** 連結。
2. 開啟 Quantumult X 設定，進入**分流 → 資源規則**，新增遠端分流資源（不是節點訂閱，也不是重寫）。
3. 貼上連結，標籤填「秋風廣告規則」，策略偏好選 **reject**。
4. **資源解析器保持關閉**，開啟自動更新，儲存。
5. 以規則分流模式開啟 Quantumult X。

想隨時開關攔截，可以建立一個包含 `reject` 和 `direct` 的策略群組當作策略偏好，選 `direct` 就是暫時放行。

## 直接編輯設定（選用）

在 `[filter_remote]` 中加入一行（範例是完整版連結，換成你複製的）：

```ini
[filter_remote]
https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-QuantumultX.list, tag=AWAvenue-Ads-Rule, force-policy=reject, update-interval=86400, opt-parser=false, enabled=true
```

## 確認生效

- 資源規則中能看到規則數量，沒有下載錯誤。
- 活動紀錄中能看到命中這份資源、策略為 **reject** 的請求。
- 沒有命中的話，檢查分流模式、排在前面的規則，以及策略群組目前選的是不是 `reject`。

## 更新與還原

換方案時替換原本的連結，別同時開兩份。誤擋時在活動紀錄中找到網域，加一條放行規則；暫時排查可以直接停用這份資源。

參考：[Quantumult X 官方設定範例](https://github.com/crossutility/Quantumult-X/blob/master/sample.conf)。原教學由過去式撰寫。
