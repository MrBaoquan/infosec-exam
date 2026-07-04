---
title: 备考路线图
description: 4周备考学习计划与节奏建议
sidebar_position: 0
---

# 🗺️ 备考路线图

> 按此路线图学习，4 周可系统覆盖全部考点。每天 1-2 小时即可。

## 第 1 周：基础 + 密码学（占 35%+，必拿分）

| 日 | 学习内容 | 时长 | 重要度 | 链接 |
|:--:|----------|:----:|:------:|------|
| 1 | 信息安全概念、CIA 三性 | 1h | ★★★ | [基础](../fundamentals/concepts) |
| 2 | 安全模型(BLP/Biba) | 1h | ★★★ | [安全模型](../fundamentals/models) |
| 3 | 法律法规、等保简介 | 1h | ★★ | [法律法规](../fundamentals/laws) |
| 4 | 古典密码 + DES + AES | 1.5h | ★★★ | [古典](../crypto/classical) / [DES](../crypto/des) / [AES](../crypto/symmetric) |
| 5 | 哈希 + 非对称 RSA + DH | 1.5h | ★★★ | [哈希](../crypto/hash) / [RSA](../crypto/asymmetric) |
| 6 | 数字签名 + PKI + Kerberos | 1.5h | ★★★ | [签名](../crypto/signature) / [PKI](../crypto/pki) / [Kerberos](../crypto/kerberos-x509) |
| 7 | 国密算法 + 密码学大题练习 | 1.5h | ★★ | [国密](../crypto/national-crypto) / [大题](../exam-cases/crypto-case) |

## 第 2 周：网络安全 + 系统安全（占 35%）

| 日 | 学习内容 | 时长 | 重要度 | 链接 |
|:--:|----------|:----:|:------:|------|
| 8 | OSI七层 + 协议安全 + 安全模型 | 1.5h | ★★★ | [OSI](../network/osi-model) / [协议](../network/protocol-security) / [体系模型](../network/security-system-model) |
| 9 | 攻击原理 + 网络攻击 + 防火墙 | 1.5h | ★★★ | [攻击原理](../network/attack-principles) / [攻击](../network/attacks) / [防火墙](../network/firewall) |
| 10 | IDS/IPS + VPN/IPSec + TLS/HTTPS | 1.5h | ★★★ | [IDS](../network/ids-ips) / [IPSec](../network/vpn-ipsec) / [TLS](../network/tls-https) |
| 11 | 操作系统安全 + 访问控制 | 1.5h | ★★★ | [OS](../system/os-security) / [访问控制](../system/access-control) |
| 12 | 恶意代码 + 漏洞应急 | 1h | ★★ | [恶意代码](../system/malware) / [漏洞](../system/vulnerability-incident) |
| 13 | 网络安全大题练习 | 1h | ★★★ | [网络大题](../exam-cases/network-case) |
| 14 | 题库练习：密码学+网络+系统 | 1h | ★★ | [题库](/quiz) |

## 第 3 周：应用安全 + 管理工程（占 30%）

| 日 | 学习内容 | 时长 | 重要度 | 链接 |
|:--:|----------|:----:|:------:|------|
| 15 | Web 攻击(SQL/XSS/CSRF) | 1.5h | ★★★ | [Web攻击](../application/web-attacks) |
| 16 | 数据库 + 邮件移动安全 | 1h | ★★ | [数据库](../application/database) / [邮件](../application/email-mobile) |
| 17 | 云安全 + 物联网 | 1h | ★ | [云安全](../application/cloud-iot) |
| 18 | 风险评估 + 等保2.0 | 1.5h | ★★★ | [风险评估](../management/risk-assessment) / [等保](../management/level-protection) |
| 19 | BCP/DRP + 安全管理 | 1h | ★★ | [BCP](../management/bcp-drp) / [管理](../management/security-management) |
| 20 | 安全工程 + Web/管理大题 | 1.5h | ★★★ | [工程](../engineering/engineering-detail) / [Web大题](../exam-cases/web-case) |
| 21 | 题库练习：应用+管理+综合 | 1h | ★★ | [题库](/quiz) |

## 第 4 周：大题专项 + 模拟冲刺

| 日 | 学习内容 | 时长 | 重要度 | 链接 |
|:--:|----------|:----:|:------:|------|
| 22 | 5 类下午大题通读 | 2h | ★★★ | [大题总览](../exam-cases) |
| 23 | 综合分析大题 + 整改方案 | 1.5h | ★★★ | [综合大题](../exam-cases/comprehensive-case) |
| 24 | 错题重做（题库错题本） | 1h | ★★★ | [题库](/quiz) |
| 25 | 全部考点速记复习 | 1.5h | ★★★ | 各章"考点速记" |
| 26-28 | 查漏补缺 + 真题模拟 | 2h/天 | ★★★ | 重点复习薄弱模块 |

## 学习方法建议

### ✅ 高效学习法
1. **先读文档**：每篇 10-15 分钟通读，重点关注表格和"考点速记"
2. **看动画**：密码学章节务必操作动画，直观理解算法
3. **做小测**：每学完一章去[题库](/quiz)做对应分类练习
4. **练大题**：第 4 周重点练下午大题，背答题模板
5. **记错题**：错题自动进错题本，考前重做

### 📊 得分策略
| 模块 | 目标得分率 | 说明 |
|------|:----------:|------|
| 密码学 | 90%+ | 必拿分，动画+大题模板 |
| 网络安全 | 80%+ | 高频，理解为主 |
| 应用安全 | 80%+ | Web 攻击大题高频 |
| 管理工程 | 70%+ | 记忆为主 |
| 下午大题 | 60%+ | 答题模板+规范术语 |

> 上午 45/75 及格、下午 45/75 及格，**两科同时达标**才能通过。

## 进度追踪

学习时每篇文档右下角点击标记学习状态（⚪未学→🟡学习中→🟢已掌握），首页 Dashboard 会显示总体进度。
