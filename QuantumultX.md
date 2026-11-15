# Quantumult X 使用教程

## 导入

1. 在[订阅生成器](./Sub.html?tool=quantumultX)选好方案，复制 **Quantumult X `.list`** 链接。
2. 打开 Quantumult X 设置，进入**分流 → 资源规则**，添加远程分流资源（不是节点订阅，也不是重写）。
3. 粘贴链接，标签填「秋风广告规则」，策略偏好选 **reject**。
4. **资源解析器保持关闭**，打开自动更新，保存。
5. 用规则分流模式开启 Quantumult X。

想随时开关拦截，可以建一个包含 `reject` 和 `direct` 的策略组当策略偏好，选 `direct` 就是暂时放行。

## 直接编辑配置（可选）

在 `[filter_remote]` 里加一行（示例是完整版链接，换成你复制的）：

```ini
[filter_remote]
https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-QuantumultX.list, tag=AWAvenue-Ads-Rule, force-policy=reject, update-interval=86400, opt-parser=false, enabled=true
```

## 确认生效

- 资源规则里能看到规则数量，没有下载错误。
- 活动记录里能看到命中这份资源、策略为 **reject** 的请求。
- 没有命中的话，检查分流模式、排在前面的规则，以及策略组当前选的是不是 `reject`。

## 更新与撤回

换方案时替换原来的链接，别同时开两份。误拦截时在活动记录里找到域名，加一条放行规则；临时排查可以直接停用这份资源。

参考：[Quantumult X 官方配置示例](https://github.com/crossutility/Quantumult-X/blob/master/sample.conf)。原教程由过去式编写。
