# checky 待办清单

> 快照：2026-11-24 ｜ 基线：v2.1 已完成并推送（20 产品 × 9 篇、69 张 Mermaid 图、六项 gate 全绿）
> 本文件供 Qoder IDE 会话直接执行：每项含做法与验收；执行完勾选并回写本文件。

## 环境注意事项（执行前必读）

- **macOS TCC**：若所有命令报 `EPERM … Documents`，先到 系统设置 → 隐私与安全性 → 文件与文件夹/完全磁盘访问 给宿主应用勾选「文稿」（2026-11-24 已恢复，勿重复踩坑）
- **网络**：help.aliyun.com 为 JS 渲染，抓取用 `llms.txt` 索引 + `.md` 直链；github.com:443 可能间歇不可达（api.github.com 通），push 失败就每 2 分钟重试；Mermaid 渲染用 `npx -y @mermaid-js/mermaid-cli`
- **来源纪律**（CONTRIBUTING 强制）：每个 `##` 小节末尾恰好 1 个 `**来源**` 块（URL + 复核日期）；数字对不上标 `⚠️ 待核`；官方缺位标 `📋 待补`；仅阿里云官方域
- **现成资产**：批次生产/清偿的代理提示词模式见 `docs/development-plan.md`；六项 gate 命令见下文 P1

---

## P0 · 本地 Web 预览站（✅ 2026-11-24 完成，五项验收全绿）

- [x] 新建 `package.json`：devDeps = `vitepress ^1.6.3`、`vitepress-plugin-mermaid ^2.0.17`、`mermaid ^11.4.1`；scripts：`dev/build/preview` = `vitepress dev|build|preview .`
- [x] 新建 `.vitepress/config.mjs`：`withMermaid(defineConfig(...))`
  - 侧边栏自动生成：扫描 `products/*/`，每产品 = 导览 + 编号篇目（去 `NN-` 前缀显示），分支子目录（如 `apsara-v3.18.6`）作折叠组
  - nav：首页 / 产品索引 `/products/INDEX` / 快速上手 `/docs/quickstart` / GitHub
  - `search: { provider: 'local' }`（在 `themeConfig` 下）、`cleanUrls: true`、`outline: [2,3]`
  - **必须** `vite.optimizeDeps.include: ['mermaid']`：mermaid 只被 md 页面动态引用，不显式 include 会导致 dev 注水失败（fastdom CJS interop 报错）
- [x] 新建根 `index.md`：VitePress `layout: home`（hero：云速查 checky + 4 个 features：20 产品/69 图/来源强制/九篇结构）
- [x] `npm install && npm run dev` → 浏览器验收（本机 5173~5175 被其他项目占用，实际 5176，端口以终端提示为准）
- [x] 验收：① 首页 hero 正常 ② 任一产品 9 篇可翻、侧边栏分支折叠可用 ③ 抽检 3 张 Mermaid 图渲染 ④ 本地搜索命中 ⑤ `npm run build` 通过
- [x] README「约定」区补一行本地预览命令
- [x] 附带修复（build 死链 73→0）：全库 68 处目录式交叉链接 `../<code>/` → `../<code>/README`；README/quickstart 的 INDEX 链接改 `INDEX`；LICENSE 链接外链化；模板示例链接转行内码

## P1 · Gate 脚本化 + CI（✅ 2026-11-25 完成，六项全绿 + 负向验证）

- [x] 新建 `scripts/gate.sh`，六项全绿为通过：
  1. 逐节来源 1:1：`awk` 数每文件 `^## ` 与 `^\*\*来源\*\*`，来源数 < 节数即失败（范围 `products/*/0*.md` 共 180 篇；README 导览与分支文件不在此项，分支 1:1 由 P2 落地验收）
  2. 头部：所有 `products/*/0*.md` 第 3 行含 `口径：公共云 ｜ 复核：`（180/180）
  3. 目录 ↔ INDEX 双向一致（正则抽 `[code/]` 对照目录，20↔20）
  4. 来源域：仅抽 `**来源**` 块内的 URL，域名后缀白名单 `aliyun.com / alicdn.com / alibabacloud.com / aliyuncs.com`
  5. schema 列齐：08 总表须 `| 类型 |` 开头 ≥5 列且含 产生方/是否计费（rds-mysql 6 列、polardb 列名变体均放行）；08 详表 `字段.*类型.*含义` 按正则判（允许 类型/取值 等中列变体）；09 指标表 `含义.*单位.*统计周期.*维度`
  6. 断链：`scripts/check-links.mjs` 扫描全库 md 相对链接（剥锚点/容忍 URL 编码/目录→README|INDEX 兜底；模板/设计稿/开发计划排除；代码块不参与）
  - 实现细节：全程 `-print0`（`products/vpc/03-VPC 参数.md` 文件名带空格）；macOS bash 3.2 兼容
  - 负向验证：注入 无来源小节 / 非白名单域名 / 死链，三项全部被拦
