---
title: 网络协议安全
description: TCP/IP 各层安全协议与脆弱性
---

# 网络协议安全

## TCP/IP 各层对应安全技术

| 层次 | 协议/技术 | 说明 |
|------|-----------|------|
| 链路层 | PPP/CHAP、PPTP、L2TP | 链路加密、点对点认证 |
| 网络层 | **IPSec**、包过滤防火墙 | 端到端加密、访问控制 |
| 传输层 | **SSL/TLS**、SSH | 传输加密、身份认证 |
| 应用层 | HTTPS、S/MIME、PGP、SET | 应用级安全 |

## 常见协议脆弱性（高频考点）

### ARP 协议
- **无认证机制**：任何主机可发送伪造 ARP 应答
- 攻击：**ARP 欺骗/中间人**（伪造网关 MAC，劫持流量）
- 防护：静态 ARP 绑定、**DAI**（动态 ARP 检测）、端口安全

### DNS 协议
- **明文传输、无认证**：可被劫持、投毒
- 攻击：DNS 欺骗、DNS 劫持、DNS 放大攻击
- 防护：**DNSSEC**（数字签名验证）、DNS over HTTPS

### HTTP 协议
- 明文传输：可被窃听、篡改
- 防护：使用 **HTTPS**（HTTP over TLS）

### TCP 协议
- **三次握手**脆弱性：SYN Flood 攻击（半连接耗尽）
- 防护：SYN Cookie、连接限速、防火墙

### ICMP 协议
- 可被用于探测（Ping 扫描）、DoS（Smurf 攻击）
- 防护：禁用不必要的 ICMP、防火墙过滤

## 常见网络设备安全

| 设备 | 安全要点 |
|------|----------|
| 路由器 | 关闭不必要服务、修改默认口令、ACL、SNMPv3 |
| 交换机 | 端口安全、VLAN 隔离、DHCP Snooping、DAI |
| 防火墙 | 见防火墙专题 |

## 考点速记

- ARP 无认证→ARP 欺骗；防：静态绑定/DAI
- DNS 明文无认证→DNS 欺骗；防：**DNSSEC**
- TCP 三次握手→SYN Flood；防：**SYN Cookie**
- 链路层→网络层→传输层→应用层，记住每层代表协议
- ICMP 用于 Smurf 攻击（放大 DoS）
