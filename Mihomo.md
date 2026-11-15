# Clash / Mihomo 使用教程

适用于 Mihomo 内核的客户端。旧版 Clash 内核不支持 MRS，请用 YAML。

## 选格式

在[订阅生成器](./Sub.html?tool=clash)选好格式和方案，复制链接。三种格式选一种就行：

| 生成器格式 | behavior | format | 教程 |
| --- | --- | --- | --- |
| [Clash / Mihomo YAML](./Sub.html?tool=clash) | `domain` | `yaml` | [域名 YAML](#yaml) |
| [Clash / Mihomo MRS](./Sub.html?tool=clashMrs) | `domain` | `mrs` | [MRS](#mrs) |
| [Clash / Mihomo Classical](./Sub.html?tool=clashClassical) | `classical` | `yaml` | [Classical YAML](#classical) |

- **Classical** 多了几条 `DOMAIN-KEYWORD` 关键字规则，覆盖面最全，拿不准就选它。
- **MRS** 体积最小、加载最快，只有 Mihomo 内核能用。

它们都是规则集，不是代理订阅，不能当订阅导入。下面的示例用的是完整版链接，换成你在生成器复制的链接即可，`behavior` / `format` 要和格式对应。

## 域名 YAML {#yaml}

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

## MRS 二进制规则集 {#mrs}

MRS 是二进制文件，用浏览器打开是乱码，正常。

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

## 合并到配置

1. 先备份能用的配置。
2. 用客户端的「覆写」「合并」或「扩展配置」功能加入上面的片段。直接改订阅下来的配置文件，下次更新订阅就被覆盖了。
3. `awa_ads` 并进已有的 `rule-providers`，`RULE-SET,awa_ads,REJECT` 并进已有的 `rules`，**放在 `MATCH` 和大范围 `DIRECT` 规则前面**。不要再写一个同名的 `rules:`，那会把原来的规则整个顶掉。
4. 客户端用规则模式（Rule），保存后重载配置。

命令行内核可以先检查一下合并后的配置：

```sh
mihomo -t -d ./mihomo-check -f ./merged.yaml
```

## 确认生效

在客户端或面板的规则集列表里找到 `awa_ads`，条目数不为零就说明下载成功。之后在连接记录里能看到命中 `awa_ads` 并被 `REJECT` 的请求。

没有命中的话，依次检查：是不是规则模式、片段有没有被合并进去、`RULE-SET` 那行是否排在会先匹配的规则后面。

## 更新与撤回

`interval: 86400` 表示每天自动更新一次，也可以在面板里手动更新 `awa_ads`。更新代理订阅不会顺带更新规则集。

误拦截时，从连接记录找到被拦的域名，在 `RULE-SET` 那行前面加一条放行规则，例如 `DOMAIN,needed.example,DIRECT`。要整个停用，删掉 `RULE-SET,awa_ads,REJECT` 那行并重载。

参考：[rule-providers 字段](https://wiki.metacubex.one/config/rule-providers/)、[规则与匹配顺序](https://wiki.metacubex.one/config/rules/)。
