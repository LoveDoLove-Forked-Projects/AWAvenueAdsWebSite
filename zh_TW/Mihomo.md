# Clash / Mihomo 使用教學

適用於 Mihomo 核心的用戶端。舊版 Clash 核心不支援 MRS，請用 YAML。

## 選擇格式

在[訂閱產生器](./Sub.html?tool=clash)選好格式和方案，複製連結。三種格式選一種即可：

| 產生器格式 | behavior | format | 教學 |
| --- | --- | --- | --- |
| [Clash / Mihomo YAML](./Sub.html?tool=clash) | `domain` | `yaml` | [網域 YAML](#yaml) |
| [Clash / Mihomo MRS](./Sub.html?tool=clashMrs) | `domain` | `mrs` | [MRS](#mrs) |
| [Clash / Mihomo Classical](./Sub.html?tool=clashClassical) | `classical` | `yaml` | [Classical YAML](#classical) |

- **Classical** 多了幾條 `DOMAIN-KEYWORD` 關鍵字規則，涵蓋範圍最完整，拿不準就選它。
- **MRS** 檔案最小、載入最快，只有 Mihomo 核心能用。

它們都是規則集，不是代理訂閱，不能當訂閱匯入。下面的範例用的是完整版連結，換成你在產生器複製的連結即可，`behavior` / `format` 要和格式對應。

## 網域 YAML {#yaml}

```yaml
rule-providers:
  awa_ads:
    type: http
    behavior: domain
    format: yaml
    path: ./rule_providers/AWAvenue-Ads-Rule-Clash.yaml
    url: "https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Clash.yaml"
    interval: 86400
rules:
  - RULE-SET,awa_ads,REJECT
```

## MRS 二進位規則集 {#mrs}

MRS 是二進位檔案，用瀏覽器開啟是亂碼，屬於正常現象。

```yaml
rule-providers:
  awa_ads:
    type: http
    behavior: domain
    format: mrs
    path: ./rule_providers/AWAvenue-Ads-Rule-Clash.mrs
    url: "https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Clash.mrs"
    interval: 86400
rules:
  - RULE-SET,awa_ads,REJECT
```

## Classical YAML {#classical}

```yaml
rule-providers:
  awa_ads:
    type: http
    behavior: classical
    format: yaml
    path: ./rule_providers/AWAvenue-Ads-Rule-Clash-Classical.yaml
    url: "https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Clash-Classical.yaml"
    interval: 86400
rules:
  - RULE-SET,awa_ads,REJECT
```

## 合併到設定

1. 先備份可用的設定。
2. 用用戶端的「覆寫」「合併」或「擴充設定」功能加入上面的片段。直接改訂閱下載的設定檔，下次更新訂閱就會被覆蓋。
3. 把 `awa_ads` 併入既有的 `rule-providers`，`RULE-SET,awa_ads,REJECT` 併入既有的 `rules`，**放在 `MATCH` 和大範圍 `DIRECT` 規則前面**。不要再寫一個同名的 `rules:`，那會把原本的規則整個取代掉。
4. 用戶端使用規則模式（Rule），儲存後重新載入設定。

命令列核心可以先檢查合併後的設定：

```sh
mihomo -t -d ./mihomo-check -f ./merged.yaml
```

## 確認生效

在用戶端或面板的規則集清單中找到 `awa_ads`，項目數不為零就代表下載成功。之後在連線紀錄中能看到命中 `awa_ads` 並被 `REJECT` 的請求。

沒有命中的話，依序檢查：是否為規則模式、片段有沒有被合併進去、`RULE-SET` 那行是否排在會先比對的規則後面。

## 更新與還原

`interval: 86400` 表示每天自動更新一次，也可以在面板中手動更新 `awa_ads`。更新代理訂閱不會順帶更新規則集。

誤擋時，從連線紀錄找到被攔的網域，在 `RULE-SET` 那行前面加一條放行規則，例如 `DOMAIN,needed.example,DIRECT`。要整個停用，刪除 `RULE-SET,awa_ads,REJECT` 那行並重新載入。

參考：[rule-providers 欄位](https://wiki.metacubex.one/config/rule-providers/)、[規則與比對順序](https://wiki.metacubex.one/config/rules/)。
