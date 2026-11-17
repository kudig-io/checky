# 云原生数据库 PolarDB（polardb）

> 产品：PolarDB ｜ 口径：公共云 ｜ 复核：2026-11-16

存算分离的云原生关系型数据库：多计算节点共享一份分布式存储，一写多读（集群版）或多写多读（Limitless），MySQL 兼容为主线。

## 文件（公共云主线，PolarDB MySQL 版为主）

| 文件 | 内容 |
|---|---|
| [01-产品架构.md](01-产品架构.md) | 架构图、组件清单、存算分离/共享存储、一写多读、企业版与标准版定位、多可用区与 SLA |
| [02-集群与节点规格.md](02-集群与节点规格.md) | 节点类型（主/只读/列存/AI/搜索/热备）、通用与独享规格族、选型速查 |
| [03-实例参数.md](03-实例参数.md) | 代表规格 CPU/内存、最大连接数、官方 QPS 白皮书数字、并行查询特性 |
| [04-存储与配套.md](04-存储与配套.md) | 存储类型与计费单位（GB/PCU/CU，无 ACU）、备份体系与保留期、只读节点扩缩容 |
| [05-网络参数.md](05-网络参数.md) | 主地址/集群地址/自定义地址体系、VPC/端口、数据库代理配置项 |
| [06-配额与限制.md](06-配额与限制.md) | 节点数/地址数/备份保留等默认配额与硬限制 |
| [07-计费与生命周期.md](07-计费与生命周期.md) | 包年包月/按量/Serverless、计费项与资源包、欠费与到期释放规则 |
| [08-日志与审计.md](08-日志与审计.md) | 慢查询/SQL 审计/错误日志类型与关键字段、SLS 投递加工、ActionTrail 管控留痕 |
| [09-监控与告警.md](09-监控与告警.md) | 核心监控指标、官方默认与推荐告警、通知渠道、告警配额 |

**来源**：
- PolarDB 产品简介：https://help.aliyun.com/zh/polardb/product-introduction ｜ 复核：2026-11-16
- 企业版产品系列：https://help.aliyun.com/zh/polardb/polardb-for-mysql/polardb-for-mysql/overview ｜ 复核：2026-11-16

## 口径说明

- 口径：公共云（help.aliyun.com 官方文档），复核 2026-11-16。
- 「三节点版」不是 PolarDB 的产品系列：PolarDB MySQL 版产品版本为企业版/标准版，企业版下分集群版与多主集群（Limitless）；三可用区（RPO=0）是部署形态。RDS MySQL 三节点企业系列已于 2023-03-27 停止新购，与 PolarDB 无关。
- PolarDB 计费单位无 ACU：存储按 GB，Serverless 计算按 PCU，固定规格计算包按 CU（度）。ACU 是 AnalyticDB MySQL 的单位。

**来源**：
- 企业版和标准版功能对比：https://help.aliyun.com/zh/polardb/polardb-for-mysql/comparison-of-enterprise-edition-and-standard-edition ｜ 复核：2026-11-16
- 三节点企业系列（RDS，2023-03-27 停止新购）：https://help.aliyun.com/zh/rds/apsaradb-rds-for-mysql/financial-edition ｜ 复核：2026-11-16
- 计费项：https://help.aliyun.com/zh/polardb/polardb-for-mysql/billing-item/ ｜ 复核：2026-11-16
- 如何参与阿里云试用活动（PCU/ACU 定义）：https://help.aliyun.com/zh/document_detail/612726.html ｜ 复核：2026-11-16
