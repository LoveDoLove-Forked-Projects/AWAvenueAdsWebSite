# Surge 使用教學

在[訂閱產生器](./Sub.html?tool=surgeRuleSet)選擇格式和方案。以下三種方式**選一種**，不要重複匯入。使用別人託管、無法編輯的設定檔的話，選模組最省事。

## RULE-SET {#rule-set}

選擇 **Surge / Surfboard RULE-SET**，複製 `.list` 連結，加到 `[Rule]` 中，放在 `FINAL` 和較寬鬆的放行規則前面（範例是完整版連結）：

```ini
[Rule]
RULE-SET,https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Surge-RULE-SET.list,REJECT
```

## DOMAIN-SET {#domain-set}

選擇 **Surge / Surfboard DOMAIN-SET**。純網域清單，比對比 RULE-SET 更快：

```ini
[Rule]
DOMAIN-SET,https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Surge.list,REJECT
```

RULE-SET 和 DOMAIN-SET 的檔案格式不同，連結不能混用。

## Surge 模組 {#module}

需要 Surge iOS 5.14.0 / Mac 5.9.0 或更新版本。

1. 在[產生器](./Sub.html?tool=surgeModule)選擇 **Surge Module** 和方案，複製 `.sgmodule` 連結。
2. 在 Surge 開啟**模組** → 從 URL 安裝，貼上連結，啟用。
3. 模組只有網域攔截規則，不需要憑證或 MitM。

## 確認生效

- 以規則模式開啟 Surge，在請求紀錄中能看到命中秋風廣告規則、策略為 **REJECT** 的請求。
- 沒有命中的話，檢查規則順序、模組是否已啟用。
- 換方案時替換原本的連結，別同時開兩份。

Surfboard 使用者請用 [RULE-SET](https://getsurfboard.com/docs/profile-format/rule/ruleset/) 或 [DOMAIN-SET](https://getsurfboard.com/docs/profile-format/rule/domainset/) 方式。

參考：[Surge 規則集](https://manual.nssurge.com/rules/ruleset.html)、[網域規則](https://manual.nssurge.com/rules/domain.html)、[模組](https://manual.nssurge.com/profile/module.html)。

## 還原

模組方式就停用模組；規則集方式則把那一行註解掉，重新載入設定。

模組中的規則排在主設定前面，你在主設定中寫的放行規則對它無效。需要自行放行某些網域的話，改用 RULE-SET 或 DOMAIN-SET，把放行規則寫在它前面。
