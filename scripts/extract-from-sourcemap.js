#!/usr/bin/env node

/**
 * 从 cli.js.map 提取源码，替换项目中的 stub/占位文件
 *
 * 用法:
 *   node scripts/extract-from-sourcemap.js <sourcemap路径> [目标目录]
 *
 * 示例:
 *   node scripts/extract-from-sourcemap.js ../claude-code-2.1.88/package/cli.js.map .
 *   node scripts/extract-from-sourcemap.js /path/to/cli.js.map /path/to/claude-code-source
 */

import { readFileSync, writeFileSync, statSync, mkdirSync } from "fs";
import { join, dirname, resolve } from "path";

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error(
    "用法: node scripts/extract-from-sourcemap.js <sourcemap路径> [目标目录]"
  );
  process.exit(1);
}

const mapPath = resolve(args[0]);
const targetDir = resolve(args[1] || ".");

console.log(`Source map: ${mapPath}`);
console.log(`目标目录:   ${targetDir}`);

const map = JSON.parse(readFileSync(mapPath, "utf8"));

if (!map.sources || !map.sourcesContent) {
  console.error("无效的 source map：缺少 sources 或 sourcesContent");
  process.exit(1);
}

console.log(`Source map 共含 ${map.sources.length} 个文件`);

// 筛选 src/ 下的源文件
const srcEntries = [];
for (let i = 0; i < map.sources.length; i++) {
  const s = map.sources[i];
  if (s.startsWith("../src/")) {
    srcEntries.push({ index: i, relPath: s.replace("../", "") });
  }
}
console.log(`其中 src/ 源文件 ${srcEntries.length} 个\n`);

let created = 0;
let replaced = 0;
let skipped = 0;

for (const { index, relPath } of srcEntries) {
  const content = map.sourcesContent[index];
  if (!content) {
    skipped++;
    continue;
  }

  const targetPath = join(targetDir, relPath);
  let existing = null;
  let existingSize = 0;

  try {
    existing = readFileSync(targetPath, "utf8");
    existingSize = statSync(targetPath).size;
  } catch {
    // 文件不存在，直接创建
    mkdirSync(dirname(targetPath), { recursive: true });
    writeFileSync(targetPath, content);
    created++;
    continue;
  }

  // 内容完全相同则跳过
  if (existing === content) {
    skipped++;
    continue;
  }

  const isStub = existingSize < 200;
  const hasPlaceholder = /TODO|STUB|not implemented|placeholder/i.test(
    existing
  );
  const mapContentMuchLarger = content.length > existingSize + 100;

  if (isStub || hasPlaceholder || mapContentMuchLarger) {
    writeFileSync(targetPath, content);
    replaced++;
  } else {
    skipped++;
  }
}

console.log(`新建: ${created}`);
console.log(`替换: ${replaced}`);
console.log(`跳过: ${skipped}`);
console.log(`合计: ${created + replaced + skipped}`);
