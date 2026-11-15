# MosDNS v5 使用教程

以下是原版 MosDNS v5 的 YAML 写法。路由器插件版本通常会自动生成配置，请用插件提供的自定义规则入口，不然更新时会被覆盖。

## 下载域名列表

在[订阅生成器](./Sub.html?tool=mosdns)选 **MosDNS v5** 和方案，复制 `.txt` 链接。在 MosDNS 配置目录下载（示例是完整版链接）：

```sh
mkdir -p rules
curl -fL --retry 2 'https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Mosdns_v5.txt' -o rules/awa-ads.txt.new && mv rules/awa-ads.txt.new rules/awa-ads.txt
```

先下载到 `.new` 再改名，下载失败时旧文件还在。

## 加入配置

下面是一个能直接跑起来的最小 `config.yaml`，监听本机 `127.0.0.1:5353`。已有配置的话，把 `awa_domains` 和那两行 `matches` / `exec` 合并进去即可。上游 DNS 换成你自己用的。

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

- `domain_set` 要定义在引用它的 `sequence` 前面。
- 拦截那一步放在缓存和上游转发**之前**。
- `reject 3` 返回 NXDOMAIN。

## 启动与验证

```sh
mosdns start -c config.yaml
dig @127.0.0.1 -p 5353 ad.doubleclick.net A
dig @127.0.0.1 -p 5353 example.com A
```

第一条应返回 **NXDOMAIN**，第二条正常解析。

## 定时更新

MosDNS 只在启动时读取列表文件，下载新文件后要重启（或用你的部署方式重新加载）。可以写个定时任务：下载 → 改名 → 重启。

参考：[v5 数据插件](https://irine-sistiana.gitbook.io/mosdns-wiki/mosdns-v5/ru-he-pei-zhi-mosdns/shu-ju-cha-jian)、[sequence 与 reject](https://irine-sistiana.gitbook.io/mosdns-wiki/mosdns-v5/ru-he-pei-zhi-mosdns/sequence-cha-jian)。

## 撤回

从 sequence 里删掉 `matches: qname $awa_domains` / `exec: reject 3` 这一步，重启即可。
