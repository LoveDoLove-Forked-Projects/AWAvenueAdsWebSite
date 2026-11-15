# sing-box 使用教程

下面的写法适用于 sing-box **1.14** 及以后。图形客户端请先看一下内置核心的版本。

## 取得规则链接

在[订阅生成器](./Sub.html?tool=singbox)选 sing-box 和方案，复制 `.json` 链接。它是 source 格式的规则集，不是完整配置。

## 合并配置

示例用的是完整版链接，换成你复制的即可。把各部分合并到现有配置的对应位置，不要覆盖原有的 DNS、入站和出站。

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

- 这条 DNS 拒绝规则放在其他宽泛的 DNS 规则前面。
- `awa-bootstrap` 用系统 DNS 解析规则下载地址，避免 sing-box 还没启动就要靠自己解析的死循环。
- 想在连接层也拦一道，在 `route.rules` 里加 `{"rule_set":"awa-ads","action":"reject"}`。
- 自己换成 `.srs` 链接的话，`format` 要改成 `binary`。

## 检查并确认生效

1. `sing-box check -c config.json` 检查合并后的配置。
2. 启动后看日志，确认规则集下载成功。已有 `experimental.cache_file` 的话打开 `enabled`，规则集会缓存到本地，下次启动不用重新下载。
3. 用列表里的一个域名做 DNS 查询，应返回 **REFUSED**；正常域名照常解析。

参考：[DNS 规则动作](https://sing-box.sagernet.org/configuration/dns/rule_action/)、[远程规则集](https://sing-box.sagernet.org/configuration/rule-set/)、[HTTP 客户端](https://sing-box.sagernet.org/configuration/shared/http-client/)、[1.14 迁移说明](https://sing-box.sagernet.org/deprecated/#legacy-dns-server-formats)。

## 撤回

删掉 `dns.rules` 里的这条拒绝规则（以及你在 `route.rules` 加的那条）就停用了。还要删 `route.rule_set` 里的 `awa-ads` 的话，先确认没有别的规则引用它。
