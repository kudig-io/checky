# checky · 云速查

按**产品维度**快速查看云产品**基础信息、组件、日志、告警、架构图**的速查手册：每个产品九篇展开——架构（Mermaid 架构图 + 组件清单）、资源类型与参数、配套、网络、配额、计费、日志与审计、监控与告警。所有数据取自官方文档，逐条标注来源。

> 名字读作 "checky"（check + y）：check = 核对。查一个参数，像抓快照一样快。

## 口径

- **主线**：公共云官方文档（以阿里云为主，逐步扩展多云）
- **分支**：同一产品的专有云/其他形态作为独立分支维度并存，如 `products/ecs/apsara-v3.18.6/`
- **事实优先**：只收录可核对的参数与架构事实；观点、营销话术不收
- **来源强制**：每个小节末尾列官方来源 URL 与复核日期；拿不准的数字标 `⚠️ 待核`

## 目录结构

```
products/
├── INDEX.md                 # 产品索引与覆盖状态（20 个产品）
├── ecs/                     # 每个产品一个目录，统一篇目结构（v2 九篇）：
│   ├── README.md            #   产品导览
│   ├── 01-产品架构.md       #   架构图 + 组件清单 + 资源模型 + 可靠性
│   ├── 02-… ~ 07-…          #   资源类型/参数/配套/网络/配额/计费（沿用 v1）
│   ├── 08-日志与审计.md     #   日志类型、字段、投递、审计留痕
│   ├── 09-监控与告警.md     #   核心指标、官方告警、通知渠道、告警配额
│   └── apsara-v3.18.6/      # 分支：专有云等独立形态并存
└── …（oss/nas/ebs/vpc/slb/rds-mysql/polardb/redis/mongodb/dts/
      ack/acr/cdn/nat/maxcompute/hologres/flink/emr/dataworks）
```

## 产品覆盖

四类共 **20 个产品**，状态与首版复核日期见 [products/INDEX.md](products/INDEX.md)：

- **计算存储网络**：ECS、OSS、NAS、EBS、VPC、SLB/ALB/NLB、CDN、NAT
- **数据库**：RDS MySQL、PolarDB、Redis、MongoDB、DTS
- **云原生**：ACK、ACR
- **大数据**：MaxCompute、Hologres、Flink、EMR、DataWorks

全库含 **69 张 Mermaid 图**（架构图、日志流转图、告警链路图、关键链路时序图、选型决策树），逐图带官方来源。

## 约定

- **新用户**：先看 [快速上手指南](docs/quickstart.md)（怎么查/怎么读/怎么信）
- 新增产品：读 [CONTRIBUTING.md](CONTRIBUTING.md) 与 [docs/template-product.md](docs/template-product.md)
- 数字类内容可能随官方更新而过时：每条事实带「来源 + 复核日期」，复核规则见 CONTRIBUTING

## License

代码与文档结构 [MIT](LICENSE)。各云厂商的产品参数与架构描述版权归原厂商所有，本项目仅以事实引用方式使用并注明出处。
