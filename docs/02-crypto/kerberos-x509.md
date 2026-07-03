---
title: 补充：Kerberos 与 X.509 证书
description: Kerberos 认证协议、X.509 证书结构详解
---

# 补充考点：Kerberos 与 X.509 证书

## Kerberos 认证协议（高频冷门）

> Kerberos（刻耳柏洛斯，希腊神话三头犬）——三"头"指三方参与：客户端、认证服务器、服务服务器。

### 核心思想

- 基于**对称密钥**的第三方认证协议
- 引入**可信第三方 KDC**（Key Distribution Center，密钥分发中心）
- 使用**票据(Ticket)** 实现身份认证，避免反复传密码

### 三方角色

| 角色 | 说明 |
|------|------|
| **Client** | 客户端（用户） |
| **AS** | Authentication Server，认证服务器（KDC 的一部分） |
| **TGS** | Ticket Granting Server，票据授予服务器（KDC 的一部分） |
| **V** | Service Server，提供实际服务的服务器 |

> KDC = AS + TGS，是可信第三方。

### Kerberos 认证流程（六步）

```
① Client → AS：  请求认证（带用户名）
② AS → Client：  返回 TGT（用 Client 密钥加密的会话密钥 + 用 TGS 密钥加密的 TGT）
③ Client → TGS：  发送 TGT + 要访问的服务（用会话密钥加密的认证符）
④ TGS → Client：  返回服务票据（Service Ticket，用 V 密钥加密）
⑤ Client → V：    发送服务票据 + 认证符
⑥ V → Client：    确认认证，提供服务
```

### 关键概念

| 概念 | 说明 |
|------|------|
| **TGT** | Ticket Granting Ticket，"票据的票据"——先拿 TGT，再用 TGT 换服务票据 |
| **Ticket** | 访问服务的凭证，用服务端密钥加密，客户端无法篡改 |
| **Authenticator** | 认证符（含时间戳），防重放，证明票据是刚获取的 |
| **时间戳** | 防重放攻击的关键，票据有时效性 |

### Kerberos vs PKI

| 对比 | Kerberos | PKI |
|------|----------|-----|
| 密钥体制 | **对称** | 非对称 |
| 第三方 | KDC | CA |
| 凭证 | 票据 Ticket | 证书 Certificate |
| 适用域 | 域内（如 Windows AD） | 跨域/互联网 |

## X.509 数字证书结构详解

> X.509 是 PKI 中数字证书的标准格式（v3 最常用）。

### 证书字段

| 字段 | 英文 | 说明 |
|------|------|------|
| 版本 | Version | v1/v2/v3（v3 支持扩展） |
| 序列号 | Serial Number | CA 签发的唯一编号 |
| 签名算法 | Signature Algorithm | CA 签名用的算法（如 SHA256-RSA） |
| 颁发者 | Issuer | CA 的名称(DN) |
| 有效期 | Validity | 起止时间（Not Before / Not After） |
| 主体 | Subject | 持有者名称(DN) |
| 主体公钥 | Subject Public Key | 持有者的公钥及算法 |
| 扩展 | Extensions | v3 扩展（如密钥用途、SAN） |
| **CA 签名** | Signature | CA 用私钥对以上内容的签名 |

### 证书验证流程

```
1. 用 CA 公钥验证证书签名 → 确认证书未被篡改、确由 CA 签发
2. 检查有效期（Not Before < 当前 < Not After）
3. 检查吊销状态（CRL / OCSP）
4. 检查主体(CN/SAN)是否与访问的域名匹配
```

### 常见扩展

| 扩展 | 说明 |
|------|------|
| **KeyUsage** | 密钥用途（签名/加密/...） |
| **SAN** | Subject Alternative Name，多域名支持 |
| **BasicConstraints** | 是否为 CA 证书 |

## 考点速记

- Kerberos 基于**对称密钥** + **KDC 第三方**，用**票据(Ticket)** 认证
- KDC = AS + TGS；先获 **TGT**，再用 TGT 换服务票据
- Kerberos 防重放靠**时间戳**；票据有时效性
- Kerberos 适合域内（Windows AD）；PKI 适合跨域
- X.509 证书关键字段：**序列号/颁发者/有效期/主体/主体公钥/CA签名**
- 证书验证：**验签名→查有效期→查吊销→查域名**
- SAN 扩展支持多域名；KeyUsage 限定密钥用途
