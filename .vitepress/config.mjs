import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// 仓库根目录（config.mjs 位于 .vitepress/ 下，上一级即根）
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PRODUCTS_DIR = path.join(ROOT, 'products')
const GITHUB_URL = 'https://github.com/kudig-io/checky'

/** 取 md 第一个一级标题作显示名，去掉尾部的「（code）」括注 */
function h1Title(mdPath, fallback) {
  try {
    const m = fs.readFileSync(mdPath, 'utf-8').match(/^#\s+(.+)$/m)
    if (m) return m[1].replace(/（[^）]*）\s*$/, '').trim()
  } catch { /* 缺文件时回退目录名 */ }
  return fallback
}

/** 篇目显示名：README → 「导览」，编号篇去掉 NN- 前缀 */
function displayName(fileName) {
  if (fileName === 'README.md') return '导览'
  return fileName.replace(/\.md$/, '').replace(/^\d{2}-/, '')
}

function mdItems(dirAbs, dirLinkPrefix, fileNames) {
  return fileNames.map((name) => ({
    text: displayName(name),
    link: `${dirLinkPrefix}/${name.replace(/\.md$/, '')}`
  }))
}

/** 扫描单个产品目录：导览 + 编号篇目 + 分支子目录（折叠组） */
function productGroup(code) {
  const dirAbs = path.join(PRODUCTS_DIR, code)
  const dirLinkPrefix = `/products/${code}`
  const files = []
  const branches = []
  for (const entry of fs.readdirSync(dirAbs, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === 'INDEX.md') continue
    if (entry.isDirectory()) {
      const subFiles = fs.readdirSync(path.join(dirAbs, entry.name)).filter((n) => n.endsWith('.md')).sort()
      branches.push({
        text: entry.name,
        collapsed: true,
        items: mdItems(path.join(dirAbs, entry.name), `${dirLinkPrefix}/${entry.name}`, subFiles)
      })
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(entry.name)
    }
  }
  // README 排最前（导览），编号篇按字典序即 01→09
  files.sort((a, b) => (a === 'README.md' ? -1 : b === 'README.md' ? 1 : a.localeCompare(b)))
  return {
    text: h1Title(path.join(dirAbs, 'README.md'), code),
    collapsed: true,
    items: [...mdItems(dirAbs, dirLinkPrefix, files), ...branches]
  }
}

/** 侧边栏：扫描 products 下各产品目录自动生成，README/INDEX 手写入口置顶 */
function productsSidebar() {
  const codes = fs.readdirSync(PRODUCTS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()
  return [
    {
      text: '产品索引',
      link: '/products/INDEX'
    },
    ...codes.map(productGroup)
  ]
}

const docsSidebar = [
  {
    text: '使用说明',
    items: [
      { text: '快速上手', link: '/docs/quickstart' }
    ]
  },
  {
    text: '内部文档',
    collapsed: true,
    items: [
      { text: '设计稿', link: '/docs/design' },
      { text: '开发计划', link: '/docs/development-plan' },
      { text: '产品模板', link: '/docs/template-product' }
    ]
  }
]

export default withMermaid(
  defineConfig({
    lang: 'zh-CN',
    title: '云速查 checky',
    description: '阿里云产品速查手册：20 个产品 × 9 篇结构化速查，逐节标注官方来源与复核日期',
    cleanUrls: true,
    outline: [2, 3],
    vite: {
      optimizeDeps: {
        // mermaid 是纯 ESM 大包且仅被 md 页面动态引用，dev 扫描器发现不了它，
        // 不显式 include 会导致其 CJS 依赖（如 fastdom）被裸服务而报 interop 错
        include: ['mermaid']
      }
    },
    themeConfig: {
      search: {
        provider: 'local',
        options: {
          translations: {
            button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
            modal: {
              noResultsText: '没有找到结果',
              resetButtonTitle: '清空关键词',
              footer: { selectText: '跳转', navigateText: '切换', closeText: '关闭' }
            }
          }
        }
      },
      nav: [
        { text: '首页', link: '/' },
        { text: '产品索引', link: '/products/INDEX' },
        { text: '快速上手', link: '/docs/quickstart' },
        { text: 'GitHub', link: GITHUB_URL }
      ],
      socialLinks: [{ icon: 'github', link: GITHUB_URL }],
      sidebar: {
        '/products/': productsSidebar(),
        '/docs/': docsSidebar,
        '/': productsSidebar()
      },
      docFooter: { prev: '上一篇', next: '下一篇' },
      lastUpdated: { text: '更新于' },
      returnToTopLabel: '回到顶部',
      sidebarMenuLabel: '菜单'
    }
  })
)
