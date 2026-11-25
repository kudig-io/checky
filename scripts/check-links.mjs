#!/usr/bin/env node
// gate 第 6 项：断链检查。扫描仓库全部 md 的相对链接，按其所在目录解析，目标必须存在。
// 排除：设计稿/计划/模板内的示例占位符；围栏代码块与行内代码不参与匹配。
// 退出码：有死链 1，全绿 0。
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const EXCLUDED = new Set([
  'docs/template-product.md', // 模板示例占位符
  'docs/design.md', // 设计稿（含规划中的示意链接）
  'docs/development-plan.md' // 开发计划（历史过程记录）
])

const files = []
;(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.vitepress'].includes(entry.name)) continue
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p)
    else if (entry.name.endsWith('.md')) files.push(p)
  }
})(ROOT)

// 目标存在性判定：裸路径 / +.md / 目录下的 README|INDEX，锚点剥离，容忍 URL 编码
function targetExists(file, raw) {
  const decoded = (() => {
    try {
      return decodeURIComponent(raw)
    } catch {
      return raw
    }
  })()
  for (const t of [...new Set([raw, decoded])]) {
    if (t === '') return true // 纯锚点已剥空
    const base = path.resolve(path.dirname(file), t)
    const candidates = [
      base,
      `${base}.md`,
      path.join(base, 'README.md'),
      path.join(base, 'INDEX.md'),
      path.join(base, 'index.md')
    ]
    if (candidates.some((c) => fs.existsSync(c))) return true
  }
  return false
}

const dead = []
for (const file of files) {
  const rel = path.relative(ROOT, file).replaceAll(path.sep, '/')
  if (EXCLUDED.has(rel)) continue
  let src = fs.readFileSync(file, 'utf-8')
  src = src.replace(/^```[\s\S]*?^```/gm, '') // 围栏代码块（含 mermaid）
  src = src.replace(/`[^`\n]*`/g, '') // 行内代码（模板示例等）
  const re = /\]\(([^)]+)\)/g
  for (const m of src.matchAll(re)) {
    let target = m[1].trim()
    // 跳过外链/邮件/纯锚点；标题式链接（](path "title")）本库不存在，路径内空格属合法文件名
    if (/^(https?:|mailto:|#)/.test(target)) continue
    target = target.split('#')[0].trim()
    if (!targetExists(file, target)) dead.push(`${rel}  →  ${m[1]}`)
  }
}

if (dead.length) {
  console.log(`✗ 断链 ${dead.length} 处：`)
  for (const d of dead) console.log(`    ${d}`)
  process.exit(1)
}
console.log(`  ✓ ${files.length} 个 md 相对链接全部可达（模板/设计稿示例已排除）`)
