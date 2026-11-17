# 开源大数据平台 EMR（emr）

> 产品：EMR ｜ 口径：公共云 ｜ 复核：2026-11-17

一句话定位：阿里云 E-MapReduce（EMR）是在 ECS/ACK/Serverless 上托管运行 Hadoop、Spark、Flink、Hive 等开源大数据组件的集群管控与运维平台，主线形态 EMR on ECS 为半托管。

## 文件

- [01-产品架构.md](01-产品架构.md) — 架构图、组件清单、EMR 是什么、Master/Core/Task 节点角色、组件栈、与 OSS 协同、SLA
- [02-集群类型与版本.md](02-集群类型与版本.md) — 部署形态、五类业务场景（集群类型）、发行版本与组件版本矩阵、选型速查
- [03-节点规格.md](03-节点规格.md) — ECS 规格族映射、节点数上下限、规格推荐、扩容/缩容/升配参数
- [04-存储与配套.md](04-存储与配套.md) — HDFS vs OSS-HDFS/OSS、磁盘与容量评估、数据湖格式、配套服务
- [05-网络参数.md](05-网络参数.md) — VPC 与交换机、安全组与组件端口、公网访问
- [06-配额与限制.md](06-配额与限制.md) — 节点组配额、扩缩容与变更限制、账号级限制、高危操作
- [07-计费与生命周期.md](07-计费与生命周期.md) — 节点按量/包年包月 + 服务费、Serverless Spark CU 计费、欠费与释放
- [08-日志与审计.md](08-日志与审计.md) — 日志类型、关键字段（组件日志/作业日志/审计事件）、投递加工、ActionTrail 留痕
- [09-监控与告警.md](09-监控与告警.md) — 核心指标、官方默认告警模板、通知渠道、告警配额

**来源**：
- EMR on ECS 文档目录（文件主题对应关系）：https://help.aliyun.com/zh/emr/emr-on-ecs/ ｜ 复核：2026-11-16

## 口径与分支

- 主线口径为 EMR on ECS；EMR on ACK、EMR Serverless Spark、EMR Serverless StarRocks、EMR Workflow 在 02 与 07 篇按形态分列。
- 本目录暂无分支子目录（专有云/代际快照）。
- 每个 `##` 小节末尾附官方来源与复核日期；数字与官方页对不上时标 `⚠️ 待核`。

**来源**：
- 开源大数据平台 E-MapReduce 产品首页：https://help.aliyun.com/zh/emr/ ｜ 复核：2026-11-16
- 产品计费索引（EMR 各形态）：https://help.aliyun.com/zh/emr/billing ｜ 复核：2026-11-16