- [x] 新建 `scripts/render-diagrams.mjs`：抽取全部 ```` ```mermaid ```` 块 → mmdc 渲染（products 69 张 + 模板示例 1 张 = 70 张全过；并发 4；`--no-sandbox` 兼容 CI root；坏图注入验证退出非 0）
- [x] 新建 `.github/workflows/ci.yml`：push(main)/PR 触发 → `npm ci` → `bash scripts/gate.sh` → 渲染脚本
- [x] 验收：本地 `bash scripts/gate.sh` 全绿；Actions 首跑 45537388074 失败（70 图统一失败，渲染环境问题：npx 瞬态装 Chrome 不可靠 + 24.04 AppArmor 阻 Chrome）→ `ad2c2d3` 修复（mermaid-cli 入 devDeps、runner 固定 ubuntu-22.04、stderr 透出）→ 二跑 45538809423 **success**

## P2 · DP-16 专有云 3.18.6 分支（挂起，待语料）

- [ ] 确认语料来源：阿里云专有云企业版 3.18.6 官方文档（help/导出文档/离线包）
- [ ] 语料**就绪** → 五件套 OSS/NAS/VPC/SLB/RDS 各建 `products/<code>/apsara-v3.18.6/`：
  - `README.md`（口径来源 + 与公共云 3~5 条差异表 + 目录）
  - `01-架构与差异.md`、`02-资源规格.md`（本地命名体系，参照 `products/ecs/apsara-v3.18.6/` 骨架）
  - 逐节来源 + 分支口径头部 `> 产品：X ｜ 口径：专有云 v3.18.6 ｜ 复核：<日期>`
- [ ] 语料**不就绪** → 保持挂起，INDEX 不标不编
- [ ] 验收：分支 3 篇 ×5 产品、来源 1:1、INDEX 分支列更新、`docs/development-plan.md` DP-16 解除暂缓

## P3 · 复核周期运转（激活 🕐 机制）

- [ ] 建立节奏：每月抽 1 批（5~6 产品）复查 `⚠️ 待核`（当前 118 条，全部为双页冲突/登录后口径，注明 2026-11-18 复核）
- [ ] 每批动作：回官方页复查 → 能定的消解、定不了的刷新复查日期 → 改动文件头复核日期刷新 → 跑 `scripts/gate.sh`
- [ ] 复核记录追加到 `docs/development-plan.md` 末尾「复核日志」小节（日期/批次/消解数）
- [ ] 距上次复核 >12 个月的文件在 INDEX 标 🕐（规则已写，需首次执行）
- [ ] 验收：复核日志 ≥1 条、gate 全绿、提交推送

## P4 · 公共云第二批产品扩围（选型后执行）

- [ ] **选型确认**（用户拍板）候选池：SLS 日志服务、EIP、快照、镜像、函数计算 FC、SAE、AnalyticDB、PolarDB-X、Tair、CDT、消息队列 Kafka/RocketMQ、微服务 MSE、DNS、WAF、SASE…首批建议 5~8 个
- [ ] 每产品流程（复用 v1/v2 模式）：
  1. 复制 `docs/template-product.md` → `products/<code>/README.md` + 9 篇骨架
  2. 并行调研代理生产（llms.txt + `.md` 直链），逐节来源 + 复核日期
  3. INDEX 登记 🚧 → 内容 ≥60% 后跑 gate → ✅
  4. 图谱标配：01 架构图 + 08 日志流转图 + 09 告警链路图（复杂产品加 01 关键链路/02 决策树）
- [ ] 验收：每产品六项 gate 绿、README/INDEX 统计更新、分笔提交推送

## P5 · 多云分支试点（design §八预留）

- [ ] 用户确认首个非阿里云（建议 AWS）与产品范围（建议 ECS/OSS 对照 2 个）
- [ ] `products/ecs/aws/` 分支骨架：README（口径来源+差异表）+ 01/02 篇；来源域白名单按分支放行（docs.aws.amazon.com 等）
- [ ] 验收：1 个试点分支完成 → 结论回写 `docs/design.md` §八（分支命名、域白名单规则）

## P6 · 静态站发布（依赖 P0）

- [ ] `npm run build` 产物发布 GitHub Pages（Actions workflow：build → deploy-pages）
- [ ] README 顶部加 Pages 链接徽章
- [ ] 验收：公网 URL 可访问、图与搜索可用

---

## 优先级与依赖

```
P0 本地站 ──→ P6 Pages 发布
P1 CI（独立，建议紧随 P0）
P2 DP-16（等语料，随时可插队）
P3 复核（月度节奏，独立）
P4 扩围（等选型）──→ P5 多云（等确认）
```

## 当前仓库状态速记

- 远端 `main` = 本地（以 `git log origin/main..main` 为准，应为空）；P0/P1 已完成推送，CI 绿（badge 未加，P6 一并做）
- 标记存量：`⚠️ 待核` 118 ｜ `📋 待补` 187（控制台口径/结构性已分类）
- 图：69 张（架构 20 / 日志流转 20 / 告警链路 20 / 关键链路 6 / 决策树 3）+ 模板示例 1 = CI 渲染 70
- 计划：`docs/development-plan.md` DP-01~18 全部勾选（v2.1 完成）
- 站点资产：VitePress 三件套（P0）、scripts/{gate.sh, check-links.mjs, render-diagrams.mjs} + .github/workflows/ci.yml（P1）
