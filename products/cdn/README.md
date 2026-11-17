# 内容分发网络 CDN（cdn）

PaaS 级静态内容分发服务：把源站资源缓存到全球边缘节点，用户就近获取，回源仅在缓存未命中时发生。计费 = 基础服务（按流量/按带宽峰值/月结95 三选一，默认按流量）+ 增值服务（HTTPS 请求数、QUIC 请求数、实时日志等，按量可选）。

## 文件（公共云主线）

| 文件 | 内容 |
|---|---|
| [01-产品架构.md](01-产品架构.md) | 架构图、组件清单、节点规模、调度/缓存四系统、CNAME 加速流程、CDN/DCDN/ESA 关系、SLA |
| [02-域名与加速类型.md](02-域名与加速类型.md) | 三种业务类型、加速区域、添加域名与归属权验证、域名配置项总览 |
| [03-缓存与性能参数.md](03-缓存与性能参数.md) | 缓存规则与优先级、TTL 范围、用量封顶阈值、QPS/命中率口径 |
| [04-配套参数.md](04-配套参数.md) | HTTPS/证书、Referer 防盗链、IP 黑白名单、URL 鉴权、Range 回源 |
| [05-网络参数.md](05-网络参数.md) | 回源协议/HOST/SNI/回源 IP、IPv6、HTTP/2 与 QUIC、带宽统计口径 |
| [06-配额与限制.md](06-配额与限制.md) | 域名数、刷新预热配额、配置条数、报文长度、API 限速 |
| [07-计费与生命周期.md](07-计费与生命周期.md) | 流量/带宽阶梯价、月结95、突发带宽、资源包、欠费停服与域名回收 |
| [08-日志与审计.md](08-日志与审计.md) | 日志类型总表、关键字段、投递加工、ActionTrail 审计留痕 |
| [09-监控与告警.md](09-监控与告警.md) | CloudMonitor 核心指标、官方告警、通知渠道、告警配额 |

**来源**：
- 什么是阿里云CDN：https://help.aliyun.com/zh/cdn/product-overview/what-is-alibaba-cloud-cdn ｜ 复核：2026-11-16

## 口径与复核

- 口径：公共云（help.aliyun.com /zh/cdn/ 文档），不含国际站（alibabacloud.com）差异。
- 全部文件复核日期：01~07 为 2026-11-16，08/09 为 2026-11-17；每个 `##` 小节末尾附官方来源。
- 未查实的数字一律标 `⚠️ 待核`，不猜测。

**来源**：
- 什么是阿里云CDN：https://help.aliyun.com/zh/cdn/product-overview/what-is-alibaba-cloud-cdn ｜ 复核：2026-11-16
- 计费概述：https://help.aliyun.com/zh/cdn/product-overview/billing-overview ｜ 复核：2026-11-16
