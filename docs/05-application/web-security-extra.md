---
title: Web安全补充
description: SQL盲注/文件包含/XXE/反序列化/CORS/点击劫持/供应链攻击
---

# Web 安全补充考点

> 本篇补充Web攻击的细分类型和新型漏洞。标注 ⭐ 高频，📌 了解即可。

## SQL 注入细分 ⭐

| 类型 | 原理 | 特点 |
|------|------|------|
| **联合查询** | UNION SELECT拼接获取数据 | 直接回显 |
| **布尔盲注** | 通过页面真假判断逐字符猜解 | 无直接回显 |
| **时间盲注** | 用SLEEP/IF根据响应时间判断 | 无任何回显 |
| **堆叠注入** | 分号拼接多条SQL | 取决于数据库支持 |
| **报错注入** | 利用数据库报错信息回显 | 依赖错误显示 |

> 💡 防护不变：**参数化查询**是所有SQL注入的根本防护。

## 文件包含漏洞 ⭐

> 🎯 **形象比喻**：程序像"点餐系统"，用户指定"上哪道菜"（包含哪个文件），如果用户能点"后厨的钥匙"（敏感文件）就出问题了。

| 类型 | 全称 | 说明 |
|------|------|------|
| **LFI** | Local File Inclusion | 包含本地文件（如 /etc/passwd） |
| **RFI** | Remote File Inclusion | 包含远程文件（如 http://evil/shell.txt） |

### 危害
- 读取任意文件（配置文件/源码）
- 配合文件上传 getshell
- RFI可直接执行远程恶意代码

### 防护
1. 关闭远程包含（`allow_url_include=Off`）
2. 白名单限制可包含文件
3. 固定路径，禁止用户输入控制路径

## 目录遍历（Path Traversal）⭐

- 用 `../` 跳出 Web 目录读取任意文件
- 示例：`?file=../../etc/passwd`
- 防护：过滤`../`、固定根目录、白名单

## XXE 漏洞（XML外部实体）⭐

> XML解析器解析外部实体时，可读取本地文件或发起网络请求。

```xml
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<root>&xxe;</root>
```

### 危害
- 读取任意文件
- SSRF（发起内网请求）
- 拒绝服务（ Billion Laughs 攻击）

### 防护
- 禁用XML外部实体解析（`libxml_disable_entity_loader`）

## 反序列化漏洞 ⭐

> 🎯 反序列化不可信数据时执行恶意代码。典型：Java的Fastjson/Log4j、.NET的BinaryFormatter。

| 漏洞 | 说明 |
|------|------|
| **Fastjson** | Java JSON反序列化RCE |
| **Log4j2** | JNDI注入RCE（2021年重大漏洞） |
| **Struts2** | OGNL表达式注入 |

### 防护
1. 不反序列化不可信数据
2. 白名单限制可反序列化的类
3. 及时升级组件

## WebShell 与后门 📌

| 类型 | 说明 |
|------|------|
| **一句话木马** | `<?php eval($_POST['cmd']); ?>` |
| **WebShell管理工具** | 中国菜刀/蚁剑/冰蝎 |

### 防护
- 文件上传防护（白名单+重命名+非Web目录）
- WAF检测WebShell特征
- 定期扫描Web目录

## CORS 跨域资源共享 📌

- `Access-Control-Allow-Origin: *` 配置过宽可导致跨域读取数据
- 防护：限制允许的源，不设通配符

## 点击劫持（Clickjacking）⭐

> 🎯 攻击者用透明iframe覆盖正常页面，诱导用户点击实际点击的是隐藏的恶意按钮。

### 防护
- `X-Frame-Options: DENY` 禁止被iframe嵌入
- `Content-Security-Policy: frame-ancestors 'none'`

## 供应链攻击 ⭐

> 🎯 攻击者入侵软件供应链环节（开发库/CI/CD/更新），在合法软件中植入后门。

| 案例 | 说明 |
|------|------|
| **SolarWinds** (2020) | 攻击者在Orion更新包植入后门，影响1.8万家客户 |
| **Log4j2** (2021) | 广泛使用的Java日志库存在RCE漏洞 |
| **XZ Utils** (2024) | 开源压缩工具被植入后门 |

### 防护
- SBOM（软件物料清单）：追踪所有第三方依赖
- 代码签名验证
- 最小权限（CI/CD系统低权限）
- 依赖扫描（SCA工具）

## 攻击链：从入侵到维持 ⭐

```
初始访问 → 执行 → 持久化 → 提权 → 防御规避 → 横向移动 → 数据窃取
```

### 持久化（权限维持）方式
| 方式 | 说明 |
|------|------|
| 注册表自启动 | Windows Run键 |
| 计划任务 | 定时执行 |
| 服务 | 安装为系统服务 |
| WMI事件订阅 | 无文件持久化 |
| 启动项 | 开始菜单启动 |

### 横向移动
- 域控(DC)攻陷→控制整个域
- Pass the Hash / Golden Ticket / Silver Ticket

## 考点速记
- SQL盲注：布尔盲注(真假判断)/时间盲注(响应时间)
- 文件包含：LFI(本地)/RFI(远程)；防：关远程包含+白名单
- 目录遍历：`../`跳出Web目录
- XXE：XML外部实体读取文件；防：禁用外部实体
- 反序列化：Fastjson/Log4j2/Struts2；防：不反序列化不可信数据
- 点击劫持防：**X-Frame-Options**
- 供应链攻击：SolarWinds/Log4j2；防：SBOM+代码签名
- Kill Chain：初始访问→执行→**持久化**→提权→横向移动→窃取
- 持久化方式：注册表/计划任务/服务/WMI
