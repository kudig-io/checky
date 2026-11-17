# MaxCompute（maxcompute）

云原生大数据计算服务（原 ODPS）：Serverless 存算分离的托管数仓，按项目（Project）隔离，计算以 CU 为单位，存储分标准/低频/长期三层。

## 文件（公共云主线）

| 文件 | 内容 |
|---|---|
| [01-产品架构.md](01-产品架构.md) | 架构图、组件清单、存储/计算/运维三层、Project 模型、ACID 语义、SLA |
| [02-计算类型与规格.md](02-计算类型与规格.md) | 计费模式（按量/包年包月/按时）、SQL/MR/Graph 等计算类型对比、选型速查 |
| [03-表与任务参数.md](03-表与任务参数.md) | 表/分区/列上限、单任务限制、小文件官方数字 |
| [04-配套参数.md](04-配套参数.md) | 数据集成（DataWorks/DTS）、Tunnel 上传下载限制、冷热分层与生命周期 |
| [05-网络参数.md](05-网络参数.md) | Endpoint 三网、PrivateLink、跨项目访问、公网关闭后连通 |
| [06-配额与限制.md](06-配额与限制.md) | CU 购买上限、并发作业数、Slot、Package/Role/User 配额 |
| [07-计费与生命周期.md](07-计费与生命周期.md) | CU-小时与 CU/月价格、存储分层计费、公网下载、免费额度、欠费规则 |
| [08-日志与审计.md](08-日志与审计.md) | 日志类型总表、关键字段、投递加工、ActionTrail 审计留痕 |
| [09-监控与告警.md](09-监控与告警.md) | CloudMonitor 核心指标、官方告警、通知渠道、告警配额 |

**来源**：
- 什么是MaxCompute（产品定位与文档口径）：https://help.aliyun.com/zh/maxcompute/user-guide/what-is-maxcompute ｜ 复核：2026-11-16

## 口径说明

- 全部为公共云（中国站）口径，金融云价格单列时已标注。
- 所有数字均来自 help.aliyun.com 官方文档，复核日期 2026-11-16。
- MaxCompute 的 DTS 指其自带的「数据传输服务（Tunnel）」，与阿里云独立的 DTS 产品不同。

**来源**：
- 计费项与计费方式概述（计费以项目为单位）：https://help.aliyun.com/zh/maxcompute/overview-price ｜ 复核：2026-11-16
- 数据传输服务概述（DTS/Tunnel 口径）：https://help.aliyun.com/zh/maxcompute/overview-of-dts ｜ 复核：2026-11-16
