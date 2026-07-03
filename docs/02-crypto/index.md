---
title: 密码学总览
description: 密码学整体框架与分类
---

# 二、密码学基础与应用 ⭐

> 本模块占分约 **25%**，是上午选择题和下午大题的高频考点区。务必掌握。

## 密码学五大功能（安全服务 CIA+）

> 🎯 **形象记忆**：想象你在寄一封机密信件——
> - **机密性**：信件装进密封信封，别人看不到内容（防偷看）
> - **完整性**：信封上有封蜡印记，被拆开过能发现（防篡改）
> - **可用性**：收件人随时能拿到信（防丢失）
> - **认证性**：信上有发件人签名，确认身份（防冒充）
> - **不可否认性**：签名是唯一的，发件人赖不掉（防否认）

| 功能 | 英文全拼 | 说明 | 对应威胁 |
|------|----------|------|----------|
| **机密性** | Confidentiality | 信息不被未授权获取 | 窃听 |
| **完整性** | Integrity | 信息不被篡改 | 篡改 |
| **可用性** | Availability | 信息随时可用 | DoS(Denial of Service，拒绝服务) |
| **认证性** | Authentication | 实体身份可验证 | 伪造 |
| **不可否认性** | Non-repudiation | 行为不可抵赖 | 否认 |

> 🔑 **CIA 是核心三性**，认证性和不可否认性是扩展。考试常考"哪个不属于 CIA"——选认证/不可否认。

## 密码体制分类

> 🎯 **形象比喻**：
> - **对称加密** = 一把钥匙开锁和上锁（加解密同钥，快但钥匙怎么传？）
> - **非对称加密** = 一个信箱口（公钥，人人可投信）+ 一把钥匙（私钥，只有你能开信箱取信）
> - **哈希** = 指纹（同一个人指纹唯一且不可逆，但无法从指纹还原出人）
> - **数字签名** = 盖章（私钥盖章唯一，公钥验章人人可验）

```
密码学
├── 对称加密（单钥）— 加解密同一密钥，速度快
│   ├── 分组密码(Block Cipher)：DES / 3DES / AES / SM4 / IDEA
│   └── 流密码(Stream Cipher)：RC4 / ChaCha20
├── 非对称加密（双钥）— 公钥加密/私钥解密，速度慢
│   └── RSA / ECC / ElGamal / SM2 / DH(Diffie-Hellman, 密钥协商)
├── 哈希函数(Hash) — 单向，定长输出，验证完整性
│   └── MD5 / SHA(Secure Hash Algorithm)-1/256 / SM3
└── 密码协议 — 综合应用
    └── 数字签名 / PKI / SSL-TLS / IPSec
```

### 英文缩写速查

| 缩写 | 全拼 | 中文 |
|------|------|------|
| DES | Data Encryption Standard | 数据加密标准 |
| AES | Advanced Encryption Standard | 高级加密标准 |
| RSA | Rivest-Shamir-Adleman(三人姓) | RSA 算法 |
| ECC | Elliptic Curve Cryptography | 椭圆曲线密码 |
| DH | Diffie-Hellman(两人姓) | 迪菲-赫尔曼密钥交换 |
| SHA | Secure Hash Algorithm | 安全哈希算法 |
| MAC | Message Authentication Code | 消息认证码 |
| HMAC | Hash-based MAC | 基于哈希的消息认证码 |
| PKI | Public Key Infrastructure | 公钥基础设施 |
| CA | Certificate Authority | 证书颁发机构 |
| CRL | Certificate Revocation List | 证书吊销列表 |
| OCSP | Online Certificate Status Protocol | 在线证书状态协议 |

## 两大安全原则（Shannon 香农）

> 🎯 **形象比喻**：
> - **混淆 Confusion** = 把钥匙和锁的关系搞得很复杂（S 盒就像一个"乱序表"，让密钥和密文关系难以分析）
> - **扩散 Diffusion** = 牵一发而动全身（明文改 1 位，密文很多位都变，像多米诺骨牌）

- **混淆 Confusion**：让密钥与密文关系尽量复杂（抗统计分析）→ S 盒实现
- **扩散 Diffusion**：让明文每一位影响密文多位 → 置换/移位实现

## 分组密码工作模式（高频考点）

| 模式 | 特点 | 是否并行 | 典型用途 |
|------|------|----------|----------|
| **ECB** | 相同明文块→相同密文块，不安全 | 加解密均可并行 | 单块加密 |
| **CBC** | 前块密文异或后块明文，需 IV | 解密可并行 | 通用 |
| **CFB** | 流密码化，反馈密文 | 否 | 流式 |
| **OFB** | 输出反馈，密钥流独立 | 否 | 流式 |
| **CTR** | 计数器模式，转流密码 | 加解密均可并行 | 高性能 |

> 🔑 必记：**ECB 最简单但最不安全**（不能隐藏明文模式）；**CBC/CTR 最常用**。

---

## 子章节导航

- [古典密码](./classical)（凯撒/维吉尼亚 + 动画）
- [对称加密-AES](./symmetric)（状态矩阵动画）
- [对称加密-DES](./des)（Feistel 网络动画）
- [非对称加密-RSA](./asymmetric)（加解密步骤动画）
- [哈希函数](./hash)（雪崩效应动画）
- [数字签名](./signature)
- [PKI/CA](./pki)
- [国密算法](./national-crypto)（SM2/SM3/SM4）
