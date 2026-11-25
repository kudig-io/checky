#!/usr/bin/env node
// 抽取仓库全部 md 的 ```mermaid 块，逐块经 mmdc 渲染为 SVG，任一失败退出非 0。
// 用法：node scripts/render-diagrams.mjs （CI 与本地同构；首次运行 npx 会拉取 mermaid-cli 与 Chromium）
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CONCURRENCY = 4
const TIMEOUT_MS = 120000
// 优先用仓库内安装的 mmdc（npm ci 已带 Chrome），缺省回落 npx -y 在线取
const MMDC = path.join(ROOT, 'node_modules', '.bin', 'mmdc')
const runMmdc = fs.existsSync(MMDC)
  ? (args, cb) => execFile(MMDC, args, { timeout: TIMEOUT_MS }, cb)
  : (args, cb) => execFile('npx', ['-y', '@mermaid-js/mermaid-cli', ...args], { timeout: TIMEOUT_MS }, cb)

const files = []
;(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.vitepress'].includes(entry.name)) continue
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p)
    else if (entry.name.endsWith('.md')) files.push(p)
  }
})(ROOT)

const diagrams = []
for (const file of files) {
  const rel = path.relative(ROOT, file).replaceAll(path.sep, '/')
  const src = fs.readFileSync(file, 'utf-8')
  const re = /^```mermaid\s*\n([\s\S]*?)^```\s*$/gm
  let m
  while ((m = re.exec(src))) diagrams.push({ rel, code: m[1] })
}
console.log(`抽取 ${files.length} 个 md，共 ${diagrams.length} 个 mermaid 块`)

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'checky-mmdc-'))
// CI 以 root 运行 Chromium 必须 --no-sandbox；本地无副作用
const pptrCfg = path.join(tmp, 'puppeteer.json')
fs.writeFileSync(pptrCfg, JSON.stringify({ args: ['--no-sandbox'] }))

function render(d, i) {
  const input = path.join(tmp, `d-${i}.mmd`)
  const output = path.join(tmp, `d-${i}.svg`)
  fs.writeFileSync(input, d.code)
  return new Promise((resolve) => {
    runMmdc(['-i', input, '-o', output, '-p', pptrCfg, '--quiet'], (err, _stdout, stderr) => {
      resolve({
        ...d,
        i,
        err: err ? String(err.message).split('\n')[0] : null,
        stderr: err ? String(stderr || '').trim().split('\n').slice(-3).join(' | ') : null
      })
    })
  })
}

const failures = []
let cursor = 0
async function worker() {
  while (cursor < diagrams.length) {
    const i = cursor++
    const r = await render(diagrams[i], i)
    if (r.err) failures.push(r)
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))
fs.rmSync(tmp, { recursive: true, force: true })

if (failures.length) {
  console.error(`✗ ${failures.length}/${diagrams.length} 个图渲染失败：`)
  for (const f of failures) console.error(`    ${f.rel} #${f.i + 1}  ${f.stderr || f.err}`)
  // 全军覆没多为环境问题（Chrome 缺失/沙箱拦截），展开首例完整错误便于定位
  if (failures.length === diagrams.length && failures[0]) {
    console.error(`\n[首例完整错误] ${failures[0].rel} #${failures[0].i + 1}`)
    console.error(failures[0].stderr || failures[0].err)
  }
  process.exit(1)
}
console.log(`✓ ${diagrams.length} 个 mermaid 图全部渲染通过`)
