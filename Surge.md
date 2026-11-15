# Surge 使用教程

在[订阅生成器](./Sub.html?tool=surgeRuleSet)选择格式和方案。下面三种方式**选一种**，不要重复导入。用的是别人托管、不能编辑的配置的话，选模块最省事。

## RULE-SET {#rule-set}

选 **Surge / Surfboard RULE-SET**，复制 `.list` 链接，加到 `[Rule]` 里，放在 `FINAL` 和宽泛的放行规则前面（示例是完整版链接）：

```ini
[Rule]
RULE-SET,https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Surge-RULE-SET.list,REJECT
```

## DOMAIN-SET {#domain-set}

选 **Surge / Surfboard DOMAIN-SET**。纯域名列表，匹配比 RULE-SET 更快：

```ini
[Rule]
DOMAIN-SET,https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Surge.list,REJECT
```

RULE-SET 和 DOMAIN-SET 的文件格式不同，链接不能混用。

## Surge 模块 {#module}

需要 Surge iOS 5.14.0 / Mac 5.9.0 或更新版本。

1. 在[生成器](./Sub.html?tool=surgeModule)选 **Surge Module** 和方案，复制 `.sgmodule` 链接。
2. Surge 里打开**模块** → 从 URL 安装，粘贴链接，启用。
3. 模块只有域名拦截规则，不需要证书或 MitM。

## 确认生效

- 规则模式下打开 Surge，在请求记录里能看到命中秋风广告规则、策略为 **REJECT** 的请求。
- 没有命中的话，检查规则顺序、模块是否启用。
- 换方案时替换原来的链接，别同时开两份。

Surfboard 用户请用 [RULE-SET](https://getsurfboard.com/docs/profile-format/rule/ruleset/) 或 [DOMAIN-SET](https://getsurfboard.com/docs/profile-format/rule/domainset/) 方式。

参考：[Surge 规则集](https://manual.nssurge.com/rules/ruleset.html)、[域名规则](https://manual.nssurge.com/rules/domain.html)、[模块](https://manual.nssurge.com/profile/module.html)。

## 撤回

模块方式停用模块；规则集方式注释掉那一行，重新加载配置。

模块里的规则排在主配置前面，你在主配置里写的放行规则对它无效。需要自己放行某些域名的话，改用 RULE-SET 或 DOMAIN-SET，把放行规则写在它前面。
