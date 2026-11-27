---
sidebar_position: 320
title: "Milvus 原生混合搜索迁移"
---

Open WebUI 在 Milvus 2.5 及更高版本上使用原生混合搜索。来自旧版本的 Milvus 数据只会在首次启动时迁移一次。无需重新嵌入：Open WebUI 会将每个集合及其现有向量和文本复制到新集合中，Milvus 则根据存储的文本构建关键词索引。此过程可能需要数分钟或数小时，具体取决于数据大小。

:::danger 先备份
请在升级前备份 Milvus 数据，并确保 Milvus 有足够的可用磁盘空间来存放一份完整的数据副本。完整检查清单请参阅[环境变量参考中的 Milvus 警告](/reference/env-configuration#milvus)。
:::

## 预期行为 {#what-to-expect}

- 当 [`ENABLE_DB_MIGRATIONS`](/reference/env-configuration#enable_db_migrations) 开启（默认设置）时，迁移会运行。在低于 2.5 的 Milvus 上会跳过迁移，混合搜索继续按原有方式工作。Milvus 达到 2.5 后，复制会在 Open WebUI 首次启动时运行，因此同样需要在此次启动前备份并规划停机时间。
- **迁移完成之前，Open WebUI 不会处理请求。**
- 迁移开始时，日志会显示 `Migrating N Milvus collections to native hybrid search.`；完成时会显示 `Migrated N Milvus collections to native hybrid search.`。期间不会记录其他日志，因此请使用下面的[监控脚本](#monitoring-progress)跟踪进度。
- **迁移期间请勿重启 Open WebUI。**中断的运行会在下次启动时丢弃不完整的副本，并从头开始。
- 只有在所有副本都成功完成后，才会删除原始集合。如果某个副本失败，日志会显示 `Milvus migration to native hybrid search failed, all collections are kept unchanged.`，Open WebUI 将继续使用原始集合。
- 如果运行多个 Open WebUI 实例，请仅启动一个实例进行升级，并在出现 `Migrated` 日志行后再启动其他实例。
- 迁移完成后，只要在**设置 > 文档**（管理员部分）中启用**混合搜索（Hybrid Search）**，Milvus 就会自行运行混合搜索。启用**丰富混合搜索文本（Enrich Hybrid Search Text）**（或 [`ENABLE_RAG_HYBRID_SEARCH_ENRICHED_TEXTS`](/reference/env-configuration#enable_rag_hybrid_search_enriched_texts)）会继续使用 Open WebUI 自身的关键词搜索。

## 参考速度 {#reference-speeds}

| 硬件 | 数据 | 时间 |
|----------|------|------|
| 最新一代 Intel Xeon（分配 12 核）、250 GB RAM、通过 LAN 连接的高速 NVMe | 910 万个文本块 | 约 50 分钟 |
| AMD Ryzen 7 8845HS、28 GB RAM、普通 NVMe | 200 GB | 约 3 小时 |

请据此规划停机时间。只要存储和内存跟得上，迁移就受 CPU 限制：Milvus 会为每个复制的行构建向量索引、关键词索引和 BM25 统计信息。在迁移期间为 Milvus 分配更多 CPU 核心可以提高速度。

## 监控进度 {#monitoring-progress}

此脚本显示迁移进度。它可以在任何能够访问 Milvus 的计算机上运行，每分钟打印一行，并且只读取元数据，因此不会降低迁移速度。

它使用 Milvus 独立版和集群版提供的 Milvus REST API。Milvus Lite 没有 REST API，因此该脚本无法与其配合使用。

1. 将脚本保存为 `milvus-progress.sh`。
2. 如果 Milvus 需要身份验证，请将 `TOKEN` 设置为 `MILVUS_TOKEN` 的值。否则将其留空。
3. 在迁移开始前或期间启动它，因为它会在启动时统计总行数。传入你的 Milvus 地址：

```bash
bash milvus-progress.sh http://milvus-host:19530
```

```bash title="milvus-progress.sh"
#!/bin/bash
# 如果 Milvus 未启用身份验证，请将 TOKEN 留空。仅当以自定义 MILVUS_COLLECTION_PREFIX 运行 Milvus 多租户模式时，才更改 PREFIX。
TOKEN='user:password'
PREFIX='open_webui'
URL="${1:-http://localhost:19530}/v2/vectordb"

auth=()
[ -n "$TOKEN" ] && auth=(-H "Authorization: Bearer $TOKEN")
post() { curl -s -X POST "$URL/$1" -H "Content-Type: application/json" "${auth[@]}" -d "$2"; }
field() { grep -o "\"$1\":[0-9]*" | head -1 | cut -d: -f2; }
rows() { post collections/get_stats "{\"collectionName\":\"$1\"}" | field rowCount; }
names() { post collections/list '{}' | grep -o "\"${PREFIX}_[^\"]*\"" | tr -d '"'; }
percent() { echo "$1/$2 ($((100 * $1 / ($2 ? $2 : 1)))%)"; }
index_progress() {
  local indexed=0 total=0 response collection_indexed collection_total
  for name in $2; do
    response=$(post indexes/describe "{\"collectionName\":\"$name\",\"indexName\":\"$1\"}")
    collection_indexed=$(field indexedRows <<<"$response")
    collection_total=$(field totalRows <<<"$response")
    indexed=$((indexed + ${collection_indexed:-0}))
    total=$((total + ${collection_total:-0}))
  done
  percent $indexed $total
}

originals=$(names | grep -v '_bm25_staging$')
total_rows=0
for name in $originals; do total_rows=$((total_rows + $(rows "$name"))); done
echo "$(grep -c . <<<"$originals") collections, $total_rows rows"

while true; do
  staging=$(names | grep '_bm25_staging$')
  if [ -z "$staging" ]; then
    collections=$(names)
    copy="no copies running (not started yet, or finished)"
  else
    collections=$staging
    copied=0
    for name in $staging; do copied=$((copied + $(rows "$name"))); done
    copy="copies started: $(grep -c . <<<"$staging")  |  rows copied: $(percent $copied $total_rows)"
  fi
  echo "$(date +%T)  $copy  |  vector index: $(index_progress vector "$collections")  |  keyword index: $(index_progress sparse "$collections")"
  sleep 60
done
```

输出解读：

- 启动时显示 `0 collections` 表示 Milvus 拒绝了请求。请检查 `TOKEN`。
- 迁移开始前，关键词索引显示 `0/0`，因为旧集合没有该索引。
- 复制运行期间，该行会显示已复制的行数以及 Milvus 对这些行建立索引的进度。
- 复制完成后，数值会下降，该行会显示 `no copies running`。随后系统会切换到新集合，Open WebUI 日志中会出现 `Migrated` 行。
