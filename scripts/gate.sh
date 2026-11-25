#!/usr/bin/env bash
# checky 六项 gate —— 六项全绿为通过，任何一项失败退出非 0
# 用法：bash scripts/gate.sh
# 规则来源：TODO.md P1；各检查的范围与判定在对应小节注释里
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FAIL=0
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

ok()  { printf '  \033[32m✓\033[0m %s\n' "$1"; }
bad() { printf '  \033[31m✗\033[0m %s\n' "$1"; FAIL=1; }
sec() { printf '\n[%s]\n' "$1"; }

# ---- 1 逐节来源 1:1：products/<code>/0*.md 每文件 **来源** 块数 ≥ ## 小节数 ----
# （README 导览与分支文件不在本项范围：前者非内容篇，后者由 P2 落地时验收 1:1）
sec '1 逐节来源 1:1'
total1=0
find products -mindepth 2 -maxdepth 2 -name '[0-9][0-9]-*.md' -print0 |
while IFS= read -r -d '' f; do
  total1=$((total1 + 1))
  n_sec=$(grep -c '^## ' "$f")
  n_src=$(grep -c '^\*\*来源\*\*' "$f")
  if [ "$n_src" -lt "$n_sec" ]; then
    printf '%s  节=%s 来源=%s\n' "$f" "$n_sec" "$n_src" >> "$TMP/g1"
  fi
done
if [ -s "$TMP/g1" ]; then
  bad "来源缺口：$(wc -l < "$TMP/g1" | tr -d ' ') 个文件"
  cat "$TMP/g1" | sed 's/^/    /'
else
  ok "180 篇逐节来源齐（数量以 find 实际为准：$(find products -mindepth 2 -maxdepth 2 -name '[0-9][0-9]-*.md' | wc -l | tr -d ' ')）"
fi

# ---- 2 头部口径行：products/*/0*.md 第 3 行含「口径：公共云 ｜ 复核：」----
sec '2 头部口径行'
n2=0; bad2=0
for f in products/*/0*.md; do
  n2=$((n2 + 1))
  sed -n '3p' "$f" | grep -q '口径：公共云 ｜ 复核：' || {
    printf '%s  第3行=%s\n' "$f" "$(sed -n '3p' "$f")" >> "$TMP/g2"
    bad2=$((bad2 + 1))
  }
done
if [ "$bad2" -gt 0 ]; then
  bad "$bad2 个文件头部口径行缺失"
  cat "$TMP/g2" | sed 's/^/    /'
else
  ok "$n2 篇头部口径行齐"
fi

# ---- 3 目录 ↔ INDEX 双向一致：INDEX 表内 [code/] 与 products/ 实际目录互相覆盖 ----
sec '3 目录 ↔ INDEX 双向一致'
grep -oE '\[[a-z0-9-]+/\]\(' products/INDEX.md | sed -E 's/^\[([a-z0-9-]+)\/\]\($/\1/' | sort > "$TMP/codes"
find products -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | sort > "$TMP/dirs"
n3=$(wc -l < "$TMP/codes" | tr -d ' ')
if [ "$n3" -eq 0 ]; then
  bad "INDEX 未抽取到任何 [code/] 条目"
elif diff "$TMP/codes" "$TMP/dirs" > "$TMP/g3"; then
  ok "INDEX $n3 个条目 ↔ 目录 $(wc -l < "$TMP/dirs" | tr -d ' ') 个，双向一致"
else
  bad "INDEX 与目录不一致（< 仅 INDEX 有，> 仅目录有）"
  sed 's/^/    /' "$TMP/g3"
fi

# ---- 4 来源域：仅 **来源** 块内 URL，域名后缀白名单 ----
sec '4 来源域白名单'
# 仅抽 **来源** 块内 URL；-print0 + xargs -0 兼容带空格的文件名（如 vpc/03-VPC 参数.md）
find products -name '*.md' -print0 | sort -z | xargs -0 awk '/^\*\*来源\*\*$/{inblk=1; next} /^$/{inblk=0} inblk' > "$TMP/srcblocks"
grep -oE 'https?://[^ /｜)]+' "$TMP/srcblocks" | sed -E 's|https?://||; s|[[:punct:]]+$||' | sort -u > "$TMP/hosts"
n4=$(wc -l < "$TMP/hosts" | tr -d ' ')
grep -vE '^(.*\.)?(aliyun\.com|alicdn\.com|alibabacloud\.com|aliyuncs\.com)$' "$TMP/hosts" > "$TMP/g4" || true
if [ "$n4" -eq 0 ]; then
  bad "未从来源块抽取到任何 URL"
elif [ -s "$TMP/g4" ]; then
  bad "白名单外域名："
  sed 's/^/    /' "$TMP/g4"
else
  ok "$n4 个域名全部在官方白名单内"
fi

# ---- 5 schema 列齐：08 总表核心列 / 08 详表字段头 / 09 指标表列 ----
sec '5 schema 列齐'
bad5=0
for f in products/*/08-*.md; do
  head5=$(grep -m1 '^| 类型 |' "$f")
  if [ -z "$head5" ]; then
    printf '%s  缺「| 类型 |」总表\n' "$f" >> "$TMP/g5"; bad5=$((bad5 + 1)); continue
  fi
  # 总表 ≥5 列且含 产生方/是否计费（允许在标准 5 列外加列、保留期列名可变）
  cols=$(awk -F'|' -v h="$head5" 'BEGIN{n=split(h,a,"|"); for(i in a)c++; print c-2}') # 两端空段各占1
  echo "$head5" | grep -q '产生方' || { printf '%s  总表缺「产生方」列：%s\n' "$f" "$head5" >> "$TMP/g5"; bad5=$((bad5 + 1)); }
  echo "$head5" | grep -q '是否计费' || { printf '%s  总表缺「是否计费」列：%s\n' "$f" "$head5" >> "$TMP/g5"; bad5=$((bad5 + 1)); }
  [ "$cols" -ge 5 ] || { printf '%s  总表仅 %s 列（<5）：%s\n' "$f" "$cols" "$head5" >> "$TMP/g5"; bad5=$((bad5 + 1)); }
  # 详表：凡「字段」开头的表头，必须符合 字段|类型|含义 三列规范（中列允许 类型/取值、类型/示例 等变体）
  grep '^| 字段 |' "$f" | grep -vE '^\|[[:space:]]*字段[[:space:]]*\|.*类型.*\|[[:space:]]*含义[[:space:]]*\|[[:space:]]*$' >> "$TMP/g5" && bad5=$((bad5 + 1))
done
for f in products/*/09-*.md; do
  grep -q '含义.*单位.*统计周期.*维度' "$f" || { printf '%s  09 缺「含义|单位|统计周期|维度」指标表\n' "$f" >> "$TMP/g5"; bad5=$((bad5 + 1)); }
done
if [ "$bad5" -gt 0 ]; then
  bad "$bad5 处 schema 列不齐"
  sort -u "$TMP/g5" | sed 's/^/    /'
else
  ok "20 组 08/09 schema 列齐"
fi

# ---- 6 断链：md 内相对链接按所在目录解析，目标必须存在（模板/设计稿示例占位符排除）----
sec '6 断链'
node "$ROOT/scripts/check-links.mjs" || FAIL=1

# ---- 汇总 ----
printf '\n'
if [ "$FAIL" -eq 0 ]; then
  printf '\033[32m六项 gate 全绿 ✓\033[0m\n'
else
  printf '\033[31mgate 未通过，见上方 ✗ 项\033[0m\n'
  exit 1
fi
