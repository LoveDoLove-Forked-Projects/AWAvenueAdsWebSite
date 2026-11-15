# MosDNS v5 使用教學

以下是原版 MosDNS v5 的 YAML 寫法。路由器外掛版本通常會自動產生設定，請使用外掛提供的自訂規則入口，否則更新時會被覆蓋。

## 下載網域清單

在[訂閱產生器](./Sub.html?tool=mosdns)選擇 **MosDNS v5** 和方案，複製 `.txt` 連結。在 MosDNS 設定目錄下載（範例是完整版連結）：

```sh
mkdir -p rules
curl -fL --retry 2 'https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Mosdns_v5.txt' -o rules/awa-ads.txt.new && mv rules/awa-ads.txt.new rules/awa-ads.txt
```

先下載成 `.new` 再改名，下載失敗時舊檔案還在。

## 加入設定

以下是一份可以直接執行的最小 `config.yaml`，監聽本機 `127.0.0.1:5353`。已有設定的話，把 `awa_domains` 和那兩行 `matches` / `exec` 合併進去即可。上游 DNS 換成你自己使用的。

```yaml
log:
  level: info
plugins:
  - tag: awa_domains
    type: domain_set
    args:
      files:
        - ./rules/awa-ads.txt
  - tag: upstream
    type: forward
    args:
      upstreams:
        - addr: 223.5.5.5
  - tag: main
    type: sequence
    args:
      - matches: qname $awa_domains
        exec: reject 3
      - exec: $upstream
  - tag: udp_listener
    type: udp_server
    args:
      entry: main
      listen: 127.0.0.1:5353
  - tag: tcp_listener
    type: tcp_server
    args:
      entry: main
      listen: 127.0.0.1:5353
```

- `domain_set` 要定義在引用它的 `sequence` 前面。
- 攔截那一步放在快取和上游轉送**之前**。
- `reject 3` 回傳 NXDOMAIN。

## 啟動與驗證

```sh
mosdns start -c config.yaml
dig @127.0.0.1 -p 5353 ad.doubleclick.net A
dig @127.0.0.1 -p 5353 example.com A
```

第一筆應回傳 **NXDOMAIN**，第二筆正常解析。

## 定期更新

MosDNS 只在啟動時讀取清單檔案，下載新檔案後要重新啟動（或用你的部署方式重新載入）。可以寫個排程工作：下載 → 改名 → 重新啟動。

參考：[v5 資料外掛](https://irine-sistiana.gitbook.io/mosdns-wiki/mosdns-v5/ru-he-pei-zhi-mosdns/shu-ju-cha-jian)、[sequence 與 reject](https://irine-sistiana.gitbook.io/mosdns-wiki/mosdns-v5/ru-he-pei-zhi-mosdns/sequence-cha-jian)。

## 還原

從 sequence 中刪除 `matches: qname $awa_domains` / `exec: reject 3` 這一步，重新啟動即可。
