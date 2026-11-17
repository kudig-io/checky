# VPC · 参数

> 产品：VPC ｜ 口径：公共云 ｜ 复核：2026-11-16

## VPC 与交换机数量参数

| 参数 | 默认值 | 能否提升 |
|---|---|---|
| 单个地域支持创建的 VPC 数量（vpc_quota_instances_num） | 10 个 | 可提升 |
| 单个 VPC 支持创建的交换机数量（vpc_quota_vswitches_num） | 150 个 | 可提升 |
| 单个 VPC 支持创建的路由器数量 | 1 个 | 无法提升 |
| 单个 VPC 支持创建的用户网段数量 | 3 个 | 无法提升 |
| 单个 VPC 支持绑定的标签数量 | 20 个 | 无法提升 |
| 单个交换机支持绑定的标签数量 | 20 个 | 无法提升 |

**来源**
- 限制与配额：https://help.aliyun.com/zh/vpc/understanding-vpc-quotas-in-alibaba-cloud
- 复核：2026-11-16

## 网段参数（IPv4/IPv6）

| 参数 | 默认值 | 能否提升 |
|---|---|---|
| 附加 IPv4 网段数量（vpc_quota_secondary_cidr_num） | 5 个 | 可提升 |
| 附加 IPv6 网段数量 | 5 个 | 无法提升 |
| IPv4 预留网段数量 | 100 个 | 无法提升 |
| IPv6 预留网段数量 | 100 个 | 无法提升 |
| 单个 VPC 支持云资源使用的私网网络地址数量 | 300,000 个 | 无法提升 |
| VPC 主 IPv4 网段掩码 | 16~28 位 | — |
| IPv4 预留网段掩码上限 | /28 | — |
| IPv6 预留网段掩码上限 | /80 | — |

- 私网地址计数口径：ECS 仅有一个私网 IP 时计 1 个；绑定多网卡或多 IP 时，按所有网卡分配的 IP 地址数量之和计。
- 冲突提示：旧版部分文档（2025 年前后镜像页）写附加 IPv4 网段为 1 个、私网地址 60,000 个；以当前官方配额页的 5 个 / 300,000 个为准。
- IPv6：为 VPC 和交换机开启 IPv6 后默认仅支持私网通信，公网需另行开通 IPv6 公网带宽。

**来源**
- 限制与配额：https://help.aliyun.com/zh/vpc/understanding-vpc-quotas-in-alibaba-cloud
- 专有网络与交换机：https://help.aliyun.com/zh/vpc/vpc-and-vswitch
- 复核：2026-11-16

## 网络 ACL 与安全组关系

| 对比项 | 网络 ACL | 安全组 |
|---|---|---|
| 作用范围 | 交换机级别，控制出入交换机的流量 | 实例（网卡）级别，控制实例出入站流量 |
| 工作方式 | 无状态：返回数据流必须被规则明确允许 | 有状态：返回数据流自动放行 |
| 关联关系 | 每个交换机仅允许绑定 1 个网络 ACL；仅能绑定所属 VPC 内交换机 | 一个 ECS 实例可加入多个安全组 |
| 规则匹配 | 按生效顺序依次匹配，命中首条即执行 | 按优先级排序后依次匹配；同优先级拒绝规则排在允许之前 |
| 不控制 | 同一交换机内 ECS 实例间流量 | — |
| 默认规则 | 仅 IPv4 的 VPC 创建 ACL 时，系统默认添加入/出方向「云服务规则」（允许私网域名解析与 ECS 元数据服务），优先级固定最高、不可修改删除 | — |

网络 ACL 配额：

| 配额 | 默认值 | 能否提升 |
|---|---|---|
| 单个网络 ACL 入方向规则数（vpc_quota_nacl_ingress_entry） | 20 条 | 可提升 |
| 单个网络 ACL 出方向规则数（vpc_quota_nacl_egress_entry） | 20 条 | 可提升 |
| 单个 VPC 支持创建的网络 ACL 数量（nacl_quota_vpc_create_count） | 20 个 | 可提升 |

安全组容量参数（VPC 维度）：

| 参数 | 默认值 |
|---|---|
| 单个 VPC 类型安全组可容纳私网 IP（普通安全组） | 6,000 |
| 单个 VPC 类型安全组可容纳私网 IP（企业级安全组） | 65,536 |

- 删除交换机前需确保其未绑定网络 ACL。
- 拒绝语义：网络 ACL 拒绝流量采用 drop，发起端无响应，表现为超时或无法建立连接。

**来源**
- 网络ACL：https://help.aliyun.com/zh/vpc/network-acl-overview
- 基础设施安全：https://help.aliyun.com/zh/vpc/infrastructure-security
- 限制与配额：https://help.aliyun.com/zh/vpc/understanding-vpc-quotas-in-alibaba-cloud
- ECS 使用限制（安全组 IP 容量）：https://help.aliyun.com/zh/ecs/limitations
- 复核：2026-11-16
