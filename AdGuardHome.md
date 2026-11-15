# AdGuard Home：订阅、更新与验证

本页假设 AdGuard Home 已经装好、能打开管理界面。还没装的话先看[官方入门文档](https://adguard-dns.io/kb/adguard-home/getting-started/)。

## 准备 {#prepare}

记下原来的 DNS 设置（路由器 DHCP、上游 DNS、已有的允许规则），出问题时好改回去。建议先拿一台设备试，没问题再推到全家。

## 添加订阅 {#import}

两种方式选一种。推荐第一种：可以选四种方案，并且直接跟随规则仓库的发布。

### 方式一：订阅项目仓库（推荐） {#custom-list}

1. 在[订阅生成器](./Sub.md)选 **AdGuard** 和想要的方案，复制**官方源（GitHub Raw）**链接。连不上 GitHub 再换备用来源。
2. 打开「过滤器 → DNS 黑名单」，点「添加黑名单 → 添加一个自定义列表」。
3. 填个认得出的名称，粘贴链接，保存。

<figure class="tutorial-screenshot">
  <a href="/tutorials/adguard-home/zh-CN-custom.png" target="_blank" rel="noopener">
    <img src="/tutorials/adguard-home/zh-CN-custom.png" width="561" height="444" loading="lazy" alt="AdGuard Home 自定义列表表单中填写了秋风广告规则仅广告版的名称和订阅链接。">
  </a>
  <figcaption>以仅广告版为例。点击图片可查看原图。</figcaption>
</figure>

之前勾过内置的 AWAvenue Ads Rule 的话，记得停用它，不然换成仅广告版也还是完整版的效果。

### 方式二：直接勾选内置列表 {#built-in}

1. 打开「过滤器 → DNS 黑名单」。
2. 点「添加黑名单 → 从列表中选择」。
3. 在「常规」分类里勾选 **AWAvenue Ads Rule**，保存。**这就是秋风广告规则**，不用粘贴链接。

<details>
<summary>查看内置列表截图</summary>

<figure class="tutorial-screenshot">
  <a href="/tutorials/adguard-home/zh-CN-catalog.png" target="_blank" rel="noopener">
    <img src="/tutorials/adguard-home/zh-CN-catalog.png" width="561" height="152" loading="lazy" alt="AdGuard Home 内置列表中的 AWAvenue Ads Rule 已被勾选。">
  </a>
  <figcaption>内置列表里的 AWAvenue Ads Rule。点击图片可查看原图。</figcaption>
</figure>

</details>

内置列表是 AdGuard 转发的完整版，只有这一个方案，更新也会比仓库晚一点。

### 添加后检查

列表显示已启用、规则数不为零。再到「设置 → 常规设置」确认「使用过滤器和 hosts 文件拦截域名」是开着的。

## 更新 {#update}

在 DNS 黑名单页点「检查更新」就会重新下载。自动更新间隔在「设置 → 常规设置」里改。

下载失败时，先确认运行 AdGuard Home 的那台机器能打开这条链接；不行就从生成器复制同一方案的备用来源，**编辑原条目**换掉链接，别另加一条。

## 让设备用上 AdGuard Home {#client-dns}

把设备的 DNS 改成 AdGuard Home 的局域网地址，或者在路由器 DHCP 里统一下发。IPv6 的 DNS 也要一起改，并且别再填一个公共 DNS 当「备用」——设备经常会直接用备用的。

浏览器的「安全 DNS」、Android 的「私人 DNS」会绕开 AdGuard Home，测试时先关掉。

在电脑上可以这样测（`192.168.1.2` 换成你的 AdGuard Home 地址）：

```sh
nslookup example.org 192.168.1.2
nslookup example.org
```

两条都应该在「查询日志」里出现。第二条没出现，说明这台设备的 DNS 还没指过来。

## 确认拦截生效 {#verify}

查一个列表里的广告域名，再查一个正常域名对照：

```sh
nslookup ad.doubleclick.net 192.168.1.2
nslookup example.org 192.168.1.2
```

查询日志里第一条应显示「已拦截」。鼠标移到「响应」列的问号上，可以看到命中的规则和列表名称。

<figure class="tutorial-screenshot">
  <a href="/tutorials/adguard-home/zh-CN-hit.png" target="_blank" rel="noopener">
    <img src="/tutorials/adguard-home/zh-CN-hit.png" width="476" height="408" loading="lazy" alt="AdGuard Home 响应细节显示已拦截，命中规则为 ||ad.doubleclick.net^，所属清单为自定义的秋风广告规则仅广告版，返回 0.0.0.0。">
  </a>
  <figcaption>响应细节里能看到命中规则和列表名称。点击图片可查看原图。</figcaption>
</figure>

改完规则后结果没变，多半是缓存：清一下 AdGuard Home 和设备的 DNS 缓存再试。

## 误拦截与撤回 {#rollback}

先停用秋风广告规则，重试出问题的操作。确认是它拦的，在查询日志里点那条记录的「解除拦截」，AdGuard Home 会自动在「自定义过滤规则」里加一条例外。也可以手写，例如 `@@||needed.example^`（换成实际的域名）。只放行确认有问题的那个域名。

要彻底撤回：删掉这条订阅和为它加的例外，把设备或路由器的 DNS 改回原来的设置。

DNS 过滤拦不掉和正文同域名的广告，也去不掉网页上留下的空白。Android 手机上直接装 AdGuard 的话看[这篇](./AdGuard.md)。
